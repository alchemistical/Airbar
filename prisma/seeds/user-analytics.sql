-- User Analytics Events for AirBar Platform
-- Tracking key user actions based on personas and conversion funnels

-- Simulate Sarah the Business Owner journey
INSERT INTO "public"."user_analytics" (id, user_id, event_name, event_data, session_id, page_url, referrer, user_agent, ip_address, timestamp)
VALUES
  -- Sarah's Registration Journey
  ('ua_001', 'user_sarah_001', 'page_view_landing', '{"persona": "business_owner", "utm_source": "google", "utm_campaign": "shipping_costs"}', 'sess_sarah_001', 'https://airbar.com/', 'https://google.com/search?q=cheap+international+shipping', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', '192.168.1.100', NOW() - INTERVAL '7 days'),
  
  ('ua_002', 'user_sarah_001', 'click_how_it_works', '{"section": "hero_cta", "time_on_page": 45}', 'sess_sarah_001', 'https://airbar.com/#how-it-works', 'https://airbar.com/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', '192.168.1.100', NOW() - INTERVAL '7 days' + INTERVAL '45 seconds'),
  
  ('ua_003', 'user_sarah_001', 'pricing_calculator_used', '{"package_weight": 2.5, "destination": "London", "estimated_savings": 67, "traditional_cost": 89, "airbar_cost": 29}', 'sess_sarah_001', 'https://airbar.com/pricing', 'https://airbar.com/#how-it-works', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', '192.168.1.100', NOW() - INTERVAL '7 days' + INTERVAL '3 minutes'),
  
  ('ua_004', 'user_sarah_001', 'registration_started', '{"user_type": "sender", "signup_source": "pricing_page"}', 'sess_sarah_001', 'https://airbar.com/register', 'https://airbar.com/pricing', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', '192.168.1.100', NOW() - INTERVAL '7 days' + INTERVAL '5 minutes'),
  
  ('ua_005', 'user_sarah_001', 'registration_completed', '{"verification_method": "email", "business_account": true, "monthly_volume": "20-50"}', 'sess_sarah_001', 'https://airbar.com/dashboard', 'https://airbar.com/register', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', '192.168.1.100', NOW() - INTERVAL '7 days' + INTERVAL '8 minutes'),

  -- Sarah's First Package Send Journey
  ('ua_006', 'user_sarah_001', 'package_send_started', '{"package_type": "clothing", "destination_country": "UK", "urgency": "standard"}', 'sess_sarah_002', 'https://airbar.com/send', NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', '192.168.1.100', NOW() - INTERVAL '6 days'),
  
  ('ua_007', 'user_sarah_001', 'trip_matches_viewed', '{"matches_shown": 8, "filters_used": ["price_low_to_high"], "avg_price": 31}', 'sess_sarah_002', 'https://airbar.com/matches', 'https://airbar.com/send', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', '192.168.1.100', NOW() - INTERVAL '6 days' + INTERVAL '10 minutes'),
  
  ('ua_008', 'user_sarah_001', 'traveler_profile_viewed', '{"traveler_rating": 4.8, "verified_badge": true, "trips_completed": 23}', 'sess_sarah_002', 'https://airbar.com/traveler/marcus_consultant', 'https://airbar.com/matches', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', '192.168.1.100', NOW() - INTERVAL '6 days' + INTERVAL '12 minutes'),
  
  ('ua_009', 'user_sarah_001', 'booking_request_sent', '{"traveler_id": "user_marcus_001", "price_offered": 28, "delivery_date": "2025-09-02"}', 'sess_sarah_002', 'https://airbar.com/booking/confirm', 'https://airbar.com/traveler/marcus_consultant', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', '192.168.1.100', NOW() - INTERVAL '6 days' + INTERVAL '15 minutes'),

-- Simulate Marcus the Consultant journey  
  ('ua_010', 'user_marcus_001', 'page_view_landing', '{"persona": "business_traveler", "utm_source": "linkedin", "utm_campaign": "earn_travel_money"}', 'sess_marcus_001', 'https://airbar.com/', 'https://linkedin.com', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', '192.168.1.200', NOW() - INTERVAL '10 days'),
  
  ('ua_011', 'user_marcus_001', 'earnings_calculator_used', '{"weekly_flights": 2, "available_space": "10kg", "potential_monthly": 450}', 'sess_marcus_001', 'https://airbar.com/earn', 'https://airbar.com/', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', '192.168.1.200', NOW() - INTERVAL '10 days' + INTERVAL '2 minutes'),
  
  ('ua_012', 'user_marcus_001', 'registration_completed', '{"user_type": "traveler", "frequent_routes": ["NYC-LA", "NYC-CHI"], "travel_frequency": "weekly"}', 'sess_marcus_001', 'https://airbar.com/dashboard', 'https://airbar.com/register', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', '192.168.1.200', NOW() - INTERVAL '10 days' + INTERVAL '6 minutes'),
  
  ('ua_013', 'user_marcus_001', 'trip_posted', '{"route": "NYC-LON", "departure_date": "2025-09-02", "available_space": 8.5, "price_per_kg": 12}', 'sess_marcus_002', 'https://airbar.com/trips/post', NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', '192.168.1.200', NOW() - INTERVAL '9 days'),
  
  ('ua_014', 'user_marcus_001', 'match_request_received', '{"sender_id": "user_sarah_001", "package_value": 28, "auto_accept": false}', 'sess_marcus_002', 'https://airbar.com/requests', NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', '192.168.1.200', NOW() - INTERVAL '6 days' + INTERVAL '20 minutes'),
  
  ('ua_015', 'user_marcus_001', 'match_request_accepted', '{"sender_id": "user_sarah_001", "final_price": 28, "acceptance_time": 300}', 'sess_marcus_002', 'https://airbar.com/requests/accept', 'https://airbar.com/requests', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', '192.168.1.200', NOW() - INTERVAL '6 days' + INTERVAL '25 minutes'),

-- Simulate Elena the Expat journey
  ('ua_016', 'user_elena_001', 'page_view_landing', '{"persona": "expat", "utm_source": "facebook", "utm_campaign": "send_gifts_home"}', 'sess_elena_001', 'https://airbar.com/', 'https://facebook.com', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15', '192.168.1.150', NOW() - INTERVAL '14 days'),
  
  ('ua_017', 'user_elena_001', 'speed_calculator_used', '{"traditional_shipping": "14-21 days", "airbar_shipping": "3-5 days", "occasion": "birthday"}', 'sess_elena_001', 'https://airbar.com/speed', 'https://airbar.com/', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15', '192.168.1.150', NOW() - INTERVAL '14 days' + INTERVAL '3 minutes'),
  
  ('ua_018', 'user_elena_001', 'registration_completed', '{"user_type": "sender", "sending_frequency": "monthly", "primary_destination": "Spain"}', 'sess_elena_001', 'https://airbar.com/dashboard', 'https://airbar.com/register', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15', '192.168.1.150', NOW() - INTERVAL '14 days' + INTERVAL '7 minutes'),

-- Key Conversion Events
  ('ua_019', 'user_sarah_001', 'payment_completed', '{"amount": 28, "method": "credit_card", "booking_id": "book_001", "first_purchase": true}', 'sess_sarah_003', 'https://airbar.com/payment/success', 'https://airbar.com/payment', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', '192.168.1.100', NOW() - INTERVAL '5 days'),
  
  ('ua_020', 'user_marcus_001', 'delivery_confirmed', '{"booking_id": "book_001", "rating_given": 5, "earnings": 28, "delivery_method": "hand_to_hand"}', 'sess_marcus_003', 'https://airbar.com/delivery/complete', NULL, 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15', '192.168.1.200', NOW() - INTERVAL '2 days'),
  
  ('ua_021', 'user_sarah_001', 'review_left', '{"rating": 5, "review_text": "Perfect delivery! Marcus was professional and on time.", "would_recommend": true}', 'sess_sarah_004', 'https://airbar.com/reviews/submit', 'https://airbar.com/delivery/received', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', '192.168.1.100', NOW() - INTERVAL '1 day'),

-- Repeat Usage Patterns
  ('ua_022', 'user_sarah_001', 'package_send_started', '{"package_type": "electronics", "destination_country": "Germany", "repeat_customer": true}', 'sess_sarah_005', 'https://airbar.com/send', NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', '192.168.1.100', NOW() - INTERVAL '12 hours');