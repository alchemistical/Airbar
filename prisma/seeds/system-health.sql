-- System Health Monitoring for AirBar Platform
-- Tracking critical services and their performance metrics

-- Recent system health snapshots (last 24 hours)
INSERT INTO "public"."system_health" (id, service, status, response_time, error_rate, metadata, timestamp)
VALUES
  -- API Services Health
  ('sh_001', 'api_auth_service', 'UP', 45, 0.2, '{"endpoint": "/api/auth", "requests_per_minute": 127, "memory_usage": "340MB", "cpu_usage": "12%"}', NOW() - INTERVAL '5 minutes'),
  
  ('sh_002', 'api_trips_service', 'UP', 89, 0.1, '{"endpoint": "/api/trips", "active_connections": 234, "cache_hit_rate": "94%", "db_connections": 8}', NOW() - INTERVAL '5 minutes'),
  
  ('sh_003', 'api_matching_service', 'UP', 156, 0.3, '{"endpoint": "/api/matching", "algorithm_version": "v2.1", "match_success_rate": "78%", "queue_size": 23}', NOW() - INTERVAL '5 minutes'),
  
  ('sh_004', 'api_payments_service', 'UP', 234, 0.05, '{"endpoint": "/api/payments", "stripe_status": "operational", "successful_transactions": "99.95%", "fraud_detection": "active"}', NOW() - INTERVAL '5 minutes'),
  
  ('sh_005', 'api_notifications_service', 'UP', 67, 0.8, '{"endpoint": "/api/notifications", "delivery_rate": "97.2%", "sms_credits": 8432, "email_queue": 12}', NOW() - INTERVAL '5 minutes'),

  -- Database Health
  ('sh_006', 'postgresql_primary', 'UP', 23, 0.0, '{"connections": "45/100", "disk_usage": "67%", "replication_lag": "0ms", "slow_queries": 2}', NOW() - INTERVAL '5 minutes'),
  
  ('sh_007', 'redis_cache', 'UP', 8, 0.1, '{"memory_usage": "234MB/1GB", "hit_rate": "94.3%", "evicted_keys": 45, "connected_clients": 23}', NOW() - INTERVAL '5 minutes'),

  -- External Services
  ('sh_008', 'stripe_payments', 'UP', 189, 0.02, '{"api_version": "2023-10-16", "webhook_status": "healthy", "last_payout": "2025-08-25T09:00:00Z"}', NOW() - INTERVAL '5 minutes'),
  
  ('sh_009', 'twilio_sms', 'UP', 445, 0.5, '{"account_balance": "$247.83", "delivery_rate": "98.1%", "error_codes": ["30001", "30006"]}', NOW() - INTERVAL '5 minutes'),
  
  ('sh_010', 'sendgrid_email', 'UP', 567, 0.2, '{"reputation": "99.2%", "bounces": "0.8%", "spam_reports": "0.1%", "blocks": 0}', NOW() - INTERVAL '5 minutes'),

  -- Frontend Services
  ('sh_011', 'web_app_frontend', 'UP', 1200, 0.1, '{"build_version": "v2.3.1", "core_web_vitals": {"LCP": 1.2, "FID": 45, "CLS": 0.05}, "javascript_errors": 3}', NOW() - INTERVAL '5 minutes'),
  
  ('sh_012', 'cdn_static_assets', 'UP', 67, 0.0, '{"cache_hit_rate": "96.7%", "bandwidth": "2.3GB", "origin_requests": "3.3%"}', NOW() - INTERVAL '5 minutes'),

  -- Recent Performance Issues (Degraded States)
  ('sh_013', 'api_matching_service', 'DEGRADED', 2340, 2.1, '{"endpoint": "/api/matching", "issue": "high_load_during_peak", "affected_users": 156, "mitigation": "scaling_up"}', NOW() - INTERVAL '2 hours'),
  
  ('sh_014', 'twilio_sms', 'DEGRADED', 1200, 3.4, '{"issue": "carrier_delays", "affected_regions": ["US", "CA"], "fallback": "email_notifications"}', NOW() - INTERVAL '4 hours'),

  -- Historical Outage (For trend analysis)
  ('sh_015', 'postgresql_primary', 'DOWN', 0, 100.0, '{"issue": "connection_pool_exhausted", "duration": "8 minutes", "impact": "all_api_endpoints", "resolution": "connection_pool_increased"}', NOW() - INTERVAL '3 days'),
  
  ('sh_016', 'postgresql_primary', 'UP', 34, 0.0, '{"recovery_time": "8 minutes", "connections": "23/200", "monitoring": "enhanced"}', NOW() - INTERVAL '3 days' + INTERVAL '8 minutes'),

  -- Business Critical Monitoring
  ('sh_017', 'booking_completion_rate', 'UP', 0, 0.0, '{"completion_rate": "87.3%", "drop_off_stage": "payment", "conversion_funnel": {"viewed": 1000, "started": 456, "completed": 398}}', NOW() - INTERVAL '1 hour'),
  
  ('sh_018', 'user_registration_flow', 'UP', 1890, 0.7, '{"completion_rate": "76.4%", "kyc_verification_rate": "94.2%", "avg_time_to_verify": "4.2 minutes"}', NOW() - INTERVAL '1 hour'),
  
  ('sh_019', 'trust_safety_system', 'UP', 234, 0.1, '{"fraud_detection_accuracy": "99.7%", "false_positives": "0.3%", "flagged_users": 8, "manual_reviews": 3}', NOW() - INTERVAL '1 hour'),

  -- Load Balancer and Infrastructure
  ('sh_020', 'load_balancer', 'UP', 12, 0.0, '{"active_backends": 3, "health_checks_passing": "100%", "ssl_cert_expiry": "2025-11-15", "requests_per_second": 45}', NOW() - INTERVAL '5 minutes'),
  
  ('sh_021', 'kubernetes_cluster', 'UP', 0, 0.0, '{"nodes": "3/3 ready", "pods": "24/24 running", "cpu_usage": "34%", "memory_usage": "67%", "disk_usage": "23%"}', NOW() - INTERVAL '5 minutes'),

  -- Recent trend data for dashboard
  ('sh_022', 'api_auth_service', 'UP', 52, 0.1, '{"endpoint": "/api/auth", "requests_per_minute": 134, "memory_usage": "356MB"}', NOW() - INTERVAL '10 minutes'),
  ('sh_023', 'api_auth_service', 'UP', 41, 0.3, '{"endpoint": "/api/auth", "requests_per_minute": 98, "memory_usage": "298MB"}', NOW() - INTERVAL '15 minutes'),
  ('sh_024', 'api_auth_service', 'UP', 67, 0.0, '{"endpoint": "/api/auth", "requests_per_minute": 156, "memory_usage": "412MB"}', NOW() - INTERVAL '20 minutes');