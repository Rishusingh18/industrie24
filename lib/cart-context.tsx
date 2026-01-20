"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

export interface CartItemData {
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
  cartCount: number
  addToCart: (item: CartItemData) => void
  removeFromCart: (id: number) => void
  updateQuantity: (id: number, quantity: number) => void
  addToWishlist: (item: CartItemData) => void
  removeFromWishlist: (id: number) => void
  clearCart: () => void
  user: any // Expose user for debugging
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItemData[]>([])
  const [wishlist, setWishlist] = useState<CartItemData[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [user, setUser] = useState<any>(null)

  const supabase = createClient()

  // 1. Check for user session
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  // 2. Fetch data (DB if logged in, LocalStorage if not)
  useEffect(() => {
    const loadData = async () => {
      if (user) {
        // Fetch Cart
        const { data: cartData, error: cartError } = await supabase
          .from("cart_items")
          .select("quantity, product:products(id, name, price, image_url)")

        if (cartError) {
          console.error("Error fetching cart:", cartError)
          toast.error("Failed to sync cart: " + cartError.message)
        }
        if (cartData) {
          const formattedCart = cartData.map((item: any) => ({
            id: item.product.id,
            name: item.product.name,
            price: item.product.price,
            image_url: item.product.image_url,
            quantity: item.quantity
          }))
          setCart(formattedCart)
          if (formattedCart.length > 0) {
            toast.success(`Loaded ${formattedCart.length} items from cloud`)
          }
        } else {
          setCart([])
        }

        // Fetch Wishlist
        const { data: wishlistData, error: wishlistError } = await supabase
          .from("wishlist_items")
          .select("product:products(id, name, price, image_url)")

        if (wishlistError) {
          console.error("Error fetching wishlist:", wishlistError)
          toast.error("Failed to sync wishlist: " + wishlistError.message)
        }
        if (wishlistData) {
          const formattedWishlist = wishlistData.map((item: any) => ({
            id: item.product.id,
            name: item.product.name,
            price: item.product.price,
            image_url: item.product.image_url
          }))
          setWishlist(formattedWishlist)
        } else {
          setWishlist([])
        }
      } else {
        // Fallback to LocalStorage
        console.log("No user session found, using local storage")
        // toast("Debug: Not logged in - Using Local Storage") 
        // Commented out to avoid spam, but useful for initial debug. 
        // Actually, user said NO popup. So let's enable it once to be sure.
        toast.info("Debug: Not Logged In (Mobile Check)")

        const savedCart = localStorage.getItem("cart")
        const savedWishlist = localStorage.getItem("wishlist")
        if (savedCart) setCart(JSON.parse(savedCart))
        if (savedWishlist) setWishlist(JSON.parse(savedWishlist))
      }
      setIsLoaded(true)
    }

    loadData()
  }, [user])

  // 3. Save to localStorage ONLY if NOT logged in (to avoid stale overwrites)
  // Or keep it sync? Let's strictly separate: 
  // If user: DB is truth. If no user: LocalStorage is truth.
  useEffect(() => {
    if (isLoaded && !user) {
      localStorage.setItem("cart", JSON.stringify(cart))
    }
  }, [cart, isLoaded, user])

  useEffect(() => {
    if (isLoaded && !user) {
      localStorage.setItem("wishlist", JSON.stringify(wishlist))
    }
  }, [wishlist, isLoaded, user])


  const cartTotal = cart.reduce((total, item) => total + item.price * (item.quantity || 1), 0)
  const cartCount = cart.reduce((total, item) => total + (item.quantity || 1), 0)

  const addToCart = (item: CartItemData) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((i) => i.id === item.id)

      // Sync with DB
      if (user) {
        if (existingItem) {
          const newQty = (existingItem.quantity || 1) + 1
          supabase.from("cart_items")
            .update({ quantity: newQty })
            .eq("user_id", user.id)
            .eq("product_id", item.id)
            .then(({ error }) => { if (error) console.error("Update cart error:", error) })
        } else {
          supabase.from("cart_items")
            .insert({ user_id: user.id, product_id: item.id, quantity: 1 })
            .then(({ error }) => { if (error) console.error("Insert cart error:", error) })
        }
      }

      if (existingItem) {
        return prevCart.map((i) =>
          i.id === item.id ? { ...i, quantity: (i.quantity || 1) + 1 } : i
        )
      }
      return [...prevCart, { ...item, quantity: 1 }]
    })
  }

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id)
      return
    }

    // Sync with DB
    if (user) {
      supabase.from("cart_items").update({ quantity }).eq("user_id", user.id).eq("product_id", id).then()
    }

    setCart((prevCart) =>
      prevCart.map((item) => (item.id === id ? { ...item, quantity } : item))
    )
  }

  const removeFromCart = (id: number) => {
    if (user) {
      supabase.from("cart_items").delete().eq("user_id", user.id).eq("product_id", id).then()
    }
    setCart((prevCart) => prevCart.filter((item) => item.id !== id))
  }

  const addToWishlist = (item: CartItemData) => {
    const exists = wishlist.some((w) => w.id === item.id)
    if (!exists) {
      if (user) {
        supabase.from("wishlist_items").insert({ user_id: user.id, product_id: item.id }).then()
      }
      setWishlist((prevWishlist) => [...prevWishlist, item])
    } else {
      if (user) {
        supabase.from("wishlist_items").delete().eq("user_id", user.id).eq("product_id", item.id).then()
      }
      setWishlist((prevWishlist) => prevWishlist.filter((w) => w.id !== item.id))
    }
  }

  const removeFromWishlist = (id: number) => {
    if (user) {
      supabase.from("wishlist_items").delete().eq("user_id", user.id).eq("product_id", id).then()
    }
    setWishlist((prevWishlist) => prevWishlist.filter((item) => item.id !== id))
  }

  const clearCart = () => {
    if (user) {
      supabase.from("cart_items").delete().eq("user_id", user.id).then()
    }
    setCart([])
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        wishlist,
        cartTotal,
        cartCount,
        addToCart,
        removeFromCart,
        updateQuantity,
        addToWishlist,
        removeFromWishlist,
        clearCart,
        user,
      }}
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
