// app/schema-docs/users/page.tsx
"use client";

import { useState } from 'react';
import { Menu, X, User, School, BookOpen, ClipboardList, BarChart, Users, GitBranch, Database, Bell, Filter, SidebarClose, SidebarOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function SchemaDocumentation() {
  const [activeSidebarItem, setActiveSidebarItem] = useState('collections');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Content sections based on sidebar selection
  const renderContent = () => {
    switch (activeSidebarItem) {
      case 'collections':
        return <CollectionsSection />;
      case 'relationships':
        return <RelationshipsSection />;
      case 'indexes':
        return <IndexesSection />;
      case 'subscription':
        return <SubscriptionSection />;
      case 'filters':
        return <FiltersSection />;
      default:
        return <CollectionsSection />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <div className={`fixed h-full bg-muted z-30 transition-all duration-300 ${sidebarOpen ? 'w-1/5' : 'hidden'}`}>
        <div className="h-full flex flex-col p-4 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <Button variant="ghost" size="icon" onClick={toggleSidebar}>
              <SidebarClose className="h-5 w-5" />
            </Button>
          </div>
          
          <nav className="space-y-2">
            <SidebarItem 
              icon={<Database className="h-5 w-5" />} 
              title="Collections" 
              active={activeSidebarItem === 'collections'} 
              onClick={() => setActiveSidebarItem('collections')}
            />
            <SidebarItem 
              icon={<GitBranch className="h-5 w-5" />} 
              title="Relationships" 
              active={activeSidebarItem === 'relationships'} 
              onClick={() => setActiveSidebarItem('relationships')}
            />
            <SidebarItem 
              icon={<Database className="h-5 w-5" />} 
              title="Indexes" 
              active={activeSidebarItem === 'indexes'} 
              onClick={() => setActiveSidebarItem('indexes')}
            />
            <SidebarItem 
              icon={<Bell className="h-5 w-5" />} 
              title="Subscription Management" 
              active={activeSidebarItem === 'subscription'} 
              onClick={() => setActiveSidebarItem('subscription')}
            />
            <SidebarItem 
              icon={<Filter className="h-5 w-5" />} 
              title="Dynamic Filters" 
              active={activeSidebarItem === 'filters'} 
              onClick={() => setActiveSidebarItem('filters')}
            />
          </nav>
        </div>
      </div>
      
      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <div className="sticky top-0 z-20 bg-background px-6 py-4 flex">
          
          {!sidebarOpen && (
            <Button variant="ghost" size="icon" onClick={toggleSidebar}>
              <SidebarOpen className="h-5 w-5" />
            </Button>
          )}
          <h6 className="text-lg font-bold ml-6">Database Schema Documentation</h6>
        </div>
        
        <div className="p-6 h-[calc(100vh-73px)] overflow-y-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

// Sidebar Item Component
function SidebarItem({ icon, title, active, onClick }) {
  return (
    <button
      className={`flex items-center space-x-3 w-full p-3 rounded-md text-left transition-colors ${
        active ? 'bg-primary text-primary-foreground' : 'hover:bg-muted-foreground/10'
      }`}
      onClick={onClick}
    >
      {icon}
      <span>{title}</span>
    </button>
  );
}

// Collections Section
function CollectionsSection() {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <User className="h-5 w-5 text-primary" />
            <CardTitle>Users Collection</CardTitle>
          </div>
          <CardDescription>Core user information including role, type, and subscription details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">Schema</h3>
              <pre className="bg-muted p-4 rounded-md overflow-x-auto mt-2">
{`{
  id: ObjectId,                  // Primary key
  lohoUserId: String,            // Custom format identifier
  role: String,                  // "learner" | "teacher" | "guardian"
  type: String,                  // "B2B" | "B2C"
  firstName: String,
  lastName: String,
  contact: {
    phone: String,
    email: String
  },
  associatedSchoolId: ObjectId,  // if B2B
  associatedPartnerApp: String,  // if B2C through partner
  guardianIds: [ObjectId],       // if learner (can be empty)
  teacherIds: [ObjectId],        // if learner (can be empty)
  subscription: {
    tier: String,                // "Dhahabu" | "Fedha"
    startDate: Date,
    endDate: Date,
    renewalRemindersSent: {
      oneMonth: Boolean,
      oneWeek: Boolean,
      oneDay: Boolean,
      onDate: Boolean
    }
  },
  dateJoined: Date
}`}
              </pre>
            </div>
            
            <div>
              <h3 className="text-lg font-medium">LoHoUserID Format</h3>
              <div className="bg-muted p-4 rounded-md mt-2">
                <p className="mb-2">Format: <code>[RolePrefix]-[B2B/B2C]-[RandomCode]-[YearJoined]</code></p>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>RolePrefix</strong>: LN (Learner), TE (Teacher), GU (Guardian)</li>
                  <li><strong>B2B/B2C</strong>: Business type identifier</li>
                  <li><strong>RandomCode</strong>: Unique alphanumeric code (e.g., X9J3K7)</li>
                  <li><strong>YearJoined</strong>: 4-digit year (e.g., 2025)</li>
                </ul>
                <p className="mt-2">Example: <code>LN-B2C-X9J3K7-2025</code> for a B2C Learner who joined in 2025</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <School className="h-5 w-5 text-primary" />
            <CardTitle>Schools Collection</CardTitle>
          </div>
          <CardDescription>Information about educational institutions</CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-md overflow-x-auto">
{`{
  id: ObjectId,             // Primary key
  name: String,
  type: [String],           // Can be multi-tagged: 
                            //  "government", "ICT center", "NGO", "special needs", etc.
  subtype: String,          // e.g., "boarding", "urban"
  country: String,
  region: String,
  sponsor: {
    name: String,
    contact: String         // optional
  },
  isPublic: Boolean,        // Public or private
  isRefugee: Boolean        // Refugee or otherwise
}`}
          </pre>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <CardTitle>Content Collection</CardTitle>
          </div>
          <CardDescription>Educational content available on the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-md overflow-x-auto">
{`{
  id: ObjectId,             // Primary key
  title: String,
  type: String,             // "eBook" | "Video" | "LabSimulation" | "Dal" | "Game"
  subject: String,
  level: String,            // e.g., Grade 5, Year 7, etc.
  tags: [String],
  url: String,              // media storage or CDN path
  createdBy: ObjectId,      // User or Admin
  isEmbedded: Boolean,      // Whether content is embedded via API keys
  partnerId: ObjectId       // Related partner if applicable
}`}
          </pre>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <ClipboardList className="h-5 w-5 text-primary" />
            <CardTitle>Quizzes Collection</CardTitle>
          </div>
          <CardDescription>Assessment materials linked to content</CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-md overflow-x-auto">
{`{
  id: ObjectId,             // Primary key
  title: String,
  subject: String,
  level: String,            // e.g., Grade 5, Year 7, etc.
  contentId: ObjectId,      // optional link to related content
  questions: [{
    question: String,
    options: [String],
    correctAnswer: String,
    explanation: String
  }],
  createdBy: ObjectId       // User or Admin
}`}
          </pre>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <BarChart className="h-5 w-5 text-primary" />
            <CardTitle>Quiz Results Collection</CardTitle>
          </div>
          <CardDescription>Performance data from quiz completions</CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-md overflow-x-auto">
{`{
  id: ObjectId,             // Primary key
  learnerId: ObjectId,
  quizId: ObjectId,
  score: Number,
  completedAt: Date,
  answers: [{
    questionId: ObjectId,
    selectedOption: String,
    correct: Boolean
  }]
}`}
          </pre>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-primary" />
            <CardTitle>Partners Collection</CardTitle>
          </div>
          <CardDescription>Third-party integration partners</CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-md overflow-x-auto">
{`{
  id: ObjectId,             // Primary key
  name: String,
  externalAppId: String,
  contactPerson: {
    name: String,
    email: String
  },
  users: [ObjectId],        // B2C users consuming through this partner
  contentIds: [ObjectId],   // Content provided by this partner
  apiKeys: [{               // API keys for embedded content
    key: String,
    service: String,
    lastUsed: Date
  }]
}`}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}

// Relationships Section
function RelationshipsSection() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Learner-Teacher-Guardian Relationships</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-muted p-4 rounded-md">
            <h3 className="text-lg font-medium mb-3">Hierarchy and Permissions</h3>
            <p className="mb-4">The primary user is the <strong>Learner</strong>, who consumes platform content. Learner accounts can only be created and managed by <strong>Guardian</strong> or <strong>Teacher</strong> accounts, which exist at the same hierarchical level.</p>
            
            <h4 className="font-medium mb-2">Relationship Rules:</h4>
            <ul className="list-disc pl-5 space-y-1 mb-4">
              <li>Learners must have at least one Guardian OR one Teacher</li>
              <li>Learners can have multiple Teachers (for different subjects/classes)</li>
              <li>Learners can have multiple Guardians</li>
              <li>Teachers can be associated with multiple Learners</li>
              <li>Guardians can be associated with multiple Learners</li>
            </ul>
            
            <h4 className="font-medium mb-2">Implementation:</h4>
            <p>These relationships are represented by arrays of references in the Users collection:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Learner users have <code>guardianIds</code> and <code>teacherIds</code> arrays</li>
              <li>Both arrays can contain multiple ObjectIds</li>
              <li>Application layer enforces that at least one of these arrays must not be empty</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>School-User Relationships</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-muted p-4 rounded-md">
            <p className="mb-4">B2B users (Learners, Teachers, Guardians) are associated with Schools through the <code>associatedSchoolId</code> field in the Users collection.</p>
            
            <h4 className="font-medium mb-2">School Categorization:</h4>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li><strong>Type</strong>: Public/Private, Government/NGO/ICT center/Special needs</li>
              <li><strong>Subtype</strong>: Boarding/Urban/etc.</li>
              <li><strong>Sponsorship</strong>: Sponsored/Not sponsored (with sponsor details if applicable)</li>
              <li><strong>Refugee Status</strong>: Refugee/Otherwise</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Partner-Content-User Relationships</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-muted p-4 rounded-md">
            <p className="mb-4">Partners provide content and may have users consuming through their applications:</p>
            
            <ul className="list-disc pl-5 space-y-2">
              <li>B2C users can be associated with Partners through the <code>associatedPartnerApp</code> field</li>
              <li>Content can be linked to Partners through the <code>partnerId</code> field</li>
              <li>Content may be embedded via API keys stored in the Partners collection</li>
              <li>Quizzes can be linked to Content through the <code>contentId</code> field</li>
              <li>Quiz Results connect Learners to Quizzes via <code>learnerId</code> and <code>quizId</code></li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Indexes Section
function IndexesSection() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Recommended Indexes</CardTitle>
          <CardDescription>Performance optimization through strategic indexing</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="bg-muted p-4 rounded-md">
              <h3 className="font-semibold mb-2">Users Collection Indexes</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-md p-3">
                  <h4 className="font-medium">lohoUserId</h4>
                  <Badge className="mt-1">Unique</Badge>
                  <p className="text-sm mt-2">Ensures fast lookups by unique user identifier</p>
                </div>
                <div className="border rounded-md p-3">
                  <h4 className="font-medium">subscription.endDate</h4>
                  <Badge className="mt-1">Standard</Badge>
                  <p className="text-sm mt-2">Optimizes subscription renewal tracking</p>
                </div>
                <div className="border rounded-md p-3">
                  <h4 className="font-medium">role + type</h4>
                  <Badge className="mt-1">Compound</Badge>
                  <p className="text-sm mt-2">Quickly filter user types (e.g., B2B teachers)</p>
                </div>
                <div className="border rounded-md p-3">
                  <h4 className="font-medium">associatedSchoolId</h4>
                  <Badge className="mt-1">Standard</Badge>
                  <p className="text-sm mt-2">Find all users under a specific school</p>
                </div>
              </div>
            </div>

            <div className="bg-muted p-4 rounded-md">
              <h3 className="font-semibold mb-2">Content & Quiz Indexes</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-md p-3">
                  <h4 className="font-medium">subject + level</h4>
                  <Badge className="mt-1">Compound</Badge>
                  <p className="text-sm mt-2">Filter content by subject and grade level</p>
                </div>
                <div className="border rounded-md p-3">
                  <h4 className="font-medium">type</h4>
                  <Badge className="mt-1">Standard</Badge>
                  <p className="text-sm mt-2">Quick filtering by content type</p>
                </div>
                <div className="border rounded-md p-3">
                  <h4 className="font-medium">contentId</h4>
                  <Badge className="mt-1">Standard</Badge>
                  <p className="text-sm mt-2">Fast lookups for quizzes related to content</p>
                </div>
                <div className="border rounded-md p-3">
                  <h4 className="font-medium">partnerId</h4>
                  <Badge className="mt-1">Standard</Badge>
                  <p className="text-sm mt-2">Find all content from a specific partner</p>
                </div>
              </div>
            </div>

            <div className="bg-muted p-4 rounded-md">
              <h3 className="font-semibold mb-2">Quiz Results Indexes</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-md p-3">
                  <h4 className="font-medium">learnerId</h4>
                  <Badge className="mt-1">Standard</Badge>
                  <p className="text-sm mt-2">Retrieve all quiz results for a learner</p>
                </div>
                <div className="border rounded-md p-3">
                  <h4 className="font-medium">learnerId + quizId</h4>
                  <Badge className="mt-1">Compound</Badge>
                  <p className="text-sm mt-2">Check if a learner has completed a specific quiz</p>
                </div>
                <div className="border rounded-md p-3">
                  <h4 className="font-medium">completedAt</h4>
                  <Badge className="mt-1">Standard</Badge>
                  <p className="text-sm mt-2">Sort and filter results by completion date</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Subscription Section
function SubscriptionSection() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Subscription Management</CardTitle>
          <CardDescription>Automated renewal notifications and subscription tracking</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="bg-muted p-4 rounded-md">
              <h3 className="font-semibold mb-3">Subscription Structure</h3>
              <pre className="bg-background p-3 rounded-md overflow-x-auto">
{`subscription: {
  tier: "Dhahabu" | "Fedha",
  startDate: Date,
  endDate: Date,
  renewalRemindersSent: {
    oneMonth: Boolean,
    oneWeek: Boolean,
    oneDay: Boolean,
    onDate: Boolean
  }
}`}
              </pre>
            </div>

            <div className="bg-muted p-4 rounded-md">
              <h3 className="font-semibold mb-3">Renewal Notification System</h3>
              <p className="mb-3">A scheduled cron job or trigger checks for upcoming subscription expirations:</p>
              
              <div className="border rounded-md p-4 mb-4">
                <h4 className="font-medium mb-2">Process Flow:</h4>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>Daily scan of all user records</li>
                  <li>Calculate days remaining until <code>subscription.endDate</code></li>
                  <li>Determine if eligible for 1 month, 1 week, 1 day, or on-date reminder</li>
                  <li>Check corresponding flag in <code>renewalRemindersSent</code></li>
                  <li>If not sent, trigger notification and update flag</li>
                </ol>
              </div>
              
              <div className="border rounded-md p-4">
                <h4 className="font-medium mb-2">Notification Channels:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Email notifications (via <code>contact.email</code>)</li>
                  <li>SMS alerts (via <code>contact.phone</code>)</li>
                  <li>In-app notifications</li>
                </ul>
              </div>
            </div>

            <div className="bg-muted p-4 rounded-md">
              <h3 className="font-semibold mb-3">Subscription Tiers</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-md p-4">
                  <h4 className="font-medium">Dhahabu Tier</h4>
                  <p className="text-sm mt-2">Premium access tier with all platform features</p>
                  <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                    <li>Full content library access</li>
                    <li>Unlimited quizzes</li>
                    <li>Advanced reporting</li>
                    <li>Priority support</li>
                  </ul>
                </div>
                <div className="border rounded-md p-4">
                  <h4 className="font-medium">Fedha Tier</h4>
                  <p className="text-sm mt-2">Standard access tier with core features</p>
                  <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                    <li>Limited content library access</li>
                    <li>Basic quiz functionality</li>
                    <li>Standard reporting</li>
                    <li>Regular support</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Filters Section
function FiltersSection() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Dynamic Filters</CardTitle>
          <CardDescription>Common query patterns and filtering strategies</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="bg-muted p-4 rounded-md">
              <h3 className="font-semibold mb-3">User Filtering</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-md p-3">
                  <h4 className="font-medium">By Role and Type</h4>
                  <p className="text-sm mt-2">Filter users by their role and business type</p>
                  <pre className="bg-background text-sm p-2 rounded-md mt-2 overflow-x-auto">
{`{
  role: "learner",
  type: "B2B"
}`}
                  </pre>
                </div>
                <div className="border rounded-md p-3">
                  <h4 className="font-medium">By School</h4>
                  <p className="text-sm mt-2">Find all users associated with a school</p>
                  <pre className="bg-background text-sm p-2 rounded-md mt-2 overflow-x-auto">
{`{
  associatedSchoolId: schoolObjectId
}`}
                  </pre>
                </div>
                <div className="border rounded-md p-3">
                  <h4 className="font-medium">By Subscription Status</h4>
                  <p className="text-sm mt-2">Find users with soon-expiring subscriptions</p>
                  <pre className="bg-background text-sm p-2 rounded-md mt-2 overflow-x-auto">
{`{
  "subscription.endDate": {
    $lte: new Date(today + 30 days)
  }
}`}
                  </pre>
                </div>
                <div className="border rounded-md p-3">
                  <h4 className="font-medium">By Guardian/Teacher</h4>
                  <p className="text-sm mt-2">Find all learners associated with a specific guardian/teacher</p>
                  <pre className="bg-background text-sm p-2 rounded-md mt-2 overflow-x-auto">
{`{
  role: "learner",
  $or: [
    { guardianIds: guardianObjectId },
    { teacherIds: teacherObjectId }
  ]
}`}
                  </pre>
                </div>
              </div>
            </div>

            <div className="bg-muted p-4 rounded-md">
              <h3 className="font-semibold mb-3">Content Filtering</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-md p-3">
                  <h4 className="font-medium">By Subject and Level</h4>
                  <p className="text-sm mt-2">Find content for a specific subject and grade</p>
                  <pre className="bg-background text-sm p-2 rounded-md mt-2 overflow-x-auto">
{`{
  subject: "Mathematics",
  level: "Grade 5"
}`}
                  </pre>
                </div>
                <div className="border rounded-md p-3">
                  <h4 className="font-medium">By Content Type</h4>
                  <p className="text-sm mt-2">Filter by specific content formats</p>
                  <pre className="bg-background text-sm p-2 rounded-md mt-2 overflow-x-auto">
{`{
  type: { $in: ["Video", "Game"] }
}`}
                  </pre>
                </div>
                <div className="border rounded-md p-3">
                  <h4 className="font-medium">By Tags</h4>
                  <p className="text-sm mt-2">Find content with specific tags</p>
                  <pre className="bg-background text-sm p-2 rounded-md mt-2 overflow-x-auto">
{`{
  tags: { $in: ["interactive", "assessment"] }
}`}
                  </pre>
                </div>
                <div className="border rounded-md p-3">
                  <h4 className="font-medium">By Partner</h4>
                  <p className="text-sm mt-2">Find content from a specific partner</p>
                  <pre className="bg-background text-sm p-2 rounded-md mt-2 overflow-x-auto">
{`{
  partnerId: partnerObjectId
}`}
                  </pre>
                </div>
              </div>
            </div>

            <div className="bg-muted p-4 rounded-md">
              <h3 className="font-semibold mb-3">School Filtering</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-md p-3">
                  <h4 className="font-medium">By Type</h4>
                  <p className="text-sm mt-2">Filter schools by their categorization</p>
                  <pre className="bg-background text-sm p-2 rounded-md mt-2 overflow-x-auto">
{`{
  type: { $in: ["government", "special needs"] }
}`}
                  </pre>
                </div>
                <div className="border rounded-md p-3">
                  <h4 className="font-medium">By Region/Country</h4>
                  <p className="text-sm mt-2">Find schools in specific locations</p>
                  <pre className="bg-background text-sm p-2 rounded-md mt-2 overflow-x-auto">
{`{
  country: "Kenya",
  region: "Nairobi"
}`}
                  </pre>
                </div>
                <div className="border rounded-md p-3">
                  <h4 className="font-medium">By Sponsorship</h4>
                  <p className="text-sm mt-2">Find schools with sponsors</p>
                  <pre className="bg-background text-sm p-2 rounded-md mt-2 overflow-x-auto">
{`{
  "sponsor.name": { $exists: true, $ne: "" }
}`}
                  </pre>
                </div>
                <div className="border rounded-md p-3">
                  <h4 className="font-medium">By Refugee Status</h4>
                  <p className="text-sm mt-2">Find refugee schools</p>
                  <pre className="bg-background text-sm p-2 rounded-md mt-2 overflow-x-auto">
{`{
  isRefugee: true
}`}
                  </pre>
                </div>
              </div>
            </div>

            <div className="bg-muted p-4 rounded-md">
              <h3 className="font-semibold mb-3">Quiz Results Analysis</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-md p-3">
                  <h4 className="font-medium">By Learner Performance</h4>
                  <p className="text-sm mt-2">Find quiz results above a certain score</p>
                  <pre className="bg-background text-sm p-2 rounded-md mt-2 overflow-x-auto">
{`{
  learnerId: learnerObjectId,
  score: { $gte: 80 }
}`}
                  </pre>
                </div>
                <div className="border rounded-md p-3">
                  <h4 className="font-medium">By Completion Date</h4>
                  <p className="text-sm mt-2">Find quizzes completed in a date range</p>
                  <pre className="bg-background text-sm p-2 rounded-md mt-2 overflow-x-auto">
{`{
  completedAt: {
    $gte: startDate,
    $lte: endDate
  }
}`}
                  </pre>
                </div>
                <div className="border rounded-md p-3">
                  <h4 className="font-medium">By Quiz Topic</h4>
                  <p className="text-sm mt-2">Aggregate results for a specific quiz</p>
                  <pre className="bg-background text-sm p-2 rounded-md mt-2 overflow-x-auto">
{`{
  quizId: quizObjectId
}`}
                  </pre>
                </div>
                <div className="border rounded-md p-3">
                  <h4 className="font-medium">Performance Aggregation</h4>
                  <p className="text-sm mt-2">Calculate average scores by subject</p>
                  <pre className="bg-background text-sm p-2 rounded-md mt-2 overflow-x-auto">
{`db.quiz_results.aggregate([
  { $lookup: { from: "quizzes", ... } },
  { $group: { _id: "$subject", avgScore: { $avg: "$score" } } }
])`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}