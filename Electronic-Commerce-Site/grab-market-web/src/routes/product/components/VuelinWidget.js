import React from 'react';

export default function VuelinWidget({ projects = [] }) {
  const topProjects = projects.slice(0, 3);

  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white mb-8">
      {/* Header */}
      <div className="bg-black px-5 py-4 flex items-center gap-3 text-white">
        <div className="w-10 h-10 rounded-lg bg-white text-gray-900 flex items-center justify-center font-semibold text-lg">
          V
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold">Vuelin</span>
          <span className="text-[11px] text-gray-400">Vue.js 개발 전문 AI</span>
        </div>
        <span className="ml-auto text-[11px] px-3 py-1 rounded-full bg-indigo-500">
          Vue.js 전문
        </span>
      </div>

      {/* Body */}
      <div className="p-5 bg-gray-50 space-y-4">
        {/* Q1 */}
        <div className="flex justify-end">
          <div className="max-w-[70%] rounded-2xl rounded-br-sm bg-black text-white text-sm px-4 py-3">
            Vue.js에 대해 알려줘
          </div>
        </div>
        <div className="flex gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-indigo-500 flex items-center justify-center text-xs font-semibold text-indigo-500 bg-white">
            V
          </div>
          <div className="max-w-[75%] rounded-2xl rounded-bl-sm bg-white border border-gray-200 text-sm px-4 py-3 leading-relaxed">
            <p className="mb-2">
              <strong className="font-semibold text-gray-900">Vue.js</strong>
              는 프로그레시브 프론트엔드 프레임워크입니다.
            </p>
            <p className="text-gray-800 text-sm mb-1 font-semibold">주요 특징</p>
            <ul className="text-gray-600 text-sm list-disc list-inside space-y-0.5">
              <li>반응형 데이터 바인딩</li>
              <li>컴포넌트 기반 구조</li>
              <li>가벼운 번들 사이즈</li>
              <li>낮은 러닝 커브</li>
            </ul>
          </div>
        </div>

        {/* Q2 */}
        <div className="flex justify-end">
          <div className="max-w-[70%] rounded-2xl rounded-br-sm bg-black text-white text-sm px-4 py-3">
            어떤 AI랑 같이 쓰면 좋아?
          </div>
        </div>
        <div className="flex gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-indigo-500 flex items-center justify-center text-xs font-semibold text-indigo-500 bg-white">
            V
          </div>
          <div className="max-w-[75%] rounded-2xl rounded-bl-sm bg-white border border-gray-200 text-sm px-4 py-3 leading-relaxed">
            <p className="font-semibold text-gray-900 mb-2">추천 팀 구성</p>
            <div className="space-y-2">
              <div className="border border-gray-100 rounded-lg px-3 py-2 bg-gray-50">
                <p className="font-semibold text-gray-900 text-sm">T-Guard</p>
                <p className="text-xs text-gray-600">TypeScript – Vue 타입 안정성</p>
              </div>
              <div className="border border-gray-100 rounded-lg px-3 py-2 bg-gray-50">
                <p className="font-semibold text-gray-900 text-sm">ExpressKid</p>
                <p className="text-xs text-gray-600">Node.js – API 백엔드</p>
              </div>
              <div className="border border-gray-100 rounded-lg px-3 py-2 bg-gray-50">
                <p className="font-semibold text-gray-900 text-sm">NuxtMaster</p>
                <p className="text-xs text-gray-600">Nuxt.js – SSR/SSG</p>
              </div>
            </div>
          </div>
        </div>

        {/* Q3 – 코드 예제 요약 */}
        <div className="flex justify-end">
          <div className="max-w-[70%] rounded-2xl rounded-br-sm bg-black text-white text-sm px-4 py-3">
            코드 예제 보여줘
          </div>
        </div>
        <div className="flex gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-indigo-500 flex items-center justify-center text-xs font-semibold text-indigo-500 bg-white">
            V
          </div>
          <div className="flex-1 rounded-2xl rounded-bl-sm bg-white border border-gray-200 text-sm px-4 py-3 leading-relaxed">
            <p className="font-semibold text-gray-900 mb-1">Composition API Todo 예제</p>
            <p className="text-xs text-gray-600 mb-2">
              <code className="bg-gray-100 px-1 py-0.5 rounded text-[11px]">ref</code> 와{' '}
              <code className="bg-gray-100 px-1 py-0.5 rounded text-[11px]">computed</code> 로
              반응형 상태를 관리하고, <code className="bg-gray-100 px-1 py-0.5 rounded text-[11px]">useTodos</code>{' '}
              훅으로 로직을 분리합니다.
            </p>
            <div className="bg-[#111827] text-[11px] text-gray-100 rounded-lg p-3 font-mono overflow-x-auto">
              <div className="text-gray-400 mb-1">useTodos.ts (요약)</div>
              <span className="text-purple-300">import</span> {'{'} ref, computed {'}'}{' '}
              <span className="text-purple-300">from</span> <span className="text-emerald-300">'vue'</span>
              {'\n'}
              <span className="text-purple-300">export function</span>{' '}
              <span className="text-sky-300">useTodos</span>() {'{'}{'\n'}
              &nbsp;&nbsp;<span className="text-purple-300">const</span> todos ={' '}
              <span className="text-sky-300">ref</span>([]){'\n'}
              &nbsp;&nbsp;<span className="text-purple-300">const</span> completed ={' '}
              <span className="text-sky-300">computed</span>(() =&gt;{'\n'}
              &nbsp;&nbsp;&nbsp;&nbsp;todos.value.filter(t =&gt; t.done){'\n'}
              &nbsp;&nbsp;){'\n'}
              &nbsp;&nbsp;<span className="text-purple-300">function</span>{' '}
              <span className="text-sky-300">addTodo</span>(text) {'{'}{'\n'}
              &nbsp;&nbsp;&nbsp;&nbsp;todos.value.push({'{'} text, done:{' '}
              <span className="text-purple-300">false</span> {'}'}){'\n'}
              &nbsp;&nbsp;}{'\n'}
              &nbsp;&nbsp;<span className="text-purple-300">return</span> {'{'} todos, completed,
              addTodo {'}'}{'\n'}
              {'}'}
            </div>
          </div>
        </div>

        {/* Q4 – 실제 프로젝트 */}
        <div className="flex justify-end">
          <div className="max-w-[70%] rounded-2xl rounded-br-sm bg-black text-white text-sm px-4 py-3">
            실제로 이걸로 뭘 만들 수 있어?
          </div>
        </div>
        <div className="flex gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-indigo-500 flex items-center justify-center text-xs font-semibold text-indigo-500 bg-white">
            V
          </div>
          <div className="flex-1 rounded-2xl rounded-bl-sm bg-white border border-gray-200 text-sm px-4 py-3 leading-relaxed">
            <p className="font-semibold text-gray-900 mb-2">Vue.js로 만들 수 있는 프로젝트</p>

            {/* 만약 product 데이터에 projects가 있으면 그것을 사용 */}
            {topProjects.length > 0 ? (
              <div className="space-y-3">
                {topProjects.map((p, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-50 border border-gray-200 rounded-lg p-3"
                  >
                    <div className="text-sm font-semibold text-indigo-600 mb-1">
                      {p.title}
                    </div>
                    <div className="text-xs text-gray-600 mb-1">
                      {p.description}
                    </div>
                    {Array.isArray(p.tech) && p.tech.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {p.tech.map((t, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-full bg-white border border-gray-200 text-[11px] text-gray-700"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                    {p.result && (
                      <div className="mt-2 text-[11px] text-gray-500">
                        결과: {p.result}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <div className="text-sm font-semibold text-indigo-600 mb-1">
                    💼 관리자 CRM 시스템
                  </div>
                  <div className="text-xs text-gray-600">
                    고객 관리, 대시보드, 실시간 업데이트 등 Vue + Express 기반의
                    관리자용 웹앱
                  </div>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <div className="text-sm font-semibold text-indigo-600 mb-1">
                    📊 데이터 시각화 대시보드
                  </div>
                  <div className="text-xs text-gray-600">
                    차트·그래프·필터를 활용한 인터랙티브 분석 도구 (Chart.js /
                    ECharts 연동)
                  </div>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <div className="text-sm font-semibold text-indigo-600 mb-1">
                    📝 실시간 협업 툴
                  </div>
                  <div className="text-xs text-gray-600">
                    Kanban 보드, 작업 관리, WebSocket 기반 실시간 동기화
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


