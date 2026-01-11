import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define the Gender enum
export type Gender = "Male" | "Female";

// Define the UserType enum to match your Prisma schema for type safety
export type UserType = "individual" | "internal" | "school" | "professional";

// -------------------------------------------------------------------
// NEW: User Interface (Based on Prisma Users model)
// Note: phoneNumber is number/string because it comes back as a string 
// after the BigInt fix in the Express server.
export interface User {
  userId: string;
  name: string;
  gender: Gender;
  email: string;
  phoneNumber: string; 
  userType: UserType;
}
// -------------------------------------------------------------------

// Interface for objects in the popularEvents array
export interface Event {
  eventId: string;
  eventName: string;
  organiserName: string;
  regFee: number;
  totalTickets: number;
  buzzMeter: number;
  ticketSold: number;
  ticketLeft: number;
  startDate: string; // Dates become strings in JSON
  endDate: string;
  status: boolean;
}

// NewEvent will have all fields from Event EXCEPT the ones specified.
export type NewEvent = Omit<Event, 'eventId' | 'ticketSold' | 'ticketLeft' | 'status'>;

// Interface for objects in the registrationSummary array
export interface RegistrationSummary {
  date: string;
  count: number;
}

// Interface for objects in the expenseBreakdown array
export interface ExpenseBreakdown {
  name: string;
  value: number;
}

// Interface for objects in the revenueBreakdown array
export interface RevenueBreakdown {
  name: string;
  value: number;
}

// NEW: Interface for the Aggregate Financial Breakdown
// This matches the JSON object returned by your GET /finance endpoint
export interface AggregateFinanceBreakdown {
    expenditure: ExpenseBreakdown[];
    revenue: RevenueBreakdown[];
}

// Interface for objects in the formattedCounts array
export interface ParticipantsType {
  userType: UserType;
  count: number;
}

export interface DashboardMetrics{
  popularEvents: Event[];
  registrationSummary: RegistrationSummary[];
  expenseBreakdown: ExpenseBreakdown[];
  revenueBreakdown: RevenueBreakdown[];
  formattedCounts: ParticipantsType[];
}

export interface Registration {
  regId: string;
  paymentStatus: boolean;
  paymentMode: string;
  regDate: string; // DateTime becomes string in JSON

  // Relations (assuming the API returns nested user and event data)
  userId: string;
  user: User; 
  eventId: string;
  event: Event;
}

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL }),
  reducerPath: "api",
  // ADDED 'Users' tag type
  tagTypes: ["DashboardMetrics","Events", "Users", "Registrations", "Finance"], 
  endpoints: (build) => ({
    getDashboardMetrics: build.query<DashboardMetrics, void>({
      query: () => "/dashboard",
      providesTags: ["DashboardMetrics"],
    }),
    getEvents: build.query<Event[], string | void>({
      query: (search) => ({
        url: "/events",
        params: search ? { search } : {}
      }),
      providesTags: ["Events"],
    }),
    createEvent: build.mutation<Event, NewEvent>({
      query: (newEvent) => ({
        url: "/events",
        method: "POST",
        body: newEvent,
      }),
      invalidatesTags: ["Events"],
    }),
    deleteEvent: build.mutation<void, string>({
      query: (eventId) => ({
        url: `/events/${eventId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Events'],
    }),
    
    // UPDATED: User Interface and route path corrected to "/user"
    getUsers: build.query<User[], void>({
      query: () => "/user", // Changed from "/users" to "/user"
      providesTags: ["Users"],
    }),

    getRegistrations: build.query<Registration[], void>({
      query: () => "/registration", // Maps to the registration router's root route
      providesTags: ["Registrations"],
    }),
    getAggregateFinanceBreakdown: build.query<AggregateFinanceBreakdown, void>({
    query: () => "/finance", // Correct URL mapping
    providesTags: ["Finance"], // Correct tag usage
  }),

  }),

  
});

// --- UPDATE THE EXPORTS TO INCLUDE THE NEW HOOK ---
export const {
  useGetDashboardMetricsQuery,
  useGetEventsQuery,
  useCreateEventMutation,
  useDeleteEventMutation, 
  useGetUsersQuery, 
  useGetRegistrationsQuery,
  useGetAggregateFinanceBreakdownQuery,
} = api;