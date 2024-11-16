'use client';

import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Select } from '@/components/ui/dropdown';
import { Card } from '@/components/ui/card';
import { DateRangePicker } from '@/components/ui/date-picker';
import { format } from 'date-fns';

interface QuestChartProps {
  data?: QuestActivityData[];
}

interface QuestActivityData {
  date: string;
  completedQuests: number;
  totalReward: number;
}

const QuestChart: React.FC<QuestChartProps> = ({ data = [] }) => {
  const [timeRange, setTimeRange] = useState('week');
  const [filteredData, setFilteredData] = useState<QuestActivityData[]>([]);
  const [chartType, setChartType] = useState<'activity' | 'rewards'>('activity');
  const [dateRange, setDateRange] = useState<{
    from: Date;
    to: Date;
  }>({
    from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    to: new Date(),
  });

  // データのフィルタリング処理
  useEffect(() => {
    const filterData = () => {
      // 日付範囲でデータをフィルタリング
      const filtered = data.filter((item) => {
        const itemDate = new Date(item.date);
        return itemDate >= dateRange.from && itemDate <= dateRange.to;
      });
      setFilteredData(filtered);
    };

    filterData();
  }, [data, timeRange, dateRange]);

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">クエスト分析</h2>
        <div className="flex gap-4">
          <Select
            value={timeRange}
            onValueChange={(value) => setTimeRange(value)}
            options={[
              { label: '週間', value: 'week' },
              { label: '月間', value: 'month' },
              { label: '年間', value: 'year' },
            ]}
          />
          <Select
            value={chartType}
            onValueChange={(value: 'activity' | 'rewards') => setChartType(value)}
            options={[
              { label: '活動量', value: 'activity' },
              { label: '報酬', value: 'rewards' },
            ]}
          />
          <DateRangePicker
            from={dateRange.from}
            to={dateRange.to}
            onSelect={setDateRange}
          />
        </div>
      </div>

      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={filteredData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={(value) => format(new Date(value), 'MM/dd')}
            />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip
              formatter={(value, name) => {
                if (name === '完了クエスト数') return `${value}件`;
                if (name === '報酬') return `${value}G`;
                return value;
              }}
            />
            <Legend />
            {chartType === 'activity' && (
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="completedQuests"
                name="完了クエスト数"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
            )}
            {chartType === 'rewards' && (
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="totalReward"
                name="報酬"
                stroke="#82ca9d"
                activeDot={{ r: 8 }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default QuestChart;
npm install recharts