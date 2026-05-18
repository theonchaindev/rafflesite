import { useEffect, useState } from "react";

interface Props {
  drawDate: string | Date;
  compact?: boolean;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  expired: boolean;
}

function getTimeLeft(drawDate: string | Date): TimeLeft {
  const diff = new Date(drawDate).getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  return { days, hours, minutes, seconds, expired: false };
}

export default function CountdownTimer({ drawDate, compact }: Props) {
  const [time, setTime] = useState<TimeLeft>(() => getTimeLeft(drawDate));

  useEffect(() => {
    const interval = setInterval(() => setTime(getTimeLeft(drawDate)), 1000);
    return () => clearInterval(interval);
  }, [drawDate]);

  if (time.expired) {
    return (
      <span style={{ color: "#e74c3c", fontSize: compact ? "12px" : "13px", fontWeight: 600 }}>
        Draw Completed
      </span>
    );
  }

  if (compact) {
    return (
      <span style={{ color: "#c9a84c", fontSize: "12px", fontWeight: 500 }}>
        {time.days}d {time.hours}h {time.minutes}m
      </span>
    );
  }

  const units = [
    { label: "Days", value: time.days },
    { label: "Hours", value: time.hours },
    { label: "Mins", value: time.minutes },
    { label: "Secs", value: time.seconds },
  ];

  return (
    <div className="flex gap-2">
      {units.map(({ label, value }) => (
        <div key={label} className="countdown-box">
          <div style={{ fontSize: "20px", fontWeight: 700, color: "#c9a84c", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
            {String(value).padStart(2, "0")}
          </div>
          <div style={{ fontSize: "10px", color: "#888", textTransform: "uppercase", letterSpacing: "0.5px", marginTop: "3px" }}>
            {label}
          </div>
        </div>
      ))}
    </div>
  );
}
