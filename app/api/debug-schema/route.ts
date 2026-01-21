import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL
        const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

        if (!url || !key) {
            return NextResponse.json({ error: "Missing Env Vars", url: !!url, key: !!key }, { status: 500 })
        }

        const supabase = createClient(url, key)

        // Test simple select first
        const { data: simpleData, error: simpleError } = await supabase
            .from('products')
            .select('id')
            .limit(1)

        // Then test the relationship
        const { data, error } = await supabase
            .from("cart_items")
            .select("quantity, product:products(id, name, price)")
            .limit(1)

        return NextResponse.json({
            status: "Schema Check",
            simple_query: { data: simpleData, error: simpleError },
            relation_query: { data, error },
            env: {
                url: "Set",
                keyLength: key.length
            }
        })
    } catch (e: any) {
        console.error("Debug Schema Error:", e)
        return NextResponse.json({ error: e.message, stack: e.stack }, { status: 500 })
    }
}
