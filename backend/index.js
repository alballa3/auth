const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const z = require("zod")
const email = require("nodemailer")
const cors = require('cors');
const cookie = require("cookie-parser")
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
require("dotenv").config();
const app = express();
app.use(cookie())
const corsOptions = {
    origin: process.env.FRONTEND_WEBSITE, // Allow only this origin
    credentials: true, // Allow cookies or other credentials
};

app.use(cors(corsOptions));
app.use(express.json())

// Here Enter Your Email provider details
const transporter = email.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: process.env.EMAIL_AUTH,
        pass: process.env.PASSWORD_AUTH
    }
});
const sendMail = async (from, token, to) => {

    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f9f9f9;
            margin: 0;
            padding: 0;
        }
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background: #fff;
            border: 1px solid #ddd;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .email-header {
            background-color: #4CAF50;
            color: white;
            text-align: center;
            padding: 20px 0;
        }
        .email-body {
            padding: 20px;
        }
        .email-body h1 {
            color: #4CAF50;
        }
        .email-body p {
            margin: 10px 0;
        }
        .email-body a {
            display: inline-block;
            background-color: #4CAF50;
            color: white;
            text-decoration: none;
            padding: 10px 20px;
            border-radius: 5px;
            margin-top: 20px;
        }
        .email-body a:hover {
            background-color: #45a049;
        }
        .email-footer {
            background-color: #f1f1f1;
            text-align: center;
            padding: 10px;
            font-size: 14px;
            color: #777;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
            <h1>Welcome to Our Website!</h1>
        </div>
        <div class="email-body">
            <p>Hi there,</p>
            <p>Thank you for signing up for our service. We are excited to have you on board!</p>
            <p>To get started, please verify your email address by clicking the button below:</p>
            <a href="http://localhost:3000/verify/${token}">Verify Your Email</a>
            <p>If you did not sign up for this account, please ignore this email or contact our support team if you have any concerns.</p>
        </div>
        <div class="email-footer">
            <p>&copy; 2024 Our Website. All rights reserved.</p>
            <p><a href="http://localhost:3000/contact" style="color: #4CAF50; text-decoration: none;">Contact Support</a></p>
        </div>
    </div>
</body>
</html>
`;

    const info = await transporter.sendMail({
        html: html,
        to: to,
        from: from,
        subject: "Verify your email address"
    })
    return info
}
app.get('/verify/:token', async (req, res) => {
    const token = req.params.token
    const session = await prisma.session.findUnique({
        where: {
            token: token
        },
        select: {
            userId: true,
        }
    })
    if (!session) {
        return res.status(404).json({ error: "Invalid or expired token" });
    }
    const user = await prisma.user.update({
        where: {
            id: session.userId
        },
        data: {
            verified: true
        }
    })
    return res.json({ message: "Email verified successfully", user: session });
})
const generateToken = (data, expiresIn = "30d") => {
    const token = jwt.sign(data, process.env.SECRET_KEY, { expiresIn: expiresIn });
    return token;
}
app.post("/register", async (req, res) => {
    const { username, email, password } = req.body;
    const userSchema = z.object({
        username: z.string().min(3).max(20),
        email: z.string().email(),
        password: z.string().min(8).max(128),
    })
    const validationResult = userSchema.safeParse(req.body)
    if (!validationResult.success) {
        return res.status(400).json({ error: validationResult.error.flatten().fieldErrors });
    }
    if (req.cookies.token) {
        return res.status(401).json({ error: "User already logged in" });
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { username: username },
                    { email: email }
                ]
            }
        })
        if (existingUser) {
            return res.status(400).json({ error: "Username or email already exists" });
        }
        const user = await prisma.user.create({
            data: {
                username,
                password_without_hash: password,
                email,
                password: hashedPassword
            }
        })
        
        await prisma.session.deleteMany({
            where: {
                userId: user.id, // Delete all sessions for the user
            },
        });
        const token = generateToken(
            { 
                userId: user.id
                , username: user.username, email: user.email

             }
            , "30d");
        const session = await prisma.session.create({
            data: {
                expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                userId: user.id,
                token: token
            }
        })
        res.cookie("token", session.token, { expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) })
        const info = await sendMail(process.env.EMAIL_AUTH, session.token, user.email)
        console.log(info);
        console.log("Email sent successfully");
        console.log(session,token)
        res.json({ message: "User registered successfully",  session });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
})
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const userSchema = z.object({
        email: z.string().email(),
        password: z.string().min(8).max(128),
    })
    const validationResult = userSchema.safeParse(req.body)
    if (!validationResult.success) {
        return res.status(400).json({ error: validationResult.error.flatten().fieldErrors });
    }
    if (req.cookies.token) {
        return res.status(401).json({ error: "User already logged in" });
    }
    const user = await prisma.user.findFirst({
        where: {
            email: email,
        }
    })
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(400).json({ error: "Invalid username or password" });
    }
    const token = generateToken({ userId: user.id, username: user.username, email: user.email }, "30d");
    res.cookie("token", token, { expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) })
    const session = await prisma.session.create({
        data: {
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            userId: user.id,
            token: token
        }
    })
    res.json({ message: "User logged in successfully", user, session });
    console.log("User logged in successfully", user);
})
app.get("/logout", async (req, res) => {
    if (!req.cookies.token) {
        return res.status(401).json({ error: "User not logged in" });
    }
    const session = await prisma.session.delete({
        where: {
            token: req.cookies.token
        }
    })
    if (!session) {
        return res.status(404).json({ error: "Invalid or expired token" });
    }
    res.clearCookie("token");
    return res.json({ message: "User logged out successfully" });
})


app.listen(3000, () => {
    console.log('Server is running  http://localhost:3000 ');
})