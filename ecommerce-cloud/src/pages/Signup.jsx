import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button.jsx';
import {
  useAuth,
  getAuthErrorMessage,
  MIN_PASSWORD_LENGTH,
} from '../context/AuthContext.jsx';

function Signup() {
  const { user, loading, signUp } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [confirmationSentTo, setConfirmationSentTo] = useState(null);

  if (loading) return null;
  if (user) return <Navigate to="/" replace />;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      setErrorMessage('Please enter your name.');
      return;
    }
    if (!trimmedEmail) {
      setErrorMessage('Please enter your email.');
      return;
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
      setErrorMessage(`Please use a password of at least ${MIN_PASSWORD_LENGTH} characters.`);
      return;
    }

    setSubmitting(true);
    const { error, needsConfirmation } = await signUp(trimmedEmail, password, trimmedName);
    setSubmitting(false);

    if (error) {
      setErrorMessage(getAuthErrorMessage(error));
      return;
    }

    // Confirmation is enabled on this project, so this is the usual path.
    // The same screen shows whether or not the email was already registered —
    // telling them apart would let anyone probe which emails have accounts.
    if (needsConfirmation) {
      setConfirmationSentTo(trimmedEmail);
      return;
    }

    navigate('/', { replace: true });
  };

  if (confirmationSentTo) {
    return (
      <div className="max-w-md mx-auto px-4 sm:px-6 py-16 md:py-24">
        <h1 className="font-heading text-3xl md:text-4xl text-foreground">
          Check your inbox.
        </h1>
        <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
          We've sent a confirmation link to{' '}
          <span className="text-foreground">{confirmationSentTo}</span>. Please confirm
          your account, then log in.
        </p>
        <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
          If nothing arrives in a few minutes, check your spam folder — or you may
          already have an account with this email.
        </p>

        <Button asChild size="lg" className="mt-8 w-full">
          <Link to="/login">Go to log in</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-16 md:py-24">
      <h1 className="font-heading text-3xl md:text-4xl text-foreground">
        Create your account
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        For faster checkout and a place to keep your orders.
      </p>

      <form onSubmit={handleSubmit} className="mt-10 space-y-5" noValidate>
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
            Name
          </label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 transition-colors"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 transition-colors"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-foreground mb-2"
          >
            Password
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

        {errorMessage && (
          <p role="alert" className="text-sm text-destructive">
            {errorMessage}
          </p>
        )}

        <Button type="submit" size="lg" className="w-full" disabled={submitting}>
          {submitting ? 'Creating account…' : 'Create account'}
        </Button>
      </form>

      <p className="mt-8 text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link to="/login" className="text-primary hover:text-primary/80 transition-colors">
          Log in
        </Link>
      </p>
    </div>
  );
}

export default Signup;
