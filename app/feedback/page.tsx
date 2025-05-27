// app/feedback/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Message {
  created_at?: string;
  message: string;
  Message: string;
  email?: string;
  issue?: string;
  SchoolName?: string;
  NumberOfStudents?: number;
  FirstName?: string;
  LastName?: string;
}

export default function FeedbackPage() {
  const [inquiries, setInquiries] = useState<Message[]>([]);
  const [issues, setIssues] = useState<Message[]>([]);
  const [inquiriesCount, setInquiriesCount] = useState(5);
  const [issuesCount, setIssuesCount] = useState(5);

  useEffect(() => {
    const fetchMessages = async () => {
      const [inqRes, issRes] = await Promise.all([
        fetch('/api/analytics/user-analysis?collection=inquiries&limit=0'),
        fetch('/api/analytics/user-analysis?collection=issues&limit=0'),
      ]);
      const inquiriesData = (await inqRes.json()).data || [];
      const issuesData = (await issRes.json()).data || [];

      const sortByDateDesc = (a: Message, b: Message) => {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return dateB - dateA;
      };

      setInquiries(inquiriesData.sort(sortByDateDesc));
      setIssues(issuesData.sort(sortByDateDesc));
    };
    fetchMessages();
  }, []);

  const renderMessage = (msg: Message, type: 'inquiry' | 'issue', index: number) => {
    const formattedDate = msg.created_at ? new Date(msg.created_at).toLocaleString() : 'Unknown date';

    return (
      <Card key={index} className="flex items-start gap-4 p-4 border mb-4">
        <Avatar>
          <AvatarFallback>
            {msg.FirstName?.[0] || msg.email?.[0] || 'U'}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-1">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">
              {type === 'inquiry'
                ? `${msg.FirstName || ''} ${msg.LastName || ''}`.trim() || msg.SchoolName || 'Unknown'
                : msg.email || 'Unknown'}
            </span>{' '}
            — {formattedDate}
          </p>
          <div className="text-sm bg-muted p-3 rounded-md whitespace-pre-line">
            {msg.Message || msg.message || ''}
          </div>
          {type === 'issue' && msg.issue && (
            <p className="text-xs text-muted-foreground">Issue: {msg.issue}</p>
          )}
          {type === 'inquiry' && (
            <p className="text-xs text-muted-foreground">
              {msg.email && `Email: ${msg.email}`} {msg.NumberOfStudents && `• Students: ${msg.NumberOfStudents}`}
            </p>
          )}
        </div>
      </Card>
    );
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-xl font-semibold mb-4">Feedback</h1>
      <Tabs defaultValue="inquiries" className="space-y-6">
        <TabsList>
          <TabsTrigger value="inquiries">Inquiries</TabsTrigger>
          <TabsTrigger value="issues">Issues</TabsTrigger>
        </TabsList>

        <TabsContent value="inquiries">
          {inquiries.slice(0, inquiriesCount).map((msg, idx) => renderMessage(msg, 'inquiry', idx))}
          {inquiriesCount < inquiries.length && (
            <button
              className="text-sm text-blue-500 mt-2 hover:underline"
              onClick={() => setInquiriesCount((prev) => prev + 5)}
            >
              Load more inquiries
            </button>
          )}
        </TabsContent>

        <TabsContent value="issues">
          {issues.slice(0, issuesCount).map((msg, idx) => renderMessage(msg, 'issue', idx))}
          {issuesCount < issues.length && (
            <button
              className="text-sm text-blue-500 mt-2 hover:underline"
              onClick={() => setIssuesCount((prev) => prev + 5)}
            >
              Load more issues
            </button>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
