import { NextRequest, NextResponse } from "next/server";
import supabase from "@/utils/db";

export async function GET(request: NextRequest) {
    try {
        // Get query parameters
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const search = searchParams.get('search') || '';

        // Calculate offset
        const offset = (page - 1) * limit;

        // Build the query with pagination
        let query = supabase
            .from('customers')
            .select('*', { count: 'exact' });

        // Add search if provided
        if (search) {
            query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`);
        }

        // Add pagination
        query = query.range(offset, offset + limit - 1);

        const { data, error, count } = await query;

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
        console.error('Error fetching customers:', error);
        return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 });
    }
}