'use client';
import React, { useRef, useState } from 'react';
import axios from 'axios';
import BASE_URL from '../config';



const SMSCodeInput = ({ phone }: { phone: number }) => {
  const [code, setCode] = useState(['', '', '', '']);
  const inputs = useRef<HTMLInputElement[]>([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 3) {
      inputs.current[index + 1]?.focus();
    }

    if (newCode.every(char => char.length === 1)) {
      const finalCode = newCode.join('');
      sendCode(finalCode);
    }
  };

  const sendCode = async (finalCode: string) => {
    setLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/auth/confirm/`, {
        phone,
        code: parseInt(finalCode),
      });

      const data = res.data;
      if (data.status === true) {
        console.log('Tasdiqlandi:', data.data.token);
        // tokenni saqlash (cookie/localStorage), keyin navigatsiya qilish:
        localStorage.setItem('access', data.data.token.access);
        localStorage.setItem('refresh', data.data.token.refresh);
        alert(`Xush kelibsiz, ${data.data.token.first_name}!`);
        // navigatsiya:
        // router.push('/dashboard');
      } else {
        alert(data.data.detail || 'Xato yuz berdi');
      }
    } catch (error: any) {
      console.error('Xatolik:', error.response?.data || error.message);
      alert('Kod noto‘g‘ri yoki vaqt tugagan');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">SMS Kodingizni kiriting</h1>
      <div className="flex space-x-2">
        {[0, 1, 2, 3].map((i) => (
          <input
            key={i}
            ref={(el) => (inputs.current[i] = el!)}
            type="text"
            maxLength={1}
            value={code[i]}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            className="w-12 h-12 text-center text-xl border border-gray-300 rounded"
          />
        ))}
      </div>
      {loading && <p className="mt-4 text-blue-500">Tekshirilmoqda...</p>}
    </div>
  );
};

export default SMSCodeInput;
