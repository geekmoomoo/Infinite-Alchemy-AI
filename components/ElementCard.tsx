import React from "react";
import { Element, Rarity } from "../types";

interface ElementCardProps {
  element: Element;
  onClick?: () => void;
  selected?: boolean;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
}

const getRarityStyles = (rarity?: Rarity) => {
  switch (rarity) {
    case "LEGENDARY":
      return "border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.5)] bg-gradient-to-br from-yellow-900/80 to-yellow-600/80 text-yellow-100 ring-2 ring-yellow-400/50";
    case "EPIC":
      return "border-purple-400 shadow-[0_0_10px_rgba(192,132,252,0.4)] bg-gradient-to-br from-purple-900/80 to-purple-600/80 text-purple-100";
    case "RARE":
      return "border-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.3)] bg-gradient-to-br from-blue-900/80 to-blue-600/80 text-blue-100";
    case "CURSED":
      return "border-red-900 shadow-[0_0_15px_rgba(0,0,0,0.8)] bg-[conic-gradient(at_bottom_right,_var(--tw-gradient-stops))] from-red-900 via-black to-slate-900 text-red-500 font-chiller grayscale-[0.2]";
    case "MEME":
      return "border-pink-400 shadow-[0_0_10px_rgba(244,114,182,0.5)] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-pink-400/20 via-slate-900 to-slate-900 text-pink-300 animate-pulse-slow";
    case "COMMON":
    default:
      return "border-b-4"; // Default dynamic background handled in style prop
  }
};

const getRarityBadge = (rarity?: Rarity) => {
  switch (rarity) {
    case "LEGENDARY": return "👑";
    case "EPIC": return "✨";
    case "CURSED": return "☠️";
    case "MEME": return "🤪";
    default: return null;
  }
};

export const ElementCard: React.FC<ElementCardProps> = ({
  element,
  onClick,
  selected = false,
  disabled = false,
  size = "md",
}) => {
  const sizeClasses = {
    sm: "w-16 h-16 text-[10px]",
    md: "w-24 h-24 text-sm",
    lg: "w-32 h-32 text-base",
  };

  const emojiSizes = {
    sm: "text-2xl",
    md: "text-4xl",
    lg: "text-6xl",
  };

  const rarityClass = getRarityStyles(element.rarity);
  const badge = getRarityBadge(element.rarity);

  // Common items use the dynamic color logic, others use fixed gradients
  const useDynamicColor = !element.rarity || element.rarity === "COMMON";
  const hasImage = !!element.imageUrl;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative flex flex-col items-center justify-center
        rounded-2xl transition-all duration-200
        active:translate-y-1 active:border-b-0
        ${sizeClasses[size]}
        ${selected ? "ring-4 ring-white scale-105 z-10" : "hover:scale-105"}
        ${disabled ? "opacity-50 cursor-not-allowed grayscale" : (onClick ? "cursor-pointer" : "cursor-default")}
        ${rarityClass}
        animate-pop shadow-lg overflow-hidden
        ${hasImage ? 'p-0 border-0' : ''}
      `}
      style={useDynamicColor && !hasImage ? {
        backgroundColor: element.color,
        borderColor: adjustColor(element.color, -40),
        color: isLightColor(element.color) ? "#1e293b" : "#ffffff",
        borderBottomWidth: '4px'
      } : { borderBottomWidth: hasImage ? '0' : '4px' }}
    >
      {/* Background Image if available */}
      {hasImage && (
        <img 
          src={element.imageUrl} 
          alt={element.name} 
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
      )}
      
      {/* Overlay to ensure text readability on images */}
      {hasImage && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
      )}

      {/* Cursed Glitch Effect */}
      {element.rarity === "CURSED" && !hasImage && (
         <div className="absolute inset-0 bg-black opacity-20 mix-blend-overlay animate-pulse pointer-events-none"></div>
      )}

      {/* Rarity Badge (Top Left) */}
      {badge && (
        <span className="absolute top-1 left-1 text-[10px] filter drop-shadow-md z-20">
          {badge}
        </span>
      )}

      {/* Content - Show Emoji only if no image */}
      {!hasImage && (
        <span className={`${emojiSizes[size]} drop-shadow-md mb-1 z-10 relative`}>
          {element.emoji}
        </span>
      )}
      
      {/* Name - Ensure visibility on image */}
      <span className={`font-bold truncate w-full px-1 text-center leading-tight z-20 relative ${hasImage ? 'text-white mt-auto mb-2 text-shadow' : ''}`}>
        {element.name}
      </span>

      {element.isNew && (
        <span className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm animate-bounce z-30">
          NEW
        </span>
      )}
    </button>
  );
};

// Helper to darken border color
function adjustColor(color: string, amount: number) {
  return (
    "#" +
    color
      .replace(/^#/, "")
      .replace(/../g, (color) =>
        (
          "0" +
          Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)
        ).substr(-2)
      )
  );
}

// Helper for text contrast
function isLightColor(color: string) {
  const hex = color.replace("#", "");
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128;
}