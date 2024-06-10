import React, { useState } from 'react';

export default function Admin({ setSeconds, setIsActive }) {
  const [inputValue, setInputValue] = useState('');

  const handleSet = () => {
    setSeconds(Number(inputValue) * 60); // 
  };

  const handleStartStop = () => {
    setIsActive(prevState => !prevState); // 
  };

  const handleReset = () => {
    setSeconds(0); // 
  };

  return (
    <>
        <div className='admin-container'>
            <h1>Admin Panel</h1>
            <input type="number" value={inputValue} onChange={e => setInputValue(e.target.value)} placeholder='Dakika cinsinden süre giriniz' />
            <button onClick={handleSet}>Süreyi Ayarla</button>
            <button onClick={handleStartStop}>Başlat/Durdur</button>
            <button onClick={handleReset}>Süreyi Sıfırla</button>

        </div>
        <div className="student-list">
            <h2>Öğrenci Listesi</h2>
            <ul>
                <li>Öğrenci 1</li>
                <li>Öğrenci 2</li>
                <li>Öğrenci 3</li>
                <li>Öğrenci 4</li>
                <li>Öğrenci 1</li>
                <li>Öğrenci 2</li>
                <li>Öğrenci 3</li>
                <li>Öğrenci 4</li>
                <li>Öğrenci 1</li>
                <li>Öğrenci 2</li>
                <li>Öğrenci 3</li>
                <li>Öğrenci 4</li>
                <li>Öğrenci 1</li>
                <li>Öğrenci 2</li>
                <li>Öğrenci 3</li>
                <li>Öğrenci 4</li>
                <li>Öğrenci 1</li>
                <li>Öğrenci 2</li>
                <li>Öğrenci 3</li>
                <li>Öğrenci 4</li>
                <li>Öğrenci 1</li>
                <li>Öğrenci 2</li>
                <li>Öğrenci 3</li>
                <li>Öğrenci 4</li>
            </ul>
        </div>
    </>
  );
}