import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function DELETE(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');

    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid authorization header.' },
        { status: 401 }
      );
    }

    const accessToken = authHeader.replace('Bearer ', '').trim();

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        { error: 'Server environment variables are not configured correctly.' },
        { status: 500 }
      );
    }

    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    const {
      data: { user },
      error: userError,
    } = await adminClient.auth.getUser(accessToken);

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unable to authenticate user.' },
        { status: 401 }
      );
    }

    const { error: deleteError } = await adminClient.auth.admin.deleteUser(user.id);

    if (deleteError) {
      console.error('Auth user delete error:', deleteError);

      return NextResponse.json(
        { error: deleteError.message || 'Failed to delete user account.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Unexpected delete account route error:', error);

    return NextResponse.json(
      { error: 'An unexpected error occurred while deleting the account.' },
      { status: 500 }
    );
  }
}