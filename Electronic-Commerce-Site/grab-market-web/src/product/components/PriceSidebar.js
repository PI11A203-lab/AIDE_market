import React from 'react';
import { MapPin, Calendar, Clock, Award } from 'lucide-react';

export default function PriceSidebar({ developer, onBuyNow, onAddToCart, isPurchased }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-24 relative">
      {isPurchased && (
        <>
          <div className="absolute inset-0 bg-gray-200 bg-opacity-80 rounded-2xl z-10" />
          <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold z-20">
            購入済み
          </div>
        </>
      )}
      <div className="mb-6">
        <div className="text-sm text-gray-600 mb-2">価格</div>
        <div className="text-5xl font-bold text-gray-900 mb-1">
          ¥{developer.price.toLocaleString()}
        </div>
      </div>
      <button 
        onClick={onBuyNow}
        disabled={isPurchased}
        className={`w-full py-4 rounded-xl font-bold text-lg transition mb-3 ${
          isPurchased
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-xl'
        }`}
      >
        今すぐ買う
      </button>
      
      <button 
        onClick={onAddToCart}
        disabled={isPurchased}
        className={`w-full py-4 border-2 rounded-xl font-bold transition ${
          isPurchased
            ? 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
        }`}
      >
        カートに入れる
      </button>
      <div className="mt-6 pt-6 border-t border-gray-200 space-y-4">
        <div className="flex items-center gap-3 text-sm">
          <MapPin className="w-5 h-5 text-gray-400" />
          <span>{developer.location}</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <Calendar className="w-5 h-5 text-gray-400" />
          <span>Joined {developer.joined}</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <Clock className="w-5 h-5 text-gray-400" />
          <span>Responds in {developer.responseTime}</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <Award className="w-5 h-5 text-gray-400" />
          <span>Top 1% Developer</span>
        </div>
      </div>
    </div>
  );
}

