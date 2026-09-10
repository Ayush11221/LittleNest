import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          {/* Phase 3: <Route path="/shop" element={<Products />} /> */}
          {/* Phase 3: <Route path="/products/:slug" element={<ProductDetails />} /> */}
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
