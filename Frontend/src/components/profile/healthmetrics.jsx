import React, { useState, useEffect } from "react";
import {
  getHealthMetrics,
  createHealthMetric,
} from "../../services/healthmetricServices";
import { toast } from "react-toastify";
import { Loader2, Save, Edit2, X } from "lucide-react";
import { TextField, Button, IconButton } from "@mui/material";
import { FaHeartbeat, FaWater, FaBed, FaWalking } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const EditableField = ({ label, value, name, onChange, icon, isEditing }) => {
  return (
    <div className="mb-4">
      <label className="mb-1 text-amber-700 flex items-center">
        {icon}
        <span className="ml-2">{label}:</span>
      </label>
      {isEditing ? (
        <TextField
          type="number"
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
          {value || "0"}
        </div>
      )}
    </div>
  );
};

const HealthMetrics = () => {
  const [healthMetricForm, setHealthMetricForm] = useState({
    dailySteps: 0,
    heartRate: "",
    sleepHours: "",
    waterIntake: "",
  });
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const handleHealthMetricSubmit = async () => {
    setLoading(true);
    try {
      const metricData = {
        ...healthMetricForm,
        dailySteps: parseInt(healthMetricForm.dailySteps, 10),
        heartRate: healthMetricForm.heartRate
          ? parseInt(healthMetricForm.heartRate, 10)
          : null,
        sleepHours: healthMetricForm.sleepHours
          ? parseFloat(healthMetricForm.sleepHours)
          : null,
        waterIntake: healthMetricForm.waterIntake
          ? parseFloat(healthMetricForm.waterIntake)
          : null,
      };

      await createHealthMetric(metricData);
      toast.success("Health metrics updated successfully!");
      setIsEditing(false);
    } catch {
      toast.error("Error updating health metrics");
    } finally {
      setLoading(false);
    }
  };

  const fetchHealthMetrics = async () => {
    setIsFetching(true);
    try {
      const metrics = await getHealthMetrics();
      if (metrics.healthMetrics) {
        // Get the most recent metric
        const latestMetric = metrics.healthMetrics[0];
        setHealthMetricForm({
          dailySteps: latestMetric.dailySteps || 0,
          heartRate: latestMetric.heartRate || "",
          sleepHours: latestMetric.sleepHours || "",
          waterIntake: latestMetric.waterIntake || "",
        });
      }
    } catch {
      toast.error("Error fetching health metrics");
    } finally {
      setIsFetching(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setHealthMetricForm({ ...healthMetricForm, [name]: value });
  };

  const handleCancel = () => {
    fetchHealthMetrics(); // Reset to last saved values
    setIsEditing(false);
  };

  useEffect(() => {
    fetchHealthMetrics();
  }, []);

  return (
    <div className="bg-orange-100 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-6"
        >
          <h2 className="text-3xl font-bold text-amber-700">Health Metrics</h2>
          {!isEditing && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg"
            >
              <Edit2 size={20} />
              Edit Metrics
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
                  label="Daily Steps"
                  value={healthMetricForm.dailySteps}
                  name="dailySteps"
                  onChange={handleInputChange}
                  icon={<FaWalking className="text-amber-500" />}
                  isEditing={isEditing}
                />
                <EditableField
                  label="Heart Rate"
                  value={healthMetricForm.heartRate}
                  name="heartRate"
                  onChange={handleInputChange}
                  icon={<FaHeartbeat className="text-amber-500" />}
                  isEditing={isEditing}
                />
                <EditableField
                  label="Sleep Hours"
                  value={healthMetricForm.sleepHours}
                  name="sleepHours"
                  onChange={handleInputChange}
                  icon={<FaBed className="text-amber-500" />}
                  isEditing={isEditing}
                />
                <EditableField
                  label="Water Intake (liters)"
                  value={healthMetricForm.waterIntake}
                  name="waterIntake"
                  onChange={handleInputChange}
                  icon={<FaWater className="text-amber-500" />}
                  isEditing={isEditing}
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
                        onClick={handleHealthMetricSubmit}
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

export default HealthMetrics;
