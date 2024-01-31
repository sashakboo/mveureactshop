import { createContext } from 'react';

export interface INotifyContext {
    basketCount: number,
    changeBasketCount: (count: number) => void,
    resetBasketCount: () => void
}

export const NotifyContext = createContext({
  basketCount: 0,
  changeBasketCount: () => {},
  resetBasketCount: () => {}
} as INotifyContext);