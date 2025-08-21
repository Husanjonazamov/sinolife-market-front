'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation';
import Header from '@/src/components/Header';
import BASE_URL from '../config';
import { useTranslations } from 'next-intl';

export default function SmsPage() {
  const router = useRouter();
  const [otp, setOtp] = useState(['', '', '', ''])
  const [error, setError] = useState('')
  const [expired, setExpired] = useState(false)
  const [timer, setTimer] = useState(60)
  const [success, setSuccess] = useState(false)
  const [isInvalid, setIsInvalid] = useState(false)

  const inputRefs = useRef<HTMLInputElement[]>([])
  const t = useTranslations("sinolife");
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value.replace(/\D/g, '')
    if (value.length <= 1) {
      const newOtp = [...otp]
      newOtp[index] = value
      setOtp(newOtp)
      setIsInvalid(false)

      if (value && index < 3) {
        inputRefs.current[index + 1]?.focus()
      }
    }
  }

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };


  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasteData = e.clipboardData.getData('text').slice(0, 4).split('')
    const newOtp = otp.map((_, i) => pasteData[i] || '')
    setOtp(newOtp)
    setIsInvalid(false)
    pasteData.forEach((char, i) => {
      if (inputRefs.current[i]) {
        inputRefs.current[i]!.value = char
      }
    })
  }

  const handleSubmit = async () => {
    const code = Number(otp.join(''));  
    const phone = Number(localStorage.getItem('phone'));
    console.log(phone, code)

    if (expired) {
      setError('⏱ Kod eskirgan. Iltimos, qayta yuboring.');
      return;
    }

    if (!phone || code.toString().length < 4) {
      setError('Iltimos, telefon raqam yoki kodni to‘liq kiriting.');
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/auth/confirm/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone, code }),
      });

      const data = await response.json();

      if (response.ok && data.status) {
        localStorage.setItem('access', data.data.token.access);
        localStorage.setItem('refresh', data.data.token.refresh);
        localStorage.setItem('first_name', data.data.token.first_name);

        setSuccess(true);
        router.push('/');
      } else {
        setError(data.detail || 'Kod noto‘g‘ri. Iltimos, qayta urinib ko‘ring.');
        setIsInvalid(true);
      }
    } catch (error) {
      console.error(error);
      setError('Tarmoqda xatolik yuz berdi.');
      setIsInvalid(true);
    }
  };


  const handleResend = () => {
    setOtp(['', '', '', ''])
    setError('')
    setExpired(false)
    setIsInvalid(false)
    setTimer(60)
    inputRefs.current[0]?.focus()
  }

  useEffect(() => {
    inputRefs.current[0]?.focus()
    setTimer(60)
    setExpired(false)
  }, [])

  useEffect(() => {
    if (!expired && timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(countdown)
            setExpired(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(countdown)
    }
  }, [expired])

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <main className="flex-grow flex items-center justify-center px-4 mt-10 mb-20">
        <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-sm">
          <h2 className="text-2xl font-bold text-center mb-4">{t("sms_verify")}</h2>
          <p className="text-center text-gray-600 mb-6">
            {t("enter_code")}
          </p>

          <div className="flex justify-center gap-4 mb-4">
            {otp.map((value, index) => (
              <input
                key={index}
                ref={(el) => {
                    inputRefs.current[index] = el!;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={value}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={handlePaste}
                disabled={success}
                className={`w-12 h-12 border mb-4 rounded-xl text-center text-xl font-medium focus:outline-none focus:ring-2
                  ${isInvalid ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'}
                  disabled:bg-gray-200`}
              />
            ))}
          </div>

          {error && <p className="text-red-600 text-center mb-3 text-sm">{error}</p>}

          {!success && (
            <>
              <button
                onClick={handleSubmit}
                className="w-full bg-green-600 text-white py-2 rounded-xl hover:bg-green-700 transition mb-2"
              >
                {t("submit")}
              </button>

              <p className="text-center text-sm text-gray-500 mb-2" suppressHydrationWarning={true}>
                {expired ? (
                  <span className="text-red-500">{t("code_expired")}</span>
                ) : (
                  <>
                    {t("code_expires_in").replace("{timer}", "")}
                    <b>{timer}</b> {t("oclock")}
                  </>
                )}
              </p>

              {expired && (
                <button
                  onClick={handleResend}
                  className="w-full bg-gray-200 text-gray-800 py-2 rounded-xl hover:bg-gray-300 transition"
                >
                  {t("resend_code")}
                </button>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  )
}
