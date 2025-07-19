import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, role, access } = await req.json();
    if (!name || !email || !password || !role || !access) {
      return NextResponse.json({ success: false, message: 'All fields are required.' }, { status: 400 });
    }
    // Check if user already exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ success: false, message: 'Email already registered.' }, { status: 409 });
    }
    // Hash password
    const password_hash = await bcrypt.hash(password, 10);
    // Create user
    const user = await prisma.user.create({
      data: {
        username: name,
        email,
        password_hash,
        role,
        access,
      },
    });
    return NextResponse.json({ success: true, user: { id: user.id, email: user.email, role: user.role } });
  } catch (err: any) {
    if (err.code === 'P2002' && err.meta?.target?.includes('User_username_key')) {
      return NextResponse.json({ success: false, message: 'Username already exists.' }, { status: 409 });
    }
    if (err.code === 'P2002' && err.meta?.target?.includes('User_email_key')) {
      return NextResponse.json({ success: false, message: 'Email already registered.' }, { status: 409 });
    }
    console.error('Signup error:', err);
    return NextResponse.json({ success: false, message: 'Signup failed.' }, { status: 500 });
  }
} 