import React from 'react';

export type PlanCode = 'basic' | 'pro' | 'enterprise';

interface PlanBadgeProps {
  planCode: PlanCode | string | null;
  className?: string;
}

export const PlanBadge: React.FC<PlanBadgeProps> = ({ planCode, className = '' }) => {
  if (!planCode) return null;

  const normalizedPlan = planCode.toLowerCase() as PlanCode;

  switch (normalizedPlan) {
    case 'basic':
      return (
        <span 
          className={`inline-flex items-center rounded-full bg-blue-100 text-blue-700 text-xs px-2.5 py-1 font-medium ${className}`}
          aria-label="Plano: Basic"
        >
          Basic
        </span>
      );

    case 'pro':
      return (
        <span 
          className={`inline-flex items-center rounded-full border border-yellow-500 text-yellow-700 text-xs px-2.5 py-1 font-medium bg-white ${className}`}
          aria-label="Plano: Pro"
        >
          Pro
        </span>
      );

    case 'enterprise':
      return (
        <span className={`relative inline-flex items-center rounded-full p-[2px] ${className}`} aria-label="Plano: Enterprise">
          <span className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-blue-300 animate-pulse"></span>
          <span className="relative rounded-full bg-white text-xs px-3 py-1 font-medium text-gray-900">
            Enterprise
          </span>
        </span>
      );

    default:
      return (
        <span 
          className={`inline-flex items-center rounded-full bg-gray-100 text-gray-700 text-xs px-2.5 py-1 font-medium ${className}`}
          aria-label={`Plano: ${planCode}`}
        >
          {planCode}
        </span>
      );
  }
};

export default PlanBadge;