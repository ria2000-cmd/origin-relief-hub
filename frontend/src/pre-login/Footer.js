import React from "react";
import { Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
    return (
        <footer className="bg-primary text-white py-8 mt-12">
            <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-6">
                <div>
                    <h3 className="text-lg font-semibold mb-3">Relief Hub</h3>
                    <p className="text-sm text-gray-200">
                        Helping communities with reliable and quick support.
                    </p>
                </div>

                <div>
                    <h3 className="text-lg font-semibold mb-3">Contact</h3>
                    <ul className="space-y-2 text-sm text-gray-200">
                        <li className="flex items-center space-x-2">
                            <Phone size={16} /> <span>1-800-RELIEF-1</span>
                        </li>
                        <li className="flex items-center space-x-2">
                            <Mail size={16} /> <span>support@reliefhub.com</span>
                        </li>
                        <li className="flex items-center space-x-2">
                            <MapPin size={16} /> <span>Financial District, HQ</span>
                        </li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
                    <ul className="space-y-2 text-sm text-gray-200">
                        <li><a href="/" className="hover:underline">Home</a></li>
                        <li><a href="/about" className="hover:underline">About</a></li>
                        <li><a href="/contact" className="hover:underline">Contact</a></li>
                    </ul>
                </div>
            </div>

            <div className="mt-6 text-center text-gray-300 text-sm border-t border-gray-600 pt-4">
                © {new Date().getFullYear()} Relief Hub. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
