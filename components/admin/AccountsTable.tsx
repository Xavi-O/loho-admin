// components/admin/AccountsTable.tsx
"use client";

import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { formatDistance } from "date-fns";

type Account = {
  id: string;
  email: string;
  name: string;
  role: string;
  isActive: boolean;
  isApproved: boolean;
  createdAt: string;
  lastLogin?: string;
};

export function AccountsTable() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionStatus, setActionStatus] = useState<Record<string, string>>({});

  const fetchAccounts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/accounts");
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setAccounts(data.accounts || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAccountStatus = async (userId: string, action: 'enable' | 'disable') => {
    setActionStatus(prev => ({ ...prev, [userId]: "loading" }));
    try {
      const response = await fetch("/api/admin/toggle-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, action }),
      });
      
      if (!response.ok) throw new Error("Failed to update account");
      
      setAccounts(prev => prev.map(acc => 
        acc.id === userId ? { ...acc, isActive: action === 'enable' } : acc
      ));
      setActionStatus(prev => ({ ...prev, [userId]: "success" }));
      setTimeout(() => setActionStatus(prev => ({ ...prev, [userId]: "" })), 2000);
    } catch (err) {
      setActionStatus(prev => ({ ...prev, [userId]: "error" }));
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Accounts</CardTitle>
        <CardDescription>Manage user accounts and permissions</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center p-4">Loading accounts...</div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accounts.map((account) => (
                <TableRow key={account.id}>
                  <TableCell className="font-medium">{account.name}</TableCell>
                  <TableCell>{account.email}</TableCell>
                  <TableCell>
                    <Badge variant={account.role === 'superadmin' ? 'default' : 'secondary'}>
                      {account.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Badge variant={account.isApproved ? 'default' : 'destructive'}>
                        {account.isApproved ? 'Approved' : 'Pending'}
                      </Badge>
                      <Badge variant={account.isActive ? 'default' : 'secondary'}>
                        {account.isActive ? 'Active' : 'Disabled'}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    {formatDistance(new Date(account.createdAt), new Date(), { addSuffix: true })}
                  </TableCell>
                  <TableCell>
                    {account.role !== 'superadmin' && (
                      <div className="flex gap-2">
                        {actionStatus[account.id] === "loading" ? (
                          <Button disabled size="sm">Loading...</Button>
                        ) : (
                          <Button
                            size="sm"
                            variant={account.isActive ? "destructive" : "default"}
                            onClick={() => toggleAccountStatus(
                              account.id, 
                              account.isActive ? 'disable' : 'enable'
                            )}
                          >
                            {account.isActive ? 'Disable' : 'Enable'}
                          </Button>
                        )}
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        <div className="mt-4 flex justify-end">
          <Button variant="outline" onClick={fetchAccounts} disabled={isLoading}>
            Refresh
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}