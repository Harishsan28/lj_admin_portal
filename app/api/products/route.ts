import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs/promises';

const prisma = new PrismaClient();
const uploadDir = path.join(process.cwd(), 'public', 'uploads');

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const price = parseFloat(formData.get('price') as string);
  const stock = parseInt(formData.get('stock') as string, 10);
  const image = formData.get('image') as File;

  if (!name || !price || !image) {
    return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
  }

  // Ensure upload directory exists
  await fs.mkdir(uploadDir, { recursive: true });

  // Save image to /public/uploads
  const ext = image.name.split('.').pop();
  const fileName = `${Date.now()}_${Math.random().toString(36).substr(2, 6)}.${ext}`;
  const filePath = path.join(uploadDir, fileName);
  const arrayBuffer = await image.arrayBuffer();
  await fs.writeFile(filePath, Buffer.from(arrayBuffer));

  // Save product to DB
  const product = await prisma.product.create({
    data: {
      name,
      description,
      price,
      stock,
      imageUrl: `/uploads/${fileName}`,
    },
  });

  return NextResponse.json({ success: true, product });
}

export async function GET() {
  const products = await prisma.product.findMany({ orderBy: { id: 'desc' } });
  return NextResponse.json(products);
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ success: false, message: 'Product id is required' }, { status: 400 });
  }
  try {
    await prisma.product.delete({ where: { id: Number(id) } });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, message: 'Product not found or could not be deleted' }, { status: 404 });
  }
}

export async function PATCH(req: NextRequest) {
  const formData = await req.formData();
  const id = formData.get('id');
  if (!id) {
    return NextResponse.json({ success: false, message: 'Product id is required' }, { status: 400 });
  }
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const price = formData.get('price') ? parseFloat(formData.get('price') as string) : undefined;
  const stock = formData.get('stock') ? parseInt(formData.get('stock') as string, 10) : undefined;
  const image = formData.get('image') as File | null;

  let imageUrl: string | undefined = undefined;
  if (image && typeof image !== 'string') {
    // Save new image
    await fs.mkdir(uploadDir, { recursive: true });
    const ext = image.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substr(2, 6)}.${ext}`;
    const filePath = path.join(uploadDir, fileName);
    const arrayBuffer = await image.arrayBuffer();
    await fs.writeFile(filePath, Buffer.from(arrayBuffer));
    imageUrl = `/uploads/${fileName}`;
  }

  try {
    const updated = await prisma.product.update({
      where: { id: Number(id) },
      data: {
        name,
        description,
        price,
        stock,
        ...(imageUrl ? { imageUrl } : {}),
      },
    });
    return NextResponse.json({ success: true, product: updated });
  } catch (err) {
    return NextResponse.json({ success: false, message: 'Product not found or could not be updated' }, { status: 404 });
  }
} 