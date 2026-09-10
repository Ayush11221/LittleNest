import { Link } from 'react-router-dom';

function Section({ title, children }) {
  return (
    <div>
      <h2 className="font-heading text-xl text-foreground mb-2">{title}</h2>
      <div className="text-muted-foreground leading-relaxed space-y-3">{children}</div>
    </div>
  );
}

function ShippingPolicy() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <h1 className="font-heading text-3xl md:text-4xl text-foreground">Shipping Policy</h1>
      <p className="mt-3 text-muted-foreground">
        Everything you need to know about how your order gets to you.
      </p>

      <div className="mt-10 space-y-8">
        <Section title="Processing time">
          <p>
            Orders are packed and handed off to our courier partner within
            1–2 business days of payment confirmation. You'll see your order
            number on the confirmation screen right after checkout — keep it
            handy for any follow-up.
          </p>
        </Section>

        <Section title="Delivery estimates">
          <p>Once shipped, typical delivery times are:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Metro cities: 3–5 business days</li>
            <li>Other locations: 5–7 business days</li>
          </ul>
          <p>
            These are estimates, not guarantees — remote areas, weather, and
            courier delays can occasionally push delivery a little further
            out.
          </p>
        </Section>

        <Section title="Shipping charges">
          <p>
            Free shipping on all orders of ₹1,999 or more. Orders below that
            are charged a flat ₹100 shipping fee, calculated automatically
            at checkout.
          </p>
        </Section>

        <Section title="Order tracking">
          <p>
            We currently don't offer live courier tracking or email
            notifications. If you need an update on your order, reach out
            with your order number and we'll check on it for you.
          </p>
        </Section>

        <Section title="Delivery issues">
          <p>
            If your order hasn't arrived within the estimated window, or
            arrives damaged, get in touch via our{' '}
            <Link to="/contact" className="text-primary hover:text-primary/80 transition-colors">
              Contact page
            </Link>{' '}
            with your order number and we'll help sort it out.
          </p>
        </Section>
      </div>
    </div>
  );
}

export default ShippingPolicy;
