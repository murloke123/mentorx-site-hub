
export interface TestResult {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'success' | 'error';
  duration?: number;
  error?: string;
  details?: any;
  timestamp: Date;
}

export interface TestSuite {
  id: string;
  name: string;
  description: string;
  tests: TestResult[];
  status: 'pending' | 'running' | 'completed' | 'error';
  totalTests: number;
  passedTests: number;
  failedTests: number;
  duration?: number;
}

export interface TestBackup {
  id: string;
  timestamp: Date;
  data: {
    courses: any[];
    modules: any[];
    contents: any[];
    profiles: any[];
  };
}

export interface TestConfig {
  enableBackup: boolean;
  enableRestore: boolean;
  delayBetweenTests: number;
  maxRetries: number;
}
