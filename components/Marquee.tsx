"use client";

import { useEffect, useState } from "react";

const DEFAULT_ITEMS = [
  "Full Stack Development",
  "UI/UX Design",
  "API Integration",
  "Database Design",
  "Performance Optimization",
  "Mobile Responsive",
];

type MarqueeItem = { id: string; text: string; sortOrder: number };

export default function Marquee() {
  const [items, setItems] = useState(DEFAULT_ITEMS);

  useEffect(() => {
    fetch("/api/admin/marquee")
      .then((res) => res.json())
      .then((data: MarqueeItem[]) => {
        if (Array.isArray(data) && data.length > 0) {
          setItems(data.sort((a, b) => a.sortOrder - b.sortOrder).map((d) => d.text));
        }
      })
      .catch(() => {});
  }, []);

  const doubled = [...items, ...items];

  return (
    <div className="bg-brutal-black border-b-4 border-brutal-black overflow-hidden py-3">
      <div className="flex animate-marquee whitespace-nowrap">
        {doubled.map((item, i) => (
          <span key={i} className="flex items-center">
            <span className="font-mono font-bold text-sm uppercase tracking-widest text-brutal-yellow px-8">
              {item}
            </span>
            <span className="text-brutal-orange font-bold">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
