export interface Product {
  id: number
  name: string
  description: string | null
  category: string
  price: number
  sku: string
  stock_quantity: number
  image_url: string | null
  created_at: string
  updated_at: string
}

export interface CartItem {
  id: number
  user_id: string
  product_id: number
  quantity: number
  created_at: string
  updated_at: string
  product?: Product
}

export interface Order {
  id: number
  user_id: string
  total_amount: number
  status: string
  stripe_payment_intent_id: string | null
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: number
  order_id: number
  product_id: number
  quantity: number
  price: number
  created_at: string
}
