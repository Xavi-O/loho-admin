// components/Charts/ChartRenderer.tsx

'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Label,
  RadialBarChart,
  RadialBar,
  PolarRadiusAxis,
} from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import Loading from '@/app/loading';

interface ChartRendererProps {
  type: 'bar' | 'horizontalBar' | 'area' | 'pie' | 'radial';
  data: any[];
  keys?: string[];
  xKey?: string;
  yKey?: string;
  title: string;
  description: string;
  colors?: string[];
  totalLabel?: string;
  stacked?: boolean;
  total?: number;
  loading?: boolean;
}

export default function ChartRenderer({
  type,
  data,
  keys = [],
  xKey = '',
  yKey = '',
  title,
  description,
  colors = [],
  totalLabel,
  total = 0,
  stacked = false,
  loading = false,
}: ChartRendererProps) {
  const defaultColors = ['#4589ff', '#08bdba', '#ff7eb6', '#8a3ffc', '#fa4d56'];
  const barColors = colors.length ? colors : defaultColors;

  let chartElement: React.ReactElement = <></>;

  if (type === 'bar') {
    chartElement = (
      <BarChart data={data}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey={xKey} tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis tickLine={false} axisLine={false} tickMargin={8} />
        <Tooltip content={<ChartTooltipContent indicator="dashed" />} />
        {keys.map((key, index) => (
          <Bar
            key={key}
            dataKey={key}
            fill={barColors[index % barColors.length]}
            radius={4}
            stackId={stacked ? 'a' : undefined}
          />
        ))}
      </BarChart>
    );
  } else if (type === 'horizontalBar') {
    chartElement = (
      <BarChart layout="vertical" data={data}>
        <XAxis type="number" hide />
        <YAxis
          dataKey={yKey}
          type="category"
          tickLine={false}
          axisLine={false}
          tickMargin={10}
        />
        <Tooltip content={<ChartTooltipContent hideLabel />} />
        {keys.map((key, index) => (
          <Bar
            key={key}
            dataKey={key}
            fill={barColors[index % barColors.length]}
            radius={5}
            stackId={stacked ? 'a' : undefined}
          />
        ))}
      </BarChart>
    );
  } else if (type === 'area') {
    chartElement = (
      <AreaChart data={data}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey={xKey} tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis tickLine={false} axisLine={false} tickMargin={8} />
        <Tooltip content={<ChartTooltipContent indicator="dot" />} />
        {keys.map((key, index) => (
          <Area
            key={key}
            type="natural"
            dataKey={key}
            stroke={barColors[index % barColors.length]}
            fillOpacity={1}
            fill={barColors[index % barColors.length]}
            stackId={stacked ? 'a' : undefined}
          />
        ))}
      </AreaChart>
    );
  } else if (type === 'pie') {
    chartElement = (
      <PieChart>
        <Tooltip content={<ChartTooltipContent hideLabel={false} />} />
        <Pie
          data={data}
          dataKey={keys[0]}
          nameKey={xKey}
          innerRadius={60}
          outerRadius={100}
          strokeWidth={1}
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
          ))}
          <Label
            content={({ viewBox }) => {
              if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                return (
                  <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className="fill-foreground text-3xl font-bold"
                    >
                      {total?.toLocaleString()}
                    </tspan>
                    {totalLabel && (
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 24}
                        className="fill-muted-foreground"
                      >
                        {totalLabel}
                      </tspan>
                    )}
                  </text>
                );
              }
            }}
          />
        </Pie>
      </PieChart>
    );
  } else if (type === 'radial') {
    chartElement = (
      <RadialBarChart
        data={data}
        startAngle={180}
        endAngle={0}
        innerRadius={80}
        outerRadius={130}
      >
        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
          <Label
            content={({ viewBox }) => {
              if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                return (
                  <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) - 16}
                      className="fill-foreground text-2xl font-bold"
                    >
                      {total?.toLocaleString()}
                    </tspan>
                    {totalLabel && (
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 4}
                        className="fill-muted-foreground"
                      >
                        {totalLabel}
                      </tspan>
                    )}
                  </text>
                );
              }
            }}
          />
        </PolarRadiusAxis>
        {keys.map((key, index) => (
          <RadialBar
            key={key}
            dataKey={key}
            fill={barColors[index % barColors.length]}
            stackId={stacked ? 'a' : undefined}
            cornerRadius={5}
            className="stroke-transparent stroke-2"
          />
        ))}
      </RadialBarChart>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex flex-col items-center justify-center h-[250px]">
            <Loading />
            <div className="text-sm text-muted-foreground text-center">
              Please wait while loading chart data...
            </div>
          </div>
        ) : (
          <ChartContainer config={{}} className="h-[250px] w-full">
            {chartElement}
          </ChartContainer>
        )}
      </CardContent>
      {type !== 'radial' && type !== 'pie' && (
        <CardFooter className="text-sm text-muted-foreground">
          Showing trends grouped by {xKey || yKey || 'category'}
        </CardFooter>
      )}
    </Card>
  );
}
