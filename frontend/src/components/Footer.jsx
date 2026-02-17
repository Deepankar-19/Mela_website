import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white py-8 mt-auto">
            <div className="container mx-auto px-4 text-center">
                <p className="mb-2">&copy; Mela {new Date().getFullYear()} FoodPreorder System. </p>
                <p className="mb-2"> All rights reserved by HotChicksOnly</p>
                <a
                    href="https://www.instagram.com/hotchicks.only/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex justify-center items-center gap-2 hover:text-pink-500 transition duration-300"
                >
                    <Instagram size={22} />
                    <span>Follow us on Instagram</span>
                </a>
            </div>
        </footer>
    );
};

export default Footer;
