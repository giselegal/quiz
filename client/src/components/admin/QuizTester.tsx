import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const QuizTester: React.FC = () => {
  const [testResults, setTestResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const runCompleteTest = async () => {
    setLoading(true);
    const results: any = {
      quiz: null,
      questions: null,
      questionsWithOptions: null,
      styles: null,
      errors: []
    };

    try {
      // Test Quiz API
      const quizResponse = await fetch('/api/quiz/1');
      if (quizResponse.ok) {
        results.quiz = await quizResponse.json();
      } else {
        results.errors.push('Quiz API failed');
      }

      // Test Questions API
      const questionsResponse = await fetch('/api/quiz/1/questions');
      if (questionsResponse.ok) {
        results.questions = await questionsResponse.json();
      } else {
        results.errors.push('Questions API failed');
      }

      // Test Questions with Options API
      const questionsWithOptionsResponse = await fetch('/api/quiz/1/questions-with-options');
      if (questionsWithOptionsResponse.ok) {
        results.questionsWithOptions = await questionsWithOptionsResponse.json();
      } else {
        results.errors.push('Questions with Options API failed');
      }

      // Test Styles API
      const stylesResponse = await fetch('/api/styles');
      if (stylesResponse.ok) {
        results.styles = await stylesResponse.json();
      } else {
        results.errors.push('Styles API failed');
      }

      setTestResults(results);
    } catch (error) {
      results.errors.push(`Network error: ${error.message}`);
      setTestResults(results);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quiz API Tester</CardTitle>
        <CardDescription>Teste completo das APIs do quiz</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button onClick={runCompleteTest} disabled={loading}>
            {loading ? 'Testando...' : 'Executar Teste Completo'}
          </Button>

          {testResults && (
            <div className="space-y-4">
              {/* Quiz Status */}
              <div className="flex items-center justify-between p-3 border rounded">
                <span>Quiz API</span>
                <Badge variant={testResults.quiz ? 'default' : 'destructive'}>
                  {testResults.quiz ? `✓ ${testResults.quiz.title}` : '✗ Failed'}
                </Badge>
              </div>

              {/* Questions Status */}
              <div className="flex items-center justify-between p-3 border rounded">
                <span>Questions API</span>
                <Badge variant={testResults.questions && testResults.questions.length > 0 ? 'default' : 'destructive'}>
                  {testResults.questions ? `✓ ${testResults.questions.length} questions` : '✗ No questions'}
                </Badge>
              </div>

              {/* Questions with Options Status */}
              <div className="flex items-center justify-between p-3 border rounded">
                <span>Questions with Options API</span>
                <Badge variant={testResults.questionsWithOptions && testResults.questionsWithOptions.length > 0 ? 'default' : 'destructive'}>
                  {testResults.questionsWithOptions ? `✓ ${testResults.questionsWithOptions.length} with options` : '✗ No data'}
                </Badge>
              </div>

              {/* Styles Status */}
              <div className="flex items-center justify-between p-3 border rounded">
                <span>Styles API</span>
                <Badge variant={testResults.styles && testResults.styles.length > 0 ? 'default' : 'destructive'}>
                  {testResults.styles ? `✓ ${testResults.styles.length} styles` : '✗ No styles'}
                </Badge>
              </div>

              {/* Errors */}
              {testResults.errors.length > 0 && (
                <div className="p-3 bg-red-50 border border-red-200 rounded">
                  <h4 className="font-medium text-red-800 mb-2">Errors:</h4>
                  <ul className="text-sm text-red-700">
                    {testResults.errors.map((error: string, index: number) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Details */}
              {testResults.questions && (
                <details className="p-3 border rounded">
                  <summary className="cursor-pointer font-medium">Questions Details</summary>
                  <pre className="mt-2 text-xs bg-gray-50 p-2 rounded overflow-auto max-h-40">
                    {JSON.stringify(testResults.questions, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};