import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Info } from 'lucide-react';

const BulletGraph = ({ 
  data = { 
    label: 'Body Weight', 
    value: 70, 
    thresholds: { 
      underweight: 50, 
      healthy: 75, 
      overweight: 100 
    } 
  } 
}) => {
  const containerRef = useRef(null);
  const svgRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 400, height: 100 });

  // Handle resize
  useEffect(() => {
    const updateDimensions = () => {
      if (!containerRef.current) return;
      
      const containerWidth = containerRef.current.getBoundingClientRect().width;
      setDimensions({
        width: Math.max(300, Math.min(containerWidth, 400)), // Min 300px, max 400px
        height: 100
      });
    };

    // Initial size
    updateDimensions();

    // Add resize listener
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Calculate responsive margins
    const margin = {
      top: dimensions.height * 0.3,
      right: dimensions.width * 0.075,
      bottom: dimensions.height * 0.4,
      left: dimensions.width * 0.075
    };

    const width = dimensions.width - margin.left - margin.right;
    const height = dimensions.height - margin.top - margin.bottom;

    // Update SVG dimensions
    svg
      .attr('width', dimensions.width)
      .attr('height', dimensions.height)
      .attr('viewBox', `0 0 ${dimensions.width} ${dimensions.height}`);

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const thresholds = [
      data.thresholds.underweight,
      data.thresholds.healthy,
      data.thresholds.overweight
    ];

    const colorScale = d3.scaleThreshold()
      .domain(thresholds)
      .range(['#3B82F6', '#10B981', '#EF4444']);

    // Background track
    g.append('rect')
      .attr('x', 0)
      .attr('y', height / 4)
      .attr('width', width)
      .attr('height', height / 2)
      .attr('rx', 4)
      .attr('fill', '#f3f4f6')
      .attr('stroke', '#e5e7eb')
      .attr('stroke-width', 1);

    // Value bar with animation
    g.append('rect')
      .attr('x', 0)
      .attr('y', height / 4)
      .attr('width', 0)
      .attr('height', height / 2)
      .attr('rx', 4)
      .attr('fill', colorScale(data.value))
      .attr('opacity', 0.9)
      .transition()
      .duration(1000)
      .ease(d3.easeElastic)
      .attr('width', (data.value / 100) * width);

    // Responsive font sizes
    const fontSize = Math.max(10, Math.min(12, width / 30));
    const valueFontSize = Math.max(12, Math.min(14, width / 25));

    // Threshold markers
    thresholds.forEach((threshold) => {
      g.append('line')
        .attr('x1', (threshold / 100) * width)
        .attr('x2', (threshold / 100) * width)
        .attr('y1', height / 4 - 5)
        .attr('y2', (height * 3) / 4 + 5)
        .attr('stroke', '#6b7280')
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', '4,2');
    });

    // Threshold labels with responsive positioning
    const labels = ['Underweight', 'Healthy', 'Overweight'];
    thresholds.forEach((threshold, i) => {
      const label = g.append('text')
        .attr('x', (threshold / 100) * width)
        .attr('y', height + (fontSize * 1.2))
        .attr('text-anchor', 'middle')
        .attr('font-size', `${fontSize}px`)
        .attr('fill', '#4b5563')
        .text(labels[i]);

      // Handle label overlap
      if (i > 0) {
        const prev = g.selectAll('text').nodes()[i - 1];
        const current = label.node();
        if (prev && current) {
          const prevBox = prev.getBBox();
          const currentBox = current.getBBox();
          const overlap = (prevBox.x + prevBox.width) - currentBox.x;
          if (overlap > 0) {
            // Adjust label position or show abbreviated text
            if (width < 350) {
              label.text(labels[i].substring(0, 3) + '...');
            }
          }
        }
      }
    });

    // Current value indicator with responsive positioning
    g.append('text')
      .attr('x', (data.value / 100) * width)
      .attr('y', height / 4 - (valueFontSize * 0.8))
      .attr('text-anchor', 'middle')
      .attr('font-size', `${valueFontSize}px`)
      .attr('font-weight', 'bold')
      .attr('fill', '#111827')
      .text(`${data.value}%`);

  }, [data, dimensions]);

  return (
    <div ref={containerRef} className="w-full max-w-2xl mx-auto p-4 sm:p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">{data.label}</h2>
        <div className="flex items-center">
          <Info 
            className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 cursor-help" 
            title="Body weight status indicator"
          />
        </div>
      </div>
      
      <div className="w-full overflow-x-hidden">
        <svg
          ref={svgRef}
          className="w-full h-auto"
          preserveAspectRatio="xMidYMid meet"
        />
      </div>
      
      <div className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-600">
        Current status: {
          data.value <= data.thresholds.underweight ? 'Underweight' :
          data.value <= data.thresholds.healthy ? 'Healthy' : 'Overweight'
        }
      </div>
    </div>
  );
};

export default BulletGraph;