import React, { useState } from 'react';
import { message, Upload } from 'antd';
import { useTranslation } from 'react-i18next';
import { UploadOutlined } from '@ant-design/icons';

export default function StudentDocumentUpload({ 
  onUpload, 
  uploading,
  currentDocument,
  disabled = false
}) {
  const { t } = useTranslation();
  // 이미 업로드된 문서가 있으면 fileList에 표시하지 않음 (업로드 섹션 숨김)
  const [fileList, setFileList] = useState([]);

  const handleUpload = () => {
    const selectedFile = fileList[0];
    if (!selectedFile) {
      message.warning(t('profile.studentVerification.page.upload.fileRequired'));
      return;
    }

    // originFileObj에서 File 객체 가져오기
    const file = selectedFile.originFileObj;
    if (!file) {
      message.warning(t('profile.studentVerification.page.upload.fileReSelect'));
      return;
    }

    onUpload(file);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('profile.studentVerification.page.upload.title')}</h2>
      
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">
          {t('profile.studentVerification.page.upload.description')}
        </p>
        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
          <li>{t('profile.studentVerification.page.upload.documentTypes.studentId')}</li>
          <li>{t('profile.studentVerification.page.upload.documentTypes.enrollment')}</li>
          <li>{t('profile.studentVerification.page.upload.documentTypes.registration')}</li>
        </ul>
      </div>

      <Upload
        fileList={fileList}
        disabled={disabled || uploading}
        beforeUpload={(file) => {
          // 파일 형식 검증
          const isImage = file.type.startsWith('image/');
          const isPdf = file.type === 'application/pdf';
          if (!isImage && !isPdf) {
            message.error(t('profile.studentVerification.page.upload.fileTypeError'));
            return false;
          }
          
          // 파일 크기 제한 (10MB)
          const isLt10M = file.size / 1024 / 1024 < 10;
          if (!isLt10M) {
            message.error(t('profile.studentVerification.page.upload.fileSizeError'));
            return false;
          }
          
          // antd Upload가 기대하는 형식으로 fileList에 저장
          setFileList([{
            uid: file.uid || `${Date.now()}-${file.name}`,
            name: file.name,
            status: 'done',
            originFileObj: file
          }]);
          return false; // 자동 업로드 방지
        }}
        onRemove={() => {
          setFileList([]);
        }}
        maxCount={1}
      >
        <button 
          disabled={disabled || uploading}
          className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <UploadOutlined />
          <span>{t('profile.studentVerification.page.upload.selectFile')}</span>
        </button>
      </Upload>

      {fileList.length > 0 && !disabled && (
        <div className="mt-4">
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="w-full px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            {uploading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin">⏳</span>
                {t('profile.studentVerification.page.upload.uploading')}
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                {t('profile.studentVerification.page.upload.uploadButton')}
              </span>
            )}
          </button>
          <p className="mt-2 text-xs text-gray-500 text-center">
            {t('profile.studentVerification.page.upload.uploadNote')}
          </p>
        </div>
      )}

      {disabled && !currentDocument && (
        <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <p className="text-sm text-gray-600 text-center">
            {t('profile.studentVerification.page.upload.disabledMessage')}
          </p>
        </div>
      )}

      {currentDocument && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm font-semibold text-green-900 mb-2">{t('profile.studentVerification.page.upload.uploadedMessage')}</p>
          <a
            href={currentDocument}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline text-sm"
          >
            {t('profile.studentVerification.page.upload.viewDocument', { filename: currentDocument.split('/').pop() })}
          </a>
        </div>
      )}
    </div>
  );
}

