import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  InputNumber,
  Button,
  Upload,
  message,
  Select,
  Slider,
  Divider,
  Card,
  Space,
} from 'antd';
import { UploadOutlined, PlusOutlined } from '@ant-design/icons';
import { API_URL } from '../../../../config/constants';
import { api } from '../../../../config/api';
import { useHistory } from 'react-router-dom';
import './ProductUpload.css';

const { TextArea } = Input;
const { Option } = Select;

export default function ProductUpload({ onSuccess }) {
  const [form] = Form.useForm();
  const history = useHistory();
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // 카테고리 목록 로드
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await api.categories.getList();
      const categoriesList = response.data?.categories || [];
      // 메인 카테고리만 필터링 (parentId가 null인 것들)
      const mainCategories = categoriesList.filter(cat => !cat.parentId);
      setCategories(mainCategories);
    } catch (error) {
      console.error('Failed to load categories:', error);
      message.error('카테고리 목록을 불러오는데 실패했습니다.');
    }
  };

  // 서브카테고리 로드
  const loadSubCategories = async (categoryId) => {
    try {
      const response = await api.categories.getSubcategories(categoryId);
      const subCategoriesList = response.data?.subcategories || [];
      setSubCategories(subCategoriesList);
    } catch (error) {
      console.error('Failed to load subcategories:', error);
      setSubCategories([]);
    }
  };

  // 카테고리 변경 핸들러
  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    form.setFieldsValue({ sub_category_id: undefined });
    if (categoryId) {
      loadSubCategories(categoryId);
    } else {
      setSubCategories([]);
    }
  };

  // 이미지 업로드 핸들러
  const onChangeImage = (info) => {
    if (info.file.status === 'uploading') {
      return;
    }
    if (info.file.status === 'done') {
      const response = info.file.response;
      const uploadedImageUrl = response.imageUrl;
      setImageUrl(uploadedImageUrl);
      message.success('이미지 업로드 완료');
    }
    if (info.file.status === 'error') {
      message.error('이미지 업로드 실패');
    }
  };

  // 폼 제출 핸들러
  const onFinish = async (values) => {
    if (!imageUrl) {
      message.error('상품 이미지를 업로드해주세요.');
      return;
    }

    setLoading(true);
    try {
      // 1. 상품 생성
      const productData = {
        name: values.name,
        description: values.description,
        price: parseInt(values.price),
        seller: values.seller,
        imageUrl: imageUrl,
        category_id: values.category_id || null,
        sub_category_id: values.sub_category_id || null,
        tech_stack: values.tech_stack || null,
      };

      const productResponse = await api.products.create(productData);
      const createdProduct = productResponse.data?.product || productResponse.data?.result;
      
      if (!createdProduct || !createdProduct.id) {
        throw new Error('상품 생성 후 ID를 받지 못했습니다.');
      }

      const productId = createdProduct.id;

      // 2. Stats 생성 (선택사항)
      if (values.stats && (
        values.stats.teamwork !== undefined ||
        values.stats.stability !== undefined ||
        values.stats.speed !== undefined ||
        values.stats.creativity !== undefined ||
        values.stats.productivity !== undefined ||
        values.stats.maintainability !== undefined
      )) {
        const statsData = {
          teamwork: values.stats.teamwork || 50,
          stability: values.stats.stability || 50,
          speed: values.stats.speed || 50,
          creativity: values.stats.creativity || 50,
          productivity: values.stats.productivity || 50,
          maintainability: values.stats.maintainability || 50,
        };

        try {
          await api.stats.upsertByProduct(productId, statsData);
        } catch (statsError) {
          console.error('Stats 생성 실패 (상품은 생성됨):', statsError);
          // Stats 생성 실패해도 상품은 생성되었으므로 계속 진행
        }
      }

      message.success('상품이 성공적으로 등록되었습니다!');
      
      // 성공 콜백 호출
      if (onSuccess) {
        onSuccess(productId);
      }
      
      // 상품 상세 페이지로 이동
      history.push(`/products/${productId}`);
    } catch (error) {
      console.error('상품 업로드 실패:', error);
      const errorMessage = error.response?.data?.error || error.message || '상품 업로드에 실패했습니다.';
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="product-upload-card">
      <Form
        form={form}
        name="product-upload"
        onFinish={onFinish}
        layout="vertical"
        initialValues={{
          price: 0,
          stats: {
            teamwork: 50,
            stability: 50,
            speed: 50,
            creativity: 50,
            productivity: 50,
            maintainability: 50,
          },
        }}
      >
        <div className="upload-section">
          <h3 className="section-title">상품 이미지</h3>
          <Form.Item
            name="upload"
            rules={[{ required: true, message: '상품 이미지를 업로드해주세요.' }]}
          >
            <Upload
              name="image"
              action={`${API_URL}/image`}
              listType="picture-card"
              showUploadList={false}
              onChange={onChangeImage}
              className="product-image-upload"
            >
              {imageUrl ? (
                <div className="uploaded-image-container">
                  <img
                    src={`${API_URL}/${imageUrl}`}
                    alt="Uploaded product"
                    className="uploaded-image"
                  />
                </div>
              ) : (
                <div className="upload-placeholder">
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>이미지 업로드</div>
                </div>
              )}
            </Upload>
          </Form.Item>
        </div>

        <Divider />

        <div className="form-section">
          <h3 className="section-title">기본 정보</h3>
          
          <Form.Item
            label="상품명"
            name="name"
            rules={[{ required: true, message: '상품명을 입력해주세요.' }]}
          >
            <Input size="large" placeholder="상품명을 입력하세요" />
          </Form.Item>

          <Form.Item
            label="판매자명"
            name="seller"
            rules={[{ required: true, message: '판매자명을 입력해주세요.' }]}
          >
            <Input size="large" placeholder="판매자명을 입력하세요" />
          </Form.Item>

          <Form.Item
            label="가격"
            name="price"
            rules={[
              { required: true, message: '가격을 입력해주세요.' },
              { type: 'number', min: 0, message: '가격은 0 이상이어야 합니다.' },
            ]}
          >
            <InputNumber
              size="large"
              style={{ width: '100%' }}
              placeholder="가격을 입력하세요"
              formatter={(value) => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => value.replace(/¥\s?|(,*)/g, '')}
            />
          </Form.Item>

          <Form.Item
            label="상품 설명"
            name="description"
            rules={[{ required: true, message: '상품 설명을 입력해주세요.' }]}
          >
            <TextArea
              size="large"
              rows={4}
              placeholder="상품에 대한 자세한 설명을 입력하세요"
              showCount
              maxLength={500}
            />
          </Form.Item>
        </div>

        <Divider />

        <div className="form-section">
          <h3 className="section-title">카테고리</h3>
          
          <Form.Item
            label="메인 카테고리"
            name="category_id"
          >
            <Select
              size="large"
              placeholder="카테고리를 선택하세요"
              onChange={handleCategoryChange}
              allowClear
            >
              {categories.map((category) => (
                <Option key={category.id} value={category.id}>
                  {category.name_ja || category.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {selectedCategory && subCategories.length > 0 && (
            <Form.Item
              label="서브 카테고리"
              name="sub_category_id"
            >
              <Select
                size="large"
                placeholder="서브 카테고리를 선택하세요"
                allowClear
              >
                {subCategories.map((subCategory) => (
                  <Option key={subCategory.id} value={subCategory.id}>
                    {subCategory.name_ja || subCategory.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )}

          <Form.Item
            label="기술 스택"
            name="tech_stack"
          >
            <Input
              size="large"
              placeholder="예: React, Node.js, Python"
            />
          </Form.Item>
        </div>

        <Divider />

        <div className="form-section">
          <h3 className="section-title">AI 통계 (선택사항)</h3>
          <p className="section-description">
            각 항목의 수치를 0-100 사이로 설정할 수 있습니다.
          </p>

          <Form.Item label="협업 능력 (Teamwork)" name={['stats', 'teamwork']}>
            <Slider
              min={0}
              max={100}
              marks={{
                0: '0',
                50: '50',
                100: '100',
              }}
            />
          </Form.Item>

          <Form.Item label="안정성 (Stability)" name={['stats', 'stability']}>
            <Slider
              min={0}
              max={100}
              marks={{
                0: '0',
                50: '50',
                100: '100',
              }}
            />
          </Form.Item>

          <Form.Item label="속도 (Speed)" name={['stats', 'speed']}>
            <Slider
              min={0}
              max={100}
              marks={{
                0: '0',
                50: '50',
                100: '100',
              }}
            />
          </Form.Item>

          <Form.Item label="창의성 (Creativity)" name={['stats', 'creativity']}>
            <Slider
              min={0}
              max={100}
              marks={{
                0: '0',
                50: '50',
                100: '100',
              }}
            />
          </Form.Item>

          <Form.Item label="생산성 (Productivity)" name={['stats', 'productivity']}>
            <Slider
              min={0}
              max={100}
              marks={{
                0: '0',
                50: '50',
                100: '100',
              }}
            />
          </Form.Item>

          <Form.Item label="유지보수성 (Maintainability)" name={['stats', 'maintainability']}>
            <Slider
              min={0}
              max={100}
              marks={{
                0: '0',
                50: '50',
                100: '100',
              }}
            />
          </Form.Item>
        </div>

        <Divider />

        <Form.Item>
          <Space>
            <Button
              className="product-upload-submit-btn"
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
              icon={<UploadOutlined />}
            >
              상품 등록
            </Button>
            <Button
              size="large"
              onClick={() => {
                form.resetFields();
                setImageUrl(null);
                setSelectedCategory(null);
                setSubCategories([]);
              }}
            >
              초기화
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
}

