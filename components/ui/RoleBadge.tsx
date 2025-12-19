import React from 'react';

interface RoleBadgeProps {
  role: string;
}

export const RoleBadge: React.FC<RoleBadgeProps> = ({ role }) => {
  let colorClass = "";
  let label = "";

  switch (role) {
    case 'president':
      colorClass = "bg-red-500/20 text-red-300 border-red-500/50";
      label = "President";
      break;
    case 'vicePresident':
      colorClass = "bg-purple-500/20 text-purple-300 border-purple-500/50";
      label = "Vice Pres.";
      break;
    case 'senior':
      colorClass = "bg-blue-500/20 text-blue-300 border-blue-500/50";
      label = "Senior";
      break;
    default:
      colorClass = "bg-gray-500/20 text-gray-300 border-gray-500/50";
      label = "Member";
  }

  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium border ${colorClass} uppercase tracking-wider`}>
      {label}
    </span>
  );
};
