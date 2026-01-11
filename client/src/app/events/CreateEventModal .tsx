import React, { useState } from 'react';
import { NewEvent } from '@/State/api';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (eventData: NewEvent) => void;
};

// Define a new type for the form data, excluding buzzMeter
type EventFormData = Omit<NewEvent, 'buzzMeter'>;

const CreateEventModal = ({ isOpen, onClose, onCreate }: ModalProps) => {
  const [formData, setFormData] = useState<EventFormData>({
    eventName: '',
    organiserName: '',
    regFee: 0,
    totalTickets: 0,
    startDate: '',
    endDate: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Re-add buzzMeter with a default value of 0 before sending to the API
    const eventDataToSend: NewEvent = { ...formData, buzzMeter: 0 };
    onCreate(eventDataToSend);
    onClose(); // Close modal after submission
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Create New Event</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4">
            <input
              type="text"
              name="eventName"
              placeholder="Event Name"
              required
              className="p-2 border rounded"
              onChange={handleChange}
            />
            <input
              type="text"
              name="organiserName"
              placeholder="Organiser Name"
              required
              className="p-2 border rounded"
              onChange={handleChange}
            />
            <input
              type="number"
              name="regFee"
              placeholder="Registration Fee (₹)"
              required
              className="p-2 border rounded"
              onChange={handleChange}
            />
            <input
              type="number"
              name="totalTickets"
              placeholder="Total Tickets"
              required
              className="p-2 border rounded"
              onChange={handleChange}
            />
            {/* --- BUZZ METER INPUT REMOVED --- */}
             <div>
                <label className="text-sm text-gray-600">Start Date</label>
                <input type="date" name="startDate" required className="p-2 border rounded w-full" onChange={handleChange} />
            </div>
            <div>
                <label className="text-sm text-gray-600">End Date</label>
                <input type="date" name="endDate" required className="p-2 border rounded w-full" onChange={handleChange} />
            </div>
          </div>
          <div className="flex justify-end mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 mr-2 bg-gray-200 rounded">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
              Save Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEventModal;