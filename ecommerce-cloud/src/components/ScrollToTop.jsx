import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * React Router doesn't reset scroll position on navigation — without this,
 * clicking a link while scrolled down leaves the next page scrolled down
 * too (sometimes landing right on the footer).
 *
 * Browsers also try to restore the previous scroll position on a hard
 * reload. Right after reload the page is still short (loading skeletons,
 * before Supabase data arrives), so that restore gets clamped to the
 * bottom of the page — landing on the footer — and never readjusts once
 * the real content grows the page back out. Disabling native scroll
 * restoration hands that fully to the effect below instead.
 */
if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default ScrollToTop;
