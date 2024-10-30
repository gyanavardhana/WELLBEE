import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import Slots from "./Slots";
import Appointments from "./Appointments";

const Section = ({ title, isOpen, toggle, children }) => (
  <div className="bg-white shadow-md rounded-lg overflow-hidden mb-4">
    <button
      className="w-full px-6 py-4 flex justify-between items-center bg-orange-50 hover:bg-orange-200 transition-colors duration-200"
      onClick={toggle}
    >
      <h3 className="text-xl font-bold text-orange-800">{title}</h3>
      {isOpen ? <ChevronUp className="text-orange-500" /> : <ChevronDown className="text-orange-500" />}
    </button>
    {isOpen && <div className="px-6 py-4">{children}</div>}
  </div>
);

const TherapyAppointment = () => {
  const [openSections, setOpenSections] = useState({ slots: false, appointments: false });

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div className="p-8min-h-screen flex flex-col items-center">
      <div className="w-full max-w-3xl">
        {/* Slots Section */}
        <Section
          title="Slots"
          isOpen={openSections.slots}
          toggle={() => toggleSection("slots")}
        >
          <Slots />
        </Section>

        {/* Appointments Section */}
        <Section
          title="Appointments"
          isOpen={openSections.appointments}
          toggle={() => toggleSection("appointments")}
        >
          <Appointments />
        </Section>
      </div>
    </div>
  );
};

export default TherapyAppointment;
