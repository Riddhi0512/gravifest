import { useGetDashboardMetricsQuery } from '@/State/api';
import { Ticket } from 'lucide-react';
import React from 'react'
import BuzzMeter from '../(components)/BuzzMeter';
import Image from "next/image";

const CardEvent = () => {
    const {data: dashboardMetrics, isLoading} = useGetDashboardMetricsQuery();

  return (
    <div className="row-span-3 xl:row-span-6 bg-white shadow-md rounded-2xl pb-16">
        {isLoading ? (
            <div className='mg-5'>Loading...</div>
        ): (
            <>
                <h3 className='text-lg font-semibold px-7 pt-5 pb-2'>
                    Popular Events
                </h3>
                <hr />
                <div className='overflow-auto h-full'>
                    {dashboardMetrics?.popularEvents.map((event) => ( 
                        <div
                            key={event.eventId}
                            className="flex items-center justify-between gap-3 px-5 py-7 border-b"
                        >
                            <div className='flex items-center gap-3'>
                                <Image
                                    src={`/assets/${event.eventId}.webp`}
                                    alt={event.eventName}
                                    width={100}
                                    height={100}
                                    className="mb-3 rounded-md w-20 h-20 object-cover"
                                />
                                <div className='flex flex-col justify-between gap-1'>
                                    <div className='font-bold text-gray-700'>{event.eventName}</div>
                                    <div className='flex text-sm items-center'>
                                        <span className='font-bold text-blue-500 text-xs'>
                                            ₹{event.regFee}
                                        </span>
                                        <span className='mx-2'>|</span>
                                        <BuzzMeter buzzMeter={event.buzzMeter || 0} />
                                    </div>
                                </div>
                            </div>

                            <div className='text-xs flex items-center'>
                                <button className='p-2 rounded-full bg-blue-100 text-blue-600 mr-2'>
                                    <Ticket className='w-4 h-4' />
                                </button>
                                <div className="flex flex-col">
                                    <span className="text-gray-600 font-medium">{event.ticketSold} sold</span>
                                    <span className="text-gray-500">{event.ticketLeft} left</span>
                                </div>
                            </div>


                        </div>
                    ))}
                </div>
            </>
        )}
    </div>
  )
}

export default CardEvent;