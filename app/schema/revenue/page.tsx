// app/schema/revenue/page.tsx
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Mermaid from "@/components/Mermaid";

export default function RevenueDistributionSchema() {
  const [activeTab, setActiveTab] = useState("overview");

  // Revenue Flow Overview
  const revenueOverviewDiagram = `
    flowchart TD
      UR[User Revenue: KES 2000/year] --> DC{Distribution Channel?}
      
      DC -->|Direct LoHo| LNR[LoHo Net Revenue: 100%]
      DC -->|Elimu Pepe App| SPD[Safaricom Deduction: 30%]
      SPD --> LNR2[LoHo Net Revenue: 70%]
      
      LNR --> FD[Fixed Deductions]
      LNR2 --> FD
      
      FD --> SLF[Simulation License Fee: USD 750/year]
      FD --> SPF[Sprix Learning Fee: KES 200/user/year]
      
      SLF --> AR[Adjusted Revenue]
      SPF --> AR
      
      AR --> LS[LoHo Share: 50%]
      AR --> CRP[Content Royalty Pool: 50%]
      
      CRP --> PD[Publisher Deductions]
      PD --> WU[Weighted Units Calculation]
      WU --> TM[Tier Multiplier Applied]
      TM --> FP[Final Publisher Payment]
      
      style UR fill:#e1f5fe
      style CRP fill:#f3e5f5
      style FP fill:#e8f5e8
  `;

  // Detailed Revenue Calculation Flow
  const calculationFlowDiagram = `
    sequenceDiagram
      participant U as User Subscription
      participant RD as Revenue Distributor
      participant P as Partners
      participant L as LoHo
      participant CP as Content Publishers
      
      U->>RD: KES 2000 Annual Payment
      
      alt Via Elimu Pepe App
        RD->>P: 30% to Safaricom (KES 600)
        RD->>RD: Net Revenue = KES 1400
      else Direct LoHo Platform
        RD->>RD: Net Revenue = KES 2000
      end
      
      RD->>P: USD 750 Simulation License (Annual)
      RD->>P: KES 200 Sprix Learning Fee
      
      RD->>L: 50% LoHo Share
      RD->>CP: 50% Content Royalty Pool
      
      CP->>CP: Calculate Weighted Units
      CP->>CP: Apply Tier Multipliers
      CP->>CP: Apply Publisher Deductions
  `;

  // Content Consumption Metrics Schema
  const consumptionMetricsDiagram = `
    erDiagram
      CONTENT_CONSUMPTION {
        string contentId PK
        string userId PK
        string contentType
        float rawMetric
        float weightedUnits
        string subscriptionTier
        float tierMultiplier
        datetime consumptionDate
        boolean isActive
      }
      
      CONTENT_TYPES {
        string type PK
        string metricName
        float unitConversion
        string description
      }
      
      SUBSCRIPTION_TIERS {
        string tier PK
        float multiplier
        string description
      }
      
      PUBLISHER_AGREEMENTS {
        string publisherId PK
        string contentId PK
        float royaltyPercentage
        float deductionPercentage
        datetime agreementDate
        boolean isActive
      }
      
      CONTENT_CONSUMPTION ||--|| CONTENT_TYPES : uses
      CONTENT_CONSUMPTION ||--|| SUBSCRIPTION_TIERS : applies
      CONTENT_CONSUMPTION ||--|| PUBLISHER_AGREEMENTS : governed_by
  `;

  // Revenue Distribution Collections Schema
  const revenueCollectionsDiagram = `
    erDiagram
      USER_REVENUE {
        string userId PK
        float annualSubscription
        string distributionChannel
        string subscriptionTier
        datetime subscriptionDate
        datetime renewalDate
        boolean isActive
      }
      
      PARTNER_DEDUCTIONS {
        string deductionId PK
        string partnerId
        string userId
        string deductionType
        float amount
        float percentage
        string currency
        datetime processedDate
      }
      
      CONTENT_ROYALTY_POOL {
        string poolId PK
        string period
        float totalPoolAmount
        float totalWeightedUnits
        float perUnitValue
        datetime calculationDate
        string status
      }
      
      PUBLISHER_PAYMENTS {
        string paymentId PK
        string publisherId
        string contentId
        float weightedUnits
        float grossAmount
        float deductions
        float netAmount
        string period
        datetime paymentDate
      }
      
      REVENUE_AUDIT_LOG {
        string logId PK
        string userId
        string transactionType
        float amount
        string description
        datetime timestamp
        string processedBy
      }
      
      USER_REVENUE ||--o{ PARTNER_DEDUCTIONS : generates
      USER_REVENUE ||--|| CONTENT_ROYALTY_POOL : contributes_to
      CONTENT_ROYALTY_POOL ||--o{ PUBLISHER_PAYMENTS : distributes_to
      PUBLISHER_PAYMENTS ||--|| REVENUE_AUDIT_LOG : creates
  `;

  // Partner Revenue Sharing Schema
  const partnerRevenueDiagram = `
    erDiagram
      PARTNERS {
        string partnerId PK
        string partnerName
        string partnerType
        float sharePercentage
        float fixedFee
        string currency
        string paymentTerms
        boolean isActive
      }
      
      PARTNER_REVENUE_SHARE {
        string shareId PK
        string partnerId
        string period
        float totalUsers
        float grossRevenue
        float partnerShare
        string calculationMethod
        datetime calculationDate
      }
      
      SAFARICOM_ELIMU_PEPE {
        string recordId PK
        string userId
        float userRevenue
        float partnerShare
        datetime transactionDate
        string appVersion
      }
      
      SIMULATION_LICENSE {
        string licenseId PK
        float annualFee
        string currency
        string providerId
        datetime renewalDate
        boolean isActive
      }
      
      SPRIX_LEARNING {
        string recordId PK
        string userId
        float perUserFee
        datetime accessGranted
        boolean isActive
      }
      
      PARTNERS ||--o{ PARTNER_REVENUE_SHARE : has
      PARTNERS ||--o{ SAFARICOM_ELIMU_PEPE : includes
      PARTNERS ||--|| SIMULATION_LICENSE : may_have
      PARTNERS ||--o{ SPRIX_LEARNING : includes
  `;

  // Weighted Units Calculation Logic
  const weightedUnitsLogicDiagram = `
    flowchart TD
      CM[Content Consumption Metrics] --> CT{Content Type?}
      
      CT -->|eBooks| EB["Pages Read ÷ 10 = Units<br/>Example: 50 pages = 5 units"]
      CT -->|Videos| VD["Minutes Watched = Units<br/>Example: 30 minutes = 30 units"]
      CT -->|Simulations| SM["Completions = Units<br/>Example: 3 runs = 3 units"]
      CT -->|Quizzes| QZ["Completions = Units<br/>Example: 2 quizzes = 2 units"]
      CT -->|Courses| CR["Course Completions = Units<br/>Example: 1 course = 1 unit"]
      
      EB --> TM[Apply Tier Multiplier]
      VD --> TM
      SM --> TM
      QZ --> TM
      CR --> TM
      
      TM --> ST{Subscription Tier?}
      ST -->|Dhahabu| DH["Units × 1.5<br/>Example: 10 units = 15 weighted units"]
      ST -->|Fedha| FD["Units × 1.0<br/>Example: 10 units = 10 weighted units"]
      
      DH --> WU[Final Weighted Units]
      FD --> WU
      
      WU --> RP[Revenue Pool Allocation]
      RP --> PD[Publisher Deductions Applied]
      PD --> FP[Final Publisher Payment]
      
      style CM fill:#fff2cc
      style WU fill:#d5e8d4
      style FP fill:#e1d5e7
  `;

  // System Logic Flow
  const systemLogicDiagram = `
    sequenceDiagram
      participant CS as Cron System
      participant RC as Revenue Calculator
      participant DB as Database
      participant PS as Payment System
      
      Note over CS,PS: Monthly Revenue Distribution Process
      
      CS->>RC: Trigger monthly calculation
      RC->>DB: Fetch all active subscriptions
      RC->>DB: Fetch consumption metrics
      
      loop For Each User
        RC->>RC: Calculate partner deductions
        RC->>RC: Calculate weighted units
        RC->>RC: Apply tier multipliers
        RC->>DB: Store calculation results
      end
      
      RC->>RC: Calculate total royalty pool
      RC->>RC: Determine per-unit value
      
      loop For Each Publisher
        RC->>RC: Calculate publisher payments
        RC->>RC: Apply publisher deductions
        RC->>DB: Store payment records
        RC->>PS: Queue payment processing
      end
      
      PS->>PS: Process all payments
      PS->>DB: Update payment status
  `;

  // Database Indexes for Revenue System
  const revenueIndexesDiagram = `
    erDiagram
      REVENUE_INDEXES {
        string collection
        string indexName
        string fields
        string indexType
        string purpose
      }
      
      USER_REVENUE_INDEXES {
        compound userId_subscriptionDate
        single distributionChannel
        single subscriptionTier
        single isActive
        compound renewalDate_isActive
      }
      
      CONSUMPTION_INDEXES {
        compound userId_contentId_date
        single contentType
        compound subscriptionTier_consumptionDate
        single isActive
      }
      
      PAYMENT_INDEXES {
        compound publisherId_period
        single paymentDate
        compound contentId_period
        single status
      }
      
      PARTNER_INDEXES {
        single partnerId
        compound partnerId_period
        single partnerType
        single isActive
      }
      
      REVENUE_INDEXES ||--|| USER_REVENUE_INDEXES : defines
      REVENUE_INDEXES ||--|| CONSUMPTION_INDEXES : defines
      REVENUE_INDEXES ||--|| PAYMENT_INDEXES : defines
      REVENUE_INDEXES ||--|| PARTNER_INDEXES : defines
  `;

  return (
    <div className="mx-auto px-4">
      <h1 className="text-3xl font-bold mt-2 mb-3">LoHo Revenue Distribution Schema</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 md:grid-cols-7">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="collections">Collections</TabsTrigger>
          <TabsTrigger value="calculation">Calculation</TabsTrigger>
          <TabsTrigger value="partners">Partners</TabsTrigger>
          <TabsTrigger value="logic">System Logic</TabsTrigger>
          <TabsTrigger value="indexes">Indexes</TabsTrigger>
          <TabsTrigger value="summary">Summary</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Distribution Overview</CardTitle>
              <CardDescription>Complete revenue flow from user subscription to publisher payments</CardDescription>
            </CardHeader>
            <CardContent>
              <Mermaid chart={revenueOverviewDiagram} title="Revenue Distribution Flow" />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="collections">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="revenue">
              <AccordionTrigger>
                <span className="font-semibold">💰 Revenue Collections Structure</span>
              </AccordionTrigger>
              <AccordionContent>
                <Mermaid chart={revenueCollectionsDiagram} title="Revenue Distribution Collections" />
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="consumption">
              <AccordionTrigger>
                <span className="font-semibold">📊 Content Consumption Metrics</span>
              </AccordionTrigger>
              <AccordionContent>
                <Mermaid chart={consumptionMetricsDiagram} title="Consumption Metrics Schema" />
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="weighted">
              <AccordionTrigger>
                <span className="font-semibold">⚖️ Weighted Units Calculation</span>
              </AccordionTrigger>
              <AccordionContent>
                <Mermaid chart={weightedUnitsLogicDiagram} title="Weighted Units Logic" />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </TabsContent>
        
        <TabsContent value="calculation">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Calculation Process</CardTitle>
              <CardDescription>Step-by-step revenue distribution calculation flow</CardDescription>
            </CardHeader>
            <CardContent>
              <Mermaid chart={calculationFlowDiagram} title="Revenue Calculation Sequence" />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="partners">
          <Card>
            <CardHeader>
              <CardTitle>Partner Revenue Sharing</CardTitle>
              <CardDescription>Partner deductions and revenue sharing structure</CardDescription>
            </CardHeader>
            <CardContent>
              <Mermaid chart={partnerRevenueDiagram} title="Partner Revenue Schema" />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="logic">
          <Card>
            <CardHeader>
              <CardTitle>System Processing Logic</CardTitle>
              <CardDescription>Automated revenue calculation and distribution system</CardDescription>
            </CardHeader>
            <CardContent>
              <Mermaid chart={systemLogicDiagram} title="Revenue System Logic" />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="indexes">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Database Indexes</CardTitle>
              <CardDescription>Optimized indexes for revenue calculation performance</CardDescription>
            </CardHeader>
            <CardContent>
              <Mermaid chart={revenueIndexesDiagram} title="Revenue System Indexes" />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="summary">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Distribution Summary</CardTitle>
              <CardDescription>Key metrics and revenue sharing breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-blue-600">Base Revenue</h4>
                  <p className="text-2xl font-bold">KES 2,000</p>
                  <p className="text-sm text-gray-600">Per user per year</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-green-600">Safaricom Share</h4>
                  <p className="text-2xl font-bold">30%</p>
                  <p className="text-sm text-gray-600">Elimu Pepe app only</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-purple-600">LoHo Share</h4>
                  <p className="text-2xl font-bold">50%</p>
                  <p className="text-sm text-gray-600">Of adjusted revenue</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-orange-600">Content Pool</h4>
                  <p className="text-2xl font-bold">50%</p>
                  <p className="text-sm text-gray-600">Shared by publishers</p>
                </div>
              </div>
              
              <div className="mt-6 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Fixed Annual Deductions</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Simulation License Fee: USD 750</li>
                  <li>• Sprix Learning Fee: KES 200 per user</li>
                </ul>
              </div>
              
              <div className="mt-4 p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Subscription Tier Multipliers</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Dhahabu: 1.5x weighted units</li>
                  <li>• Fedha: 1.0x weighted units</li>
                </ul>
              </div>
              
              <div className="mt-4 p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Content Unit Calculations</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h5 className="font-medium">Content Types & Units:</h5>
                    <ul className="space-y-1 mt-2">
                      <li>• eBooks: 10 pages = 1 unit</li>
                      <li>• Videos: 1 minute = 1 unit</li>
                      <li>• Simulations: 1 completion = 1 unit</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium">Assessment & Courses:</h5>
                    <ul className="space-y-1 mt-2">
                      <li>• Quizzes: 1 completion = 1 unit</li>
                      <li>• Courses: 1 completion = 1 unit</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}