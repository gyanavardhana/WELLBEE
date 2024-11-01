import React, { useRef, useEffect, useMemo, useState } from 'react';
import * as d3 from 'd3';
import { Heart, Activity, TrendingUp, TrendingDown } from 'lucide-react';

const GaugeChart = () => {
  const svgRef = useRef(null);
  const tooltipRef = useRef(null);
  const [isAnimating, setIsAnimating] = useState(true);

  // Built-in data with more detailed metrics
  const data = {
    label: 'Heart Rate',
    value: 75,
    max: 200,
    min: 0,
    threshold: { normal: 100, warning: 140 },
    history: [65, 72, 68, 75, 71, 73, 75],
    unit: 'bpm',
    details: {
      average: 72,
      peak: 75,
      min: 65
    }
  };

  const { normalizedValue, healthStatus, statusColor, interpretation, gradientColors } = useMemo(() => {
    const normalized = Math.min(Math.max((data.value - data.min) / (data.max - data.min), 0), 1);
    let status = 'normal';
    let colors = ['#34D399', '#10B981'];
    let interpret = 'Healthy';

    if (data.value >= data.threshold.warning) {
      status = 'high';
      colors = ['#EF4444', '#DC2626'];
      interpret = 'Critical';
    } else if (data.value >= data.threshold.normal) {
      status = 'warning';
      colors = ['#FBBF24', '#F59E0B'];
      interpret = 'Elevated';
    }

    return {
      normalizedValue: normalized,
      healthStatus: status,
      statusColor: colors[1],
      interpretation: interpret,
      gradientColors: colors
    };
  }, [data]);

  useEffect(() => {
    if (!svgRef.current) return;

    const size = 300;
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 20, right: 20, bottom: 20, left: 20 };
    const width = size - margin.left - margin.right;
    const height = size - margin.top - margin.bottom;
    const radius = Math.min(width, height) / 2;

    // Create gradient
    const gradient = svg.append('defs')
      .append('linearGradient')
      .attr('id', 'gauge-gradient')
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

    // Create background with subtle pattern
    const pattern = svg.append('defs')
      .append('pattern')
      .attr('id', 'gauge-pattern')
      .attr('patternUnits', 'userSpaceOnUse')
      .attr('width', 4)
      .attr('height', 4);

    pattern.append('circle')
      .attr('cx', 2)
      .attr('cy', 2)
      .attr('r', 1)
      .attr('fill', '#f0f0f0');

    // Background arc with pattern
    const arc = d3.arc()
      .innerRadius(radius * 0.7)
      .outerRadius(radius * 0.9)
      .startAngle(-Math.PI / 2)
      .endAngle(Math.PI / 2);

    chart.append('path')
      .datum({ endAngle: Math.PI / 2 })
      .style('fill', 'url(#gauge-pattern)')
      .attr('d', arc);

    // Animated foreground arc
    const foregroundArc = chart.append('path')
      .datum({ endAngle: -Math.PI / 2 })
      .style('fill', 'url(#gauge-gradient)')
      .attr('d', arc)
      .style('filter', 'drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.1))');

    if (isAnimating) {
      foregroundArc.transition()
        .duration(2000)
        .ease(d3.easeCubicOut)
        .attrTween('d', (d) => {
          const interpolate = d3.interpolate(
            d.endAngle,
            (-Math.PI / 2) + (Math.PI * normalizedValue)
          );
          return (t) => {
            d.endAngle = interpolate(t);
            return arc(d);
          };
        })
        .on('end', () => setIsAnimating(false));
    }

    // Ticks
    const scale = d3.scaleLinear()
      .domain([data.min, data.max])
      .range([-180, 0]);

    const ticks = d3.range(data.min, data.max + 1, (data.max - data.min) / 10);

    chart.selectAll('.tick')
      .data(ticks)
      .enter()
      .append('line')
      .attr('class', 'tick')
      .attr('transform', d => `rotate(${scale(d)})`)
      .attr('x1', radius * 0.9)
      .attr('x2', radius * 0.95)
      .attr('stroke', '#9CA3AF')
      .attr('stroke-width', 2);

    // Value text with animation
    const valueText = chart.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '-0.5em')
      .style('font-size', '2.5em')
      .style('font-weight', 'bold')
      .style('fill', statusColor)
      .text(0);

    if (isAnimating) {
      valueText.transition()
        .duration(2000)
        .ease(d3.easeCubicOut)
        .tween('text', function() {
          const i = d3.interpolateNumber(0, data.value);
          return function(t) {
            this.textContent = Math.round(i(t));
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
      .text(data.unit);

    // History sparkline
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

      const totalLength = sparkline.node().getTotalLength();

      if (isAnimating) {
        sparkline
          .attr('stroke-dasharray', `${totalLength} ${totalLength}`)
          .attr('stroke-dashoffset', totalLength)
          .transition()
          .duration(2000)
          .ease(d3.easeCubicOut)
          .attr('stroke-dashoffset', 0);
      }
    }

  }, [data, normalizedValue, statusColor, gradientColors, isAnimating]);

  return (
    <div className="relative">
      <div className="bg-white rounded-xl p-6 shadow-lg">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <Heart className={`w-6 h-6 ${healthStatus === 'normal' ? 'text-emerald-500' : healthStatus === 'warning' ? 'text-amber-500' : 'text-red-500'}`} />
            <h3 className="text-lg font-semibold text-gray-800">{data.label}</h3>
          </div>
          <div className="flex items-center space-x-1">
            <Activity className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-500">Avg: {data.details.average}{data.unit}</span>
          </div>
        </div>

        {/* Responsive SVG Section */}
        <div className="flex justify-center">
          <div className="flex justify-center w-full max-w-sm mx-auto">
            <svg
              ref={svgRef}
              className="w-full h-auto"
              viewBox="0 0 300 300" // Set the viewBox based on your chart dimensions
              preserveAspectRatio="xMidYMid meet"
            ></svg>
          </div>
        </div>

        {/* Footer Section */}
        <div className="mt-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-1">
              {data.history[data.history.length - 1] > data.history[0] ? (
                <TrendingUp className="w-4 h-4 text-red-500" />
              ) : (
                <TrendingDown className="w-4 h-4 text-emerald-500" />
              )}
              <span className="text-sm text-gray-600">
                {Math.abs(data.history[data.history.length - 1] - data.history[0])} {data.unit} change
              </span>
            </div>
            <span className="text-sm font-medium" style={{ color: statusColor }}>
              {interpretation}
            </span>
          </div>
        </div>
      </div>
      <div ref={tooltipRef} className="absolute pointer-events-none" style={{ opacity: 0 }} />
    </div>
  );
};

export default GaugeChart;