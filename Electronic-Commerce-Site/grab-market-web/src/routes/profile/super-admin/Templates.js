import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import SuperAdminLayout from './components/SuperAdminLayout';
import { api } from '../../../config/api';
import { Modal, Input, Button, message, Table, Space, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, EyeOutlined } from '@ant-design/icons';
import './Templates.css';

const { TextArea } = Input;

export default function Templates() {
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
      message.warning('템플릿 이름을 입력해주세요.');
      return;
    }

    try {
      if (editingTemplate) {
        await api.superAdmin.templates.update(editingTemplate.id, formData);
        message.success('템플릿이 수정되었습니다.');
      } else {
        await api.superAdmin.templates.create(formData);
        message.success('템플릿이 생성되었습니다.');
      }
      setModalVisible(false);
      loadTemplates();
    } catch (error) {
      console.error('템플릿 저장 실패:', error);
      message.error(error.response?.data?.error || '템플릿 저장에 실패했습니다.');
    }
  };

  const handleDelete = async (templateId) => {
    try {
      await api.superAdmin.templates.delete(templateId);
      message.success('템플릿이 삭제되었습니다.');
      loadTemplates();
    } catch (error) {
      console.error('템플릿 삭제 실패:', error);
      message.error(error.response?.data?.error || '템플릿 삭제에 실패했습니다.');
    }
  };

  const handleViewDetail = (templateId) => {
    history.push(`/profile/super-admin/templates/${templateId}`);
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '템플릿 이름',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '설명',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '포함 상품 수',
      dataIndex: 'product_count',
      key: 'product_count',
      width: 120,
      render: (count) => count || 0,
    },
    {
      title: '생성일',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 180,
      render: (date) => date ? new Date(date).toLocaleDateString('ko-KR') : '-',
    },
    {
      title: '작업',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record.id)}
          >
            상세
          </Button>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            수정
          </Button>
          <Popconfirm
            title="템플릿을 삭제하시겠습니까?"
            onConfirm={() => handleDelete(record.id)}
            okText="삭제"
            cancelText="취소"
          >
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
            >
              삭제
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
            <h1 className="page-title">템플릿 관리</h1>
            <p className="page-subtitle">프로젝트 유형별 AI 상품 세트를 관리합니다.</p>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreate}
          >
            템플릿 등록
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
          title={editingTemplate ? '템플릿 수정' : '템플릿 등록'}
          open={modalVisible}
          onOk={handleSave}
          onCancel={() => setModalVisible(false)}
          okText="저장"
          cancelText="취소"
          width={600}
        >
          <div style={{ marginTop: 20 }}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
                템플릿 이름 *
              </label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="예: 웹 애플리케이션 개발"
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
                설명
              </label>
              <TextArea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="예: 풀스택 웹 앱을 만들기 위한 AI 세트"
                rows={4}
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
                아이콘 URL
              </label>
              <Input
                value={formData.icon_url}
                onChange={(e) => setFormData({ ...formData, icon_url: e.target.value })}
                placeholder="예: /images/templates/web.png"
              />
            </div>
          </div>
        </Modal>
      </div>
    </SuperAdminLayout>
  );
}
