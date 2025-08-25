-- Feature Flags for AirBar Platform
-- Based on user personas (Sarah, Marcus, Elena) and core features

-- ONBOARDING & VERIFICATION FEATURES
INSERT INTO "public"."feature_flags" (id, name, is_enabled, description, rollout_percent, user_segments, metadata, created_at, updated_at)
VALUES
  ('ff_kyc_enhanced', 'enhanced_kyc_verification', true, 'Enhanced KYC with selfie verification and background checks', 100, ARRAY['all'], '{"priority": "high", "business_impact": "trust", "persona": "all"}', NOW(), NOW()),
  
  ('ff_instant_verify', 'instant_verification_badges', false, 'Show verification badges immediately after upload', 15, ARRAY['premium", "business'], '{"priority": "medium", "test_group": "A", "persona": "sarah_business"}', NOW(), NOW()),

-- MARKETPLACE & MATCHING FEATURES  
  ('ff_smart_matching', 'ai_smart_matching', true, 'AI-powered package-to-trip matching recommendations', 80, ARRAY['verified", "active'], '{"algorithm": "v2", "persona": "marcus_traveler", "conversion_lift": "23%"}', NOW(), NOW()),
  
  ('ff_bulk_booking', 'bulk_package_booking', false, 'Allow multiple packages per trip booking', 25, ARRAY['business", "frequent_sender'], '{"persona": "sarah_business", "avg_order_value": "increase_40%"}', NOW(), NOW()),
  
  ('ff_price_negotiate', 'price_negotiation', true, 'Enable price negotiation between senders and travelers', 100, ARRAY['all'], '{"feature_usage": "67%", "satisfaction": "4.2/5"}', NOW(), NOW()),

-- PAYMENT & WALLET FEATURES
  ('ff_instant_payout', 'instant_traveler_payout', false, 'Instant payout after delivery confirmation', 10, ARRAY['verified_traveler", "premium'], '{"persona": "marcus_traveler", "retention": "increase_34%"}', NOW(), NOW()),
  
  ('ff_multi_currency', 'multi_currency_payments', false, 'Support for multiple currencies in payments', 0, ARRAY['international'], '{"persona": "elena_expat", "markets": ["UK", "EU", "AU"]}', NOW(), NOW()),

-- COMMUNICATION & TRUST
  ('ff_video_chat', 'in_app_video_chat', false, 'Video calls between senders and travelers', 5, ARRAY['premium", "high_value'], '{"trust_increase": "45%", "completion_rate": "92%"}', NOW(), NOW()),
  
  ('ff_real_time_tracking', 'real_time_package_tracking', true, 'Live GPS tracking of packages during transit', 100, ARRAY['all'], '{"customer_satisfaction": "4.6/5", "support_tickets": "decrease_60%"}', NOW(), NOW()),

-- BUSINESS & ANALYTICS  
  ('ff_business_dashboard', 'business_analytics_dashboard', false, 'Advanced analytics for business senders', 20, ARRAY['business", "high_volume'], '{"persona": "sarah_business", "retention": "increase_67%"}', NOW(), NOW()),
  
  ('ff_referral_program', 'user_referral_rewards', true, 'Referral program with rewards', 100, ARRAY['all'], '{"viral_coefficient": "1.4", "cac_reduction": "23%"}', NOW(), NOW()),

-- SEASONAL & PROMOTIONAL
  ('ff_holiday_boost', 'holiday_season_features', false, 'Holiday-specific features and promotions', 0, ARRAY['all'], '{"seasonal": true, "activate_dates": ["2025-11-15", "2025-12-31"]}', NOW(), NOW()),
  
  ('ff_student_discount', 'student_verification_discount', true, 'Student verification and discounts', 100, ARRAY['student'], '{"persona": "international_students", "adoption": "78%"}', NOW(), NOW());