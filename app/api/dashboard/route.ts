import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  const [userCount, productCount, customerCount, orderCount, revenue] = await Promise.all([
    prisma.user.count(),
    prisma.product.count(),
    prisma.customer.count(),
    prisma.order.count(),
    prisma.order.aggregate({ _sum: { amount: true } })
  ]);
  return NextResponse.json({
    users: userCount,
    products: productCount,
    customers: customerCount,
    orders: orderCount,
    revenue: revenue._sum.amount || 0
  });
} 