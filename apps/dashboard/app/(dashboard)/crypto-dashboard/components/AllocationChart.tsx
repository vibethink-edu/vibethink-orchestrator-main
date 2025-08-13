/**
 * Allocation Chart Component
 * Displays portfolio allocation as a pie chart
 */

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { PieChart } from 'lucide-react'
import { AllocationChartProps } from '../types'

export const AllocationChart: React.FC<AllocationChartProps> = ({ 
  data, 
  title = "Portfolio Allocation",
  showLegend = true,
  loading = false 
}) => {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <div className="animate-pulse">
              <div className="w-48 h-48 bg-muted rounded-full mb-4"></div>
              {showLegend && (
                <div className="space-y-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-muted rounded"></div>
                      <div className="h-4 w-20 bg-muted rounded"></div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <PieChart className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No allocation data available</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(value)
  }

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  // Calculate angles for pie chart segments
  const total = data.reduce((sum, item) => sum + item.value, 0)
  let cumulativeAngle = 0
  
  const segments = data.map((item) => {
    const angle = (item.value / total) * 360
    const segment = {
      ...item,
      angle,
      startAngle: cumulativeAngle,
      endAngle: cumulativeAngle + angle
    }
    cumulativeAngle += angle
    return segment
  })

  // SVG pie chart generation
  const createPath = (centerX: number, centerY: number, radius: number, startAngle: number, endAngle: number) => {
    const start = polarToCartesian(centerX, centerY, radius, endAngle)
    const end = polarToCartesian(centerX, centerY, radius, startAngle)
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1"
    
    return [
      "M", centerX, centerY,
      "L", start.x, start.y,
      "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
      "Z"
    ].join(" ")
  }

  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    }
  }

  const centerX = 120
  const centerY = 120
  const radius = 100

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{title}</span>
          <span className="text-sm text-muted-foreground font-normal">
            {data.length} {data.length === 1 ? 'asset' : 'assets'}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col lg:flex-row items-center gap-6">
          {/* Pie Chart */}
          <div className="relative">
            <svg width="240" height="240" className="drop-shadow-sm">
              {segments.map((segment, index) => (
                <path
                  key={index}
                  d={createPath(centerX, centerY, radius, segment.startAngle, segment.endAngle)}
                  fill={segment.color}
                  className="hover:opacity-80 transition-opacity cursor-pointer"
                  stroke="white"
                  strokeWidth="2"
                />
              ))}
              {/* Center circle for donut effect */}
              <circle
                cx={centerX}
                cy={centerY}
                r="40" 
                fill="hsl(var(--background))"
                stroke="hsl(var(--border))"
                strokeWidth="1"
              />
              {/* Center text */}
              <text
                x={centerX}
                y={centerY - 5}
                textAnchor="middle"
                className="text-sm font-medium fill-foreground"
              >
                Total
              </text>
              <text
                x={centerX}
                y={centerY + 10}
                textAnchor="middle"
                className="text-xs fill-muted-foreground"
              >
                {formatCurrency(total)}
              </text>
            </svg>
          </div>

          {/* Legend */}
          {showLegend && (
            <div className="flex-1 space-y-3">
              {data.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-sm"
                      style={{ backgroundColor: item.color }}
                    />
                    <div>
                      <p className="text-sm font-medium">
                        {item.symbol ? `${item.name} (${item.symbol})` : item.name}
                      </p>
                      {item.profit_loss !== undefined && (
                        <p className={`text-xs ${
                          item.profit_loss >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {item.profit_loss >= 0 ? '+' : ''}{formatCurrency(item.profit_loss)}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{formatCurrency(item.value)}</p>
                    <p className="text-xs text-muted-foreground">{formatPercentage(item.percentage)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Mobile Legend (when chart is small) */}
        {showLegend && (
          <div className="lg:hidden mt-6 grid grid-cols-1 gap-2">
            {data.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-3 h-3 rounded-sm"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm font-medium">
                    {item.symbol ? item.symbol : item.name}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{formatPercentage(item.percentage)}</p>
                  <p className="text-xs text-muted-foreground">{formatCurrency(item.value)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}