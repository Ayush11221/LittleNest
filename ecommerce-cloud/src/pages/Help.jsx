import { useEffect } from 'react';

/* Scrolls to an in-page section when the URL includes a hash, e.g. /help#returns. */
function useScrollToHash() {
  useEffect(() => {
    if (!window.location.hash) return;
    const el = document.getElementById(window.location.hash.slice(1));
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);
}

function HelpSection({ id, title, children }) {
  return (
    <section id={id} className="py-8 border-b border-border last:border-b-0">
      <h2 className="font-heading text-xl text-foreground">{title}</h2>
      <p className="mt-3 text-muted-foreground leading-relaxed">{children}</p>
    </section>
  );
}

function Help() {
  useScrollToHash();

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <h1 className="font-heading text-3xl md:text-4xl text-foreground">Help &amp; Support</h1>
      <p className="mt-3 text-muted-foreground">
        A few common questions, answered simply.
      </p>

      <div className="mt-10">
        <HelpSection id="shipping" title="Shipping">
          We aim to get every order packed and on its way as quickly and
          carefully as possible. Delivery times vary by location, and
          estimated shipping is shown at checkout before you place an order.
        </HelpSection>

        <HelpSection id="returns" title="Returns">
          Simple and transparent returns within 15 days of delivery. If
          something isn't quite right, we want to make it easy to sort out.
        </HelpSection>

        <HelpSection id="contact" title="Contact">
          LittleNest is a college cloud-computing project built to
          demonstrate a working e-commerce application, rather than a live
          store with a support team. Questions about the project itself are
          best directed to the project's contributors.
        </HelpSection>
      </div>
    </div>
  );
}

export default Help;
