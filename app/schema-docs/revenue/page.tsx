// app/schema-docs/revenue/page.tsx
"use client";

import { useState } from 'react';
import { DollarSign, Calculator, Users, TrendingUp, Database, Bell, SidebarClose, SidebarOpen, PieChart, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function RevenueDocumentation() {
  const [activeSidebarItem, setActiveSidebarItem] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Content sections based on sidebar selection
  const renderContent = () => {
    switch (activeSidebarItem) {
      case 'overview':
        return <OverviewSection />;
      case 'collections':
        return <CollectionsSection />;
      case 'calculations':
        return <CalculationsSection />;
      case 'partners':
        return <PartnersSection />;
      case 'scenarios':
        return <ScenariosSection />;
      case 'formulas':
        return <FormulasSection />;
      default:
        return <OverviewSection />;
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
              icon={<TrendingUp className="h-5 w-5" />} 
              title="Overview" 
              active={activeSidebarItem === 'overview'} 
              onClick={() => setActiveSidebarItem('overview')}
            />
            <SidebarItem 
              icon={<Database className="h-5 w-5" />} 
              title="Collections Schema" 
              active={activeSidebarItem === 'collections'} 
              onClick={() => setActiveSidebarItem('collections')}
            />
            <SidebarItem 
              icon={<Calculator className="h-5 w-5" />} 
              title="Calculations" 
              active={activeSidebarItem === 'calculations'} 
              onClick={() => setActiveSidebarItem('calculations')}
            />
            <SidebarItem 
              icon={<Users className="h-5 w-5" />} 
              title="Partner Revenue" 
              active={activeSidebarItem === 'partners'} 
              onClick={() => setActiveSidebarItem('partners')}
            />
            <SidebarItem 
              icon={<BarChart3 className="h-5 w-5" />} 
              title="Scenarios" 
              active={activeSidebarItem === 'scenarios'} 
              onClick={() => setActiveSidebarItem('scenarios')}
            />
            <SidebarItem 
              icon={<PieChart className="h-5 w-5" />} 
              title="Formulas & Examples" 
              active={activeSidebarItem === 'formulas'} 
              onClick={() => setActiveSidebarItem('formulas')}
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
          <h6 className="text-lg font-bold ml-6">Revenue Distribution Documentation</h6>
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

// Overview Section
function OverviewSection() {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <CardTitle>Revenue Distribution System Overview</CardTitle>
          </div>
          <CardDescription>Comprehensive revenue sharing model for LoHo platform stakeholders</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 border rounded-lg bg-blue-50">
                <h4 className="font-semibold text-blue-700">Base Subscription</h4>
                <p className="text-2xl font-bold text-blue-800">KES 2,000</p>
                <p className="text-sm text-blue-600">Per user annually</p>
              </div>
              <div className="p-4 border rounded-lg bg-green-50">
                <h4 className="font-semibold text-green-700">LoHo Share</h4>
                <p className="text-2xl font-bold text-green-800">50%</p>
                <p className="text-sm text-green-600">Of adjusted revenue</p>
              </div>
              <div className="p-4 border rounded-lg bg-purple-50">
                <h4 className="font-semibold text-purple-700">Content Pool</h4>
                <p className="text-2xl font-bold text-purple-800">50%</p>
                <p className="text-sm text-purple-600">Distributed to publishers</p>
              </div>
              <div className="p-4 border rounded-lg bg-orange-50">
                <h4 className="font-semibold text-orange-700">Partner Share</h4>
                <p className="text-2xl font-bold text-orange-800">0-30%</p>
                <p className="text-sm text-orange-600">Channel dependent</p>
              </div>
            </div>

            <div className="bg-muted p-4 rounded-md">
              <h3 className="text-lg font-medium mb-3">Revenue Flow Process</h3>
              <ol className="list-decimal pl-5 space-y-2">
                <li><strong>User Payment:</strong> Annual subscription of KES 2,000 collected</li>
                <li><strong>Channel Deduction:</strong> Partner fees deducted (if applicable)</li>
                <li><strong>Fixed Costs:</strong> Simulation license and Sprix fees deducted</li>
                <li><strong>50/50 Split:</strong> Remaining revenue split between LoHo and content pool</li>
                <li><strong>Weighted Distribution:</strong> Content pool distributed based on usage metrics</li>
                <li><strong>Publisher Payment:</strong> Final payments calculated with tier multipliers</li>
              </ol>
            </div>

            <div className="bg-muted p-4 rounded-md">
              <h3 className="text-lg font-medium mb-3">Key Components</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-primary mb-2">Distribution Channels</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Direct LoHo Platform (100% revenue retention)</li>
                    <li>Elimu Pepe App via Safaricom (70% retention)</li>
                    <li>Other partner channels (variable rates)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-primary mb-2">Content Types</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>eBooks (pages read)</li>
                    <li>Videos (minutes watched)</li>
                    <li>Lab Simulations (completions)</li>
                    <li>Quizzes (attempts/completions)</li>
                    <li>Courses (completion rate)</li>
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

// Collections Section
function CollectionsSection() {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5 text-primary" />
            <CardTitle>User Revenue Collection</CardTitle>
          </div>
          <CardDescription>Core revenue tracking for each user subscription</CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-md overflow-x-auto">
{`{
  id: ObjectId,                    // Primary key
  userId: ObjectId,                // Reference to Users collection
  annualSubscription: Number,      // Base subscription amount (KES 2000)
  distributionChannel: String,     // "direct" | "elimu_pepe" | "partner"
  channelPartner: String,          // Partner identifier if applicable
  subscriptionTier: String,        // "Dhahabu" | "Fedha"
  subscriptionDate: Date,          // When subscription started
  renewalDate: Date,               // Next renewal date
  status: String,                  // "active" | "expired" | "cancelled"
  paymentHistory: [{
    amount: Number,
    paymentDate: Date,
    paymentMethod: String,
    transactionId: String
  }],
  createdAt: Date,
  updatedAt: Date
}`}
          </pre>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Calculator className="h-5 w-5 text-primary" />
            <CardTitle>Content Consumption Metrics</CardTitle>
          </div>
          <CardDescription>Tracking user interactions with content for revenue distribution</CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-md overflow-x-auto">
{`{
  id: ObjectId,                    // Primary key
  userId: ObjectId,                // Reference to Users collection
  contentId: ObjectId,             // Reference to Content collection
  contentType: String,             // "eBook" | "Video" | "LabSimulation" | "Quiz" | "Course"
  rawMetric: Number,               // Raw consumption (pages, minutes, completions)
  rawUnits: Number,                // Converted base units
  tierMultiplier: Number,          // 1.0 for Fedha, 1.5 for Dhahabu
  weightedUnits: Number,           // rawUnits * tierMultiplier
  subscriptionTier: String,        // User's subscription tier
  consumptionDate: Date,           // When content was consumed
  sessionDuration: Number,         // Time spent (minutes)
  completionRate: Number,          // Percentage completed (0-100)
  publisherId: ObjectId,           // Content publisher
  isActive: Boolean,               // Whether to include in calculations
  createdAt: Date
}`}
          </pre>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-primary" />
            <CardTitle>Partner Deductions</CardTitle>
          </div>
          <CardDescription>Tracking partner fees and revenue sharing</CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-md overflow-x-auto">
{`{
  id: ObjectId,                    // Primary key
  userId: ObjectId,                // Reference to Users collection
  partnerId: ObjectId,             // Reference to Partners collection
  partnerName: String,             // "Safaricom", "Sprix Learning", etc.
  deductionType: String,           // "percentage" | "fixed_fee" | "per_user"
  amount: Number,                  // Deduction amount
  percentage: Number,              // If percentage-based (e.g., 30%)
  currency: String,                // "KES" | "USD"
  period: String,                  // "2024-01" (YYYY-MM)
  calculationDate: Date,           // When calculated
  status: String,                  // "pending" | "processed" | "paid"
  description: String,             // Human readable description
  metadata: {
    originalRevenue: Number,
    netRevenue: Number,
    exchangeRate: Number           // If currency conversion needed
  }
}`}
          </pre>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <PieChart className="h-5 w-5 text-primary" />
            <CardTitle>Content Royalty Pool</CardTitle>
          </div>
          <CardDescription>Monthly/quarterly revenue pool for content distribution</CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-md overflow-x-auto">
{`{
  id: ObjectId,                    // Primary key
  period: String,                  // "2024-01" (YYYY-MM)
  totalUsers: Number,              // Active subscribers in period
  grossRevenue: Number,            // Total subscription revenue
  partnerDeductions: Number,       // Total partner fees
  fixedCosts: Number,              // Simulation + Sprix fees
  lohoShare: Number,               // 50% of adjusted revenue
  contentPoolAmount: Number,       // 50% of adjusted revenue
  totalWeightedUnits: Number,      // Sum of all weighted units consumed
  perUnitValue: Number,            // contentPoolAmount / totalWeightedUnits
  calculationDate: Date,           // When pool was calculated
  status: String,                  // "calculated" | "distributed" | "closed"
  breakdown: {
    directUsers: Number,
    partnerUsers: Number,
    dhahabuUsers: Number,
    fedhaUsers: Number
  }
}`}
          </pre>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            <CardTitle>Publisher Payments</CardTitle>
          </div>
          <CardDescription>Final payment calculations for content publishers</CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-md overflow-x-auto">
{`{
  id: ObjectId,                    // Primary key
  publisherId: ObjectId,           // Reference to Publishers collection
  publisherName: String,           // Publisher display name
  period: String,                  // "2024-01" (YYYY-MM)
  contentItems: [{
    contentId: ObjectId,
    contentTitle: String,
    contentType: String,
    totalWeightedUnits: Number,
    grossAmount: Number
  }],
  totalWeightedUnits: Number,      // Sum across all content
  grossAmount: Number,             // Total before deductions
  publisherDeductions: [{
    type: String,                  // "platform_fee" | "processing_fee"
    percentage: Number,
    amount: Number
  }],
  totalDeductions: Number,         // Sum of all deductions
  netAmount: Number,               // Final payment amount
  currency: String,                // Payment currency
  paymentDate: Date,               // When payment was made
  paymentMethod: String,           // "bank_transfer" | "mobile_money"
  paymentReference: String,        // Transaction reference
  status: String,                  // "calculated" | "pending" | "paid" | "failed"
  calculatedAt: Date,
  updatedAt: Date
}`}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}

// Calculations Section
function CalculationsSection() {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Calculator className="h-5 w-5 text-primary" />
            <CardTitle>Revenue Calculation Process</CardTitle>
          </div>
          <CardDescription>Step-by-step breakdown of revenue distribution calculations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="bg-muted p-4 rounded-md">
              <h3 className="text-lg font-medium mb-3">Step 1: Gross Revenue Collection</h3>
              <div className="bg-background p-3 rounded-md">
                <p className="font-mono text-sm">Base Revenue = KES 2,000 per user per year</p>
                <p className="text-sm mt-2">Example: 1,000 active users = KES 2,000,000 gross revenue</p>
              </div>
            </div>

            <div className="bg-muted p-4 rounded-md">
              <h3 className="text-lg font-medium mb-3">Step 2: Channel Deductions</h3>
              <div className="space-y-2">
                <div className="bg-background p-3 rounded-md">
                  <p className="font-semibold">Direct LoHo Platform:</p>
                  <p className="font-mono text-sm">Net Revenue = Gross Revenue × 100%</p>
                  <p className="text-sm">Example: KES 2,000,000 × 1.0 = KES 2,000,000</p>
                </div>
                <div className="bg-background p-3 rounded-md">
                  <p className="font-semibold">Elimu Pepe App (Safaricom):</p>
                  <p className="font-mono text-sm">Net Revenue = Gross Revenue × 70%</p>
                  <p className="text-sm">Example: KES 2,000,000 × 0.7 = KES 1,400,000</p>
                </div>
              </div>
            </div>

            <div className="bg-muted p-4 rounded-md">
              <h3 className="text-lg font-medium mb-3">Step 3: Fixed Cost Deductions</h3>
              <div className="bg-background p-3 rounded-md">
                <p className="font-semibold">Annual Fixed Costs:</p>
                <ul className="list-disc pl-5 text-sm mt-2 space-y-1">
                  <li>Simulation License: USD 750 (≈ KES 112,500 at 1:150 rate)</li>
                  <li>Sprix Learning: KES 200 per user (KES 200,000 for 1,000 users)</li>
                </ul>
                <p className="font-mono text-sm mt-2">Adjusted Revenue = Net Revenue - Fixed Costs</p>
                <p className="text-sm">Example: KES 2,000,000 - KES 312,500 = KES 1,687,500</p>
              </div>
            </div>

            <div className="bg-muted p-4 rounded-md">
              <h3 className="text-lg font-medium mb-3">Step 4: 50/50 Revenue Split</h3>
              <div className="bg-background p-3 rounded-md">
                <p className="font-mono text-sm">LoHo Share = Adjusted Revenue × 50%</p>
                <p className="font-mono text-sm">Content Pool = Adjusted Revenue × 50%</p>
                <p className="text-sm mt-2">Example:</p>
                <ul className="list-disc pl-5 text-sm space-y-1">
                  <li>LoHo Share: KES 1,687,500 × 0.5 = KES 843,750</li>
                  <li>Content Pool: KES 1,687,500 × 0.5 = KES 843,750</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            <CardTitle>Weighted Units Calculation</CardTitle>
          </div>
          <CardDescription>Converting content consumption into distributable units</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="bg-muted p-4 rounded-md">
              <h3 className="text-lg font-medium mb-3">Content Type Conversions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-background p-3 rounded-md">
                  <h4 className="font-semibold">eBooks</h4>
                  <p className="font-mono text-sm">Units = Pages Read ÷ 10</p>
                  <p className="text-sm">Example: 50 pages = 5 units</p>
                </div>
                <div className="bg-background p-3 rounded-md">
                  <h4 className="font-semibold">Videos</h4>
                  <p className="font-mono text-sm">Units = Minutes Watched</p>
                  <p className="text-sm">Example: 30 minutes = 30 units</p>
                </div>
                <div className="bg-background p-3 rounded-md">
                  <h4 className="font-semibold">Lab Simulations</h4>
                  <p className="font-mono text-sm">Units = Completions</p>
                  <p className="text-sm">Example: 3 completions = 3 units</p>
                </div>
                <div className="bg-background p-3 rounded-md">
                  <h4 className="font-semibold">Quizzes</h4>
                  <p className="font-mono text-sm">Units = Attempts</p>
                  <p className="text-sm">Example: 5 attempts = 5 units</p>
                </div>
              </div>
            </div>

            <div className="bg-muted p-4 rounded-md">
              <h3 className="text-lg font-medium mb-3">Tier Multipliers</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-background p-3 rounded-md">
                  <h4 className="font-semibold">Dhahabu Tier (Premium)</h4>
                  <p className="font-mono text-sm">Weighted Units = Base Units × 1.5</p>
                  <p className="text-sm">Example: 20 units × 1.5 = 30 weighted units</p>
                </div>
                <div className="bg-background p-3 rounded-md">
                  <h4 className="font-semibold">Fedha Tier (Standard)</h4>
                  <p className="font-mono text-sm">Weighted Units = Base Units × 1.0</p>
                  <p className="text-sm">Example: 20 units × 1.0 = 20 weighted units</p>
                </div>
              </div>
            </div>

            <div className="bg-muted p-4 rounded-md">
              <h3 className="text-lg font-medium mb-3">Per-Unit Value Calculation</h3>
              <div className="bg-background p-3 rounded-md">
                <p className="font-mono text-sm">Per Unit Value = Content Pool Amount ÷ Total Weighted Units</p>
                <p className="text-sm mt-2">Example:</p>
                <ul className="list-disc pl-5 text-sm space-y-1">
                  <li>Content Pool: KES 843,750</li>
                  <li>Total Weighted Units: 50,000</li>
                  <li>Per Unit Value: KES 843,750 ÷ 50,000 = KES 16.88 per unit</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Partners Section
function PartnersSection() {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-primary" />
            <CardTitle>Partner Revenue Sharing Models</CardTitle>
          </div>
          <CardDescription>Different revenue sharing arrangements with platform partners</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="bg-muted p-4 rounded-md">
              <h3 className="text-lg font-medium mb-3">Distribution Channel Partners</h3>
              <div className="space-y-4">
                <div className="bg-background p-4 rounded-md border-l-4 border-blue-500">
                  <h4 className="font-semibold text-blue-700">Safaricom (Elimu Pepe App)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <div>
                      <p className="text-sm"><strong>Share:</strong> 30% of gross revenue</p>
                      <p className="text-sm"><strong>LoHo Retention:</strong> 70%</p>
                      <p className="text-sm"><strong>Payment Terms:</strong> Monthly</p>
                    </div>
                    <div>
                      <p className="text-sm"><strong>Services Provided:</strong></p>
                      <ul className="list-disc pl-5 text-xs space-y-1">
                        <li>Mobile payment processing</li>
                        <li>App store distribution</li>
                        <li>Customer acquisition</li>
                        <li>Technical support</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-muted p-4 rounded-md">
              <h3 className="text-lg font-medium mb-3">Content & Service Partners</h3>
              <div className="space-y-4">
                <div className="bg-background p-4 rounded-md border-l-4 border-green-500">
                  <h4 className="font-semibold text-green-700">Simulation License Provider</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <div>
                      <p className="text-sm"><strong>Cost:</strong> USD 750 annually</p>
                      <p className="text-sm"><strong>Payment:</strong> Fixed annual fee</p>
                      <p className="text-sm"><strong>Currency:</strong> US Dollars</p>
                    </div>
                    <div>
                      <p className="text-sm"><strong>Services Provided:</strong></p>
                      <ul className="list-disc pl-5 text-xs space-y-1">
                        <li>Lab simulation access</li>
                        <li>API integration support</li>
                        <li>Content updates</li>
                        <li>Technical maintenance</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-background p-4 rounded-md border-l-4 border-purple-500">
                  <h4 className="font-semibold text-purple-700">Sprix Learning</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <div>
                      <p className="text-sm"><strong>Cost:</strong> KES 200 per user annually</p>
                      <p className="text-sm"><strong>Payment:</strong> Per active user</p>
                      <p className="text-sm"><strong>Currency:</strong> Kenyan Shillings</p>
                    </div>
                    <div>
                      <p className="text-sm"><strong>Services Provided:</strong></p>
                      <ul className="list-disc pl-5 text-xs space-y-1">
                        <li>Educational content library</li>
                        <li>Assessment tools</li>
                        <li>Analytics dashboard</li>
                        <li>Progress tracking</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-muted p-4 rounded-md">
              <h3 className="text-lg font-medium mb-3">Partner Payment Calculations</h3>
              <div className="bg-background p-4 rounded-md">
                <h4 className="font-semibold mb-2">Monthly Calculation Example (1,000 users):</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Gross Revenue:</strong> KES 2,000,000 ÷ 12 = KES 166,667/month</p>
                  <p><strong>Safaricom Share (30% of Elimu Pepe users):</strong></p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Assuming 300 users via Elimu Pepe: KES 50,000 × 0.30 = KES 15,000</li>
                    <li>Net from Elimu Pepe users: KES 50,000 - KES 15,000 = KES 35,000</li>
                  </ul>
                  <p><strong>Fixed Costs (Monthly):</strong></p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Simulation License: USD 750 ÷ 12 = USD 62.50 (≈ KES 9,375)</li>
                    <li>Sprix Learning: KES 200 × 1,000 ÷ 12 = KES 16,667</li>
                    <li>Total Fixed Costs: KES 26,042</li>
                  </ul>
                  <p><strong>Adjusted Revenue:</strong> KES 166,667 - KES 15,000 - KES 26,042 = KES 125,625</p>
                  <p><strong>Final Split:</strong> LoHo = KES 62,813 | Content Pool = KES 62,813</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5 text-primary" />
            <CardTitle>Partner Payment Schedules</CardTitle>
          </div>
          <CardDescription>When and how partners receive their revenue shares</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-muted">
                  <th className="border border-gray-300 p-2 text-left">Partner</th>
                  <th className="border border-gray-300 p-2 text-left">Payment Frequency</th>
                  <th className="border border-gray-300 p-2 text-left">Payment Method</th>
                  <th className="border border-gray-300 p-2 text-left">Currency</th>
                  <th className="border border-gray-300 p-2 text-left">Processing Time</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 p-2">Safaricom</td>
                  <td className="border border-gray-300 p-2">Monthly</td>
                  <td className="border border-gray-300 p-2">Bank Transfer</td>
                  <td className="border border-gray-300 p-2">KES</td>
                  <td className="border border-gray-300 p-2">15th of following month</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2">Simulation Provider</td>
                  <td className="border border-gray-300 p-2">Annually</td>
                  <td className="border border-gray-300 p-2">Wire Transfer</td>
                  <td className="border border-gray-300 p-2">USD</td>
                  <td className="border border-gray-300 p-2">January 31st</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2">Sprix Learning</td>
                  <td className="border border-gray-300 p-2">Quarterly</td>
                  <td className="border border-gray-300 p-2">Bank Transfer</td>
                  <td className="border border-gray-300 p-2">KES</td>
                  <td className="border border-gray-300 p-2">15th of quarter end</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Scenarios Section
function ScenariosSection() {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            <CardTitle>Revenue Distribution Scenarios</CardTitle>
          </div>
          <CardDescription>Real-world examples of revenue calculations across different user distributions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="bg-muted p-4 rounded-md">
              <h3 className="text-lg font-medium mb-3">Scenario 1: Small Scale (500 Users)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-background p-3 rounded-md">
                  <h4 className="font-semibold mb-2">User Distribution:</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Direct LoHo: 300 users (60%)</li>
                    <li>• Elimu Pepe: 200 users (40%)</li>
                    <li>• Dhahabu Tier: 100 users (20%)</li>
                    <li>• Fedha Tier: 400 users (80%)</li>
                  </ul>
                </div>
                <div className="bg-background p-3 rounded-md">
                  <h4 className="font-semibold mb-2">Revenue Breakdown:</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Gross Revenue: KES 1,000,000</li>
                    <li>• Safaricom Share: KES 120,000</li>
                    <li>• Fixed Costs: KES 212,500</li>
                    <li>• Adjusted Revenue: KES 667,500</li>
                    <li>• Content Pool: KES 333,750</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-muted p-4 rounded-md">
              <h3 className="text-lg font-medium mb-3">Scenario 2: Medium Scale (2,000 Users)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-background p-3 rounded-md">
                  <h4 className="font-semibold mb-2">User Distribution:</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Direct LoHo: 1,200 users (60%)</li>
                    <li>• Elimu Pepe: 800 users (40%)</li>
                    <li>• Dhahabu Tier: 600 users (30%)</li>
                    <li>• Fedha Tier: 1,400 users (70%)</li>
                  </ul>
                </div>
                <div className="bg-background p-3 rounded-md">
                  <h4 className="font-semibold mb-2">Revenue Breakdown:</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Gross Revenue: KES 4,000,000</li>
                    <li>• Safaricom Share: KES 480,000</li>
                    <li>• Fixed Costs: KES 512,500</li>
                    <li>• Adjusted Revenue: KES 3,007,500</li>
                    <li>• Content Pool: KES 1,503,750</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-muted p-4 rounded-md">
              <h3 className="text-lg font-medium mb-3">Scenario 3: Large Scale (10,000 Users)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-background p-3 rounded-md">
                  <h4 className="font-semibold mb-2">User Distribution:</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Direct LoHo: 6,000 users (60%)</li>
                    <li>• Elimu Pepe: 4,000 users (40%)</li>
                    <li>• Dhahabu Tier: 4,000 users (40%)</li>
                    <li>• Fedha Tier: 6,000 users (60%)</li>
                  </ul>
                </div>
                <div className="bg-background p-3 rounded-md">
                  <h4 className="font-semibold mb-2">Revenue Breakdown:</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Gross Revenue: KES 20,000,000</li>
                    <li>• Safaricom Share: KES 2,400,000</li>
                    <li>• Fixed Costs: KES 2,112,500</li>
                    <li>• Adjusted Revenue: KES 15,487,500</li>
                    <li>• Content Pool: KES 7,743,750</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <PieChart className="h-5 w-5 text-primary" />
            <CardTitle>Publisher Payment Examples</CardTitle>
          </div>
          <CardDescription>Sample publisher earnings based on content consumption</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="bg-muted p-4 rounded-md">
              <h3 className="text-lg font-medium mb-3">Publisher A: Video Content Creator</h3>
              <div className="bg-background p-3 rounded-md">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h4 className="font-semibold text-sm">Content Consumption</h4>
                    <ul className="text-xs space-y-1 mt-2">
                      <li>• 5,000 minutes watched (Fedha)</li>
                      <li>• 3,000 minutes watched (Dhahabu)</li>
                      <li>• Total weighted units: 9,500</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Earnings Calculation</h4>
                    <ul className="text-xs space-y-1 mt-2">
                      <li>• Per unit value: KES 16.88</li>
                      <li>• Gross earnings: KES 160,360</li>
                      <li>• Platform fee (5%): KES 8,018</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Final Payment</h4>
                    <p className="text-lg font-bold text-green-600 mt-2">KES 152,342</p>
                    <p className="text-xs">Monthly payment</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-muted p-4 rounded-md">
              <h3 className="text-lg font-medium mb-3">Publisher B: eBook Author</h3>
              <div className="bg-background p-3 rounded-md">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h4 className="font-semibold text-sm">Content Consumption</h4>
                    <ul className="text-xs space-y-1 mt-2">
                      <li>• 8,000 pages read (Fedha)</li>
                      <li>• 4,000 pages read (Dhahabu)</li>
                      <li>• Total weighted units: 1,400</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Earnings Calculation</h4>
                    <ul className="text-xs space-y-1 mt-2">
                      <li>• Per unit value: KES 16.88</li>
                      <li>• Gross earnings: KES 23,632</li>
                      <li>• Platform fee (5%): KES 1,182</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Final Payment</h4>
                    <p className="text-lg font-bold text-green-600 mt-2">KES 22,450</p>
                    <p className="text-xs">Monthly payment</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-muted p-4 rounded-md">
              <h3 className="text-lg font-medium mb-3">Publisher C: Quiz & Assessment Creator</h3>
              <div className="bg-background p-3 rounded-md">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h4 className="font-semibold text-sm">Content Consumption</h4>
                    <ul className="text-xs space-y-1 mt-2">
                      <li>• 2,000 quiz attempts (Fedha)</li>
                      <li>• 1,500 quiz attempts (Dhahabu)</li>
                      <li>• Total weighted units: 4,250</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Earnings Calculation</h4>
                    <ul className="text-xs space-y-1 mt-2">
                      <li>• Per unit value: KES 16.88</li>
                      <li>• Gross earnings: KES 71,740</li>
                      <li>• Platform fee (5%): KES 3,587</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Final Payment</h4>
                    <p className="text-lg font-bold text-green-600 mt-2">KES 68,153</p>
                    <p className="text-xs">Monthly payment</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Formulas Section
function FormulasSection() {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Calculator className="h-5 w-5 text-primary" />
            <CardTitle>Mathematical Formulas</CardTitle>
          </div>
          <CardDescription>Complete mathematical formulas used in revenue distribution calculations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="bg-muted p-4 rounded-md">
              <h3 className="text-lg font-medium mb-3">Core Revenue Formulas</h3>
              <div className="space-y-4">
                <div className="bg-background p-3 rounded-md">
                  <h4 className="font-semibold">1. Gross Revenue Calculation</h4>
                  <p className="font-mono text-sm mt-2">GrossRevenue = NumberOfUsers × AnnualSubscriptionFee</p>
                  <p className="text-xs text-muted-foreground">Where AnnualSubscriptionFee = KES 2,000</p>
                </div>
                
                <div className="bg-background p-3 rounded-md">
                  <h4 className="font-semibold">2. Channel-Adjusted Revenue</h4>
                  <p className="font-mono text-sm mt-2">ChannelRevenue = GrossRevenue × (1 - ChannelFeePercentage)</p>
                  <p className="text-xs text-muted-foreground">Where ChannelFeePercentage varies by partner (e.g., 0.30 for Safaricom)</p>
                </div>
                
                <div className="bg-background p-3 rounded-md">
                  <h4 className="font-semibold">3. Fixed Costs Deduction</h4>
                  <p className="font-mono text-sm mt-2">AdjustedRevenue = ChannelRevenue - SimulationLicenseCost - SprixCost</p>
                  <p className="text-xs text-muted-foreground">SimulationLicenseCost = USD 750 × ExchangeRate, SprixCost = NumberOfUsers × KES 200</p>
                </div>
                
                <div className="bg-background p-3 rounded-md">
                  <h4 className="font-semibold">4. Revenue Split</h4>
                  <p className="font-mono text-sm mt-2">LoHoShare = AdjustedRevenue × 0.5</p>
                  <p className="font-mono text-sm">ContentPool = AdjustedRevenue × 0.5</p>
                </div>
              </div>
            </div>

            <div className="bg-muted p-4 rounded-md">
              <h3 className="text-lg font-medium mb-3">Content Consumption Formulas</h3>
              <div className="space-y-4">
                <div className="bg-background p-3 rounded-md">
                  <h4 className="font-semibold">5. Base Units Conversion</h4>
                  <div className="space-y-2 text-sm">
                    <p className="font-mono">eBookUnits = PagesRead ÷ 10</p>
                    <p className="font-mono">VideoUnits = MinutesWatched</p>
                    <p className="font-mono">LabUnits = CompletionsCount</p>
                    <p className="font-mono">QuizUnits = AttemptsCount</p>
                  </div>
                </div>
                
                <div className="bg-background p-3 rounded-md">
                  <h4 className="font-semibold">6. Weighted Units Calculation</h4>
                  <p className="font-mono text-sm mt-2">WeightedUnits = BaseUnits × TierMultiplier</p>
                  <p className="text-xs text-muted-foreground">TierMultiplier: Dhahabu = 1.5, Fedha = 1.0</p>
                </div>
                
                <div className="bg-background p-3 rounded-md">
                  <h4 className="font-semibold">7. Per-Unit Value</h4>
                  <p className="font-mono text-sm mt-2">PerUnitValue = ContentPool ÷ TotalWeightedUnits</p>
                  <p className="text-xs text-muted-foreground">Where TotalWeightedUnits is the sum of all weighted units across all content</p>
                </div>
              </div>
            </div>

            <div className="bg-muted p-4 rounded-md">
              <h3 className="text-lg font-medium mb-3">Publisher Payment Formulas</h3>
              <div className="space-y-4">
                <div className="bg-background p-3 rounded-md">
                  <h4 className="font-semibold">8. Publisher Gross Earnings</h4>
                  <p className="font-mono text-sm mt-2">PublisherGross = PublisherWeightedUnits × PerUnitValue</p>
                  <p className="text-xs text-muted-foreground">PublisherWeightedUnits is the sum of weighted units for all publisher's content</p>
                </div>
                
                <div className="bg-background p-3 rounded-md">
                  <h4 className="font-semibold">9. Platform Fee Deduction</h4>
                  <p className="font-mono text-sm mt-2">PlatformFee = PublisherGross × PlatformFeePercentage</p>
                  <p className="text-xs text-muted-foreground">PlatformFeePercentage typically 5% (0.05)</p>
                </div>
                
                <div className="bg-background p-3 rounded-md">
                  <h4 className="font-semibold">10. Final Publisher Payment</h4>
                  <p className="font-mono text-sm mt-2">PublisherPayment = PublisherGross - PlatformFee - ProcessingFees</p>
                  <p className="text-xs text-muted-foreground">ProcessingFees may include bank transfer charges or mobile money fees</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <PieChart className="h-5 w-5 text-primary" />
            <CardTitle>Complete Worked Example</CardTitle>
          </div>
          <CardDescription>Step-by-step calculation with real numbers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted p-4 rounded-md">
            <h3 className="text-lg font-medium mb-3">Example: 1,000 Users, Mixed Distribution</h3>
            <div className="space-y-4">
              <div className="bg-background p-3 rounded-md">
                <h4 className="font-semibold">Given:</h4>
                <ul className="text-sm space-y-1 mt-2">
                  <li>• Total Users: 1,000</li>
                  <li>• Direct LoHo: 700 users</li>
                  <li>• Elimu Pepe: 300 users</li>
                  <li>• Dhahabu Tier: 400 users</li>
                  <li>• Fedha Tier: 600 users</li>
                  <li>• Exchange Rate: 1 USD = 150 KES</li>
                </ul>
              </div>
              
              <div className="bg-background p-3 rounded-md">
                <h4 className="font-semibold">Step 1: Gross Revenue</h4>
                <p className="font-mono text-sm">GrossRevenue = 1,000 × 2,000 = KES 2,000,000</p>
              </div>
              
              <div className="bg-background p-3 rounded-md">
                <h4 className="font-semibold">Step 2: Channel Deductions</h4>
                <p className="font-mono text-sm">SafaricomShare = (300 × 2,000) × 0.30 = KES 180,000</p>
                <p className="font-mono text-sm">NetRevenue = 2,000,000 - 180,000 = KES 1,820,000</p>
              </div>
              
              <div className="bg-background p-3 rounded-md">
                <h4 className="font-semibold">Step 3: Fixed Costs</h4>
                <p className="font-mono text-sm">SimulationCost = 750 × 150 = KES 112,500</p>
                <p className="font-mono text-sm">SprixCost = 1,000 × 200 = KES 200,000</p>
                <p className="font-mono text-sm">TotalFixedCosts = 312,500</p>
              </div>
              
              <div className="bg-background p-3 rounded-md">
                <h4 className="font-semibold">Step 4: Adjusted Revenue</h4>
                <p className="font-mono text-sm">AdjustedRevenue = 1,820,000 - 312,500 = KES 1,507,500</p>
              </div>
              
              <div className="bg-background p-3 rounded-md">
                <h4 className="font-semibold">Step 5: Revenue Split</h4>
                <p className="font-mono text-sm">LoHoShare = 1,507,500 × 0.5 = KES 753,750</p>
                <p className="font-mono text-sm">ContentPool = 1,507,500 × 0.5 = KES 753,750</p>
              </div>
              
              <div className="bg-background p-3 rounded-md">
                <h4 className="font-semibold">Step 6: Per-Unit Value (Assuming 45,000 total weighted units)</h4>
                <p className="font-mono text-sm">PerUnitValue = 753,750 ÷ 45,000 = KES 16.75</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Bell className="h-5 w-5 text-primary" />
            <CardTitle>Implementation Notes</CardTitle>
          </div>
          <CardDescription>Important considerations for implementing this revenue model</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <h4 className="font-semibold text-yellow-800">Currency Exchange</h4>
              <p className="text-sm text-yellow-700 mt-1">Exchange rates should be updated regularly. Consider using monthly averages for consistency in calculations.</p>
            </div>
            
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
              <h4 className="font-semibold text-blue-800">Rounding & Precision</h4>
              <p className="text-sm text-blue-700 mt-1">Use appropriate rounding for currency calculations. Maintain at least 4 decimal places in intermediate calculations.</p>
            </div>
            
            <div className="bg-red-50 border-l-4 border-red-400 p-4">
              <h4 className="font-semibold text-red-800">Data Validation</h4>
              <p className="text-sm text-red-700 mt-1">Always validate consumption metrics. Implement caps on unusual activity to prevent gaming of the system.</p>
            </div>
            
            <div className="bg-green-50 border-l-4 border-green-400 p-4">
              <h4 className="font-semibold text-green-800">Audit Trail</h4>
              <p className="text-sm text-green-700 mt-1">Maintain detailed logs of all calculations for transparency and debugging. Store intermediate values for verification.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}