// services/cartService.ts

import axios from 'axios';
import BASE_URL from '@/app/config';
import { refreshToken } from '@/app/register/refresh';





export const updateCartItemQuantity = async (id: string, quantity: number) => {
  const url = `${BASE_URL}/api/cart-item/${id}/`; 

  let access = localStorage.getItem('access');

  try {
    await axios.patch(
      url,
      { quantity }, // ✅ faqat quantity yuboriladi
      {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      }
    );
    return true;
  } catch (err: any) {
    if (err.response && err.response.status === 401) {
      const newAccess = await refreshToken();
      if (!newAccess) {
        throw new Error('Sessiya tugadi');
      }

      await axios.patch(
        url,
        { quantity },
        {
          headers: {
            Authorization: `Bearer ${newAccess}`,
          },
        }
      );
      return true;
    } else {
      console.error(err);
      throw new Error('Miqdor yangilashda xatolik');
    }
  }
};



export const removeCartItem = async (id: string) => {
  const url = `${BASE_URL}/api/cart-item/${id}/remove/`;

  const access = localStorage.getItem('access');

  try {
    await axios.delete(url, {
      headers: {
        Authorization: `Bearer ${access}`,
      },
    });
    return true;
  } catch (err: any) {
    if (err.response && err.response.status === 401) {
      const newAccess = await refreshToken();
      if (!newAccess) {
        throw new Error('Sessiya tugadi');
      }

      await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${newAccess}`,
        },
      });
      return true;
    } else {
      console.error(err);
      throw new Error('Mahsulotni o‘chirishda xatolik');
    }
  }
};
