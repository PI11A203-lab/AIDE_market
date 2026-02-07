import React from 'react';
import { useHistory } from 'react-router-dom';
import { Dropdown } from 'antd';
import { ChevronDown } from 'lucide-react';
import { API_URL } from '../../../../config/constants';
import StarRating from './StarRating';
import { useTranslation } from 'react-i18next';

export default function ProductsTable({ products, onDelete }) {
  const { t } = useTranslation();
  const history = useHistory();
  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            <th style={{ width: '5%' }}>{t('productAdmin.list.table.id')}</th>
            <th style={{ width: '35%' }}>{t('productAdmin.list.table.product')}</th>
            <th style={{ width: '15%' }}>{t('productAdmin.list.table.price')}</th>
            <th style={{ width: '12%' }}>{t('productAdmin.list.table.sales')}</th>
            <th style={{ width: '18%' }}>{t('productAdmin.list.table.rating')}</th>
            <th style={{ width: '15%' }}>{t('productAdmin.list.table.actions')}</th>
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
                      {product.category_name || t('productAdmin.list.table.categoryFallback')}
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
                <Dropdown
                  menu={{
                    items: [
                      {
                        key: 'details',
                        label: t('productAdmin.list.table.details'),
                        onClick: () => history.push(`/profile/products/${product.id}`),
                      },
                      {
                        key: 'public',
                        label: t('productAdmin.list.table.public'),
                        onClick: () => history.push(`/products/${product.id}`),
                      },
                      { type: 'divider' },
                      {
                        key: 'delete',
                        label: t('productAdmin.list.table.delete'),
                        danger: true,
                        onClick: () => onDelete(product.id, product.name),
                      },
                    ],
                  }}
                  trigger={['click']}
                  placement="bottomRight"
                >
                  <button className="actions-trigger-btn" type="button">
                    <ChevronDown size={18} />
                    <span>{t('productAdmin.list.table.actions')}</span>
                  </button>
                </Dropdown>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

