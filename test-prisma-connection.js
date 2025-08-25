// Simple test script to verify Prisma database connection
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function testConnection() {
  try {
    console.log('🔍 Testing Prisma database connection...');
    
    // Test basic connection
    await prisma.$connect();
    console.log('✅ Connected to database');
    
    // Test query - check if we can run a simple query
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Query test successful:', result);
    
    // Test if User table exists by attempting to count rows
    try {
      const userCount = await prisma.user.count();
      console.log(`✅ User table found with ${userCount} records`);
    } catch (error) {
      console.log('❌ User table query failed:', error.message);
    }
    
    console.log('🎉 Prisma connection test completed successfully!');
    
  } catch (error) {
    console.error('❌ Prisma connection test failed:', error);
  } finally {
    await prisma.$disconnect();
    console.log('🔌 Disconnected from database');
  }
}

testConnection();