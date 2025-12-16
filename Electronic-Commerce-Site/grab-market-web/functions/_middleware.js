// Cloudflare Pages Functions - React Router 지원
// 모든 경로를 index.html로 리다이렉트
export async function onRequest(context) {
  const { request, next } = context;
  const url = new URL(request.url);
  
  // 정적 파일 (JS, CSS, 이미지 등)은 그대로 서빙
  if (url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot|json)$/)) {
    return next();
  }
  
  // 모든 다른 경로는 index.html로 리다이렉트 (React Router 지원)
  const indexUrl = new URL('/index.html', request.url);
  const indexRequest = new Request(indexUrl, request);
  return next(indexRequest);
}

