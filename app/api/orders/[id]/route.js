import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import pool from '@/lib/db';

async function checkAdminAccess(req) {
  const session = await getServerSession(authOptions);
  
  if (!session) return { authorized: false, error: 'Unauthorized' };

  const adminEmails = process.env.ADMIN_EMAILS?.split(',').map(e => e.trim()) || [];
  const adminPhones = process.env.ADMIN_PHONE_NUMBERS?.split(',').map(p => p.trim()) || [];
  
  const isAdminByEmail = session.user.email && adminEmails.includes(session.user.email);
  const isAdminByPhone = session.user.phone && adminPhones.includes(session.user.phone);
  
  const isAdmin = isAdminByEmail || isAdminByPhone;

  if (!isAdmin) return { authorized: false, error: 'Admin access required' };

  return { authorized: true };
}

// DELETE - Delete a project
export async function DELETE(req, { params }) {
  try {
    const auth = await checkAdminAccess(req);
    if (!auth.authorized) return Response.json({ error: auth.error }, { status: 403 });

    // FIX: Await the params object
    const { id } = await params;

    if (!id) return Response.json({ error: 'Project ID is required' }, { status: 400 });

    const [result] = await pool.query('DELETE FROM products WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return Response.json({ error: 'Project not found' }, { status: 404 });
    }

    return Response.json({ message: 'Project deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting project:', error);
    return Response.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}

// PUT - Update a project
export async function PUT(req, { params }) {
  try {
    const auth = await checkAdminAccess(req);
    if (!auth.authorized) return Response.json({ error: auth.error }, { status: 403 });

    // FIX: Await the params object
    const { id } = await params;
    
    // FIX: Include base_price
    const { name, description, category_id, base_price, dp } = await req.json();

    if (!id) return Response.json({ error: 'Project ID is required' }, { status: 400 });

    // FIX: Update base_price and modified_at in the database
    const [result] = await pool.query(
      'UPDATE products SET name = ?, description = ?, category_id = ?, base_price = ?, dp = ?, modified_at = NOW() WHERE id = ?',
      [name, description, category_id, base_price, dp || '', id]
    );

    if (result.affectedRows === 0) {
      return Response.json({ error: 'Project not found' }, { status: 404 });
    }

    return Response.json({ message: 'Project updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error updating project:', error);
    return Response.json({ error: 'Failed to update project' }, { status: 500 });
  }
}