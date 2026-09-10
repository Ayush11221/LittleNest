import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient.js';

const AuthContext = createContext(undefined);

/** Matches Supabase's default minimum. Shared by signup and password reset. */
export const MIN_PASSWORD_LENGTH = 6;

/**
 * Turns a Supabase auth error into copy we're willing to show a shopper.
 * Raw messages are logged, never rendered.
 */
export function getAuthErrorMessage(error) {
  const message = error?.message || '';

  if (/invalid login credentials/i.test(message)) {
    return "That email or password doesn't look right.";
  }
  if (/new password should be different/i.test(message)) {
    return 'Please choose a password different from your current one.';
  }
  if (/auth session missing|session_not_found/i.test(message)) {
    return 'Your reset link has expired. Please request a new one.';
  }
  if (/email not confirmed/i.test(message)) {
    return 'Please confirm your email first — check your inbox for the link.';
  }
  if (/already registered/i.test(message)) {
    return 'An account with that email already exists. Try logging in instead.';
  }
  if (/password should be at least/i.test(message)) {
    return 'Please use a password of at least 6 characters.';
  }
  if (/rate limit|too many requests/i.test(message)) {
    return 'Too many attempts. Please wait a moment and try again.';
  }
  if (/database error/i.test(message)) {
    return "We couldn't finish creating your account. Please try again.";
  }
  return 'Something went wrong. Please try again.';
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data?.session ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  /**
   * Creates the account. The profiles row and the user's cart row are
   * created by database triggers, so there is nothing to insert here.
   *
   * Email confirmation is enabled on this project, so a successful signup
   * normally returns no session. `needsConfirmation` tells the caller which
   * of the two outcomes happened, so this keeps working if confirmation is
   * ever switched off.
   */
  const signUp = async (email, password, name) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });

    if (error) {
      console.error('Signup failed:', error.message);
      return { error, needsConfirmation: false };
    }

    return { error: null, needsConfirmation: !data.session };
  };

  const signIn = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      console.error('Login failed:', error.message);
    }

    return { error };
  };

  /**
   * Sends a password recovery email.
   *
   * Supabase does not error for an unknown address, and callers must show the
   * same message either way, so this never reveals whether an account exists.
   * Rate-limit errors are still surfaced — that is about the requester's own
   * behaviour, not about who has an account.
   */
  const requestPasswordReset = async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      console.error('Password reset request failed:', error.message);
    }

    return { error };
  };

  /** Sets a new password for the session opened by the recovery link. */
  const updatePassword = async (password) => {
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      console.error('Password update failed:', error.message);
    }

    return { error };
  };

  /** Signs out. The guest cart in localStorage is deliberately left alone. */
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Logout failed:', error.message);
    }

    return { error };
  };

  const user = session?.user ?? null;

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        loading,
        signUp,
        signIn,
        signOut,
        requestPasswordReset,
        updatePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
