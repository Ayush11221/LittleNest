import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button.jsx';

function NotFound() {
  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-24 text-center">
      <h1 className="font-heading text-3xl md:text-4xl text-foreground">
        We couldn't find that page.
      </h1>
      <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
        The link might be broken, or the page may have moved.
      </p>
      <Button asChild size="lg" className="mt-8">
        <Link to="/">Back to home</Link>
      </Button>
    </div>
  );
}

export default NotFound;
