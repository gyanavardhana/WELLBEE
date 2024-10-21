import React, { useState } from "react";
import Navbar from "../../components/common/Navbar";
const Therapy = () => {
  const [bookingDetails, setBookingDetails] = useState({
    date: "",
    time: "",
    type: "general",
  });

  const [pastConsultations, setPastConsultations] = useState([
    { id: 1, date: "2024-09-21", type: "Mental Health", feedbackGiven: true },
    { id: 2, date: "2024-08-14", type: "Physical Health", feedbackGiven: false },
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    // Handle booking logic here (e.g., saving to database or API call)
    alert("Consultation booked successfully!");
  };

  const handleFeedbackClick = (id) => {
    // Redirect to feedback page or open feedback modal for the given consultation
    alert(`Leave feedback for consultation ID: ${id}`);
  };

  const handleRebookClick = (id) => {
    // Logic for rebooking the consultation
    alert(`Rebook consultation ID: ${id}`);
  };

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-orange-100 p-8 mt-24 flex flex-col items-center">
      <header className="w-full flex justify-between items-center p-4 bg-orange-300 shadow-md rounded mb-8">
        <h1 className="text-3xl text-orange-800">Therapy Consultations</h1>
        <div className="flex items-center space-x-4">
          {/* User profile section */}
        </div>
      </header>

      {/* Consultation Booking Form */}
      <section className="w-full max-w-lg mb-8">
        <h2 className="text-xl text-orange-800 mb-4">Book a Consultation</h2>
        <form
          className="bg-orange-200 p-4 rounded shadow-md space-y-4"
          onSubmit={handleBookingSubmit}
        >
          <div>
            <label className="block text-orange-800 mb-2" htmlFor="date">
              Select Date:
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={bookingDetails.date}
              onChange={handleInputChange}
              className="w-full p-2 text-orange-800 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
              required
            />
          </div>

          <div>
            <label className="block text-orange-800 mb-2" htmlFor="time">
              Select Time:
            </label>
            <input
              type="time"
              id="time"
              name="time"
              value={bookingDetails.time}
              onChange={handleInputChange}
              className="w-full p-2 text-orange-800 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
              required
            />
          </div>

          <div>
            <label className="block text-orange-800 mb-2" htmlFor="type">
              Type of Consultation:
            </label>
            <select
              id="type"
              name="type"
              value={bookingDetails.type}
              onChange={handleInputChange}
              className="w-full p-2 text-orange-800 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
            >
              <option value="general">General Consultation</option>
              <option value="mental">Mental Health</option>
              <option value="physical">Physical Health</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 text-orange-100 p-2 rounded hover:bg-orange-600 transition duration-300"
          >
            Book Consultation
          </button>
        </form>
      </section>

      {/* Past Consultations */}
      <section className="w-full max-w-lg">
        <h2 className="text-xl text-orange-800 mb-4">Past Consultations</h2>
        <div className="bg-orange-200 p-4 rounded shadow-md space-y-4">
          {pastConsultations.map((consultation) => (
            <div
              key={consultation.id}
              className="flex justify-between items-center p-2 bg-orange-50 rounded shadow-sm"
            >
              <div>
                <h3 className="text-orange-800 font-medium">
                  {consultation.type} Consultation
                </h3>
                <p className="text-orange-600">Date: {consultation.date}</p>
              </div>
              <div className="space-x-2">
                {consultation.feedbackGiven ? (
                  <button
                    disabled
                    className="px-4 py-2 bg-orange-300 text-orange-700 rounded cursor-not-allowed"
                  >
                    Feedback Given
                  </button>
                ) : (
                  <button
                    onClick={() => handleFeedbackClick(consultation.id)}
                    className="px-4 py-2 bg-orange-500 text-orange-100 rounded hover:bg-orange-600 transition duration-300"
                  >
                    Give Feedback
                  </button>
                )}
                <button
                  onClick={() => handleRebookClick(consultation.id)}
                  className="px-4 py-2 bg-orange-500 text-orange-100 rounded hover:bg-orange-600 transition duration-300"
                >
                  Rebook
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
    </>
    
  );
};

export default Therapy;
