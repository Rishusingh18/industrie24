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
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user)
      } else {
        setUser(null)
        // Clear cart and wishlist if user logs out
        setCart([])
        setWishlist([])
        localStorage.removeItem("cart")
        localStorage.removeItem("wishlist")
      }
    })

    // Initial check for session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user)
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  // 2. Fetch data
  useEffect(() => {
    const loadData = async () => {
      // Always load from LocalStorage first for immediate UI feedback (cache)
      const savedCart = localStorage.getItem("cart")
      const savedWishlist = localStorage.getItem("wishlist")

      let initialCart = []
      let initialWishlist = []

      if (savedCart) {
        try {
          initialCart = JSON.parse(savedCart)
          setCart(initialCart)
        } catch (e) {
          console.error("Failed to parse cart from LS", e)
        }
      }

      if (savedWishlist) {
        try {
          initialWishlist = JSON.parse(savedWishlist)
          setWishlist(initialWishlist)
        } catch (e) {
          console.error("Failed to parse wishlist from LS", e)
        }
      }

      // If user is logged in, sync/fetch from DB
      if (user) {
        // Fetch Cart
        const { data: cartData, error: cartError } = await supabase
          .from("cart_items")
          .select("quantity, product:products(id, name, price, image_url)")

        if (cartError) {
          console.error("Error fetching cart:", cartError)
          toast.error("Failed to sync cart: " + cartError.message)
        } else if (cartData && cartData.length > 0) {
          // DB has data, use it (server authority)
          const formattedCart = cartData.map((item: any) => ({
            id: item.product.id,
            name: item.product.name,
            price: item.product.price,
            image_url: item.product.image_url,
            quantity: item.quantity
          }))
          setCart(formattedCart)
          // Note: formattedCart will be saved to LS by the other useEffect
        } else if (initialCart.length > 0) {
          // DB is empty but LS has items.
          // PRESERVE local items instead of clearing them.
          // Ideally, we would sync these to the DB here.
          // For now, we just keep them so the user doesn't lose data on refresh.
          console.log("Preserving local cart items despite empty DB")
        }

        // Fetch Wishlist
        const { data: wishlistData, error: wishlistError } = await supabase
          .from("wishlist_items")
          .select("product:products(id, name, price, image_url)")

        if (wishlistError) {
          console.error("Error fetching wishlist:", wishlistError)
        } else if (wishlistData && wishlistData.length > 0) {
          const formattedWishlist = wishlistData.map((item: any) => ({
            id: item.product.id,
            name: item.product.name,
            price: item.product.price,
            image_url: item.product.image_url
          }))
          setWishlist(formattedWishlist)
        } else if (wishlistData) {
          // Preserve local wishlist logic same as cart
          if (initialWishlist.length > 0) {
            console.log("Preserving local wishlist items despite empty DB")
          } else {
            setWishlist([])
          }
        }
      }

      setIsLoaded(true)
    }

    loadData()
  }, [user])

  // 3. Save to localStorage ALWAYS (as a cache/backup)
  // This ensures that on refresh (when user is initially null), we have data to show.
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("cart", JSON.stringify(cart))
    }
  }, [cart, isLoaded])

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("wishlist", JSON.stringify(wishlist))
    }
  }, [wishlist, isLoaded])


  const cartTotal = cart.reduce((total, item) => total + item.price * (item.quantity || 1), 0)
  const cartCount = cart.reduce((total, item) => total + (item.quantity || 1), 0)

  const addToCart = (item: CartItemData) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((i) => i.id === item.id)

      // Sync with DB
      if (user) {
        // Optimistically calculate new quantity
        const newQty = existingItem ? (existingItem.quantity || 1) + 1 : 1

        // Use upsert to handle both insert and update cases reliably
        supabase.from("cart_items")
          .upsert(
            {
              user_id: user.id,
              product_id: item.id,
              quantity: newQty
            },
            { onConflict: 'user_id, product_id' }
          )
          .then(({ error }) => {
            if (error) {
              console.error("Cart sync error:", JSON.stringify(error, null, 2))
              toast.error("Failed to sync cart: " + (error.message || "Unknown error"))
            }
          })
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
