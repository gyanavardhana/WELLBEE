import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const RadarChart = ({ data }) => {
  const svgRef = useRef(null);
  const [hoveredMetric, setHoveredMetric] = useState(null);

  useEffect(() => {
    // Add nutrition to the sample data if not provided
    if (!data || !data.metrics) return;
    
    // Add nutrition if it doesn't exist in the metrics
    if (!data.metrics.find(m => m.label === 'Nutrition')) {
      data.metrics.push({ label: 'Nutrition', value: 75 }); // Default value of 75%
    }

    // Adjusted margins to accommodate labels
    const margin = { top: 70, right: 70, bottom: 70, left: 70 };
    const width = 500 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;
    const radius = Math.min(width, height) / 2;

    // Clear the SVG
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Setup gradient
    const gradient = svg.append("defs")
      .append("linearGradient")
      .attr("id", "radar-gradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "100%")
      .attr("y2", "100%");

    gradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#4F46E5")
      .attr("stop-opacity", 0.8);

    gradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#7C3AED")
      .attr("stop-opacity", 0.8);

    // Create glow filter
    const filter = svg.append("defs")
      .append("filter")
      .attr("id", "glow");

    filter.append("feGaussianBlur")
      .attr("stdDeviation", "3")
      .attr("result", "coloredBlur");

    const feMerge = filter.append("feMerge");
    feMerge.append("feMergeNode").attr("in", "coloredBlur");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");

    // Create chart group with adjusted position
    const chartGroup = svg.append('g')
      .attr('transform', `translate(${width / 2 + margin.left}, ${height / 2 + margin.top})`);

    const angles = d3.scalePoint()
      .domain(data.metrics.map(d => d.label))
      .range([0, 2 * Math.PI]);

    const rScale = d3.scaleLinear()
      .domain([0, 100])
      .range([0, radius]);

    // Draw circular grid lines with improved labels
    const gridLevels = [20, 40, 60, 80, 100];
    gridLevels.forEach(level => {
      chartGroup.append('circle')
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('r', rScale(level))
        .attr('fill', 'none')
        .attr('stroke', '#e2e8f0')
        .attr('stroke-dasharray', '4,4')
        .style('opacity', 0.5);

      // Improved grid level labels
      chartGroup.append('text')
        .attr('x', 5)
        .attr('y', -rScale(level))
        .attr('fill', '#64748b')
        .attr('font-size', '10px')
        .attr('dominant-baseline', 'middle')
        .style('font-weight', '500')
        .text(`${level}%`);
    });

    // Draw axes with improved visibility
    const axisGroup = chartGroup.selectAll('.axis')
      .data(data.metrics)
      .enter()
      .append('g')
      .attr('class', 'axis');

    axisGroup.append('line')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', d => Math.cos(angles(d.label) - Math.PI / 2) * radius)
      .attr('y2', d => Math.sin(angles(d.label) - Math.PI / 2) * radius)
      .attr('stroke', '#e2e8f0')
      .attr('stroke-width', 1.5);

    // Create the radar path
    const radarLine = d3.lineRadial()
      .radius(d => rScale(d.value))
      .angle(d => angles(d.label) - Math.PI / 2)
      .curve(d3.curveLinearClosed);

    // Add radar area with animation
    chartGroup.append('path')
      .datum(data.metrics)
      .attr('d', radarLine)
      .attr('fill', 'url(#radar-gradient)')
      .attr('stroke', '#4F46E5')
      .attr('stroke-width', 2)
      .style('filter', 'url(#glow)')
      .style('opacity', 0)
      .transition()
      .duration(1000)
      .style('opacity', 0.7);

    // Add points and labels with improved positioning
    const points = chartGroup.selectAll('.point')
      .data(data.metrics)
      .enter()
      .append('g')
      .attr('class', 'point')
      .style('cursor', 'pointer')
      .on('mouseenter', (event, d) => {
        setHoveredMetric(d);
        d3.select(event.currentTarget)
          .select('circle')
          .transition()
          .duration(200)
          .attr('r', 8)
          .style('filter', 'url(#glow)');
      })
      .on('mouseleave', (event, d) => {
        setHoveredMetric(null);
        d3.select(event.currentTarget)
          .select('circle')
          .transition()
          .duration(200)
          .attr('r', 6)
          .style('filter', 'none');
      });

    // Add points with improved visibility
    points.append('circle')
      .attr('cx', d => Math.cos(angles(d.label) - Math.PI / 2) * rScale(d.value))
      .attr('cy', d => Math.sin(angles(d.label) - Math.PI / 2) * rScale(d.value))
      .attr('r', 6)
      .attr('fill', '#4F46E5')
      .attr('stroke', '#fff')
      .attr('stroke-width', 2);

    // Improved label positioning and visibility
    points.each(function(d) {
      const angle = angles(d.label) - Math.PI / 2;
      const labelRadius = radius + 30;
      const x = Math.cos(angle) * labelRadius;
      const y = Math.sin(angle) * labelRadius;
      
      const label = d3.select(this).append('g')
        .attr('transform', `translate(${x}, ${y})`);
      
      const text = label.append('text')
        .attr('text-anchor', angle > Math.PI / 2 ? 'end' : 'start')
        .attr('dominant-baseline', 'middle')
        .attr('fill', '#1e293b')
        .attr('font-size', '8px')
        .attr('font-weight', '600')
        .text(d.label);
      
      const bbox = text.node().getBBox();
      
      label.insert('rect', 'text')
        .attr('x', angle > Math.PI / 2 ? bbox.x - 4 : bbox.x - 4)
        .attr('y', bbox.y - 2)
        .attr('width', bbox.width + 8)
        .attr('height', bbox.height + 4)
        .attr('fill', 'rgba(255, 255, 255, 0.9)')
        .attr('rx', 2);

      label.append('text')
        .attr('text-anchor', angle > Math.PI / 2 ? 'end' : 'start')
        .attr('dominant-baseline', 'middle')
        .attr('y', 14)
        .attr('fill', '#4F46E5')
        .attr('font-size', '11px')
        .attr('font-weight', '500')
        .text(`${d.value}%`);
    });

  }, [data]);

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-xl">
      <div className="relative">
        <svg 
          ref={svgRef} 
          width="500" 
          height="500" 
          className="transform transition-transform  hover:scale-105 duration-300"
          style={{ maxWidth: '100%', height: 'auto' }}
        />
        {hoveredMetric && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white p-3 rounded-lg shadow-lg border border-indigo-100 z-10">
            <p className="font-semibold text-indigo-600">{hoveredMetric.label}</p>
            <p className="text-gray-600">{hoveredMetric.value}%</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RadarChart;