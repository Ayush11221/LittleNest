import { Facebook, Twitter, Mail, Link2 } from 'lucide-react';
import { useToast } from '../context/ToastContext.jsx';

/** Standard share-intent links for the current page — real outbound URLs, no tracking added. */
function ShareRow({ title }) {
  const { showToast } = useToast();
  const url = typeof window !== 'undefined' ? window.location.href : '';
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      showToast('Link copied');
    } catch {
      showToast('Could not copy link', 'error');
    }
  };

  const links = [
    {
      label: 'Share on Facebook',
      icon: Facebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      label: 'Share on X',
      icon: Twitter,
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    },
    {
      label: 'Share by email',
      icon: Mail,
      href: `mailto:?subject=${encodedTitle}&body=${encodedUrl}`,
    },
  ];

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground">Share</span>
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={link.label}
          className="p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <link.icon className="h-3.5 w-3.5" />
        </a>
      ))}
      <button
        type="button"
        onClick={handleCopyLink}
        aria-label="Copy link"
        className="p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
      >
        <Link2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

export default ShareRow;
