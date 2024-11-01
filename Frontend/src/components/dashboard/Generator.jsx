import React, { useState, useEffect, Suspense, lazy } from "react";
import { ChevronLeft, ChevronRight, Loader } from "lucide-react";

import ExerciseTips from "./TipSections/ExcerciseTips";
import HealthInfo from "./TipSections/HealthInfo";
import ExerciseRecommendations from "./TipSections/ExcerciseRecommendations";


const Generator = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const sections = [
    { id: 1, component: ExerciseTips, title: "Exercise Tips" },
    {
      id: 2,
      component: ExerciseRecommendations,
      title: "Exercise Recommendations",
    },
    { id: 3, component: HealthInfo, title: "Health Info" },
  ];

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : sections.length - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex < sections.length - 1 ? prevIndex + 1 : 0
    );
  };

  const currentSection = sections[currentIndex];
  const SectionComponent = currentSection.component;

  return (
    <div className="min-h-screen bg-orange-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div className="flex items-center justify-between md:justify-end gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>{currentIndex + 1}</span>
              <span>/</span>
              <span>{sections.length}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                className="p-3 rounded-lg bg-white hover:bg-gray-50 transition-colors"
                aria-label="Previous section"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={handleNext}
                className="p-3 rounded-lg bg-white hover:bg-gray-50 transition-colors"
                aria-label="Next section"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex  justify-center h-[400px] md:h-[500px]">
          <Suspense
            fallback={
              <Loader className="w-10 h-10 text-gray-600 animate-spin" />
            }
          >
            <SectionComponent />
          </Suspense>
        </div>

        {/* Section Navigation Dots */}
        <div className="flex justify-center items-center gap-2 mt-6">
          {sections.map((section, index) => (
            <button
              key={section.id}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 
                ${
                  currentIndex === index
                    ? "bg-blue-600 w-4"
                    : "bg-gray-300 hover:bg-gray-400"
                }
              `}
              aria-label={`Go to ${section.title}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Generator;
