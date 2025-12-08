import React from 'react';
import { Link } from 'react-router-dom';
import { API_URL } from '../../../../config/constants';
import StarRating from './StarRating';

export default function ProductsTable({ products, onDelete }) {
  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            <th style={{ width: '5%' }}>ID</th>
            <th style={{ width: '35%' }}>Product</th>
            <th style={{ width: '15%' }}>Price</th>
            <th style={{ width: '12%' }}>Sales</th>
            <th style={{ width: '18%' }}>Rating</th>
            <th style={{ width: '15%' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>
                <div className="product-cell">
                  <div className="product-image">
                    {product.imageUrl ? (
                      <img
                        src={`${API_URL}/${product.imageUrl}`}
                        alt={product.name}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.textContent = (product.name || 'AI').substring(0, 2);
                        }}
                      />
                    ) : (
                      (product.name || 'AI').substring(0, 2)
                    )}
                  </div>
                  <div className="product-info">
                    <div className="product-name">{product.name}</div>
                    <div className="product-category">
                      {product.category_name || 'AI Developer'}
                    </div>
                  </div>
                </div>
              </td>
              <td>¥{product.price?.toLocaleString() || 0}</td>
              <td>{product.download_count?.toLocaleString() || 0}</td>
              <td>
                <div className="rating">
                  <StarRating rating={parseFloat(product.rating_average || 0)} />
                  <span className="rating-text">
                    {parseFloat(product.rating_average || 0).toFixed(1)} ({product.rating_count || 0})
                  </span>
                </div>
              </td>
              <td>
                <div className="actions">
                  <Link
                    to={`/profile/products/${product.id}`}
                    className="btn btn-secondary btn-sm"
                  >
                    Details
                  </Link>
                  <Link
                    to={`/profile/products/${product.id}/edit`}
                    className="btn btn-secondary btn-sm"
                  >
                    Edit
                  </Link>
                  <Link
                    to={`/products/${product.id}`}
                    className="btn btn-secondary btn-sm"
                  >
                    Public
                  </Link>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => onDelete(product.id, product.name)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

