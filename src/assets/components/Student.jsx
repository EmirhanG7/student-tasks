import React, { useState, useEffect } from 'react';

export default function Student({ initialSeconds, isActive }) {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    setSeconds(initialSeconds);
  }, [initialSeconds]);

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds(seconds => seconds > 0 ? seconds - 1 : 0);
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  useEffect(() => {
    if (seconds === 0) {
      alert('Süre bitti');
    }
  }, [seconds]);

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return (
    <div className="student-container">
        <h1>Geri Sayım</h1>
        <div className="time">{minutes} dakika {remainingSeconds} saniye</div>
    </div>
  );
}