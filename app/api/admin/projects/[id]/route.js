import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import pool from '@/lib/db';

// Middleware to check admin access
async function checkAdminAccess() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return { authorized: false, error: 'Unauthorized' };
  }

  const adminEmails = process.env.ADMIN_EMAILS?.split(',').map(e => e.trim()) || [];
  const adminPhones = process.env.ADMIN_PHONE_NUMBERS?.split(',').map(p => p.trim()) || [];
  
  const isAdminByEmail = session.user?.email && adminEmails.includes(session.user.email);
  const isAdminByPhone = session.user?.phone && adminPhones.includes(session.user.phone);
  
  if (!isAdminByEmail && !isAdminByPhone) {
    return { authorized: false, error: 'Admin access required' };
  }

  return { authorized: true };
}

// DELETE - Delete a project
export async function DELETE(req, context) {
  try {
    const auth = await checkAdminAccess();
    if (!auth.authorized) {
      return Response.json({ error: auth.error }, { status: 403 });
    }

    // FOOLPROOF EXTRACTION: Await context.params securely
    const params = await context.params;
    const id = params?.id;

    if (!id || id === 'undefined' || id === 'null') {
      console.error("DELETE Error: Invalid ID extracted", params);
      return Response.json({ error: `Invalid or missing Project ID. Received: ${id}` }, { status: 400 });
    }

    const [result] = await pool.query('DELETE FROM products WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return Response.json({ error: 'Project not found in database' }, { status: 404 });
    }

    return Response.json({ message: 'Project deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting project:', error);
    return Response.json({ error: 'Failed to delete project: ' + error.message }, { status: 500 });
  }
}

// PUT - Update a project
export async function PUT(req, context) {
  try {
    const auth = await checkAdminAccess();
    if (!auth.authorized) {
      return Response.json({ error: auth.error }, { status: 403 });
    }

    // FOOLPROOF EXTRACTION: Await context.params securely
    const params = await context.params;
    const id = params?.id;

    if (!id || id === 'undefined' || id === 'null') {
      console.error("PUT Error: Invalid ID extracted", params);
      return Response.json({ error: `Invalid or missing Project ID. Received: ${id}` }, { status: 400 });
    }

    const body = await req.json();
    const { name, description, category_id, base_price, dp } = body;

    // Strict validation to pinpoint exact 400 errors
    if (!name) return Response.json({ error: 'Name field is missing in request body' }, { status: 400 });
    if (!category_id) return Response.json({ error: 'Category ID is missing in request body' }, { status: 400 });

    const [result] = await pool.query(
      'UPDATE products SET name = ?, description = ?, category_id = ?, base_price = ?, dp = ?, modified_at = NOW() WHERE id = ?',
      [name, description || '', category_id, base_price || 0, dp || '', id]
    );

    if (result.affectedRows === 0) {
      return Response.json({ error: 'Project not found in database' }, { status: 404 });
    }

    return Response.json({ message: 'Project updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error updating project:', error);
    return Response.json({ error: 'Failed to update project: ' + error.message }, { status: 500 });
  }
}