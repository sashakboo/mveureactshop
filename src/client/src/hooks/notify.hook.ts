import { useState } from 'react';

export const useNotify = () => {
  const [basketCount, setbasketCount] = useState(0);
  const changeBasketCount = (count: number) => {
    setbasketCount((b) => {
      return b + count;
    });
  }

  const resetBasketCount = () => {
    setbasketCount((c) => 0);
  }

  return { basketCount, changeBasketCount, resetBasketCount };
}