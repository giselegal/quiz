import React from 'react'
import { FileText, HelpCircle, Trophy, ArrowRight } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'

interface QuizStep {
  id: string
  title: string
  type: 'intro' | 'question' | 'result' | 'transition'
  components: any[]
  settings: Record<string, any>
}

interface QuizData {
  id: string
  title: string
  steps: QuizStep[]
  settings: Record<string, any>
}

interface StepsSidebarProps {
  className?: string
  quizData: QuizData
  activeStepId: string
  onStepSelect: (stepId: string) => void
}

const stepIcons = {
  intro: FileText,
  question: HelpCircle,
  result: Trophy,
  transition: ArrowRight
}

export const StepsSidebar: React.FC<StepsSidebarProps> = ({
  className = '',
  quizData,
  activeStepId,
  onStepSelect
}) => {
  const handleStepClick = (stepId: string) => {
    onStepSelect(stepId)
  }

  return (
    <div className={`hidden md:block w-full max-w-[9.5rem] pr-2 ${className}`} 
         style={{ position: 'relative' }}>
      <ScrollArea className="h-full w-full">
        <div className="overflow-hidden relative z-[1] flex flex-col gap-1 p-2 pb-6">
          {quizData.steps.map((step, index) => {
            const StepIcon = stepIcons[step.type as keyof typeof stepIcons] || FileText
            const isActive = step.id === activeStepId
            
            return (
              <div
                key={step.id}
                role="button"
                tabIndex={0}
                aria-disabled="false"
                aria-roledescription="draggable"
                className="bg-zinc-950/50 relative hover:z-30 cursor-pointer"
                onClick={() => handleStepClick(step.id)}
                style={{ transform: 'none' }}
              >
                <div className="relative w-full h-full">
                  <div className={`bg-gray-950/80 backdrop-blur-sm border transition-all duration-200 rounded-lg overflow-hidden group hover:shadow-lg ${
                    isActive 
                      ? 'border-amber-500/60 bg-amber-900/20' 
                      : 'border-gray-700/50 hover:border-gray-600/80'
                  }`}>
                    <div className="p-2">
                      <div className="flex flex-col items-center gap-1">
                        <div className={`w-8 h-8 rounded-md flex items-center justify-center border ${
                          isActive
                            ? 'bg-amber-600/20 border-amber-500/40'
                            : 'bg-gray-800/60 border-gray-700/40'
                        }`}>
                          <StepIcon className={`w-4 h-4 ${
                            isActive ? 'text-amber-300' : 'text-gray-300'
                          }`} />
                        </div>
                        
                        <div className="text-center">
                          <div className={`text-xs font-medium leading-tight ${
                            isActive ? 'text-amber-200' : 'text-gray-200'
                          }`}>
                            {index + 1}
                          </div>
                          <div className="text-xs text-gray-400 capitalize leading-tight">
                            {step.type}
                          </div>
                        </div>
                        
                        {step.components?.length > 0 && (
                          <div className={`w-1 h-1 rounded-full ${
                            isActive ? 'bg-amber-400' : 'bg-blue-400'
                          }`}></div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </ScrollArea>
    </div>
  )
}