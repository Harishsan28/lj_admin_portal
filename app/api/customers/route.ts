import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  const customers = await prisma.customer.findMany({
    include: {
      orders: true,
    },
    orderBy: { id: 'desc' },
  });
  return NextResponse.json(customers);
}

export async function POST(req: NextRequest) {
  try {
    const { name, address, phone, email, orders, customerId, order } = await req.json();
    // Add new order for a customer
    if (customerId && order) {
      if (!order.orderId || !order.date || !order.amount || !order.status) {
        return NextResponse.json({ success: false, message: 'All order fields are required.' }, { status: 400 });
      }
      const newOrder = await prisma.order.create({
        data: {
          orderId: order.orderId,
          date: new Date(order.date),
          amount: order.amount,
          status: order.status,
          customerId: customerId,
        },
      });
      return NextResponse.json({ success: true, order: newOrder });
    }
    if (!name || !address || !phone || !email) {
      return NextResponse.json({ success: false, message: 'All fields are required.' }, { status: 400 });
    }
    const customer = await prisma.customer.create({
      data: {
        name,
        address,
        phone,
        email,
        orders: orders && Array.isArray(orders) ? {
          create: orders.map((o: any) => ({
            orderId: o.orderId,
            date: new Date(o.date),
            amount: o.amount,
            status: o.status,
          }))
        } : undefined,
      },
      include: { orders: true },
    });
    return NextResponse.json({ success: true, customer });
  } catch (err: any) {
    if (err.code === 'P2002' && err.meta?.target?.includes('Customer_email_key')) {
      return NextResponse.json({ success: false, message: 'Email already exists.' }, { status: 409 });
    }
    if (err.code === 'P2002' && err.meta?.target?.includes('Order_orderId_key')) {
      return NextResponse.json({ success: false, message: 'Order ID already exists.' }, { status: 409 });
    }
    console.error('Customer create error:', err);
    return NextResponse.json({ success: false, message: 'Failed to create customer/order.' }, { status: 500 });
  }
} 