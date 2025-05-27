
import { supabase } from "@/integrations/supabase/client";
import type { TestResult, TestSuite, TestBackup, TestConfig } from "@/types/test";
import { CourseFormData } from "@/types/course";

export class TestRunner {
  private config: TestConfig = {
    enableBackup: true,
    enableRestore: true,
    delayBetweenTests: 1000,
    maxRetries: 3
  };

  private backup: TestBackup | null = null;

  async createBackup(): Promise<TestBackup> {
    const timestamp = new Date();
    
    const [coursesResult, modulesResult, contentsResult, profilesResult] = await Promise.all([
      supabase.from('cursos').select('*'),
      supabase.from('modulos').select('*'),
      supabase.from('conteudos').select('*'),
      supabase.from('profiles').select('*')
    ]);

    const backup: TestBackup = {
      id: `backup_${timestamp.getTime()}`,
      timestamp,
      data: {
        courses: coursesResult.data || [],
        modules: modulesResult.data || [],
        contents: contentsResult.data || [],
        profiles: profilesResult.data || []
      }
    };

    this.backup = backup;
    return backup;
  }

  async restoreBackup(): Promise<void> {
    if (!this.backup) throw new Error('No backup available');

    // Delete all test data first
    await Promise.all([
      supabase.from('conteudos').delete().gte('created_at', this.backup.timestamp.toISOString()),
      supabase.from('modulos').delete().gte('created_at', this.backup.timestamp.toISOString()),
      supabase.from('cursos').delete().gte('created_at', this.backup.timestamp.toISOString())
    ]);
  }

  async runCourseTests(userId: string): Promise<TestResult[]> {
    const tests: TestResult[] = [];

    // Test 1: Create Course
    tests.push(await this.runTest('create-course', async () => {
      const courseData: CourseFormData = {
        name: 'Test Course Auto',
        description: 'Automated test course description',
        category: 'programming',
        image: '',
        type: 'free',
        price: 0,
        currency: 'BRL',
        discount: 0,
        visibility: 'public',
        isPublished: false
      };

      const { data, error } = await supabase
        .from('cursos')
        .insert({
          title: courseData.name,
          description: courseData.description,
          category: courseData.category,
          image_url: courseData.image,
          is_paid: courseData.type === 'paid',
          price: courseData.type === 'paid' ? courseData.price : null,
          discount: courseData.type === 'paid' ? courseData.discount : 0,
          mentor_id: userId,
          is_public: courseData.visibility === 'public',
          is_published: courseData.isPublished
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    }));

    // Test 2: Update Course
    if (tests[0].status === 'success') {
      tests.push(await this.runTest('update-course', async () => {
        const courseId = tests[0].details.id;
        
        const { error } = await supabase
          .from('cursos')
          .update({ title: 'Updated Test Course Auto' })
          .eq('id', courseId);

        if (error) throw error;
        return { courseId, updated: true };
      }));
    }

    // Test 3: Create Module
    if (tests[0].status === 'success') {
      tests.push(await this.runTest('create-module', async () => {
        const courseId = tests[0].details.id;
        
        const { data, error } = await supabase
          .from('modulos')
          .insert({
            curso_id: courseId,
            nome_modulo: 'Test Module Auto',
            descricao_modulo: 'Automated test module',
            ordem: 0
          })
          .select()
          .single();

        if (error) throw error;
        return data;
      }));
    }

    // Test 4: Create Content
    if (tests[2] && tests[2].status === 'success') {
      tests.push(await this.runTest('create-content', async () => {
        const moduleId = tests[2].details.id;
        
        const { data, error } = await supabase
          .from('conteudos')
          .insert({
            modulo_id: moduleId,
            nome_conteudo: 'Test Content Auto',
            descricao_conteudo: 'Automated test content',
            tipo_conteudo: 'texto_rico',
            dados_conteudo: { html_content: '<p>Test content</p>' },
            ordem: 0
          })
          .select()
          .single();

        if (error) throw error;
        return data;
      }));
    }

    return tests;
  }

  async runProfileTests(userId: string): Promise<TestResult[]> {
    const tests: TestResult[] = [];

    // Test: Update Profile
    tests.push(await this.runTest('update-profile', async () => {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          full_name: 'Test User Auto Updated',
          bio: 'Automated test bio update'
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    }));

    return tests;
  }

  private async runTest(name: string, testFn: () => Promise<any>): Promise<TestResult> {
    const startTime = Date.now();
    const test: TestResult = {
      id: `test_${name}_${startTime}`,
      name,
      status: 'running',
      timestamp: new Date()
    };

    try {
      const result = await testFn();
      test.status = 'success';
      test.details = result;
    } catch (error) {
      test.status = 'error';
      test.error = error instanceof Error ? error.message : 'Unknown error';
    }

    test.duration = Date.now() - startTime;
    return test;
  }

  async runAllTests(userId: string): Promise<TestSuite[]> {
    const suites: TestSuite[] = [];

    // Course Tests Suite
    const courseTestSuite: TestSuite = {
      id: 'course_tests',
      name: 'Testes de Cursos',
      description: 'Testa criação, edição e gerenciamento de cursos',
      tests: [],
      status: 'running',
      totalTests: 0,
      passedTests: 0,
      failedTests: 0
    };

    courseTestSuite.tests = await this.runCourseTests(userId);
    courseTestSuite.totalTests = courseTestSuite.tests.length;
    courseTestSuite.passedTests = courseTestSuite.tests.filter(t => t.status === 'success').length;
    courseTestSuite.failedTests = courseTestSuite.tests.filter(t => t.status === 'error').length;
    courseTestSuite.status = courseTestSuite.failedTests > 0 ? 'error' : 'completed';

    suites.push(courseTestSuite);

    // Profile Tests Suite
    const profileTestSuite: TestSuite = {
      id: 'profile_tests',
      name: 'Testes de Perfil',
      description: 'Testa atualização de perfil de usuário',
      tests: [],
      status: 'running',
      totalTests: 0,
      passedTests: 0,
      failedTests: 0
    };

    profileTestSuite.tests = await this.runProfileTests(userId);
    profileTestSuite.totalTests = profileTestSuite.tests.length;
    profileTestSuite.passedTests = profileTestSuite.tests.filter(t => t.status === 'success').length;
    profileTestSuite.failedTests = profileTestSuite.tests.filter(t => t.status === 'error').length;
    profileTestSuite.status = profileTestSuite.failedTests > 0 ? 'error' : 'completed';

    suites.push(profileTestSuite);

    return suites;
  }
}

export const testRunner = new TestRunner();
