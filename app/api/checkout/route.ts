import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { amount, productName, meters } = await req.json();

    // Mock Razorpay Order ID for Testing
    const mockOrderId = `order_mock_${Date.now()}`;

    return NextResponse.json({
      success: true,
      orderId: mockOrderId,
      amount: Math.round(amount * 100),
      currency: 'INR',
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}