import { useState } from 'react';
import { Button } from '../components/ui/button.jsx';

const inputClass =
  'w-full h-10 px-3 rounded-md border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 transition-colors';

function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const update = (field) => (event) =>
    setForm((prev) => ({ ...prev, [field]: event.target.value }));

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <h1 className="font-heading text-3xl md:text-4xl text-foreground">Contact Us</h1>
      <p className="mt-3 text-muted-foreground leading-relaxed">
        Questions about an order, a return, or anything else — send us a
        note and we'll get back to you.
      </p>

      <p className="mt-4 text-sm text-muted-foreground border border-border rounded-lg px-4 py-3">
        LittleNest is a college cloud-computing project built to demonstrate
        a working e-commerce application, rather than a live store with a
        staffed support line. This form doesn't send anywhere — it's here to
        show what a real contact flow would look like.
      </p>

      {submitted ? (
        <div className="mt-10 border border-border rounded-2xl p-6 text-center">
          <h2 className="font-heading text-xl text-foreground">Thanks for reaching out</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            We'll get back to you as soon as we can.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-10 space-y-5" noValidate>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
              Name
            </label>
            <input
              id="name"
              required
              value={form.name}
              onChange={update('name')}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={form.email}
              onChange={update('email')}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
              Message
            </label>
            <textarea
              id="message"
              required
              rows={5}
              value={form.message}
              onChange={update('message')}
              className={`${inputClass} h-auto py-2 resize-none`}
            />
          </div>

          <Button type="submit" size="lg" className="w-full">
            Send Message
          </Button>
        </form>
      )}
    </div>
  );
}

export default Contact;
