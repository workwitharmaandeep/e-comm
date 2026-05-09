'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Imageupload from '@/app/shared/Imageupload';

const CATEGORY_ID_BY_LABEL = {
  Casual: 3301,
  Formal: 6301,
  Traditional: 2031,
  Sports: 1931,
};

const CATEGORY_LABEL_BY_ID = {
  3301: 'Casual',
  6301: 'Formal',
  2031: 'Traditional',
  1931: 'Sports',
};

export default function ProjectsManagement() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // FIX: Added basePrice to initial state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Casual',
    basePrice: '', 
    imageUrl: '',
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/projects');
      
      if (response.status === 403) {
        setError('Admin access required');
        return;
      }
      
      if (!response.ok) throw new Error('Failed to fetch projects');
      
      const data = await response.json();
      setProjects(data.projects || []);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'authenticated') {
      fetchProjects();
    }
  }, [status]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // FIX: Added base_price to payload
      const payload = {
        name: formData.name,
        description: formData.description,
        category_id: CATEGORY_ID_BY_LABEL[formData.category],
        base_price: parseFloat(formData.basePrice) || 0,
        dp: formData.imageUrl || '',
      };

      if (editingId) {
        const response = await fetch(`/api/admin/projects/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error('Failed to update project');
        
        setProjects(projects.map(p => 
          p.id === editingId ? { ...p, ...payload } : p
        ));
      } else {
        const response = await fetch('/api/admin/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error('Failed to add project');

        const data = await response.json();
        setProjects([{ id: data.projectId, ...payload }, ...projects]);
      }

      setFormData({ name: '', description: '', category: 'Casual', basePrice: '', imageUrl: '' });
      setEditingId(null);
      setShowForm(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      const response = await fetch(`/api/admin/projects/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete project');

      setProjects(projects.filter(p => p.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (project) => {
    // FIX: Populate basePrice when editing
    setFormData({
      name: project.name,
      description: project.description,
      category: CATEGORY_LABEL_BY_ID[project.category_id] || 'Casual',
      basePrice: project.base_price || '',
      imageUrl: project.dp || '',
    });
    setEditingId(project.id);
    setShowForm(true);
  };

  const handleCancel = () => {
    setFormData({ name: '', description: '', category: 'Casual', basePrice: '', imageUrl: '' });
    setEditingId(null);
    setShowForm(false);
  };

  if (status === 'loading' || loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Projects Management</h1>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      <div className="mb-8 bg-gray-50 p-6 rounded-lg">
        {!showForm ? (
          <button onClick={() => setShowForm(true)} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
            + Add New Project
          </button>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">{editingId ? 'Edit Project' : 'Add New Project'}</h2>
            
            <div>
              <label className="block text-gray-700 font-bold mb-2">Project Name *</label>
              <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>

            <div>
              <label className="block text-gray-700 font-bold mb-2">Description</label>
              <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" rows="3"></textarea>
            </div>

            {/* FIX: Added Price Input UI */}
            <div>
              <label className="block text-gray-700 font-bold mb-2">Base Price (₹) *</label>
              <input type="number" step="0.01" min="0" value={formData.basePrice} onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })} required className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>

            <div>
              <label className="block text-gray-700 font-bold mb-2">Category *</label>
              <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} required className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                <option value="Casual">Casual</option>
                <option value="Formal">Formal</option>
                <option value="Traditional">Traditional</option>
                <option value="Sports">Sports</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-bold mb-2">Project Image</label>
              <Imageupload onUploadComplete={(url) => setFormData((prev) => ({ ...prev, imageUrl: url }))} />
              {formData.imageUrl && <img src={formData.imageUrl} alt="preview" className="mt-3 h-32 w-32 object-cover rounded border" />}
            </div>

            <div className="flex gap-2">
              <button type="submit" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
                {editingId ? 'Update Project' : 'Add Project'}
              </button>
              <button type="button" onClick={handleCancel} className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded">
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">All Projects ({projects.length})</h2>
        {projects.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No projects yet.</div>
        ) : (
          <div className="overflow-x-auto bg-white rounded shadow">
            <table className="w-full border-collapse">
              <thead className="bg-gray-100 border-b-2 border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left">ID</th>
                  <th className="px-4 py-3 text-left">Image</th>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Price (₹)</th>
                  <th className="px-4 py-3 text-left">Category</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr key={project.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">{project.id}</td>
                    <td className="px-4 py-3 w=40 h-30">
                      {project.dp && <img src={project.dp} alt={project.name} className="w-12 h-12 object-cover rounded" />}
                    </td>
                    <td className="px-4 py-3 font-semibold">{project.name}</td>
                    <td className="px-4 py-3 text-green-600 font-bold">₹{Number(project.base_price || 0).toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                        {CATEGORY_LABEL_BY_ID[project.category_id] || 'Unknown'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button onClick={() => handleEdit(project)} className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded mr-2">Edit</button>
                      <button onClick={() => handleDelete(project.id)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}