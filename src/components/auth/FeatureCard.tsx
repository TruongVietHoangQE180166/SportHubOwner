// FeatureCard Component
import React from 'react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradientFrom: string;
  gradientTo: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  gradientFrom,
  gradientTo
}) => {
  return (
    <div className="group flex items-start space-x-4 p-6 lg:p-8 bg-gray-800/80 backdrop-blur-sm rounded-xl lg:rounded-2xl border border-gray-700/50 hover:border-green-500/50 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-xl hover:shadow-green-500/10">
      <div className={`w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-r ${gradientFrom} ${gradientTo} rounded-lg lg:rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:shadow-green-500/30 transition-all duration-300`}>
        {icon}
      </div>
      <div>
        <h3 className="font-bold text-white mb-2 text-base lg:text-lg group-hover:text-green-400 transition-colors duration-300">{title}</h3>
        <p className="text-gray-300 text-sm lg:text-base leading-relaxed">{description}</p>
      </div>
    </div>
  );
};

export default FeatureCard;