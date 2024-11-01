import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Activity, TrendingUp, TrendingDown, Sparkles } from 'lucide-react';

const DonutChart = ({ 
  data, 
  size = 300,
  strokeWidth = 8,
  showTooltip = true,
  colorThresholds = {
    success: 75,
    warning: 50,
    danger: 0
  },
  tooltipFormatter = null
}) => {
  const svgRef = useRef(null);
  const tooltipRef = useRef(null);
  const [tooltipContent, setTooltipContent] = useState(null);
  const [isAnimating, setIsAnimating] = useState(true);

  // Validate and prepare data
  const sanitizedData = {
    label: data.label || 'Progress',
    value: Math.max(0, Math.min(data.value, data.max)),
    max: data.max || 100,
    history: data.history || [],
    details: data.details || { average: 0 }
  };

  const percentage = (sanitizedData.value / sanitizedData.max) * 100;

  // Enhanced color getters with gradient IDs
  const getStatusColor = () => {
    if (percentage >= colorThresholds.success) return ['#34D399', '#10B981'];
    if (percentage >= colorThresholds.warning) return ['#FBBF24', '#F59E0B'];
    return ['#EF4444', '#DC2626'];
  };

  const getInterpretation = () => {
    if (percentage >= colorThresholds.success) return 'Excellent';
    if (percentage >= colorThresholds.warning) return 'Good';
    return 'Needs Attention';
  };

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 20, right: 20, bottom: 20, left: 20 };
    const width = size - margin.left - margin.right;
    const height = size - margin.top - margin.bottom;
    const radius = Math.min(width, height) / 2;
    const colors = getStatusColor();

    // Create pattern for background
    const pattern = svg.append('defs')
      .append('pattern')
      .attr('id', 'donut-pattern')
      .attr('patternUnits', 'userSpaceOnUse')
      .attr('width', 4)
      .attr('height', 4);

    pattern.append('circle')
      .attr('cx', 2)
      .attr('cy', 2)
      .attr('r', 1)
      .attr('fill', '#f0f0f0');

    // Create gradient
    const gradient = svg.append('defs')
      .append('linearGradient')
      .attr('id', 'donut-gradient')
      .attr('gradientUnits', 'userSpaceOnUse')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '100%')
      .attr('y2', '0%');

    gradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', colors[0]);

    gradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', colors[1]);

    const chart = svg
      .attr('width', size)
      .attr('height', size)
      .append('g')
      .attr('transform', `translate(${size / 2},${size / 2})`);

    // Background circle with pattern
    const arc = d3.arc()
      .innerRadius(radius * 0.7)
      .outerRadius(radius * 0.9)
      .startAngle(0)
      .endAngle(2 * Math.PI);

    chart.append('path')
      .attr('d', arc)
      .style('fill', 'url(#donut-pattern)');

    // Progress arc
    const progressArc = d3.arc()
      .innerRadius(radius * 0.7)
      .outerRadius(radius * 0.9)
      .startAngle(0);

    const progressPath = chart.append('path')
      .style('fill', 'url(#donut-gradient)')
      .style('filter', 'drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.1))');

    if (isAnimating) {
      progressPath.transition()
        .duration(2000)
        .ease(d3.easeCubicOut)
        .attrTween('d', () => {
          const interpolate = d3.interpolate(0, (percentage / 100) * 2 * Math.PI);
          return (t) => {
            return progressArc({ endAngle: interpolate(t) });
          };
        })
        .on('end', () => setIsAnimating(false));
    } else {
      progressPath.attr('d', progressArc({ endAngle: (percentage / 100) * 2 * Math.PI }));
    }

    // Add ticks
    const tickData = d3.range(0, 360, 36);
    chart.selectAll('.tick')
      .data(tickData)
      .enter()
      .append('line')
      .attr('class', 'tick')
      .attr('transform', d => `rotate(${d})`)
      .attr('x1', radius * 0.9)
      .attr('x2', radius * 0.95)
      .attr('stroke', '#9ca3af')
      .attr('stroke-width', 2);

    // Value text with animation
    const valueText = chart.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '-0.5em')
      .style('font-size', '2.5em')
      .style('font-weight', 'bold')
      .style('fill', colors[1])
      .text('0');

    if (isAnimating) {
      valueText.transition()
        .duration(2000)
        .ease(d3.easeCubicOut)
        .tween('text', function() {
          const i = d3.interpolateNumber(0, percentage);
          return function(t) {
            this.textContent = `${Math.round(i(t))}`;
          };
        });
    } else {
      valueText.text(Math.round(percentage));
    }

    // Unit text
    chart.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '1em')
      .style('font-size', '1em')
      .style('fill', '#6B7280')
      .text('%');

    // Add sparkline if history exists
    if (sanitizedData.history && sanitizedData.history.length > 1) {
      const sparklineHeight = radius * 0.3;
      const x = d3.scaleLinear()
        .domain([0, sanitizedData.history.length - 1])
        .range([-radius * 0.4, radius * 0.4]);
      
      const y = d3.scaleLinear()
        .domain([d3.min(sanitizedData.history), d3.max(sanitizedData.history)])
        .range([sparklineHeight, -sparklineHeight]);

      const line = d3.line()
        .x((d, i) => x(i))
        .y(d => y(d))
        .curve(d3.curveCatmullRom);

      const sparkline = chart.append('path')
        .datum(sanitizedData.history)
        .attr('fill', 'none')
        .attr('stroke', colors[1])
        .attr('stroke-width', 2)
        .attr('d', line)
        .attr('transform', `translate(0, ${radius * 0.5})`);

      if (isAnimating) {
        const totalLength = sparkline.node().getTotalLength();
        sparkline
          .attr('stroke-dasharray', `${totalLength} ${totalLength}`)
          .attr('stroke-dashoffset', totalLength)
          .transition()
          .duration(2000)
          .ease(d3.easeCubicOut)
          .attr('stroke-dashoffset', 0);
      }
    }

  }, [sanitizedData, size, percentage, isAnimating]);

  return (
    <div className="relative">
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <Activity className="w-6 h-6" style={{ color: getStatusColor()[1] }} />
            <h3 className="text-lg font-semibold text-gray-800">{sanitizedData.label}</h3>
            {percentage >= colorThresholds.success && (
              <Sparkles className="text-amber-400 w-5 h-5 animate-pulse" />
            )}
          </div>
          <div className="flex items-center space-x-1">
            <Activity className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-500">
              Target: {sanitizedData.max}%
            </span>
          </div>
        </div>

        <div className="flex justify-center">
          <svg 
            ref={svgRef} 
            className="w-full max-w-sm" 
            viewBox={`0 0 ${size} ${size}`} // Added viewBox for responsiveness
          />
        </div>

        <div className="mt-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-1">
              {sanitizedData.history && sanitizedData.history.length > 1 && (
                sanitizedData.history[sanitizedData.history.length - 1] > sanitizedData.history[0] ? (
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500" />
                )
              )}
              <span className="text-sm text-gray-600">
                Avg: {sanitizedData.details.average}%
              </span>
            </div>
            <span className="text-sm font-medium" style={{ color: getStatusColor()[1] }}>
              {getInterpretation()}
            </span>
          </div>
        </div>
      </div>
      {tooltipContent && (
        <div 
          ref={tooltipRef}
          className="fixed z-50 pointer-events-none transform -translate-x-1/2 -translate-y-full"
          style={{ 
            left: `${window.event?.pageX}px`,
            top: `${window.event?.pageY - 10}px`
          }}
          dangerouslySetInnerHTML={{ __html: tooltipContent }}
        />
      )}
    </div>
  );
};

export default DonutChart;
