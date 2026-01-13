import React from 'react';
import { useTranslation } from 'react-i18next';
import { API_URL } from '../../../../../config/constants';

const formatDate = (value, locale) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleDateString(locale || 'en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export default function OrdersTable({ orders, onView }) {
  const { t, i18n } = useTranslation();
  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            <th style={{ width: '10%' }}>{t('profile.admin.orders.table.orderId')}</th>
            <th style={{ width: '22%' }}>{t('profile.admin.orders.table.product')}</th>
            <th style={{ width: '20%' }}>{t('profile.admin.orders.table.buyer')}</th>
            <th style={{ width: '12%' }}>{t('profile.admin.orders.table.amount')}</th>
            <th style={{ width: '12%' }}>{t('profile.admin.orders.table.status')}</th>
            <th style={{ width: '14%' }}>{t('profile.admin.orders.table.date')}</th>
            <th style={{ width: '10%' }}>{t('profile.admin.orders.table.actions')}</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id || order.orderId}>
              <td>
                <span className="order-number">{order.orderId}</span>
              </td>
              <td>
                <div className="product-cell">
                  <div className="product-image">
                    {order.productImage ? (
                      <img 
                        src={`${API_URL}/${order.productImage}`}
                        alt={order.productName}
                        style={{
                          width: '40px',
                          height: '40px',
                          objectFit: 'cover',
                          borderRadius: '8px',
                          border: '1px solid #E5E7EB'
                        }}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.textContent = order.productIcon || '🛒';
                        }}
                      />
                    ) : (
                      <span style={{ fontSize: '24px' }}>{order.productIcon || '🛒'}</span>
                    )}
                  </div>
                  <span className="product-name">{order.productName}</span>
                </div>
              </td>
              <td>
                <div className="buyer-info">
                  <span className="buyer-name">{order.buyerName}</span>
                  {order.buyerEmail && (
                    <span className="buyer-email">{order.buyerEmail}</span>
                  )}
                </div>
              </td>
              <td>
                <span className="amount">¥{(order.amount || 0).toLocaleString()}</span>
              </td>
              <td>
                <span className={`status-badge ${order.status}`}>
                  {t(`profile.admin.orders.table.statusText.${order.status}`)}
                </span>
              </td>
              <td>
                <span className="date">{formatDate(order.date, i18n.language)}</span>
              </td>
              <td>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => onView(order)}
                >
                  {t('profile.admin.orders.table.view')}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


