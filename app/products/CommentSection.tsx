'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BASE_URL from '@/app/config';
import { toast } from 'react-toastify';
import { Send, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { refreshToken } from '../register/refresh';

interface User {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
}

interface Comment {
  id: number;
  user: User;
  product: number;
  message: string;
  rating?: number;
  created_at?: string;
}

interface CommentSectionProps {
  productId: number;
  initialComments: Comment[];
}

export default function CommentSection({ productId, initialComments }: CommentSectionProps) {
  const { t } = useLanguage();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [rating, setRating] = useState<number>(Number(localStorage.getItem('commentRating')) || 5);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [step, setStep] = useState(2);
  const [loading, setLoading] = useState(false);

  // Responsiv step update
  useEffect(() => {
    const handleResize = () => setStep(window.innerWidth < 640 ? 1 : 2);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Initial comments bilan ishlash
  useEffect(() => {
    const commentsWithRating = initialComments.map(c => ({
      ...c,
      rating: c.rating ?? 5
    }));
    setComments(commentsWithRating);
  }, [initialComments]);

  useEffect(() => {
    localStorage.setItem('commentRating', String(rating));
  }, [rating]);

  const getInitials = (user: User) => {
    const name = user.first_name || user.username;
    return name.charAt(0).toUpperCase();
  };

  const handleAddComment = async () => {
    const access = localStorage.getItem('access');
    if (!access) return toast.error(t('login_required'));
    if (!newComment.trim()) return toast.error(t('empty_comment'));
    if (rating === 0) return toast.error(t('rating_required'));

    setLoading(true);

    const sendComment = async (token: string) => {
      try {
        const res = await axios.post(
          `${BASE_URL}/api/comment/`,
          { product: productId, message: newComment, rating },
          { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
        );

        if (res.data && res.data.status && res.data.data) {
          const newC: Comment = { ...res.data.data, rating };

          setComments(prev => {
            const updated = [...prev, newC];
            setCurrentIndex(updated.length > step ? updated.length - step : 0);
            return updated;
          });

          setNewComment('');
          setRating(Number(localStorage.getItem('commentRating')) || 5);
          toast.success(t('comment_added'));
        } else {
          toast.error(t('comment_error'));
        }
      } catch (err: any) {
        console.error('Comment xatosi:', err.response?.data || err);
        if (err.response?.status === 401) {
          const newAccess = await refreshToken();
          if (newAccess) await sendComment(newAccess);
        } else {
          toast.error(err.response?.data?.detail || t('comment_error'));
        }
      } finally {
        setLoading(false);
      }
    };

    await sendComment(access);
  };

  // Carousel navigatsiya
  const nextSlide = () => setCurrentIndex(prev => Math.min(prev + step, Math.max(0, comments.length - step)));
  const prevSlide = () => setCurrentIndex(prev => Math.max(prev - step, 0));

  const renderStars = (value: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={20}
        className={i < value ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
      />
    ));

  return (
    <div className="mt-6 w-full p-4 sm:p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-900">{t('comments')}</h2>

      {/* Carousel */}
      <div className="relative overflow-hidden">
        {comments.length > 0 ? (
          <div
            className="flex transition-transform duration-300 ease-out gap-4"
            style={{ transform: `translateX(-${currentIndex * (100 / step)}%)` }}
          >
            {comments.map(c => (
              <div
                key={c.id}
                className="flex-none w-full sm:w-1/2 p-4 border border-gray-200 rounded-xl shadow-md flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-violet-100 text-[#16a34a] flex items-center justify-center text-lg font-semibold">
                      {getInitials(c.user)}
                    </div>
                    <p className="text-base font-medium text-gray-900">
                      {c.user.first_name || c.user.username}
                    </p>
                  </div>
                  {c.rating && (
                    <div className="flex items-center gap-2">
                      <div className="flex">{renderStars(c.rating)}</div>
                      <span className="text-sm text-gray-600">{c.rating}/5</span>
                    </div>
                  )}
                </div>
                <p className="text-gray-700 text-base leading-relaxed">{c.message}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-6 text-base">{t('no_comments')}</p>
        )}

        {comments.length > step && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white text-gray-600 p-3 rounded-full hover:bg-gray-100 transition-colors duration-200 z-10"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white text-gray-600 p-3 rounded-full hover:bg-gray-100 transition-colors duration-200 z-10"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}
      </div>

      {/* Yangi comment yozish */}
      <div className="mt-6">
        <div className="flex gap-2 mb-3">
          {[1, 2, 3, 4, 5].map(star => (
            <Star
              key={star}
              size={26}
              className={`cursor-pointer transition-colors duration-200 ${
                star <= (hoveredRating || rating)
                  ? 'text-yellow-400 fill-yellow-400'
                  : 'text-gray-300'
              }`}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
            />
          ))}
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <textarea
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            placeholder={t('write_comment')}
            className="flex-1 border border-gray-200 rounded-lg px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all duration-200 min-h-[120px] text-base"
            rows={4}
          />
          <button
            onClick={handleAddComment}
            disabled={loading}
            className={`bg-green-600 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-green-800 transition-colors duration-200 sm:self-end sm:w-auto ${
              loading ? 'opacity-60 cursor-not-allowed' : ''
            }`}
          >
            <Send size={18} /> {loading ? t('sending') : t('send')}
          </button>
        </div>
      </div>
    </div>
  );
}
