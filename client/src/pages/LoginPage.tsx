import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setError('');
    if (!username.trim() || !password.trim()) {
      setError('Podaj login i hasło');
      return;
    }

    try {
      const response = await axios.post(
        `https://TWOJ_BACKEND.onrender.com/auth/${mode}`,
        { username, password }
      );

      if (mode === 'login') {
        const { token } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('username', username);
        navigate('/rooms');
      } else {
        setMode('login');
        alert('Zarejestrowano. Możesz się zalogować.');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Błąd logowania/rejestracji');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded p-8 w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {mode === 'login' ? 'Zaloguj się' : 'Zarejestruj się'}
        </h2>

        <input
          className="mb-3 p-2 border rounded w-full"
          placeholder="Login"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="mb-3 p-2 border rounded w-full"
          type="password"
          placeholder="Hasło"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <div className="text-red-600 mb-3">{error}</div>}

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 mb-2"
        >
          {mode === 'login' ? 'Zaloguj' : 'Zarejestruj'}
        </button>

        <button
          className="text-sm text-blue-600 underline"
          onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
        >
          {mode === 'login' ? 'Nie masz konta? Zarejestruj się' : 'Masz konto? Zaloguj się'}
        </button>
      </div>
    </div>
  );
}