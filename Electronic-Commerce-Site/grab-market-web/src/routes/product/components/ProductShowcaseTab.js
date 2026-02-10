import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const CODE_CATEGORIES = ['frontend', 'backend', 'management', 'infrastructure', 'security', 'documents'];

/**
 * 상품별 맞춤 프로젝트 탭: 한 줄 요약 → 사용처 카드 → 데모 CTA → 쇼케이스 카드
 * - modelia: 전용 데모 (예시 3종 + 3D)
 * - code 카테고리: 예시 코드 + 결과 텍스트 데모
 * - image: 예시 프롬프트 + 결과 이미지 영역(demoImageUrl 있으면 표시, 없으면 플레이스홀더 → 이미지만 교체해서 추가)
 */
export default function ProductShowcaseTab({ productKey = 'modelia', productName, techKey, demoImageUrl }) {
  const { t } = useTranslation();
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [selectedExample, setSelectedExample] = useState(1);
  const ns = `product.showcase.${productKey}`;
  const isModelia = productKey === 'modelia';
  const isImageCategory = productKey === 'image';
  const isCodeCategory = CODE_CATEGORIES.includes(productKey);
  const tech = techKey ? t(`product.showcase.tech.${techKey}`) : '';
  const interpolation = isModelia ? {} : { productName: productName || '', tech };

  const tNs = (key) => {
    const fullKey = `${ns}.${key}`;
    return t(fullKey, interpolation);
  };

  return (
    <div className="ProductShowcaseTab space-y-10">
      {/* [1] 한 줄 요약 (히어로) */}
      <section className="text-center py-6 px-4 bg-gradient-to-b from-neutral-50 to-white rounded-xl border border-neutral-100">
        <h3 className="text-xl font-bold text-neutral-800 mb-2">
          {tNs('heroTitle')}
        </h3>
        <p className="text-neutral-600 text-[15px] max-w-xl mx-auto">
          {tNs('heroSubtitle')}
        </p>
      </section>

      {/* [2] 이렇게 쓸 수 있어요 (4개 카드) */}
      <section>
        <h4 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide mb-4">
          {t('product.showcase.useCasesHeading')}
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="p-4 bg-white border border-neutral-200 rounded-xl text-center hover:border-neutral-300 hover:shadow-sm transition-all"
            >
              <div className="w-10 h-10 mx-auto mb-3 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-600 font-bold text-sm">
                {i}
              </div>
              <div className="font-semibold text-neutral-800 text-sm mb-1">
                {tNs(`useCase${i}Title`)}
              </div>
              <div className="text-neutral-500 text-xs leading-snug">
                {tNs(`useCase${i}Desc`)}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* [3] 미리 보기 / 데모 CTA */}
      <section className="flex justify-center">
        <button
          type="button"
          onClick={() => setDemoModalOpen(true)}
          className="px-6 py-3 bg-[#EBEBEB] text-neutral-800 font-medium rounded-lg hover:bg-[#E0E0E0] transition-colors"
        >
          {tNs('demoCta')}
        </button>
      </section>

      {/* [4] 이걸로 만든 것처럼 (쇼케이스 3개) */}
      <section>
        <h4 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide mb-4">
          {tNs('showcaseTitle')}
        </h4>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="border-l-4 border-neutral-500 pl-5 py-4 bg-neutral-50 rounded-r-xl"
            >
              <h5 className="text-base font-bold text-neutral-800 mb-1">
                {tNs(`project${i}Title`)}
              </h5>
              <p className="text-neutral-600 text-sm mb-2">
                {tNs(`project${i}Desc`)}
              </p>
              <p className="text-neutral-500 text-xs">
                {tNs(`project${i}Meta`)}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 데모 모달 */}
      {demoModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setDemoModalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Demo"
        >
          <div
            className="bg-white rounded-xl shadow-xl max-w-xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center px-6 py-4 border-b border-neutral-200">
              <h3 className="text-lg font-bold text-neutral-800">
                {isModelia ? t(`${ns}.demoTitle`) : `${productName} Demo`}
              </h3>
              <button
                type="button"
                onClick={() => setDemoModalOpen(false)}
                className="text-neutral-500 hover:text-neutral-700 text-2xl leading-none"
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              {/* Modelia: 3버튼 + 코드/결과/3D */}
              {isModelia && (
                <>
                  <p className="text-neutral-500 text-sm mb-4">
                    {t('product.showcase.demoHint')}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {[1, 2, 3].map((i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setSelectedExample(i)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          selectedExample === i
                            ? 'bg-neutral-600 text-white'
                            : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                        }`}
                      >
                        {t(`${ns}.demoExample${i}Label`)}
                      </button>
                    ))}
                  </div>
                  <div className="space-y-3">
                    <div>
                      <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                        {t(`${ns}.demoInputLabel`)}
                      </span>
                      <pre className="mt-1 p-4 bg-[#EBEBEB] text-neutral-800 rounded-lg text-sm overflow-x-auto font-mono whitespace-pre-wrap">
                        {t(`${ns}.demoExample${selectedExample}Code`)}
                      </pre>
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                        {t(`${ns}.demoOutputLabel`)}
                      </span>
                      <div className="mt-1 flex gap-3 items-start">
                        <div
                          className="flex-1 min-h-[100px] rounded-lg border-2 border-dashed border-neutral-300 bg-gradient-to-br from-neutral-50 to-neutral-100 flex items-center justify-center"
                          style={{ perspective: '120px' }}
                        >
                          <div
                            className="w-16 h-16 bg-neutral-300 rounded border-2 border-neutral-400"
                            style={{
                              transform: 'rotateX(12deg) rotateY(20deg)',
                              boxShadow: '4px 4px 0 rgba(0,0,0,0.1)',
                            }}
                            title="3D Preview"
                          />
                        </div>
                        <div className="flex-shrink-0 py-2 px-3 bg-green-50 border border-green-200 rounded-lg">
                          <span className="text-sm font-mono text-green-800">
                            ✓ {t(`${ns}.demoExample${selectedExample}Result`)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* 코드 카테고리: 상품(techKey)별 예시 코드 + 결과 */}
              {isCodeCategory && (
                <div className="space-y-4">
                  <div>
                    <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                      {t('product.showcase.demoInputLabel')}
                    </span>
                    <pre className="mt-1 p-4 bg-[#EBEBEB] text-neutral-800 rounded-lg text-sm overflow-x-auto font-mono whitespace-pre-wrap">
                      {t(`product.showcase.demos.${productKey}.${techKey}.code`, { defaultValue: tNs('demoExampleCode') })}
                    </pre>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                      {t('product.showcase.demoOutputLabel')}
                    </span>
                    <pre className="mt-1 p-4 bg-neutral-50 border border-neutral-200 rounded-lg text-sm font-mono whitespace-pre-wrap text-green-800">
                      {t(`product.showcase.demos.${productKey}.${techKey}.result`, { defaultValue: tNs('demoExampleResult') })}
                    </pre>
                  </div>
                </div>
              )}

              {/* 이미지 카테고리: 상품(techKey)별 프롬프트 + 결과 이미지 영역(이미지만 교체 가능) */}
              {isImageCategory && !isModelia && (
                <div className="space-y-4">
                  <div>
                    <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                      {t('product.showcase.demoInputLabel')}
                    </span>
                    <pre className="mt-1 p-4 bg-[#EBEBEB] text-neutral-800 rounded-lg text-sm overflow-x-auto font-mono whitespace-pre-wrap">
                      {techKey ? t(`product.showcase.demos.image.${techKey}.prompt`, { defaultValue: tNs('demoExamplePrompt') }) : tNs('demoExamplePrompt')}
                    </pre>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                      {tNs('demoImageLabel')}
                    </span>
                    <div className="mt-1 rounded-lg border-2 border-dashed border-neutral-300 bg-neutral-50 overflow-hidden min-h-[200px] flex items-center justify-center">
                      {demoImageUrl ? (
                        <img
                          src={demoImageUrl}
                          alt={tNs('demoImageLabel')}
                          className="max-w-full max-h-[320px] object-contain"
                        />
                      ) : (
                        <div className="w-full min-h-[200px] flex flex-col items-center justify-center gap-2 text-neutral-400 py-8">
                          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
                          </svg>
                          <span className="text-sm">
                            {t('product.showcase.demoImagePlaceholder', '데모 이미지를 추가하려면 config의 demoImageUrl을 설정하세요')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
