Scholarship Management System

Introduction

The Scholarship Management System is a web application designed to streamline and automate the management of scholarships for both administrators and students. By digitizing and simplifying scholarship workflows, this system saves significant time and effort, reducing the manual processes by 30% to 50%.

The system allows administrators to manage scholarship records and applications easily, while students can apply for scholarships and track their application status. The automation of these processes helps eliminate manual errors and improves efficiency.

Technologies Used

This project is built with modern web technologies to ensure scalability, speed, and reliability:

Next.js: React framework for building server-side rendering and static web applications.

TypeScript: Ensures type safety throughout the project.

Tailwind CSS: Utility-first CSS framework for creating custom designs quickly.

Firebase: Provides authentication and real-time database features.

Vercel: Hosting platform for instant, auto-scaled deployments.

PostgreSQL: Relational database management for storing scholarship-related data.

Drizzle ORM: Simplifies interaction with PostgreSQL by providing an abstraction layer.

Vercel Postgres: Managed PostgreSQL service (for production usage).

PostgreSQL on VPS: For custom deployment options where you host the database on your own virtual private server.

Installation and Setup

To get started with the Scholarship Management System, follow these steps:

1. Clone the Repository

git clone https://github.com/your-repo-url/scholarship-management-system.git
cd scholarship-management-system

2. Install Dependencies

Make sure you have Node.js installed. Then, install the necessary dependencies:

npm install

3. Configure Environment Variables

Set up environment variables for Firebase, PostgreSQL (either Vercel Postgres or VPS-hosted PostgreSQL), and other required settings in a .env.local file.

Example .env.local:

NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-firebase-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-firebase-project-id
POSTGRES_URL=your-postgres-url
DRIZZLE_DATABASE_URL=your-database-url

4. Running the Application Locally

To run the project locally:

npm run dev

This command will start the development server, and the application will be available at http://localhost:3000.

5. Deployment

The project is configured to be deployed easily on Vercel, but you can also deploy it on any hosting provider of your choice. When deploying on Vercel, it will automatically detect the Next.js framework and set up a proper environment.

Vercel Postgres: By default, the project uses Vercel's managed PostgreSQL service. If you are using Vercel Postgres, ensure the connection string is set in your environment variables.

Features

Admin Dashboard: Manage scholarships, review student applications, and oversee the process.

Student Portal: Apply for scholarships, view application status, and receive updates.

Firebase Authentication: Secure login and signup for both admins and students.

Real-time Notifications: Keep users informed of updates in real-time.
.
