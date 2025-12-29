-- 보안 시스템 최종 테스트용 SQL 스크립트

-- 1. 인덱스 확인
SHOW INDEX FROM security_events;
SHOW INDEX FROM ip_access_logs;
SHOW INDEX FROM ip_management;
SHOW INDEX FROM bot_detections;

-- 2. 보안 설정 확인
SELECT * FROM security_settings;

-- 3. 데이터 확인
SELECT COUNT(*) AS security_events_count FROM security_events;
SELECT COUNT(*) AS ip_access_logs_count FROM ip_access_logs;
SELECT COUNT(*) AS bot_detections_count FROM bot_detections;
SELECT COUNT(*) AS ip_management_count FROM ip_management;

-- 4. 최근 보안 이벤트 확인
SELECT 
    id,
    event_type,
    ip_address,
    severity,
    created_at,
    is_blocked
FROM security_events
ORDER BY created_at DESC
LIMIT 10;

-- 5. 차단된 IP 확인
SELECT 
    ip_address,
    is_blocked,
    is_whitelisted,
    block_reason,
    blocked_at,
    blocked_by
FROM ip_management
WHERE is_blocked = 1
ORDER BY blocked_at DESC
LIMIT 10;

-- 6. 봇 탐지 기록 확인
SELECT 
    id,
    ip_address,
    user_agent,
    detection_reason,
    confidence_score,
    is_blocked,
    created_at
FROM bot_detections
ORDER BY created_at DESC
LIMIT 10;

-- 7. 위치 정보가 포함된 IP 로그 확인
SELECT 
    ip_address,
    country,
    city,
    request_path,
    created_at
FROM ip_access_logs
WHERE country IS NOT NULL
ORDER BY created_at DESC
LIMIT 10;

-- 8. 이벤트 유형별 통계
SELECT 
    event_type,
    COUNT(*) AS count,
    SUM(CASE WHEN severity = 'critical' THEN 1 ELSE 0 END) AS critical_count,
    SUM(CASE WHEN severity = 'high' THEN 1 ELSE 0 END) AS high_count,
    SUM(CASE WHEN severity = 'medium' THEN 1 ELSE 0 END) AS medium_count,
    SUM(CASE WHEN severity = 'low' THEN 1 ELSE 0 END) AS low_count
FROM security_events
GROUP BY event_type
ORDER BY count DESC;

-- 9. 국가별 접속 통계
SELECT 
    country,
    COUNT(*) AS access_count,
    COUNT(DISTINCT ip_address) AS unique_ips
FROM ip_access_logs
WHERE country IS NOT NULL
GROUP BY country
ORDER BY access_count DESC
LIMIT 10;

-- 10. 최근 7일간 일별 이벤트 통계
SELECT 
    DATE(created_at) AS date,
    event_type,
    COUNT(*) AS count
FROM security_events
WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
GROUP BY DATE(created_at), event_type
ORDER BY date DESC, count DESC;

