import { useEffect, useState } from 'react';

export function useCountdown({ initialDays = 0, initialHours = 0, initialMinutes = 0, initialSeconds = 0 }) {
    const [timeLeft, setTimeLeft] = useState({
        days: initialDays,
        hours: initialHours,
        minutes: initialMinutes,
        seconds: initialSeconds,
    });

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                let { days, hours, minutes, seconds } = prev;

                if (seconds > 0) {
                    seconds--;
                } else if (minutes > 0) {
                    minutes--;
                    seconds = 59;
                } else if (hours > 0) {
                    hours--;
                    minutes = 59;
                    seconds = 59;
                } else if (days > 0) {
                    days--;
                    hours = 23;
                    minutes = 59;
                    seconds = 59;
                } else {
                    clearInterval(timer); // stop if all reach 0
                }

                return { days, hours, minutes, seconds };
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return timeLeft;
}