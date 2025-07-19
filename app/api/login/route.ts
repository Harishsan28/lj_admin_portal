import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  // Find user by username or email
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { username: username },
        { email: username }
      ]
    }
  });

  if (!user) {
    return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
  }

  
  // Use bcrypt to compare password
  const isValid = await bcrypt.compare(password, user.password_hash);
  if (!isValid) {
    return NextResponse.json({ success: false, message: 'Invalid password' }, { status: 401 });
  }

  // Success
  return NextResponse.json({
    success: true,
    user: { id: user.id, username: user.username, role: user.role, access: user.access }
  });
} 