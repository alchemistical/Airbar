-- Test Users for AirBar Platform
-- Based on user personas from PRD

INSERT INTO "public"."users" (id, email, username, password_hash, email_verified, phone_verified, kyc_status, is_active, last_login_at, created_at, updated_at)
VALUES
  -- Sarah the Business Owner (Small business, frequent sender)
  ('user_sarah_001', 'sarah.boutique@example.com', 'sarahboutique', '$2b$10$KIXWpZdGuOgVu1LxcKMpPeQQgD.XR7X7X7X7X7X7X7X7X7X7X7X7X', true, true, 'APPROVED', true, NOW() - INTERVAL '2 hours', NOW() - INTERVAL '7 days', NOW() - INTERVAL '2 hours'),
  
  -- Marcus the Consultant (Business traveler, frequent flyer)  
  ('user_marcus_001', 'marcus.consultant@example.com', 'marcusflyer', '$2b$10$KIXWpZdGuOgVu1LxcKMpPeQQgD.XR7X7X7X7X7X7X7X7X7X7X7X7X', true, true, 'APPROVED', true, NOW() - INTERVAL '30 minutes', NOW() - INTERVAL '10 days', NOW() - INTERVAL '30 minutes'),
  
  -- Elena the Expat (Sends gifts to family)
  ('user_elena_001', 'elena.london@example.com', 'elenaexpat', '$2b$10$KIXWpZdGuOgVu1LxcKMpPeQQgD.XR7X7X7X7X7X7X7X7X7X7X7X7X', true, false, 'PENDING', true, NOW() - INTERVAL '3 hours', NOW() - INTERVAL '14 days', NOW() - INTERVAL '3 hours'),
  
  -- Additional test users for variety
  ('user_power_traveler', 'alex.nomad@example.com', 'digitalnomad', '$2b$10$KIXWpZdGuOgVu1LxcKMpPeQQgD.XR7X7X7X7X7X7X7X7X7X7X7X7X', true, true, 'APPROVED', true, NOW() - INTERVAL '10 minutes', NOW() - INTERVAL '30 days', NOW() - INTERVAL '10 minutes'),
  
  ('user_student_001', 'jamie.student@university.edu', 'jamiestudent', '$2b$10$KIXWpZdGuOgVu1LxcKMpPeQQgD.XR7X7X7X7X7X7X7X7X7X7X7X7X', true, false, 'PENDING', true, NOW() - INTERVAL '6 days', NOW() - INTERVAL '12 days', NOW() - INTERVAL '6 days'),
  
  ('user_security_conscious', 'secure.user@proton.me', 'secureuser', '$2b$10$KIXWpZdGuOgVu1LxcKMpPeQQgD.XR7X7X7X7X7X7X7X7X7X7X7X7X', false, false, 'PENDING', true, NOW() - INTERVAL '4 hours', NOW() - INTERVAL '1 day', NOW() - INTERVAL '4 hours'),
  
  ('user_flagged_001', 'suspicious@temp.email', 'flaggeduser', '$2b$10$KIXWpZdGuOgVu1LxcKMpPeQQgD.XR7X7X7X7X7X7X7X7X7X7X7X7X', false, false, 'REJECTED', false, NOW() - INTERVAL '2 hours', NOW() - INTERVAL '3 hours', NOW() - INTERVAL '2 hours'),
  
  ('user_multi_device', 'multi.device@example.com', 'multidevice', '$2b$10$KIXWpZdGuOgVu1LxcKMpPeQQgD.XR7X7X7X7X7X7X7X7X7X7X7X7X', true, true, 'APPROVED', true, NOW() - INTERVAL '5 minutes', NOW() - INTERVAL '2 days', NOW() - INTERVAL '5 minutes'),
  
  ('user_international_au', 'aussie.sender@example.com.au', 'aussiesender', '$2b$10$KIXWpZdGuOgVu1LxcKMpPeQQgD.XR7X7X7X7X7X7X7X7X7X7X7X7X', true, true, 'APPROVED', true, NOW() - INTERVAL '8 hours', NOW() - INTERVAL '3 days', NOW() - INTERVAL '8 hours'),
  
  ('user_international_de', 'german.traveler@example.de', 'deutschtraveler', '$2b$10$KIXWpZdGuOgVu1LxcKMpPeQQgD.XR7X7X7X7X7X7X7X7X7X7X7X7X', true, true, 'APPROVED', true, NOW() - INTERVAL '1 hour', NOW() - INTERVAL '5 days', NOW() - INTERVAL '1 hour');