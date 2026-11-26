# Lead Management System (Mini CRM)

Lead Management System to manage business leads: view dashboard stats, search and filter leads, add / edit / delete leads, and login / signup with Firebase Authentication.

## Features

- Dashboard with Total / New / Contacted / Converted stats
- Leads table with search (name, email, company) and status filter
- Add Lead, Edit Lead, Delete Lead (with confirm)
- Lead status: New, Contacted, Interested, Converted, Lost
- Login / Signup / Logout with Firebase Authentication
- REST API backend with validation and error handling
- Data saved in SQLite database — refresh ke baad bhi leads gayab nahi hote

## Tech Stack

- **Frontend:** React (JavaScript) + Vite + Plain CSS
- **Backend:** FastAPI (Python) + Uvicorn
- **Database:** SQLite (`leads.db`)
- **Auth:** Firebase Authentication (Email/Password)

## Project Structure

```
LMS/
  backend/
    main.py           # FastAPI app, CRUD APIs, SQLite setup
    requirements.txt  # fastapi, uvicorn
    leads.db          # Auto-created on first run (do not commit)
    Screenshots/
      login.png
      dashboard.png
      add-lead.png   
  src/
    App.jsx           # Dashboard + auth check + API calls
    firebase.js       # Firebase config + getAuth
    main.jsx
    index.css
    App.css
    components/
      Auth.jsx        # Switches between Login and Signup
      Login.jsx       # Firebase signIn
      Signup.jsx      # Firebase createUser
      Leadform.jsx    # Add / Edit lead form (modal)
  package.json
  vite.config.js
  README.md
```

## Prerequisites
- Node.js (LTS) + npm
- Python 3.10 or above + pip
- Git

Check first:
```
node -v
npm -v
python --version
```

## How to Run (from GitHub clone)
### 1. Clone the repo

```
git clone https://github.com/chaitanya-9604/Lead_Management_System.git
cd Lead_Management_System
```

### 2. Run Backend  (Terminal 1)

```
cd backend
python -m pip install fastapi uvicorn
python -m uvicorn main:app --reload
```

here is Backend running:

```
http://127.0.0.1:8000
```

API docs will open form here:

```
http://127.0.0.1:8000/docs
```

### 3. run Frontend  (Terminal 2 — New terminal)

```
cd LMS
npm install
npm run dev
```

Frontend will run here:

```
http://localhost:5173
```

## API Endpoints

Base URL (local): `http://127.0.0.1:8000`

| Method | Endpoint | Kaam |
|--------|----------|------|
| GET | `/leads` | Saare leads laao |
| POST | `/leads` | Naya lead add karo |
| PUT | `/leads/{id}` | Lead update karo |
| DELETE | `/leads/{id}` | Lead delete karo |

POST / PUT body example:

```json
{
  "name": "Rahul Sharma",
  "email": "rahul@gmail.com",
  "phone": "9876543210",
  "company": "Sharma Traders",
  "source": "Website",
  "status": "New"
}
```
Errors:
- `400` — Email already exists (duplicate email)
- `422` — Invalid email
- `404` — Lead not found

## Database

SQLite, file-based. Table `leads`:

- `id` — INTEGER, Primary Key, Auto Increment
- `name` — TEXT
- `email` — TEXT, Unique
- `phone` — TEXT
- `company` — TEXT
- `source` — TEXT
- `status` — TEXT (New / Contacted / Interested / Converted / Lost)
- `created` — TEXT (date, YYYY-MM-DD)

## Screenshots
Screenshots/login.png

Screenshots/dashboard.png

Screenshots/add-lead.png

## Live Demo

- **Frontend:** https://lead-management-system-five-wheat.vercel.app
- **Backend API:** https://lead-management-system-rq3f.onrender.com
- **API Docs:** https://lead-management-system-rq3f.onrender.com/docs
- **GitHub Repo:** https://github.com/chaitanya-9604/Lead_Management_System
