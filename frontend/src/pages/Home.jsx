import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Utensils, Clock, Smartphone } from 'lucide-react';

const Home = () => {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="relative bg-orange-600 text-white py-20 lg:py-32 overflow-hidden">
                <div className="absolute inset-0 bg-black/20 z-0" />
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
                        Delicious Food, <br className="md:hidden" /> Pre-ordered.
                    </h1>
                    <p className="text-lg md:text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
                        Skip the queue. Order your favorite meals online and pick them up fresh and hot.
                    </p>
                    <Link
                        to="/menu"
                        className="inline-flex items-center gap-2 bg-white text-orange-600 font-bold py-3 px-8 rounded-full hover:bg-orange-50 transition transform hover:scale-105 shadow-lg"
                    >
                        Order Now <ArrowRight size={20} />
                    </Link>
                </div>

                {/* Decorative Circles */}
                <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
            </section>

            {/* Features Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-3 gap-8 text-center">
                        <FeatureCard
                            icon={<Utensils size={40} className="text-orange-500" />}
                            title="Fresh Ingredients"
                            description="We use only the finest, locally sourced ingredients for every meal."
                        />
                        <FeatureCard
                            icon={<Clock size={40} className="text-orange-500" />}
                            title="Skip the Wait"
                            description="Pre-order online and your food will be ready when you arrive."
                        />
                        <FeatureCard
                            icon={<Smartphone size={40} className="text-orange-500" />}
                            title="Easy Payments"
                            description="Seamless UPI payments directly from your phone."
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};

const FeatureCard = ({ icon, title, description }) => (
    <div className="p-6 rounded-2xl bg-gray-50 hover:bg-orange-50 transition duration-300">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
    </div>
);

export default Home;
