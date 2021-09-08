import React, { createContext, useState } from 'react';

type WishListContextT = {
  wishList: string[];
  wishListLength: number;
  addToWishList: (productId: string) => void;
  removeFromWishList: (productId: string) => void;
  clearWishList: () => void;
};

export const WishListContext = createContext<WishListContextT>({
  wishList: [],
  wishListLength: 0,
  addToWishList: () => {},
  removeFromWishList: () => {},
  clearWishList: () => {},
});

export const WishListContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const storedWishList = localStorage.getItem('wishList');
  const initialState = storedWishList ? JSON.parse(storedWishList) : [];
  const [wishList, setWishList] = useState<string[]>(initialState);

  const wishListLength = wishList.length;

  const addToWishList = (productId: string) => {
    // Added only if not already included
    if (!wishList.includes(productId)) {
      const newWishList = [...wishList, productId];
      localStorage.setItem('wishList', JSON.stringify(newWishList));
      setWishList(newWishList);
    }
  };

  const removeFromWishList = (productId: string) => {
    const newWishList = wishList.filter((id) => id !== productId);
    localStorage.setItem('wishList', JSON.stringify(newWishList));
    setWishList(newWishList);
  };

  const clearWishList = () => {
    localStorage.removeItem('wishList');
    setWishList([]);
  };

  const wishListContext = {
    wishList,
    wishListLength,
    addToWishList,
    removeFromWishList,
    clearWishList,
  };

  return (
    <WishListContext.Provider value={wishListContext}>
      {children}
    </WishListContext.Provider>
  );
};
