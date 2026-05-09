# Admin Panel Setup Guide

## Overview
An admin panel has been created to manage projects with full CRUD operations (Create, Read, Update, Delete).

## Features
- ✅ Add new projects
- ✅ Edit existing projects  
- ✅ Delete projects
- ✅ Filter by category
- ✅ Admin-only access with NextAuth authentication

## Setup Instructions

### 1. Database Setup
Run the SQL migration to create the projects table:
```sql
CREATE TABLE IF NOT EXISTS projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_category (category),
  INDEX idx_created_at (created_at)
);
```

Or use the migration file: `migrations/001_create_projects_table.sql`

### 2. Environment Variables
Add admin email(s) and/or phone number(s) to your `.env.local`:
```
# Admin by email (optional)
ADMIN_EMAILS=admin@example.com,admin2@example.com

# Admin by phone number (optional)
ADMIN_PHONE_NUMBERS=7357443101,9876543210
```

You can use either email or phone number (or both) to grant admin access.

### 3. Access the Admin Panel
- Navigate to: `http://localhost:3000/admin`
- You will be automatically redirected to login if not authenticated
- Only users with emails in `ADMIN_EMAILS` will have access

## API Endpoints

### Get All Projects
```
GET /api/admin/projects
```

### Add New Project
```
POST /api/admin/projects
Body: {
  "name": "Project Name",
  "description": "Project Description",
  "category": "Casual|Formal|Traditional|Sports"
}
```

### Update Project
```
PUT /api/admin/projects/[id]
Body: {
  "name": "Updated Name",
  "description": "Updated Description",
  "category": "Casual"
}
```

### Delete Project
```
DELETE /api/admin/projects/[id]
```

## File Structure
```
app/
  admin/
    page.js                    # Main admin page (server component)
    ProjectsManagement.js      # Projects management UI (client component)
  api/
    admin/
      projects/
        route.js               # GET & POST for all projects
        [id]/
          route.js             # DELETE & PUT for individual projects
```

## Security Features
- ✅ NextAuth authentication required
- ✅ Admin verification by email or phone number
- ✅ Server-side authorization checks on all endpoints
- ✅ Admin-only middleware protection

## Notes
- Only authenticated users with admin emails or phone numbers can access the admin panel
- The panel requires NextAuth session
- All operations are protected with admin access verification
- Categories are predefined: Casual, Formal, Traditional, Sports
- Admin can be identified by email, phone number, or both
