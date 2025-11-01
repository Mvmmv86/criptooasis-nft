import { useEffect, useState } from 'react';

export function useCountdown() {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    const [timeFinished, setTimeFinished] = useState(false);

    useEffect(() => {
        // const futureDate = new Date('2025-11-01T12:00:00');
        // const now = new Date();
        //
        // const timeRemaining = futureDate.getTime() - now;
        //
        // if (timeRemaining <= 0) {
        //     setTimeFinished(true);
        //
        //     return ;
        // }
        //
        // const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
        // const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        // const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        // const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

        // setTimeLeft({
        //     days,
        //     hours,
        //     minutes,
        //     seconds
        // });

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
                    setTimeFinished(true);
                    clearInterval(timer); // stop if all reach 0
                }

                return { days, hours, minutes, seconds };
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return {
        timeLeft,
        timeFinished
    };
}
