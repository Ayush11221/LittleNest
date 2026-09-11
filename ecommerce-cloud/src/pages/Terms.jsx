function Section({ title, children }) {
  return (
    <div>
      <h2 className="font-heading text-xl text-foreground mb-2">{title}</h2>
      <div className="text-muted-foreground leading-relaxed space-y-3">{children}</div>
    </div>
  );
}

function Terms() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <h1 className="font-heading text-3xl md:text-4xl text-foreground">Terms of Use</h1>
      <p className="mt-3 text-muted-foreground">
        LittleNest is a demonstration e-commerce application built for a
        college cloud-computing project. It is not a registered commercial
        business.
      </p>

      <div className="mt-10 space-y-8">
        <Section title="Use of this site">
          <p>
            This site is provided as-is, for demonstration and educational
            purposes. Products, descriptions, and stock levels are for
            illustration and may not reflect a real, ongoing inventory.
          </p>
        </Section>

        <Section title="Orders and pricing">
          <p>
            Prices are shown in Indian Rupees (₹) and may change without
            notice. Placing an order does not guarantee stock availability —
            orders may be cancelled if an item turns out to be unavailable.
          </p>
        </Section>

        <Section title="Payments">
          <p>
            Payments are processed by Razorpay. Card, UPI, and wallet
            details are entered directly into Razorpay's own checkout and
            are never seen or stored by this site. Depending on how this
            project is configured at any given time, payments may be
            processed in Razorpay's test mode (no real money moves) or live
            mode (real transactions occur) — check with whoever is running
            this instance if you're unsure which applies.
          </p>
        </Section>

        <Section title="Accounts">
          <p>
            You're responsible for keeping your account password
            confidential. Let us know if you believe your account has been
            accessed without your permission.
          </p>
        </Section>

        <Section title="Intellectual property">
          <p>
            The site's design, layout, and written content are original
            work created for this project. Product photography is sourced
            from Unsplash under its free license.
          </p>
        </Section>

        <Section title="Limitation of liability">
          <p>
            As a student project, this site is provided without warranty of
            any kind. It should not be relied upon as a production system
            for real commercial transactions.
          </p>
        </Section>

        <Section title="Changes to these terms">
          <p>
            These terms may be updated as the project evolves. Continued use
            of the site after a change means you accept the updated terms.
          </p>
        </Section>
      </div>
    </div>
  );
}

export default Terms;
