import React, { useState, useEffect } from "react";
import { FileText, AlertCircle, Edit3, ArrowLeft, Cpu, Power, Zap } from "lucide-react";

export default function ScreenFonte2({ formData, setFormData, nextStep, prevStep }) {
  useEffect(() => {
    /* console.log("🔍 ScreenFonte2 - Props recebidas:", {
      hasPrevStep: typeof prevStep === 'function',
      hasNextStep: typeof nextStep === 'function',
      hasFormData: !!formData,
      hasSetFormData: typeof setFormData === 'function'
    }); */
  }, []);

  // Estados para os novos campos
  const [equipamento, setEquipamento] = useState(formData.equipamento || "");
  const [trocadoTomada, setTrocadoTomada] = useState(formData.trocado_tomada || "");
  const [fonteQueimada, setFonteQueimada] = useState(formData.fonte_queimada || "");

  // Atualizar formData quando estados mudarem
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      equipamento: equipamento,
      trocado_tomada: trocadoTomada,
      fonte_queimada: fonteQueimada
    }));
  }, [equipamento, trocadoTomada, fonteQueimada, setFormData]);

  // Função para construir o texto das validações
  const buildValidacoesText = () => {
    const parts = [];
    
    if (equipamento) {
      parts.push(`Equipamento: ${equipamento.toUpperCase()}`);
    }
    
    if (trocadoTomada) {
      parts.push(`- Trocado de tomada: ${trocadoTomada.toUpperCase()}`);
    }
    
    if (fonteQueimada) {
      parts.push(`- Fonte queimada: ${fonteQueimada.toUpperCase()}`);
    }
    
    return parts.length > 0 ? parts.join('\n') : "";
  };

  // Atualiza a observação quando os estados mudam
  useEffect(() => {
    const validacoesText = buildValidacoesText();
    setFormData(prev => ({ 
      ...prev, 
      observacao: validacoesText,
      equipamento: equipamento,
      trocado_tomada: trocadoTomada,
      fonte_queimada: fonteQueimada
    }));
  }, [equipamento, trocadoTomada, fonteQueimada]);

  const handleObservacaoChange = (e) => {
    const newValue = e.target.value;
    setFormData({ 
      ...formData, 
      observacao: newValue 
    });
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

  const handleVoltar = () => {
    /* console.log("🔄 ScreenFonte2 - Tentando voltar..."); */
    if (typeof prevStep === 'function') {
      /* console.log("✅ ScreenFonte2 - prevStep é uma função, executando..."); */
      prevStep();
    } else {
      /* console.error("❌ ScreenFonte2 - prevStep não é uma função:", prevStep); */
      alert("Função de voltar não disponível. Contate o suporte.");
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
      /* console.error("ScreenFonte2 - nextStep não é uma função"); */
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Diagnóstico de Fonte</h2>
            <p className="text-gray-600 text-lg">
              Informe os dados do equipamento e diagnóstico da fonte
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6 flex-1">
        {/* Seção de Tipo de Equipamento */}
        <div className="rounded-xl p-6 border border-blue-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Cpu className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <label className="text-lg font-semibold text-blue-800 block">
                Equipamento
              </label>
              <p className="text-sm text-gray-600">
                Selecione o tipo de equipamento
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => setEquipamento("onu")}
              className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                equipamento === "onu" 
                  ? "bg-blue-50 border-blue-300 shadow-sm" 
                  : "bg-gray-50 border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${
                  equipamento === "onu" ? "bg-blue-500" : "bg-gray-400"
                }`}></div>
                <span className={`font-medium ${
                  equipamento === "onu" ? "text-blue-800" : "text-gray-700"
                }`}>
                  ONU
                </span>
              </div>
            </button>

            <button
              onClick={() => setEquipamento("ont")}
              className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                equipamento === "ont" 
                  ? "bg-blue-50 border-blue-300 shadow-sm" 
                  : "bg-gray-50 border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${
                  equipamento === "ont" ? "bg-blue-500" : "bg-gray-400"
                }`}></div>
                <span className={`font-medium ${
                  equipamento === "ont" ? "text-blue-800" : "text-gray-700"
                }`}>
                  ONT
                </span>
              </div>
            </button>

            <button
              onClick={() => setEquipamento("roteador")}
              className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                equipamento === "roteador" 
                  ? "bg-blue-50 border-blue-300 shadow-sm" 
                  : "bg-gray-50 border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${
                  equipamento === "roteador" ? "bg-blue-500" : "bg-gray-400"
                }`}></div>
                <span className={`font-medium ${
                  equipamento === "roteador" ? "text-blue-800" : "text-gray-700"
                }`}>
                  ROTEADOR
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Seção de Diagnóstico */}
        <div className="rounded-xl p-6 border border-green-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-green-100 rounded-lg">
              <Power className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <label className="text-lg font-semibold text-green-800 block">
                Diagnóstico
              </label>
              <p className="text-sm text-gray-600">
                Informe as validações realizadas
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Trocado de tomada */}
            <div className="bg-white rounded-lg p-4 border border-green-200">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-gray-600">Trocado de tomada?</span>
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="trocado_tomada"
                    checked={trocadoTomada === "sim"}
                    onChange={() => setTrocadoTomada("sim")}
                    className="w-4 h-4 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-gray-700">SIM</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="trocado_tomada"
                    checked={trocadoTomada === "nao"}
                    onChange={() => setTrocadoTomada("nao")}
                    className="w-4 h-4 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-gray-700">NÃO</span>
                </label>
              </div>
            </div>

            {/* Fonte queimada */}
            <div className="bg-white rounded-lg p-4 border border-green-200">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-gray-600">Fonte queimada?</span>
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="fonte_queimada"
                    checked={fonteQueimada === "sim"}
                    onChange={() => setFonteQueimada("sim")}
                    className="w-4 h-4 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-gray-700">SIM</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="fonte_queimada"
                    checked={fonteQueimada === "nao"}
                    onChange={() => setFonteQueimada("nao")}
                    className="w-4 h-4 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-gray-700">NÃO</span>
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
                Descrição completa da validação (preenchida automaticamente)
              </p>
            </div>
          </div>

          {/* Textarea */}
          <div className="relative">
            <textarea
              value={formData.observacao || ""}
              onChange={handleObservacaoChange}
              placeholder="As informações serão preenchidas automaticamente com base nas seleções acima..."
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
          </div>
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