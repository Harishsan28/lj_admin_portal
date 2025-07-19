import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  const users = await prisma.user.findMany({ orderBy: { id: 'desc' } });
  return NextResponse.json(users);
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, role, access } = await req.json();
    if (!id || !role || !access) {
      return NextResponse.json({ success: false, message: 'All fields are required.' }, { status: 400 });
    }
    const user = await prisma.user.update({
      where: { id: Number(id) },
      data: { role, access },
    });
    return NextResponse.json({ success: true, user });
  } catch (err) {
    return NextResponse.json({ success: false, message: 'Failed to update user.' }, { status: 500 });
  }
} 