
# Auth Project

This is a simple project built with Express (backend) and React (frontend). It is a fully functional authentication system, including features such as register and login, all implemented from scratch.

# 🚀 How to Run the Project

Follow the steps below to set up and run the project:

## 1. Backend Setup

Navigate to the backend directory:

```
cd backend
```
Install the required dependencies:


```
npm install

```
Configure the environment variables:

```
DATABASE_URL=your_mysql_url        # Or configure as needed inside schema.prisma
SECRET_KEY=your_secret_key         # Used for token generation
PASSWORD_AUTH=your_email_password
EMAIL_AUTH=your_email_address
FRONTEND_WEBSITE=your_frontend_url # For CORS configuration
```
- DATABASE_URL: By default, the project uses MySQL. If you want to use a different database, update the configuration inside schema.prisma.
- SECRET_KEY: A key used for generating tokens.
- PASSWORD_AUTH and EMAIL_AUTH: Credentials for the email sender. This project uses Ethereal Email for testing purposes.
- FRONTEND_WEBSITE: The frontend URL, used for CORS security.

Start the backend server:
```
npm run dev
```

## 2. Frontend Setup
Navigate to the frontend directory:
```
cd frontend
```
Install the required dependencies:

```
npm install
```
Start the frontend server:
```
npm run dev
```

## 🛠️ Technologies Used

 - Backend: Node.js, Express.js, Prisma, MySQL
 - Frontend: React , Tailwind ,Shade Cdn
 - Email Testing: Ethereal Email

## 🎉 You're All Set!

Once both servers are running, you can access the application and test the authentication flow
