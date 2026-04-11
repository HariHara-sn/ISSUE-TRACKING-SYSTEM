# MERN Issue Tracking System — User Guide

A full-stack web application built with **MongoDB, Express, React, and Node.js** that allows students to report campus issues, admins to manage and assign them, and staff to resolve them.

---

## System Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Student   │     │    Admin    │     │    Staff    │
│   Portal    │     │   Portal    │     │   Portal    │
└──────┬──────┘     └──────┬──────┘     └──────┬──────┘
       │                   │                   │
       └───────────────────┼───────────────────┘
                           │
                 ┌─────────▼─────────┐
                 │   React Frontend  │
                 │   (Vite + TS)     │
                 └─────────┬─────────┘
                           │ REST API
                 ┌─────────▼─────────┐
                 │  Express Backend  │
                 │   (Node.js)       │
                 └─────────┬─────────┘
                           │
                 ┌─────────▼─────────┐
                 │     MongoDB       │
                 │   (Database)      │
                 └───────────────────┘
```

---

## User Roles

| Role    | Description                                              |
|---------|----------------------------------------------------------|
| Student | Reports campus issues and tracks their status            |
| Admin   | Reviews issues, assigns them to staff, manages users     |
| Staff   | Receives assigned issues, works on them, marks resolved  |

---

## Complete Workflow

```
Student Reports Issue
        ↓
   Status: "Pending"
        ↓
Admin Reviews & Assigns to Staff
        ↓
   Status: "Assigned"
        ↓
Staff Starts the Issue
        ↓
   Status: "In Progress"
        ↓
Staff Marks as Resolved
        ↓
   Status: "Resolved" ✅
```

---

## Student — Step-by-Step Guide

### Step 1 — Login
1. Enter your **Email** and **Password**
2. Click **Login**
3. You will be redirected to the **Student Dashboard**

### Step 2 — Report an Issue
1. Click the **"Report New Issue"** button on the dashboard (or navigate to **Complaint** from the sidebar)
2. Choose a **category** that best matches your problem:
   - Hostel
   - WiFi
   - Canteen
   - Transport
   - Academy
   - Cleanliness
   - Restroom
   - Other
3. Fill in the issue form:
   - **Title** — A short summary (auto-filled based on category, can be edited)
   - **Description** — Detailed explanation of the problem
   - **Priority** — Low / Medium / High
   - **Upload Image** *(optional)* — A photo of the issue
   - **Category-specific fields:**
     - *Hostel:* Room number, Cot number, Food quality rating
     - *WiFi:* Your name, Email, MAC address, Other details
4. Click **"Submit Complaint"**
5. A **success animation** will appear and you'll be redirected to the dashboard

### Step 3 — Track Your Issues
| Page              | What You See                                 |
|-------------------|----------------------------------------------|
| Dashboard         | Summary counts: Open / In Progress / Resolved |
| Open Issues       | All issues not yet resolved                  |
| Resolved Issues   | All completed issues                         |
| Timeline          | Full history of all your issues with status  |

### Step 4 — View Issue Details
- Click any issue card to open a **detail dialog**
- See the full description, current status, and timeline of events

---

## 🛡️ Admin — Step-by-Step Guide

### Step 1 — Login as Admin
1. Enter your Admin **Email** and **Password**
2. Click **Login**
3. You will be redirected to the **Admin Dashboard**

### Step 2 — View the Dashboard
The dashboard shows:
- **Total Issues** — All issues in the system
- **Pending** — Issues waiting to be assigned
- **In Progress** — Issues actively being worked on
- **Resolved** — Completed issues
- **Category Distribution Chart** — Visual breakdown by issue type
- **Issues Needing Assignment** — Quick-access table at the bottom

### Step 3 — Assign Issues to Staff
1. Navigate to **Assign Issues** in the sidebar
2. You'll see two tabs:
   - **Pending Assignment** — New, unassigned issues from students
   - **Assigned Issues** — Issues already assigned to staff
3. For each pending issue:
   - View the title, student name, category, location, and priority
   - Click the image icon to preview any uploaded photo
   - Select a **staff member** from the dropdown
   - Click **"Assign"**
4. The issue moves to the Assigned tab with status `Assigned`
5. To **reassign** an issue: go to the Assigned tab → change staff → click **"Reassign"**
6. Click **"Refresh Data"** anytime to reload the latest information

### Step 4 — Manage Users
1. Navigate to **Users** in the sidebar
2. View all **staff** and **students** registered in the system
3. Use the **search bar** to find users by name or email
4. Use the **role filter** to view only Students or only Staff
5. Click any row to view a **user details dialog**
6. Stats at the top show: Total Users / Total Staff / Total Students

### Step 5 — View Analytics
Navigate to **Analytics** to see:

| Chart                    | Description                                       |
|--------------------------|---------------------------------------------------|
| Issue Type Distribution  | Donut chart — breakdown by category               |
| Issue Status Breakdown   | Pie chart — ratio of Pending/Assigned/In Progress/Resolved |
| Monthly Issues Trend     | Line chart — issues reported per month            |
| Staff Performance Report | Bar chart + table — assigned vs resolved per staff member |

---

## Staff — Step-by-Step Guide

### Step 1 — Login as Staff
1. Enter your Staff **Email** and **Password**
2. Click **Login**
3. You will be redirected to the **Staff Dashboard**

### Step 2 — View Your Dashboard
The dashboard shows:
- **Pending Assignments** — Issues assigned to you, not yet started
- **Active Issues** — Issues you are currently working on
- **Completed** — Total issues you have resolved
- A summary list of your most recent pending issues with **"Start"** buttons

### Step 3 — Start Working on a Pending Issue
1. Navigate to **Pending Issues** in the sidebar
2. You'll see all issues assigned to you by the admin
3. For each issue you are ready to work on:
   - Review the title, description, category, location, and priority
   - Click **"Start"**
   - Status changes: `Assigned` → `In Progress`
4. The issue disappears from Pending and moves to Active Issues

### Step 4 — Resolve an Active Issue
1. Navigate to **Active Issues** in the sidebar
2. You'll see all issues currently in progress
3. Once the problem is fixed:
   - Click **"Mark as Resolved"**
   - Status changes: `In Progress` → `Resolved`
4. The issue moves to your Completed list

### Step 5 — View Your Completed Work
1. Navigate to **Completed Issues**
2. See all issues you have successfully resolved with their dates

---

## 🔐 Authentication & Security

- All users must **log in** before accessing any portal
- **JWT tokens** are used to authenticate API requests
- Tokens are stored in `localStorage` and sent with every request
- Each role can only access **their own portal** — unauthorized access is blocked by both frontend routing and backend middleware
- Passwords are **hashed** before being stored in the database

---

## Image Uploads

- Students can attach a photo when reporting an issue
- Images are uploaded to **Cloudinary** (cloud image hosting)
- The image URL is stored in the database and displayed in the admin's assign panel
- Admin can preview uploaded images before assigning

---

## Issue Status Reference

| Status      | Meaning                                         | Set By   |
|-------------|--------------------------------------------------|----------|
| Pending     | Newly submitted, not yet assigned                | System   |
| Assigned    | Admin has assigned it to a staff member          | Admin    |
| In Progress | Staff has started working on it                  | Staff    |
| Resolved    | Issue has been fixed and closed                  | Staff    |

---

## Project Structure

```
MERN-ISSUE-TRACKING-SYSTEM/
├── BACKEND/
│   └── src/
│       ├── controllers/     # Business logic (auth, issues)
│       ├── models/          # MongoDB schemas (User, Issue)
│       ├── routes/          # API route definitions
│       └── middleware/      # Auth & role protection
│
└── FRONTEND/
    └── src/
        ├── pages/
        │   ├── student/     # Student portal pages
        │   ├── staff/       # Staff portal pages
        │   └── admin/       # Admin portal pages
        ├── services/        # API service functions
        ├── contexts/        # Auth context (JWT)
        └── components/      # Shared UI components
```

---

## Running the Application

### Backend
```bash
cd BACKEND
npm install
npm run dev
# Runs on http://localhost:5000
```

### Frontend
```bash
cd FRONTEND
npm install
npm run dev
# Runs on http://localhost:5173
```

### Environment Variables (Backend — `.env`)
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

### Environment Variables (Frontend — `.env`)
```
VITE_API_URL=http://localhost:5000/api
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

---

## 📝 API Endpoints Summary

### Auth
| Method | Endpoint            | Description              |
|--------|---------------------|--------------------------|
| POST   | `/api/auth/register`| Register a new user      |
| POST   | `/api/auth/login`   | Login and get JWT token  |

### Issues (Student)
| Method | Endpoint                          | Description                    |
|--------|-----------------------------------|--------------------------------|
| POST   | `/api/issues/create`              | Submit a new issue             |
| GET    | `/api/issues/student/openIssues`  | Get student's open issues      |
| GET    | `/api/issues/student/assignedIssues` | Get student's assigned issues |
| GET    | `/api/issues/student/resolved`    | Get student's resolved issues  |

### Issues (Admin)
| Method | Endpoint                  | Description                     |
|--------|---------------------------|---------------------------------|
| GET    | `/api/issues/openIssues`  | Get all issues (admin view)     |
| GET    | `/api/issues/pending`     | Get all unassigned issues       |
| GET    | `/api/issues/assigned`    | Get all assigned issues         |
| GET    | `/api/issues/resolved`    | Get all resolved issues         |
| PUT    | `/api/issues/assign`      | Assign issue to a staff member  |
| GET    | `/api/issues/staff`       | Get list of all staff           |
| GET    | `/api/issues/student`     | Get list of all students        |

### Issues (Staff)
| Method | Endpoint                         | Description                    |
|--------|----------------------------------|--------------------------------|
| GET    | `/api/issues/staff/assignedIssues`| Get issues assigned to me     |
| GET    | `/api/issues/staff/active`       | Get my in-progress issues      |
| GET    | `/api/issues/staff/resolved`     | Get my resolved issues         |
| PUT    | `/api/issues/:id/status`         | Update issue status            |

---

*Built with ❤️ using MongoDB, Express, React, and Node.js*
