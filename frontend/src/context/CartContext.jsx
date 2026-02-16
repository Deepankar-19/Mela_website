import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState({});
    const [isCartOpen, setIsCartOpen] = useState(false);

    // Load cart from local storage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            setCart(JSON.parse(savedCart));
        }
    }, []);

    // Save cart to local storage whenever it changes
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (item) => {
        setCart((prevCart) => {
            const currentQty = prevCart[item.id] ? prevCart[item.id].quantity : 0;
            return {
                ...prevCart,
                [item.id]: { ...item, quantity: currentQty + 1 },
            };
        });
    };

    const removeFromCart = (itemId) => {
        setCart((prevCart) => {
            const newCart = { ...prevCart };
            delete newCart[itemId];
            return newCart;
        });
    };

    const updateQuantity = (itemId, quantity) => {
        setCart((prevCart) => {
            if (quantity <= 0) {
                const newCart = { ...prevCart };
                delete newCart[itemId];
                return newCart;
            }
            return {
                ...prevCart,
                [itemId]: { ...prevCart[itemId], quantity },
            };
        });
    };

    const clearCart = () => {
        setCart({});
    };

    const getCartTotal = () => {
        return Object.values(cart).reduce((total, item) => total + item.price * item.quantity, 0);
    };

    const getCartCount = () => {
        return Object.values(cart).reduce((count, item) => count + item.quantity, 0);
    };

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                getCartTotal,
                getCartCount,
                isCartOpen,
                setIsCartOpen,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};
