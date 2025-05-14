import { NextRequest, NextResponse } from "next/server";
import supabase from "@/utils/db";

export async function GET(request: NextRequest) {
    try {
        // Get query parameters
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');

        // Calculate offset
        const offset = (page - 1) * limit;

        // Build the query with pagination
        const { data, error, count } = await supabase
            .from('categories')
            .select('*', { count: 'exact' })
            .range(offset, offset + limit - 1);

        if (error) {
            throw error;
        }

        return NextResponse.json({
            data: data || [],
            count: count || 0,
            page,
            limit,
            totalPages: count ? Math.ceil(count / limit) : 0
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
        return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
    }
}