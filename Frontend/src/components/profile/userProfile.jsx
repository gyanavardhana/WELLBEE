import React, { useState, useEffect } from "react";
import { updateUserProfile, getUserProfile } from "../../services/userServices";
import { TextField, Button } from "@mui/material";
import { FaUser, FaEnvelope, FaRulerVertical, FaWeight, FaUserTag } from "react-icons/fa";
import { Loader2, Save, Edit2, X, Upload } from "lucide-react";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

const ImageUploadField = ({ currentImage, onImageUpdate, isEditing }) => {
  const [previewUrl, setPreviewUrl] = useState(currentImage);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show preview immediately
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);

    // Upload image
    setIsUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch(`${import.meta.env.VITE_APP_URL}users/upload`,{
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      onImageUpdate(result.url);
      toast.success("Image uploaded successfully!");
    } catch (error) {
      toast.error("Error uploading image");
      setPreviewUrl(currentImage); // Revert preview on error
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="mb-6">
      <label className="mb-1 text-amber-700 flex items-center">
        <FaUser className="text-amber-500" />
        <span className="ml-2">Profile Picture:</span>
      </label>
      
      <div className="relative">
        <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-amber-500 bg-amber-50">
          {previewUrl ? (
            <img 
              src={previewUrl} 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-amber-100">
              <FaUser size={40} className="text-amber-500" />
            </div>
          )}
        </div>
        
        {isEditing && (
          <div className="mt-2">
            <label className="cursor-pointer inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg">
              <Upload size={20} />
              {isUploading ? "Uploading..." : "Change Picture"}
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
                disabled={isUploading}
              />
            </label>
          </div>
        )}
      </div>
    </div>
  );
};

const EditableField = ({ label, value, name, onChange, icon, isEditing }) => {
  return (
    <div className="mb-4">
      <label className="mb-1 text-amber-700 flex items-center">
        {icon}
        <span className="ml-2">{label}:</span>
      </label>
      {isEditing ? (
        <TextField
          type="text"
          name={name}
          value={value}
          onChange={onChange}
          className="w-full"
          variant="outlined"
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "#d97706" },
              "&:hover fieldset": { borderColor: "#b45309" },
              "&.Mui-focused fieldset": { borderColor: "#92400e" },
            },
          }}
        />
      ) : (
        <div className="p-2 border rounded-md border-amber-500 bg-amber-50">
          {value || "Not provided"}
        </div>
      )}
    </div>
  );
};

const DisplayField = ({ label, value, icon }) => (
  <div className="mb-4">
    <p className="mb-1 text-amber-700 flex items-center">
      {icon}
      <span className="ml-2">{label}:</span>
    </p>
    <div className="p-2 border rounded-md border-amber-500 bg-amber-50">
      {value || "Not provided"}
    </div>
  </div>
);

const UserProfile = () => {
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    profilePic: "",
    height: "",
    weight: "",
    role: "",
    createdAt: "",
    updatedAt: "",
  });
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const fetchProfile = async () => {
    setIsFetching(true);
    try {
      const userData = await getUserProfile();
      setProfileForm(userData);
    } catch {
      toast.error("Error fetching user profile");
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileForm({ ...profileForm, [name]: value });
  };

  const handleImageUpdate = (url) => {
    setProfileForm({ ...profileForm, profilePic: url });
  };

  const handleProfileSubmit = async () => {
    setLoading(true);
    const updatedProfile = {
      ...profileForm,
      height: parseFloat(profileForm.height),
      weight: parseFloat(profileForm.weight),
    };
    try {
      await updateUserProfile(updatedProfile);
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch {
      toast.error("Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    fetchProfile();
    setIsEditing(false);
  };

  return (
    <div className="bg-orange-100 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-6"
        >
          <h2 className="text-3xl font-bold text-amber-700">User Profile</h2>
          {!isEditing && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg"
            >
              <Edit2 size={20} />
              Edit Profile
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
              <div className="flex justify-center items-center py-8">
                <Loader2 className="animate-spin text-amber-500" size={32} />
              </div>
            ) : (
              <div className="space-y-4">
                <ImageUploadField 
                  currentImage={profileForm.profilePic}
                  onImageUpdate={handleImageUpdate}
                  isEditing={isEditing}
                />
                
                <EditableField
                  label="Name"
                  value={profileForm.name}
                  name="name"
                  onChange={handleInputChange}
                  icon={<FaUser className="text-amber-500" />}
                  isEditing={isEditing}
                />
                <EditableField
                  label="Height (cm)"
                  value={profileForm.height}
                  name="height"
                  onChange={handleInputChange}
                  icon={<FaRulerVertical className="text-amber-500" />}
                  isEditing={isEditing}
                />
                <EditableField
                  label="Weight (kg)"
                  value={profileForm.weight}
                  name="weight"
                  onChange={handleInputChange}
                  icon={<FaWeight className="text-amber-500" />}
                  isEditing={isEditing}
                />

                {/* Read-only Fields */}
                <DisplayField
                  label="Email"
                  value={profileForm.email}
                  icon={<FaEnvelope className="text-amber-500" />}
                />
                <DisplayField
                  label="Role"
                  value={profileForm.role}
                  icon={<FaUserTag className="text-amber-500" />}
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
                        onClick={handleProfileSubmit}
                        variant="contained"
                        className="bg-amber-500 hover:bg-amber-600 text-white"
                        startIcon={<Save size={20} />}
                      >
                        Save Changes
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

export default UserProfile;