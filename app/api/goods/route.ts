import { NextRequest, NextResponse } from "next/server";
import supabase from "@/utils/db";

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const sortBy = searchParams.get('sortBy') || 'created_at';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Calculate offset
    const offset = (page - 1) * limit;

    // Build the query
    let query = supabase
      .from('goods')
      .select('*', { count: 'exact' });

    // Add search if provided
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }

    // Add sorting
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    // Add pagination
    query = query.range(offset, offset + limit - 1);

    // Execute query
    const { data, error, count } = await query;

    if (error) {
      console.error("Error fetching goods:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      data: data || [],
      count: count || 0,
      page,
      limit,
      totalPages: count ? Math.ceil(count / limit) : 0
    });
  } catch (error) {
    console.error('Error in goods API:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch goods',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
