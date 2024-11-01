import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';

const BarChart = ({ 
  data = { 
    label: 'Weight Progress', 
    values: [85.5, 83.2, 82.1],
    labels: ['Week 1', 'Week 2', 'Week 3'],
    unit: 'kg',
    goal: 75
  } 
}) => {
  const svgRef = useRef(null);
  const tooltipRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Adjusted margins to prevent overflow
    const margin = { top: 40, right: 60, bottom: 40, left: 60 };
    const width = 400;
    const height = 300;
    
    const maxVal = Math.max(...data.values);
    const minVal = Math.min(Math.min(...data.values), data.goal);
    
    // Reduced padding to prevent overflow
    const domainPadding = (maxVal - minVal) * 0.05;
    
    const scaleY = d3.scaleLinear()
      .domain([minVal - domainPadding, maxVal + domainPadding])
      .range([height - margin.bottom, margin.top]);

    const scaleX = d3.scaleBand()
      .domain(data.labels || data.values.map((_, i) => `Week ${i + 1}`))
      .range([margin.left, width - margin.right])
      .padding(0.5);

    // Rest of the gradient and filter definitions remain the same
    const defs = svg.append('defs');
    
    // Progress gradient
    const gradient = defs.append('linearGradient')
      .attr('id', 'weightGradient')
      .attr('gradientTransform', 'rotate(90)');

    gradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#818cf8')
      .attr('stop-opacity', 0.8);

    gradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#4f46e5')
      .attr('stop-opacity', 1);

    // Hover gradient
    const hoverGradient = defs.append('linearGradient')
      .attr('id', 'weightGradientHover')
      .attr('gradientTransform', 'rotate(90)');

    hoverGradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#a5b4fc')
      .attr('stop-opacity', 0.9);

    hoverGradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#6366f1')
      .attr('stop-opacity', 1);

    // Glow filter
    const filter = defs.append('filter')
      .attr('id', 'glow');

    filter.append('feGaussianBlur')
      .attr('stdDeviation', '3')
      .attr('result', 'coloredBlur');

    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // Add grid lines
    const gridLines = svg.append('g')
      .attr('class', 'grid-lines')
      .attr('opacity', 0.1);

    const yTicks = scaleY.ticks(5);
    yTicks.forEach(tick => {
      gridLines.append('line')
        .attr('x1', margin.left)
        .attr('x2', width - margin.right)
        .attr('y1', scaleY(tick))
        .attr('y2', scaleY(tick))
        .attr('stroke', '#666')
        .attr('stroke-dasharray', '2,2');
    });

    // Add Y-axis with units
    svg.append('g')
      .attr('transform', `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(scaleY).ticks(5).tickFormat(d => `${d}${data.unit}`))
      .call(g => g.select('.domain').remove())
      .call(g => g.selectAll('.tick line').remove())
      .call(g => g.selectAll('.tick text')
        .attr('fill', '#666')
        .style('font-size', '12px'));

    // Add X-axis labels
    svg.append('g')
      .attr('transform', `translate(0, ${height - margin.bottom})`)
      .call(d3.axisBottom(scaleX))
      .call(g => g.select('.domain').remove())
      .call(g => g.selectAll('.tick line').remove())
      .call(g => g.selectAll('.tick text')
        .attr('fill', '#666')
        .style('font-size', '12px'));

    // Add goal line (now constrained within margins)
    svg.append('line')
      .attr('x1', margin.left)
      .attr('x2', width - margin.right)
      .attr('y1', scaleY(data.goal))
      .attr('y2', scaleY(data.goal))
      .attr('stroke', '#22c55e')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '4,4');

    // Adjusted goal label position
    svg.append('text')
      .attr('x', width - margin.right + 5)
      .attr('y', scaleY(data.goal))
      .attr('dy', '0.32em')
      .attr('fill', '#22c55e')
      .style('font-size', '12px')
      .text(`Goal: ${data.goal}${data.unit}`);

    // Add connecting lines between points
    const line = d3.line()
      .x((_, i) => scaleX(data.labels[i]) + scaleX.bandwidth() / 2)
      .y(d => scaleY(d));

    svg.append('path')
      .datum(data.values)
      .attr('fill', 'none')
      .attr('stroke', '#818cf8')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', function() {
        const length = this.getTotalLength();
        return `${length} ${length}`;
      })
      .attr('stroke-dashoffset', function() {
        return this.getTotalLength();
      })
      .attr('d', line)
      .transition()
      .duration(1500)
      .attr('stroke-dashoffset', 0);

    // Add bars
    const bars = svg.selectAll('.bar')
      .data(data.values)
      .enter()
      .append('g')
      .attr('class', 'bar');

    // Bar shadow (constrained to margins)
    bars.append('rect')
      .attr('x', (_, i) => scaleX(data.labels[i]))
      .attr('y', d => scaleY(d))
      .attr('width', scaleX.bandwidth())
      .attr('height', d => Math.max(0, height - margin.bottom - scaleY(d)))
      .attr('fill', '#000')
      .attr('opacity', 0.1)
      .attr('transform', 'translate(2, 2)');

    // Actual bars (constrained to margins)
    bars.append('rect')
      .attr('x', (_, i) => scaleX(data.labels[i]))
      .attr('y', d => scaleY(d))
      .attr('width', scaleX.bandwidth())
      .attr('height', d => Math.max(0, height - margin.bottom - scaleY(d)))
      .attr('fill', 'url(#weightGradient)')
      .attr('rx', 4);

    // Add data points
    bars.append('circle')
      .attr('cx', (_, i) => scaleX(data.labels[i]) + scaleX.bandwidth() / 2)
      .attr('cy', d => scaleY(d))
      .attr('r', 6)
      .attr('fill', '#fff')
      .attr('stroke', '#818cf8')
      .attr('stroke-width', 2);

    // Add value labels
    bars.append('text')
      .attr('x', (_, i) => scaleX(data.labels[i]) + scaleX.bandwidth() / 2)
      .attr('y', d => scaleY(d) - 15)
      .attr('text-anchor', 'middle')
      .attr('fill', '#4f46e5')
      .style('font-size', '12px')
      .style('font-weight', 'bold')
      .text(d => `${d}${data.unit}`);

    // Enhanced interactivity
    const tooltip = d3.select(tooltipRef.current);
    
    bars.selectAll('rect')
      .on('mouseenter', function(event, d) {
        const index = data.values.indexOf(d);
        setActiveIndex(index);
        
        d3.select(this)
          .attr('fill', 'url(#weightGradientHover)')
          .style('filter', 'url(#glow)');

        const change = index > 0 ? d - data.values[index - 1] : 0;
        const changeText = change === 0 ? '' : 
          `Change: ${change > 0 ? '+' : ''}${change.toFixed(1)}${data.unit}`;
        
        tooltip
          .style('opacity', 1)
          .html(`
            <div class="p-3 bg-white rounded-lg shadow-lg">
              <div class="font-bold text-gray-800">${data.labels[index]}</div>
              <div class="text-indigo-600 font-bold text-lg">${d}${data.unit}</div>
              ${changeText ? `<div class="text-sm ${change > 0 ? 'text-red-500' : 'text-green-500'}">${changeText}</div>` : ''}
              <div class="text-sm text-gray-500">Goal: ${data.goal}${data.unit}</div>
            </div>
          `)
          .style('left', `${event.pageX + 10}px`)
          .style('top', `${event.pageY - 10}px`);
      })
      .on('mouseleave', function() {
        setActiveIndex(null);
        
        d3.select(this)
          .attr('fill', 'url(#weightGradient)')
          .style('filter', null);

        tooltip.transition()
          .duration(300)
          .style('opacity', 0);
      });

  }, [data, activeIndex]);

  return (
    <div className="relative flex flex-col items-center bg-white p-6 rounded-xl shadow-lg">
      <div className="w-full">
        <svg 
          ref={svgRef} 
          viewBox="0 0 400 300"
          className="w-full max-w-2xl overflow-visible"
          style={{ maxHeight: '500px' }}
        />
      </div>
      <div 
        ref={tooltipRef} 
        className="fixed z-50 pointer-events-none transition-opacity duration-300" 
        style={{ opacity: 0 }} 
      />
    </div>
  );
};

export default BarChart;