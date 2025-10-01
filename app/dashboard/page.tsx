// File: app/dashboard/page.tsx
import { Metadata } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import {
  Users,
  BookOpen,
  Handshake,
  MessageSquare,
  Shield,
  GraduationCap,
  Building,
  Book,
  Video,
  LayoutDashboard,
  Gamepad2,
  BookImage,
  NotebookText,
  ShieldUser,
  FlaskConical,
  School2,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Dashboard - Admin Portal",
  description: "Admin dashboard home page",
};

// Define sub-route links with icons + colors
const cards = [
  {
    title: "User Analysis",
    description: "Analyze platform users across different roles and engagement patterns.",
    icon: Users,
    accent: "bg-blue-100 text-blue-600",
    links: [
      { name: "Guardians", href: "/user-analysis/guardians", icon: ShieldUser, color: "text-blue-600" },
      { name: "Learners", href: "/user-analysis/learners", icon: GraduationCap, color: "text-indigo-600" },
    ],
  },
  {
    title: "Partner Analytics",
    description: "Track contributions and impact of partner organizations.",
    icon: Handshake,
    accent: "bg-green-100 text-green-600",
    links: [
      { name: "Schools", href: "/user-analysis/schools", icon: School2, color: "text-green-600" },
      { name: "Publishers", href: "/user-analysis/publishers", icon: Book, color: "text-emerald-600" },
      { name: "Partners", href: "/user-analysis/partners", icon: Handshake, color: "text-teal-600" },
    ],
  },
  {
    title: "Content Analysis",
    description: "Review performance of all content types on the platform.",
    icon: BookOpen,
    accent: "bg-purple-100 text-purple-600",
    links: [
      { name: "Books", href: "/user-analysis/books", icon: BookOpen, color: "text-purple-600" },
      { name: "Videos", href: "/user-analysis/videos", icon: Video, color: "text-pink-600" },
      { name: "Dals", href: "/user-analysis/dals", icon: NotebookText, color: "text-violet-600" },
      { name: "Simulations", href: "/user-analysis/simulations", icon: FlaskConical, color: "text-indigo-600" },
      { name: "Games", href: "/user-analysis/games", icon: Gamepad2, color: "text-fuchsia-600" },
    ],
  },
  {
    title: "User Feedback",
    description: "View and manage feedback, suggestions, and support tickets.",
    icon: MessageSquare,
    accent: "bg-orange-100 text-orange-600",
    links: [
      { name: "Feedback Dashboard", href: "/feedback", icon: MessageSquare, color: "text-orange-600" },
    ],
  },
];

export default async function DashboardPage() {
  // Get the user session
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="w-full px-10 mx-auto py-16">
      <div className="grid gap-6">
        {/* Welcome card */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Welcome, {session.user.name || "User"}!</CardTitle>
            <CardDescription>
              You are logged in as <span className="font-medium">{session.user.email}</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Access level:{" "}
              <strong className="text-primary">{session.user.role}</strong>
            </p>
          </CardContent>
        </Card>

        {/* Dashboard navigation cards */}
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <Card
                key={idx}
                className="group hover:shadow-md transition-all"
              >
                <CardHeader className="flex flex-row items-center gap-3">
                  <div
                    className={`p-2 rounded-xl ${card.accent} flex items-center justify-center`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-lg">{card.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">
                    {card.description}
                  </CardDescription>

                  {/* Links arranged inline like pills */}
                  <div className="flex flex-wrap gap-2">
                    {card.links.map((link, i) => {
                      const SubIcon = link.icon;
                      return (
                        <Link
                          key={i}
                          href={link.href}
                          className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium bg-muted hover:bg-muted/70 transition-colors"
                        >
                          <SubIcon className={`w-4 h-4 ${link.color}`} />
                          {link.name}
                        </Link>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}


{/*
import { Metadata } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Dashboard - Admin Portal",
  description: "Admin dashboard home page",
};

const cards = [
  {
    title: 'Users Database Schema',
    description: 'View the full ER diagram and relationships of the LoHo platform.',
    href: '/schema/users',
  },
  {
    title: 'Revenue Database Schema',
    description: 'View the full ER diagram and relationships of the LoHo platform.',
    href: '/schema/revenue',
  },
  {
    title: 'Users Schema Documentation',
    description: 'Read detailed documentation explaining each part of the users schema.',
    href: '/schema-docs/users',
  },
  {
    title: 'Revenue Schema Documentation',
    description: 'Read detailed documentation explaining each part of the revenue schema.',
    href: '/schema-docs/revenue',
  },
  {
    title: 'User Journey',
    description: 'View the LoHo Learning users login journey.',
    href: '/user-journey',
  },
  {
    title: 'User Analysis',
    description: 'Analyze user growth, activity levels, and engagement metrics.',
    href: '/user-analysis/guardians',
  },
  {
    title: 'Content Analysis',
    description: 'Review data related to content uploads, trends, and quality metrics.',
    href: '/content-analysis/books',
  },
  {
    title: 'Partner Analytics',
    description: 'Understand the impact and contributions of each partner organization.',
    href: '/partner-analysis',
  },
  {
    title: 'System Logs',
    description: 'Monitor backend activity and error logs in real time.',
    href: '/system-logs',
  },
  {
    title: 'Data Exports',
    description: 'Export data for external tools or reporting use.',
    href: '/data-exports',
  },
  {
    title: 'User Feedback',
    description: 'View and manage platform feedback and support tickets.',
    href: '/feedback',
  }
];

export default async function DashboardPage() {
  // Get the user session
  const session = await getServerSession(authOptions);
  
  // This should not happen due to middleware, but just in case
  if (!session) {
    redirect("/login");
  }
  
  return (
    <div className="w-full px-10 mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Welcome, {session.user.name || "User"}!</CardTitle>
            <CardDescription>
              You are logged in as {session.user.email}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Access level: <strong>{session.user.role}</strong>
            </p>
            <p className="mt-4">
              This is your admin dashboard. You have successfully authenticated with your 
              approved account.
            </p>
          </CardContent>
        </Card>
        
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((card, idx) => (
            <Card key={idx}>
              <CardContent className="p-4">
                <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
                <p className="text-muted-foreground mb-4">{card.description}</p>
                <Link
                  href={card.href}
                  className="inline-flex items-center text-sm font-medium text-blue-600 hover:underline"
                >
                  Go to {card.title} →
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
*/}