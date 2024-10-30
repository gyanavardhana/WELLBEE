import React, { useEffect, useState } from "react";
import {
  getAllSlots,
} from "../../services/availableslotService";
import {
  createTherapyAppointment,
  deleteTherapyAppointment
} from "../../services/therapyappointmentService";
import {
  getTherapistProfile,
  updateTherapistProfilebyUser
} from "../../services/therapistprofileServices";
import Cookies from "js-cookie";
import { Rating } from "@mui/material";
import { toast } from "react-toastify"; // Import toast

const CustomButton = ({ className, ...props }) => (
  <button
    className={`bg-orange-500 hover:bg-orange-600 text-white font-normal py-1 px-2 ml-2 mb-1 text-sm rounded ${className}`}
    {...props}
  />
);

const Slots = () => {
  const [slots, setSlots] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRating, setSelectedRating] = useState({});
  const userRole = Cookies.get("role");

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const response = await getAllSlots();
        let filteredSlots = response.groupedSlots;

        if (userRole === "THERAPIST") {
          const therapistProfileData = await getTherapistProfile();
          const therapistUserId = therapistProfileData.therapistProfile.userId;
          filteredSlots = filteredSlots.filter(
            (group) => group.therapistProfile.userId === therapistUserId
          );
        }

        setSlots(filteredSlots);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
  }, [userRole]);

  const handleRatingChange = (therapistId, rating) => {
    setSelectedRating((prev) => ({ ...prev, [therapistId]: rating }));
  };

  const handleUpdateRating = async (therapistProfile) => {
    try {
      const newRating = selectedRating[therapistProfile.userId];
      await updateTherapistProfilebyUser(
        therapistProfile.id,
        therapistProfile.specialization,
        newRating
      );

      setSlots((prevSlots) =>
        prevSlots.map((group) => {
          if (group.therapistProfile.id === therapistProfile.id) {
            return {
              ...group,
              therapistProfile: {
                ...group.therapistProfile,
                ratings: newRating,
              },
            };
          }
          return group;
        })
      );

      toast.success("Rating updated successfully!"); // Use toast instead of alert
      setSelectedRating({});
    } catch (error) {
      setError(error.message);
      toast.error("Failed to update rating."); // Use toast for errors
    }
  };

  const handleCreateAppointment = async (slot) => {
    try {
      const appointmentData = {
        slotId: slot.id,
        therapistId: slot.therapistProfileId,
        appointmentDate: slot.slot,
        googleMeet: "",
      };
      await createTherapyAppointment(appointmentData);
      toast.success("Appointment created successfully!"); // Use toast for success
    } catch (error) {
      setError(error.message);
      toast.error("Failed to create appointment."); // Use toast for errors
    }
  };

  const handleDeleteAppointment = async (appointmentId) => {
    try {
      await deleteTherapyAppointment(appointmentId);
      toast.success("Appointment deleted successfully!"); // Use toast for success
    } catch (error) {
      setError(error.message);
      toast.error("Failed to delete appointment."); // Use toast for errors
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Available Slots</h1>
      <div className="space-y-4 sm:space-y-2 md:space-y-4">
        {slots.length > 0 ? (
          slots.map((group) => (
            <div
              key={group.therapistProfile.id}
              className="border p-4 rounded-lg shadow-md bg-orange-100 sm:p-2 md:p-4"
            >
              <h2 className="text-xl font-semibold">{group.therapistProfile.userName}</h2>
              <p className="sm:text-sm md:text-base">Specialization: {group.therapistProfile.specialization}</p>
              <div className="flex items-center">
                <span className="mr-2">Ratings:</span>
                <Rating
                  name={`rating-${group.therapistProfile.userId}`}
                  value={group.therapistProfile.ratings}
                  readOnly
                  precision={0.5}
                  className="text-orange-500"
                />
              </div>

              {userRole === "USER" && (
                <div className="mt-2">
                  <h3 className="font-bold">Update Rating:</h3>
                  <div className="flex items-center">
                    <Rating
                      name={`rating-${group.therapistProfile.userId}`}
                      value={selectedRating[group.therapistProfile.userId] || group.therapistProfile.ratings}
                      onChange={(_, value) =>
                        handleRatingChange(group.therapistProfile.userId, value)
                      }
                      precision={0.5}
                      className="text-orange-500 mr-2"
                    />
                    <CustomButton
                      onClick={() => handleUpdateRating(group.therapistProfile)}
                    >
                      Update Rating
                    </CustomButton>
                  </div>
                </div>
              )}

              <h3 className="font-bold mt-4">Slots:</h3>
              <div className="flex flex-wrap gap-2">
                {group.slots.map((slot) => (
                  <div
                    key={slot.id}
                    className="bg-orange-200 flex justify-between items-center p-2 rounded-lg sm:p-1 md:p-2"
                  >
                    <p className="sm:text-sm md:text-base">{new Date(slot.slot).toLocaleString()}</p>
                    {userRole === "USER" && (
                      <CustomButton
                        onClick={() => handleCreateAppointment(slot)}
                        className="sm:text-xs md:text-sm"
                      >
                        Create Appointment
                      </CustomButton>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p>No slots available.</p>
        )}
      </div>
    </div>
  );
};

export default Slots;
