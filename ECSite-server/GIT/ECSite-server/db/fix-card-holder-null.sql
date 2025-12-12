-- credit_cards 테이블의 card_holder 컬럼을 NULL 허용하도록 수정
-- 또는 빈 문자열을 기본값으로 사용하도록 변경

-- 방법 1: NULL 허용하도록 변경 (권장)
ALTER TABLE credit_cards MODIFY COLUMN card_holder VARCHAR(100) NULL;

-- 방법 2: 빈 문자열을 기본값으로 설정 (이미 NULL 허용인 경우)
-- ALTER TABLE credit_cards MODIFY COLUMN card_holder VARCHAR(100) DEFAULT '';

