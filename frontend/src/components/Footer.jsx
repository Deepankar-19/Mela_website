import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white py-8 mt-auto">
            <div className="container mx-auto px-4 text-center">
                <p className="mb-2">&copy; Mela {new Date().getFullYear()} FoodPreorder System. </p>
                <p className="mb-2"> All rights reserved by HotChicksOnly</p>
            </div>
        </footer>
    );
};

export default Footer;
