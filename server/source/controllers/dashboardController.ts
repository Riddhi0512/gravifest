import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getDashboardMetrics = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const popularEvents = await prisma.events.findMany({
      take: 10,
      orderBy: {
        buzzMeter: "desc",
      },
    });

    const registrations = await prisma.registration.findMany({
      where: {
        paymentStatus: true,
      },
      select: {
        regDate: true,
      },
    });

    // 2. Process the data in memory to count registrations per day
    const countsByDate: { [key: string]: number } = {};
    for (const registration of registrations) {
      // Ensure regDate is treated as a date string for grouping
      const date = registration.regDate.toISOString().split('T')[0];
      countsByDate[date] = (countsByDate[date] || 0) + 1;
    }

    // 3. Sort and format the counted data into a clean array
    const registrationSummary = Object.keys(countsByDate)
      .sort() // Sorts dates from oldest to newest
      .map(date => ({
        date: date,
        count: countsByDate[date],
      }));

    // --- Start: Replacing BalanceSheet with Finance for Aggregation ---

    // 1. Aggregate Finance data across all records to get overall totals
    const financeAggregates = await prisma.finance.aggregate({
      _sum: {
        pCost: true,
        hCost: true,
        gCost: true,
        tCost: true,
        sGot: true,
        prizePool: true,
        ticketProfit: true,
      },
    });

    // Use null for safety if the aggregation result is somehow null, 
    // although _sum should return an object with null values for fields if no records exist.
    const sumData = financeAggregates._sum;

    let expenseBreakdown = null;
    let revenueBreakdown = null;

    // 2. If aggregation data exists, create the breakdown lists
    // We check if any cost/revenue data is present (even if 0, the object will exist)
    if (sumData) {
      expenseBreakdown = [
        { name: "Purchase Cost", value: sumData.pCost || 0 },
        { name: "Hall Rental Cost", value: sumData.hCost || 0 },
        { name: "Guest Cost", value: sumData.gCost || 0 },
        { name: "Transport Cost", value: sumData.tCost || 0 },
        { name: "Prize Pool", value: sumData.prizePool || 0 },
      ];
      revenueBreakdown = [
        { name: "Sponsorship", value: sumData.sGot || 0 },
        { name: "Ticket Profit", value: sumData.ticketProfit || 0 },
      ];
    }
    
    // --- End: Replacing BalanceSheet with Finance for Aggregation ---


    const userTypeCounts = await prisma.users.groupBy({
      by: ["userType"],
      _count: {
        _all: true, // Count all records in each group
      },
    });

    // 2. Format the data into a more friendly structure for your front-end
    const formattedCounts = userTypeCounts.map((group) => ({
      userType: group.userType,
      count: group._count._all,
    }));

    res.json({
      popularEvents,
      registrationSummary,
      expenseBreakdown,
      revenueBreakdown,
      formattedCounts,
    });
  } catch (error) {
    console.error("Error retrieving dashboard metrics:", error);
    res.status(500).json({ message: "Error retrieving dashboard metrics" });
  }
};