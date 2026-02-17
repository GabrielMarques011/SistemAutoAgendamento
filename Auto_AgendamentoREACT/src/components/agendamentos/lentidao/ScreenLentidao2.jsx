import React, { useState, useEffect } from "react";
import { FileText, AlertCircle, Edit3, CheckSquare, Square, ArrowLeft } from "lucide-react";

export default function ScreenLentidao2({ formData, setFormData, nextStep, prevStep }) {
  // DEBUG: Verificar se as props estão chegando
  useEffect(() => {
    console.log("🔍 ScreenLentidao2 - Props recebidas:", {
      hasPrevStep: typeof prevStep === 'function',
      hasNextStep: typeof nextStep === 'function',
      hasFormData: !!formData,
      hasSetFormData: typeof setFormData === 'function'
    });
  }, []);

  const [checklistItems, setChecklistItems] = useState([
    { id: 1, label: "Trocado os cabeamentos", checked: false, text: "Realizada troca dos cabos" },
    { id: 2, label: "Alteração de Canal", checked: false, text: "Alteração de canal realizada" },
    { id: 3, label: "Alteração de Largura de Banda", checked: false, text: "Alteração de largura de banda realizada" },
    { id: 4, label: "Alterado o DNS", checked: false, text: "Foi realizado as alterações do DNS" },
    { id: 5, label: "Habilitado o UPnP", checked: false, text: "UPnP habilitado" },
    { id: 6, label: "Reiniciado os Equipamentos", checked: false, text: "Equipamentos reiniciados" },
    { id: 7, label: "Habilitado IPv6", checked: false, text: "IPv6 habilitado" }
  ]);

  // Estado para os novos campos de validação
  const [validacoes, setValidacoes] = useState({
    velocidadeMedia: formData.velocidadeMedia || "",
    testadoViaCabo: formData.testadoViaCabo || false,
    testadoViaWifi: formData.testadoViaWifi || false,
    quantosEquipamentos: formData.quantosEquipamentos || ""
  });

  // Atualizar formData quando validacoes mudar
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      ...validacoes
    }));
  }, [validacoes, setFormData]);

  // Função para construir o texto das validações no formato correto
  const buildValidacoesText = (validacoes) => {
    const parts = [];
    
    // Testado via cabo e WI-FI - SEMPRE PRIMEIRO
    if (validacoes.testadoViaCabo || validacoes.testadoViaWifi) {
      let viaText = "";
      if (validacoes.testadoViaCabo && validacoes.testadoViaWifi) {
        viaText = "Cabo e WI-FI";
      } else if (validacoes.testadoViaCabo) {
        viaText = "Cabo";
      } else if (validacoes.testadoViaWifi) {
        viaText = "WI-FI";
      }
      parts.push(`- Testado via cabo e via WI-FI? ${viaText}`);
    }
    
    // Velocidade média - SEGUNDO
    if (validacoes.velocidadeMedia) {
      parts.push(`- Qual foi a média do teste de velocidade? ${validacoes.velocidadeMedia}`);
    }
    
    // Quantos equipamentos - TERCEIRO  
    if (validacoes.quantosEquipamentos) {
      parts.push(`- Testado em quantos dispositivos: ${validacoes.quantosEquipamentos}`);
    }
    
    return parts.length > 0 ? parts.join('\n') : "";
  };

  // Função para construir o texto do checklist
  const buildChecklistText = (items) => {
    const selectedItems = items.filter(item => item.checked);
    if (selectedItems.length === 0) return "";
    
    const checklistText = selectedItems.map(item => item.text).join(', ');
    return `Processos feitos: ${checklistText}.`;
  };

  // Função centralizada para atualizar toda a observação
  const updateObservacaoCompleta = () => {
    const checklistText = buildChecklistText(checklistItems);
    const validacoesText = buildValidacoesText(validacoes);
    
    let novaObservacao = '';
    
    // Adiciona o checklist se existir
    if (checklistText) {
      novaObservacao = checklistText;
    }
    
    // Adiciona as validações se existirem
    if (validacoesText) {
      if (novaObservacao) {
        novaObservacao += '\n\n' + validacoesText;
      } else {
        novaObservacao = validacoesText;
      }
    }
    
    // Atualiza o formData
    setFormData(prev => ({ 
      ...prev, 
      observacao: novaObservacao,
      ...validacoes
    }));
  };

  // Atualiza a observação quando o checklist ou validações mudam
  useEffect(() => {
    updateObservacaoCompleta();
  }, [checklistItems, validacoes]);

  const handleObservacaoChange = (e) => {
    const newValue = e.target.value;
    setFormData({ 
      ...formData, 
      observacao: newValue 
    });
  };

  const toggleChecklistItem = (id) => {
    setChecklistItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const clearChecklist = () => {
    setChecklistItems(prevItems =>
      prevItems.map(item => ({ ...item, checked: false }))
    );
  };

  // Funções para manipular os novos campos
  const handleValidacaoChange = (campo, valor) => {
    setValidacoes(prev => ({
      ...prev,
      [campo]: valor
    }));
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
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Observações da Lentidão</h2>
            <p className="text-gray-600 text-lg">
              Descreva os detalhes e necessidades específicas para esta lentidão
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

        {/* Validações de Teste */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-100 rounded-lg">
              <AlertCircle className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <label className="text-lg font-semibold text-gray-800 block">
                Validações de Teste
              </label>
              <p className="text-sm text-gray-600">
                Informe os resultados dos testes realizados (será adicionado automaticamente às observações)
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Velocidade Média */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Qual foi a média do teste de velocidade? (Mbps)
              </label>
              <input
                type="text"
                value={validacoes.velocidadeMedia}
                onChange={(e) => handleValidacaoChange('velocidadeMedia', e.target.value)}
                placeholder="Ex: 200Mbps"
                className="w-full bg-white text-gray-800 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200"
              />
            </div>

            {/* Quantos Equipamentos */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Testado em quantos equipamentos?
              </label>
              <input
                type="text"
                value={validacoes.quantosEquipamentos}
                onChange={(e) => handleValidacaoChange('quantosEquipamentos', e.target.value)}
                placeholder="Ex: 3"
                className="w-full bg-white text-gray-800 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200"
              />
            </div>

            {/* Checkboxes para Cabo e Wi-Fi */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Testado via:
              </label>
              <div className="flex gap-6">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={validacoes.testadoViaCabo}
                    onChange={(e) => handleValidacaoChange('testadoViaCabo', e.target.checked)}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Cabo de rede</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={validacoes.testadoViaWifi}
                    onChange={(e) => handleValidacaoChange('testadoViaWifi', e.target.checked)}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">WI-FI</span>
                </label>
              </div>
            </div>
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
              value={formData.observacao || ""}
              onChange={handleObservacaoChange}
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
            "Processos feitos: Alteração de largura de banda e canal realizada, UPnP habilitado.<br />
            - Testado via cabo e via WI-FI? Cabo e WI-FI<br />
            - Qual foi a média do teste de velocidade? 100Mbps<br />
            - Testado em quantos dispositivos: 4"
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