"use client";
import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer } from "recharts";

const Charts = ({
  data: { salesData },
}: {
  data: { salesData: { month: string; totalSales: number }[] };
}) => {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={salesData}>
        <XAxis
          dataKey="month"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Bar dataKey="totalSales" fill="#C8E6C9" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default Charts;
