import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, PieChart, Pie } from 'recharts';
import { ClubMember } from '../types';

interface OverviewChartsProps {
  members: ClubMember[];
}

export const OverviewCharts: React.FC<OverviewChartsProps> = ({ members }) => {
  // Prepare data for trophy distribution
  const sortedMembers = [...members].sort((a, b) => b.trophies - a.trophies).slice(0, 10);
  const top10Data = sortedMembers.map(m => ({ name: m.name, trophies: m.trophies }));

  // Prepare data for roles
  const rolesCount = members.reduce((acc, curr) => {
    acc[curr.role] = (acc[curr.role] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const roleData = [
    { name: 'President', value: rolesCount.president || 0, color: '#EF4444' },
    { name: 'Vice Pres', value: rolesCount.vicePresident || 0, color: '#9B00FF' },
    { name: 'Senior', value: rolesCount.senior || 0, color: '#3B82F6' },
    { name: 'Member', value: rolesCount.member || 0, color: '#6B7280' },
  ].filter(d => d.value > 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Top 10 Trophies */}
      <div className="h-64 w-full">
        <h3 className="text-gray-400 text-sm uppercase tracking-widest mb-4 font-display">Top 10 Performers</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={top10Data}>
            <XAxis dataKey="name" hide />
            <Tooltip 
              contentStyle={{ backgroundColor: '#131522', borderColor: '#333', color: '#fff' }}
              itemStyle={{ color: '#fff' }}
              cursor={{ fill: 'rgba(255,255,255,0.05)' }}
            />
            <Bar dataKey="trophies" radius={[4, 4, 0, 0]}>
              {top10Data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={index < 3 ? '#FFC500' : '#007CFF'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Role Distribution */}
      <div className="h-64 w-full">
        <h3 className="text-gray-400 text-sm uppercase tracking-widest mb-4 font-display">Rank Distribution</h3>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={roleData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {roleData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
              ))}
            </Pie>
            <Tooltip 
               contentStyle={{ backgroundColor: '#131522', borderColor: '#333', color: '#fff' }}
               itemStyle={{ color: '#fff' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
