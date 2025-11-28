import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <ShoppingCart className="w-24 h-24 text-gray-300 mb-6" />
      <h3 className="text-3xl font-bold text-gray-800 mb-4">Your cart is empty</h3>
      <p className="text-gray-600 mb-8 text-lg">
        Browse our AI developers and start building your team!
      </p>
      <Link 
        to="/" 
        className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold no-underline transition-all hover:shadow-2xl"
      >
        Browse Developers
      </Link>
    </div>
  );
}
