-- User Sessions for AirBar Platform
-- Tracking active sessions with device fingerprinting and remember-me functionality

-- Sarah (Business Owner) Sessions - Desktop heavy usage
INSERT INTO "public"."user_sessions" (id, user_id, session_token, device_fingerprint, ip_address, user_agent, is_remembered, expires_at, last_activity_at, created_at, revoked_at)
VALUES
  -- Sarah's main work desktop (remembered device)
  ('sess_sarah_001', 'user_sarah_001', 'st_sarah_desktop_main_2025', 'df_win10_chrome_sarah_work', '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36', true, NOW() + INTERVAL '30 days', NOW() - INTERVAL '2 hours', NOW() - INTERVAL '7 days', NULL),
  
  -- Sarah's mobile device (occasional usage)
  ('sess_sarah_002', 'user_sarah_001', 'st_sarah_mobile_2025', 'df_ios_safari_sarah_phone', '10.0.1.45', 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1', false, NOW() + INTERVAL '7 days', NOW() - INTERVAL '1 day', NOW() - INTERVAL '3 days', NULL),
  
  -- Sarah's expired session (home laptop)
  ('sess_sarah_003', 'user_sarah_001', 'st_sarah_laptop_home', 'df_mac_chrome_sarah_home', '73.162.45.123', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36', false, NOW() - INTERVAL '2 days', NOW() - INTERVAL '5 days', NOW() - INTERVAL '8 days', NOW() - INTERVAL '2 days'),

-- Marcus (Business Traveler) Sessions - Multi-device, high mobility
  -- Marcus's MacBook (primary device, remembered)
  ('sess_marcus_001', 'user_marcus_001', 'st_marcus_macbook_2025', 'df_mac_chrome_marcus_work', '192.168.1.200', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36', true, NOW() + INTERVAL '30 days', NOW() - INTERVAL '30 minutes', NOW() - INTERVAL '10 days', NULL),
  
  -- Marcus's iPhone (travel companion)
  ('sess_marcus_002', 'user_marcus_001', 'st_marcus_iphone_2025', 'df_ios_safari_marcus_phone', '143.248.73.91', 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1', true, NOW() + INTERVAL '30 days', NOW() - INTERVAL '15 minutes', NOW() - INTERVAL '5 days', NULL),
  
  -- Marcus from airport WiFi (temporary session)
  ('sess_marcus_003', 'user_marcus_001', 'st_marcus_airport_temp', 'df_ios_safari_marcus_phone', '198.162.1.45', 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1', false, NOW() + INTERVAL '2 hours', NOW() - INTERVAL '45 minutes', NOW() - INTERVAL '2 hours', NULL),
  
  -- Marcus from hotel (different location)
  ('sess_marcus_004', 'user_marcus_001', 'st_marcus_hotel_london', 'df_mac_chrome_marcus_work', '82.45.123.67', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36', false, NOW() + INTERVAL '7 days', NOW() - INTERVAL '3 hours', NOW() - INTERVAL '1 day', NULL),

-- Elena (Expat) Sessions - Primarily mobile, occasional desktop
  -- Elena's iPhone (primary device)
  ('sess_elena_001', 'user_elena_001', 'st_elena_iphone_main', 'df_ios_safari_elena_phone', '192.168.1.150', 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1', true, NOW() + INTERVAL '30 days', NOW() - INTERVAL '3 hours', NOW() - INTERVAL '14 days', NULL),
  
  -- Elena's MacBook (occasional usage)
  ('sess_elena_002', 'user_elena_001', 'st_elena_macbook_home', 'df_mac_safari_elena_home', '192.168.1.150', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Safari/605.1.15', false, NOW() + INTERVAL '7 days', NOW() - INTERVAL '2 days', NOW() - INTERVAL '4 days', NULL),

-- Additional User Sessions (representing different user behaviors)
  -- Power User (Frequent Traveler)
  ('sess_power_001', 'user_power_traveler', 'st_power_android_main', 'df_android_chrome_power', '172.16.45.89', 'Mozilla/5.0 (Linux; Android 13; SM-G998B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36', true, NOW() + INTERVAL '30 days', NOW() - INTERVAL '10 minutes', NOW() - INTERVAL '30 days', NULL),
  
  -- Occasional User (Student)
  ('sess_student_001', 'user_student_001', 'st_student_chrome_dorm', 'df_win_chrome_student', '192.168.45.234', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36', false, NOW() + INTERVAL '7 days', NOW() - INTERVAL '6 days', NOW() - INTERVAL '12 days', NULL),
  
  -- Security-conscious User (VPN usage)
  ('sess_security_001', 'user_security_conscious', 'st_security_firefox_vpn', 'df_linux_firefox_security', '185.243.218.45', 'Mozilla/5.0 (X11; Linux x86_64; rv:120.0) Gecko/20100101 Firefox/120.0', false, NOW() + INTERVAL '1 day', NOW() - INTERVAL '4 hours', NOW() - INTERVAL '1 day', NULL),
  
  -- Suspicious Session (flagged for security review)
  ('sess_suspicious_001', 'user_flagged_001', 'st_suspicious_multiple', 'df_multiple_devices_flag', '45.123.67.89', 'Mozilla/5.0 (compatible; Bot/1.0)', false, NOW() - INTERVAL '1 hour', NOW() - INTERVAL '2 hours', NOW() - INTERVAL '3 hours', NOW() - INTERVAL '1 hour'),

-- Session Pattern Examples
  -- User with multiple concurrent sessions (tablet + phone)
  ('sess_multi_001', 'user_multi_device', 'st_multi_tablet_2025', 'df_ipad_safari_multi', '192.168.2.100', 'Mozilla/5.0 (iPad; CPU OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1', true, NOW() + INTERVAL '30 days', NOW() - INTERVAL '20 minutes', NOW() - INTERVAL '2 days', NULL),
  
  ('sess_multi_002', 'user_multi_device', 'st_multi_phone_2025', 'df_android_multi_phone', '192.168.2.101', 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36', false, NOW() + INTERVAL '7 days', NOW() - INTERVAL '5 minutes', NOW() - INTERVAL '1 day', NULL),

-- International User Sessions (different timezones)
  ('sess_intl_001', 'user_international_au', 'st_intl_chrome_sydney', 'df_win_chrome_au_user', '203.45.123.67', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36', false, NOW() + INTERVAL '7 days', NOW() - INTERVAL '8 hours', NOW() - INTERVAL '3 days', NULL),
  
  ('sess_intl_002', 'user_international_de', 'st_intl_firefox_berlin', 'df_linux_firefox_de', '185.67.89.123', 'Mozilla/5.0 (X11; Linux x86_64; rv:120.0) Gecko/20100101 Firefox/120.0', true, NOW() + INTERVAL '30 days', NOW() - INTERVAL '1 hour', NOW() - INTERVAL '5 days', NULL);