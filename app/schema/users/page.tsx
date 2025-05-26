"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import dynamic from "next/dynamic";

// Dynamically import the Mermaid component with no SSR
const Mermaid = dynamic(() => import("@/components/Mermaid"), { ssr: false });

export default function SchemaPage() {
  const [activeTab, setActiveTab] = useState("overview");

  // Updated overview diagram with improved relationships
  const overviewDiagram = `
  erDiagram
    USERS ||--o{ QUIZ_RESULTS : creates
    USERS ||--o{ CONTENT : creates
    USERS ||--o{ QUIZZES : creates
    USERS }o--|| SCHOOLS : belongs_to
    USERS }o--|| PARTNERS : associated_with
    LEARNERS }o--o{ GUARDIANS : managed_by
    LEARNERS }o--o{ TEACHERS : taught_by
    GUARDIANS ||--o{ LEARNERS : manages
    TEACHERS ||--o{ LEARNERS : teaches
    QUIZZES ||--o{ QUIZ_RESULTS : has
    QUIZZES }o--|| CONTENT : related_to
    PARTNERS ||--o{ CONTENT : provides
    CONTENT ||--o{ CONTENT_CATEGORIES : belongs_to

    USERS {
      ObjectId _id
      string lohoUserId
      string role
      string type
      string firstName
      string lastName
      object contact
      ObjectId associatedSchoolId
      string associatedPartnerApp
      date dateJoined
    }
    
    LEARNERS {
      ObjectId _id
      ObjectId userId
      string grade
      array guardianIds
      array teacherIds
      object preferences
      array contentProgress
    }
    
    GUARDIANS {
      ObjectId _id
      ObjectId userId
      array learnerIds
      string relation
      string permissions
    }
    
    TEACHERS {
      ObjectId _id
      ObjectId userId
      array learnerIds
      array classRooms
      string department
      array subjects
    }
    
    SCHOOLS {
      ObjectId _id
      string name
      string ownership
      string management
      string setting
      boolean isSponsored
      object sponsor
      string country
      string region
    }
    
    CONTENT {
      ObjectId _id
      string title
      string type
      string subject
      string level
      array categoryIds
      string url
      ObjectId createdBy
      ObjectId partnerId
    }
    
    CONTENT_CATEGORIES {
      ObjectId _id
      string name
      string description
      ObjectId parentCategoryId
    }
    
    QUIZZES {
      ObjectId _id
      string title
      string subject
      string level
      ObjectId contentId
      array questions
      ObjectId createdBy
    }
    
    QUIZ_RESULTS {
      ObjectId _id
      ObjectId learnerId
      ObjectId quizId
      number score
      date completedAt
      array answers
    }
    
    PARTNERS {
      ObjectId _id
      string name
      string externalAppId
      object contactPerson
      array contentIds
    }
  `;

  // Updated users diagram with separation of user types
  const usersDiagram = `
  classDiagram
    class User {
      +ObjectId _id
      +String lohoUserId
      +String role "learner|teacher|guardian"
      +String type "B2B|B2C"
      +String firstName
      +String lastName
      +Contact contact
      +ObjectId associatedSchoolId
      +String associatedPartnerApp
      +Date dateJoined
    }
    
    class Learner {
      +ObjectId _id
      +ObjectId userId
      +String grade
      +Array~ObjectId~ guardianIds
      +Array~ObjectId~ teacherIds
      +Preferences preferences
      +Array~Progress~ contentProgress
      +Subscription subscription
    }
    
    class Guardian {
      +ObjectId _id
      +ObjectId userId
      +Array~ObjectId~ learnerIds
      +String relation
      +String permissions "full|limited"
    }
    
    class Teacher {
      +ObjectId _id
      +ObjectId userId
      +Array~ObjectId~ learnerIds
      +Array~String~ classRooms
      +String department
      +Array~String~ subjects
    }
    
    class Contact {
      +String phone
      +String email
    }
    
    class Preferences {
      +Array~String~ favoriteSubjects
      +String preferredLanguage
      +Boolean notificationsEnabled
    }
    
    class Progress {
      +ObjectId contentId
      +Number percentComplete
      +Date lastAccessed
    }
    
    class Subscription {
      +String tier "Dhahabu|Fedha"
      +Date startDate
      +Date endDate
      +RenewalReminders renewalRemindersSent
    }
    
    class RenewalReminders {
      +Boolean oneMonth
      +Boolean oneWeek
      +Boolean oneDay
      +Boolean onDate
    }
    
    User <|-- Learner
    User <|-- Guardian
    User <|-- Teacher
    User *-- Contact
    Learner *-- Preferences
    Learner *-- Progress
    Learner *-- Subscription
    Subscription *-- RenewalReminders
  `;

  // Updated schools diagram with expanded categorization
  const schoolsDiagram = `
  classDiagram
    class School {
      +ObjectId _id
      +String name
      +String ownership "Public|Private"
      +String management "Government|NGO|Religious|Community"
      +String setting "Urban|Rural|Refugee"
      +Boolean isSponsored
      +Sponsor sponsor
      +String country
      +String region
      +Array~Facilities~ facilities
    }
    
    class Sponsor {
      +String name
      +String contactPerson
      +String email
      +String phone
      +Date sponsorshipStart
      +Date sponsorshipEnd
      +String notes
    }
    
    class Facilities {
      +Boolean hasElectricity
      +Boolean hasInternet
      +Boolean hasLibrary
      +Boolean hasComputers
      +Number computerCount
      +Boolean hasTablets
      +Number tabletCount
    }
    
    School *-- Sponsor
    School *-- Facilities
  `;

  // Updated content diagram with categories
  const contentDiagram = `
  classDiagram
    class Content {
      +ObjectId _id
      +String title
      +String type "eBook|Video|LabSimulation|Dal|Game"
      +String subject
      +String level
      +Array~ObjectId~ categoryIds
      +String url
      +ObjectId createdBy
      +ObjectId partnerId
    }
    
    class ContentCategory {
      +ObjectId _id
      +String name
      +String description
      +ObjectId parentCategoryId
    }
    
    Content o-- ContentCategory
  `;

  // Keep the other diagrams as they are
  const quizzesDiagram = `
  classDiagram
    class Quiz {
      +ObjectId _id
      +String title
      +String subject
      +String level
      +ObjectId contentId
      +Array~Question~ questions
      +ObjectId createdBy
    }
    
    class Question {
      +String question
      +Array~String~ options
      +String correctAnswer
      +String explanation
    }
    
    Quiz *-- Question
  `;

  const quizResultsDiagram = `
  classDiagram
    class QuizResult {
      +ObjectId _id
      +ObjectId learnerId
      +ObjectId quizId
      +Number score
      +Date completedAt
      +Array~Answer~ answers
    }
    
    class Answer {
      +ObjectId questionId
      +String selectedOption
      +Boolean correct
    }
    
    QuizResult *-- Answer
  `;

  // Updated partners diagram with content relationship
  const partnersDiagram = `
  classDiagram
    class Partner {
      +ObjectId _id
      +String name
      +String externalAppId
      +ContactPerson contactPerson
      +Array~ObjectId~ contentIds
    }
    
    class ContactPerson {
      +String name
      +String email
      +String phone
      +String role
    }
    
    Partner *-- ContactPerson
  `;

  // Updated relationships diagram to reflect user hierarchy
  const relationshipsDiagram = `
    flowchart TD
      subgraph "User Hierarchy & Management"
        L[Learner] -- "managed by" --> G[Guardian]
        L -- "taught by" --> T[Teacher]
        G -- "creates account for" --> L
        T -- "creates account for" --> L
      end

      subgraph "B2B Path"
        T -- "belongs to" --> S[School]
        S -- "has category" --> SC[School Category]
        S -- "may have" --> SP[Sponsor]
        S -- "has subscription" --> SUB[Subscription]
      end

      subgraph "B2C Path"
        G -- "may use" --> P[Partner]
        G -- "has subscription" --> SUB
        P -- "provides external access" --> C[Content]
      end

      subgraph "Content & Assessment"
        T -- "creates" --> Q[Quiz]
        L -- "takes" --> Q
        Q -- "generates" --> QR[Quiz Result]
        L -- "consumes" --> C
        C -- "categorized as" --> CT[Content Types]
      end

      subgraph "System Management"
      U[User] -- "has" --> UID[LoHoUserID]
      U -- "has" --> CI[Contact Info]
      SUB -- "has tier" --> ST[Subscription Tier]
      SUB -- "tracks" --> SR[Subscription Renewal]
    end
  `;

  const subscriptionDiagram = `
  sequenceDiagram
    participant CS as Cron System
    participant DB as Database
    participant N as Notification System
    participant U as User
    
    CS->>DB: Check users with approaching endDate
    Note over CS,DB: Daily job checks all subscriptions
    
    alt 1 Month Before Expiration
      DB->>CS: Users with 1 month remaining
      CS->>DB: Update oneMonth flag = true
      CS->>N: Send 1 month notifications
      N->>U: Email/SMS: 1 month remaining
    else 1 Week Before Expiration
      DB->>CS: Users with 1 week remaining
      CS->>DB: Update oneWeek flag = true
      CS->>N: Send 1 week notifications
      N->>U: Email/SMS: 1 week remaining
    else 1 Day Before Expiration
      DB->>CS: Users with 1 day remaining
      CS->>DB: Update oneDay flag = true
      CS->>N: Send 1 day notifications
      N->>U: Email/SMS: 1 day remaining
    else On Expiration Date
      DB->>CS: Users with subscription ending today
      CS->>DB: Update onDate flag = true
      CS->>N: Send expiration notifications
      N->>U: Email/SMS: Subscription expired today
    end
  `;

  const indexesDiagram = `
  classDiagram
    class Indexes {
      +lohoUserId [Unique]
      +User.role + User.type [To filter user types]
      +Learner.userId [To find learner details]
      +Guardian.userId [To find guardian details] 
      +Teacher.userId [To find teacher details]
      +Guardian.learnerIds [To find learners under guardian]
      +Teacher.learnerIds [To find learners under teacher]
      +Learner.subscription.endDate [For renewal tracking]
      +School._id [To find all users under a school]
      +Content.categoryIds [To find content by category]
      +Partner.contentIds [To find content by partner]
    }
  `;

  useEffect(() => {
    // This is a workaround to ensure mermaid gets reinitialized when tabs change
    if (typeof window !== "undefined") {
      // Create a small delay to ensure the DOM is ready
      setTimeout(() => {
        const event = new Event("refresh-mermaid");
        document.dispatchEvent(event);
      }, 100);
    }
  }, [activeTab]);

  return (
    <div className="mx-auto px-4">
      <h1 className="text-3xl font-bold mt-2 mb-3">LoHo eLearning Platform Database Schema</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-9">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="collections">Collections</TabsTrigger>
          <TabsTrigger value="relationships">Relationships</TabsTrigger>
          <TabsTrigger value="logic">System Logic</TabsTrigger>
          <TabsTrigger value="indexes">Indexes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Schema Overview</CardTitle>
              <CardDescription>Comprehensive view of all collections and their relationships</CardDescription>
            </CardHeader>
            <CardContent>
              <Mermaid chart={overviewDiagram} title="Complete Schema Overview" />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="collections">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="users">
              <AccordionTrigger>
                <span className="font-semibold">👤 Users Collection Structure</span>
              </AccordionTrigger>
              <AccordionContent>
                <Mermaid chart={usersDiagram} title="Users Schema with Role Separation" />
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="schools">
              <AccordionTrigger>
                <span className="font-semibold">🏫 Schools Collection</span>
              </AccordionTrigger>
              <AccordionContent>
                <Mermaid chart={schoolsDiagram} title="Schools Schema with Categories" />
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="content">
              <AccordionTrigger>
                <span className="font-semibold">📘 Content Collection</span>
              </AccordionTrigger>
              <AccordionContent>
                <Mermaid chart={contentDiagram} title="Content Schema with Categories" />
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="quizzes">
              <AccordionTrigger>
                <span className="font-semibold">🧪 Quizzes Collection</span>
              </AccordionTrigger>
              <AccordionContent>
                <Mermaid chart={quizzesDiagram} title="Quizzes Schema" />
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="quizResults">
              <AccordionTrigger>
                <span className="font-semibold">📊 Quiz Results Collection</span>
              </AccordionTrigger>
              <AccordionContent>
                <Mermaid chart={quizResultsDiagram} title="Quiz Results Schema" />
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="partners">
              <AccordionTrigger>
                <span className="font-semibold">🤝 Partners Collection</span>
              </AccordionTrigger>
              <AccordionContent>
                <Mermaid chart={partnersDiagram} title="Partners Schema with Content" />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </TabsContent>
        
        <TabsContent value="relationships">
          <Card>
            <CardHeader>
              <CardTitle>Entity Relationships</CardTitle>
              <CardDescription>User, Teacher, Guardian, Learner relationships and dependencies</CardDescription>
            </CardHeader>
            <CardContent>
              <Mermaid chart={relationshipsDiagram} title="Relationship Mapping" />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="logic">
          <Card>
            <CardHeader>
              <CardTitle>Subscription Process Flow</CardTitle>
              <CardDescription>Subscription renewal notification system</CardDescription>
            </CardHeader>
            <CardContent>
              <Mermaid chart={subscriptionDiagram} title="Subscription Renewal Flow" />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="indexes">
          <Card>
            <CardHeader>
              <CardTitle>Database Indexes</CardTitle>
              <CardDescription>Optimized indexes for database performance</CardDescription>
            </CardHeader>
            <CardContent>
              <Mermaid chart={indexesDiagram} title="Database Indexes" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}