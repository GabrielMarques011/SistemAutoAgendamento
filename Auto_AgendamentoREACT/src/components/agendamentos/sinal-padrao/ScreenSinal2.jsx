import React, { useState, useEffect } from "react";
import { FileText, AlertCircle, Edit3, ArrowLeft, Signal, Activity } from "lucide-react";

export default function ScreenSinal2({ formData, setFormData, nextStep, prevStep }) {
  useEffect(() => {
    console.log("🔍 ScreenSinal2 - Props recebidas:", {
      hasPrevStep: typeof prevStep === 'function',
      hasNextStep: typeof nextStep === 'function',
      hasFormData: !!formData,
      hasSetFormData: typeof setFormData === 'function'
    });
  }, []);

  // Estados para os campos de sinal
  const [sinalRX, setSinalRX] = useState(formData.sinal_rx || "");
  const [sinalTX, setSinalTX] = useState(formData.sinal_tx || "");
  const [primariaAlta, setPrimariaAlta] = useState(formData.primaria_alta || false);
  const [mediaRX, setMediaRX] = useState(formData.media_rx || "");
  const [mediaTX, setMediaTX] = useState(formData.media_tx || "");

  // Atualizar formData quando estados mudarem
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      sinal_rx: sinalRX,
      sinal_tx: sinalTX,
      primaria_alta: primariaAlta,
      media_rx: mediaRX,
      media_tx: mediaTX
    }));
  }, [sinalRX, sinalTX, primariaAlta, mediaRX, mediaTX, setFormData]);

  // Função para construir o texto das validações
  const buildValidacoesText = () => {
    const parts = [];
    
    if (sinalRX) {
      parts.push(`Sinal do Cliente RX: ${sinalRX}`);
    }
    
    if (sinalTX) {
      parts.push(`Sinal do Cliente TX: ${sinalTX}\n`);
    }
    
    parts.push(`- Primária com Sinal Alto: ${primariaAlta ? "SIM" : "NÃO"}`);
    
    if (primariaAlta) {
      if (mediaRX) {
        parts.push(`- Média Sinal RX: ${mediaRX}`);
      }
      if (mediaTX) {
        parts.push(`- Média Sinal TX: ${mediaTX}`);
      }
    }
    
    return parts.length > 0 ? parts.join('\n') : "";
  };

  // Atualiza a observação quando os estados mudam
  useEffect(() => {
    const validacoesText = buildValidacoesText();
    setFormData(prev => ({ 
      ...prev, 
      observacao: validacoesText,
      sinal_rx: sinalRX,
      sinal_tx: sinalTX,
      primaria_alta: primariaAlta,
      media_rx: mediaRX,
      media_tx: mediaTX
    }));
  }, [sinalRX, sinalTX, primariaAlta, mediaRX, mediaTX]);

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
    console.log("🔄 ScreenSinal2 - Tentando voltar...");
    if (typeof prevStep === 'function') {
      console.log("✅ ScreenSinal2 - prevStep é uma função, executando...");
      prevStep();
    } else {
      console.error("❌ ScreenSinal2 - prevStep não é uma função:", prevStep);
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
      console.error("ScreenSinal2 - nextStep não é uma função");
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Diagnóstico de Sinal</h2>
            <p className="text-gray-600 text-lg">
              Informe os dados do sinal do cliente
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6 flex-1">
        {/* Seção de Diagnóstico de Sinal */}
        <div className="rounded-xl p-6 border border-blue-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Signal className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <label className="text-lg font-semibold text-blue-800 block">
                Diagnóstico de Sinal
              </label>
              <p className="text-sm text-gray-600">
                Informe os valores dos sinais RX e TX
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Signal className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-600">Sinal RX do Cliente (Ida):</span>
              </div>
              <input
                type="text"
                placeholder="Ex: -15.5"
                value={sinalRX}
                onChange={(e) => setSinalRX(e.target.value)}
                className="w-full text-gray-800 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
              />
            </div>

            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Signal className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-600">Sinal TX  do Cliente (Volta):</span>
              </div>
              <input
                type="text"
                placeholder="Ex: 45.2"
                value={sinalTX}
                onChange={(e) => setSinalTX(e.target.value)}
                className="w-full text-gray-800 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
              />
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-blue-200 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <Activity className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-600">Primária com Sinal Alto:</span>
            </div>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="primaria_alta"
                  checked={primariaAlta === true}
                  onChange={() => setPrimariaAlta(true)}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700">Sim</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="primaria_alta"
                  checked={primariaAlta === false}
                  onChange={() => setPrimariaAlta(false)}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700">Não</span>
              </label>
            </div>
          </div>

          {/* Campos de Média que aparecem apenas quando Primária com Sinal Alto = SIM */}
          {primariaAlta && (
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 transition-all duration-300">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-semibold text-blue-700">QUAL A MÉDIA DA PRIMÁRIA?</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-3 border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Signal className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-gray-600">Média Sinal RX:</span>
                  </div>
                  <input
                    type="text"
                    placeholder="Ex: -18.2"
                    value={mediaRX}
                    onChange={(e) => setMediaRX(e.target.value)}
                    className="w-full text-gray-800 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
                  />
                </div>

                <div className="bg-white rounded-lg p-3 border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Signal className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-gray-600">Média Sinal TX:</span>
                  </div>
                  <input
                    type="text"
                    placeholder="Ex: 42.8"
                    value={mediaTX}
                    onChange={(e) => setMediaTX(e.target.value)}
                    className="w-full text-gray-800 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
                  />
                </div>
              </div>
              
              <small className="block mt-3 text-sm text-blue-600">
                Informe as médias dos sinais RX e TX da primária
              </small>
            </div>
          )}
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