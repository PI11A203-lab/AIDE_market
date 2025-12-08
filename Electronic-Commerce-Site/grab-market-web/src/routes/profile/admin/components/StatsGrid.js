import React from 'react';
import { Package, DollarSign, Users, Star } from 'lucide-react';

export default function StatsGrid({ stats }) {
  const cards = [
    {
      label: 'Total Products',
      value: stats.totalProducts.toLocaleString(),
      icon: <Package size={24} style={{ color: '#1A1A1A' }} />,
    },
    {
      label: 'Total Revenue',
      value: `¥${stats.totalRevenue.toLocaleString()}`,
      icon: <DollarSign size={24} style={{ color: '#1A1A1A' }} />,
    },
    {
      label: 'Followers',
      value: stats.followers.toLocaleString(),
      icon: <Users size={24} style={{ color: '#1A1A1A' }} />,
    },
    {
      label: 'Reviews',
      value: stats.reviews.toLocaleString(),
      icon: <Star size={24} style={{ color: '#1A1A1A' }} />,
    },
  ];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '24px',
        marginBottom: '40px',
      }}
    >
      {cards.map((card) => (
        <div
          key={card.label}
          style={{
            background: 'white',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '1px solid #E5E7EB',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: '#F3F4F6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {card.icon}
            </div>
            <div>
              <div style={{ fontSize: '14px', color: '#6B7280', fontWeight: 500 }}>{card.label}</div>
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#1A1A1A' }}>
                {card.value}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}


