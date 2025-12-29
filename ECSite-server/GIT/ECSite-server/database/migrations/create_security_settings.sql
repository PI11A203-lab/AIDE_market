-- ============================================
-- 보안 설정 테이블 생성
-- ============================================
-- 실행 방법:
--   mysql -u root -p aide_market < database/migrations/create_security_settings.sql
-- 또는 MySQL Workbench에서 직접 실행
-- ============================================

CREATE TABLE IF NOT EXISTS security_settings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value TEXT NOT NULL,
  updated_by INT NULL,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (updated_by) REFERENCES users(id),
  INDEX idx_setting_key (setting_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 기본 설정 삽입
INSERT INTO security_settings (setting_key, setting_value) VALUES
('auto_block_enabled', 'true'),
('bot_detection_threshold', '80'),
('max_login_attempts', '5'),
('block_duration_hours', '24'),
('rate_limit_enabled', 'true'),
('rate_limit_global_requests', '1000'),
('rate_limit_api_requests', '100'),
('rate_limit_auth_requests', '10'),
('rate_limit_window_minutes', '1'),
('scraping_detection_threshold', '20'),
('scraping_block_threshold', '30'),
('notFound_error_threshold', '10'),
('suspicious_activity_threshold', '10')
ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value);

-- ============================================
-- 보안 설정 테이블 생성 완료
-- ============================================

