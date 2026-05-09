import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import pool from '@/lib/db';

// Middleware to check admin access
async function checkAdminAccess(req) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return { authorized: false, error: 'Unauthorized' };
  }

  // Check if user is admin by email or phone number
  const adminEmails = process.env.ADMIN_EMAILS?.split(',').map(e => e.trim()) || [];
  const adminPhones = process.env.ADMIN_PHONE_NUMBERS?.split(',').map(p => p.trim()) || [];
  
  const isAdminByEmail = session.user.email && adminEmails.includes(session.user.email);
  const isAdminByPhone = session.user.phone && adminPhones.includes(session.user.phone);
  
  const isAdmin = isAdminByEmail || isAdminByPhone;

  if (!isAdmin) {
    return { authorized: false, error: 'Admin access required' };
  }

  return { authorized: true };
}

// GET - Fetch all projects
export async function GET(req) {
  try {
    const auth = await checkAdminAccess(req);
    if (!auth.authorized) {
      return Response.json({ error: auth.error }, { status: 403 });
    }

    const [projects] = await pool.query('SELECT id, name,description,category_id,base_price,dp FROM products');
    
    return Response.json({ projects }, { status: 200 });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return Response.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

// POST - Add new project
export async function POST(req) {
  try {
    const auth = await checkAdminAccess(req);
    if (!auth.authorized) {
      return Response.json({ error: auth.error }, { status: 403 });
    }

   const { name, description, category_id, base_price, dp } = await req.json();

  if (!name || !category_id) {
    return Response.json({ error: 'Name and category ID are required' }, { status: 400 });
  }

  const [result] = await pool.query(
    'INSERT INTO products (name, description, category_id, base_price, dp, modified_at) VALUES (?, ?, ?, ?, ?, NOW())',
    [name, description || '', category_id, base_price, dp || '']
  );

    return Response.json(
      {
        message: 'Project added successfully',
        projectId: result.insertId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding project:', error);
    return Response.json({ error: 'Failed to add project' }, { status: 500 });
  }
}
