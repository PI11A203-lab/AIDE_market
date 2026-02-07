import React, { useState, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SuperAdminLayout from './components/SuperAdminLayout';
import { api } from '../../../config/api';
import { API_URL } from '../../../config/constants';
import { mockTemplates } from './mockData';
import { Modal, Input, Button, message, Table, Space, Popconfirm, Card } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, EyeOutlined, UpOutlined, DownOutlined, CloseOutlined, SearchOutlined } from '@ant-design/icons';
import './Templates.css';

const USE_MOCK_ON_ERROR = true;

const { TextArea } = Input;

export default function Templates() {
  const { t, i18n } = useTranslation();
  const history = useHistory();
  const language = i18n.language || 'ko';

  const getLocalizedField = (item, field) => {
    if (!item) return '';
    if (language === 'ja' && item[`${field}_ja`]) return item[`${field}_ja`];
    if (language === 'en' && item[`${field}_en`]) return item[`${field}_en`];
    return item[field] || item[`${field}_ja`] || item[`${field}_en`] || '';
  };
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0 });
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', icon_url: '', product_ids: [] });
  const [allProducts, setAllProducts] = useState([]);
  const [productSearch, setProductSearch] = useState('');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    loadTemplates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page]);

  const loadProducts = useCallback(async () => {
    try {
      setLoadingProducts(true);
      const response = await api.products.getList({
        limit: 100,
        search: productSearch || undefined
      });
      setAllProducts(response.data.products || []);
    } catch (error) {
      console.error('상품 목록 로드 실패:', error);
      setAllProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  }, [productSearch]);

  useEffect(() => {
    if (modalVisible) {
      loadProducts();
      loadCategories();
    }
  }, [modalVisible, loadProducts]);

  const loadCategories = async () => {
    try {
      const response = await api.categories.getList();
      const categoriesData = response.data.categories || response.data || [];
      
      // 중복 완전 제거: ID와 이름 모두 기준으로 중복 제거
      const categoryMapById = new Map();
      const categoryMapByName = new Map();
      
      categoriesData.forEach(category => {
        if (!category || !category.id) return;
        
        const categoryName = (category.name || category.name_ja || '').toLowerCase().trim();
        
        // ID 기준으로 먼저 체크
        if (!categoryMapById.has(category.id)) {
          // 이름 기준으로도 중복 체크 (같은 이름이 이미 있으면 스킵)
          if (!categoryMapByName.has(categoryName) || categoryName === '') {
            categoryMapById.set(category.id, category);
            if (categoryName) {
              categoryMapByName.set(categoryName, category);
            }
          }
        }
      });
      
      // Map에서 배열로 변환하고 id 순으로 정렬
      const uniqueCategories = Array.from(categoryMapById.values()).sort((a, b) => a.id - b.id);
      
      console.log('카테고리 로드:', { total: categoriesData.length, unique: uniqueCategories.length, categories: uniqueCategories.map(c => c.name) });
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('카테고리 목록 로드 실패:', error);
      setCategories([]);
    }
  };

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const response = await api.superAdmin.templates.getList({
        page: pagination.page,
        limit: pagination.limit
      });
      const raw = response.data.templates || [];
      const normalized = raw.map((t) => ({
        ...t,
        product_count: t.product_count ?? (Array.isArray(t.product_ids) ? t.product_ids.length : 0),
        created_at: t.created_at || t.createdAt || null
      }));
      setTemplates(normalized);
      setPagination(prev => ({
        ...prev,
        total: response.data.total || response.data.count || normalized.length,
        totalPages: response.data.totalPages || Math.ceil((response.data.total || normalized.length) / pagination.limit)
      }));
    } catch (error) {
      console.error('템플릿 목록 로드 실패:', error);
      if (USE_MOCK_ON_ERROR) {
        const normalized = mockTemplates.map((t) => ({
          ...t,
          product_count: t.product_count ?? (Array.isArray(t.product_ids) ? t.product_ids.length : 0),
          created_at: t.created_at || t.createdAt || null
        }));
        setTemplates(normalized);
        setPagination(prev => ({ ...prev, total: normalized.length, totalPages: 1 }));
      } else {
        setTemplates([]);
        setPagination(prev => ({ ...prev, total: 0 }));
      }
    } finally {
      setLoading(false);
    }
  };


  const handleCreate = () => {
    setEditingTemplate(null);
    setFormData({ name: '', description: '', icon_url: '', product_ids: [] });
    setSelectedProducts([]);
    setProductSearch('');
    setSelectedCategory(null);
    setModalVisible(true);
  };

  const handleEdit = async (template) => {
    setEditingTemplate(template);
    setFormData({
      name: getLocalizedField(template, 'name') || template.name || '',
      description: getLocalizedField(template, 'description') || template.description || '',
      icon_url: template.icon_url || '',
      product_ids: template.product_ids || []
    });
    
    // 템플릿에 포함된 상품 정보 로드
    if (template.product_ids && template.product_ids.length > 0) {
      try {
        const productPromises = template.product_ids.map(id => 
          api.products.getDetail(id).catch(() => null)
        );
        const productResponses = await Promise.all(productPromises);
        const products = productResponses
          .filter(res => res && res.data && res.data.product)
          .map(res => res.data.product);
        setSelectedProducts(products);
      } catch (error) {
        console.error('상품 정보 로드 실패:', error);
        setSelectedProducts([]);
      }
    } else {
      setSelectedProducts([]);
    }
    
    setProductSearch('');
    setSelectedCategory(null);
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      message.warning(t('profile.superAdmin.templates.messages.nameRequired'));
      return;
    }

    try {
      const productIds = selectedProducts.map(p => p.id);
      let saveData;

      if (editingTemplate) {
        saveData = {
          name: language === 'ko' ? formData.name : (editingTemplate.name ?? ''),
          name_ja: language === 'ja' ? formData.name : (editingTemplate.name_ja ?? ''),
          name_en: language === 'en' ? formData.name : (editingTemplate.name_en ?? ''),
          description: language === 'ko' ? formData.description : (editingTemplate.description ?? ''),
          description_ja: language === 'ja' ? formData.description : (editingTemplate.description_ja ?? ''),
          description_en: language === 'en' ? formData.description : (editingTemplate.description_en ?? ''),
          icon_url: formData.icon_url || '',
          product_ids: productIds
        };
        await api.superAdmin.templates.update(editingTemplate.id, saveData);
        message.success(t('profile.superAdmin.templates.messages.updateSuccess'));
      } else {
        saveData = {
          name: formData.name,
          description: formData.description,
          icon_url: formData.icon_url || '',
          product_ids: productIds
        };
        await api.superAdmin.templates.create(saveData);
        message.success(t('profile.superAdmin.templates.messages.createSuccess'));
      }
      setModalVisible(false);
      loadTemplates();
    } catch (error) {
      console.error('템플릿 저장 실패:', error);
      message.error(error.response?.data?.error || t('profile.superAdmin.templates.messages.saveFail'));
    }
  };

  const handleAddProduct = (product) => {
    if (!selectedProducts.find(p => p.id === product.id)) {
      setSelectedProducts([...selectedProducts, product]);
    }
  };

  const handleRemoveProduct = (productId) => {
    setSelectedProducts(selectedProducts.filter(p => p.id !== productId));
  };

  const handleMoveProduct = (index, direction) => {
    const newProducts = [...selectedProducts];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex >= 0 && targetIndex < newProducts.length) {
      [newProducts[index], newProducts[targetIndex]] = [newProducts[targetIndex], newProducts[index]];
      setSelectedProducts(newProducts);
    }
  };

  const filteredProducts = allProducts.filter(product => {
    // 검색어 필터
    const matchesSearch = !productSearch || 
      product.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(productSearch.toLowerCase()));
    
    // 카테고리 필터
    const matchesCategory = !selectedCategory || product.category_id === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleDelete = async (templateId) => {
    try {
      await api.superAdmin.templates.delete(templateId);
      message.success(t('profile.superAdmin.templates.messages.deleteSuccess'));
      loadTemplates();
    } catch (error) {
      console.error('템플릿 삭제 실패:', error);
      message.error(error.response?.data?.error || t('profile.superAdmin.templates.messages.deleteFail'));
    }
  };

  const handleViewDetail = (templateId) => {
    history.push(`/profile/super-admin/templates/${templateId}`);
  };

  const columns = [
    {
      title: t('profile.superAdmin.templates.table.id'),
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: t('profile.superAdmin.templates.table.name'),
      dataIndex: 'name',
      key: 'name',
      width: 160,
      ellipsis: true,
      render: (_, record) => getLocalizedField(record, 'name') || record.name || '-',
    },
    {
      title: t('profile.superAdmin.templates.table.description'),
      dataIndex: 'description',
      key: 'description',
      width: 200,
      ellipsis: true,
      render: (_, record) => getLocalizedField(record, 'description') || record.description || '-',
    },
    {
      title: t('profile.superAdmin.templates.table.productCount'),
      dataIndex: 'product_count',
      key: 'product_count',
      width: 120,
      render: (count) => count || 0,
    },
    {
      title: t('profile.superAdmin.templates.table.createdAt'),
      dataIndex: 'created_at',
      key: 'created_at',
      width: 180,
      render: (date) => date ? new Date(date).toLocaleDateString('ko-KR') : '-',
    },
    {
      title: t('profile.superAdmin.templates.table.action'),
      key: 'action',
      width: 220,
      render: (_, record) => (
        <Space size="small" wrap={false}>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record.id)}
          >
            {t('profile.superAdmin.templates.table.view')}
          </Button>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            {t('profile.superAdmin.templates.table.edit')}
          </Button>
          <Popconfirm
            title={t('profile.superAdmin.templates.messages.deleteConfirm')}
            onConfirm={() => handleDelete(record.id)}
            okText={t('profile.superAdmin.templates.messages.deleteConfirmOk')}
            cancelText={t('profile.superAdmin.templates.messages.deleteConfirmCancel')}
          >
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
            >
              {t('profile.superAdmin.templates.table.delete')}
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <SuperAdminLayout>
      <div className="templates-page">
        <div className="page-header">
          <div className="page-header-content">
            <h1 className="page-title">{t('profile.superAdmin.templates.title')}</h1>
            <p className="page-subtitle">{t('profile.superAdmin.templates.subtitle')}</p>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreate}
          >
            {t('profile.superAdmin.templates.create')}
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={templates}
          rowKey="id"
          loading={loading}
          pagination={{
            current: pagination.page,
            pageSize: pagination.limit,
            total: pagination.total,
            onChange: (page) => setPagination(prev => ({ ...prev, page })),
          }}
        />

        <Modal
          title={editingTemplate ? t('profile.superAdmin.templates.edit') : t('profile.superAdmin.templates.create')}
          open={modalVisible}
          onOk={handleSave}
          onCancel={() => {
            setModalVisible(false);
            setSelectedProducts([]);
            setProductSearch('');
            setSelectedCategory(null);
          }}
          okText={t('profile.superAdmin.templates.modal.save')}
          cancelText={t('profile.superAdmin.templates.modal.cancel')}
          width={900}
          style={{ top: 20 }}
        >
          <div style={{ marginTop: 20 }}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
                {t('profile.superAdmin.templates.form.name')}
              </label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={t('profile.superAdmin.templates.form.namePlaceholder')}
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
                {t('profile.superAdmin.templates.form.description')}
              </label>
              <TextArea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder={t('profile.superAdmin.templates.form.descriptionPlaceholder')}
                rows={4}
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
                {t('profile.superAdmin.templates.form.iconUrl')}
              </label>
              <Input
                value={formData.icon_url}
                onChange={(e) => setFormData({ ...formData, icon_url: e.target.value })}
                placeholder={t('profile.superAdmin.templates.form.iconUrlPlaceholder')}
              />
            </div>

            {/* 상품 추가 섹션 */}
            <div style={{ marginBottom: 16, borderTop: '1px solid #E5E7EB', paddingTop: 16 }}>
              <label style={{ display: 'block', marginBottom: 12, fontWeight: 500, fontSize: 16 }}>
                {t('profile.superAdmin.templates.form.products')}
              </label>
              
              {/* 선택된 상품 목록 */}
              {selectedProducts.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <div style={{ marginBottom: 8, fontSize: 14, color: '#6B7280' }}>
                    {t('profile.superAdmin.templates.form.selectedProducts')} ({selectedProducts.length})
                  </div>
                  <div className="selected-products-list">
                    {selectedProducts.map((product, index) => (
                      <div key={product.id} className="selected-product-item">
                        <div className="selected-product-info">
                          <span className="product-order">{index + 1}</span>
                          <img 
                            src={product.imageUrl ? `${API_URL}/${product.imageUrl}` : '/placeholder.png'} 
                            alt={product.name}
                            className="product-thumbnail"
                            onError={(e) => { e.target.src = '/placeholder.png'; }}
                          />
                          <div className="product-details">
                            <div className="product-name">{product.name}</div>
                            <div className="product-category-small">
                              {product.category_name || categories.find(c => c.id === product.category_id)?.name || '-'}
                            </div>
                            <div className="product-price">¥{product.price?.toLocaleString() || '0'}</div>
                          </div>
                        </div>
                        <div className="product-actions">
                          <Button
                            type="text"
                            icon={<UpOutlined />}
                            onClick={() => handleMoveProduct(index, 'up')}
                            disabled={index === 0}
                            size="small"
                          />
                          <Button
                            type="text"
                            icon={<DownOutlined />}
                            onClick={() => handleMoveProduct(index, 'down')}
                            disabled={index === selectedProducts.length - 1}
                            size="small"
                          />
                          <Button
                            type="text"
                            icon={<CloseOutlined />}
                            onClick={() => handleRemoveProduct(product.id)}
                            danger
                            size="small"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 상품 검색 및 선택 */}
              <div>
                <Input
                  placeholder={t('profile.superAdmin.templates.form.searchProducts')}
                  prefix={<SearchOutlined />}
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  style={{ marginBottom: 12 }}
                />
                {/* 카테고리 필터 버튼 */}
                <div className="category-filters" style={{ marginBottom: 12 }}>
                  <Button
                    type={selectedCategory === null ? 'primary' : 'default'}
                    onClick={() => setSelectedCategory(null)}
                    size="small"
                    style={{ marginRight: 8, marginBottom: 8 }}
                  >
                    {t('profile.superAdmin.templates.form.allCategories')}
                  </Button>
                  {(() => {
                    // 중복 완전 제거: ID와 이름 모두 기준으로 중복 제거
                    const seenIds = new Set();
                    const seenNames = new Set();
                    const uniqueCategories = [];
                    
                    categories.forEach(cat => {
                      if (!cat || !cat.id) return;
                      
                      const categoryName = (cat.name || cat.name_ja || '').toLowerCase().trim();
                      
                      // ID와 이름 모두 체크하여 완전히 고유한 것만 추가
                      if (!seenIds.has(cat.id)) {
                        // 이름이 있고 이미 본 이름이면 스킵
                        if (categoryName && seenNames.has(categoryName)) {
                          return;
                        }
                        seenIds.add(cat.id);
                        if (categoryName) {
                          seenNames.add(categoryName);
                        }
                        uniqueCategories.push(cat);
                      }
                    });
                    
                    return uniqueCategories.map(category => (
                      <Button
                        key={`category-${category.id}`}
                        type={selectedCategory === category.id ? 'primary' : 'default'}
                        onClick={() => setSelectedCategory(category.id)}
                        size="small"
                        style={{ marginRight: 8, marginBottom: 8 }}
                      >
                        {category.name || category.name_ja || `Category ${category.id}`}
                      </Button>
                    ));
                  })()}
                </div>
                <div className="products-selection-area">
                  {loadingProducts ? (
                    <div style={{ textAlign: 'center', padding: '20px', color: '#6B7280' }}>
                      {t('profile.superAdmin.templates.messages.loading')}
                    </div>
                  ) : filteredProducts.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '20px', color: '#6B7280' }}>
                      {t('profile.superAdmin.templates.form.noProducts')}
                    </div>
                  ) : (
                    <div className="products-grid">
                      {filteredProducts.map(product => {
                        const isSelected = selectedProducts.find(p => p.id === product.id);
                        return (
                          <Card
                            key={product.id}
                            hoverable
                            className={`product-select-card ${isSelected ? 'selected' : ''}`}
                            onClick={() => !isSelected && handleAddProduct(product)}
                            style={{ cursor: isSelected ? 'not-allowed' : 'pointer' }}
                          >
                            <div className="product-card-content">
                              <img 
                                src={product.imageUrl ? `${API_URL}/${product.imageUrl}` : '/placeholder.png'} 
                                alt={product.name}
                                className="product-card-image"
                                onError={(e) => { e.target.src = '/placeholder.png'; }}
                              />
                              <div className="product-card-info">
                                <div className="product-card-name">{product.name}</div>
                                <div className="product-card-category">
                                  {product.category_name || categories.find(c => c.id === product.category_id)?.name || '-'}
                                </div>
                                <div className="product-card-price">¥{product.price?.toLocaleString() || '0'}</div>
                              </div>
                              {isSelected && (
                                <div className="product-selected-badge">✓ {t('profile.superAdmin.templates.form.added')}</div>
                              )}
                            </div>
                          </Card>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </SuperAdminLayout>
  );
}
