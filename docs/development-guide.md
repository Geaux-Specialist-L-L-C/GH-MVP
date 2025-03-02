# Geaux HelpED Development Guide

This guide provides an overview of setting up and running the Geaux HelpED application locally, along with general developer notes on architecture and workflows.

```bash
Repository: Geaux-Specialist-L-L-C/GH-MVP
```

---

## Prerequisites

1. Node.js (v16 or higher recommended)
2. Yarn or npm (Yarn preferred for consistency)
3. MongoDB Atlas or a local MongoDB instance
4. Cloudinary account (optional if you want to test image upload functionality)

---

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/Geaux-Specialist-L-L-C/GH-MVP.git
   ```

2. Navigate to the project directory:

   ```bash
   cd GH-MVP
   ```

3. Install dependencies:

   ```bash
   yarn install
   ```
   or
   ```bash
   npm install
   ```

4. Create a new `.env.local` file using the `.env.example` template. Update the environment variables with your own credentials:

   ```ini
   MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/dbName
   JWT_SECRET=YOUR_JWT_SECRET
   CLOUDINARY_CLOUD_NAME=YOUR_CLOUD_NAME
   CLOUDINARY_API_KEY=YOUR_CLOUD_API_KEY
   CLOUDINARY_API_SECRET=YOUR_CLOUD_API_SECRET
   ```
   
   Make sure you never commit your `.env.local` file to version control.

5. Run the development server:

   ```bash
   yarn dev
   ```
   or
   ```bash
   npm run dev
   ```

   The application should be available at http://localhost:3000.

---

## Folder Structure

```plaintext
.
├── components        # Reusable UI components, including Auth, Navigation, and Profile forms
├── contexts          # React context providers for authentication and other global states
├── docs             # Markdown documentation files
├── lib              # Helper libraries (e.g., database connection, email handling)
├── middleware       # Middleware for authentication, permissions, etc.
├── models           # Mongoose models for MongoDB schemas
├── pages            # Next.js pages (API routes under pages/api/, and client pages otherwise)
├── public           # Static assets (images, icons, etc.)
├── styles           # Global CSS and module CSS files
└── utils            # Utility functions and higher-order components
```

---

## Development Workflow

1. **Feature Branches**  
   - Create a new branch for each feature or bug fix.
   - Prefix the branch name with `feature/` or `fix/`.

2. **Commits**  
   - Commit meaningful changes with clear messages.
   - Include any relevant details about files added or modified.

3. **Pull Requests**  
   - Open a pull request against the main branch when ready to merge.
   - Request reviews from team members and address any feedback.

4. **Linting & Formatting**  
   - ESLint is configured for code linting.
   - Prettier is used for consistent formatting.
   - Run `yarn lint` before pushing to avoid lint errors.

---

## Notable Changes

1. **Authentication & Roles**  
   - JWT-based authentication with role-based access control using the `ProtectedRoute` component and `withAuth` HOC.
   - Admin, caregiver, and care recipient roles are supported out of the box.

2. **Profile Management**  
   - Users have extended profiles stored in the `Profile` model, which can be updated via dedicated API endpoints.
   - Profile image uploads are handled through Cloudinary.

3. **Next Steps**  
   - Continue enhancing features such as Task Management, AI/ML-driven automations, and real-time vital sign tracking.

---

## Troubleshooting

- **Database Connection Errors**  
  Verify that your MongoDB connection string is correct in `.env.local`.
- **Cloudinary Upload Issues**  
  Check your Cloudinary credentials and ensure the environment variables are set correctly.
- **Invalid JWT or Authentication**  
  Make sure you’re sending a valid token, and that the backend is configured with the correct secret in its environment variables.

---

_Updated: 2025-03-02 00:36:00 UTC by evopimp_