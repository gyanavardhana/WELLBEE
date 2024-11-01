import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Footprints, Trophy, Target } from 'lucide-react';

const StepsProgressChart = ({ 
  data = { 
    label: 'Daily Steps', 
    value: 7500, 
    min: 0, 
    max: 10000 
  } 
}) => {
  const svgRef = useRef(null);
  const tooltipRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = 120; // Increased width to accommodate labels
    const height = 300;
    const progressWidth = 40;
    const scaleY = d3.scaleLinear().domain([data.min, data.max]).range([height - 30, 30]);
    const valueHeight = Math.max(data.min, Math.min(data.value, data.max));
    
    // Define gradients
    const defs = svg.append('defs');

    // Progress gradient
    const progressGradient = defs.append('linearGradient')
      .attr('id', 'progressGradient')
      .attr('gradientTransform', 'rotate(90)');
    progressGradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#10B981')
      .attr('stop-opacity', 0.8);
    progressGradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#059669');

    // Background gradient for value display
    const backgroundGradient = defs.append('linearGradient')
      .attr('id', 'backgroundGradient')
      .attr('gradientTransform', 'rotate(90)');
    backgroundGradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#ffffff')
      .attr('stop-opacity', 0.9);
    backgroundGradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#ffffff')
      .attr('stop-opacity', 0.9);

    // Add glowing effect
    const filter = defs.append('filter')
      .attr('id', 'glow');
    filter.append('feGaussianBlur')
      .attr('stdDeviation', '2')
      .attr('result', 'coloredBlur');
    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    const progressBar = svg.append('g')
      .attr('transform', `translate(${width / 2 + 30}, 0)`);  // Moved 20px to the right

    // Background track
    progressBar.append('rect')
      .attr('x', -progressWidth / 2)
      .attr('y', 20)
      .attr('width', progressWidth)
      .attr('height', height - 40)
      .attr('rx', progressWidth / 2)
      .attr('fill', '#e2e8f0')
      .attr('opacity', 0.7);

    // Step markers with enhanced visibility
    const markers = [0, 2500, 5000, 7500, 10000];
    markers.forEach(marker => {
      // Marker lines
      progressBar.append('line')
        .attr('x1', -progressWidth)
        .attr('x2', progressWidth / 2)
        .attr('y1', scaleY(marker))
        .attr('y2', scaleY(marker))
        .attr('stroke', '#94a3b8')
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '2,2');

      // Background for marker labels with border
      progressBar.append('rect')
        .attr('x', -progressWidth * 1.8)
        .attr('y', scaleY(marker) - 10)
        .attr('width', progressWidth * 1.2)
        .attr('height', 20)
        .attr('rx', 4)
        .attr('fill', 'white')
        .attr('stroke', '#cbd5e1')  // Light border
        .attr('stroke-width', '0.5')
        .attr('opacity', 0.9);

      // Step count labels with enhanced style
      progressBar.append('text')
        .attr('x', -progressWidth * 1.2)
        .attr('y', scaleY(marker))
        .attr('text-anchor', 'end')
        .attr('alignment-baseline', 'middle')
        .attr('fill', '#1e293b')  // High-contrast color
        .attr('font-size', '13px')  // Increased font size
        .attr('font-weight', 'bold')
        .text(marker.toLocaleString());
    });

    // Progress fill
    const progressHeight = height - 40 - (scaleY(valueHeight) - 20);
    progressBar.append('rect')
      .attr('x', -(progressWidth / 2 - 2))
      .attr('y', height - 20)
      .attr('width', progressWidth - 4)
      .attr('height', 0)
      .attr('rx', (progressWidth - 4) / 2)
      .attr('fill', 'url(#progressGradient)')
      .style('filter', 'url(#glow)')
      .transition()
      .duration(2000)
      .ease(d3.easeCubicOut)
      .attr('y', height - 20 - progressHeight)
      .attr('height', progressHeight);

    // Animated footstep markers
    const numFootsteps = 5;
    const footstepSpacing = progressHeight / numFootsteps;
    
    for (let i = 0; i < numFootsteps; i++) {
      progressBar.append('circle')
        .attr('cx', 0)
        .attr('cy', height - 20 - (i * footstepSpacing))
        .attr('r', 3)
        .attr('fill', '#fff')
        .attr('opacity', 0)
        .transition()
        .delay(1500 + (i * 200))
        .duration(500)
        .attr('opacity', 0.8);
    }

    // Enhanced value display with background
    const percentage = Math.round((valueHeight / data.max) * 100);
    
    // Background for value display


    // Percentage text
    progressBar.append('text')
      .attr('x', 0)
      .attr('y', scaleY(valueHeight) - 5)  // Moved down to avoid overlap with the bar
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .attr('fill', '#059669')
      .text(`${percentage}%`);

  }, [data]);

  const getProgressClass = (value) => {
    const percentage = (value / data.max) * 100;
    if (percentage < 33) return 'bg-red-50 text-red-600';
    if (percentage < 66) return 'bg-amber-50 text-amber-600';
    return 'bg-emerald-50 text-emerald-600';
  };

  const getProgressIcon = (value) => {
    const percentage = (value / data.max) * 100;
    if (percentage < 33) return <Target className="text-red-500 w-6 h-6" />;
    if (percentage < 66) return <Footprints className="text-amber-500 w-6 h-6" />;
    return <Trophy className="text-emerald-500 w-6 h-6" />;
  };

  return (
    <div 
      className={`p-6 rounded-2xl transition-all duration-300 ${getProgressClass(data.value)} ${
        isHovered ? 'shadow-lg scale-105' : 'shadow'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-xl font-bold">{data.label}</span>
          {getProgressIcon(data.value)}
        </div>
      </div>
      
      <div className="flex justify-center">
        <svg 
          ref={svgRef} 
          viewBox="0 0 120 300" 
          className="w-32 h-80 z-50  transition-transform duration-300"
        />
      </div>
    </div>
  );
};

export default StepsProgressChart;
