"use client";

import React from "react";
import * as FaIcons from "react-icons/fa";
import * as SiIcons from "react-icons/si";
import * as LuIcons from "react-icons/lu";

interface TechIconProps {
  name: string;
  className?: string;
  style?: React.CSSProperties;
}

export function TechIcon({ name, className, style }: TechIconProps) {
  if (!name) return null;

  let IconComponent: any = null;

  if (name.startsWith("Fa")) {
    IconComponent = (FaIcons as any)[name];
  } else if (name.startsWith("Si")) {
    IconComponent = (SiIcons as any)[name];
  } else if (name.startsWith("Lu")) {
    IconComponent = (LuIcons as any)[name];
  }

  if (!IconComponent) {
    IconComponent = (SiIcons as any)[name] || (FaIcons as any)[name];
  }

  if (!IconComponent) return null;

  return <IconComponent className={className} style={style} />;
}

export default TechIcon;
