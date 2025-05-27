
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Play, Square, RotateCcw, CheckCircle, XCircle, Clock } from 'lucide-react';
import { testRunner } from '@/services/testService';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import type { TestSuite, TestResult } from '@/types/test';

const TestDashboard = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [testSuites, setTestSuites] = useState<TestSuite[]>([]);
  const [currentStep, setCurrentStep] = useState('');
  const { user } = useAuth();
  const { toast } = useToast();

  const runTests = async () => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Usuário não autenticado",
        variant: "destructive"
      });
      return;
    }

    setIsRunning(true);
    setCurrentStep('Criando backup dos dados...');
    
    try {
      // Create backup
      await testRunner.createBackup();
      
      setCurrentStep('Executando testes automatizados...');
      
      // Run all tests
      const results = await testRunner.runAllTests(user.id);
      setTestSuites(results);
      
      setCurrentStep('Restaurando dados originais...');
      
      // Restore backup
      await testRunner.restoreBackup();
      
      setCurrentStep('Testes concluídos!');
      
      const totalTests = results.reduce((sum, suite) => sum + suite.totalTests, 0);
      const failedTests = results.reduce((sum, suite) => sum + suite.failedTests, 0);
      
      toast({
        title: "Testes Concluídos",
        description: `${totalTests} testes executados. ${failedTests} falhas detectadas.`,
        variant: failedTests > 0 ? "destructive" : "default"
      });
    } catch (error) {
      console.error('Erro ao executar testes:', error);
      toast({
        title: "Erro nos Testes",
        description: "Falha ao executar os testes automatizados",
        variant: "destructive"
      });
    } finally {
      setIsRunning(false);
      setCurrentStep('');
    }
  };

  const clearResults = () => {
    setTestSuites([]);
    setCurrentStep('');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'running':
        return <Clock className="h-4 w-4 text-blue-500 animate-spin" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      success: 'default',
      error: 'destructive',
      running: 'secondary',
      pending: 'outline'
    } as const;

    return <Badge variant={variants[status as keyof typeof variants] || 'outline'}>{status}</Badge>;
  };

  const calculateProgress = () => {
    if (testSuites.length === 0) return 0;
    const totalTests = testSuites.reduce((sum, suite) => sum + suite.totalTests, 0);
    const completedTests = testSuites.reduce((sum, suite) => 
      sum + suite.tests.filter(t => t.status !== 'pending' && t.status !== 'running').length, 0
    );
    return totalTests > 0 ? (completedTests / totalTests) * 100 : 0;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Testes Automatizados</h1>
        <div className="flex gap-2">
          <Button
            onClick={runTests}
            disabled={isRunning}
            className="flex items-center gap-2"
          >
            <Play className="h-4 w-4" />
            {isRunning ? 'Executando...' : 'Executar Testes'}
          </Button>
          <Button
            onClick={clearResults}
            variant="outline"
            disabled={isRunning}
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Limpar
          </Button>
        </div>
      </div>

      {currentStep && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 animate-spin" />
              <span className="font-medium">{currentStep}</span>
            </div>
            <Progress value={calculateProgress()} className="w-full" />
          </CardContent>
        </Card>
      )}

      {testSuites.length > 0 && (
        <div className="grid gap-4">
          {testSuites.map((suite) => (
            <Card key={suite.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    {suite.name}
                    {getStatusBadge(suite.status)}
                  </CardTitle>
                  <div className="text-sm text-muted-foreground">
                    {suite.passedTests}/{suite.totalTests} aprovados
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{suite.description}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {suite.tests.map((test) => (
                    <div key={test.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(test.status)}
                        <span className="font-medium">{test.name}</span>
                        {test.duration && (
                          <span className="text-xs text-muted-foreground">
                            ({test.duration}ms)
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(test.status)}
                        {test.error && (
                          <span className="text-xs text-red-500 max-w-md truncate" title={test.error}>
                            {test.error}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {testSuites.length === 0 && !isRunning && (
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="flex flex-col items-center gap-4">
              <Play className="h-12 w-12 text-muted-foreground" />
              <div>
                <h3 className="font-semibold mb-2">Nenhum teste executado</h3>
                <p className="text-sm text-muted-foreground">
                  Clique em "Executar Testes" para iniciar os testes automatizados do sistema.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TestDashboard;
