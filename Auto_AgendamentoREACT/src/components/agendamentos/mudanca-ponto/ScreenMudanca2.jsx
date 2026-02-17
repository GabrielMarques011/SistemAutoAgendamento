import React from "react";
import { FileText, AlertCircle, Edit3 } from "lucide-react";

export default function ScreenMudanca2({ formData, setFormData, nextStep, prevStep }) {
  const handleObservacaoChange = (e) => {
    setFormData({ 
      ...formData, 
      observacao: e.target.value 
    });
  };

  const getCaracteresRestantes = () => {
    return 500 - (formData.observacao?.length || 0);
  };

  const getDicaObservacao = () => {
    if (!formData.observacao) return "Nenhuma observação informada";
    
    const length = formData.observacao.length;
    if (length < 50) return "Observação muito curta";
    if (length < 150) return "Observação adequada";
    return "Observação detalhada";
  };

  // Função para validar se a observação é válida
  const isObservacaoValida = () => {
    return formData.observacao && formData.observacao.trim().length >= 10;
  };

  const handleNext = () => {
    if (!isObservacaoValida()) {
      return; // Não avança se não for válido
    }
    nextStep();
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header da Tela */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Observações da Mudança</h2>
        <p className="text-gray-600 text-lg">
          Descreva os detalhes e necessidades específicas para esta mudança de ponto
        </p>
      </div>

      <div className="space-y-6 flex-1">
        {/* Área de Observações */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Edit3 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <label className="text-lg font-semibold text-gray-800 block">
                Observações <span className="text-red-500">*</span>
              </label>
              <p className="text-sm text-gray-600">
                Descreva os motivos e detalhes da mudança de ponto (mínimo 10 caracteres)
              </p>
            </div>
          </div>

          {/* Textarea */}
          <div className="relative">
            <textarea
              value={formData.observacao || ""}
              onChange={handleObservacaoChange}
              placeholder="Ex: Mudança necessária devido à reforma no local atual, necessidade de ponto próximo à tomada, local com melhor sinal, etc."
              className={`w-full bg-white h-48 px-4 py-4 border-2 rounded-xl resize-none focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-gray-700 placeholder-gray-400 ${
                formData.observacao 
                  ? isObservacaoValida() 
                    ? "border-green-500 focus:border-green-500" 
                    : "border-orange-500 focus:border-orange-500"
                  : "border-gray-300 focus:border-blue-500"
              }`}
              maxLength={500}
              required
            />
            
            {/* Contador de Caracteres */}
            <div className="absolute bottom-3 right-3">
              <span className={`text-sm font-medium ${
                getCaracteresRestantes() < 50 ? "text-orange-500" : 
                !formData.observacao ? "text-gray-500" :
                isObservacaoValida() ? "text-green-500" : "text-orange-500"
              }`}>
                {getCaracteresRestantes()}
              </span>
            </div>
          </div>

          {/* Mensagem de validação */}
          {formData.observacao && !isObservacaoValida() && (
            <div className="mt-3 flex items-center gap-2 text-orange-600 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>Observação muito curta. Escreva pelo menos 10 caracteres.</span>
            </div>
          )}

          {/* Dicas e Informações */}
          <div className="mt-4 space-y-3">
            {/* Status da Observação */}
            <div className="flex items-center gap-2 text-sm">
              <div className={`w-2 h-2 rounded-full ${
                !formData.observacao ? "bg-gray-400" :
                !isObservacaoValida() ? "bg-orange-500" : "bg-green-500"
              }`}></div>
              <span className="text-gray-600">{getDicaObservacao()}</span>
            </div>

            {/* Dicas de Preenchimento */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-blue-800 mb-1">
                    Dicas para uma boa descrição:
                  </p>
                  <ul className="text-sm text-blue-600 space-y-1">
                    <li>• Motivo da mudança (reforma, melhoria, problema técnico)</li>
                    <li>• Localização específica desejada</li>
                    <li>• Requisitos especiais (tomadas, altura, acesso)</li>
                    <li>• <strong>Mínimo 10 caracteres</strong></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Exemplo de Observação */}
        <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-semibold text-gray-700">Exemplo de Observação Completa:</span>
          </div>
          <p className="text-sm text-gray-600 italic">
            "Necessidade de mudança do ponto atual devido à reforma no setor administrativo. 
            O novo ponto deve ser instalado próximo à sala de reuniões, em local com boa 
            ventilação e próximo à tomada."
          </p>
        </div>

        {/* Resumo da Observação */}
        {formData.observacao && (
          <div className={`rounded-xl p-4 border ${
            isObservacaoValida() 
              ? "bg-green-50 border-green-200" 
              : "bg-orange-50 border-orange-200"
          }`}>
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full animate-pulse ${
                isObservacaoValida() ? "bg-green-500" : "bg-orange-500"
              }`}></div>
              <div>
                <p className={`font-medium ${
                  isObservacaoValida() ? "text-green-800" : "text-orange-800"
                }`}>
                  {isObservacaoValida() 
                    ? "Observação válida!" 
                    : "Observação muito curta"
                  } ({formData.observacao.length} caracteres)
                </p>
                <p className={`text-sm mt-1 ${
                  isObservacaoValida() ? "text-green-600" : "text-orange-600"
                }`}>
                  {isObservacaoValida() 
                    ? "Descrição detalhada, ótimo para o planejamento!"
                    : "Escreva pelo menos 10 caracteres para continuar"
                  }
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Botões de Navegação */}
        <div className="flex justify-between pt-6">
          <button 
            onClick={prevStep}
            className="px-8 py-4 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2 border border-gray-300"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Voltar
          </button>
          <button 
            onClick={handleNext}
            disabled={!isObservacaoValida()}
            className={`px-8 py-4 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2 ${
              isObservacaoValida()
                ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                : "bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed transform-none"
            }`}
          >
            <span>Próximo Passo</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}