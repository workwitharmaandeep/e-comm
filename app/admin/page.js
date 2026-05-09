import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import ProjectsManagement from './ProjectsManagement';

export const metadata = {
  title: 'Admin - Projects Management',
  description: 'Manage projects - add, edit, and delete',
};

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  // Redirect to login if not authenticated
  if (!session) {
    redirect('/login');
  }

  // Check if user is admin by email or phone number
  const adminEmails = process.env.ADMIN_EMAILS?.split(',').map(e => e.trim()) || [];
  const adminPhones = process.env.ADMIN_PHONE_NUMBERS?.split(',').map(p => p.trim()) || [];
  
  const isAdminByEmail = session.user.email && adminEmails.includes(session.user.email);
  const isAdminByPhone = session.user.phone && adminPhones.includes(session.user.phone);
  
  const isAdmin = isAdminByEmail || isAdminByPhone;

  if (!isAdmin) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p>You don't have admin access. Please contact an administrator.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <ProjectsManagement />
    </div>
  );
}
