'use client';

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui';

interface DataPoint {
  date: string;
  revenue: number;
  orders?: number;
  aov?: number;
}

interface RevenueChartProps {
  data: DataPoint[];
  title?: string;
  showOrders?: boolean;
  dataKey?: 'revenue' | 'orders' | 'aov';
  valuePrefix?: string;
  chartType?: 'line' | 'bar' | 'area';
}

export function RevenueChart({
  data,
  title = 'Revenue Over Time',
  showOrders = false,
  dataKey = 'revenue',
  valuePrefix = '$',
  chartType = 'line'
}: RevenueChartProps) {
  const formatValue = (value: number) => {
    if (valuePrefix === '$') {
      if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
      if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
      return `$${value.toFixed(0)}`;
    }
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value.toFixed(0);
  };

  const getLabel = () => {
    switch (dataKey) {
      case 'orders': return 'Orders';
      case 'aov': return 'AOV';
      default: return 'Revenue';
    }
  };

  const renderChart = () => {
    const commonProps = {
      data,
      margin: { top: 5, right: 5, left: 0, bottom: 5 }
    };

    const xAxisProps = {
      dataKey: "date",
      axisLine: false,
      tickLine: false,
      tick: { fill: '#737373', fontSize: 12 },
      dy: 10
    };

    const yAxisProps = {
      axisLine: false,
      tickLine: false,
      tick: { fill: '#737373', fontSize: 12 },
      tickFormatter: formatValue,
      width: 60
    };

    const tooltipProps = {
      contentStyle: {
        backgroundColor: '#ffffff',
        border: '1px solid #e5e5e5',
        borderRadius: 0,
        fontSize: 12,
      },
      formatter: (value: number) => [formatValue(value), getLabel()] as [string, string]
    };

    if (chartType === 'bar') {
      return (
        <BarChart {...commonProps}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" vertical={false} />
          <XAxis {...xAxisProps} />
          <YAxis {...yAxisProps} />
          <Tooltip {...tooltipProps} />
          <Bar dataKey={dataKey} fill="#0a0a0a" />
        </BarChart>
      );
    }

    if (chartType === 'area') {
      return (
        <AreaChart {...commonProps}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" vertical={false} />
          <XAxis {...xAxisProps} />
          <YAxis {...yAxisProps} />
          <Tooltip {...tooltipProps} />
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0a0a0a" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#0a0a0a" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke="#0a0a0a"
            strokeWidth={2}
            fill="url(#colorValue)"
          />
        </AreaChart>
      );
    }

    // Default: line chart
    return (
      <LineChart {...commonProps}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" vertical={false} />
        <XAxis {...xAxisProps} />
        <YAxis {...yAxisProps} />
        <Tooltip {...tooltipProps} />
        <Line
          type="monotone"
          dataKey={dataKey}
          stroke="#0a0a0a"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, fill: '#0a0a0a' }}
        />
        {showOrders && dataKey === 'revenue' && (
          <Line
            type="monotone"
            dataKey="orders"
            stroke="#a3a3a3"
            strokeWidth={1}
            strokeDasharray="5 5"
            dot={false}
          />
        )}
      </LineChart>
    );
  };

  // If title is empty, don't wrap in Card (used when embedded in another card)
  if (!title) {
    return (
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
