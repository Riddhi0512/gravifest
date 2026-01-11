"use client";

import React, { useState } from "react";
// 1. Import the new delete hook and a trash icon
import { useGetEventsQuery, useCreateEventMutation, useDeleteEventMutation } from "@/State/api"; 
import { PlusCircleIcon, SearchIcon, CalendarDays, Users, Trash2 } from "lucide-react"; 
import Header from "@/app/(components)/Header";
import CreateEventModal from "./CreateEventModal ";
import Image from "next/image";
import { NewEvent } from "@/State/api";

const Events = () => {
  const [deleteEvent] = useDeleteEventMutation();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: events, isLoading, isError } = useGetEventsQuery(searchTerm);
  const [createEvent] = useCreateEventMutation();
  
  const handleCreateEvent = async (eventData: NewEvent) => {
    await createEvent(eventData);
  };

  const handleDelete = async (eventId: string) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      await deleteEvent(eventId);
    }
  };

  if (isLoading) return <div className="p-4">Loading events...</div>;
  if (isError || !events) return <div className="p-4 text-center text-red-500">Failed to fetch events.</div>;

  return (
    <div className="p-8 w-full">
      {/* SEARCH BAR AND HEADER (No changes here) */}
      <div className="mb-6">
        <div className="flex items-center border-2 border-gray-200 rounded">
          <SearchIcon className="w-5 h-5 text-gray-500 m-2" />
          <input
            className="w-full py-2 px-4 rounded bg-white text-gray-700"
            placeholder="Search events by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="flex justify-between items-center mb-6">
        <Header name="Events" subtitle="Manage and view all company events" />
        <button
          className="flex items-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => setIsModalOpen(true)}
        >
          <PlusCircleIcon className="w-5 h-5 mr-2" /> Create Event
        </button>
      </div>

      {/* EVENTS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {events?.map((event) => (
          <div
            key={event.eventId}
            className="border shadow-lg rounded-lg p-4 bg-white flex flex-col justify-between"
          >
            {/* --- DELETE BUTTON MOVED FROM HERE --- */}
            
            <div>
              <Image
                src={`/assets/${event.eventId}.webp`}
                alt={event.eventName}
                width={400}
                height={400}
                className="mb-3 rounded-md w-full h-80 object-cover"
              />
              <h3 className="text-xl text-gray-900 font-bold">
                {event.eventName}
              </h3>
              <p className="text-gray-600 font-semibold">{event.organiserName}</p>
              <div className="flex items-center mt-2 text-sm text-gray-500">
                <CalendarDays className="w-4 h-4 mr-2" />
                <span>{new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center mt-1 text-sm text-gray-500">
                 <Users className="w-4 h-4 mr-2" />
                 <span>{event.ticketSold} / {event.totalTickets} attendees</span>
              </div>
            </div>

            {/* --- CARD FOOTER --- */}
            <div className="flex justify-between items-center mt-4 pt-4 border-t">
                <p className="text-lg font-bold text-gray-800">₹{event.regFee.toLocaleString()}</p>
                <div className="flex items-center gap-4"> {/* Added a wrapper for status and button */}
                    {event.status ? (
                        <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">In Profit</span>
                    ) : (
                        <span className="px-2 py-1 text-xs font-semibold text-red-800 bg-red-100 rounded-full">In Loss</span>
                    )}
                    {/* --- DELETE BUTTON MOVED TO HERE --- */}
                    <button
                        onClick={() => handleDelete(event.eventId)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded-full transition-colors"
                        aria-label="Delete event"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL (No changes here) */}
      <CreateEventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateEvent}
      />
    </div>
  );
};

export default Events;