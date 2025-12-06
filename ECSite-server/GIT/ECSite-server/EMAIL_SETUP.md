# 이메일 설정 가이드

비밀번호 재설정 기능을 사용하려면 이메일 서버(SMTP) 설정이 필요합니다.

## 1. Nodemailer 설치

```bash
cd ECSite-server/GIT/ECSite-server
npm install nodemailer
```

## 2. 환경 변수 설정

`.env` 파일을 생성하거나 수정하여 다음 환경 변수를 설정하세요:

```env
# 이메일 설정 (SMTP) - 기본값이 이미 설정되어 있음
# 비밀번호와 포트는 실제 서버 설정에 맞게 조정 필요
SMTP_HOST=kigawa.sakura.ne.jp
SMTP_PORT=587  # 실제 서버 포트 확인 필요 (일반: 587, 465, 25)
SMTP_SECURE=false  # 587/25는 false, 465는 true
SMTP_USER=sumin@kigawa.net
SMTP_PASSWORD=여기에_실제_비밀번호_입력
SMTP_FROM=sumin@kigawa.net

# 프론트엔드 URL (이메일 링크 생성용)
FRONTEND_URL=http://localhost:3000
```

**중요**: `SMTP_PORT`는 실제 서버 설정을 확인해야 합니다:
- **587**: STARTTLS (가장 일반적, 권장)
- **465**: SSL/TLS 암호화
- **25**: 일반 SMTP (보안 약함)

sakura.ne.jp 호스팅 관리 패널에서 SMTP 포트를 확인하거나, 이메일 클라이언트 설정을 참고하세요.

**참고**: 기본값이 이미 코드에 설정되어 있으므로, `.env` 파일에 `SMTP_PASSWORD`만 설정해도 됩니다:
```env
SMTP_PASSWORD=여기에_실제_비밀번호_입력
```

## 3. 주요 이메일 서비스 설정 예시

### Gmail 사용 시

1. Google 계정에서 "앱 비밀번호" 생성:
   - Google 계정 설정 → 보안 → 2단계 인증 활성화
   - 앱 비밀번호 생성
   - 생성된 비밀번호를 `SMTP_PASSWORD`에 사용

2. `.env` 설정:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=생성한앱비밀번호
SMTP_FROM=your-email@gmail.com
```

### Outlook/Hotmail 사용 시

```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@outlook.com
SMTP_PASSWORD=your-password
SMTP_FROM=your-email@outlook.com
```

### SendGrid 사용 시

```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASSWORD=your-sendgrid-api-key
SMTP_FROM=noreply@yourdomain.com
```

### Mailgun 사용 시

```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=postmaster@yourdomain.mailgun.org
SMTP_PASSWORD=your-mailgun-password
SMTP_FROM=noreply@yourdomain.com
```

## 4. 개발 환경 (이메일 서버 없이 테스트)

이메일 서버 설정이 없어도 개발 환경에서는 작동합니다:

- 이메일은 전송되지 않지만 콘솔에 토큰과 링크가 출력됩니다
- 개발 환경에서는 토큰이 API 응답에 포함되어 프론트엔드에서 직접 사용할 수 있습니다

## 5. 동작 방식

### 이메일 서버 설정이 있는 경우:
1. 사용자가 비밀번호 재설정 요청
2. 토큰 생성 및 저장
3. **실제 이메일 전송** (재설정 링크 포함)
4. 사용자가 이메일의 링크를 클릭하여 비밀번호 재설정

### 이메일 서버 설정이 없는 경우 (개발 환경):
1. 사용자가 비밀번호 재설정 요청
2. 토큰 생성 및 저장
3. **콘솔에 토큰 출력** (이메일 대신)
4. API 응답에 토큰 포함
5. 프론트엔드에서 자동으로 재설정 페이지로 이동

## 6. 보안 주의사항

- **절대 `.env` 파일을 Git에 커밋하지 마세요**
- 프로덕션 환경에서는 반드시 실제 이메일 서버를 사용하세요
- Gmail 사용 시 일반 비밀번호가 아닌 "앱 비밀번호"를 사용하세요
- 이메일 전송 실패 시에도 사용자에게는 성공 메시지를 표시합니다 (보안상의 이유)

