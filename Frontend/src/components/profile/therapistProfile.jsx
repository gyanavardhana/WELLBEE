import React, { useState, useEffect } from "react";
import {
  createTherapistProfile,
  updateTherapistProfile,
  getTherapistProfile,
} from "../../services/therapistprofileServices";
import {
  getAvailableSlots,
  createAvailableSlot,
  deleteAvailableSlot,
} from "../../services/availableslotService";
import { toast } from "react-toastify";
import { Loader2, Save, Edit2, X, Trash } from "lucide-react";
import { TextField, Button } from "@mui/material";
import { FaUserMd, FaStar } from "react-icons/fa";
import { motion } from "framer-motion";

const EditableField = ({
  label,
  value,
  name,
  onChange,
  icon,
  isEditing,
  readOnly = false,
}) => {
  return (
    <div className="mb-4">
      <label className="mb-1 text-amber-700 flex items-center">
        {icon}
        <span className="ml-2">{label}:</span>
      </label>
      {isEditing && !readOnly ? (
        <TextField
          type="text"
          name={name}
          value={value}
          onChange={onChange}
          className="w-full"
          variant="outlined"
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#d97706",
              },
              "&:hover fieldset": {
                borderColor: "#b45309",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#92400e",
              },
            },
          }}
        />
      ) : (
        <div className="p-2 border rounded-md border-amber-500 bg-amber-50">
          {value === null || value === undefined ? "Not specified" : value}
        </div>
      )}
    </div>
  );
};

// AppointmentSlot component
const AppointmentSlot = ({ slot, onDelete }) => {
  const formattedDate = new Date(slot.slot).toLocaleString();

  return (
    <div className="flex justify-between items-center bg-amber-50 p-4 mb-2 rounded-md sm:flex-row flex-col">
      <span className="text-amber-800 font-medium">{formattedDate}</span>
      <Button
        onClick={() => onDelete(slot.id)}
        variant="outlined"
        className="border-red-500 text-red-500 hover:border-red-600 mt-2 sm:mt-0"
        startIcon={<Trash size={20} />}
      >
        Delete
      </Button>
    </div>
  );
};

// AvailableSlotManager component
const AvailableSlotManager = ({ availableSlots, onCreateSlot, onDeleteSlot }) => {
  const [slotDate, setSlotDate] = useState("");
  const [slotTime, setSlotTime] = useState("");

  const handleCreateSlot = () => {
    if (!slotDate || !slotTime) return;
    const slotData = { slot: new Date(`${slotDate}T${slotTime}`) };
    onCreateSlot(slotData);
    setSlotDate("");
    setSlotTime("");
  };

  return (
    <div className="mt-8 bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-6 sm:p-8">
        <h3 className="text-2xl font-semibold text-amber-700">
          Manage Available Slots
        </h3>
        <div className="mt-4 flex flex-col sm:flex-row">
          <TextField
            type="date"
            value={slotDate}
            onChange={(e) => setSlotDate(e.target.value)}
            variant="outlined"
            className="mr-2 mb-2 sm:mb-0"
          />
          <TextField
            type="time"
            value={slotTime}
            onChange={(e) => setSlotTime(e.target.value)}
            variant="outlined"
            className="mr-2 mb-2 sm:mb-0"
          />
          <Button
            onClick={handleCreateSlot}
            variant="contained"
            className="bg-amber-500 hover:bg-amber-600 text-white"
          >
            Add Slot
          </Button>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {availableSlots.length > 0 ? (
            availableSlots.map((slot) => (
              <AppointmentSlot
                key={slot.id}
                slot={slot}
                onDelete={onDeleteSlot}
              />
            ))
          ) : (
            <p>No available slots found.</p>
          )}
        </div>
      </div>
    </div>
  );
};


const TherapistProfile = () => {
  const [therapistForm, setTherapistForm] = useState({
    specialization: "",
    ratings: 0,
  });
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [isNewProfile, setIsNewProfile] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);

  const handleTherapistSubmit = async () => {
    setLoading(true);
    try {
      if (isNewProfile) {
        await createTherapistProfile(therapistForm.specialization);
        toast.success("Therapist profile created successfully!");
      } else {
        await updateTherapistProfile(therapistForm.specialization);
        toast.success("Therapist profile updated successfully!");
      }
      setIsEditing(false);
    } catch (error) {
      toast.error(
        isNewProfile
          ? "Error creating therapist profile"
          : "Error updating therapist profile"
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchTherapistProfile = async () => {
    setIsFetching(true);
    try {
      const response = await getTherapistProfile();
      if (response) {
        setTherapistForm({
          specialization: response.therapistProfile.specialization || "",
          ratings: response.therapistProfile.ratings || 0,
        });
        setIsNewProfile(false);
      }
    } catch (error) {
      setTherapistForm({
        specialization: "",
        ratings: 0,
      });
      setIsNewProfile(true);
    } finally {
      setIsFetching(false);
    }
  };

  const fetchAvailableSlots = async () => {
    setIsFetching(true);
    try {
      const response = await getAvailableSlots();
      setAvailableSlots(response.availableSlots || []);
    } catch (error) {
      console.error("Error fetching available slots:", error);
    } finally {
      setIsFetching(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTherapistForm({ ...therapistForm, [name]: value });
  };

  const handleCancel = () => {
    if (!isNewProfile) {
      fetchTherapistProfile();
    } else {
      setTherapistForm({
        specialization: "",
        ratings: 0,
      });
    }
    setIsEditing(false);
  };

  const handleCreateSlot = async (slotData) => {
    try {
      await createAvailableSlot(slotData);
      fetchAvailableSlots(); // Refresh the slots list
      toast.success("Available slot created successfully!");
    } catch (error) {
      toast.error("Error creating available slot");
    }
  };

  const handleDeleteSlot = async (slotId) => {
    try {
      await deleteAvailableSlot(slotId);
      // Instead of directly fetching, you could also filter out the deleted slot for better performance
      setAvailableSlots((prevSlots) => prevSlots.filter(slot => slot.id !== slotId));
      toast.success("Available slot deleted successfully!");
    } catch (error) {
      toast.error("Error deleting available slot");
    }
  };
  

  useEffect(() => {
    fetchTherapistProfile();
    fetchAvailableSlots(); // Fetch slots on initial load
  }, []);

  return (
    <div className="bg-orange-100 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-6"
        >
          <h2 className="text-3xl font-bold text-amber-700">
            Therapist Profile
          </h2>
          {!isEditing && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg"
            >
              <Edit2 size={20} />
              {isNewProfile ? "Create Profile" : "Edit Profile"}
            </motion.button>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          <div className="p-6">
            {loading || isFetching ? (
              <div className="flex justify-center items-center">
                <Loader2 className="animate-spin" />
              </div>
            ) : (
              <div className="space-y-4">
                <EditableField
                  label="Specialization"
                  value={therapistForm.specialization}
                  name="specialization"
                  onChange={handleInputChange}
                  icon={<FaUserMd size={20} />}
                  isEditing={isEditing}
                />
                <EditableField
                  label="Ratings"
                  value={therapistForm.ratings}
                  name="ratings"
                  onChange={handleInputChange}
                  icon={<FaStar size={20} />}
                  isEditing={isEditing}
                />
                {isEditing && (
                  <div className="flex justify-end">
                    <Button
                      onClick={handleTherapistSubmit}
                      variant="contained"
                      className="bg-amber-500 hover:bg-amber-600 text-white"
                      startIcon={<Save size={20} />}
                    >
                      Save
                    </Button>
                    <Button
                      onClick={handleCancel}
                      variant="outlined"
                      className="border-red-500 text-red-500 hover:border-red-600 ml-2"
                      startIcon={<X size={20} />}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>

        <AvailableSlotManager
          availableSlots={availableSlots}
          onCreateSlot={handleCreateSlot}
          onDeleteSlot={handleDeleteSlot}
        />
      </div>
    </div>
  );
};

export default TherapistProfile;
