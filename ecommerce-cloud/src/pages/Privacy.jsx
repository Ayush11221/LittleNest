function Section({ title, children }) {
  return (
    <div>
      <h2 className="font-heading text-xl text-foreground mb-2">{title}</h2>
      <div className="text-muted-foreground leading-relaxed space-y-3">{children}</div>
    </div>
  );
}

function Privacy() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <h1 className="font-heading text-3xl md:text-4xl text-foreground">Privacy Policy</h1>
      <p className="mt-3 text-muted-foreground">
        LittleNest is a college cloud-computing project built to demonstrate
        a working e-commerce application. It is not a commercial service.
      </p>

      <div className="mt-10 space-y-8">
        <Section title="What we store">
          <p>
            Account details you provide — such as your name, email, and
            shipping address — are used only to sign you in, process your
            orders, and show you your own order history. This data is
            stored in a Supabase (PostgreSQL) database.
          </p>
        </Section>

        <Section title="What stays in your browser">
          <p>
            Your shopping bag, wishlist, recently viewed items, and theme
            preference are stored locally in your browser (localStorage)
            and are never sent to our servers until you actually check out.
          </p>
        </Section>

        <Section title="Payment information">
          <p>
            We never see or store your card, UPI, or bank details. Payments
            are handled entirely by Razorpay, a third-party payment
            processor — only the payment ID and status are recorded on our
            side, to keep a record of your order.
          </p>
        </Section>

        <Section title="What we don't do">
          <p>
            We do not sell or share your information with third parties for
            marketing purposes, and we do not use advertising or tracking
            cookies.
          </p>
        </Section>

        <Section title="Your data">
          <p>
            You can request the account details we hold, or ask us to
            delete your account and associated data, by reaching out via
            the Contact page.
          </p>
        </Section>

        <Section title="Questions">
          <p>Questions about this project can be directed to its contributors.</p>
        </Section>
      </div>
    </div>
  );
}

export default Privacy;
