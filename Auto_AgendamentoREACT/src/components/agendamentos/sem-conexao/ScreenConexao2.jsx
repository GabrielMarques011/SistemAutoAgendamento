import React, { useState, useEffect, useRef } from "react";
import { FileText, AlertCircle, Edit3, CheckSquare, Square, ArrowLeft } from "lucide-react";

export default function ScreenConexao2({ formData, setFormData, nextStep, prevStep }) {
  // DEBUG: Verificar se as props estão chegando
  useEffect(() => {
    console.log("🔍 ScreenConexao2 - Props recebidas:", {
      hasPrevStep: typeof prevStep === 'function',
      hasNextStep: typeof nextStep === 'function',
      hasFormData: !!formData,
      hasSetFormData: typeof setFormData === 'function'
    });
  }, []);

  const textareaRef = useRef(null);
  const [isManualEdit, setIsManualEdit] = useState(false);

  const [checklistItems, setChecklistItems] = useState([
    { id: 1, label: "Trocado os cabeamentos", checked: false, text: "Realizada troca dos cabos" },
    { id: 2, label: "Resetado roteador", checked: false, text: "Reset realizado no roteador" },
    { id: 3, label: "Trocou o PPPoE", checked: false, text: "PPPoE configurado/atualizado" },
    { id: 4, label: "Realizado testes de acesso no celular", checked: false, text: "Foi realizado testes de acesso em celular" },
    { id: 5, label: "Realizado testes de acesso no computador", checked: false, text: "Foi realizado testes de acesso em computador/notebook" }
  ]);

  // Função para construir o texto do checklist
  const buildChecklistText = (items) => {
    const selectedItems = items.filter(item => item.checked);
    if (selectedItems.length === 0) return "";
    
    const checklistText = selectedItems.map(item => item.text).join(', ');
    return `Processos feitos: ${checklistText}.`;
  };

  // CORREÇÃO: useEffect otimizado para evitar loops
  useEffect(() => {
    if (!isManualEdit) {
      const checklistText = buildChecklistText(checklistItems);
      
      // Se não há texto de checklist, não faz nada
      if (!checklistText) return;
      
      // Se já existe o mesmo texto de checklist, não atualiza
      const currentText = formData.observacao || '';
      if (currentText.includes(checklistText)) return;
      
      // Remove qualquer texto anterior de "Processos feitos:" da observação
      const baseText = currentText.replace(/Processos feitos:\s*[^.]*\.?/g, '').trim();
      
      let newObservacao;
      if (checklistText && baseText) {
        newObservacao = `${baseText} ${checklistText}`;
      } else if (checklistText) {
        newObservacao = checklistText;
      } else {
        newObservacao = baseText;
      }

      // Atualiza apenas se for diferente e não for edição manual
      if (newObservacao.trim() !== currentText.trim()) {
        setFormData({ 
          ...formData, 
          observacao: newObservacao.trim()
        });
      }
    }
  }, [checklistItems, isManualEdit]);

  const handleObservacaoChange = (e) => {
    const newValue = e.target.value;
    setIsManualEdit(true);
    
    setFormData({ 
      ...formData, 
      observacao: newValue 
    });
  };

  // Função para lidar com foco no textarea - marca como edição manual
  const handleTextareaFocus = () => {
    setIsManualEdit(true);
  };

  // Função para lidar com blur no textarea
  const handleTextareaBlur = () => {
    // Se o texto estiver vazio ou apenas com espaços, permite atualização automática novamente
    if (!formData.observacao || formData.observacao.trim().length === 0) {
      setIsManualEdit(false);
    }
  };

  const toggleChecklistItem = (id) => {
    setIsManualEdit(false);
    setChecklistItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const clearChecklist = () => {
    setIsManualEdit(false);
    setChecklistItems(prevItems =>
      prevItems.map(item => ({ ...item, checked: false }))
    );
  };

  const getCaracteresRestantes = () => {
    return 2000 - (formData.observacao?.length || 0);
  };

  const getDicaObservacao = () => {
    if (!formData.observacao) return "Nenhuma observação informada";
    
    const length = formData.observacao.length;
    if (length < 50) return "Observação muito curta";
    if (length < 150) return "Observação adequada";
    return "Observação detalhada";
  };

  const isObservacaoValida = () => {
    return formData.observacao && formData.observacao.trim().length >= 10;
  };

  // FUNÇÃO CORRIGIDA PARA VOLTAR
  const handleVoltar = () => {
    console.log("🔄 ScreenMudanca2 - Tentando voltar...");
    if (typeof prevStep === 'function') {
      console.log("✅ ScreenMudanca2 - prevStep é uma função, executando...");
      prevStep();
    } else {
      console.error("❌ ScreenMudanca2 - prevStep não é uma função:", prevStep);
      alert("Função de voltar não disponível. Contate o suporte.");
      // Fallback alternativo
      if (window.history && window.history.length > 1) {
        window.history.back();
      }
    }
  };

  const handleNext = () => {
    if (!isObservacaoValida()) {
      return;
    }
    
    if (typeof nextStep === 'function') {
      nextStep();
    } else {
      console.error("ScreenMudanca2 - nextStep não é uma função");
    }
  };

  const selectedChecklistCount = checklistItems.filter(item => item.checked).length;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Observações da Sem Conexão</h2>
            <p className="text-gray-600 text-lg">
              Descreva os detalhes e necessidades específicas para esta sem conexão
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6 flex-1">
        {/* Seção de Checklist */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckSquare className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <label className="text-lg font-semibold text-gray-800 block">
                  Checklist de Ações {selectedChecklistCount > 0 && `(${selectedChecklistCount} selecionadas)`}
                </label>
                <p className="text-sm text-gray-600">
                  Marque as ações realizadas para compor automaticamente a observação
                </p>
              </div>
            </div>
            {selectedChecklistCount > 0 && (
              <button
                onClick={clearChecklist}
                className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                Limpar
              </button>
            )}
          </div>

          {/* Grid do Checklist */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            {checklistItems.map((item) => (
              <div
                key={item.id}
                onClick={() => toggleChecklistItem(item.id)}
                className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                  item.checked
                    ? 'bg-blue-50 border-blue-300 shadow-sm'
                    : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                }`}
              >
                {item.checked ? (
                  <CheckSquare className="w-5 h-5 text-blue-600 flex-shrink-0" />
                ) : (
                  <Square className="w-5 h-5 text-gray-400 flex-shrink-0" />
                )}
                <span className={`text-sm font-medium ${
                  item.checked ? 'text-blue-800' : 'text-gray-700'
                }`}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

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
              ref={textareaRef}
              value={formData.observacao || ""}
              onChange={handleObservacaoChange}
              onFocus={handleTextareaFocus}
              onBlur={handleTextareaBlur}
              placeholder="Ex: Foram realizados alguns teste como: reset no roteador, troca / inversão dos cabos mas nada deu certo, etc."
              className={`w-full bg-white h-48 px-4 py-4 border-2 rounded-xl resize-none focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-gray-700 placeholder-gray-400 ${
                formData.observacao 
                  ? isObservacaoValida() 
                    ? "border-green-500 focus:border-green-500" 
                    : "border-orange-500 focus:border-orange-500"
                  : "border-gray-300 focus:border-blue-500"
              }`}
              maxLength={2000}
              required
            />
            
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

          {formData.observacao && !isObservacaoValida() && (
            <div className="mt-3 flex items-center gap-2 text-orange-600 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>Observação muito curta. Escreva pelo menos 10 caracteres.</span>
            </div>
          )}

          <div className="mt-4 space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <div className={`w-2 h-2 rounded-full ${
                !formData.observacao ? "bg-gray-400" :
                !isObservacaoValida() ? "bg-orange-500" : "bg-green-500"
              }`}></div>
              <span className="text-gray-600">{getDicaObservacao()}</span>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-blue-800 mb-1">
                    Dicas para uma boa descrição:
                  </p>
                  <ul className="text-sm text-blue-600 space-y-1">
                    <li>• Use o checklist acima para ações comuns</li>
                    <li>• Motivo da abertura do chamado</li>
                    <li>• Relatar processos que realizou</li>
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
            "Processos feitos: Reset realizado no roteador, configuração de PPPoE no roteador, troca dos dados do PPPoE mas infelizmente não houve sucesso nas tentativas. 
            Ordem de serviço agendada para identificar se é falha no equipamento ou algo semelhante a isso."
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

        {/* Botões de Navegação CORRIGIDOS */}
        <div className="flex justify-between pt-6">
          <button 
            onClick={handleVoltar}
            className="px-8 py-4 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2 border border-gray-300"
          >
            <ArrowLeft className="w-5 h-5" />
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