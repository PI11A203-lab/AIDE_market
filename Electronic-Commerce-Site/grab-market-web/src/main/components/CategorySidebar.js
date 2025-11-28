import React from 'react';
import { Filter } from 'lucide-react';

const CategorySidebar = ({ categories, selectedCategory, onCategoryChange, sortBy, onSortChange }) => {
  return (
    <aside className="w-64 flex-shrink-0">
      <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-24">
        <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-6">
          <Filter className="w-5 h-5" />
          Categories
        </h3>
        <div className="space-y-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                selectedCategory === cat.id 
                  ? 'bg-blue-50 border-2 border-blue-500 text-blue-700 font-semibold' 
                  : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-2 border-transparent'
              }`}
            >
              {cat.icon && (
                <img 
                  src={cat.icon} 
                  alt={cat.name} 
                  className="w-6 h-6 object-contain"
                />
              )}
              <span className="flex-1 text-left">{cat.name}</span>
              <span className={`px-2 py-1 rounded-lg text-sm font-medium ${
                selectedCategory === cat.id ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-600'
              }`}>
                {cat.count}
              </span>
            </button>
          ))}
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Sort by</h4>
          <select 
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="download">最多ダウンロード</option>
            <option value="rating">最高評価</option>
            <option value="price">価格: 低から高</option>
            <option value="priceDesc">価格: 高から低</option>
          </select>
        </div>
      </div>
    </aside>
  );
};

export default CategorySidebar;
