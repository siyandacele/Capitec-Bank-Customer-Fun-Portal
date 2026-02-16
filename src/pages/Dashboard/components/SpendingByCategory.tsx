import { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Cell, Pie, PieChart, Label, ResponsiveContainer } from 'recharts';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, type ChartConfig } from '@/components/ui/chart';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/shared/Skeleton';
import { useSpendingByCategory } from '@/hooks/useSpendingByCategory';
import { useAvailableFilters } from '@/hooks/useAvailableFilters';
import type { RootState } from '@/store';
import type { Period } from '@/types/api';

interface CategoryData {
  name: string;
  amount: number;
  percentage: number;
  color: string;
  transactionCount: number;
}

interface DateRangePreset {
  value: string;
  label: string;
}

export default function SpendingByCategory() {
  const customerId = useSelector((state: RootState) => state.filters.customerId);
  const globalPeriod = useSelector((state: RootState) => state.filters.period);
  const [period, setPeriod] = useState<Period>(globalPeriod);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [filterType, setFilterType] = useState<'preset' | 'custom'>('preset');
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const params = useMemo(() => {
    if (filterType === 'custom' && dateRange?.from && dateRange?.to) {
      return {
        startDate: format(dateRange.from, 'yyyy-MM-dd'),
        endDate: format(dateRange.to, 'yyyy-MM-dd'),
      };
    }
    return { period };
  }, [filterType, period, dateRange]);

  const { data: categoryData, isFetching } = useSpendingByCategory(customerId, params);
  const { data: filtersData } = useAvailableFilters(customerId);

  const dateRangePresets = useMemo(
    () => filtersData?.dateRangePresets ?? [],
    [filtersData?.dateRangePresets],
  );

  const chartConfig = useMemo(() => {
    if (!categoryData?.categories) return {};
    return categoryData.categories.reduce(
      (config: ChartConfig, category: CategoryData) => {
        config[category.name.toLowerCase()] = {
          label: category.name,
          color: category.color,
        };
        return config;
      },
      {} as ChartConfig,
    );
  }, [categoryData?.categories]);

  const currentPeriodLabel = useMemo(() => {
    if (filterType === 'custom' && dateRange?.from && dateRange?.to) {
      return `${format(dateRange.from, 'MMM dd, yyyy')} - ${format(dateRange.to, 'MMM dd, yyyy')}`;
    }
    const preset = dateRangePresets.find((p: DateRangePreset) => p.value === period);
    return preset ? preset.label : period;
  }, [period, dateRange, filterType, dateRangePresets]);

  const handlePresetChange = (value: string) => {
    setPeriod(value as Period);
    setFilterType('preset');
    setDateRange(undefined);
  };

  const handleApplyDateRange = () => {
    if (dateRange?.from && dateRange?.to) {
      setFilterType('custom');
    }
  };

  if (isFetching) {
    return (
      <Card className="w-full spending-by-category">
        <CardHeader className="spending-by-category__header">
          <span className="spending-by-category__title">Spending by Category</span>
          <span className="spending-by-category__subtitle">Loading...</span>
        </CardHeader>
        <CardContent className="pt-6 pb-4">
          <Skeleton className="spending-by-category__skeleton-chart" />
          <div className="spending-by-category__skeleton-rows">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="spending-by-category__skeleton-row" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!categoryData?.categories || categoryData.categories.length === 0) {
    return (
      <Card className="w-full spending-by-category">
        <CardHeader className="spending-by-category__header">
          <span className="spending-by-category__title">Spending by Category</span>
          <span className="spending-by-category__subtitle">{currentPeriodLabel}</span>
        </CardHeader>
        <CardContent className="pt-6 pb-4">
          <div className="spending-by-category__empty">
            <p className="spending-by-category__empty-text">No spending data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full spending-by-category">
      <CardHeader className="spending-by-category__header">
        <div>
          <span className="spending-by-category__title">Spending by Category</span>
          <p className="spending-by-category__subtitle">{currentPeriodLabel}</p>
        </div>

        <div className="spending-by-category__filters">
          <select
            value={period}
            onChange={e => handlePresetChange(e.target.value)}
            className="spending-by-category__select"
          >
            {dateRangePresets.map((preset: DateRangePreset) => (
              <option key={preset.value} value={preset.value}>
                {preset.label}
              </option>
            ))}
          </select>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={`spending-by-category__date-btn ${
                  dateRange?.from && dateRange?.to
                    ? 'spending-by-category__date-btn--active'
                    : ''
                }`}
              >
                <CalendarIcon className="h-3.5 w-3.5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
                className="p-3"
              />
              <div className="spending-by-category__popover-footer">
                <button
                  onClick={handleApplyDateRange}
                  disabled={!dateRange?.from || !dateRange?.to}
                  className="spending-by-category__date-apply"
                >
                  Apply Date Range
                </button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </CardHeader>

      <CardContent className="px-0 mx-0">
        <ChartContainer config={chartConfig} className="spending-by-category__chart">
          <ResponsiveContainer width="100%">
            <PieChart key={categoryData.totalAmount}>
              <defs>
                {categoryData.categories.map((_category: CategoryData, index: number) => (
                  <filter
                    key={`shadow-${index}`}
                    id={`shadow-${index}`}
                    x="-50%"
                    y="-50%"
                    width="200%"
                    height="200%"
                  >
                    <feDropShadow dx="0" dy="2" stdDeviation="4" floodOpacity="0.15" />
                  </filter>
                ))}
              </defs>
              <ChartTooltip
                content={({ active, payload }) => {
                  if (!active || !payload || !payload.length) return null;
                  const data = payload[0].payload as CategoryData;
                  return (
                    <div className="spending-by-category__tooltip">
                      <div className="spending-by-category__tooltip-header">
                        <div
                          className="spending-by-category__tooltip-dot"
                          style={{ backgroundColor: data.color }}
                        />
                        <span className="spending-by-category__tooltip-name">
                          {data.name}
                        </span>
                      </div>
                      <div className="spending-by-category__tooltip-rows">
                        <div className="spending-by-category__tooltip-row">
                          <span className="spending-by-category__tooltip-label">
                            Amount
                          </span>
                          <span className="spending-by-category__tooltip-value">
                            R
                            {data.amount.toLocaleString('en-ZA', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </span>
                        </div>
                        <div className="spending-by-category__tooltip-row">
                          <span className="spending-by-category__tooltip-label">
                            Percentage
                          </span>
                          <span className="spending-by-category__tooltip-value spending-by-category__tooltip-value--accent">
                            {data.percentage}%
                          </span>
                        </div>
                        <div className="spending-by-category__tooltip-row">
                          <span className="spending-by-category__tooltip-label">
                            Transactions
                          </span>
                          <span className="spending-by-category__tooltip-value spending-by-category__tooltip-value--muted">
                            {data.transactionCount}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }}
              />
              <Pie
                data={categoryData.categories}
                dataKey="amount"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={105}
                paddingAngle={2}
                strokeWidth={0}
                onMouseEnter={(_, index: number) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                {categoryData.categories.map((category: CategoryData, index: number) => (
                  <Cell
                    key={category.name}
                    fill={category.color}
                    style={{
                      filter: activeIndex === index ? `url(#shadow-${index})` : 'none',
                      transform: activeIndex === index ? 'scale(1.05)' : 'scale(1)',
                      transformOrigin: 'center',
                      transition: 'all 0.2s ease-in-out',
                      cursor: 'pointer',
                    }}
                    opacity={activeIndex === null || activeIndex === index ? 1 : 0.6}
                  />
                ))}
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) - 8}
                            className="fill-gray-900 text-3xl font-bold"
                          >
                            R{(categoryData.totalAmount / 1000).toFixed(1)}k
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 18}
                            className="spending-by-category__total-label fill-gray-500"
                          >
                            Total Spent
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>

        <div className="spending-by-category__legend">
          {categoryData.categories.map((category: CategoryData, index: number) => (
            <div
              key={`${category.name}-${category.amount}`}
              className={`spending-by-category__legend-item ${
                activeIndex === index ? 'spending-by-category__legend-item--active' : ''
              }`}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              <div className="spending-by-category__legend-left">
                <div
                  className="spending-by-category__legend-dot"
                  style={{ backgroundColor: category.color }}
                />
                <div className="spending-by-category__legend-info">
                  <span className="spending-by-category__legend-name">
                    {category.name}
                  </span>
                  <span className="spending-by-category__legend-count">
                    {category.transactionCount} transactions
                  </span>
                </div>
              </div>
              <div className="spending-by-category__legend-right">
                <span className="spending-by-category__legend-percentage">
                  {category.percentage}%
                </span>
                <span className="spending-by-category__legend-amount">
                  R
                  {category.amount.toLocaleString('en-ZA', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
