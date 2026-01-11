"use client"

import CardEvent from "./CardEvent"
import CardExpenseBreakdown from "./CardExpenseBreakdown"
import ParticipantsCard from "./CardParticipantsType"
import CardRegistrationSummary from "./CardRegistrationSummary"
import CardRevenueBreakdown from "./CardRevenueBreakdown"

const Dashboard = () => {
  return (
    <div
  className="
    ml-2 md:ml-6 xl:ml-12
    grid 
    grid-cols-1 
    md:grid-cols-2 
    xl:grid-cols-3 
    gap-10 pb-4 
    grid-rows-[repeat(8,20vh)] 
    md:grid-rows-[repeat(8,20vh)] 
    xl:grid-rows-[repeat(8,7.5vh)]
  "
>
  <CardEvent />
  <CardRegistrationSummary />
  <CardExpenseBreakdown />
  <CardRevenueBreakdown />
  <ParticipantsCard />
</div>



  )
}

export default Dashboard