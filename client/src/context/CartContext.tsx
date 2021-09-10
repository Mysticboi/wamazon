import React, { createContext, useState } from 'react';

type Product = {
  _id: string;
  productName: string;
  price: number;
  quantity: number;
  imgUrl: string;
};

type CartContextT = {
  cart: Product[];
  cartLength: number;
  totalPrice: number;
  addToCart: (
    productId: string,
    productName: string,
    imgUrl: string,
    quantity: number,
    price: number
  ) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
};

export const CartContext = createContext<CartContextT>({
  cart: [],
  cartLength: 0,
  totalPrice: 0,
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
});

export const CartContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const storedCart = localStorage.getItem('cart');
  const initialState = storedCart ? JSON.parse(storedCart) : [];
  const [cart, setCart] = useState<Product[]>(initialState);

  const cartLength = cart.length;

  const totalPrice = cart.reduce(
    (acc, { price, quantity }) => acc + price * quantity,
    0
  );

  const addToCart = (
    productId: string,
    productName: string,
    imgUrl: string,
    quantity: number,
    price: number
  ) => {
    const foundProduct = cart.find(({ _id }) => productId === _id);
    if (foundProduct) {
      updateQuantity(productId, quantity + foundProduct.quantity);
    } else {
      const newCart = [
        ...cart,
        { _id: productId, productName, imgUrl, quantity, price },
      ];
      localStorage.setItem('cart', JSON.stringify(newCart));
      setCart(newCart);
    }
  };

  const updateQuantity = (productId: string, quantity: number) => {
    // We create a new Cart and update the quantity of the already existing product
    const newCart = cart.map((product) =>
      product._id === productId ? { ...product, quantity } : { ...product }
    );
    localStorage.setItem('cart', JSON.stringify(newCart));
    setCart(newCart);
  };

  const removeFromCart = (productId: string) => {
    const newCart = cart.filter(({ _id }) => _id !== productId);
    localStorage.setItem('cart', JSON.stringify(newCart));
    setCart(newCart);
  };

  const clearCart = () => {
    localStorage.removeItem('cart');
    setCart([]);
  };

  const cartContext = {
    cart,
    cartLength,
    totalPrice,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
  };

  return (
    <CartContext.Provider value={cartContext}>{children}</CartContext.Provider>
  );
};
