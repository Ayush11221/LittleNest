import { Link } from 'react-router-dom';

function Section({ title, children }) {
  return (
    <div>
      <h2 className="font-heading text-xl text-foreground mb-2">{title}</h2>
      <div className="text-muted-foreground leading-relaxed space-y-3">{children}</div>
    </div>
  );
}

function ReturnsPolicy() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <h1 className="font-heading text-3xl md:text-4xl text-foreground">Returns &amp; Refunds</h1>
      <p className="mt-3 text-muted-foreground">
        Simple, transparent returns — because sizing a growing baby is
        genuinely hard to get right on the first try.
      </p>

      <div className="mt-10 space-y-8">
        <Section title="Return window">
          <p>
            You can return most items within 15 days of delivery, for a
            refund or a size/color exchange.
          </p>
        </Section>

        <Section title="Condition for return">
          <p>To be eligible, items must be:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Unworn, unwashed, and undamaged</li>
            <li>In their original packaging, with tags still attached</li>
            <li>Accompanied by the order number or receipt</li>
          </ul>
        </Section>

        <Section title="Non-returnable items">
          <p>
            Items marked "Final Sale" at the time of purchase, and any item
            that shows signs of wear or washing, can't be accepted for
            return.
          </p>
        </Section>

        <Section title="How to start a return">
          <p>
            Contact us from the{' '}
            <Link to="/contact" className="text-primary hover:text-primary/80 transition-colors">
              Contact page
            </Link>{' '}
            with your order number and which item(s) you'd like to return.
            We'll confirm the pickup or drop-off details from there.
          </p>
        </Section>

        <Section title="Refunds">
          <p>
            Once we've received and inspected the returned item, refunds are
            issued to your original payment method via Razorpay, typically
            within 5–7 business days. Shipping charges (if any were paid)
            are non-refundable.
          </p>
        </Section>

        <Section title="Exchanges">
          <p>
            Need a different size instead of a refund? Mention that when you
            contact us — we'll process it as an exchange once the original
            item is received, subject to stock availability.
          </p>
        </Section>

        <Section title="Damaged or incorrect items">
          <p>
            If an item arrives damaged or isn't what you ordered, let us
            know within 48 hours of delivery with a photo — those are on us,
            no questions asked.
          </p>
        </Section>
      </div>
    </div>
  );
}

export default ReturnsPolicy;
