import React from 'react';
import { useTranslation } from 'react-i18next';
import { AdminLayout } from '../components';
import { ProductUpload } from '../components';
import { message } from 'antd';

export default function AdminProductUploadPage() {
  const { t } = useTranslation();

  // 상품 업로드 성공 핸들러
  const handleUploadSuccess = async (productId) => {
    message.success(t('productAdmin.upload.success'));
    // 상품 상세 페이지로 이동 (history.push는 ProductUpload 컴포넌트에서 처리)
  };

  return (
    <AdminLayout>
      <div className="profile-container">
        <main className="profile-main">
          <div
            style={{
              background: 'white',
              borderRadius: '16px',
              padding: '32px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              border: '1px solid #E5E7EB',
              maxWidth: '1000px',
              margin: '0 auto',
            }}
          >
            <div style={{ marginBottom: '32px' }}>
              <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#1A1A1A', margin: 0 }}>
                {t('profile.admin.upload.title')}
              </h1>
              <p style={{ fontSize: '16px', color: '#666', marginTop: '8px' }}>
                {t('profile.admin.upload.subtitle')}
              </p>
            </div>
            <ProductUpload onSuccess={handleUploadSuccess} />
          </div>
        </main>
      </div>
    </AdminLayout>
  );
}

