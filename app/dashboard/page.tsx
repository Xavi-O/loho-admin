// app/dashboard/page.tsx
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