import React, { useState } from 'react';
import { message, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

export default function StudentDocumentUpload({ 
  onUpload, 
  uploading,
  currentDocument 
}) {
  const [fileList, setFileList] = useState(currentDocument ? [{
    uid: '-1',
    name: '학생증',
    status: 'done',
    url: currentDocument
  }] : []);

  const handleUpload = () => {
    if (fileList.length === 0 || !fileList[0].originFileObj) {
      message.warning('학생증 파일을 선택해주세요.');
      return;
    }

    onUpload(fileList[0].originFileObj);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">학생증 업로드</h2>
      
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">
          다음 서류 중 하나를 업로드해주세요:
        </p>
        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
          <li>학생증 (앞면, 뒷면 모두 포함)</li>
          <li>재학증명서</li>
          <li>수강신청증 (최근 학기)</li>
        </ul>
      </div>

      <Upload
        fileList={fileList}
        beforeUpload={(file) => {
          // 파일 형식 검증
          const isImage = file.type.startsWith('image/');
          const isPdf = file.type === 'application/pdf';
          if (!isImage && !isPdf) {
            message.error('이미지 또는 PDF 파일만 업로드 가능합니다.');
            return false;
          }
          
          // 파일 크기 제한 (10MB)
          const isLt10M = file.size / 1024 / 1024 < 10;
          if (!isLt10M) {
            message.error('파일 크기는 10MB 이하여야 합니다.');
            return false;
          }
          
          setFileList([file]);
          return false; // 자동 업로드 방지
        }}
        onRemove={() => {
          setFileList([]);
        }}
        maxCount={1}
      >
        <button className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
          <UploadOutlined />
          <span>파일 선택</span>
        </button>
      </Upload>

      {fileList.length > 0 && fileList[0].originFileObj && (
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="mt-4 w-full px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-900 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? '업로드 중...' : '학생 인증 신청'}
        </button>
      )}

      {currentDocument && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-2">현재 업로드된 문서:</p>
          <a
            href={currentDocument}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            {currentDocument.split('/').pop()}
          </a>
        </div>
      )}
    </div>
  );
}

