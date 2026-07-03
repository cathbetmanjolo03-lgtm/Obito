import React from "react";

interface CrestProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function Crest({ className = "", size = "md" }: CrestProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-16 h-16",
    lg: "w-28 h-28"
  };

  return (
    <div id="gmh-crest-container" className={`relative flex items-center justify-center ${className}`}>
      {/* Outer abstract modern shield */}
      <svg
        id="gmh-crest-svg"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${sizeClasses[size]} transition-all duration-500`}
      >
        {/* Background Shield/Circle glow */}
        <circle cx="50" cy="50" r="46" className="stroke-emerald-950/20 fill-emerald-950/5" strokeWidth="2" />
        
        {/* Modern geometric triangles (Rain clouds and water canopy) */}
        <path
          d="M30 35 L50 15 L70 35 Z"
          className="fill-emerald-800/20 stroke-emerald-600"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        
        {/* Growing Pine/Timber line (Abstract arrow pointing up) */}
        <path
          d="M50 80 L50 25 M50 25 L35 45 M50 25 L65 45 M50 45 L38 60 M50 45 L62 60"
          className="stroke-emerald-500"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Agricultural waves/furrows (Farming & Rain droplets) */}
        <path
          d="M25 65 Q37 60 50 65 T75 65"
          className="stroke-amber-500"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M25 73 Q37 68 50 73 T75 73"
          className="stroke-amber-600/60"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Wealth / Actuarial gold circles */}
        <circle cx="50" cy="15" r="3" className="fill-amber-400 animate-pulse" />
        <circle cx="30" cy="35" r="2.5" className="fill-emerald-400" />
        <circle cx="70" cy="35" r="2.5" className="fill-emerald-400" />
      </svg>
    </div>
  );
}
