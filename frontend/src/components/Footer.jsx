import React from 'react';
import { Instagram, MessageCircle } from "lucide-react";
const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white py-8 mt-auto">
            <div className="container mx-auto px-4 text-center">
                <p className="mb-2">&copy; Mela {new Date().getFullYear()} FoodPreorder System. </p>
                <p className="mb-2"> All rights reserved by HotChicksOnly</p>
                <br />
                <a
                    href="https://www.instagram.com/hotchicks.only/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex justify-center items-center gap-2 hover:text-pink-500 transition duration-300"
                >
                    <Instagram size={22} />
                    <span>Follow us on Instagram</span>
                </a>
                <br />
                <a
                    href="tel:6379535155"
                    className="flex justify-center items-center gap-2 hover:text-green-500 transition duration-300"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <MessageCircle size={24} />
                    <span>For queries : 6379535155</span>
                </a>
            </div>
        </footer>
    );
};

export default Footer;
