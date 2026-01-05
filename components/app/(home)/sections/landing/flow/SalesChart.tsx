import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan 1', sales: 40 },
  { name: 'Jan 8', sales: 55 },
  { name: 'Jan 15', sales: 45 },
  { name: 'Jan 22', sales: 80 },
  { name: 'Jan 29', sales: 70 },
  { name: 'Feb 5', sales: 110 },
  { name: 'Feb 12', sales: 130 },
  { name: 'Feb 19', sales: 120 },
  { name: 'Feb 26', sales: 160 },
  { name: 'Mar 5', sales: 140 },
  { name: 'Mar 12', sales: 190 },
  { name: 'Mar 19', sales: 220 },
];

export const SalesChart: React.FC = () => {
  return (
    <div className="w-full h-full">
      <h3 className="text-xl font-bold text-slate-800 mb-1">$15.8M <span className="text-sm font-normal text-slate-500">Sales</span></h3>
      <div className="flex gap-4 text-xs text-slate-400 mb-6 border-b border-border-muted pb-2">
        <span>Content</span>
        <span>Territory</span>
        <span className="text-blue-500 font-medium">Device</span>
        <span>Category</span>
      </div>
      
      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fill: '#94a3b8' }} 
              interval={3}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fill: '#94a3b8' }}
              tickFormatter={(value) => `${value}k`} 
            />
            <Tooltip 
              contentStyle={{ background: '#fff', border: 'none', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Area 
              type="monotone" 
              dataKey="sales" 
              stroke="#3b82f6" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorSales)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

