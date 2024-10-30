import React, { useState, useEffect } from "react";
import {
  createTherapistProfile,
  updateTherapistProfile,
  getTherapistProfile,
} from "../../services/therapistprofileServices";
import { toast } from "react-toastify";
import { Loader2, Save, Edit2, X } from "lucide-react";
import { TextField, Button } from "@mui/material";
import { FaUserMd, FaStar } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

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

const TherapistProfile = () => {
  const [therapistForm, setTherapistForm] = useState({
    specialization: "",
    ratings: 0,
  });
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [isNewProfile, setIsNewProfile] = useState(false);

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
      // If fetch fails, assume it's a new profile
      setTherapistForm({
        specialization: "",
        ratings: 0,
      });
      setIsNewProfile(true);
      // Don't show error toast since this might be a new user
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
      fetchTherapistProfile(); // Only reset if it's an existing profile
    } else {
      setTherapistForm({
        specialization: "",
        ratings: 0,
      });
    }
    setIsEditing(false);
  };

  useEffect(() => {
    fetchTherapistProfile();
  }, []);

  return (
    <div className="bg-orange-100 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-6"
        >
          <h2 className="text-3xl font-bold text-amber-700">Therapist Profile</h2>
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
                  icon={<FaUserMd className="text-amber-500" />}
                  isEditing={isEditing}
                />
                <EditableField
                  label="Ratings"
                  value={therapistForm.ratings}
                  name="ratings"
                  icon={<FaStar className="text-amber-500" />}
                  isEditing={isEditing}
                  readOnly={true}
                />

                <AnimatePresence>
                  {isEditing && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex gap-4 mt-6"
                    >
                      <Button
                        onClick={handleTherapistSubmit}
                        variant="contained"
                        className="bg-amber-500 hover:bg-amber-600 text-white"
                        startIcon={<Save size={20} />}
                      >
                        {isNewProfile ? "Create Profile" : "Save Changes"}
                      </Button>
                      <Button
                        onClick={handleCancel}
                        variant="outlined"
                        className="border-amber-500 text-amber-500 hover:border-amber-600"
                        startIcon={<X size={20} />}
                      >
                        Cancel
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TherapistProfile;
