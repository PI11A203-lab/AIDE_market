import React from 'react';

// 템플릿별 UI 미리보기 일러스트레이션 (어두운 테마)
const TemplateIllustrations = {
  // 쇼핑몰 (ID: 1) - 전자상거래 그래프 아이콘 그리드
  1: ({ color = '#667eea' }) => (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g opacity="0.9">
        {/* 3x3 그리드 - 각 셀 크기: 35x35, 간격: 5 */}
        {/* 첫 번째 줄 */}
        {/* 1. 체크리스트 */}
        <rect x="0" y="0" width="35" height="35" rx="4" fill="rgba(20, 20, 30, 0.6)" />
        <circle cx="8" cy="10" r="2.5" fill="#F44336" />
        <rect x="13" y="9" width="18" height="3" rx="1" fill="rgba(255, 255, 255, 0.5)" />
        <circle cx="8" cy="18" r="2.5" fill="#FF9800" />
        <rect x="13" y="17" width="15" height="3" rx="1" fill="rgba(255, 255, 255, 0.5)" />
        <circle cx="8" cy="26" r="2.5" fill="#4CAF50" />
        <rect x="13" y="25" width="20" height="3" rx="1" fill="rgba(255, 255, 255, 0.5)" />
        
        {/* 2. 라인 그래프 */}
        <rect x="40" y="0" width="35" height="35" rx="4" fill="rgba(20, 20, 30, 0.6)" />
        <path d="M45 25 L50 20 L55 22 L60 18 L65 21 L70 19" stroke="#FF9800" strokeWidth="2" fill="none" strokeLinecap="round" />
        
        {/* 3. 세로 바 차트 */}
        <rect x="80" y="0" width="35" height="35" rx="4" fill="rgba(20, 20, 30, 0.6)" />
        <rect x="88" y="20" width="5" height="12" rx="1" fill="#2196F3" />
        <rect x="96" y="15" width="5" height="17" rx="1" fill="#2196F3" />
        <rect x="104" y="22" width="5" height="10" rx="1" fill="#2196F3" />
        
        {/* 두 번째 줄 */}
        {/* 4. 가로 바 차트 (녹색) */}
        <rect x="0" y="40" width="35" height="35" rx="4" fill="rgba(20, 20, 30, 0.6)" />
        <rect x="5" y="52" width="20" height="3" rx="1" fill="#4CAF50" />
        <rect x="5" y="58" width="15" height="3" rx="1" fill="#4CAF50" />
        
        {/* 5. 가로 바 차트 (다색) */}
        <rect x="40" y="40" width="35" height="35" rx="4" fill="rgba(20, 20, 30, 0.6)" />
        <rect x="45" y="50" width="12" height="3" rx="1" fill="#2196F3" />
        <rect x="45" y="56" width="18" height="3" rx="1" fill="#FF9800" />
        <rect x="45" y="62" width="10" height="3" rx="1" fill="#4CAF50" />
        
        {/* 6. 라인 그래프 2 */}
        <rect x="80" y="40" width="35" height="35" rx="4" fill="rgba(20, 20, 30, 0.6)" />
        <path d="M85 60 L90 55 L95 57 L100 53 L105 56 L110 54" stroke="#FF9800" strokeWidth="2" fill="none" strokeLinecap="round" />
        
        {/* 세 번째 줄 */}
        {/* 7. 도넛 차트 */}
        <rect x="0" y="80" width="35" height="35" rx="4" fill="rgba(20, 20, 30, 0.6)" />
        <circle cx="17" cy="97" r="8" fill="none" stroke="#2196F3" strokeWidth="3" strokeDasharray="25.13 12.57" transform="rotate(-90 17 97)" />
        <circle cx="17" cy="97" r="8" fill="none" stroke="#FF9800" strokeWidth="3" strokeDasharray="12.57 25.13" strokeDashoffset="-12.57" transform="rotate(-90 17 97)" />
        
        {/* 8. 작은 파동선 3개 */}
        <rect x="40" y="80" width="35" height="35" rx="4" fill="rgba(20, 20, 30, 0.6)" />
        <path d="M45 92 L50 87 L55 89 L60 85" stroke="#9C27B0" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <path d="M45 97 L50 92 L55 94 L60 90" stroke="#E91E63" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <path d="M45 102 L50 97 L55 99 L60 95" stroke="#673AB7" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        
        {/* 9. 세로 바 차트 2 */}
        <rect x="80" y="80" width="35" height="35" rx="4" fill="rgba(20, 20, 30, 0.6)" />
        <rect x="88" y="95" width="5" height="15" rx="1" fill="#2196F3" />
        <rect x="96" y="92" width="5" height="18" rx="1" fill="#2196F3" />
        <rect x="104" y="97" width="5" height="13" rx="1" fill="#2196F3" />
      </g>
    </svg>
  ),

  // 회사 홈페이지 (ID: 2) - 웹사이트 분석 그래프 아이콘 그리드
  2: ({ color = '#667eea' }) => (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g opacity="0.9">
        {/* 첫 번째 줄 */}
        {/* 1. 체크리스트 (파란색) */}
        <rect x="0" y="0" width="35" height="35" rx="4" fill="rgba(20, 20, 30, 0.6)" />
        <circle cx="8" cy="10" r="2.5" fill="#2196F3" />
        <rect x="13" y="9" width="18" height="3" rx="1" fill="rgba(255, 255, 255, 0.5)" />
        <circle cx="8" cy="18" r="2.5" fill="#4CAF50" />
        <rect x="13" y="17" width="15" height="3" rx="1" fill="rgba(255, 255, 255, 0.5)" />
        <circle cx="8" cy="26" r="2.5" fill="#FF9800" />
        <rect x="13" y="25" width="20" height="3" rx="1" fill="rgba(255, 255, 255, 0.5)" />
        
        {/* 2. 라인 그래프 (파란색) */}
        <rect x="40" y="0" width="35" height="35" rx="4" fill="rgba(20, 20, 30, 0.6)" />
        <path d="M45 25 L50 20 L55 22 L60 18 L65 21 L70 19" stroke="#2196F3" strokeWidth="2" fill="none" strokeLinecap="round" />
        
        {/* 3. 세로 바 차트 */}
        <rect x="80" y="0" width="35" height="35" rx="4" fill="rgba(20, 20, 30, 0.6)" />
        <rect x="88" y="20" width="5" height="12" rx="1" fill="#2196F3" />
        <rect x="96" y="15" width="5" height="17" rx="1" fill="#4CAF50" />
        <rect x="104" y="22" width="5" height="10" rx="1" fill="#FF9800" />
        
        {/* 두 번째 줄 */}
        {/* 4. 가로 바 차트 (녹색) */}
        <rect x="0" y="40" width="35" height="35" rx="4" fill="rgba(20, 20, 30, 0.6)" />
        <rect x="5" y="52" width="20" height="3" rx="1" fill="#4CAF50" />
        <rect x="5" y="58" width="15" height="3" rx="1" fill="#4CAF50" />
        
        {/* 5. 가로 바 차트 (다색) */}
        <rect x="40" y="40" width="35" height="35" rx="4" fill="rgba(20, 20, 30, 0.6)" />
        <rect x="45" y="50" width="12" height="3" rx="1" fill="#2196F3" />
        <rect x="45" y="56" width="18" height="3" rx="1" fill="#FF9800" />
        <rect x="45" y="62" width="10" height="3" rx="1" fill="#4CAF50" />
        
        {/* 6. 라인 그래프 2 */}
        <rect x="80" y="40" width="35" height="35" rx="4" fill="rgba(20, 20, 30, 0.6)" />
        <path d="M85 60 L90 55 L95 57 L100 53 L105 56 L110 54" stroke="#2196F3" strokeWidth="2" fill="none" strokeLinecap="round" />
        
        {/* 세 번째 줄 */}
        {/* 7. 도넛 차트 */}
        <rect x="0" y="80" width="35" height="35" rx="4" fill="rgba(20, 20, 30, 0.6)" />
        <circle cx="17" cy="97" r="8" fill="none" stroke="#2196F3" strokeWidth="3" strokeDasharray="25.13 12.57" transform="rotate(-90 17 97)" />
        <circle cx="17" cy="97" r="8" fill="none" stroke="#FF9800" strokeWidth="3" strokeDasharray="12.57 25.13" strokeDashoffset="-12.57" transform="rotate(-90 17 97)" />
        
        {/* 8. 작은 파동선 3개 */}
        <rect x="40" y="80" width="35" height="35" rx="4" fill="rgba(20, 20, 30, 0.6)" />
        <path d="M45 92 L50 87 L55 89 L60 85" stroke="#9C27B0" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <path d="M45 97 L50 92 L55 94 L60 90" stroke="#E91E63" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <path d="M45 102 L50 97 L55 99 L60 95" stroke="#673AB7" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        
        {/* 9. 세로 바 차트 2 */}
        <rect x="80" y="80" width="35" height="35" rx="4" fill="rgba(20, 20, 30, 0.6)" />
        <rect x="88" y="95" width="5" height="15" rx="1" fill="#2196F3" />
        <rect x="96" y="92" width="5" height="18" rx="1" fill="#2196F3" />
        <rect x="104" y="97" width="5" height="13" rx="1" fill="#2196F3" />
      </g>
    </svg>
  ),

  // 음악 페이지 (ID: 3) - 스트리밍/음악 그래프 아이콘 그리드
  3: ({ color = '#667eea' }) => (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g opacity="0.9">
        {/* 첫 번째 줄 */}
        {/* 1. 재생 목록 (보라색 계열) */}
        <rect x="0" y="0" width="35" height="35" rx="4" fill="rgba(20, 20, 30, 0.6)" />
        <circle cx="8" cy="10" r="2.5" fill="#E91E63" />
        <rect x="13" y="9" width="18" height="3" rx="1" fill="rgba(255, 255, 255, 0.5)" />
        <circle cx="8" cy="18" r="2.5" fill="#9C27B0" />
        <rect x="13" y="17" width="15" height="3" rx="1" fill="rgba(255, 255, 255, 0.5)" />
        <circle cx="8" cy="26" r="2.5" fill="#673AB7" />
        <rect x="13" y="25" width="20" height="3" rx="1" fill="rgba(255, 255, 255, 0.5)" />
        
        {/* 2. 오디오 파형 (파란색) */}
        <rect x="40" y="0" width="35" height="35" rx="4" fill="rgba(20, 20, 30, 0.6)" />
        <rect x="45" y="20" width="3" height="10" rx="1" fill="#2196F3" />
        <rect x="50" y="15" width="3" height="15" rx="1" fill="#2196F3" />
        <rect x="55" y="18" width="3" height="12" rx="1" fill="#2196F3" />
        <rect x="60" y="12" width="3" height="18" rx="1" fill="#2196F3" />
        <rect x="65" y="22" width="3" height="8" rx="1" fill="#2196F3" />
        
        {/* 3. 재생 횟수 바 차트 */}
        <rect x="80" y="0" width="35" height="35" rx="4" fill="rgba(20, 20, 30, 0.6)" />
        <rect x="88" y="20" width="5" height="12" rx="1" fill="#E91E63" />
        <rect x="96" y="12" width="5" height="20" rx="1" fill="#9C27B0" />
        <rect x="104" y="17" width="5" height="15" rx="1" fill="#673AB7" />
        
        {/* 두 번째 줄 */}
        {/* 4. 음악 파형 라인 */}
        <rect x="0" y="40" width="35" height="35" rx="4" fill="rgba(20, 20, 30, 0.6)" />
        <path d="M5 60 L12 55 L18 60 L25 50 L32 57" stroke="#E91E63" strokeWidth="2" fill="none" strokeLinecap="round" />
        
        {/* 5. 장르 분포 (다색 바) */}
        <rect x="40" y="40" width="35" height="35" rx="4" fill="rgba(20, 20, 30, 0.6)" />
        <rect x="45" y="50" width="12" height="3" rx="1" fill="#E91E63" />
        <rect x="45" y="56" width="20" height="3" rx="1" fill="#9C27B0" />
        <rect x="45" y="62" width="8" height="3" rx="1" fill="#673AB7" />
        
        {/* 6. 재생 그래프 */}
        <rect x="80" y="40" width="35" height="35" rx="4" fill="rgba(20, 20, 30, 0.6)" />
        <path d="M85 70 L90 65 L95 67 L100 63 L105 66 L110 64" stroke="#9C27B0" strokeWidth="2" fill="none" strokeLinecap="round" />
        
        {/* 세 번째 줄 */}
        {/* 7. 도넛 차트 (장르) */}
        <rect x="0" y="80" width="35" height="35" rx="4" fill="rgba(20, 20, 30, 0.6)" />
        <circle cx="17" cy="97" r="8" fill="none" stroke="#E91E63" strokeWidth="3" strokeDasharray="25.13 12.57" transform="rotate(-90 17 97)" />
        <circle cx="17" cy="97" r="8" fill="none" stroke="#9C27B0" strokeWidth="3" strokeDasharray="12.57 25.13" strokeDashoffset="-12.57" transform="rotate(-90 17 97)" />
        
        {/* 8. 음악 노트 파형 3개 */}
        <rect x="40" y="80" width="35" height="35" rx="4" fill="rgba(20, 20, 30, 0.6)" />
        <path d="M45 97 L50 92 L55 94 L60 90" stroke="#E91E63" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <path d="M45 102 L50 97 L55 99 L60 95" stroke="#9C27B0" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <path d="M45 107 L50 102 L55 104 L60 100" stroke="#673AB7" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        
        {/* 9. 재생 통계 바 */}
        <rect x="80" y="80" width="35" height="35" rx="4" fill="rgba(20, 20, 30, 0.6)" />
        <rect x="88" y="95" width="5" height="15" rx="1" fill="#E91E63" />
        <rect x="96" y="88" width="5" height="22" rx="1" fill="#9C27B0" />
        <rect x="104" y="92" width="5" height="18" rx="1" fill="#673AB7" />
      </g>
    </svg>
  ),

  // 블로그/컨텐츠 (ID: 17) - 컨텐츠/문서 그래프 아이콘 그리드
  17: ({ color = '#667eea' }) => (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g opacity="0.9">
        {/* 첫 번째 줄 */}
        {/* 1. 문서 리스트 */}
        <rect x="0" y="0" width="35" height="35" rx="4" fill="rgba(20, 20, 30, 0.6)" />
        <rect x="8" y="10" width="20" height="2" rx="1" fill="rgba(255, 255, 255, 0.6)" />
        <rect x="8" y="15" width="25" height="2" rx="1" fill="rgba(255, 255, 255, 0.6)" />
        <rect x="8" y="20" width="18" height="2" rx="1" fill="rgba(255, 255, 255, 0.6)" />
        <circle cx="8" cy="11" r="1.5" fill="#43e97b" />
        <circle cx="8" cy="16" r="1.5" fill="#43e97b" />
        
        {/* 2. 라인 그래프 (녹색 계열) */}
        <rect x="40" y="0" width="35" height="35" rx="4" fill="rgba(20, 20, 30, 0.6)" />
        <path d="M45 25 L50 20 L55 22 L60 18 L65 21 L70 19" stroke="#43e97b" strokeWidth="2" fill="none" strokeLinecap="round" />
        
        {/* 3. 세로 바 차트 */}
        <rect x="80" y="0" width="35" height="35" rx="4" fill="rgba(20, 20, 30, 0.6)" />
        <rect x="88" y="18" width="5" height="14" rx="1" fill="#43e97b" />
        <rect x="96" y="15" width="5" height="17" rx="1" fill="#4facfe" />
        <rect x="104" y="20" width="5" height="12" rx="1" fill="#43e97b" />
        
        {/* 두 번째 줄 */}
        {/* 4. 텍스트 라인들 */}
        <rect x="0" y="40" width="35" height="35" rx="4" fill="rgba(20, 20, 30, 0.6)" />
        <rect x="5" y="52" width="25" height="2" rx="1" fill="rgba(255, 255, 255, 0.5)" />
        <rect x="5" y="58" width="20" height="2" rx="1" fill="rgba(255, 255, 255, 0.5)" />
        <rect x="5" y="64" width="28" height="2" rx="1" fill="rgba(255, 255, 255, 0.5)" />
        
        {/* 5. 가로 바 차트 (다색) */}
        <rect x="40" y="40" width="35" height="35" rx="4" fill="rgba(20, 20, 30, 0.6)" />
        <rect x="45" y="50" width="12" height="3" rx="1" fill="#43e97b" />
        <rect x="45" y="56" width="18" height="3" rx="1" fill="#4facfe" />
        <rect x="45" y="62" width="10" height="3" rx="1" fill="#43e97b" />
        
        {/* 6. 라인 그래프 2 */}
        <rect x="80" y="40" width="35" height="35" rx="4" fill="rgba(20, 20, 30, 0.6)" />
        <path d="M85 60 L90 55 L95 57 L100 53 L105 56 L110 54" stroke="#43e97b" strokeWidth="2" fill="none" strokeLinecap="round" />
        
        {/* 세 번째 줄 */}
        {/* 7. 도넛 차트 */}
        <rect x="0" y="80" width="35" height="35" rx="4" fill="rgba(20, 20, 30, 0.6)" />
        <circle cx="17" cy="97" r="8" fill="none" stroke="#43e97b" strokeWidth="3" strokeDasharray="25.13 12.57" transform="rotate(-90 17 97)" />
        <circle cx="17" cy="97" r="8" fill="none" stroke="#4facfe" strokeWidth="3" strokeDasharray="12.57 25.13" strokeDashoffset="-12.57" transform="rotate(-90 17 97)" />
        
        {/* 8. 작은 파동선 3개 */}
        <rect x="40" y="80" width="35" height="35" rx="4" fill="rgba(20, 20, 30, 0.6)" />
        <path d="M45 92 L50 87 L55 89 L60 85" stroke="#43e97b" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <path d="M45 97 L50 92 L55 94 L60 90" stroke="#4facfe" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <path d="M45 102 L50 97 L55 99 L60 95" stroke="#43e97b" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        
        {/* 9. 세로 바 차트 2 */}
        <rect x="80" y="80" width="35" height="35" rx="4" fill="rgba(20, 20, 30, 0.6)" />
        <rect x="88" y="95" width="5" height="15" rx="1" fill="#43e97b" />
        <rect x="96" y="92" width="5" height="18" rx="1" fill="#4facfe" />
        <rect x="104" y="97" width="5" height="13" rx="1" fill="#43e97b" />
      </g>
    </svg>
  ),

  // 비즈니스 분석 (ID: 8) - 비즈니스 데이터 분석 대시보드
  8: ({ color = '#2563eb' }) => (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g opacity="0.9">
        {/* 첫 번째 줄 - 매출 분석 */}
        <rect x="0" y="0" width="35" height="35" rx="4" fill="rgba(20, 20, 30, 0.6)" />
        <rect x="5" y="10" width="25" height="3" rx="1" fill="rgba(255, 255, 255, 0.5)" />
        <rect x="5" y="16" width="20" height="3" rx="1" fill="rgba(255, 255, 255, 0.5)" />
        <rect x="5" y="22" width="28" height="3" rx="1" fill="rgba(255, 255, 255, 0.5)" />
        <circle cx="8" cy="11" r="2" fill="#2563eb" />
        <circle cx="8" cy="17" r="2" fill="#10b981" />
        <circle cx="8" cy="23" r="2" fill="#f59e0b" />
        
        {/* 라인 그래프 - 매출 트렌드 */}
        <rect x="40" y="0" width="35" height="35" rx="4" fill="rgba(20, 20, 30, 0.6)" />
        <path d="M45 28 L50 22 L55 25 L60 18 L65 20 L70 15" stroke="#2563eb" strokeWidth="2" fill="none" strokeLinecap="round" />
        <circle cx="45" cy="28" r="2" fill="#2563eb" />
        <circle cx="70" cy="15" r="2" fill="#2563eb" />
        
        {/* 세로 바 차트 - 월별 매출 */}
        <rect x="80" y="0" width="35" height="35" rx="4" fill="rgba(20, 20, 30, 0.6)" />
        <rect x="88" y="20" width="5" height="12" rx="1" fill="#2563eb" />
        <rect x="96" y="15" width="5" height="17" rx="1" fill="#10b981" />
        <rect x="104" y="18" width="5" height="14" rx="1" fill="#f59e0b" />
        
        {/* 두 번째 줄 - 고객 분석 */}
        <rect x="0" y="40" width="35" height="35" rx="4" fill="rgba(20, 20, 30, 0.6)" />
        <circle cx="17" cy="57" r="10" fill="none" stroke="#2563eb" strokeWidth="2" strokeDasharray="18.85 12.57" transform="rotate(-90 17 57)" />
        <circle cx="17" cy="57" r="10" fill="none" stroke="#10b981" strokeWidth="2" strokeDasharray="12.57 18.85" strokeDashoffset="-12.57" transform="rotate(-90 17 57)" />
        
        {/* 가로 바 차트 - 고객 세그먼트 */}
        <rect x="40" y="40" width="35" height="35" rx="4" fill="rgba(20, 20, 30, 0.6)" />
        <rect x="45" y="50" width="20" height="3" rx="1" fill="#2563eb" />
        <rect x="45" y="56" width="15" height="3" rx="1" fill="#10b981" />
        <rect x="45" y="62" width="25" height="3" rx="1" fill="#f59e0b" />
        
        {/* 라인 그래프 2 - 고객 성장 */}
        <rect x="80" y="40" width="35" height="35" rx="4" fill="rgba(20, 20, 30, 0.6)" />
        <path d="M85 70 L90 65 L95 68 L100 62 L105 65 L110 60" stroke="#10b981" strokeWidth="2" fill="none" strokeLinecap="round" />
        
        {/* 세 번째 줄 - 트렌드 예측 */}
        <rect x="0" y="80" width="35" height="35" rx="4" fill="rgba(20, 20, 30, 0.6)" />
        <path d="M5 95 L12 90 L18 93 L25 88 L30 91" stroke="#f59e0b" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M5 100 L12 95 L18 98 L25 93 L30 96" stroke="#2563eb" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeDasharray="2 2" />
        
        {/* 도넛 차트 - 예측 정확도 */}
        <rect x="40" y="80" width="35" height="35" rx="4" fill="rgba(20, 20, 30, 0.6)" />
        <circle cx="57" cy="97" r="8" fill="none" stroke="#2563eb" strokeWidth="2" strokeDasharray="20 10" transform="rotate(-90 57 97)" />
        <circle cx="57" cy="97" r="8" fill="none" stroke="#10b981" strokeWidth="2" strokeDasharray="10 20" strokeDashoffset="-10" transform="rotate(-90 57 97)" />
        
        {/* 세로 바 차트 2 - 예측 결과 */}
        <rect x="80" y="80" width="35" height="35" rx="4" fill="rgba(20, 20, 30, 0.6)" />
        <rect x="88" y="95" width="5" height="15" rx="1" fill="#2563eb" />
        <rect x="96" y="90" width="5" height="20" rx="1" fill="#10b981" />
        <rect x="104" y="93" width="5" height="17" rx="1" fill="#f59e0b" />
      </g>
    </svg>
  ),

  // 머신러닝 프로젝트 (ID: 9) - ML 모델 대시보드
  9: ({ color = '#059669' }) => (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g opacity="0.9">
        {/* 첫 번째 줄 - 데이터 전처리 */}
        <rect x="0" y="0" width="35" height="35" rx="4" fill="rgba(20, 20, 30, 0.6)" />
        <rect x="5" y="8" width="25" height="2" rx="1" fill="rgba(255, 255, 255, 0.4)" />
        <rect x="5" y="13" width="20" height="2" rx="1" fill="rgba(255, 255, 255, 0.4)" />
        <rect x="5" y="18" width="28" height="2" rx="1" fill="rgba(255, 255, 255, 0.4)" />
        <rect x="5" y="23" width="22" height="2" rx="1" fill="rgba(255, 255, 255, 0.4)" />
        <circle cx="8" cy="9" r="1.5" fill="#059669" />
        <circle cx="8" cy="14" r="1.5" fill="#10b981" />
        <circle cx="8" cy="19" r="1.5" fill="#059669" />
        <circle cx="8" cy="24" r="1.5" fill="#10b981" />
        
        {/* 신경망 구조 */}
        <rect x="40" y="0" width="35" height="35" rx="4" fill="rgba(20, 20, 30, 0.6)" />
        <circle cx="50" cy="10" r="3" fill="#059669" />
        <circle cx="57" cy="17" r="3" fill="#10b981" />
        <circle cx="57" cy="25" r="3" fill="#059669" />
        <circle cx="65" cy="17" r="3" fill="#10b981" />
        <line x1="50" y1="10" x2="57" y2="17" stroke="#059669" strokeWidth="1" opacity="0.5" />
        <line x1="50" y1="10" x2="57" y2="25" stroke="#059669" strokeWidth="1" opacity="0.5" />
        <line x1="57" y1="17" x2="65" y2="17" stroke="#10b981" strokeWidth="1" opacity="0.5" />
        <line x1="57" y1="25" x2="65" y2="17" stroke="#059669" strokeWidth="1" opacity="0.5" />
        
        {/* 모델 성능 바 */}
        <rect x="80" y="0" width="35" height="35" rx="4" fill="rgba(20, 20, 30, 0.6)" />
        <rect x="88" y="20" width="5" height="12" rx="1" fill="#059669" />
        <rect x="96" y="12" width="5" height="20" rx="1" fill="#10b981" />
        <rect x="104" y="15" width="5" height="17" rx="1" fill="#059669" />
        
        {/* 두 번째 줄 - 모델 학습 */}
        <rect x="0" y="40" width="35" height="35" rx="4" fill="rgba(20, 20, 30, 0.6)" />
        <path d="M5 60 L12 55 L18 58 L25 52 L30 55" stroke="#059669" strokeWidth="2" fill="none" strokeLinecap="round" />
        <circle cx="5" cy="60" r="2" fill="#059669" />
        <circle cx="30" cy="55" r="2" fill="#10b981" />
        
        {/* 손실 함수 그래프 */}
        <rect x="40" y="40" width="35" height="35" rx="4" fill="rgba(20, 20, 30, 0.6)" />
        <path d="M45 70 L50 68 L55 65 L60 63 L65 60 L70 58" stroke="#10b981" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M45 70 L50 69 L55 67 L60 65 L65 63 L70 61" stroke="#059669" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeDasharray="2 2" opacity="0.6" />
        
        {/* 정확도 도넛 */}
        <rect x="80" y="40" width="35" height="35" rx="4" fill="rgba(20, 20, 30, 0.6)" />
        <circle cx="97" cy="57" r="10" fill="none" stroke="#059669" strokeWidth="2.5" strokeDasharray="47.12 15.71" transform="rotate(-90 97 57)" />
        <circle cx="97" cy="57" r="10" fill="none" stroke="#10b981" strokeWidth="2.5" strokeDasharray="15.71 47.12" strokeDashoffset="-15.71" transform="rotate(-90 97 57)" />
        
        {/* 세 번째 줄 - 평가 메트릭 */}
        <rect x="0" y="80" width="35" height="35" rx="4" fill="rgba(20, 20, 30, 0.6)" />
        <rect x="5" y="90" width="25" height="3" rx="1" fill="#059669" />
        <rect x="5" y="96" width="20" height="3" rx="1" fill="#10b981" />
        <rect x="5" y="102" width="28" height="3" rx="1" fill="#059669" />
        
        {/* 혼동 행렬 */}
        <rect x="40" y="80" width="35" height="35" rx="4" fill="rgba(20, 20, 30, 0.6)" />
        <rect x="45" y="85" width="12" height="12" rx="2" fill="#059669" opacity="0.7" />
        <rect x="58" y="85" width="12" height="12" rx="2" fill="#10b981" opacity="0.5" />
        <rect x="45" y="98" width="12" height="12" rx="2" fill="#10b981" opacity="0.5" />
        <rect x="58" y="98" width="12" height="12" rx="2" fill="#059669" opacity="0.7" />
        
        {/* ROC 곡선 */}
        <rect x="80" y="80" width="35" height="35" rx="4" fill="rgba(20, 20, 30, 0.6)" />
        <path d="M85 110 L90 105 L95 100 L100 95 L105 90 L110 88" stroke="#059669" strokeWidth="2" fill="none" strokeLinecap="round" />
        <line x1="85" y1="110" x2="110" y2="88" stroke="rgba(255,255,255,0.3)" strokeWidth="1" strokeDasharray="2 2" />
      </g>
    </svg>
  ),

  // 포트폴리오 사이트 (ID: 18) - 이미지/갤러리 그래프 아이콘 그리드
  18: ({ color = '#667eea' }) => (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g opacity="0.9">
        {/* 첫 번째 줄 */}
        {/* 1. 이미지 그리드 아이콘 */}
        <rect x="0" y="0" width="35" height="35" rx="4" fill="rgba(20, 20, 30, 0.6)" />
        <rect x="5" y="5" width="12" height="12" rx="2" fill="#fa709a" opacity="0.6" />
        <rect x="20" y="5" width="12" height="12" rx="2" fill="#fa709a" opacity="0.6" />
        <rect x="5" y="20" width="12" height="12" rx="2" fill="#fa709a" opacity="0.6" />
        <rect x="20" y="20" width="12" height="12" rx="2" fill="#fa709a" opacity="0.6" />
        
        {/* 2. 라인 그래프 (핑크 계열) */}
        <rect x="40" y="0" width="35" height="35" rx="4" fill="rgba(20, 20, 30, 0.6)" />
        <path d="M45 25 L50 20 L55 22 L60 18 L65 21 L70 19" stroke="#fa709a" strokeWidth="2" fill="none" strokeLinecap="round" />
        
        {/* 3. 세로 바 차트 */}
        <rect x="80" y="0" width="35" height="35" rx="4" fill="rgba(20, 20, 30, 0.6)" />
        <rect x="88" y="20" width="5" height="12" rx="1" fill="#fa709a" />
        <rect x="96" y="15" width="5" height="17" rx="1" fill="#E91E63" />
        <rect x="104" y="22" width="5" height="10" rx="1" fill="#fa709a" />
        
        {/* 두 번째 줄 */}
        {/* 4. 이미지 카드들 */}
        <rect x="0" y="40" width="35" height="35" rx="4" fill="rgba(20, 20, 30, 0.6)" />
        <rect x="5" y="45" width="10" height="8" rx="1" fill="#fa709a" opacity="0.5" />
        <rect x="17" y="45" width="10" height="8" rx="1" fill="#E91E63" opacity="0.5" />
        <rect x="5" y="55" width="22" height="6" rx="1" fill="rgba(255, 255, 255, 0.4)" />
        <rect x="5" y="63" width="18" height="6" rx="1" fill="rgba(255, 255, 255, 0.4)" />
        
        {/* 5. 가로 바 차트 (다색) */}
        <rect x="40" y="40" width="35" height="35" rx="4" fill="rgba(20, 20, 30, 0.6)" />
        <rect x="45" y="50" width="12" height="3" rx="1" fill="#fa709a" />
        <rect x="45" y="56" width="18" height="3" rx="1" fill="#E91E63" />
        <rect x="45" y="62" width="10" height="3" rx="1" fill="#fa709a" />
        
        {/* 6. 라인 그래프 2 */}
        <rect x="80" y="40" width="35" height="35" rx="4" fill="rgba(20, 20, 30, 0.6)" />
        <path d="M85 60 L90 55 L95 57 L100 53 L105 56 L110 54" stroke="#fa709a" strokeWidth="2" fill="none" strokeLinecap="round" />
        
        {/* 세 번째 줄 */}
        {/* 7. 도넛 차트 */}
        <rect x="0" y="80" width="35" height="35" rx="4" fill="rgba(20, 20, 30, 0.6)" />
        <circle cx="17" cy="97" r="8" fill="none" stroke="#fa709a" strokeWidth="3" strokeDasharray="25.13 12.57" transform="rotate(-90 17 97)" />
        <circle cx="17" cy="97" r="8" fill="none" stroke="#E91E63" strokeWidth="3" strokeDasharray="12.57 25.13" strokeDashoffset="-12.57" transform="rotate(-90 17 97)" />
        
        {/* 8. 작은 파동선 3개 */}
        <rect x="40" y="80" width="35" height="35" rx="4" fill="rgba(20, 20, 30, 0.6)" />
        <path d="M45 92 L50 87 L55 89 L60 85" stroke="#fa709a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <path d="M45 97 L50 92 L55 94 L60 90" stroke="#E91E63" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <path d="M45 102 L50 97 L55 99 L60 95" stroke="#fa709a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        
        {/* 9. 세로 바 차트 2 */}
        <rect x="80" y="80" width="35" height="35" rx="4" fill="rgba(20, 20, 30, 0.6)" />
        <rect x="88" y="95" width="5" height="15" rx="1" fill="#fa709a" />
        <rect x="96" y="92" width="5" height="18" rx="1" fill="#E91E63" />
        <rect x="104" y="97" width="5" height="13" rx="1" fill="#fa709a" />
      </g>
    </svg>
  ),
};

// 예시 이미지와 동일한 대시보드 스타일 일러스트레이션
const DashboardIllustration = ({ color = '#667eea' }) => (
  <svg viewBox="0 0 260 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: 'perspective(1000px) rotateY(-8deg) rotateX(2deg)' }}>
    {/* 반투명 대시보드 배경 */}
    <g opacity="0.9">
      {/* 상단 왼쪽 - 리스트 항목 */}
      <rect x="5" y="5" width="85" height="90" rx="6" fill="rgba(20, 20, 30, 0.8)" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="1" />
      <circle cx="18" cy="25" r="4" fill="#4CAF50" />
      <rect x="30" y="22" width="50" height="6" rx="2" fill="rgba(255, 255, 255, 0.6)" />
      <circle cx="18" cy="42" r="4" fill="#F44336" />
      <rect x="30" y="39" width="45" height="6" rx="2" fill="rgba(255, 255, 255, 0.6)" />
      <circle cx="18" cy="59" r="4" fill="#4CAF50" />
      <rect x="30" y="56" width="40" height="6" rx="2" fill="rgba(255, 255, 255, 0.6)" />
      <circle cx="18" cy="76" r="4" fill="#FF9800" />
      <rect x="30" y="73" width="35" height="6" rx="2" fill="rgba(255, 255, 255, 0.6)" />
      
      {/* 상단 중앙 - 라인 그래프 */}
      <rect x="100" y="5" width="75" height="90" rx="6" fill="rgba(20, 20, 30, 0.8)" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="1" />
      <path d="M110 75 L120 65 L130 70 L140 55 L150 60 L160 50 L165 65" stroke="#F44336" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M110 80 L120 70 L130 75 L140 60 L150 65 L160 55 L165 70" stroke="#4CAF50" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M110 85 L120 75 L130 80 L140 65 L150 70 L160 60 L165 75" stroke="#2196F3" strokeWidth="2" fill="none" strokeLinecap="round" />
      
      {/* 상단 오른쪽 - 세로 바 차트 */}
      <rect x="185" y="5" width="65" height="90" rx="6" fill="rgba(20, 20, 30, 0.8)" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="1" />
      <rect x="195" y="70" width="8" height="20" rx="2" fill="#2196F3" />
      <rect x="210" y="60" width="8" height="30" rx="2" fill="#2196F3" />
      <rect x="225" y="65" width="8" height="25" rx="2" fill="#2196F3" />
      <rect x="240" y="55" width="8" height="35" rx="2" fill="#2196F3" />
      
      {/* 중앙 왼쪽 - 데이터 카드 */}
      <rect x="5" y="105" width="55" height="45" rx="6" fill="rgba(20, 20, 30, 0.8)" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="1" />
      <rect x="12" y="112" width="20" height="6" rx="2" fill="rgba(255, 255, 255, 0.7)" />
      <rect x="12" y="122" width="35" height="8" rx="2" fill="#4CAF50" opacity="0.8" />
      <path d="M12 138 L15 135 L18 138" stroke="#4CAF50" strokeWidth="1.5" fill="none" />
      
      {/* 중앙 중앙 - 가로 바 차트 */}
      <rect x="70" y="105" width="80" height="45" rx="6" fill="rgba(20, 20, 30, 0.8)" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="1" />
      <rect x="78" y="115" width="30" height="4" rx="2" fill="#FF9800" />
      <rect x="78" y="123" width="45" height="4" rx="2" fill="#F44336" />
      <rect x="78" y="131" width="25" height="4" rx="2" fill="#4CAF50" />
      <rect x="78" y="139" width="35" height="4" rx="2" fill="#2196F3" />
      
      {/* 중앙 오른쪽 - 라인 그래프 2 */}
      <rect x="160" y="105" width="90" height="45" rx="6" fill="rgba(20, 20, 30, 0.8)" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="1" />
      <path d="M170 135 L180 125 L190 130 L200 115 L210 120 L220 110 L230 125" stroke="#FF9800" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M170 140 L180 130 L190 135 L200 120 L210 125 L220 115 L230 130" stroke="#9C27B0" strokeWidth="2" fill="none" strokeLinecap="round" />
      
      {/* 하단 왼쪽 - 파이 차트 */}
      <rect x="5" y="160" width="75" height="35" rx="6" fill="rgba(20, 20, 30, 0.8)" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="1" />
      <circle cx="42" cy="177" r="12" fill="none" stroke="#9C27B0" strokeWidth="6" strokeDasharray="18.85 18.85" transform="rotate(-90 42 177)" />
      <circle cx="42" cy="177" r="12" fill="none" stroke="#2196F3" strokeWidth="6" strokeDasharray="9.42 28.27" strokeDashoffset="-9.42" transform="rotate(-90 42 177)" />
      <circle cx="42" cy="177" r="12" fill="none" stroke="#4CAF50" strokeWidth="6" strokeDasharray="6.28 31.42" strokeDashoffset="-18.85" transform="rotate(-90 42 177)" />
      <circle cx="42" cy="177" r="12" fill="none" stroke="#FF9800" strokeWidth="6" strokeDasharray="4.71 33.98" strokeDashoffset="-25.13" transform="rotate(-90 42 177)" />
      
      {/* 하단 중앙 - 도넛 차트 3개 */}
      <rect x="90" y="160" width="70" height="35" rx="6" fill="rgba(20, 20, 30, 0.8)" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="1" />
      <circle cx="105" cy="177" r="8" fill="none" stroke="#2196F3" strokeWidth="3" strokeDasharray="18.85 9.42" transform="rotate(-90 105 177)" />
      <circle cx="125" cy="177" r="8" fill="none" stroke="#FF9800" strokeWidth="3" strokeDasharray="15.71 12.56" transform="rotate(-90 125 177)" />
      <circle cx="145" cy="177" r="8" fill="none" stroke="#E91E63" strokeWidth="3" strokeDasharray="12.57 15.71" transform="rotate(-90 145 177)" />
      
      {/* 하단 오른쪽 - 세로 바 차트 2 */}
      <rect x="170" y="160" width="80" height="35" rx="6" fill="rgba(20, 20, 30, 0.8)" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="1" />
      <rect x="180" y="170" width="10" height="20" rx="2" fill="#2196F3" />
      <rect x="195" y="165" width="10" height="25" rx="2" fill="#2196F3" />
      <rect x="210" y="172" width="10" height="18" rx="2" fill="#2196F3" />
      <rect x="225" y="168" width="10" height="22" rx="2" fill="#2196F3" />
    </g>
  </svg>
);

// 기본 일러스트레이션 (대시보드 스타일)
const DefaultIllustration = DashboardIllustration;

const TemplateIllustration = ({ templateId, category, color }) => {
  // templateId를 숫자로 변환 (문자열일 수 있음)
  const id = typeof templateId === 'string' ? parseInt(templateId, 10) : templateId;
  const IllustrationComponent = TemplateIllustrations[id] || DefaultIllustration;
  const categoryColors = {
    'web': '#667eea',
    'app': '#f093fb',
    'data': '#4facfe',
    'document': '#43e97b',
    'image': '#fa709a'
  };
  
  const illustrationColor = color || categoryColors[category] || '#667eea';
  
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <IllustrationComponent color={illustrationColor} />
    </div>
  );
};

export default TemplateIllustration;
