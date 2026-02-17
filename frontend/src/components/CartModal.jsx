import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, Copy, CheckCircle, Upload, Image as ImageIcon, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { createOrder, submitUTR, uploadPaymentScreenshot } from '../services/api';
import toast from 'react-hot-toast';
import scanner from '../assets/af97f9f3-a8df-4c86-a2c7-c445ff44cbab.jpg';

const CartModal = () => {
    const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
    const [step, setStep] = useState('cart'); // cart, details, payment, success
    const [formData, setFormData] = useState({ name: '', phone: '' });
    const [orderResponse, setOrderResponse] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('utr'); // 'utr' or 'screenshot'
    const [utrNumber, setUtrNumber] = useState('');
    const [screenshotFile, setScreenshotFile] = useState(null);
    const [loading, setLoading] = useState(false);

    if (!isCartOpen) return null;

    const handleClose = () => {
        setIsCartOpen(false);
        // Reset state only if we're not inthe middle of a flow we want to preserve? 
        // Actually, always reset if we completed, or just close.
        if (step === 'success') {
            setStep('cart');
            setOrderResponse(null);
            setUtrNumber('');
            setScreenshotFile(null);
            setFormData({ name: '', phone: '' });
        }
    };

    const handleCheckout = () => {
        if (Object.keys(cart).length === 0) {
            toast.error('Your cart is empty');
            return;
        }
        setStep('details');
    };

    const handleDetailsSubmit = (e) => {
        e.preventDefault();

        // Strict Phone Validation
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(formData.phone)) {
            toast.error('Please enter a valid 10-digit phone number.');
            return;
        }

        setStep('payment');
    };

    const handlePaymentAndOrder = async (e) => {
        e.preventDefault();

        if (paymentMethod === 'utr' && !utrNumber) {
            toast.error('Please enter the UTR number.');
            return;
        }
        if (paymentMethod === 'screenshot' && !screenshotFile) {
            toast.error('Please upload a payment screenshot.');
            return;
        }

        setLoading(true);
        try {
            // 1. Create Order
            const items = {};
            Object.values(cart).forEach(item => {
                items[item.id] = item.quantity;
            });

            const orderData = await createOrder({
                name: formData.name,
                phone: formData.phone,
                items: items
            });

            // 2. Submit Payment Details
            if (paymentMethod === 'utr') {
                await submitUTR({
                    token_number: orderData.token_number,
                    utr_number: utrNumber
                });
            } else {
                await uploadPaymentScreenshot(orderData.token_number, screenshotFile);
            }

            setOrderResponse(orderData);
            setStep('success');
            clearCart();
            toast.success('Order placed successfully!');

        } catch (error) {
            toast.error('Failed to place order. Please try again.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        toast.success('Copied to clipboard');
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setScreenshotFile(file);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={handleClose}
            />

            {/* Sidebar */}
            <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-in">
                <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                    <h2 className="text-xl font-bold text-gray-800">
                        {step === 'cart' && 'Your Cart'}
                        {step === 'details' && 'Enter Details'}
                        {step === 'payment' && 'Make Payment'}
                        {step === 'success' && 'Order Placed'}
                    </h2>
                    <button onClick={handleClose} className="p-2 hover:bg-gray-200 rounded-full transition">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                    {step === 'cart' && (
                        <>
                            {Object.values(cart).length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                                    <ShoppingCart />
                                    <p className="mt-4">Your cart is empty</p>
                                    <button
                                        onClick={handleClose}
                                        className="mt-4 text-orange-600 font-semibold hover:underline"
                                    >
                                        Start Ordering
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {Object.values(cart).map((item) => (
                                        <div key={item.id} className="flex gap-4 border p-3 rounded-lg">
                                            <img src={item.image_url} alt={item.name} className="w-20 h-20 object-cover rounded-md" />
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    {(() => {
                                                        const category = item.category_1 || '';
                                                        const lowerCat = category.toLowerCase();
                                                        if (lowerCat.includes('non-veg') || lowerCat.includes('non veg')) {
                                                            return (
                                                                <div className="w-4 h-4 border-2 border-red-600 flex items-center justify-center p-0.5 shrink-0" title="Non-Veg">
                                                                    <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                                                                </div>
                                                            );
                                                        } else if (lowerCat.includes('veg')) {
                                                            return (
                                                                <div className="w-4 h-4 border-2 border-green-600 flex items-center justify-center p-0.5 shrink-0" title="Veg">
                                                                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                                                                </div>
                                                            );
                                                        }
                                                        return null;
                                                    })()}
                                                    <h4 className="font-semibold">{item.name}</h4>
                                                </div>
                                                <p className="text-sm text-gray-500">₹{item.price}</p>
                                                <div className="flex items-center gap-3 mt-2">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="p-1 bg-gray-100 rounded hover:bg-gray-200"
                                                    >
                                                        <Minus size={14} />
                                                    </button>
                                                    <span className="font-medium text-sm w-4 text-center">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="p-1 bg-gray-100 rounded hover:bg-gray-200"
                                                    >
                                                        <Plus size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => removeFromCart(item.id)}
                                                        className="ml-auto text-red-500 hover:text-red-700 p-1"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}

                    {step === 'details' && (
                        <form id="details-form" onSubmit={handleDetailsSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input
                                    required
                                    type="text"
                                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="John Doe"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                <input
                                    required
                                    type="tel"
                                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="9876543210"
                                    maxLength={10}
                                />
                                <p className="text-xs text-gray-500 mt-1">Must be exactly 10 digits.</p>
                            </div>
                        </form>
                    )}

                    {step === 'payment' && (
                        <div className="space-y-6">
                            {/* QR Code Section */}
                            <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-xl border border-gray-200">
                                <p className="text-2xl font-bold text-gray-800 mb-2">Total to Pay: ₹{getCartTotal()}</p>
                                <div className="bg-white p-2 rounded-lg shadow-sm border mb-4">
                                    <img src={scanner} alt="Payment QR Code" className="w-48 h-48 object-contain" />
                                </div>
                                <p className="text-sm text-grey-500 mb-2">Scan & Pay via any UPI App</p>

                                {/* Static UPI ID Display if needed, or omit if only QR is used */}
                                {/* <div className="flex items-center gap-2 bg-white px-3 py-1 rounded border">
                                    <span className="font-mono text-sm">example@upi</span>
                                    <button onClick={() => copyToClipboard('example@upi')}><Copy size={14}/></button>
                                </div> */}
                            </div>

                            {/* Payment Verification Method */}
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-3">Verify Payment</h3>
                                <div className="flex gap-2 mb-4">
                                    <button
                                        type="button"
                                        onClick={() => setPaymentMethod('utr')}
                                        className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition ${paymentMethod === 'utr'
                                            ? 'bg-orange-100 text-orange-700 border border-orange-200'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                    >
                                        Enter UTR
                                    </button>
                                    <p> OR </p>
                                    <button
                                        type="button"
                                        onClick={() => setPaymentMethod('screenshot')}
                                        className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition ${paymentMethod === 'screenshot'
                                            ? 'bg-orange-100 text-orange-700 border border-orange-200'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                    >
                                        Upload Screenshot
                                    </button>
                                </div>

                                <form id="payment-form" onSubmit={handlePaymentAndOrder}>
                                    {paymentMethod === 'utr' ? (
                                        <div>
                                            <input
                                                required
                                                type="text"
                                                placeholder="Enter 12-digit UTR / Ref ID"
                                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                                                value={utrNumber}
                                                onChange={e => setUtrNumber(e.target.value)}
                                            />
                                        </div>
                                    ) : (
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition cursor-pointer relative">
                                            <input
                                                required
                                                type="file"
                                                accept="image/*"
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                onChange={handleFileChange}
                                            />
                                            <div className="flex flex-col items-center pointer-events-none">
                                                {screenshotFile ? (
                                                    <>
                                                        <ImageIcon className="text-green-500 mb-2" size={32} />
                                                        <p className="text-sm font-medium text-green-700">{screenshotFile.name}</p>
                                                        <p className="text-xs text-gray-500">Click to change</p>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Upload className="text-gray-400 mb-2" size={32} />
                                                        <p className="text-sm text-gray-600">Click to upload screenshot</p>
                                                        <p className="text-xs text-gray-400">JPG, PNG supported</p>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </form>
                            </div>
                        </div>
                    )}

                    {step === 'success' && orderResponse && (
                        <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center animate-bounce">
                                <CheckCircle className="text-green-600 w-10 h-10" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-green-800 mb-2">SUCCESS!!</h3>
                                <p className="text-gray-600">Your order has been placed successfully.</p>
                                <p className="text-gray-600">You will receive confirmation from us via WhatsApp within the next 24 hours.</p>
                            </div>

                            <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 w-full">
                                <p className="text-sm text-orange-800 uppercase tracking-wide font-semibold mb-1">Your Token Number</p>
                                <p className="text-5xl font-black text-orange-600">{orderResponse.token_number}</p>
                            </div>

                            <div className="text-sm text-gray-500">
                                <p className="text-2xl font-bold text-red-700 mb-2">KEEP A SCREENSHOT OF THIS!</p>
                                <p>Please show this token number at the counter.</p>
                                <p className="mt-1">For further queries contact : 9445473914 (or) 9944821737</p>

                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                {step !== 'success' && (
                    <div className="p-4 border-t bg-gray-50">
                        {step === 'cart' ? (
                            <>
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-gray-600">Total</span>
                                    <span className="text-xl font-bold">₹{getCartTotal()}</span>
                                </div>
                                <button
                                    onClick={handleCheckout}
                                    disabled={Object.keys(cart).length === 0}
                                    className="w-full bg-orange-600 text-white py-3 rounded-lg font-bold hover:bg-orange-700 transition flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
                                >
                                    Proceed to Checkout <ArrowRight size={18} />
                                </button>
                            </>
                        ) : step === 'details' ? (
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setStep('cart')}
                                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-100 transition"
                                >
                                    Back
                                </button>
                                <button
                                    form="details-form"
                                    type="submit"
                                    className="flex-1 bg-orange-600 text-white py-3 rounded-lg font-bold hover:bg-orange-700 transition"
                                >
                                    Next: Payment
                                </button>
                            </div>
                        ) : (
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setStep('details')}
                                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-100 transition"
                                    disabled={loading}
                                >
                                    Back
                                </button>
                                <button
                                    form="payment-form"
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-orange-600 text-white py-3 rounded-lg font-bold hover:bg-orange-700 transition disabled:opacity-50"
                                >
                                    {loading ? 'Processing...' : 'Place Order'}
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartModal;
