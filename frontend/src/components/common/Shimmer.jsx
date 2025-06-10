import React from 'react';

const Shimmer = ({ 
  width = 'w-full', 
  height = 'h-4', 
  className = '', 
  rounded = false 
}) => {
  return (
    <div 
      className={`
        ${width} ${height} ${className}
        bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 
        animate-pulse
        ${rounded ? 'rounded-full' : 'rounded'}
        relative overflow-hidden
        before:absolute before:inset-0
        before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent
        before:animate-[shimmer_2s_infinite]
        before:translate-x-[-100%]
      `}
    >
      <style>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
};

export default Shimmer;