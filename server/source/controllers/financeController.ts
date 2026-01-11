import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Interface to type the output for clarity
interface FinancialBreakdown {
    name: string;
    value: number;
}

/**
 * Retrieves the AGGREGATE financial breakdown (Expenditure and Revenue) 
 * across ALL Finance records and formats them for charts.
 * @route GET /finance/breakdown (example path)
 */
export const getAggregateFinancialBreakdown = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const financeAggregates = await prisma.finance.aggregate({
            _sum: {
                pCost: true,
                gCost: true,
                hCost: true,
                tCost: true,
                sGot: true,
                prizePool: true,
                ticketProfit: true,
            },
        });

        const sumData = financeAggregates._sum;

        let expenseBreakdown: FinancialBreakdown[] = [];
        let revenueBreakdown: FinancialBreakdown[] = [];
        
        // Use a function to safely convert and filter the data
        const transformData = (name: string, value: any): FinancialBreakdown | null => {
             const numericValue = Number(value) || 0;
             return numericValue > 0 ? { name, value: numericValue } : null;
        };


        if (sumData) {
            // 1. Expense Breakdown
            expenseBreakdown = [
                transformData("Purchase Cost", sumData.pCost),
                transformData("Guest Cost", sumData.gCost),
                transformData("Hall Rental Cost", sumData.hCost),
                transformData("Transport Cost", sumData.tCost),
                transformData("Prize Pool", sumData.prizePool),
            ].filter((item): item is FinancialBreakdown => item !== null);

            // 2. Revenue Breakdown
            revenueBreakdown = [
                transformData("Sponsorship", sumData.sGot),
                transformData("Ticket Profit", sumData.ticketProfit),
            ].filter((item): item is FinancialBreakdown => item !== null);
        }

        // CORRECT FIX: Wrap the two separate arrays into a single JSON object.
        res.json({
            expenditure: expenseBreakdown,
            revenue: revenueBreakdown,
        });

    } catch (error) {
        console.error("Error fetching aggregate financial breakdown:", error);
        res.status(500).json({ message: "Error retrieving aggregate financial breakdown." });
    }
};