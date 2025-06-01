// components/admin/AccountsTable.tsx

"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { 
  MoreHorizontal, 
  Search, 
  Trash2, 
  UserCheck, 
  UserX, 
  Shield, 
  ShieldCheck,
  Mail,
  MailCheck,
  Crown,
  User
} from "lucide-react";

interface Account {
  id: string;
  email: string;
  name: string;
  role: string;
  isActive: boolean;
  isApproved: boolean;
  emailVerified: boolean;
  emailVerifiedAt: string | null;
  createdAt: string;
  lastLogin: string | null;
  image?: string;
}

interface AccountsTableProps {
  filterByRole?: string;
}

export function AccountsTable({ filterByRole }: AccountsTableProps) {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState(filterByRole || "all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; userId?: string; userName?: string }>({ open: false });
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 });

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });
      
      if (roleFilter !== "all") params.append("role", roleFilter);
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (searchTerm) params.append("search", searchTerm);

      const response = await fetch(`/api/admin/accounts?${params}`);
      if (!response.ok) throw new Error("Failed to fetch accounts");
      
      const data = await response.json();
      setAccounts(data.accounts);
      setPagination(data.pagination);
    } catch (error) {
      toast.error("Failed to fetch accounts");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, [pagination.page, roleFilter, statusFilter, searchTerm]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const response = await fetch("/api/admin/promote-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: newRole }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
      }

      toast.success("User role updated successfully");
      fetchAccounts();
    } catch (error: any) {
      toast.error(error.message || "Failed to update user role");
    }
  };

  const handleAccountToggle = async (userId: string, action: 'enable' | 'disable') => {
    try {
      const response = await fetch("/api/admin/toggle-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, action }),
      });

      if (!response.ok) throw new Error("Failed to toggle account");

      toast.success(`Account ${action}d successfully`);
      fetchAccounts();
    } catch (error) {
      toast.error(`Failed to ${action} account`);
    }
  };

  const handleEmailVerification = async (userId: string, action: 'verify' | 'unverify') => {
    try {
      const response = await fetch("/api/admin/email-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, action }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
      }

      toast.success(`Email ${action === 'verify' ? 'verified' : 'unverified'} successfully`);
      fetchAccounts();
    } catch (error: any) {
      toast.error(error.message || `Failed to ${action} email`);
    }
  };

  const handleDeleteAccount = async (userId: string) => {
    try {
      const response = await fetch("/api/admin/delete-account", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
      }

      toast.success("Account deleted successfully");
      setDeleteDialog({ open: false });
      fetchAccounts();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete account");
    }
  };

  const handleBulkAction = async (action: string, value?: string) => {
    if (selectedAccounts.length === 0) {
      toast.error("Please select accounts first");
      return;
    }

    try {
      const response = await fetch("/api/admin/bulk-actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userIds: selectedAccounts, action, value }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
      }

      const data = await response.json();
      toast.success(data.message);
      setSelectedAccounts([]);
      fetchAccounts();
    } catch (error: any) {
      toast.error(error.message || "Failed to perform bulk action");
    }
  };

  const getRoleBadge = (role: string) => {
    const variants = {
      superadmin: "destructive",
      admin: "secondary",
      user: "outline"
    } as const;
    
    const icons = {
      superadmin: Crown,
      admin: Shield,
      user: User
    };
    
    const Icon = icons[role as keyof typeof icons] || User;
    
    return (
      <Badge variant={variants[role as keyof typeof variants] || "outline"} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {role}
      </Badge>
    );
  };

  const getStatusBadges = (account: Account) => (
    <div className="flex flex-wrap gap-1">
      <Badge variant={account.isActive ? "default" : "destructive"}>
        {account.isActive ? "Active" : "Disabled"}
      </Badge>
      <Badge variant={account.isApproved ? "default" : "secondary"}>
        {account.isApproved ? "Approved" : "Pending"}
      </Badge>
      <Badge variant={account.emailVerified ? "default" : "outline"}>
        {account.emailVerified ? "Verified" : "Unverified"}
      </Badge>
    </div>
  );

  if (loading) {
    return <div className="flex justify-center p-8">Loading accounts...</div>;
  }

  return (
    <div className="space-y-4">
      {/* Filters and Search */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-8 w-64"
            />
          </div>
          
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="user">Users</SelectItem>
              <SelectItem value="admin">Admins</SelectItem>
              <SelectItem value="superadmin">Super Admins</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="disabled">Disabled</SelectItem>
              <SelectItem value="verified">Verified</SelectItem>
              <SelectItem value="unverified">Unverified</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Bulk Actions */}
        {selectedAccounts.length > 0 && (
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => handleBulkAction('approve')}
            >
              Approve Selected ({selectedAccounts.length})
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => handleBulkAction('activate')}
            >
              Activate Selected
            </Button>
            <Button 
              size="sm" 
              variant="destructive"
              onClick={() => handleBulkAction('delete')}
            >
              Delete Selected
            </Button>
          </div>
        )}
      </div>

      {/* Accounts Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedAccounts.length === accounts.length && accounts.length > 0}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedAccounts(accounts.map(a => a.id));
                    } else {
                      setSelectedAccounts([]);
                    }
                  }}
                />
              </TableHead>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead className="w-12">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {accounts.map((account) => (
              <TableRow key={account.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedAccounts.includes(account.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedAccounts([...selectedAccounts, account.id]);
                      } else {
                        setSelectedAccounts(selectedAccounts.filter(id => id !== account.id));
                      }
                    }}
                  />
                </TableCell>
                
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={account.image} />
                      <AvatarFallback>
                        {account.name?.charAt(0)?.toUpperCase() || account.email?.charAt(0)?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{account.name || "No name"}</div>
                      <div className="text-sm text-muted-foreground">{account.email}</div>
                    </div>
                  </div>
                </TableCell>
                
                <TableCell>
                  <Select
                    value={account.role}
                    onValueChange={(value) => handleRoleChange(account.id, value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue>{getRoleBadge(account.role)}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          User
                        </div>
                      </SelectItem>
                      <SelectItem value="admin">
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4" />
                          Admin
                        </div>
                      </SelectItem>
                      <SelectItem value="superadmin">
                        <div className="flex items-center gap-2">
                          <Crown className="h-4 w-4" />
                          Super Admin
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                
                <TableCell>{getStatusBadges(account)}</TableCell>
                
                <TableCell className="text-sm">
                  {new Date(account.createdAt).toLocaleDateString()}
                </TableCell>
                
                <TableCell className="text-sm">
                  {account.lastLogin 
                    ? new Date(account.lastLogin).toLocaleDateString()
                    : "Never"
                  }
                </TableCell>
                
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      {/* Account Status Actions */}
                      <DropdownMenuItem
                        onClick={() => handleAccountToggle(
                          account.id, 
                          account.isActive ? 'disable' : 'enable'
                        )}
                      >
                        {account.isActive ? (
                          <>
                            <UserX className="h-4 w-4 mr-2" />
                            Disable Account
                          </>
                        ) : (
                          <>
                            <UserCheck className="h-4 w-4 mr-2" />
                            Enable Account
                          </>
                        )}
                      </DropdownMenuItem>
                      
                      {/* Email Verification Actions */}
                      <DropdownMenuItem
                        onClick={() => handleEmailVerification(
                          account.id,
                          account.emailVerified ? 'unverify' : 'verify'
                        )}
                      >
                        {account.emailVerified ? (
                          <>
                            <Mail className="h-4 w-4 mr-2" />
                            Mark Email Unverified
                          </>
                        ) : (
                          <>
                            <MailCheck className="h-4 w-4 mr-2" />
                            Mark Email Verified
                          </>
                        )}
                      </DropdownMenuItem>
                      
                      <DropdownMenuSeparator />
                      
                      {/* Role Change Actions */}
                      {account.role !== 'admin' && (
                        <DropdownMenuItem
                          onClick={() => handleRoleChange(account.id, 'admin')}
                        >
                          <Shield className="h-4 w-4 mr-2" />
                          Promote to Admin
                        </DropdownMenuItem>
                      )}
                      
                      {account.role !== 'user' && (
                        <DropdownMenuItem
                          onClick={() => handleRoleChange(account.id, 'user')}
                        >
                          <User className="h-4 w-4 mr-2" />
                          Demote to User
                        </DropdownMenuItem>
                      )}
                      
                      <DropdownMenuSeparator />
                      
                      {/* Delete Action */}
                      <DropdownMenuItem
                        onClick={() => setDeleteDialog({ 
                          open: true, 
                          userId: account.id, 
                          userName: account.name || account.email 
                        })}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Account
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
            {pagination.total} accounts
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
              disabled={pagination.page === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
              disabled={pagination.page === pagination.totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Account</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the account for "{deleteDialog.userName}"? 
              This action cannot be undone and will permanently remove all user data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteDialog.userId && handleDeleteAccount(deleteDialog.userId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}