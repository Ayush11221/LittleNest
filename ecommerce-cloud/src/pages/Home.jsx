import { Link } from 'react-router-dom';
import { ShoppingBag, Truck, Shield, ArrowRight } from 'lucide-react';

function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
              Shop the Future with{' '}
              <span className="text-indigo-200">CloudStore</span>
            </h1>
            <p className="text-lg md:text-xl text-indigo-100 mb-8">
              Discover quality products at great prices. Fast delivery,
              secure payments, and a seamless shopping experience — all
              powered by the cloud.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-white text-indigo-700 font-semibold px-6 py-3 rounded-lg hover:bg-indigo-50 transition-colors"
            >
              Browse Products
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-indigo-100 text-indigo-600 mb-4">
                <ShoppingBag className="h-7 w-7" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Wide Selection</h3>
              <p className="text-gray-600">
                Browse hundreds of products across multiple categories.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-indigo-100 text-indigo-600 mb-4">
                <Truck className="h-7 w-7" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Fast Delivery</h3>
              <p className="text-gray-600">
                Get your orders delivered quickly and reliably.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-indigo-100 text-indigo-600 mb-4">
                <Shield className="h-7 w-7" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Secure Payments</h3>
              <p className="text-gray-600">
                Shop with confidence using our secure payment options.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
