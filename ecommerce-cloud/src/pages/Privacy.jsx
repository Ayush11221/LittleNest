function Privacy() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <h1 className="font-heading text-3xl md:text-4xl text-foreground">Privacy</h1>

      <div className="mt-8 space-y-6 text-muted-foreground leading-relaxed">
        <p>
          LittleNest is a college cloud-computing project built to
          demonstrate a working e-commerce application. It is not a
          commercial service.
        </p>

        <div>
          <h2 className="font-heading text-xl text-foreground mb-2">What we store</h2>
          <p>
            Account details you provide — such as your name and email — are
            used only to sign you in and show you your own orders. Your
            shopping bag, wishlist, and theme preference are stored locally
            in your browser and are never sent anywhere else.
          </p>
        </div>

        <div>
          <h2 className="font-heading text-xl text-foreground mb-2">What we don't do</h2>
          <p>
            We do not sell or share your information with third parties, and
            we do not use advertising or tracking cookies.
          </p>
        </div>

        <p>Questions about this project can be directed to its contributors.</p>
      </div>
    </div>
  );
}

export default Privacy;
