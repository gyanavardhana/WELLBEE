import React, { useEffect, useState } from "react";
import {
  getTherapyAppointmentsForUser,
  updateTherapyAppointmentStatus,
  deleteTherapyAppointment,
  getTherapyAppointmentsForTherapist,
} from "../../services/therapyappointmentService";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

const StatusBadge = ({ status }) => {
  const colors = {
    Pending: "bg-yellow-100 text-yellow-800",
    Confirmed: "bg-green-100 text-green-800",
    Cancelled: "bg-red-100 text-red-800",
  };

  return (
    <span className={`px-2 py-1 rounded-full text-sm font-medium ${colors[status]}`}>
      {status}
    </span>
  );
};

const CustomButton = ({ variant = "primary", className = "", ...props }) => {
  const variants = {
    primary: "bg-orange-500 hover:bg-orange-600 text-white",
    danger: "bg-red-500 hover:bg-red-600 text-white",
    secondary: "bg-gray-500 hover:bg-gray-600 text-white",
  };

  return (
    <button
      className={`font-normal py-2 px-4 rounded transition-colors duration-200 w-full sm:w-auto ${variants[variant]} ${className}`}
      {...props}
    />
  );
};

const MeetingLink = ({ link }) => (
  <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-gray-600">
    <span className="text-sm">Meeting link:</span>
    <a 
      href={link} 
      target="_blank" 
      rel="noopener noreferrer"
      className="text-orange-500 hover:text-orange-600 underline text-sm break-all"
    >
      Join Meeting
    </a>
  </div>
);

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tempStatus, setTempStatus] = useState({});
  const [meetLinks, setMeetLinks] = useState({});
  const userRole = Cookies.get("role");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        let response;
        if (userRole === "USER") {
          response = await getTherapyAppointmentsForUser();
        } else if (userRole === "THERAPIST") {
          response = await getTherapyAppointmentsForTherapist();
        }
        setAppointments(response);
        const initialStatus = {};
        const initialLinks = {};
        response.forEach(apt => {
          initialStatus[apt.id] = apt.status;
          initialLinks[apt.id] = apt.googleMeet || "";
        });
        setTempStatus(initialStatus);
        setMeetLinks(initialLinks);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [userRole]);

  const handleDeleteAppointment = async (appointmentId) => {
    try {
      await deleteTherapyAppointment(appointmentId);
      setAppointments((prev) =>
        prev.filter((appointment) => appointment.id !== appointmentId)
      );
      toast.success("Appointment deleted successfully!");
    } catch (error) {
      setError(error.message);
      toast.error("Failed to delete appointment.");
    }
  };

  const handleUpdateAppointmentStatus = async (appointmentId) => {
    try {
      const newStatus = tempStatus[appointmentId];
      const meetLink = meetLinks[appointmentId];

      await updateTherapyAppointmentStatus(appointmentId, newStatus, meetLink);
      
      setAppointments((prev) =>
        prev.map((appt) =>
          appt.id === appointmentId 
            ? { ...appt, status: newStatus, googleMeet: meetLink } 
            : appt
        )
      );
      toast.success("Appointment status updated successfully!");
    } catch (error) {
      setError(error.message);
      toast.error("Failed to update appointment status.");
    }
  };

  const handleStatusChange = (appointmentId, value) => {
    setTempStatus(prev => ({
      ...prev,
      [appointmentId]: value
    }));
  };

  const handleMeetLinkChange = (appointmentId, value) => {
    setMeetLinks(prev => ({
      ...prev,
      [appointmentId]: value
    }));
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-orange-500"></div>
    </div>
  );
  
  if (error) return (
    <div className="text-red-500 text-center p-4">Error: {error}</div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-gray-800">Appointments</h1>
      {appointments.length > 0 ? (
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div 
              key={appointment.id} 
              className="border border-orange-200 p-4 sm:p-6 rounded-lg bg-orange-100 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-2">
                <div className="w-full sm:w-auto">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-800 break-words">
                    Appointment with{" "}
                    {userRole === "THERAPIST"
                      ? appointment.user.name
                      : appointment.therapist.name}
                  </h2>
                  <p className="text-gray-600 mt-2 text-sm">
                    {new Date(appointment.appointmentDate).toLocaleString()}
                  </p>
                </div>
                <StatusBadge status={appointment.status} />
              </div>

              {userRole === "THERAPIST" ? (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <select
                      value={tempStatus[appointment.id]}
                      onChange={(e) => handleStatusChange(appointment.id, e.target.value)}
                      className="w-full sm:w-auto border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Google Meet Link
                    </label>
                    <input
                      type="text"
                      value={meetLinks[appointment.id]}
                      onChange={(e) => handleMeetLinkChange(appointment.id, e.target.value)}
                      placeholder="Enter Google Meet link"
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>

                  {appointment.googleMeet && (
                    <MeetingLink link={appointment.googleMeet} />
                  )}

                  <div className="pt-2">
                    <CustomButton
                      onClick={() => handleUpdateAppointmentStatus(appointment.id)}
                    >
                      Update Appointment
                    </CustomButton>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {appointment.googleMeet && (
                    <MeetingLink link={appointment.googleMeet} />
                  )}
                  <CustomButton
                    variant="danger"
                    onClick={() => handleDeleteAppointment(appointment.id)}
                  >
                    Cancel Appointment
                  </CustomButton>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600 py-8">No appointments available.</p>
      )}
    </div>
  );
};

export default Appointments;