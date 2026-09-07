import { Store } from 'lucide-react';

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <Store className="h-5 w-5 text-indigo-400" />
            <span className="text-white font-semibold">CloudStore</span>
          </div>

          {/* Copyright */}
          <p className="text-sm">
            &copy; {new Date().getFullYear()} CloudStore. All rights reserved.
          </p>

          {/* Links */}
          <div className="flex gap-6 text-sm">
            <span className="hover:text-white cursor-pointer transition-colors">
              Privacy
            </span>
            <span className="hover:text-white cursor-pointer transition-colors">
              Terms
            </span>
            <span className="hover:text-white cursor-pointer transition-colors">
              Contact
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
