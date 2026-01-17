import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Find user by username
    const { data: user, error } = await (supabase
      .from('app_users') as any)
      .select('id, username, full_name, department, is_admin, password_hash')
      .eq('username', username.toLowerCase().trim())
      .single();

    if (error || !user) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    // Simple password check (in production, use proper hashing like bcrypt)
    if (user.password_hash !== password) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    // Return user without password hash
    const { password_hash, ...safeUser } = user;

    return NextResponse.json({ user: safeUser });
  } catch (e) {
    console.error('Login error:', e);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}
