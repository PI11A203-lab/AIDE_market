import React, { useState } from 'react';
import { X as CloseIcon, Copy, Check, Instagram, Link2, Share2 } from 'lucide-react';
import { message } from 'antd';

export default function ShareModal({ isOpen, onClose, productName, productUrl }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(productUrl);
      setCopied(true);
      message.success('링크가 클립보드에 복사되었습니다.');
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      // 클립보드 API가 지원되지 않는 경우 대체 방법
      const textArea = document.createElement('textarea');
      textArea.value = productUrl;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        message.success('링크가 클립보드에 복사되었습니다.');
        setTimeout(() => {
          setCopied(false);
        }, 2000);
      } catch (err) {
        message.error('링크 복사에 실패했습니다.');
      }
      document.body.removeChild(textArea);
    }
  };

  const handleWebShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: productName,
          text: `${productName}를 확인해보세요!`,
          url: productUrl,
        });
        onClose();
      } catch (err) {
        // 사용자가 공유를 취소한 경우
        if (err.name !== 'AbortError') {
          console.error('공유 실패:', err);
        }
      }
    } else {
      // Web Share API가 지원되지 않으면 링크 복사
      handleCopyLink();
    }
  };

  const handleSocialShare = (platform) => {
    let shareUrl = '';
    const encodedUrl = encodeURIComponent(productUrl);
    const encodedTitle = encodeURIComponent(productName);

    switch (platform) {
      case 'instagram':
        // Instagram은 웹에서 직접 공유 링크를 제공하지 않으므로 링크 복사 안내
        handleCopyLink();
        message.info('링크를 복사했습니다. Instagram 앱에서 붙여넣어 공유하세요.');
        return;
      case 'x':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
        break;
      default:
        return;
    }

    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div 
        className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">공유하기</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
          >
            <CloseIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="space-y-3">
          {/* Web Share API (모바일) */}
          {navigator.share && (
            <button
              onClick={handleWebShare}
              className="w-full flex items-center gap-3 px-4 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              <Share2 className="w-5 h-5" />
              <span className="font-semibold">공유하기</span>
            </button>
          )}

          {/* 링크 복사 */}
          <button
            onClick={handleCopyLink}
            className="w-full flex items-center gap-3 px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-green-600">복사 완료!</span>
              </>
            ) : (
              <>
                <Copy className="w-5 h-5 text-gray-600" />
                <span className="font-semibold text-gray-900">링크 복사</span>
              </>
            )}
          </button>

          {/* 소셜 미디어 공유 */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => handleSocialShare('instagram')}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              <Instagram className="w-5 h-5" />
              <span className="font-semibold">Instagram</span>
            </button>
            <button
              onClick={() => handleSocialShare('x')}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              <span className="font-semibold">X</span>
            </button>
          </div>

          {/* 링크 URL 표시 */}
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Link2 className="w-4 h-4 text-gray-500" />
              <span className="text-xs text-gray-500 font-medium">공유 링크</span>
            </div>
            <p className="text-sm text-gray-700 break-all">{productUrl}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

