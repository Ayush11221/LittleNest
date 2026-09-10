import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button.jsx';
import {
  useAuth,
  getAuthErrorMessage,
  MIN_PASSWORD_LENGTH,
} from '../context/AuthContext.jsx';

/**
 * Reached from the recovery link in the password reset email.
 *
 * Supabase turns that link into a real (temporary) session, so unlike Login
 * and Signup this page must NOT redirect authenticated users away — being
 * signed in is exactly the expected state here.
 */
function ResetPassword() {
  const { user, loading, updatePassword, signOut } = useAuth();

  // Supabase reports expired or already-used links via the URL fragment.
  const [linkError] = useState(() => {
    const hash = window.location.hash;
    if (!hash || !hash.includes('error')) return null;
    const params = new URLSearchParams(hash.replace(/^#/, ''));
    return params.get('error_description') || params.get('error');
  });

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');

    if (password.length < MIN_PASSWORD_LENGTH) {
      setErrorMessage(
        `Please use a password of at least ${MIN_PASSWORD_LENGTH} characters.`
      );
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("Those passwords don't match.");
      return;
    }

    setSubmitting(true);
    const { error } = await updatePassword(password);

    if (error) {
      setSubmitting(false);
      setErrorMessage(getAuthErrorMessage(error));
      return;
    }

    // End the recovery session so the new password has to be used to get back in.
    await signOut();
    setSubmitting(false);
    setDone(true);
  };

  if (loading) return null;

  // Checked before the session test below, because signing out on success
  // clears `user`.
  if (done) {
    return (
      <div className="max-w-md mx-auto px-4 sm:px-6 py-16 md:py-24">
        <h1 className="font-heading text-3xl md:text-4xl text-foreground">
          Password updated.
        </h1>
        <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
          You can now log in with your new password.
        </p>
        <Button asChild size="lg" className="mt-8 w-full">
          <Link to="/login">Go to log in</Link>
        </Button>
      </div>
    );
  }

  if (linkError || !user) {
    return (
      <div className="max-w-md mx-auto px-4 sm:px-6 py-16 md:py-24">
        <h1 className="font-heading text-3xl md:text-4xl text-foreground">
          This link has expired.
        </h1>
        <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
          Password reset links can only be used once, and they don't stay valid for
          long. Request a fresh one and we'll send it straight over.
        </p>
        <Button asChild size="lg" className="mt-8 w-full">
          <Link to="/forgot-password">Request a new link</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-16 md:py-24">
      <h1 className="font-heading text-3xl md:text-4xl text-foreground">
        Set a new password
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Choose something you'll remember for {user.email}.
      </p>

      <form onSubmit={handleSubmit} className="mt-10 space-y-5" noValidate>
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-foreground mb-2"
          >
            New password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 transition-colors"
          />
          <p className="mt-2 text-xs text-muted-foreground">
            At least {MIN_PASSWORD_LENGTH} characters.
          </p>
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-foreground mb-2"
          >
            Confirm new password
          </label>
          <input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 transition-colors"
          />
        </div>

        {errorMessage && (
          <p role="alert" className="text-sm text-destructive">
            {errorMessage}
          </p>
        )}

        <Button type="submit" size="lg" className="w-full" disabled={submitting}>
          {submitting ? 'Updating…' : 'Update password'}
        </Button>
      </form>
    </div>
  );
}

export default ResetPassword;
