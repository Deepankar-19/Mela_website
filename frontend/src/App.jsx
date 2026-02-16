import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { CartProvider } from './context/CartContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartModal from './components/CartModal';

import Home from './pages/Home';
import Menu from './pages/Menu';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Router>
      <CartProvider>
        <div className="flex flex-col min-h-screen bg-gray-50">
          <Navbar />
          <CartModal />

          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
          </main>

          <Footer />
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#333',
                color: '#fff',
                borderRadius: '8px',
              },
            }}
          />
        </div>
      </CartProvider>
    </Router>
  );
}

export default App;