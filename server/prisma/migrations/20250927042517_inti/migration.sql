-- CreateEnum
CREATE TYPE "public"."Gender" AS ENUM ('Male', 'Female');

-- CreateEnum
CREATE TYPE "public"."UserType" AS ENUM ('individual', 'internal', 'school', 'professional');

-- CreateTable
CREATE TABLE "public"."Users" (
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "gender" "public"."Gender" NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" BIGINT NOT NULL,
    "userType" "public"."UserType" NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "public"."Domains" (
    "domainId" TEXT NOT NULL,
    "domainName" TEXT NOT NULL,

    CONSTRAINT "Domains_pkey" PRIMARY KEY ("domainId")
);

-- CreateTable
CREATE TABLE "public"."Events" (
    "eventId" TEXT NOT NULL,
    "eventName" TEXT NOT NULL,
    "organiserName" TEXT NOT NULL,
    "regFee" INTEGER NOT NULL,
    "totalTickets" INTEGER NOT NULL,
    "buzzMeter" DOUBLE PRECISION NOT NULL,
    "ticketSold" INTEGER NOT NULL,
    "ticketLeft" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "status" BOOLEAN NOT NULL,

    CONSTRAINT "Events_pkey" PRIMARY KEY ("eventId")
);

-- CreateTable
CREATE TABLE "public"."Registration" (
    "regId" TEXT NOT NULL,
    "paymentStatus" BOOLEAN NOT NULL,
    "paymentMode" TEXT NOT NULL,
    "regDate" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,

    CONSTRAINT "Registration_pkey" PRIMARY KEY ("regId")
);

-- CreateTable
CREATE TABLE "public"."Purchase" (
    "purchaseId" TEXT NOT NULL,
    "itemName" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitCost" DOUBLE PRECISION NOT NULL,
    "referenceLink" TEXT,
    "totalCost" DOUBLE PRECISION NOT NULL,
    "eventId" TEXT NOT NULL,
    "domainId" TEXT NOT NULL,

    CONSTRAINT "Purchase_pkey" PRIMARY KEY ("purchaseId")
);

-- CreateTable
CREATE TABLE "public"."Halls" (
    "hallId" TEXT NOT NULL,
    "hallName" TEXT NOT NULL,
    "rentalCost" DOUBLE PRECISION NOT NULL,
    "capacity" INTEGER NOT NULL,
    "roomsRequired" INTEGER NOT NULL,
    "hoursRequired" INTEGER NOT NULL,
    "totalCost" DOUBLE PRECISION NOT NULL,
    "eventId" TEXT NOT NULL,
    "domainId" TEXT NOT NULL,

    CONSTRAINT "Halls_pkey" PRIMARY KEY ("hallId")
);

-- CreateTable
CREATE TABLE "public"."Gc" (
    "gcId" TEXT NOT NULL,
    "guestName" TEXT NOT NULL,
    "hospitalityCost" DOUBLE PRECISION NOT NULL,
    "accomadationCost" DOUBLE PRECISION NOT NULL,
    "guestCost" DOUBLE PRECISION NOT NULL,
    "eventId" TEXT NOT NULL,
    "domainId" TEXT NOT NULL,

    CONSTRAINT "Gc_pkey" PRIMARY KEY ("gcId")
);

-- CreateTable
CREATE TABLE "public"."Transport" (
    "transportId" TEXT NOT NULL,
    "veichalType" TEXT NOT NULL,
    "veichalCost" DOUBLE PRECISION NOT NULL,
    "distance" DOUBLE PRECISION NOT NULL,
    "driver bata" DOUBLE PRECISION NOT NULL,
    "tCost" DOUBLE PRECISION NOT NULL,
    "gcId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "domainId" TEXT NOT NULL,

    CONSTRAINT "Transport_pkey" PRIMARY KEY ("transportId")
);

-- CreateTable
CREATE TABLE "public"."Sponsorship" (
    "sponsorId" TEXT NOT NULL,
    "sponsorName" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "eventId" TEXT NOT NULL,
    "domainId" TEXT NOT NULL,

    CONSTRAINT "Sponsorship_pkey" PRIMARY KEY ("sponsorId")
);

-- CreateTable
CREATE TABLE "public"."Rnr" (
    "rnrId" TEXT NOT NULL,
    "ticketSold" INTEGER NOT NULL,
    "regFee" INTEGER NOT NULL,
    "ticketProfit" DOUBLE PRECISION NOT NULL,
    "prizePool" DOUBLE PRECISION NOT NULL,
    "eventId" TEXT NOT NULL,
    "domainId" TEXT NOT NULL,

    CONSTRAINT "Rnr_pkey" PRIMARY KEY ("rnrId")
);

-- CreateTable
CREATE TABLE "public"."Finance" (
    "financeId" TEXT NOT NULL,
    "pCost" DOUBLE PRECISION NOT NULL,
    "hCost" DOUBLE PRECISION NOT NULL,
    "gCost" DOUBLE PRECISION NOT NULL,
    "tCost" DOUBLE PRECISION NOT NULL,
    "sGot" DOUBLE PRECISION NOT NULL,
    "prizePool" DOUBLE PRECISION NOT NULL,
    "ticketProfit" DOUBLE PRECISION NOT NULL,
    "totalRevenue" DOUBLE PRECISION NOT NULL,
    "totalExpenditure" DOUBLE PRECISION NOT NULL,
    "profit_loss" DOUBLE PRECISION NOT NULL,
    "status" BOOLEAN NOT NULL,
    "eventId" TEXT NOT NULL,
    "domainId" TEXT NOT NULL,

    CONSTRAINT "Finance_pkey" PRIMARY KEY ("financeId")
);

-- CreateTable
CREATE TABLE "public"."BalanceSheet" (
    "summaryId" TEXT NOT NULL,
    "net_Revenue" DOUBLE PRECISION NOT NULL,
    "net_Expenditure" DOUBLE PRECISION NOT NULL,
    "net_profit_loss" DOUBLE PRECISION NOT NULL,
    "net_pCost" DOUBLE PRECISION NOT NULL,
    "net_hCost" DOUBLE PRECISION NOT NULL,
    "net_gCost" DOUBLE PRECISION NOT NULL,
    "net_tCost" DOUBLE PRECISION NOT NULL,
    "net_sGot" DOUBLE PRECISION NOT NULL,
    "net_prizePool" DOUBLE PRECISION NOT NULL,
    "net_ticketProfit" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "BalanceSheet_pkey" PRIMARY KEY ("summaryId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "public"."Users"("email");

-- AddForeignKey
ALTER TABLE "public"."Registration" ADD CONSTRAINT "Registration_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."Users"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Registration" ADD CONSTRAINT "Registration_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."Events"("eventId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Purchase" ADD CONSTRAINT "Purchase_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."Events"("eventId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Purchase" ADD CONSTRAINT "Purchase_domainId_fkey" FOREIGN KEY ("domainId") REFERENCES "public"."Domains"("domainId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Halls" ADD CONSTRAINT "Halls_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."Events"("eventId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Halls" ADD CONSTRAINT "Halls_domainId_fkey" FOREIGN KEY ("domainId") REFERENCES "public"."Domains"("domainId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Gc" ADD CONSTRAINT "Gc_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."Events"("eventId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Gc" ADD CONSTRAINT "Gc_domainId_fkey" FOREIGN KEY ("domainId") REFERENCES "public"."Domains"("domainId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Transport" ADD CONSTRAINT "Transport_gcId_fkey" FOREIGN KEY ("gcId") REFERENCES "public"."Gc"("gcId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Transport" ADD CONSTRAINT "Transport_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."Events"("eventId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Transport" ADD CONSTRAINT "Transport_domainId_fkey" FOREIGN KEY ("domainId") REFERENCES "public"."Domains"("domainId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Sponsorship" ADD CONSTRAINT "Sponsorship_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."Events"("eventId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Sponsorship" ADD CONSTRAINT "Sponsorship_domainId_fkey" FOREIGN KEY ("domainId") REFERENCES "public"."Domains"("domainId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Rnr" ADD CONSTRAINT "Rnr_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."Events"("eventId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Rnr" ADD CONSTRAINT "Rnr_domainId_fkey" FOREIGN KEY ("domainId") REFERENCES "public"."Domains"("domainId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Finance" ADD CONSTRAINT "Finance_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."Events"("eventId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Finance" ADD CONSTRAINT "Finance_domainId_fkey" FOREIGN KEY ("domainId") REFERENCES "public"."Domains"("domainId") ON DELETE RESTRICT ON UPDATE CASCADE;
