import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

// Initialize Prisma Client with detailed logging
// 'error' is the most critical for connection issues
// 'query' helps see the SQL being executed
const prisma = new PrismaClient({
  log: ['error', 'warn', 'info', 'query'],
});


export const getRegistrations = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // This query will now log the SQL to the console
    const registrations = await prisma.registration.findMany();
    res.json(registrations);
  } catch (error) {
    // The specific database error should now appear in the server console 
    // before this generic error message is sent to the client.
    console.error("Database Query Error:", error);
    res.status(500).json({ message: "Error retrieving users" });
  }
};