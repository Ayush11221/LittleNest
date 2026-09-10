import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Button } from '../components/ui/button.jsx';
import { useAuth, getAuthErrorMessage } from '../context/AuthContext.jsx';

function ForgotPassword() {
  const { user, loading, requestPasswordReset } = useAuth();

  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [requested, setRequested] = useState(false);

  if (loading) return null;
  if (user) return <Navigate to="/" replace />;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setErrorMessage('Please enter your email.');
      return;
    }

    setSubmitting(true);
    const { error } = await requestPasswordReset(trimmedEmail);
    setSubmitting(false);

    // Rate limiting is worth telling them about — nothing arriving would
    // otherwise look like a broken link.
    if (error && /rate limit|only request this after|too many/i.test(error.message || '')) {
      setErrorMessage(getAuthErrorMessage(error));
      return;
    }

    // Every other outcome shows the same confirmation, so this never reveals
    // whether an account exists for the address.
    setRequested(true);
  };

  if (requested) {
    return (
      <div className="max-w-md mx-auto px-4 sm:px-6 py-16 md:py-24">
        <h1 className="font-heading text-3xl md:text-4xl text-foreground">
          Check your inbox.
        </h1>
        <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
          If an account exists for{' '}
          <span className="text-foreground">{email.trim()}</span>, we've sent a link to
          reset your password. The link is valid for a limited time.
        </p>
        <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
          If nothing arrives in a few minutes, check your spam folder.
        </p>

        <Button asChild size="lg" className="mt-8 w-full">
          <Link to="/login">Back to log in</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-16 md:py-24">
      <h1 className="font-heading text-3xl md:text-4xl text-foreground">
        Forgot your password?
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Enter your email and we'll send you a link to set a new one.
      </p>

      <form onSubmit={handleSubmit} className="mt-10 space-y-5" noValidate>
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

        {errorMessage && (
          <p role="alert" className="text-sm text-destructive">
            {errorMessage}
          </p>
        )}

        <Button type="submit" size="lg" className="w-full" disabled={submitting}>
          {submitting ? 'Sending…' : 'Send reset link'}
        </Button>
      </form>

      <p className="mt-8 text-sm text-muted-foreground">
        Remembered it?{' '}
        <Link to="/login" className="text-primary hover:text-primary/80 transition-colors">
          Back to log in
        </Link>
      </p>
    </div>
  );
}

export default ForgotPassword;
