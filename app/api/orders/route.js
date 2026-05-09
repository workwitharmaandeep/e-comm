import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import pool from '@/lib/db';

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    const {
      personalInfo,
      deliveryAddress,
      orderNotes,
      cartItems,
      totalAmount,
      paymentMethod,
      paymentStatus,
      orderStatus,
    } = await req.json();

    // Validate required fields
    if (!personalInfo || !deliveryAddress || !cartItems || !totalAmount) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create order in database
    const [result] = await pool.query(
      `INSERT INTO orders (
        user_email, 
        user_phone, 
        first_name, 
        last_name, 
        delivery_address, 
        city, 
        state, 
        zip_code, 
        country, 
        total_amount, 
        payment_method, 
        payment_status, 
        order_status, 
        order_notes, 
        cart_items,
        created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        personalInfo.email,
        personalInfo.phone,
        personalInfo.firstName,
        personalInfo.lastName,
        deliveryAddress.address,
        deliveryAddress.city,
        deliveryAddress.state,
        deliveryAddress.zipCode,
        deliveryAddress.country,
        totalAmount,
        paymentMethod,
        paymentStatus,
        orderStatus,
        orderNotes || null,
        JSON.stringify(cartItems),
      ]
    );

    return Response.json(
      {
        message: 'Order created successfully',
        orderId: result.insertId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating order:', error);
    return Response.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    // Use email if it exists, fallback to phone
    const identifier = session.user.email || session.user.phone;

    const [orders] = await pool.query(
      'SELECT id, total_amount, order_status, payment_status, created_at FROM orders WHERE user_email = ? OR user_phone = ? ORDER BY created_at DESC',
      [identifier, identifier]
    );

    return Response.json({ orders }, { status: 200 });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return Response.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
