import React, { useState } from 'react';
import { message, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

export default function StudentDocumentUpload({ 
  onUpload, 
  uploading,
  currentDocument,
  disabled = false
}) {
  // 이미 업로드된 문서가 있으면 fileList에 표시하지 않음 (업로드 섹션 숨김)
  const [fileList, setFileList] = useState([]);

  const handleUpload = () => {
    const selectedFile = fileList[0];
    if (!selectedFile) {
      message.warning('학생증 파일을 선택해주세요.');
      return;
    }

    // originFileObj에서 File 객체 가져오기
    const file = selectedFile.originFileObj;
    if (!file) {
      message.warning('파일을 다시 선택해주세요.');
      return;
    }

    onUpload(file);
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
        disabled={disabled || uploading}
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
          <span>파일 선택</span>
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
                업로드 중...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                📤 학생 인증 신청하기
              </span>
            )}
          </button>
          <p className="mt-2 text-xs text-gray-500 text-center">
            업로드 버튼을 클릭하면 관리자 검토 목록에 표시됩니다
          </p>
        </div>
      )}

      {disabled && !currentDocument && (
        <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <p className="text-sm text-gray-600 text-center">
            현재 상태에서는 새 문서를 업로드할 수 없습니다.
          </p>
        </div>
      )}

      {currentDocument && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm font-semibold text-green-900 mb-2">✓ 문서가 업로드되었습니다</p>
          <a
            href={currentDocument}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline text-sm"
          >
            {currentDocument.split('/').pop()} (클릭하여 확인)
          </a>
        </div>
      )}
    </div>
  );
}

