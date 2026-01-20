import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!url || !key) {
            return NextResponse.json({
                error: "Missing Environment Variables",
                debug: {
                    hasUrl: !!url,
                    hasKey: !!key,
                },
            }, { status: 500 });
        }

        const supabase = createClient(url, key);

        const { data, error } = await supabase.from("products").select("*").limit(1);

        return NextResponse.json({
            status: error ? "Error" : "Success",
            env: {
                url: url,
                // Only show first 5 chars of key for security
                keyPrefix: key?.substring(0, 5) + "...",
            },
            dataLength: data?.length,
            error: error,
            firstItem: data?.[0],
        });
    } catch (e: any) {
        return NextResponse.json({
            status: "Exception",
            message: e.message,
            stack: e.stack,
        }, { status: 500 });
    }
}
