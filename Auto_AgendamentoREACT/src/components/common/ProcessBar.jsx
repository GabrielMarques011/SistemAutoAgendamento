// src/components/ProgressBar.jsx
import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export default function ProgressBar({ currentStep, totalSteps, stepsLabels }) {
  // Se totalSteps não for fornecido, use o comprimento de stepsLabels ou 6
  const total = totalSteps || (stepsLabels ? stepsLabels.length : 6);
  // Se stepsLabels não for fornecido, crie um array de strings vazias com o tamanho total
  const labels = stepsLabels || Array(total).fill('');

  // Crie um array de steps [1, 2, ..., total]
  const steps = Array.from({ length: total }, (_, i) => i + 1);

  // Calcula a largura da linha ativa
  const progressWidth = total > 1 ? ((currentStep - 1) / (total - 1)) * 100 : 0;

  return (
    <div className="w-full">
      {/* Barra de Progresso Principal */}
      <div className="flex items-center justify-center relative w-[80%] mx-auto">
        {/* Linha de fundo */}
        <div className="absolute top-1/2 left-0 right-0 h-0.2 bg-gray-200 -translate-y-1/2 z-0"></div>
        
        {/* Linha ativa */}
        <div 
          className="absolute top-1/2 left-0 h-0.5 bg-blue-600 -translate-y-1/2 z-10 transition-all duration-500 ease-in-out"
          style={{ 
            width: `${progressWidth}%` 
          }}
        ></div>

        {steps.map((num, idx) => (
          <React.Fragment key={num}>
            {/* Ponto do progresso */}
            <div className="flex flex-col items-center relative z-20">
              <div
                className={`
                  flex items-center justify-center w-8 h-8 rounded-full border transition-all duration-300
                  ${currentStep === num 
                    ? 'bg-blue-600 border-blue-600 text-white shadow-md' 
                    : currentStep > num 
                    ? 'bg-green-500 border-green-500 text-white' 
                    : 'bg-white border-gray-300 text-gray-400'
                  }
                `}
              >
                {currentStep > num ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <span className={`text-sm font-medium ${currentStep === num ? 'text-white' : 'text-gray-500'}`}>
                    {num}
                  </span>
                )}
              </div>
              
              {/* Label da etapa */}
              <div className={`
                mt-2 text-xs font-medium transition-all duration-300 whitespace-nowrap
                ${currentStep === num 
                  ? 'text-blue-600 font-semibold' 
                  : currentStep > num 
                  ? 'text-green-600' 
                  : 'text-gray-500'
                }
              `}>
                {labels[num - 1]}
              </div>
            </div>

            {/* Linha conectora */}
            {idx < total - 1 && (
              <div
                className={`
                  flex-1 h-0.5 transition-all duration-500
                  ${currentStep > num ? 'bg-green-500' : 'bg-gray-200'}
                `}
              ></div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Indicador de Progresso Atual */}
      <div className="mt-6 flex justify-center">
        {/* ... */}
      </div>
    </div>
  );
}