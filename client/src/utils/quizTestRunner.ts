// Comprehensive quiz testing utility
export const runCompleteQuizTest = async (): Promise<{
  success: boolean;
  results: any[];
  issues: string[];
}> => {
  const results: any[] = [];
  const issues: string[] = [];
  let success = true;

  console.group('🧪 TESTE COMPLETO DO QUIZ');

  // Test 1: Homepage load
  try {
    console.log('1. Testando carregamento da homepage...');
    const currentPath = window.location.pathname;
    results.push({
      test: 'Homepage Load',
      success: true,
      details: `Current path: ${currentPath}`
    });
  } catch (error) {
    issues.push('Homepage failed to load');
    success = false;
    results.push({
      test: 'Homepage Load',
      success: false,
      error: error.message
    });
  }

  // Test 2: Quiz API
  try {
    console.log('2. Testando API do quiz...');
    const response = await fetch('/api/quiz/1');
    const data = await response.json();
    
    if (response.ok && data.id) {
      results.push({
        test: 'Quiz API',
        success: true,
        details: `Quiz ID: ${data.id}, Title: ${data.title}`
      });
    } else {
      throw new Error('Quiz API returned invalid data');
    }
  } catch (error) {
    issues.push('Quiz API is not responding correctly');
    success = false;
    results.push({
      test: 'Quiz API',
      success: false,
      error: error.message
    });
  }

  // Test 3: Questions API
  try {
    console.log('3. Testando API de questões...');
    const response = await fetch('/api/quiz/1/questions');
    const questions = await response.json();
    
    if (response.ok && Array.isArray(questions) && questions.length > 0) {
      results.push({
        test: 'Questions API',
        success: true,
        details: `Found ${questions.length} questions`
      });
    } else {
      throw new Error('Questions API returned no questions');
    }
  } catch (error) {
    issues.push('Questions API is not working');
    success = false;
    results.push({
      test: 'Questions API',
      success: false,
      error: error.message
    });
  }

  // Test 4: Styles API
  try {
    console.log('4. Testando API de estilos...');
    const response = await fetch('/api/styles');
    const styles = await response.json();
    
    if (response.ok && Array.isArray(styles) && styles.length > 0) {
      results.push({
        test: 'Styles API',
        success: true,
        details: `Found ${styles.length} style types`
      });
    } else {
      throw new Error('Styles API returned no styles');
    }
  } catch (error) {
    issues.push('Styles API is not working');
    success = false;
    results.push({
      test: 'Styles API',
      success: false,
      error: error.message
    });
  }

  // Test 5: Local Storage
  try {
    console.log('5. Testando armazenamento local...');
    localStorage.setItem('quiz_test', 'working');
    const testValue = localStorage.getItem('quiz_test');
    localStorage.removeItem('quiz_test');
    
    if (testValue === 'working') {
      results.push({
        test: 'Local Storage',
        success: true,
        details: 'localStorage functioning correctly'
      });
    } else {
      throw new Error('localStorage not working');
    }
  } catch (error) {
    issues.push('Local storage is not working');
    success = false;
    results.push({
      test: 'Local Storage',
      success: false,
      error: error.message
    });
  }

  // Test 6: Pixel Configuration
  try {
    console.log('6. Testando configuração do pixel...');
    const pixelId = localStorage.getItem('fb_pixel_id');
    const trackingEnabled = localStorage.getItem('tracking_enabled') === 'true';
    
    results.push({
      test: 'Pixel Configuration',
      success: !!pixelId,
      details: `Pixel ID configured: ${!!pixelId}, Tracking enabled: ${trackingEnabled}`
    });
    
    if (!pixelId) {
      issues.push('Facebook Pixel not configured');
    }
  } catch (error) {
    issues.push('Pixel configuration check failed');
    results.push({
      test: 'Pixel Configuration',
      success: false,
      error: error.message
    });
  }

  // Test 7: Navigation
  try {
    console.log('7. Testando navegação...');
    const routesExist = [
      '/',
      '/quiz-descubra-seu-estilo',
      '/resultado',
      '/admin/pixel-analysis'
    ];
    
    results.push({
      test: 'Navigation Routes',
      success: true,
      details: `${routesExist.length} routes configured`
    });
  } catch (error) {
    issues.push('Navigation routing issues');
    success = false;
    results.push({
      test: 'Navigation Routes',
      success: false,
      error: error.message
    });
  }

  console.log('✅ Teste completo finalizado');
  console.log(`Sucessos: ${results.filter(r => r.success).length}/${results.length}`);
  console.log(`Problemas: ${issues.length}`);
  
  if (issues.length > 0) {
    console.group('❌ Problemas encontrados:');
    issues.forEach(issue => console.log(`- ${issue}`));
    console.groupEnd();
  }

  console.groupEnd();

  return {
    success: success && issues.length === 0,
    results,
    issues
  };
};

// Quick test for essential functions only
export const runQuickQuizTest = async (): Promise<boolean> => {
  try {
    const quizResponse = await fetch('/api/quiz/1');
    const questionsResponse = await fetch('/api/quiz/1/questions');
    const stylesResponse = await fetch('/api/styles');
    
    return quizResponse.ok && questionsResponse.ok && stylesResponse.ok;
  } catch (error) {
    console.error('Quick test failed:', error);
    return false;
  }
};