import { useSelector } from 'react-redux';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ChartContainer, ChartTooltip, type ChartConfig } from '@/components/ui/chart';
import { Skeleton } from '@/components/shared/Skeleton';
import { useMonthlyTrends } from '@/hooks/useMonthlyTrends';
import type { RootState } from '@/store';
import type { Trend } from '@/types/api';

const chartConfig = {
  totalSpent: {
    label: 'Total Spent',
    color: '#00A3E0',
  },
} satisfies ChartConfig;

const formatMonth = (monthStr: string) => {
  const date = new Date(monthStr + '-01');
  return date.toLocaleDateString('en-US', { month: 'short' });
};

const formatCurrency = (value: number) => {
  return `R${(value / 1000).toFixed(1)}k`;
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="monthly-trends__tooltip">
        <div className="monthly-trends__tooltip-month">{formatMonth(data.month)}</div>
        <div className="monthly-trends__tooltip-amount">
          R{data.totalSpent.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
        </div>
        <div className="monthly-trends__tooltip-detail">
          {data.transactionCount} transactions
        </div>
        <div className="monthly-trends__tooltip-detail">
          R{data.averageTransaction.toFixed(2)} avg
        </div>
      </div>
    );
  }
  return null;
};

export default function MonthlySpendingTrends() {
  const customerId = useSelector((state: RootState) => state.filters.customerId);
  const { data, isFetching } = useMonthlyTrends(customerId, 6);

  const chartData: Trend[] = data?.trends ?? [];

  if (isFetching) {
    return (
      <Card className="w-full shadow-none">
        <CardHeader className="pb-2">
          <CardTitle className=".h3">Monthly Spending</CardTitle>
          <CardDescription className="text-xs">Loading...</CardDescription>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="monthly-trends__skeleton">
            <Skeleton style={{ height: '100%', width: '100%' }} />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (chartData.length === 0) return null;

  const firstMonth = chartData[0].totalSpent;
  const lastMonth = chartData[chartData.length - 1].totalSpent;
  const trendPercentage = (((lastMonth - firstMonth) / firstMonth) * 100).toFixed(1);
  const isPositive = parseFloat(trendPercentage) > 0;

  const totalSpent = chartData.reduce((sum, item) => sum + item.totalSpent, 0);
  const avgSpent = totalSpent / chartData.length;

  const firstDate = new Date(chartData[0].month + '-01');
  const lastDate = new Date(chartData[chartData.length - 1].month + '-01');
  const dateLabel = `${firstDate.toLocaleDateString('en-US', { month: 'short' })} - ${lastDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`;

  return (
    <Card className="w-full shadow-none">
      <CardHeader className="pb-2">
        <CardTitle className=".h3">Monthly Spending</CardTitle>
        <CardDescription className="text-xs">{dateLabel}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <ChartContainer config={chartConfig} className="monthly-trends__chart-area">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="fillTotalSpent" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-totalSpent)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--color-totalSpent)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={formatMonth}
              tick={{ fontSize: 11 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={formatCurrency}
              tick={{ fontSize: 11 }}
              width={40}
            />
            <ChartTooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="totalSpent"
              stroke="var(--color-totalSpent)"
              strokeWidth={2}
              fill="url(#fillTotalSpent)"
              dot={{ fill: 'var(--color-totalSpent)', r: 3 }}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="pt-1">
        <div className="monthly-trends__footer">
          <div
            className={`monthly-trends__trend ${isPositive ? 'monthly-trends__trend--positive' : 'monthly-trends__trend--negative'}`}
          >
            {isPositive ? <TrendingUp /> : <TrendingDown />}
            <span>
              {isPositive ? '+' : ''}
              {trendPercentage}%
            </span>
          </div>
          <div className="monthly-trends__average">
            Avg:{' '}
            <span className="monthly-trends__average-value">
              R{avgSpent.toLocaleString('en-ZA', { maximumFractionDigits: 0 })}
            </span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
