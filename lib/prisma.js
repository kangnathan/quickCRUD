import { PrismaClient } from "@prisma/client";

// Create a new instance of PrismaClient
const prisma = global.prisma || new PrismaClient();

// Ensure the Prisma client instance is reused in development
if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

export default prisma;
