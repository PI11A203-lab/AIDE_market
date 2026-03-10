import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function scrollToTop() {
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

/**
 * 라우트 변경 시 스크롤을 페이지 맨 위로 이동시킵니다.
 * 비동기 렌더·브라우저 스크롤 복원 대응으로 즉시 + 다음 프레임 + 짧은 지연 후 재실행합니다.
 */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // 브라우저 자동 스크롤 복원 비활성화 (해당 탭에서만)
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    scrollToTop();

    // React가 DOM을 반영한 뒤 한 번 더 스크롤
    const rafId = requestAnimationFrame(() => {
      scrollToTop();
    });

    // 비동기로 콘텐츠가 채워지는 페이지(상품 등) 대응
    const timeoutId = setTimeout(scrollToTop, 100);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timeoutId);
    };
  }, [pathname]);

  return null;
}

export default ScrollToTop;
