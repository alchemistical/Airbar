-- User Profiles for AirBar Platform
-- Complete the user personas with profile information

INSERT INTO "public"."profiles" (id, user_id, first_name, last_name, bio, avatar_url, phone_number, date_of_birth, languages, country, city, address, emergency_contact, rating, review_count, total_trips, total_deliveries, created_at, updated_at)
VALUES
  -- Sarah the Business Owner
  ('profile_sarah', 'user_sarah_001', 'Sarah', 'Johnson', 'Owner of SJ Boutique - curating unique fashion pieces from around the world. Passionate about sustainable fashion and supporting small businesses globally.', 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah&backgroundColor=b6e3f4', '+1-310-555-0123', '1992-03-15', ARRAY['English', 'Spanish'], 'United States', 'Los Angeles', '1234 Fashion Ave, Suite 200', '{"name": "Mike Johnson", "phone": "+1-310-555-0124"}', 4.8, 23, 15, 28, NOW() - INTERVAL '7 days', NOW() - INTERVAL '2 hours'),
  
  -- Marcus the Consultant  
  ('profile_marcus', 'user_marcus_001', 'Marcus', 'Thompson', 'Management consultant traveling 3-4 times per month. Always happy to help fellow travelers with deliveries. Verified business traveler with 500K+ miles.', 'https://api.dicebear.com/7.x/avataaars/svg?seed=marcus&backgroundColor=c0aede', '+1-646-555-0567', '1995-08-22', ARRAY['English', 'French'], 'America/New_York', 'United States', 'New York', '789 Business Plaza, Floor 25', '10001', 'Emma Thompson', '+1-646-555-0568', NOW() - INTERVAL '10 days', NOW() - INTERVAL '30 minutes'),
  
  -- Elena the Expat
  ('profile_elena', 'user_elena_001', 'Elena', 'Rodriguez', 'Marketing professional living in London. Love sending care packages and gifts to family in Spain. Always looking for reliable travelers to help bridge the distance.', 'https://api.dicebear.com/7.x/avataaars/svg?seed=elena&backgroundColor=ffd93d', '+44-20-7946-0958', '1989-11-08', ARRAY['Spanish', 'English'], 'Europe/London', 'United Kingdom', 'London', '56 Camden High Street, Flat 3B', 'NW1 7TH', 'Carlos Rodriguez', '+34-91-555-7890', NOW() - INTERVAL '14 days', NOW() - INTERVAL '3 hours'),
  
  -- Power Traveler
  ('profile_power', 'user_power_traveler', 'Alex', 'Chen', 'Digital nomad and frequent flyer. Currently based in Southeast Asia but travel globally. Love helping people connect across borders through deliveries.', 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex&backgroundColor=74d9cc', '+65-8123-4567', '1993-06-12', ARRAY['English', 'Mandarin', 'Thai'], 'Asia/Singapore', 'Singapore', 'Singapore', '123 Orchard Road, #45-67', '238123', 'Lisa Chen', '+1-415-555-9876', NOW() - INTERVAL '30 days', NOW() - INTERVAL '10 minutes'),
  
  -- Student User
  ('profile_student', 'user_student_001', 'Jamie', 'Wilson', 'International student from Canada studying in the UK. Occasional traveler looking to earn some extra money for books and living expenses.', 'https://api.dicebear.com/7.x/avataaars/svg?seed=jamie&backgroundColor=a8e6cf', '+1-416-555-2345', '2001-01-25', ARRAY['English', 'French'], 'Europe/London', 'United Kingdom', 'London', 'University College London, Student Housing Block A', 'WC1E 6BT', 'Robert Wilson', '+1-416-555-2346', NOW() - INTERVAL '12 days', NOW() - INTERVAL '6 days');