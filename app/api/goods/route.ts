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

    // First, get all categories
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('*');

    console.log('Categories:', categories);

    if (categoriesError) {
      console.error("Error fetching categories:", categoriesError);
      return NextResponse.json({ error: categoriesError.message }, { status: 500 });
    }

    // Then, get goods with pagination
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
    const { data: goods, error: goodsError, count } = await query;

    console.log('Goods:', goods);

    if (goodsError) {
      console.error("Error fetching goods:", goodsError);
      return NextResponse.json({ error: goodsError.message }, { status: 500 });
    }

    // Combine goods with their categories
    const goodsWithCategories = goods?.map(good => {
      const category = categories?.find(cat => cat.id === good.category_id);
      console.log('Matching category for good:', good.id, category);
      return {
        ...good,
        categories: category
      };
    });

    console.log('Combined data:', goodsWithCategories);

    return NextResponse.json({
      data: goodsWithCategories || [],
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Request body:', body);

    const { name, description, price, stock, category_id } = body;
    console.log('Extracted data:', { name, description, price, stock, category_id });

    const { data, error } = await supabase
      .from('goods')
      .insert({ 
        name, 
        description, 
        price, 
        stock, 
        category_id 
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating goods:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      data,
      message: "Goods created successfully" 
    }, { status: 201 });
  } catch (error) {
    console.error("Error in goods API:", error);
    return NextResponse.json({ 
      error: 'Failed to create goods',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await request.json();
    console.log('Request body:', body);

    const { name, description, price, stock, category_id } = body;
    console.log('Extracted data:', { name, description, price, stock, category_id });

    const { data, error } = await supabase
      .from('goods')
      .update({ 
        name, 
        description, 
        price, 
        stock, 
        category_id 
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error("Error updating goods:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      data,
      message: "Goods updated successfully"
    }, { status: 200 });
  } catch (error) {
    console.error("Error in goods API:", error);
    return NextResponse.json({ 
      error: 'Failed to update goods',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    const { data, error } = await supabase
      .from('goods')
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error("Error deleting goods:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      data,
      message: "Goods deleted successfully"
    }, { status: 200 });
  } catch (error) {
    console.error("Error in goods API:", error);
    return NextResponse.json({ 
      error: 'Failed to delete goods',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
