import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json([
    { id: 1, name: 'Haircut Premium', price: 50000, duration: '30 min' },
    { id: 2, name: 'Hair Washing & Styling', price: 30000, duration: '20 min' },
    { id: 3, name: 'Shaving', price: 20000, duration: '15 min' },
    { id: 4, name: 'Hair Coloring', price: 100000, duration: '60 min' }
  ]);
}
