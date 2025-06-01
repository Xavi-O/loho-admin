// app/profile/security-questions/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Save, ShieldQuestion, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

const SECURITY_QUESTIONS = [
  "What was your childhood nickname?",
  "What is your mother's maiden name?",
  "What was the name of your first pet?",
  "What city were you born in?",
  "What was the name of your elementary school?",
  "What was your favorite food as a child?",
  "What was the first concert you attended?",
  "What was the make of your first car?",
  "What street did you live on in third grade?",
  "What is the name of your favorite childhood friend?"
];

interface SecurityQuestion {
  question: string;
  answer: string;
}

interface SecurityQuestionsData {
  questions: SecurityQuestion[];
  hasExisting: boolean;
}

export default function SecurityQuestionsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [data, setData] = useState<SecurityQuestionsData>({
    questions: [],
    hasExisting: false
  });
  const [formData, setFormData] = useState<SecurityQuestion[]>([
    { question: '', answer: '' },
    { question: '', answer: '' },
    { question: '', answer: '' }
  ]);

  useEffect(() => {
    fetchSecurityQuestions();
  }, []);

  const fetchSecurityQuestions = async () => {
    try {
      const response = await fetch('/api/profile/security-questions');
      if (response.ok) {
        const result = await response.json();
        setData(result);
        if (result.hasExisting) {
          // Only set questions, not answers for security
          setFormData(result.questions.map((q: SecurityQuestion) => ({
            question: q.question,
            answer: '' // Don't populate existing answers
          })));
        }
      } else {
        toast.error('Failed to load security questions');
      }
    } catch (error) {
      console.error('Error fetching security questions:', error);
      toast.error('Error loading security questions');
    } finally {
      setLoading(false);
    }
  };

  const handleQuestionChange = (index: number, question: string) => {
    const newFormData = [...formData];
    newFormData[index].question = question;
    setFormData(newFormData);
  };

  const handleAnswerChange = (index: number, answer: string) => {
    const newFormData = [...formData];
    newFormData[index].answer = answer;
    setFormData(newFormData);
  };

  const validateForm = () => {
    // Check if all questions are selected
    for (let i = 0; i < 3; i++) {
      if (!formData[i].question) {
        toast.error(`Please select security question ${i + 1}`);
        return false;
      }
      if (!formData[i].answer.trim()) {
        toast.error(`Please provide an answer for security question ${i + 1}`);
        return false;
      }
    }

    // Check for duplicate questions
    const questions = formData.map(q => q.question);
    const uniqueQuestions = new Set(questions);
    if (uniqueQuestions.size !== questions.length) {
      toast.error('All security questions must be different');
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setSaving(true);
    try {
      const response = await fetch('/api/profile/security-questions', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ securityQuestions: formData }),
      });

      if (response.ok) {
        toast.success('Security questions updated successfully');
        setIsEditing(false);
        fetchSecurityQuestions(); // Refresh data
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to update security questions');
      }
    } catch (error) {
      console.error('Error updating security questions:', error);
      toast.error('Error updating security questions');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (data.hasExisting) {
      setFormData(data.questions.map((q: SecurityQuestion) => ({
        question: q.question,
        answer: ''
      })));
    } else {
      setFormData([
        { question: '', answer: '' },
        { question: '', answer: '' },
        { question: '', answer: '' }
      ]);
    }
    setIsEditing(false);
  };

  const getAvailableQuestions = (currentIndex: number) => {
    const selectedQuestions = formData
      .map((item, index) => index !== currentIndex ? item.question : null)
      .filter(Boolean);
    
    return SECURITY_QUESTIONS.filter(q => !selectedQuestions.includes(q));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pt-10">
      <div>
        <h1 className="text-3xl font-bold">Security Questions</h1>
        <p className="text-muted-foreground">
          Set up security questions to help recover your account
        </p>
      </div>

      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Security questions are used for account recovery. Choose questions with answers you'll remember.
          {data.hasExisting && " You'll need to re-enter all answers to update your security questions."}
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldQuestion className="h-5 w-5" />
            Configure Security Questions
          </CardTitle>
          <CardDescription>
            Choose 3 different security questions and provide answers
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {formData.map((item, index) => (
            <div key={index} className="space-y-3 p-4 border rounded-lg">
              <Label className="text-base font-medium">
                Security Question {index + 1}
              </Label>
              
              <div className="space-y-2">
                <Label htmlFor={`question-${index}`}>Question</Label>
                <Select
                  value={item.question}
                  onValueChange={(value) => handleQuestionChange(index, value)}
                  disabled={!isEditing}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a security question" />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailableQuestions(index).map((question) => (
                      <SelectItem key={question} value={question}>
                        {question}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`answer-${index}`}>Answer</Label>
                <Input
                  id={`answer-${index}`}
                  type="password"
                  value={item.answer}
                  onChange={(e) => handleAnswerChange(index, e.target.value)}
                  placeholder={isEditing ? "Enter your answer" : "••••••••"}
                  disabled={!isEditing}
                />
              </div>
            </div>
          ))}

          <div className="flex gap-2 pt-4">
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)}>
                {data.hasExisting ? 'Update Security Questions' : 'Set Up Security Questions'}
              </Button>
            ) : (
              <>
                <Button onClick={handleSave} disabled={saving}>
                  {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                  <Save className="h-4 w-4 mr-2" />
                  Save Questions
                </Button>
                <Button variant="outline" onClick={handleCancel} disabled={saving}>
                  Cancel
                </Button>
              </>
            )}
          </div>

          {data.hasExisting && (
            <div className="text-sm text-muted-foreground">
              <p>Current security questions are configured. You can update them by providing new answers above.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}