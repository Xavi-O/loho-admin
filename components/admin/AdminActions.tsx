// components/admin/AdminActions.tsx

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { 
  Settings, 
  UserPlus, 
  Mail, 
  Download, 
  Upload,
  Database,
  Shield
} from "lucide-react";

export function AdminActions() {
  const [createUserDialog, setCreateUserDialog] = useState(false);
  const [bulkEmailDialog, setBulkEmailDialog] = useState(false);
  const [systemSettingsDialog, setSystemSettingsDialog] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "user",
    sendInvite: true
  });
  const [emailData, setEmailData] = useState({
    subject: "",
    message: "",
    recipients: "all" // all, active, pending, admins
  });

  const handleCreateUser = async () => {
    try {
      const response = await fetch("/api/admin/create-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
      }

      toast.success("User created successfully");
      setCreateUserDialog(false);
      setNewUser({ name: "", email: "", role: "user", sendInvite: true });
    } catch (error: any) {
      toast.error(error.message || "Failed to create user");
    }
  };

  const handleBulkEmail = async () => {
    try {
      const response = await fetch("/api/admin/bulk-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(emailData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
      }

      const data = await response.json();
      toast.success(`Email sent to ${data.sentCount} users`);
      setBulkEmailDialog(false);
      setEmailData({ subject: "", message: "", recipients: "all" });
    } catch (error: any) {
      toast.error(error.message || "Failed to send bulk email");
    }
  };

  const handleExportUsers = async () => {
    try {
      const response = await fetch("/api/admin/export-users");
      if (!response.ok) throw new Error("Export failed");
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `users-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      
      toast.success("Users exported successfully");
    } catch (error) {
      toast.error("Failed to export users");
    }
  };

  const handleDatabaseCleanup = async () => {
    try {
      const response = await fetch("/api/admin/cleanup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "cleanup_old_sessions" }),
      });

      if (!response.ok) throw new Error("Cleanup failed");
      
      const data = await response.json();
      toast.success(`Cleanup completed: ${data.message}`);
    } catch (error) {
      toast.error("Failed to perform database cleanup");
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Admin Actions
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem onClick={() => setCreateUserDialog(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Create New User
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => setBulkEmailDialog(true)}>
            <Mail className="h-4 w-4 mr-2" />
            Send Bulk Email
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={handleExportUsers}>
            <Download className="h-4 w-4 mr-2" />
            Export User Data
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={handleDatabaseCleanup}>
            <Database className="h-4 w-4 mr-2" />
            Database Cleanup
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={() => setSystemSettingsDialog(true)}>
            <Shield className="h-4 w-4 mr-2" />
            System Settings
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Create User Dialog */}
      <Dialog open={createUserDialog} onOpenChange={setCreateUserDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
            <DialogDescription>
              Create a new user account and optionally send an invitation email.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                placeholder="Enter full name"
              />
            </div>
            
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                placeholder="Enter email address"
              />
            </div>
            
            <div>
              <Label htmlFor="role">Role</Label>
              <select
                id="role"
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                className="w-full p-2 border rounded-md"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="superadmin">Super Admin</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="sendInvite"
                checked={newUser.sendInvite}
                onChange={(e) => setNewUser({ ...newUser, sendInvite: e.target.checked })}
              />
              <Label htmlFor="sendInvite">Send invitation email</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateUserDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateUser}>Create User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Email Dialog */}
      <Dialog open={bulkEmailDialog} onOpenChange={setBulkEmailDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Send Bulk Email</DialogTitle>
            <DialogDescription>
              Send an email to multiple users at once.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="recipients">Recipients</Label>
              <select
                id="recipients"
                value={emailData.recipients}
                onChange={(e) => setEmailData({ ...emailData, recipients: e.target.value })}
                className="w-full p-2 border rounded-md"
              >
                <option value="all">All Users</option>
                <option value="active">Active Users Only</option>
                <option value="pending">Pending Approval</option>
                <option value="admins">Admins Only</option>
                <option value="unverified">Unverified Emails</option>
              </select>
            </div>
            
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={emailData.subject}
                onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                placeholder="Email subject"
              />
            </div>
            
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={emailData.message}
                onChange={(e) => setEmailData({ ...emailData, message: e.target.value })}
                placeholder="Email message content"
                rows={6}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setBulkEmailDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleBulkEmail}>Send Email</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* System Settings Dialog */}
      <Dialog open={systemSettingsDialog} onOpenChange={setSystemSettingsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>System Settings</DialogTitle>
            <DialogDescription>
              Configure system-wide settings and maintenance options.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">User Registration</h4>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" defaultChecked />
                  <span className="text-sm">Require admin approval for new users</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" defaultChecked />
                  <span className="text-sm">Require email verification</span>
                </label>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Security Settings</h4>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" />
                  <span className="text-sm">Enable two-factor authentication</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" defaultChecked />
                  <span className="text-sm">Log user activities</span>
                </label>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Maintenance</h4>
              <div className="space-y-2">
                <Button variant="outline" size="sm" onClick={handleDatabaseCleanup}>
                  Clean Old Sessions
                </Button>
                <Button variant="outline" size="sm">
                  Backup Database
                </Button>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setSystemSettingsDialog(false)}>
              Close
            </Button>
            <Button>Save Settings</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}