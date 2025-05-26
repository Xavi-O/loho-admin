// app/user-journey/page.tsx
'use client'

import Mermaid from '@/components/Mermaid'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'

export default function UserJourneyPage() {
  return (
    <ScrollArea className="h-full p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>User Journey – LoHo Learning</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed">
          <p>
            The user experience in <strong>LoHo Learning</strong> is structured around two primary roles:
            <strong> Guardians/Teachers</strong> and <strong>Learners</strong>.
          </p>

          <p>
            <strong>Guardians</strong> (B2C) and <strong>Teachers</strong> (B2B via school accounts) are the only ones
            who can create Learner accounts. Learners do <em>not</em> register themselves. Each learner is identified
            by their <strong>First Name</strong>, <strong>Last Name</strong>, and an <strong>Avatar</strong>.
          </p>

          <Separator />

          <p>
            <strong>Login Flow:</strong>
          </p>
          <ol className="list-decimal list-inside ml-4 space-y-1">
            <li>The Guardian or Teacher logs in using their own credentials.</li>
            <li>After login, they land on a dashboard displaying a list of associated Learner accounts.</li>
            <li>The user selects the Learner account they want to use (based on name + avatar).</li>
            <li>
              If the Guardian/Teacher has enabled the option, the Learner will be prompted for a{' '}
              <strong>password or PIN</strong>.
            </li>
            <li>
              Upon successful entry (or if no password is required), the Learner is redirected to their learning
              environment.
            </li>
          </ol>

          <Separator />

          <p className="font-medium">Visual Flow:</p>
          <Mermaid
            title="LoHo Learning – User Journey"
            chart={mermaidChart}
          />
        </CardContent>
      </Card>
    </ScrollArea>
  )
}

const mermaidChart = `
flowchart TD
    A[Guardian/Teacher Logs In] --> B{Authentication Successful?}
    B -- No --> Z[Login Error Shown]
    B -- Yes --> C[Dashboard: View Learners]

    C --> D[Select a Learner<br/>First Name + Last Name + Avatar]
    D --> E{Is Password/PIN Required?}

    E -- No --> F[Learner Logged In]
    E -- Yes --> G[Prompt for Learner Password]

    G --> H{Password Correct?}
    H -- No --> I[Retry or Go Back]
    H -- Yes --> F

    C --> J[Create New Learner Account]

    style A fill:#e0f7fa,stroke:#00796b,stroke-width:2px
    style F fill:#c8e6c9,stroke:#2e7d32,stroke-width:2px
    style G fill:#fff3e0,stroke:#ff9800,stroke-width:2px
    style J fill:#ede7f6,stroke:#5e35b1,stroke-width:2px
`
