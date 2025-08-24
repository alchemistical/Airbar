import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // =============================================================================
  // LOCATIONS DATA
  // =============================================================================
  console.log("📍 Creating locations...");

  const locations = await Promise.all([
    // Major Cities & Airports
    prisma.location.create({
      data: {
        name: "New York (JFK)",
        city: "New York",
        country: "United States",
        countryCode: "US",
        airportCode: "JFK",
        type: "AIRPORT",
        latitude: 40.6413,
        longitude: -73.7781,
        timezone: "America/New_York",
      },
    }),
    prisma.location.create({
      data: {
        name: "Los Angeles (LAX)",
        city: "Los Angeles",
        country: "United States",
        countryCode: "US",
        airportCode: "LAX",
        type: "AIRPORT",
        latitude: 33.9425,
        longitude: -118.4081,
        timezone: "America/Los_Angeles",
      },
    }),
    prisma.location.create({
      data: {
        name: "London (LHR)",
        city: "London",
        country: "United Kingdom",
        countryCode: "GB",
        airportCode: "LHR",
        type: "AIRPORT",
        latitude: 51.47,
        longitude: -0.4543,
        timezone: "Europe/London",
      },
    }),
    prisma.location.create({
      data: {
        name: "Paris (CDG)",
        city: "Paris",
        country: "France",
        countryCode: "FR",
        airportCode: "CDG",
        type: "AIRPORT",
        latitude: 49.0097,
        longitude: 2.5479,
        timezone: "Europe/Paris",
      },
    }),
    prisma.location.create({
      data: {
        name: "Tokyo (NRT)",
        city: "Tokyo",
        country: "Japan",
        countryCode: "JP",
        airportCode: "NRT",
        type: "AIRPORT",
        latitude: 35.7647,
        longitude: 140.3864,
        timezone: "Asia/Tokyo",
      },
    }),
    prisma.location.create({
      data: {
        name: "Singapore (SIN)",
        city: "Singapore",
        country: "Singapore",
        countryCode: "SG",
        airportCode: "SIN",
        type: "AIRPORT",
        latitude: 1.3644,
        longitude: 103.9915,
        timezone: "Asia/Singapore",
      },
    }),
    prisma.location.create({
      data: {
        name: "Dubai (DXB)",
        city: "Dubai",
        country: "United Arab Emirates",
        countryCode: "AE",
        airportCode: "DXB",
        type: "AIRPORT",
        latitude: 25.2532,
        longitude: 55.3657,
        timezone: "Asia/Dubai",
      },
    }),
    prisma.location.create({
      data: {
        name: "Sydney (SYD)",
        city: "Sydney",
        country: "Australia",
        countryCode: "AU",
        airportCode: "SYD",
        type: "AIRPORT",
        latitude: -33.9399,
        longitude: 151.1753,
        timezone: "Australia/Sydney",
      },
    }),
  ]);

  console.log(`✅ Created ${locations.length} locations`);

  // =============================================================================
  // ROUTE RESTRICTIONS
  // =============================================================================
  console.log("🚫 Creating route restrictions...");

  const routeRestrictions = await Promise.all([
    prisma.routeRestriction.create({
      data: {
        originId: locations[0].id, // JFK
        destinationId: locations[2].id, // LHR
        restrictedItems: ["liquids", "batteries", "food"],
        description: "Standard international flight restrictions",
      },
    }),
    prisma.routeRestriction.create({
      data: {
        originId: locations[1].id, // LAX
        destinationId: locations[4].id, // NRT
        restrictedItems: ["food", "plants", "medications"],
        description: "Japan has strict import restrictions",
      },
    }),
  ]);

  console.log(`✅ Created ${routeRestrictions.length} route restrictions`);

  // =============================================================================
  // TEST USERS
  // =============================================================================
  console.log("👥 Creating test users...");

  const passwordHash = await bcrypt.hash("password123", 12);

  const users = await Promise.all([
    // Test Traveler
    prisma.user.create({
      data: {
        email: "alex.kim@example.com",
        username: "alexkim",
        passwordHash,
        emailVerified: true,
        phoneVerified: true,
        kycStatus: "APPROVED",
        profile: {
          create: {
            firstName: "Alex",
            lastName: "Kim",
            bio: "Frequent business traveler passionate about connecting communities through reliable package delivery.",
            phoneNumber: "+1-555-0123",
            nationality: "US",
            languages: ["English", "Korean"],
            city: "New York",
            country: "United States",
            rating: 4.8,
            totalTrips: 42,
            totalDeliveries: 38,
            reviewCount: 35,
          },
        },
      },
      include: { profile: true },
    }),
    // Test Sender
    prisma.user.create({
      data: {
        email: "sarah.wilson@example.com",
        username: "sarahw",
        passwordHash,
        emailVerified: true,
        phoneVerified: false,
        kycStatus: "APPROVED",
        profile: {
          create: {
            firstName: "Sarah",
            lastName: "Wilson",
            bio: "Small business owner who frequently ships products internationally.",
            phoneNumber: "+1-555-0456",
            nationality: "US",
            languages: ["English", "Spanish"],
            city: "Los Angeles",
            country: "United States",
            rating: 4.6,
            totalTrips: 0,
            totalDeliveries: 0,
            reviewCount: 8,
          },
        },
      },
      include: { profile: true },
    }),
    // Test International User
    prisma.user.create({
      data: {
        email: "takeshi.yamamoto@example.com",
        username: "takeshi_y",
        passwordHash,
        emailVerified: true,
        phoneVerified: true,
        kycStatus: "APPROVED",
        profile: {
          create: {
            firstName: "Takeshi",
            lastName: "Yamamoto",
            bio: "Tech entrepreneur traveling between Tokyo and Silicon Valley.",
            phoneNumber: "+81-90-1234-5678",
            nationality: "JP",
            languages: ["Japanese", "English"],
            city: "Tokyo",
            country: "Japan",
            rating: 4.9,
            totalTrips: 18,
            totalDeliveries: 16,
            reviewCount: 15,
          },
        },
      },
      include: { profile: true },
    }),
  ]);

  console.log(`✅ Created ${users.length} test users`);

  // =============================================================================
  // SAMPLE TRIPS
  // =============================================================================
  console.log("✈️ Creating sample trips...");

  const trips = await Promise.all([
    // Active trip: JFK -> LHR
    prisma.trip.create({
      data: {
        travelerId: users[0].id,
        originId: locations[0].id, // JFK
        destinationId: locations[2].id, // LHR
        departureDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        arrivalDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000), // 8 days from now
        airline: "British Airways",
        flightNumber: "BA178",
        spaceAvailable: 8.5,
        bagTypes: ["CHECKED", "CARRY_ON"],
        numberOfBags: 2,
        pricePerKg: 12.5,
        acceptableItems: ["documents", "electronics", "clothing", "gifts"],
        restrictions: ["no liquids", "no batteries"],
        additionalNotes:
          "Happy to help with small packages. Business traveler with excellent track record.",
        flexibilityLevel: 2,
        status: "ACTIVE",
      },
    }),
    // Another trip: LAX -> NRT
    prisma.trip.create({
      data: {
        travelerId: users[2].id,
        originId: locations[1].id, // LAX
        destinationId: locations[4].id, // NRT
        departureDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
        arrivalDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
        airline: "Japan Airlines",
        flightNumber: "JL62",
        spaceAvailable: 12.0,
        bagTypes: ["CHECKED", "SUITCASE"],
        numberOfBags: 1,
        pricePerKg: 15.0,
        acceptableItems: ["documents", "electronics", "books"],
        restrictions: ["no food", "no plants"],
        additionalNotes:
          "Tech professional traveling for business. Can handle fragile electronics.",
        flexibilityLevel: 1,
        status: "ACTIVE",
      },
    }),
  ]);

  console.log(`✅ Created ${trips.length} sample trips`);

  // =============================================================================
  // SAMPLE PACKAGES
  // =============================================================================
  console.log("📦 Creating sample packages...");

  const packages = await Promise.all([
    // Package matching first trip
    prisma.package.create({
      data: {
        senderId: users[1].id,
        originId: locations[0].id, // JFK
        destinationId: locations[2].id, // LHR
        description:
          "Important business documents and small gift for London client",
        weight: 2.5,
        dimensions: {
          length: 30,
          width: 20,
          height: 5,
        },
        declaredValue: 150,
        category: "BUSINESS_ITEMS",
        fragile: false,
        urgent: false,
        pickupAddress: "123 Business Ave, New York, NY 10001",
        deliveryAddress: "456 Corporate St, London EC1A 1BB, UK",
        pickupWindow: {
          start: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
          end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
        receiverName: "James Smith",
        receiverPhone: "+44-20-7123-4567",
        receiverEmail: "j.smith@londonbusiness.co.uk",
        maxReward: 45.0,
        estimatedReward: 31.25, // 2.5kg * 12.50
        traditionalCost: 78.13,
        savings: 60,
        status: "PENDING",
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    }),
    // Another package
    prisma.package.create({
      data: {
        senderId: users[1].id,
        originId: locations[1].id, // LAX
        destinationId: locations[4].id, // NRT
        description: "High-end electronics prototype for Tokyo tech conference",
        weight: 4.2,
        dimensions: {
          length: 40,
          width: 30,
          height: 15,
        },
        declaredValue: 2500,
        category: "ELECTRONICS",
        fragile: true,
        urgent: true,
        pickupAddress: "789 Tech Drive, Los Angeles, CA 90210",
        deliveryAddress: "321 Innovation Plaza, Shibuya, Tokyo 150-0043",
        pickupWindow: {
          start: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
          end: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        },
        receiverName: "Hiroshi Tanaka",
        receiverPhone: "+81-3-1234-5678",
        receiverEmail: "h.tanaka@tokyotech.jp",
        maxReward: 85.0,
        estimatedReward: 63.0, // 4.2kg * 15.00
        traditionalCost: 176.4,
        savings: 64,
        status: "PENDING",
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    }),
  ]);

  console.log(`✅ Created ${packages.length} sample packages`);

  // =============================================================================
  // SAMPLE NOTIFICATIONS
  // =============================================================================
  console.log("🔔 Creating sample notifications...");

  const notifications = await Promise.all([
    prisma.notification.create({
      data: {
        userId: users[0].id,
        type: "MATCH_FOUND",
        title: "New Package Match Found!",
        message:
          "A package from New York to London matches your upcoming trip.",
        data: {
          packageId: packages[0].id,
          tripId: trips[0].id,
        },
        priority: "HIGH",
      },
    }),
    prisma.notification.create({
      data: {
        userId: users[1].id,
        type: "SYSTEM_ALERT",
        title: "Welcome to AugAirBar!",
        message:
          "Your account has been verified. You can now start sending packages.",
        priority: "NORMAL",
      },
    }),
  ]);

  console.log(`✅ Created ${notifications.length} notifications`);

  // =============================================================================
  // SAMPLE SESSIONS (for testing)
  // =============================================================================
  console.log("🔐 Creating sample sessions...");

  const sessions = await Promise.all([
    prisma.session.create({
      data: {
        userId: users[0].id,
        sessionToken: "sample-session-token-alex-kim-12345",
        refreshToken: "sample-refresh-token-alex-kim-67890",
        deviceInfo: {
          userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
          platform: "macOS",
          browser: "Chrome",
        },
        ipAddress: "192.168.1.100",
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    }),
  ]);

  console.log(`✅ Created ${sessions.length} sample sessions`);

  console.log("🎉 Database seeding completed successfully!");
  console.log("\n📊 Summary:");
  console.log(`- ${locations.length} locations`);
  console.log(`- ${routeRestrictions.length} route restrictions`);
  console.log(`- ${users.length} users with profiles`);
  console.log(`- ${trips.length} trips`);
  console.log(`- ${packages.length} packages`);
  console.log(`- ${notifications.length} notifications`);
  console.log(`- ${sessions.length} sessions`);

  console.log("\n🔑 Test Login Credentials:");
  console.log("Email: alex.kim@example.com | Password: password123 (Traveler)");
  console.log(
    "Email: sarah.wilson@example.com | Password: password123 (Sender)"
  );
  console.log(
    "Email: takeshi.yamamoto@example.com | Password: password123 (International)"
  );
}

main()
  .catch(e => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
