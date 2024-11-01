import React, { useRef, useEffect, useMemo, useState } from 'react';
import * as d3 from 'd3';
import { Activity, TrendingUp, TrendingDown } from 'lucide-react';

const RadialProgress = ({ 
  data = { 
    label: 'Progress',
    value: 75,
    history: [65, 70, 68, 75, 72, 74, 75],
    details: {
      target: 100,
      average: 71,
      peak: 75
    }
  }, 
  size = 300 
}) => {
  const svgRef = useRef(null);
  const [isAnimating, setIsAnimating] = useState(true);

  const { statusColor, interpretation, gradientColors } = useMemo(() => {
    const progress = data.value;
    let colors = ['#EF4444', '#DC2626'];
    let interpret = 'Needs Attention';

    if (progress >= 80) {
      colors = ['#34D399', '#10B981'];
      interpret = 'Excellent';
    } else if (progress >= 50) {
      colors = ['#FBBF24', '#F59E0B'];
      interpret = 'Good';
    }

    return {
      statusColor: colors[1],
      interpretation: interpret,
      gradientColors: colors
    };
  }, [data.value]);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };
    const width = size - margin.left - margin.right;
    const height = size - margin.top - margin.bottom;
    const radius = Math.min(width, height) / 2;

    svg.selectAll('*').remove();

    // Create pattern for background
    const pattern = svg.append('defs')
      .append('pattern')
      .attr('id', 'progress-pattern')
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
      .attr('id', 'progress-gradient')
      .attr('gradientUnits', 'userSpaceOnUse')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '100%')
      .attr('y2', '0%');

    gradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', gradientColors[0]);

    gradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', gradientColors[1]);

    const chart = svg
      .attr('width', size)
      .attr('height', size)
      .append('g')
      .attr('transform', `translate(${size / 2},${size / 2})`);

    // Create arcs
    const arc = d3.arc()
      .innerRadius(radius * 0.7)
      .outerRadius(radius * 0.9)
      .startAngle(0);

    // Background arc with pattern
    chart.append('path')
      .datum({ endAngle: 2 * Math.PI })
      .style('fill', 'url(#progress-pattern)')
      .attr('d', arc);

    // Progress arc
    const progressArc = chart.append('path')
      .datum({ endAngle: 0 })
      .style('fill', 'url(#progress-gradient)')
      .attr('d', arc)
      .style('filter', 'drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.1))');

    if (isAnimating) {
      progressArc.transition()
        .duration(2000)
        .ease(d3.easeCubicOut)
        .attrTween('d', (d) => {
          const interpolate = d3.interpolate(0, (data.value / 100) * 2 * Math.PI);
          return (t) => {
            d.endAngle = interpolate(t);
            return arc(d);
          };
        })
        .on('end', () => setIsAnimating(true)); // Set to false after animation ends
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
      .style('fill', statusColor)
      .text('0');

    if (isAnimating) {
      valueText.transition()
        .duration(2000)
        .ease(d3.easeCubicOut)
        .tween('text', function() {
          const i = d3.interpolateNumber(0, data.value);
          return function(t) {
            this.textContent = `${Math.round(i(t))}`;
          };
        });
    } else {
      valueText.text(data.value);
    }

    // Unit text
    chart.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '1em')
      .style('font-size', '1em')
      .style('fill', '#6B7280')
      .text('%');

    // Add sparkline if history exists
    if (data.history && data.history.length > 1) {
      const sparklineHeight = radius * 0.3;
      const x = d3.scaleLinear()
        .domain([0, data.history.length - 1])
        .range([-radius * 0.4, radius * 0.4]);
      
      const y = d3.scaleLinear()
        .domain([d3.min(data.history), d3.max(data.history)])
        .range([sparklineHeight, -sparklineHeight]);

      const line = d3.line()
        .x((d, i) => x(i))
        .y(d => y(d))
        .curve(d3.curveCatmullRom);

      const sparkline = chart.append('path')
        .datum(data.history)
        .attr('fill', 'none')
        .attr('stroke', statusColor)
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

  }, [data, size, statusColor, gradientColors, isAnimating]);

  return (
    <div className="relative">
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <Activity className={`w-6 h-6`} style={{ color: statusColor }} />
            <h3 className="text-lg font-semibold text-gray-800">{data.label}</h3>
          </div>
          <div className="flex items-center space-x-1">
            <Activity className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-500">
              Target: {data.details?.target}%
            </span>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="flex justify-center w-full max-w-xs mx-auto">
            <svg 
              ref={svgRef} 
              className="w-full h-auto"
              viewBox="0 0 300 300" // Set the viewBox based on your chart dimensions
              preserveAspectRatio="xMidYMid meet"
            ></svg>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-1">
              {data.history && data.history[data.history.length - 1] > data.details.average ? (
                <TrendingUp className="w-4 h-4 text-green-500" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500" />
              )}
              <span className="text-sm text-gray-500">Last Value: {data.history[data.history.length - 1]}%</span>
            </div>
            <span className="text-sm text-gray-500">Avg: {data.details.average}%</span>
          </div>
          <div className="text-sm text-gray-500">Interpretation: {interpretation}</div>
        </div>
      </div>
    </div>
  );
};

export default RadialProgress;
