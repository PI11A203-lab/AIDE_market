import React from 'react';
import VuelinWidget from './VuelinWidget';

export default function ProjectsTab({ projects }) {
  const hasProjects = Array.isArray(projects) && projects.length > 0;

  return (
    <div className="space-y-8">
      {/* Vue.js AI 프로젝트 설명 위젯 */}
      <VuelinWidget projects={projects || []} />

      {/* 기존 프로젝트 카드들 */}
      {hasProjects ? (
        <div className="space-y-6">
          {projects.map((project, idx) => (
            <div
              key={idx}
              className="border-l-4 border-gray-900 pl-6 py-4 bg-gray-50 rounded-r-xl"
            >
              <h4 className="text-xl font-bold mb-2 text-gray-900">
                {project.title}
              </h4>
              <p className="text-gray-600 mb-3">{project.description}</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {project.tech &&
                  project.tech.map((tech, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-sm text-gray-700"
                    >
                      {tech}
                    </span>
                  ))}
              </div>
              {project.result && (
                <div className="flex items-center gap-2 text-green-600 font-semibold">
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                    <polyline points="17 6 23 6 23 12" />
                  </svg>
                  <span>{project.result}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center py-6 text-sm">
          아직 등록된 프로젝트가 없습니다. 위의 예시처럼 Vue.js 기반 프로젝트를
          추가해 보세요.
        </p>
      )}
    </div>
  );
}

