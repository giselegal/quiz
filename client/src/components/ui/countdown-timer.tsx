import React, { useEffect, useState } from 'react';

interface CountdownTimerProps {
  initialHours?: number;
  initialMinutes?: number;
  initialSeconds?: number;
  className?: string;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  initialHours = 2,
  initialMinutes = 59,
  initialSeconds = 59,
  className = ''
}) => {
  const [timer, setTimer] = useState({
    hours: initialHours,
    minutes: initialMinutes,
    seconds: initialSeconds
  });
  
  useEffect(() => {
    const countdownInterval = setInterval(() => {
      setTimer(prevTimer => {
        if (prevTimer.seconds > 0) {
          return { ...prevTimer, seconds: prevTimer.seconds - 1 };
        } else if (prevTimer.minutes > 0) {
          return { ...prevTimer, minutes: prevTimer.minutes - 1, seconds: 59 };
        } else if (prevTimer.hours > 0) {
          return { hours: prevTimer.hours - 1, minutes: 59, seconds: 59 };
        } else {
          // Reset timer when it reaches zero (to keep the offer "limited")
          return { hours: initialHours, minutes: initialMinutes, seconds: initialSeconds };
        }
      });
    }, 1000);
    
    return () => clearInterval(countdownInterval);
  }, [initialHours, initialMinutes, initialSeconds]);

  // Format numbers to always have two digits
  const formatTimeUnit = (unit: number) => unit.toString().padStart(2, '0');
  
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="flex gap-1 items-center">
        <div className="bg-[#432818] text-white px-2 py-1 rounded-md font-mono">
          {formatTimeUnit(timer.hours)}
        </div>
        <span className="text-[#D68047] font-bold">:</span>
        <div className="bg-[#432818] text-white px-2 py-1 rounded-md font-mono">
          {formatTimeUnit(timer.minutes)}
        </div>
        <span className="text-[#D68047] font-bold">:</span>
        <div className="bg-[#432818] text-white px-2 py-1 rounded-md font-mono">
          {formatTimeUnit(timer.seconds)}
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;
