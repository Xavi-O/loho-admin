// components/admin/PendingUsersTable.tsx
"use client";

import { useState, useEffect } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { formatDistance } from "date-fns";

type PendingUser = {
  id: string;
  email: string;
  name: string;
  createdAt: string;
};

export function PendingUsersTable() {
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [approvalStatus, setApprovalStatus] = useState<Record<string, string>>({});

  // Fetch pending users
  const fetchPendingUsers = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch("/api/admin/pending-users");
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch pending users");
      }
      
      setPendingUsers(data.pendingUsers || []);
      
    } catch (err: any) {
      setError(err.message);
      setPendingUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Approve a user
  const approveUser = async (userId: string) => {
    setApprovalStatus(prev => ({ ...prev, [userId]: "loading" }));
    
    try {
      const response = await fetch("/api/admin/approve-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to approve user");
      }
      
      setApprovalStatus(prev => ({ ...prev, [userId]: "approved" }));
      
      // Remove the approved user from the list after a short delay
      setTimeout(() => {
        setPendingUsers(prev => prev.filter(user => user.id !== userId));
        setApprovalStatus(prev => {
          const newStatus = { ...prev };
          delete newStatus[userId];
          return newStatus;
        });
      }, 2000);
      
    } catch (err: any) {
      setApprovalStatus(prev => ({ ...prev, [userId]: "error" }));
      console.error("Error approving user:", err);
    }
  };

  // Load pending users on mount
  useEffect(() => {
    fetchPendingUsers();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending User Approvals</CardTitle>
        <CardDescription>
          Review and approve user registration requests
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center p-4">Loading pending users...</div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : pendingUsers.length === 0 ? (
          <div className="text-center p-4">No pending user approvals</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Registration Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {formatDistance(new Date(user.createdAt), new Date(), { addSuffix: true })}
                  </TableCell>
                  <TableCell className="text-right">
                    {approvalStatus[user.id] === "loading" ? (
                      <Button disabled variant="outline">
                        Approving...
                      </Button>
                    ) : approvalStatus[user.id] === "approved" ? (
                      <Button disabled variant="outline" className="text-green-500">
                        Approved
                      </Button>
                    ) : approvalStatus[user.id] === "error" ? (
                      <Button 
                        variant="destructive" 
                        onClick={() => approveUser(user.id)}
                      >
                        Try Again
                      </Button>
                    ) : (
                      <Button 
                        variant="default" 
                        onClick={() => approveUser(user.id)}
                      >
                        Approve
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        
        <div className="mt-4 flex justify-end">
          <Button
            variant="outline"
            onClick={fetchPendingUsers}
            disabled={isLoading}
          >
            Refresh List
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}