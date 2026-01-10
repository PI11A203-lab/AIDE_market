import {
  Divider,
  Form,
  Input,
  InputNumber,
  Button,
  Upload,
  message,
  ConfigProvider,
} from "antd";
import jaJP from "antd/locale/ja_JP";
import koKR from "antd/locale/ko_KR";
import enUS from "antd/locale/en_US";
import "./index.css";
import FormItem from "antd/es/form/FormItem";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { API_URL } from "../../config/constants";
import axios from "axios";
import { useHistory } from "react-router-dom";

function UploadPage() {
  const [imageUrl, setImageUrl] = useState(null);
  const history = useHistory();
  const { t, i18n } = useTranslation();
  
  // Antd locale 설정
  const getAntdLocale = () => {
    switch(i18n.language) {
      case 'ko': return koKR;
      case 'ja': return jaJP;
      default: return enUS;
    }
  };
  
  // localStorage에서 언어 설정 불러오기
  useEffect(() => {
    const savedLanguage = localStorage.getItem('appLanguage');
    if (savedLanguage && ['ko', 'ja', 'en'].includes(savedLanguage)) {
      i18n.changeLanguage(savedLanguage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const onFinish = (values) => {
    axios
      .post(`${API_URL}/products`, {
        name: values.name,
        description: values.description,
        seller: values.seller,
        price: parseInt(values.price),
        imageUrl: imageUrl,
      })
      .then((result) => {
        console.log(result);
        //↓ 상품 등록이 성공했을 때 메인페이지로 이동
        history.replace("/");
      })
      .catch((error) => {
        console.error(error);
        message.error(t('productAdmin.upload.fail', { defaultValue: 'Failed to upload product.' }));
      });
  };
  const onChangeImage = (info) => {
    if (info.file.status === "uploading") {
      return;
    }
    if (info.file.status === "done") {
      const response = info.file.response;
      const imageUrl = response.imageUrl;
      setImageUrl(imageUrl);
    }
  };
  return (
    <ConfigProvider locale={getAntdLocale()}>
      <div id="upload-container">
      <Form name={t('productAdmin.upload.title')} onFinish={onFinish}>
        <Form.Item
          name="upload"
          label={<div className="upload-label">{t('productAdmin.upload.imageSection')}</div>}
        >
          <Upload
            name="image"
            action={`${API_URL}/image`}
            listType="picture"
            showUploadList={false}
            onChange={onChangeImage}
          >
            {imageUrl ? (
              <img id="upload-img" src={`${API_URL}/${imageUrl}`} alt="Uploaded product" />
            ) : (
              <div id="upload-img-placeholder">
                <img src="/images/icons/camera.png" alt="Camera icon" />
                <span>{t('productAdmin.upload.imageUpload')}</span>
              </div>
            )}
          </Upload>
        </Form.Item>
        <Divider />
        <Form.Item
          label={<div className="upload-label">{t('productAdmin.upload.sellerName')}</div>}
          name="seller"
          rules={[{ required: true, message: t('productAdmin.upload.sellerNameRequired') }]}
        >
          <Input
            className="upload-name"
            size="large"
            placeholder={t('productAdmin.upload.sellerNamePlaceholder')}
          />
        </Form.Item>
        <Divider />
        <Form.Item
          name="name"
          label={<div className="upload-label">{t('productAdmin.upload.productName')}</div>}
          rules={[{ required: true, message: t('productAdmin.upload.productNameRequired') }]}
        >
          <Input
            className="upload-name"
            size="large"
            placeholder={t('productAdmin.upload.productNamePlaceholder')}
          />
        </Form.Item>
        <Divider />
        <FormItem
          name="price"
          label={<div className="upload-label">{t('productAdmin.upload.price')}</div>}
          rules={[{ required: true, message: t('productAdmin.upload.priceRequired') }]}
        >
          <InputNumber defaultValue={0} className="upload-price" size="large" />
        </FormItem>
        <Divider />
        <Form.Item
          name="description"
          label={<div className="upload-label">{t('productAdmin.upload.description')}</div>}
          rules={[{ required: true, message: t('productAdmin.upload.descriptionRequired') }]}
        >
          <Input.TextArea
            size="large"
            id="product-description"
            showCount
            maxLength={300}
            placeholder={t('productAdmin.upload.descriptionPlaceholder')}
          />
        </Form.Item>
        <Form.Item>
          <Button id="submit-button" size="large" htmlType="submit">
            {t('productAdmin.upload.submit')}
          </Button>
        </Form.Item>
      </Form>
    </div>
    </ConfigProvider>
  );
}

export default UploadPage;
