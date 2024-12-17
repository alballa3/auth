import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";
import { auth } from "@/route";
import { Link } from "react-router";

const Index = () => {
  const [session, setSession] = useState(null);
  const handle = () => {
    // setSession(auth().session)
    console.log(auth());
  };

  const features = [
    "Email Confirmation",
    "Password Hashing",
    "JWT Token",
    "Cookie Management",
    "Route Guard",
    "Email Verification",
  ];

  const technologies = [
    "React and React Router",
    "For The UI I used Tailwind CSS and Shade CDN",
    "Express and Node.js",
    "Zod for Validation",
    "Prisma and MySQL for the database",
  ];

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-white shadow-lg">
        <CardHeader className="bg-blue-600 text-white">
          <CardTitle className="text-3xl font-bold text-center">
            Simple Auth Project
          </CardTitle>
          <CardDescription className="text-center text-lg mt-2 text-blue-100">
            My first project with Express and React
          </CardDescription>
        </CardHeader>
        <CardContent className="mt-6">
          <div className="space-y-6">
            <section>
              <h3 className="text-xl font-semibold mb-2 text-blue-800">
                Project Features
              </h3>
              <ul className="grid grid-cols-2 gap-2">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-blue-500 mr-2" />
                    <span className="text-blue-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </section>
            <section>
              <h3 className="text-xl font-semibold mb-2 text-blue-800">
                Technologies Used
              </h3>
              <div className="flex flex-wrap gap-2">
                {technologies.map((tech, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-blue-100 text-blue-700"
                  >
                    {tech}
                  </Badge>
                ))}
              </div>
            </section>
            <section>
              <h3 className="text-xl font-semibold mb-2 text-blue-800">Note</h3>
              <p className="text-blue-600">
                This simple app can be used as a starting point for any project,
                as the front-end and back-end authentication is fully
                functional.
              </p>
            </section>
            <section>
              <h3 className="text-xl font-semibold mb-2 text-blue-800">
                Actions
              </h3>
              <div className="grid gap-3">
                <Button
                  onClick={handle}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Get Session
                </Button>
                <Button
                  onClick={() => auth.logout()}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Logout
                </Button>
                <Button
                  asChild
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Link to="/register">Register</Link>
                </Button>
                <Button
                  asChild
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Link to="/login">Login</Link>
                </Button>
              </div>
            </section>
            {session && (
              <section>
                <h3 className="text-xl font-semibold mb-2 text-blue-800">
                  Current Session
                </h3>
                <p className="text-blue-600">User: {session.user}</p>
                <p className="text-blue-600">Email: {session.email}</p>
              </section>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
