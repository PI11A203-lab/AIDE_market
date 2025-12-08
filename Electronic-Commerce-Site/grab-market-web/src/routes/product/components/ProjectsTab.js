import React from 'react';

export default function ProjectsTab({ projects }) {
  if (!projects || projects.length === 0) {
    return (
      <p className="text-gray-500 text-center py-10">
        No projects available
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {projects.map((project, idx) => (
        <div key={idx} className="border-l-4 border-gray-900 pl-6 py-4 bg-gray-50 rounded-r-xl">
          <h4 className="text-xl font-bold mb-2 text-gray-900">{project.title}</h4>
          <p className="text-gray-600 mb-3">{project.description}</p>
          <div className="flex flex-wrap gap-2 mb-3">
            {project.tech && project.tech.map((tech, i) => (
              <span key={i} className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-sm text-gray-700">
                {tech}
              </span>
            ))}
          </div>
          {project.result && (
            <div className="flex items-center gap-2 text-green-600 font-semibold">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                <polyline points="17 6 23 6 23 12"/>
              </svg>
              <span>{project.result}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

