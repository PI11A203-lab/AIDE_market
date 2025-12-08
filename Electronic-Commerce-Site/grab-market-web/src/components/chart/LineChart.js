import React from 'react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function LineChartComponent({ data, dataKey, name, stroke = '#1A1A1A', strokeWidth = 2 }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsLineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
        <XAxis dataKey="month" stroke="#6B7280" />
        <YAxis stroke="#6B7280" />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey={dataKey} stroke={stroke} strokeWidth={strokeWidth} name={name} />
      </RechartsLineChart>
    </ResponsiveContainer>
  );
}

