import { useEffect, useState } from 'react';
import Header from "./assets/components/Header.jsx";
import { Link } from "react-router-dom";
import { supabase } from "./supabase.js";

export default function StudentTaskList() {
  const [currentUser, setCurrentUser] = useState(null);
  const [students, setStudents] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [duration, setDuration] = useState(0); // Sayaç için süre
  const [timeLeft, setTimeLeft] = useState(null);
  const [intervalId, setIntervalId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCountdownActive, setIsCountdownActive] = useState(false);
  const [countdownId, setCountdownId] = useState(null); // Geri sayım ID'sini saklamak için

  useEffect(() => {
    getUser();
    getAllUsers();
    fetchLatestCountdown();
  }, []);

  useEffect(() => {
    if (allUsers.length > 0 && currentUser) {
      const currentUserData = allUsers.find(user => user.id === currentUser.id);
      if (currentUserData) {
        setCurrentUser(prev => ({ ...prev, ...currentUserData }));
      }
      filterStudents();
    }
  }, [allUsers]);

  useEffect(() => {
    if (timeLeft !== null && isCountdownActive) {
      const interval = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 0) {
            clearInterval(interval);
            setIsCountdownActive(false);
            alert('Geri sayım sona erdi!');
            return 0;
          }
          return prevTime - 1000;
        });
      }, 1000);

      setIntervalId(interval);
      return () => clearInterval(interval);
    }
  }, [timeLeft, isCountdownActive]);

  const getUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const getAllUsers = async () => {
    try {
      const { data, error } = await supabase
          .from('tasks')
          .select('*');

      if (error) {
        throw error;
      } else {
        setAllUsers(data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const filterStudents = () => {
    const studentData = allUsers.filter(student => student.isStudent === true);
    setStudents(studentData);
  };

  const completeUserById = async () => {
    try {
      const { data, error } = await supabase
          .from('tasks')
          .update({ isComplete: true })
          .eq('id', currentUser.id);

      if (error) {
        throw error;
      } else {
        console.log('User marked as completed:', data);
        await getAllUsers();
      }
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const resetAll = async () => {
    try {
      const { data, error } = await supabase
          .from('tasks')
          .update({ isComplete: false })
          .eq('isComplete', true)
          .select();

      if (error) {
        throw error;
      } else {
        console.log('All tasks reset:', data);
        await getAllUsers();
      }
    } catch (error) {
      console.error('Error resetting task status:', error);
    }
  };

  const startCountdown = async () => {
    if (duration > 10) {
      alert('Geri sayım süresi 10 dakikadan fazla olamaz.');
      return;
    }

    const startTime = new Date().toISOString();

    try {
      const { data, error } = await supabase
          .from('countdowns')
          .insert({ start_time: startTime, duration: duration })
          .select();

      if (error) {
        throw error;
      } else {
        console.log('Sayaç başarıyla başlatıldı:', data);
        setCountdownId(data[0].id); // Yeni oluşturulan geri sayımın ID'sini sakla
        fetchLatestCountdown(); // Veriyi tekrar çek
      }
    } catch (error) {
      console.error('Error starting countdown:', error);
    }
  };

  const fetchLatestCountdown = async () => {
    try {
      const { data, error } = await supabase
          .from('countdowns')
          .select('*')
          .order('start_time', { ascending: false })
          .limit(1);

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching countdown:', error);
      } else if (data && data.length > 0) {
        const startTime = new Date(data[0].start_time).getTime();
        const endTime = startTime + data[0].duration * 60 * 1000; // Dakika cinsinden saniyeye çevirme
        const now = new Date().getTime();
        const timeLeft = endTime - now;
        console.log('startTime:', startTime, 'endTime:', endTime, 'now:', now, 'timeLeft:', timeLeft);
        setTimeLeft(timeLeft > 0 ? timeLeft : 0);
        setIsCountdownActive(true); // Geri sayımın aktif olduğunu belirt
        setCountdownId(data[0].id); // En son geri sayımın ID'sini sakla
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching countdown:', error);
    }
  };

  const stopCountdown = () => {
    clearInterval(intervalId);
    setIsCountdownActive(false);
  };

  const resetCountdown = async () => {
    stopCountdown();
    setTimeLeft(null);

    try {
      if (countdownId) {
        const { error } = await supabase
            .from('countdowns')
            .delete()
            .eq('id', countdownId);

        if (error) {
          throw error;
        }
        setCountdownId(null); // Silinen geri sayımın ID'sini sıfırla
      }
    } catch (error) {
      console.error('Error resetting countdown:', error);
    }
  };

  const formatTime = (time) => {
    if (time === null || time < 0) return "0m 0s";
    const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((time % (1000 * 60)) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  return (
      <div className="app-container">
        <Header currentUser={currentUser} />

        <div className="countdown-container">
          {loading ? <p>Loading...</p> : <h1>Time Left: {formatTime(timeLeft)}</h1>}
          {currentUser?.isStudent ? (
              <div>
                <h2>Süreyi ayarlama yetkiniz yok</h2>
              </div>
          ) : (
              <div className="controls">
                <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="Set minutes"
                />
                <button onClick={startCountdown}>Start Countdown</button>
                <button onClick={stopCountdown} disabled={!isCountdownActive}>Stop Countdown</button>
                <button onClick={resetCountdown}>Reset Countdown</button>
              </div>
          )}
        </div>

        {currentUser?.isStudent ? (
            <button onClick={completeUserById}>Tamamla</button>
        ) : (
            <div>
              <button onClick={resetAll}>Reset</button>
            </div>
        )}

        {!currentUser && <p>Lütfen <Link to={'/'}>Giriş Yapınız!</Link> yapın</p>}

        <div className="students-container">
          {students.map(student => (
              <div key={student.id}>
                {student.name} - {student.isComplete ? 'Tamamlandı' : 'Tamamlanmadı'}
              </div>
          ))}
        </div>
      </div>
  );
}
