"use client";

import { useState, useEffect } from "react";

interface Hours {
  day: string;
  open?: string;
  close?: string;
}

interface OpenNowBadgeProps {
  hours: Hours[];
}

export default function OpenNowBadge({ hours }: OpenNowBadgeProps) {
  const [status, setStatus] = useState<{ isOpen: boolean; message: string; color: string }>({
    isOpen: false,
    message: "",
    color: "text-slate-500",
  });

  useEffect(() => {
    const checkStatus = () => {
      const now = new Date();
      const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const today = dayNames[now.getDay()];
      const currentHour = now.getHours();
      const currentMinutes = now.getMinutes();
      const currentTime = currentHour * 60 + currentMinutes;

      const todayHours = hours.find(h => h.day === today);

      if (!todayHours || !todayHours.open || !todayHours.close) {
        setStatus({ isOpen: false, message: "Closed today", color: "text-red-600" });
        return;
      }

      const [openHour, openMin] = todayHours.open.split(":").map(Number);
      const [closeHour, closeMin] = todayHours.close.split(":").map(Number);
      const openTime = openHour * 60 + openMin;
      const closeTime = closeHour * 60 + closeMin;

      if (currentTime >= openTime && currentTime < closeTime) {
        const closingIn = closeTime - currentTime;
        const hoursLeft = Math.floor(closingIn / 60);
        const minsLeft = closingIn % 60;
        
        let message = "Open now";
        if (hoursLeft > 0) {
          message += ` (Closes in ${hoursLeft}h ${minsLeft}m)`;
        } else if (minsLeft <= 30) {
          message += ` (Closing soon!)`;
        } else {
          message += ` (Until ${todayHours.close})`;
        }
        
        setStatus({ 
          isOpen: true, 
          message, 
          color: hoursLeft === 0 && minsLeft <= 30 ? "text-amber-600" : "text-green-600" 
        });
      } else if (currentTime < openTime) {
        const [openHour, openMin] = todayHours.open.split(":").map(Number);
        const openDate = new Date();
        openDate.setHours(openHour, openMin, 0);
        setStatus({ 
          isOpen: false, 
          message: `Opens at ${todayHours.open}`, 
          color: "text-slate-500" 
        });
      } else {
        setStatus({ 
          isOpen: false, 
          message: "Closed now", 
          color: "text-red-600" 
        });
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [hours]);

  return (
    <span className={`flex items-center gap-1 text-xs font-medium ${status.color}`}>
      <span className={`w-2 h-2 rounded-full ${status.isOpen ? "bg-green-500" : "bg-red-500"}`}></span>
      {status.message}
    </span>
  );
}