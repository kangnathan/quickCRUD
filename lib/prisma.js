import { PrismaClient } from '@prisma/client';

const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

// Add error handling for unhandled rejections
process.on('unhandledRejection', (error) => {
  console.error('Unhandled promise rejection:', error);
});

// Optional: Add error handling for database connection errors
prisma.$connect().catch((error) => {
  console.error('Error connecting to the database:', error);
});

export default prisma;

