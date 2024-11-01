import React, { useState, useEffect, Suspense, lazy } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, Minimize2, X, Loader } from 'lucide-react';

// Lazy load your chart components
const GaugeChart = lazy(() => import('./D3SVGS/GaugeChart'));
const RadialProgress = lazy(() => import('./D3SVGS/RadarProgress'));
const DonutChart = lazy(() => import('./D3SVGS/DonutChart'));
const BarChart = lazy(() => import('./D3SVGS/BarChart'));
const StepsProgressChart = lazy(() => import('./D3SVGS/StepsProgressChart'));
const BulletGraph = lazy(() => import('./D3SVGS/BulletGraph'));
const RadarChart = lazy(() => import('./D3SVGS/RadarChart'));

const MetricsWatcher = () => {
  const [expandedChart, setExpandedChart] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Chart Data with Components and Data
  const chartData = [
    { id: 1, component: GaugeChart, data: {}, title: 'Gauge Metrics' },
    { id: 2, component: BarChart, title: 'Weight Performance' },
    { id: 3, component: StepsProgressChart, title: 'Daily Steps' },
    { id: 4, component: RadialProgress, title: 'Progress' }, // Moved here
    { id: 5, component: BulletGraph, data: { label: 'Body Weight', value: 70, thresholds: { underweight: 50, healthy: 75, overweight: 100 } }, title: 'Body Weight' },
    { id: 6, component: DonutChart, data: { label: 'Health Score', value: 85, max: 100 }, title: 'Health Score' },
    ...(window.innerWidth > 768 ? [{
      id: 7, component: RadarChart, data: {
        label: 'Health Metrics',
        metrics: [
          { label: 'Cardio Health', value: 85 },
          { label: 'Strength', value: 70 },
          { label: 'Flexibility', value: 60 },
          { label: 'Endurance', value: 90 },
          { label: 'Nutrition', value: 75 },
        ],
      },
      title: 'Health Overview'
    }] : []), // Only include RadarChart if the screen width is greater than 768px
  ];

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : chartData.length - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex < chartData.length - 1 ? prevIndex + 1 : 0
    );
  };

  const handleKeyNavigation = (e) => {
    if (e.key === 'ArrowLeft') {
      handlePrev();
    } else if (e.key === 'ArrowRight') {
      handleNext();
    } else if (e.key === 'Escape' && expandedChart) {
      setExpandedChart(null);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyNavigation);
    return () => window.removeEventListener('keydown', handleKeyNavigation);
  }, [expandedChart]);

  const ChartCard = ({ chart, isExpanded }) => {
    const ChartComponent = chart.component;

    return (
      <div 
        className={`relative rounded-xl transition-all duration-300 ease-in-out
          ${isExpanded 
            ? 'fixed inset-0 md:inset-8 z-50 m-4 md:m-0' 
            : 'w-full'
          }
        `}
      >
        <div className="absolute top-4 right-4 flex gap-2 z-10">
          <button
            onClick={() => setExpandedChart(isExpanded ? null : chart.id)}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            aria-label={isExpanded ? "Minimize" : "Maximize"}
          >
            {isExpanded 
              ? <Minimize2 className="w-5 h-5 text-gray-600" />
              : <Maximize2 className="w-5 h-5 text-gray-600" />
            }
          </button>
          {isExpanded && (
            <button
              onClick={() => setExpandedChart(null)}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          )}
        </div>

        <div className="h-full flex flex-col p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">{chart.title}</h3>
          <div className={`flex-1 relative ${isExpanded ? 'h-[calc(100vh-120px)]' : 'h-[400px] md:h-[500px]'}`}>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-full max-w-full max-h-full">
                {/* Use Suspense to handle loading state */}
                <Suspense fallback={<Loader className="w-10 h-10 text-gray-600 animate-spin" />}>
                  <ChartComponent data={chart.data} />
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const currentChart = chartData[currentIndex];

  return (
    <div className="min-h-screen bg-orange-100 p-4 md:p-8">
      {expandedChart && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40" 
          onClick={() => setExpandedChart(null)}
        />
      )}
      
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div className="flex items-center justify-between md:justify-end gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>{currentIndex + 1}</span>
              <span>/</span>
              <span>{chartData.length}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                className="p-3 rounded-lg bg-white hover:bg-gray-50 transition-colors"
                aria-label="Previous chart"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={handleNext}
                className="p-3 rounded-lg bg-white hover:bg-gray-50 transition-colors"
                aria-label="Next chart"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        <ChartCard
          chart={currentChart}
          isExpanded={expandedChart === currentChart.id}
        />

        {/* Chart Navigation Dots */}
        <div className="flex justify-center items-center gap-2 mt-6">
          {chartData.map((chart, index) => (
            <button
              key={chart.id}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 
                ${currentIndex === index 
                  ? 'bg-blue-600 w-4' 
                  : 'bg-gray-300 hover:bg-gray-400'
                }`
              }
              aria-label={`Go to ${chart.title}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MetricsWatcher;
