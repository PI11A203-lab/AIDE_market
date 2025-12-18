// 이메일 전송 서비스
// Nodemailer를 사용하여 이메일을 전송합니다.

// 환경 변수 로드 (경로 명시적으로 지정)
const path = require('path');
const dotenv = require('dotenv');
// 상위 폴더의 .env 파일 참조 (이 파일은 features/user/ 폴더에 있음)
const envPath = path.resolve(__dirname, '../../.env');
dotenv.config({ path: envPath });

let nodemailer;
try {
    nodemailer = require('nodemailer');
} catch (err) {
    console.warn('nodemailer 패키지가 설치되지 않았습니다. npm install nodemailer를 실행하세요.');
    nodemailer = null;
}

/**
 * 이메일 전송 설정 가져오기
 */
const getEmailConfig = () => {
    // ⭐ 디버깅: 환경 변수 확인
    console.log('\n🔍 환경 변수 확인:');
    console.log('SMTP_HOST:', process.env.SMTP_HOST || '(기본값: kigawa.sakura.ne.jp)');
    console.log('SMTP_PORT:', process.env.SMTP_PORT || '(기본값: 587)');
    console.log('SMTP_USER:', process.env.SMTP_USER || '(기본값: sumin@kigawa.net)');
    console.log('SMTP_PASSWORD:', process.env.SMTP_PASSWORD ? '✅ 설정됨' : '❌ 설정 안됨');
    console.log('SMTP_SECURE:', process.env.SMTP_SECURE || '(기본값: false)');
    console.log('SMTP_FROM:', process.env.SMTP_FROM || '(기본값: sumin@kigawa.net)');
    
    // 환경 변수에서 SMTP 설정 가져오기 (기본값: sakura.ne.jp 서버)
    // 주의: 포트는 실제 서버 설정에 맞게 조정이 필요할 수 있습니다
    // 일반적인 포트: 587 (STARTTLS), 465 (SSL), 25 (일반)
    const config = {
        host: process.env.SMTP_HOST || 'kigawa.sakura.ne.jp',
        port: parseInt(process.env.SMTP_PORT || '587', 10), // 실제 서버 포트 확인 필요
        secure: process.env.SMTP_SECURE === 'true', // true for 465, false for 587/25
        auth: {
            user: process.env.SMTP_USER || 'sumin@kigawa.net',
            pass: process.env.SMTP_PASSWORD || 'YOUR_PASSWORD_HERE', // TODO: 실제 비밀번호로 변경 필요
        },
    };

    // 비밀번호가 기본값이면 null 반환 (이메일 전송 안 함)
    if (config.auth.pass === 'YOUR_PASSWORD_HERE') {
        console.log('❌ SMTP 비밀번호가 설정되지 않았습니다. (.env 파일에 SMTP_PASSWORD를 설정하세요)');
        return null;
    }

    // 설정이 모두 있는지 확인
    if (config.host && config.auth.user && config.auth.pass) {
        console.log('✅ SMTP 설정 완료 - 이메일 전송 가능');
        console.log(`   호스트: ${config.host}:${config.port} (secure: ${config.secure})`);
        console.log(`   사용자: ${config.auth.user}\n`);
        return config;
    }

    console.log('❌ SMTP 설정이 불완전합니다.\n');
    return null;
};

/**
 * 이메일 전송기 생성
 */
const createTransporter = () => {
    if (!nodemailer) {
        return null;
    }

    const config = getEmailConfig();
    
    if (!config) {
        // SMTP 설정이 없으면 null 반환 (개발 환경)
        return null;
    }

    return nodemailer.createTransport({
        host: config.host,
        port: config.port,
        secure: config.secure,
        auth: config.auth,
    });
};

/**
 * 비밀번호 재설정 인증 코드 이메일 템플릿 생성 (다국어 지원)
 * @param {string} code - 6자리 인증 코드
 * @param {string} language - 언어 코드 ('ko', 'en', 'ja')
 * @returns {object} 이메일 템플릿 (subject, html, text)
 */
const getPasswordResetEmailTemplate = (code, language = 'ko') => {
    const templates = {
        ko: {
            subject: 'AIDE Market - 비밀번호 재설정 인증 코드',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #1A1A1A;">비밀번호 재설정 인증 코드</h2>
                    <p>안녕하세요,</p>
                    <p>비밀번호 재설정을 요청하셨습니다. 아래 인증 코드를 입력하여 비밀번호를 재설정하세요.</p>
                    <div style="background-color: #F9FAFB; border: 2px solid #E5E7EB; border-radius: 8px; padding: 20px; margin: 30px 0; text-align: center;">
                        <p style="color: #6B7280; font-size: 14px; margin: 0 0 10px 0;">인증 코드</p>
                        <p style="color: #1A1A1A; font-size: 32px; font-weight: bold; letter-spacing: 8px; margin: 0; font-family: 'Courier New', monospace;">
                            ${code}
                        </p>
                    </div>
                    <p style="color: #6B7280; font-size: 14px; margin-top: 30px;">
                        이 코드는 <strong>10분 동안만</strong> 유효합니다.<br>
                        만약 비밀번호 재설정을 요청하지 않으셨다면, 이 이메일을 무시하셔도 됩니다.
                    </p>
                    <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 30px 0;">
                    <p style="color: #9CA3AF; font-size: 12px;">
                        © AIDE Market - AI Developer Marketplace
                    </p>
                </div>
            `,
            text: `
비밀번호 재설정 인증 코드

안녕하세요,

비밀번호 재설정을 요청하셨습니다. 아래 인증 코드를 입력하여 비밀번호를 재설정하세요.

인증 코드: ${code}

이 코드는 10분 동안만 유효합니다.
만약 비밀번호 재설정을 요청하지 않으셨다면, 이 이메일을 무시하셔도 됩니다.

© AIDE Market - AI Developer Marketplace
            `.trim()
        },
        en: {
            subject: 'AIDE Market - Password Reset Verification Code',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #1A1A1A;">Password Reset Verification Code</h2>
                    <p>Hello,</p>
                    <p>You have requested to reset your password. Please enter the verification code below to reset your password.</p>
                    <div style="background-color: #F9FAFB; border: 2px solid #E5E7EB; border-radius: 8px; padding: 20px; margin: 30px 0; text-align: center;">
                        <p style="color: #6B7280; font-size: 14px; margin: 0 0 10px 0;">Verification Code</p>
                        <p style="color: #1A1A1A; font-size: 32px; font-weight: bold; letter-spacing: 8px; margin: 0; font-family: 'Courier New', monospace;">
                            ${code}
                        </p>
                    </div>
                    <p style="color: #6B7280; font-size: 14px; margin-top: 30px;">
                        This code is valid for <strong>10 minutes only</strong>.<br>
                        If you did not request a password reset, you can safely ignore this email.
                    </p>
                    <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 30px 0;">
                    <p style="color: #9CA3AF; font-size: 12px;">
                        © AIDE Market - AI Developer Marketplace
                    </p>
                </div>
            `,
            text: `
Password Reset Verification Code

Hello,

You have requested to reset your password. Please enter the verification code below to reset your password.

Verification Code: ${code}

This code is valid for 10 minutes only.
If you did not request a password reset, you can safely ignore this email.

© AIDE Market - AI Developer Marketplace
            `.trim()
        },
        ja: {
            subject: 'AIDE Market - パスワードリセット認証コード',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #1A1A1A;">パスワードリセット認証コード</h2>
                    <p>こんにちは、</p>
                    <p>パスワードリセットをリクエストされました。以下の認証コードを入力してパスワードをリセットしてください。</p>
                    <div style="background-color: #F9FAFB; border: 2px solid #E5E7EB; border-radius: 8px; padding: 20px; margin: 30px 0; text-align: center;">
                        <p style="color: #6B7280; font-size: 14px; margin: 0 0 10px 0;">認証コード</p>
                        <p style="color: #1A1A1A; font-size: 32px; font-weight: bold; letter-spacing: 8px; margin: 0; font-family: 'Courier New', monospace;">
                            ${code}
                        </p>
                    </div>
                    <p style="color: #6B7280; font-size: 14px; margin-top: 30px;">
                        このコードは<strong>10分間のみ</strong>有効です。<br>
                        パスワードリセットをリクエストしていない場合は、このメールを無視していただいても結構です。
                    </p>
                    <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 30px 0;">
                    <p style="color: #9CA3AF; font-size: 12px;">
                        © AIDE Market - AI Developer Marketplace
                    </p>
                </div>
            `,
            text: `
パスワードリセット認証コード

こんにちは、

パスワードリセットをリクエストされました。以下の認証コードを入力してパスワードをリセットしてください。

認証コード: ${code}

このコードは10分間のみ有効です。
パスワードリセットをリクエストしていない場合は、このメールを無視していただいても結構です。

© AIDE Market - AI Developer Marketplace
            `.trim()
        }
    };

    // 지원하는 언어가 아니면 한국어로 폴백
    const lang = ['ko', 'en', 'ja'].includes(language) ? language : 'ko';
    return templates[lang];
};

/**
 * 비밀번호 재설정 인증 코드 이메일 전송
 * @param {string} email - 수신자 이메일
 * @param {string} code - 6자리 인증 코드
 * @param {string} language - 사용자 언어 설정 ('ko', 'en', 'ja'), 기본값: 'ko'
 */
exports.sendPasswordResetCode = async (email, code, language = 'ko') => {
    // 언어별 이메일 템플릿 가져오기
    const template = getPasswordResetEmailTemplate(code, language);
    
    // 이메일 내용
    const mailOptions = {
        from: process.env.SMTP_FROM || process.env.SMTP_USER || 'sumin@kigawa.net',
        to: email,
        subject: template.subject,
        html: template.html,
        text: template.text,
    };

    const transporter = createTransporter();

    // 이메일 전송기가 없으면 (개발 환경)
    if (!transporter) {
        const langLabels = { ko: '한국어', en: 'English', ja: '日本語' };
        const langLabel = langLabels[language] || '한국어';
        console.log('\n========================================');
        console.log(`📧 비밀번호 재설정 인증 코드 (개발 환경) - ${langLabel}`);
        console.log('========================================');
        console.log('수신자:', email);
        console.log('언어:', language, `(${langLabel})`);
        console.log('제목:', mailOptions.subject);
        console.log('인증 코드:', code);
        console.log('========================================\n');
        
        // 개발 환경에서는 코드를 반환하여 프론트엔드에서 사용할 수 있도록 함
        return {
            sent: false,
            code: code, // 개발 환경에서만 코드 반환
        };
    }

    try {
        // 실제 이메일 전송
        const info = await transporter.sendMail(mailOptions);
        console.log('이메일 전송 성공:', info.messageId);
        
        return {
            sent: true,
            messageId: info.messageId,
        };
    } catch (error) {
        console.error('이메일 전송 실패:', error);
        
        // 이메일 전송 실패 시에도 개발 환경처럼 처리
        const langLabels = { ko: '한국어', en: 'English', ja: '日本語' };
        const langLabel = langLabels[language] || '한국어';
        console.log('\n========================================');
        console.log(`📧 비밀번호 재설정 인증 코드 (전송 실패 - 개발 모드) - ${langLabel}`);
        console.log('========================================');
        console.log('수신자:', email);
        console.log('언어:', language, `(${langLabel})`);
        console.log('제목:', mailOptions.subject);
        console.log('인증 코드:', code);
        console.log('========================================\n');
        
        throw new Error('이메일 전송에 실패했습니다. SMTP 설정을 확인하세요.');
    }
};

