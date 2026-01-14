"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface CartItemData {
  id: number
  name: string
  price: number
  image_url?: string
  quantity?: number
}

interface CartContextType {
  cart: CartItemData[]
  wishlist: CartItemData[]
  cartTotal: number
  addToCart: (item: CartItemData) => void
  removeFromCart: (id: number) => void
  addToWishlist: (item: CartItemData) => void
  removeFromWishlist: (id: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItemData[]>([])
  const [wishlist, setWishlist] = useState<CartItemData[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    const savedWishlist = localStorage.getItem("wishlist")
    if (savedCart) setCart(JSON.parse(savedCart))
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist))
    setIsLoaded(true)
  }, [])

  // Save to localStorage whenever cart changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("cart", JSON.stringify(cart))
    }
  }, [cart, isLoaded])

  // Save to localStorage whenever wishlist changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("wishlist", JSON.stringify(wishlist))
    }
  }, [wishlist, isLoaded])

  const cartTotal = cart.reduce((total, item) => total + item.price, 0)

  const addToCart = (item: CartItemData) => {
    setCart((prevCart) => [...prevCart, { ...item, quantity: 1 }])
  }

  const removeFromCart = (id: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id))
  }

  const addToWishlist = (item: CartItemData) => {
    const exists = wishlist.some((w) => w.id === item.id)
    if (!exists) {
      setWishlist((prevWishlist) => [...prevWishlist, item])
    } else {
      setWishlist((prevWishlist) => prevWishlist.filter((w) => w.id !== item.id))
    }
  }

  const removeFromWishlist = (id: number) => {
    setWishlist((prevWishlist) => prevWishlist.filter((item) => item.id !== id))
  }

  const clearCart = () => {
    setCart([])
  }

  return (
    <CartContext.Provider
      value={{ cart, wishlist, cartTotal, addToCart, removeFromCart, addToWishlist, removeFromWishlist, clearCart }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
