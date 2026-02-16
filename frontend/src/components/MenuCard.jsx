import React from 'react';
import { Plus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const MenuCard = ({ item }) => {
    const { addToCart } = useCart();

    const handleAddToCart = () => {
        addToCart(item);
        toast.success(`Added ${item.name} to cart!`);
    };

    const getCategoryIcon = (category) => {
        if (!category) return null;
        const lowerCat = category.toLowerCase();
        if (lowerCat.includes('non-veg') || lowerCat.includes('non veg')) {
            return (
                <div className="w-5 h-5 border-2 border-red-600 flex items-center justify-center p-0.5" title="Non-Veg">
                    <div className="w-2.5 h-2.5 bg-red-600 rounded-full"></div>
                </div>
            );
        } else if (lowerCat.includes('veg')) {
            return (
                <div className="w-5 h-5 border-2 border-green-600 flex items-center justify-center p-0.5" title="Veg">
                    <div className="w-2.5 h-2.5 bg-green-600 rounded-full"></div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition duration-300 transform hover:-translate-y-1">
            <div className="h-48 overflow-hidden relative">
                <img
                    src={item.image_url.startsWith('http') ? item.image_url : `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}${item.image_url}`}
                    alt={item.name}
                    className="w-full h-full object-cover"
                />
                {!item.available && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="text-white font-bold text-lg border-2 border-white px-4 py-1 rounded">SOLD OUT</span>
                    </div>
                )}
            </div>

            <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                        {getCategoryIcon(item.category_1)}
                        <h3 className="text-xl font-bold text-gray-800">{item.name}</h3>
                    </div>
                    <span className="bg-orange-100 text-orange-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                        ₹{item.price}
                    </span>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.description}</p>

                <button
                    onClick={handleAddToCart}
                    disabled={!item.available}
                    className={`w-full flex items-center justify-center space-x-2 py-2 px-4 rounded-lg transition ${item.available
                        ? 'bg-orange-500 hover:bg-orange-600 text-white'
                        : 'bg-gray-300 cursor-not-allowed text-gray-500'
                        }`}
                >
                    <Plus size={18} />
                    <span>{item.available ? 'Add to Cart' : 'Unavailable'}</span>
                </button>
            </div>
        </div>
    );
};

export default MenuCard;
