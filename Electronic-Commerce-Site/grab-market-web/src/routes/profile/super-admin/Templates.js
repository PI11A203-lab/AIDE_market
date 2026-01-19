import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SuperAdminLayout from './components/SuperAdminLayout';
import { api } from '../../../config/api';
import { Modal, Input, Button, message, Table, Space, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, EyeOutlined } from '@ant-design/icons';
import './Templates.css';

const { TextArea } = Input;

export default function Templates() {
  const { t } = useTranslation();
  const history = useHistory();
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0 });
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', icon_url: '' });

  useEffect(() => {
    loadTemplates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page]);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const response = await api.superAdmin.templates.getList({
        page: pagination.page,
        limit: pagination.limit
      });
      setTemplates(response.data.templates || []);
      setPagination(prev => ({
        ...prev,
        total: response.data.total || response.data.count || 0,
        totalPages: response.data.totalPages || Math.ceil((response.data.total || 0) / pagination.limit)
      }));
    } catch (error) {
      console.error('템플릿 목록 로드 실패:', error);
      // API가 없을 수 있으므로 빈 배열로 초기화
      setTemplates([]);
      setPagination(prev => ({ ...prev, total: 0 }));
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingTemplate(null);
    setFormData({ name: '', description: '', icon_url: '' });
    setModalVisible(true);
  };

  const handleEdit = (template) => {
    setEditingTemplate(template);
    setFormData({
      name: template.name || '',
      description: template.description || '',
      icon_url: template.icon_url || ''
    });
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      message.warning(t('profile.superAdmin.templates.messages.nameRequired'));
      return;
    }

    try {
      if (editingTemplate) {
        await api.superAdmin.templates.update(editingTemplate.id, formData);
        message.success(t('profile.superAdmin.templates.messages.updateSuccess'));
      } else {
        await api.superAdmin.templates.create(formData);
        message.success(t('profile.superAdmin.templates.messages.createSuccess'));
      }
      setModalVisible(false);
      loadTemplates();
    } catch (error) {
      console.error('템플릿 저장 실패:', error);
      message.error(error.response?.data?.error || t('profile.superAdmin.templates.messages.saveFail'));
    }
  };

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
    },
    {
      title: t('profile.superAdmin.templates.table.description'),
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
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
      width: 200,
      render: (_, record) => (
        <Space size="middle">
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
          onCancel={() => setModalVisible(false)}
          okText={t('profile.superAdmin.templates.modal.save')}
          cancelText={t('profile.superAdmin.templates.modal.cancel')}
          width={600}
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
          </div>
        </Modal>
      </div>
    </SuperAdminLayout>
  );
}
