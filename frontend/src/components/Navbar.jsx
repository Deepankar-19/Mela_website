import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Navbar = () => {
    const { getCartCount, setIsCartOpen } = useCart();
    const cartCount = getCartCount();

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold text-orange-600 tracking-tighter hover:text-orange-700 transition">
                    HotChicksOnly
                </Link>
                <div className="flex items-center space-x-6">
                    <Link to="/" className="text-gray-600 hover:text-orange-600 hidden md:block font-medium">Home</Link>
                    <Link to="/menu" className="text-gray-600 hover:text-orange-600 font-medium">Menu</Link>

                    <button
                        onClick={() => setIsCartOpen(true)}
                        className="relative p-2 text-gray-600 hover:text-orange-600 transition"
                        aria-label="Cart"
                    >
                        <ShoppingCart className="w-6 h-6" />

                        {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full animate-pulse">
                                {cartCount}
                            </span>
                        )}
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
