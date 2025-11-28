import React from 'react';
import { Trash2 } from 'lucide-react';

export default function CartItem({ item, onRemove }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 transition-shadow hover:shadow-lg">
      <div className="flex items-center gap-6">
        {/* 아바타 */}
        <div className="w-20 h-20 bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
          {item.avatar}
        </div>

        {/* 정보 */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-2xl font-bold mb-1">{item.name}</h3>
              <p className="text-gray-600">{item.category}</p>
            </div>
            <button
              onClick={() => onRemove(item.id)}
              className="p-2 bg-transparent border-none cursor-pointer rounded-lg transition-colors hover:bg-red-50"
            >
              <Trash2 className="w-5 h-5 text-red-500" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {item.tags.map((tag, idx) => (
              <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm">
                {tag}
              </span>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-3xl font-bold text-blue-600">
              ¥{item.price.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
