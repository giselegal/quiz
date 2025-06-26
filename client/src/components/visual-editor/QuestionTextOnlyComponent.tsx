import React from 'react';

export interface QuestionTextOnlyData {
  question: string;
  options: Array<{
    id: string;
    letter: string;
    text: string;
  }>;
  multipleChoice: boolean;
  maxSelections: number;
}

interface QuestionTextOnlyComponentProps {
  data: QuestionTextOnlyData;
  isSelected?: boolean;
  onClick?: () => void;
}

export const QuestionTextOnlyComponent: React.FC<QuestionTextOnlyComponentProps> = ({
  data,
  isSelected,
  onClick
}) => {
  return (
    <div 
      className={`w-full ${isSelected ? 'ring-2 ring-blue-500 rounded-lg' : ''}`}
      onClick={onClick}
    >
      {/* Título da Questão */}
      <div className="mb-4">
        <h1 className="min-w-full text-3xl font-bold text-center text-gray-900">
          {data.question}
        </h1>
      </div>

      {/* Espaçador */}
      <div className="min-w-full py-2 border-dashed border-yellow-500 border rounded-lg mb-4"></div>

      {/* Container das Opções - Layout Vertical */}
      <div className="flex flex-col items-start justify-start gap-2 mb-6">
        {data.options.map((option) => (
          <button
            key={option.id}
            className="whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 option border-zinc-200 bg-background hover:bg-primary hover:text-foreground h-10 px-4 hover:shadow-2xl overflow-hidden min-w-full gap-2 flex py-8 flex-row items-center justify-between border drop-shadow-none"
          >
            <div className="py-2 px-4 w-full flex flex-row text-base items-center text-full-primary justify-between">
              <div className="break-words w-full text-full-primary text-left">
                <p className="m-0">
                  <span className="font-bold">{option.letter})</span> {option.text}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Botão Continuar */}
      <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 min-w-full h-14">
        Continuar
      </button>

      {data.multipleChoice && (
        <p className="text-sm text-gray-600 mt-2 text-center">
          Selecione até {data.maxSelections} opções
        </p>
      )}
    </div>
  );
};

// Dados padrão para nova instância
export const createQuestionTextOnlyData = (): QuestionTextOnlyData => ({
  question: "Como você define o seu jeito de Ser?",
  multipleChoice: true,
  maxSelections: 3,
  options: [
    {
      id: "opt-1",
      letter: "A",
      text: "Sou espontânea e descontraída, adoro coisas simples."
    },
    {
      id: "opt-2", 
      letter: "B",
      text: "Gosto de organização, sou uma pessoa séria e conservadora."
    },
    {
      id: "opt-3",
      letter: "C", 
      text: "Sou prática e objetiva, valorizo a funcionalidade."
    },
    {
      id: "opt-4",
      letter: "D",
      text: "Sou exigente e sofisticada, cuidadosa nas minhas escolhas."
    },
    {
      id: "opt-5",
      letter: "E",
      text: "Tenho um lado delicado e sensível que transparece em tudo."
    },
    {
      id: "opt-6",
      letter: "F",
      text: "Sou confiante e sensual e adoro me cuidar."
    },
    {
      id: "opt-7",
      letter: "G", 
      text: "Sou moderna e audaciosa, tenho presença."
    },
    {
      id: "opt-8",
      letter: "H",
      text: "Sou exótica e aventureira, gosto da liberdade."
    }
  ]
});