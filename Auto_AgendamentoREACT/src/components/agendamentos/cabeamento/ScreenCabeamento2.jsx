import React, { useState, useEffect } from "react";
import { FileText, AlertCircle, Edit3, ArrowLeft, Home, Building, Wrench, Construction } from "lucide-react";

export default function ScreenCabeamento2({ formData, setFormData, nextStep, prevStep }) {
  useEffect(() => {
    /* console.log("🔍 ScreenCabeamento2 - Props recebidas:", {
      hasPrevStep: typeof prevStep === 'function',
      hasNextStep: typeof nextStep === 'function',
      hasFormData: !!formData,
      hasSetFormData: typeof setFormData === 'function'
    }); */
  }, []);

  // Estados para os novos campos de cabeamento
  const [tipoProblema, setTipoProblema] = useState(formData.tipo_problema || "");
  const [local, setLocal] = useState(formData.local || "");

  // Atualizar formData quando estados mudarem
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      tipo_problema: tipoProblema,
      local: local
    }));
  }, [tipoProblema, local, setFormData]);

  // Função para construir o texto das validações
  const buildValidacoesText = () => {
    const parts = [];
    
    if (tipoProblema) {
      parts.push(`${tipoProblema}`);
    }
    
    if (local) {
      parts.push(`- Local: ${local.toUpperCase()}`);
    }
    
    return parts.length > 0 ? parts.join('\n') : "";
  };

  // Atualiza a observação quando os estados mudam
  useEffect(() => {
    const validacoesText = buildValidacoesText();
    setFormData(prev => ({ 
      ...prev, 
      observacao: validacoesText,
      tipo_problema: tipoProblema,
      local: local
    }));
  }, [tipoProblema, local]);

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
    /* console.log("🔄 ScreenCabeamento2 - Tentando voltar..."); */
    if (typeof prevStep === 'function') {
      /* console.log("✅ ScreenCabeamento2 - prevStep é uma função, executando..."); */
      prevStep();
    } else {
      /* console.error("❌ ScreenCabeamento2 - prevStep não é uma função:", prevStep); */
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
      // console.error("ScreenCabeamento2 - nextStep não é uma função");
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Cabeamento Fora do Padrão</h2>
            <p className="text-gray-600 text-lg">
              Informe o tipo de problema e local do cabeamento
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6 flex-1">
        {/* Seção de Tipo de Problema */}
        <div className="rounded-xl p-6 border border-orange-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Wrench className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <label className="text-lg font-semibold text-orange-800 block">
                Tipo de Problema
              </label>
              <p className="text-sm text-gray-600">
                Selecione o tipo de problema identificado
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => setTipoProblema("Cliente com obras no local")}
              className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                tipoProblema === "Cliente com obras no local" 
                  ? "bg-orange-50 border-orange-300 shadow-sm" 
                  : "bg-gray-50 border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${
                  tipoProblema === "Cliente com obras no local" ? "bg-orange-500" : "bg-gray-400"
                }`}></div>
                <span className={`font-medium ${
                  tipoProblema === "Cliente com obras no local" ? "text-orange-800" : "text-gray-700"
                }`}>
                  Cliente com obras no local
                </span>
              </div>
            </button>

            <button
              onClick={() => setTipoProblema("Cliente instalou conduítes")}
              className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                tipoProblema === "Cliente instalou conduítes" 
                  ? "bg-orange-50 border-orange-300 shadow-sm" 
                  : "bg-gray-50 border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${
                  tipoProblema === "Cliente instalou conduítes" ? "bg-orange-500" : "bg-gray-400"
                }`}></div>
                <span className={`font-medium ${
                  tipoProblema === "Cliente instalou conduítes" ? "text-orange-800" : "text-gray-700"
                }`}>
                  Cliente instalou conduítes
                </span>
              </div>
            </button>

            <button
              onClick={() => setTipoProblema("Cabeamento improvisado pelo cliente")}
              className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                tipoProblema === "Cabeamento improvisado pelo cliente" 
                  ? "bg-orange-50 border-orange-300 shadow-sm" 
                  : "bg-gray-50 border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${
                  tipoProblema === "Cabeamento improvisado pelo cliente" ? "bg-orange-500" : "bg-gray-400"
                }`}></div>
                <span className={`font-medium ${
                  tipoProblema === "Cabeamento improvisado pelo cliente" ? "text-orange-800" : "text-gray-700"
                }`}>
                  Cabeamento improvisado pelo cliente
                </span>
              </div>
            </button>

            <button
              onClick={() => setTipoProblema("Infraestrutura inadequada")}
              className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                tipoProblema === "Infraestrutura inadequada" 
                  ? "bg-orange-50 border-orange-300 shadow-sm" 
                  : "bg-gray-50 border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${
                  tipoProblema === "Infraestrutura inadequada" ? "bg-orange-500" : "bg-gray-400"
                }`}></div>
                <span className={`font-medium ${
                  tipoProblema === "Infraestrutura inadequada" ? "text-orange-800" : "text-gray-700"
                }`}>
                  Infraestrutura inadequada
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Seção de Local */}
        <div className="rounded-xl p-6 border border-blue-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Home className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <label className="text-lg font-semibold text-blue-800 block">
                Local
              </label>
              <p className="text-sm text-gray-600">
                Informe a localização do problema
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => setLocal("interno")}
              className={`p-6 rounded-xl border-2 text-center transition-all duration-200 ${
                local === "interno" 
                  ? "bg-blue-50 border-blue-300 shadow-sm" 
                  : "bg-gray-50 border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex flex-col items-center gap-3">
                <Home className={`w-6 h-6 ${
                  local === "interno" ? "text-blue-600" : "text-gray-500"
                }`} />
                <span className={`font-medium ${
                  local === "interno" ? "text-blue-800" : "text-gray-700"
                }`}>
                  INTERNO
                </span>
              </div>
            </button>

            <button
              onClick={() => setLocal("externo")}
              className={`p-6 rounded-xl border-2 text-center transition-all duration-200 ${
                local === "externo" 
                  ? "bg-blue-50 border-blue-300 shadow-sm" 
                  : "bg-gray-50 border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex flex-col items-center gap-3">
                <Construction className={`w-6 h-6 ${
                  local === "externo" ? "text-blue-600" : "text-gray-500"
                }`} />
                <span className={`font-medium ${
                  local === "externo" ? "text-blue-800" : "text-gray-700"
                }`}>
                  EXTERNO
                </span>
              </div>
            </button>
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