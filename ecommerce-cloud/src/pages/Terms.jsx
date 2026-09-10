function Terms() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <h1 className="font-heading text-3xl md:text-4xl text-foreground">Terms of Use</h1>

      <div className="mt-8 space-y-6 text-muted-foreground leading-relaxed">
        <p>
          LittleNest is a demonstration e-commerce application built for a
          college cloud-computing project. It is not a real commercial
          store.
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Products, prices, and stock shown here are for demonstration purposes.</li>
          <li>Payment on this site is simulated — no real payment is processed.</li>
          <li>Content and design are original work created for this project.</li>
        </ul>
        <p>By using this site, you understand it exists for demonstration and educational purposes.</p>
      </div>
    </div>
  );
}

export default Terms;
