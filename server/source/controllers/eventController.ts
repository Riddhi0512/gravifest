import { Request, Response } from "express";
// Import Prisma and its specific types for error handling
import { PrismaClient, Prisma } from "@prisma/client";
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

/**
 * Gets all events, with optional search functionality.
 * @route GET /events
 */
export const getEvents = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const search = req.query.search?.toString();
    const events = await prisma.events.findMany({
      where: {
        eventName: {
          contains: search,
          mode: 'insensitive',
        },
      },
    });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving events" });
  }
};

/**
 * Creates a new event.
 * @route POST /events
 */
export const createEvent = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { 
        eventName, 
        organiserName, 
        regFee, 
        totalTickets, 
        buzzMeter, 
        startDate, 
        endDate 
    } = req.body;

    const event = await prisma.events.create({
      data: {
        eventId: uuidv4(),
        eventName,
        organiserName,
        regFee: Number(regFee),
        totalTickets: Number(totalTickets),
        buzzMeter:  0,
        ticketSold: 0,
        ticketLeft: Number(totalTickets),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        status: true,
      },
    });
    res.status(201).json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating event" });
  }
};

/**
 * Deletes an event by its unique ID.
 * @route DELETE /events/:id
 */
export const deleteEvent = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    await prisma.events.delete({
      where: {
        eventId: id,
      },
    });

    res.status(204).send();

  } catch (error) {
    console.error("Error deleting event:", error);

    // This is a type guard to safely check the error type
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // P2025 is Prisma's error code for "record to delete does not exist"
      if (error.code === 'P2025') {
        res.status(404).json({ message: "Event not found" });
        return; 
      }
    }
    
    // This is a fallback for all other unexpected errors
    res.status(500).json({ message: "Error deleting event" });
  }
};