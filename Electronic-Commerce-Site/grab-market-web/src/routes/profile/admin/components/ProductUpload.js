import React, { useState, useEffect, useCallback } from 'react';
import {
  Form,
  Input,
  InputNumber,
  Button,
  Upload,
  message,
  Select,
  Slider,
  Card,
  Space,
} from 'antd';
import { UploadOutlined, PlusOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { API_URL } from '../../../../config/constants';
import { api } from '../../../../config/api';
import { useHistory } from 'react-router-dom';
import './ProductUpload.css';

const { TextArea } = Input;
const { Option } = Select;

export default function ProductUpload({ onSuccess }) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const history = useHistory();
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // 카테고리 목록 로드
  const loadCategories = useCallback(async () => {
    try {
      const response = await api.categories.getList();
      const categoriesList = response.data?.categories || [];
      // 메인 카테고리만 필터링 (parentId가 null인 것들)
      const mainCategories = categoriesList.filter(cat => !cat.parentId);
      setCategories(mainCategories);
    } catch (error) {
      console.error('Failed to load categories:', error);
      message.error(t('productAdmin.upload.categoryLoadFail'));
    }
  }, [t]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

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
      message.success(t('productAdmin.upload.imageUploadSuccess'));
    }
    if (info.file.status === 'error') {
      message.error(t('productAdmin.upload.imageUploadFail'));
    }
  };

  // 폼 제출 핸들러
  const onFinish = async (values) => {
    if (!imageUrl) {
      message.error(t('productAdmin.upload.imageRequired'));
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
        throw new Error(t('productAdmin.upload.productIdError'));
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
          console.error(t('productAdmin.upload.statsCreateFail'), statsError);
          // Stats 생성 실패해도 상품은 생성되었으므로 계속 진행
        }
      }

      message.success(t('productAdmin.upload.success'));
      
      // 성공 콜백 호출
      if (onSuccess) {
        onSuccess(productId);
      }
      
      // 상품 상세 페이지로 이동
      history.push(`/products/${productId}`);
    } catch (error) {
      console.error('상품 업로드 실패:', error);
      const errorMessage = error.response?.data?.error || error.message || t('productAdmin.upload.fail');
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
          <h3 className="section-title">{t('productAdmin.upload.imageSection')}</h3>
          <Form.Item
            name="upload"
            rules={[{ required: true, message: t('productAdmin.upload.imageRequired') }]}
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
                  <div style={{ marginTop: 8 }}>{t('productAdmin.upload.imageUpload')}</div>
                </div>
              )}
            </Upload>
          </Form.Item>
        </div>

        <div className="form-section">
          <h3 className="section-title">{t('productAdmin.upload.basicInfo')}</h3>
          
          <Form.Item
            label={t('productAdmin.upload.productName')}
            name="name"
            rules={[{ required: true, message: t('productAdmin.upload.productNameRequired') }]}
          >
            <Input size="large" placeholder={t('productAdmin.upload.productNamePlaceholder')} />
          </Form.Item>

          <Form.Item
            label={t('productAdmin.upload.sellerName')}
            name="seller"
            rules={[{ required: true, message: t('productAdmin.upload.sellerNameRequired') }]}
          >
            <Input size="large" placeholder={t('productAdmin.upload.sellerNamePlaceholder')} />
          </Form.Item>

          <Form.Item
            label={t('productAdmin.upload.price')}
            name="price"
            rules={[
              { required: true, message: t('productAdmin.upload.priceRequired') },
              { type: 'number', min: 0, message: t('productAdmin.upload.priceMin') },
            ]}
          >
            <InputNumber
              size="large"
              style={{ width: '100%' }}
              placeholder={t('productAdmin.upload.pricePlaceholder')}
              formatter={(value) => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => value.replace(/¥\s?|(,*)/g, '')}
            />
          </Form.Item>

          <Form.Item
            label={t('productAdmin.upload.description')}
            name="description"
            rules={[{ required: true, message: t('productAdmin.upload.descriptionRequired') }]}
          >
            <TextArea
              size="large"
              rows={4}
              placeholder={t('productAdmin.upload.descriptionPlaceholder')}
              showCount
              maxLength={500}
            />
          </Form.Item>
        </div>

        <div className="form-section">
          <h3 className="section-title">{t('productAdmin.upload.category')}</h3>
          
          <Form.Item
            label={t('productAdmin.upload.mainCategory')}
            name="category_id"
          >
            <Select
              size="large"
              placeholder={t('productAdmin.upload.mainCategoryPlaceholder')}
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
              label={t('productAdmin.upload.subCategory')}
              name="sub_category_id"
            >
              <Select
                size="large"
                placeholder={t('productAdmin.upload.subCategoryPlaceholder')}
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
            label={t('productAdmin.upload.techStack')}
            name="tech_stack"
          >
            <Input
              size="large"
              placeholder={t('productAdmin.upload.techStackPlaceholder')}
            />
          </Form.Item>
        </div>

        <div className="form-section">
          <h3 className="section-title">{t('productAdmin.upload.statsSection')}</h3>
          <p className="section-description">
            {t('productAdmin.upload.statsDescription')}
          </p>

          <Form.Item label={t('productAdmin.upload.teamwork')} name={['stats', 'teamwork']}>
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

          <Form.Item label={t('productAdmin.upload.stability')} name={['stats', 'stability']}>
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

          <Form.Item label={t('productAdmin.upload.speed')} name={['stats', 'speed']}>
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

          <Form.Item label={t('productAdmin.upload.creativity')} name={['stats', 'creativity']}>
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

          <Form.Item label={t('productAdmin.upload.productivity')} name={['stats', 'productivity']}>
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

          <Form.Item label={t('productAdmin.upload.maintainability')} name={['stats', 'maintainability']}>
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
              {t('productAdmin.upload.submit')}
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
              {t('productAdmin.upload.reset')}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
}

