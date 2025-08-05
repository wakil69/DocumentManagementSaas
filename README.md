# Co-ownership Extranet

A full-stack web application designed for **co-ownership council members** to securely manage, access, and organize documents related to various *syndicats*. This extranet provides role-based access, a powerful admin panel, and automated document lifecycle handling.

---

## 🚀 Features

### 🛡 User Authentication & Roles
- Secure login with first-time password change and password reset via email.
- Role-based access:
  - **Admin**: Full access, including user and syndicat management.
  - **User**: Limited access based on assigned co-ownerships.

### 📄 Document Management
- Upload, download, and preview PDFs and images.
- Organize by *syndicat* and document category.
- Set expiration dates with automatic nightly checks.
- Expired document notifications sent to admins.
- Archive old documents to a separate directory.

### ⚙️ Admin Panel
- **User Management**: Create, edit, delete users. Import/export via CSV.
- **Syndicat Management**: Manage co-ownerships and assign categories.
- **Category Management**: Create and manage document categories.

---

[Click here to watch the demo](https://youtu.be/mTRX4903rEk)


## 🧰 Tech Stack

- **Frontend**: Next.js (Turbopack), React, TypeScript, Tailwind CSS, Material-UI, Framer Motion, TanStack Query, Axios, Zod
- **Backend**: Node.js, Express.js, TypeScript, Knex.js, MySQL, Redis, JWT, Nodemailer, Multer
- **Database**: MySQL
- **DevOps**: Docker, Docker Compose, PM2

---

## ⚙️ Getting Started

### Prerequisites

- Node.js (v18+)
- Docker & Docker Compose
- Running instances of MySQL and Redis

---

### 🧪 Local Configuration

Create `.env` files in both the **backend** and **frontend** directories:

#### `backend/.env`

```env
# Database
HOST_DB=your_db_host
PORT_DB=your_db_port
USER_DB=your_db_user
MDP_DB=your_db_password
NAME_DB=your_db_name

# Auth
SESSION_SECRET=your_strong_session_secret
JWT_SECRET=your_strong_jwt_secret

# Email
HOST_EMAIL=your_smtp_host
PORT_EMAIL=your_smtp_port
EMAIL=your_sender_email
PWD_EMAIL=your_sender_password

NODE_ENV=development
````

#### `frontend/.env`

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:4000
NEXT_PUBLIC_SERVER_BACKEND_URL=http://backend:4000
```

---

## 🐳 Running with Docker (Recommended)

1. Clone the repository:

   ```bash
   git clone https://github.com/wakil69/DocumentManagementSaas.git
   cd DocumentManagementSaas
   ```

2. Create the `.env` files as described above.

3. Build and run the stack:

   ```bash
   docker-compose up --build
   ```

   * Frontend: [http://localhost:3000](http://localhost:3000)
   * Backend API: [http://localhost:4000](http://localhost:4000)
   * Redis: Port `6379`

4. Run database migrations:

   ```bash
   docker-compose exec backend npx knex migrate:latest --knexfile ./db/knexConfig.ts
   ```

---

## 🧑‍💻 Local Development (Without Docker)

1. Install dependencies:

   ```bash
   npm install
   cd backend && npm install
   cd ../frontend && npm install
   cd ..
   ```

2. Set up the `.env` files as shown above.

3. Run backend migrations:

   ```bash
   cd backend
   npx knex migrate:latest --knexfile ./db/knexConfig.ts
   cd ..
   ```

4. Start both frontend and backend dev servers:

   ```bash
   npm run dev
   ```

Once the backend is running, you can explore the API using the Swagger UI:  
👉 [http://localhost:4000/api-docs](http://localhost:4000/api-docs)

---

## 📜 Scripts Overview

### Root

* `npm run dev` – Start both frontend and backend servers
* `npm run dev:backend` – Start backend only
* `npm run dev:frontend` – Start frontend only
* `npm run dev:migrate` – Run latest migrations

### Backend (`/backend`)

* `npm run migrate:make -- <name>` – Create a migration
* `npm run migrate:latest` – Apply all migrations
* `npm run migrate:rollback` – Roll back last migration batch

### Frontend (`/frontend`)

* `npm run dev` – Start Next.js dev server
* `npm run build` – Build for production
* `npm run start` – Run production server
* `npm run lint` – Lint frontend code


Here’s an updated version of your `README.md` with an added **💡 Future Improvements** section that highlights potential enhancements like document visualization and other user-centric features:

## 💡 Future Improvements

To further enhance usability and collaboration, the following features are being considered for future development:

### 📊 Advanced Document Visualization

* **Preview Office files** (Word, PowerPoint, Excel) directly in the browser without downloading.
* Support for real-time annotations and comments on documents.

### 🖼 Rich Media Support

* Display previews for additional file types such as `.docx`, `.pptx`, and `.xlsx`.
* Embed interactive previews (e.g., using Microsoft Office Viewer or PDF.js for better UX).

### 🔔 Smarter Notifications

* User-level notifications for document uploads or upcoming expirations.
* Customizable notification settings for each user or syndicat.

### 🔍 Enhanced Search & Filters

* Full-text search across all documents.
* Filter by upload date, syndicat, category, expiration status.

### 🤝 Collaboration Tools

* Document versioning and changelogs.
* Role-based commenting and approval flows before publishing or archiving documents.


### 📄 License

This project is licensed under the **Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)** license.

You are free to:
- Share — copy and redistribute the material in any medium or format
- Adapt — remix, transform, and build upon the material

**Under the following terms:**
- **Attribution** — You must give appropriate credit.
- **NonCommercial** — You may not use the material for commercial purposes.

For full license details, see [https://creativecommons.org/licenses/by-nc/4.0/](https://creativecommons.org/licenses/by-nc/4.0/)