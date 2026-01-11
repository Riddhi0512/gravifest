import { Router } from "express";
// Import the aggregate controller we created
import { getAggregateFinancialBreakdown } from "../controllers/financeController"; 

const router = Router();

/**
 * Route: GET /
 * Purpose: Retrieves the total financial breakdown across all events for a summary dashboard.
 * * Note: When mounted in app.ts at '/finance', this path becomes GET /finance
 */
router.get("/", getAggregateFinancialBreakdown);

export default router;