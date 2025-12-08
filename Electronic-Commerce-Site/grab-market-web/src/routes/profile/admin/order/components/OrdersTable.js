import React from 'react';

const formatDate = (value) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export default function OrdersTable({ orders, onView }) {
  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            <th style={{ width: '10%' }}>Order ID</th>
            <th style={{ width: '22%' }}>Product</th>
            <th style={{ width: '20%' }}>Buyer</th>
            <th style={{ width: '12%' }}>Amount</th>
            <th style={{ width: '12%' }}>Status</th>
            <th style={{ width: '14%' }}>Date</th>
            <th style={{ width: '10%' }}>Actions</th>
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
                    {order.productIcon || '🛒'}
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
                  {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                </span>
              </td>
              <td>
                <span className="date">{formatDate(order.date)}</span>
              </td>
              <td>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => onView(order)}
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


