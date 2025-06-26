
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Quiz theme interface
export interface QuizTheme {
  primaryColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
  borderRadius: string;
}

// Quiz behavior interface
export interface QuizBehavior {
  autoAdvance: boolean;
  maxSelections: number;
  showProgress: boolean;
  allowBacktrack: boolean;
  shuffleOptions: boolean;
}

// Quiz layout interface
export interface QuizLayout {
  layout: 'single-column' | 'two-column' | 'grid';
  optionsPerRow: number;
  spacing: string;
  alignment: 'left' | 'center' | 'right';
  cardStyle?: string;
  gridType?: string;
}

// Quiz styles hook
export const useQuizStyles = () => {
  const { theme } = useQuizTheme();
  const { layout } = useQuizLayout();
  
  const cssVariables = {
    '--quiz-primary-color': theme.primaryColor,
    '--quiz-bg-color': theme.backgroundColor,
    '--quiz-text-color': theme.textColor,
    '--quiz-font-family': theme.fontFamily,
    '--quiz-border-radius': theme.borderRadius,
  } as React.CSSProperties;
  
  return { cssVariables, theme, layout };
};

// Quiz theme context
const QuizThemeContext = createContext<{
  theme: QuizTheme;
  updateTheme: (theme: Partial<QuizTheme>) => Promise<void>;
} | null>(null);

// Quiz behavior context
const QuizBehaviorContext = createContext<{
  behavior: QuizBehavior;
  updateBehavior: (behavior: Partial<QuizBehavior>) => Promise<void>;
  isLoading: boolean;
} | null>(null);

// Quiz layout context
const QuizLayoutContext = createContext<{
  layout: QuizLayout;
  updateLayout: (layout: Partial<QuizLayout>) => Promise<void>;
  isLoading: boolean;
} | null>(null);

// Quiz config context
const QuizConfigContext = createContext<{
  state: any;
  exportConfig: () => any;
  updateConfig: (config: any) => Promise<void>;
  resetConfig: () => Promise<void>;
  importConfig: (config: any) => Promise<void>;
} | null>(null);

// Default values
const defaultTheme: QuizTheme = {
  primaryColor: '#B89B7A',
  backgroundColor: '#FAF9F7',
  textColor: '#432818',
  fontFamily: 'Inter',
  borderRadius: '0.5rem',
};

const defaultBehavior: QuizBehavior = {
  autoAdvance: false,
  maxSelections: 1,
  showProgress: true,
  allowBacktrack: true,
  shuffleOptions: false,
};

const defaultLayout: QuizLayout = {
  layout: 'single-column',
  optionsPerRow: 2,
  spacing: '1rem',
  alignment: 'center',
};

// Quiz theme hook
export const useQuizTheme = () => {
  const context = useContext(QuizThemeContext);
  if (!context) {
    // Return default values if not in context
    return {
      theme: defaultTheme,
      updateTheme: async (theme: Partial<QuizTheme>) => {
        console.log('Theme update called outside context:', theme);
      }
    };
  }
  return context;
};

// Quiz behavior hook
export const useQuizBehavior = () => {
  const context = useContext(QuizBehaviorContext);
  if (!context) {
    return {
      behavior: defaultBehavior,
      updateBehavior: async (behavior: Partial<QuizBehavior>) => {
        console.log('Behavior update called outside context:', behavior);
      },
      isLoading: false,
    };
  }
  return context;
};

// Quiz layout hook
export const useQuizLayout = () => {
  const context = useContext(QuizLayoutContext);
  if (!context) {
    return {
      layout: defaultLayout,
      updateLayout: async (layout: Partial<QuizLayout>) => {
        console.log('Layout update called outside context:', layout);
      },
      isLoading: false,
    };
  }
  return context;
};

// Quiz config hook
export const useQuizConfig = () => {
  const context = useContext(QuizConfigContext);
  if (!context) {
    return {
      state: { isDirty: false, isLoading: false },
      exportConfig: () => ({}),
      updateConfig: async (config: any) => {
        console.log('Config update called outside context:', config);
      },
      resetConfig: async () => {
        console.log('Config reset called outside context');
      },
      importConfig: async (config: any) => {
        console.log('Config import called outside context:', config);
      },
    };
  }
  return context;
};

// Provider component
export const QuizConfigProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<QuizTheme>(defaultTheme);
  const [behavior, setBehavior] = useState<QuizBehavior>(defaultBehavior);
  const [layout, setLayout] = useState<QuizLayout>(defaultLayout);
  const [state, setState] = useState({ isDirty: false, isLoading: false });

  const updateTheme = async (newTheme: Partial<QuizTheme>) => {
    setTheme(prev => ({ ...prev, ...newTheme }));
    setState(prev => ({ ...prev, isDirty: true }));
  };

  const updateBehavior = async (newBehavior: Partial<QuizBehavior>) => {
    setBehavior(prev => ({ ...prev, ...newBehavior }));
    setState(prev => ({ ...prev, isDirty: true }));
  };

  const updateLayout = async (newLayout: Partial<QuizLayout>) => {
    setLayout(prev => ({ ...prev, ...newLayout }));
    setState(prev => ({ ...prev, isDirty: true }));
  };

  const exportConfig = () => {
    return {
      theme,
      behavior,
      layout,
      state,
    };
  };

  const updateConfig = async (config: any) => {
    if (config.theme) setTheme(config.theme);
    if (config.behavior) setBehavior(config.behavior);
    if (config.layout) setLayout(config.layout);
    setState(prev => ({ ...prev, isDirty: true }));
  };

  const resetConfig = async () => {
    setTheme(defaultTheme);
    setBehavior(defaultBehavior);
    setLayout(defaultLayout);
    setState({ isDirty: false, isLoading: false });
  };

  const importConfig = async (config: any) => {
    await updateConfig(config);
  };

  return (
    <QuizThemeContext.Provider value={{ theme, updateTheme }}>
      <QuizBehaviorContext.Provider value={{ behavior, updateBehavior, isLoading: state.isLoading }}>
        <QuizLayoutContext.Provider value={{ layout, updateLayout, isLoading: state.isLoading }}>
          <QuizConfigContext.Provider value={{ state, exportConfig, updateConfig, resetConfig, importConfig }}>
            {children}
          </QuizConfigContext.Provider>
        </QuizLayoutContext.Provider>
      </QuizBehaviorContext.Provider>
    </QuizThemeContext.Provider>
  );
};
