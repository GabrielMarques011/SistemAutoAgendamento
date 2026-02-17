import React, { useState, useEffect } from "react";
import { FileText, AlertCircle, Edit3, ArrowLeft, DollarSign, RefreshCw, CreditCard, Users } from "lucide-react";

export default function ScreenRoteador2({ formData, setFormData, nextStep, prevStep }) {
  // DEBUG: Verificar se as props estão chegando
  useEffect(() => {
    console.log("🔍 ScreenRoteador2 - Props recebidas:", {
      hasPrevStep: typeof prevStep === 'function',
      hasNextStep: typeof nextStep === 'function',
      hasFormData: !!formData,
      hasSetFormData: typeof setFormData === 'function'
    });
  }, []);

  const [tipoProblema, setTipoProblema] = useState(formData.tipoProblema || "");
  const [mostrarValores, setMostrarValores] = useState(false);
  const [rompimentoMassivo, setRompimentoMassivo] = useState(formData.rompimentoMassivo || "");
  const [quantosOff, setQuantosOff] = useState(formData.quantosOff || "");

  // Estado para os campos de validação
  const [validacoes, setValidacoes] = useState({
    verificadoInstrucaoCliente: formData.verificadoInstrucaoCliente || "",
    velocidadeMedia: formData.velocidadeMedia || "",
    testadoViaCabo: formData.testadoViaCabo || false,
    testadoViaWifi: formData.testadoViaWifi || false,
    quantosEquipamentos: formData.quantosEquipamentos || ""
  });

  // Estado para valores (quando for mal uso)
  const [valores, setValores] = useState({
    valueType: formData.valueType || "",
    taxValue: formData.taxValue || ""
  });

  // Atualizar formData quando estados mudarem
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      tipoProblema,
      rompimentoMassivo,
      quantosOff,
      ...validacoes,
      ...valores
    }));
  }, [tipoProblema, rompimentoMassivo, quantosOff, validacoes, valores, setFormData]);

  // Mostrar/ocultar seção de valores quando for "mal uso"
  useEffect(() => {
    setMostrarValores(tipoProblema === "mal-uso");
  }, [tipoProblema]);

  // Mostrar/ocultar campo quantosOff quando rompimentoMassivo for "sim"
  useEffect(() => {
    if (rompimentoMassivo !== "sim") {
      setQuantosOff("");
    }
  }, [rompimentoMassivo]);

  // Função para construir o texto das validações
  const buildValidacoesText = (validacoes) => {
    const parts = [];
    
    // Problema selecionado - SEMPRE PRIMEIRO
    if (tipoProblema) {
      let problemaText = "";
      switch(tipoProblema) {
        case "los-piscando":
          problemaText = "LOS piscando";
          break;
        case "pon-piscando":
          problemaText = "PON piscando e não está boiando";
          break;
        case "mal-uso":
          problemaText = "Mal uso do equipamento";
          break;
        default:
          problemaText = tipoProblema;
      }
      parts.push(`${problemaText}`);
    }

    // Informações de valor (apenas para mal uso)
    if (tipoProblema === "mal-uso" && valores.valueType) {
      if (valores.valueType === "renovacao") {
        parts.push("- Valor: Renovação do Contrato Fidelidade");
      } else if (valores.valueType === "taxa" && valores.taxValue) {
        parts.push(`- Valor: Taxa de ${valores.taxValue}`);
      }
    }

    // Rompimento massivo
    if (rompimentoMassivo) {
      parts.push(`- Cliente faz parte de rompimento massivo: ${rompimentoMassivo === "sim" ? "Sim" : "Não"}`);
      if (rompimentoMassivo === "sim" && quantosOff) {
        parts.push(`Quantos OFF na primária: ${quantosOff}`);
      }
    }

    // Testado via cabo e WI-FI
    if (validacoes.testadoViaCabo || validacoes.testadoViaWifi) {
      let viaText = "";
      if (validacoes.testadoViaCabo && validacoes.testadoViaWifi) {
        viaText = "Cabo e WI-FI";
      } else if (validacoes.testadoViaCabo) {
        viaText = "Cabo";
      } else if (validacoes.testadoViaWifi) {
        viaText = "WI-FI";
      }
      parts.push(`Testado via: ${viaText}`);
    }

    // Instruído a acessar a interface
    if (validacoes.verificadoInstrucaoCliente) {
      parts.push(`Cliente instruído a acessar interface: ${validacoes.verificadoInstrucaoCliente}`);
    }
    
    // Velocidade média
    if (validacoes.velocidadeMedia) {
      parts.push(`Velocidade média: ${validacoes.velocidadeMedia}`);
    }
    
    // Quantos equipamentos
    if (validacoes.quantosEquipamentos) {
      parts.push(`Equipamentos testados: ${validacoes.quantosEquipamentos}`);
    }
    
    return parts.length > 0 ? parts.join('\n') : "";
  };

  // Função centralizada para atualizar toda a observação
  const updateObservacaoCompleta = () => {
    const validacoesText = buildValidacoesText(validacoes);
    
    // Atualiza o formData
    setFormData(prev => ({ 
      ...prev, 
      observacao: validacoesText,
      tipoProblema,
      rompimentoMassivo,
      quantosOff,
      ...validacoes,
      ...valores
    }));
  };

  // Atualiza a observação quando os estados mudam
  useEffect(() => {
    updateObservacaoCompleta();
  }, [tipoProblema, rompimentoMassivo, quantosOff, validacoes, valores]);

  const handleObservacaoChange = (e) => {
    const newValue = e.target.value;
    setFormData({ 
      ...formData, 
      observacao: newValue 
    });
  };

  // Funções para manipular os campos de validação
  const handleValidacaoChange = (campo, valor) => {
    setValidacoes(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  // Funções para manipular os valores
  const handleValorChange = (campo, valor) => {
    setValores(prev => ({
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
    console.log("🔄 ScreenRoteador2 - Tentando voltar...");
    if (typeof prevStep === 'function') {
      console.log("✅ ScreenRoteador2 - prevStep é uma função, executando...");
      prevStep();
    } else {
      console.error("❌ ScreenRoteador2 - prevStep não é uma função:", prevStep);
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
      console.error("ScreenRoteador2 - nextStep não é uma função");
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Validações do Equipamento</h2>
            <p className="text-gray-600 text-lg">
              Informe o problema relatado pelo cliente e as validações realizadas
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6 flex-1">
        {/* Seção de Tipo de Problema */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <label className="text-lg font-semibold text-gray-800 block">
                Tipo de Problema <span className="text-red-500">*</span>
              </label>
              <p className="text-sm text-gray-600">
                Selecione o problema relatado pelo cliente
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => setTipoProblema("los-piscando")}
              className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                tipoProblema === "los-piscando" 
                  ? "bg-red-50 border-red-300 shadow-sm" 
                  : "bg-gray-50 border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${
                  tipoProblema === "los-piscando" ? "bg-red-500 animate-pulse" : "bg-gray-400"
                }`}></div>
                <span className={`font-medium ${
                  tipoProblema === "los-piscando" ? "text-red-800" : "text-gray-700"
                }`}>
                  LOS Piscando
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Sinal óptico está piscando
              </p>
            </button>

            <button
              onClick={() => setTipoProblema("pon-piscando")}
              className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                tipoProblema === "pon-piscando" 
                  ? "bg-orange-50 border-orange-300 shadow-sm" 
                  : "bg-gray-50 border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${
                  tipoProblema === "pon-piscando" ? "bg-orange-500 animate-pulse" : "bg-gray-400"
                }`}></div>
                <span className={`font-medium ${
                  tipoProblema === "pon-piscando" ? "text-orange-800" : "text-gray-700"
                }`}>
                  PON Piscando
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                PON piscando e não está boiando
              </p>
            </button>

            <button
              onClick={() => setTipoProblema("mal-uso")}
              className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                tipoProblema === "mal-uso" 
                  ? "bg-blue-50 border-blue-300 shadow-sm" 
                  : "bg-gray-50 border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${
                  tipoProblema === "mal-uso" ? "bg-blue-500" : "bg-gray-400"
                }`}></div>
                <span className={`font-medium ${
                  tipoProblema === "mal-uso" ? "text-blue-800" : "text-gray-700"
                }`}>
                  Mal Uso
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Equipamento com mau uso ou danificado
              </p>
            </button>
          </div>

          {!tipoProblema && (
            <div className="mt-4 flex items-center gap-2 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>Selecione um tipo de problema para continuar.</span>
            </div>
          )}
        </div>


         {/* Seção de Valores (apenas para mal uso) */}
        {mostrarValores && (
          <div className="space-y-6">
            {/* Seleção do Tipo de Valor */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="w-5 h-5 text-blue-700" />
                <label className="text-sm font-semibold text-blue-700">Tipo de Valor:</label>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => handleValorChange('valueType', "renovacao")}
                  className={`flex-1 px-6 py-6 rounded-xl font-semibold transition-all duration-200 border-2 ${
                    valores.valueType === "renovacao"
                      ? 'bg-transparent text-blue-700 from-blue-600 to-blue-700 shadow-lg shadow-blue-500/25 border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <RefreshCw className="w-5 h-5" />
                    <span>Renovação de Contrato</span>
                  </div>
                  <p className="text-sm font-normal mt-2 opacity-90">
                    Sem custo adicional
                  </p>
                </button>
                
                <button
                  onClick={() => handleValorChange('valueType', "taxa")}
                  className={`flex-1 px-6 py-6 rounded-xl font-semibold transition-all duration-200 border-2 ${
                    valores.valueType === "taxa"
                      ? 'bg-transparent text-blue-700 from-blue-600 to-blue-700 shadow-lg shadow-blue-500/25 border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    <span>Taxa de Serviço</span>
                  </div>
                  <p className="text-sm font-normal mt-2 opacity-90">
                    Com valor definido
                  </p>
                </button>
              </div>
            </div>

            {/* Seleção de Valor da Taxa */}
            {valores.valueType === "taxa" && (
              <div className="bg-blue-50 rounded-xl p-6 border border-blue-200 transition-all duration-300">
                <div className="flex items-center gap-2 mb-6">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                  <label className="text-lg font-semibold text-blue-700">Valor da Taxa</label>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { value: "R$150,00", label: "Taxa Padrão" },
                    { value: "R$100,00", label: "Taxa Básica" },
                    { value: "R$75,00", label: "Taxa Reduzida" },
                    { value: "R$50,00", label: "Taxa Mínima" }
                  ].map((item) => (
                    <button
                      key={item.value}
                      onClick={() => handleValorChange('taxValue', item.value)}
                      className={`flex flex-col items-center justify-center gap-3 p-4 rounded-xl font-semibold transition-all duration-200 border-2 ${
                        valores.taxValue === item.value
                          ? "bg-transparent text-blue-700 from-blue-600 to-blue-700 shadow-lg shadow-blue-500/25 border-blue-600"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:border-blue-300 hover:shadow-md"
                      }`}
                    >
                      <DollarSign className="w-6 h-6" />
                      <div>
                        <div className="text-lg">{item.value}</div>
                        <div className={`text-xs mt-1 ${
                          valores.taxValue === item.value ? "text-blue-700" : "text-gray-500"
                        }`}>
                          {item.label}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                <small className="block mt-4 text-sm text-blue-600 text-center">
                  Selecione o valor da taxa a ser cobrada pelo serviço
                </small>
              </div>
            )}

            {/* Mensagem quando nenhum tipo é selecionado */}
            {!valores.valueType && (
              <div className="bg-blue-50 rounded-xl p-6 border border-blue-200 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <p className="text-blue-800 font-medium">Selecione um tipo de valor para continuar</p>
                </div>
                <p className="text-blue-600 text-sm">
                  Escolha entre Renovação de Contrato ou Taxa de Serviço
                </p>
              </div>
            )}
          </div>
        )}

        {/* Seção de Rompimento Massivo */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Users className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <label className="text-lg font-semibold text-gray-800 block">
                Rompimento Massivo
              </label>
              <p className="text-sm text-gray-600">
                Verifique se o cliente faz parte de algum rompimento massivo
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Seleção Sim/Não */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Cliente faz parte de algum rompimento massivo?
              </label>
              <div className="flex gap-4">
                <button
                  onClick={() => setRompimentoMassivo("sim")}
                  className={`flex-1 px-6 py-4 rounded-xl font-semibold transition-all duration-200 border-2 ${
                    rompimentoMassivo === "sim"
                      ? 'bg-white border-blue-600 text-blue-600 shadow-sm'
                      : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <span>Sim</span>
                  </div>
                </button>
                
                <button
                  onClick={() => setRompimentoMassivo("nao")}
                  className={`flex-1 px-6 py-4 rounded-xl font-semibold transition-all duration-200 border-2 ${
                    rompimentoMassivo === "nao"
                      ? 'bg-white border-blue-600 text-blue-600 shadow-sm'
                      : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <span>Não</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Campo Quantos OFF - aparece apenas quando for Sim */}
            {rompimentoMassivo === "sim" && (
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200 transition-all duration-300">
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle className="w-4 h-4 text-blue-600" />
                  <label className="text-sm font-semibold text-blue-700">
                    Quantos estão OFF na primária no mesmo horário que ele?
                  </label>
                </div>
                <input
                  type="text"
                  value={quantosOff}
                  onChange={(e) => setQuantosOff(e.target.value)}
                  placeholder="Ex: 15 clientes"
                  className="w-full bg-white text-gray-800 px-4 py-3 border border-blue-300 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200"
                />
                <small className="block mt-2 text-sm text-gray-500">
                  Informe a quantidade aproximada de clientes afetados no mesmo horário
                </small>
              </div>
            )}
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
            disabled={!isObservacaoValida() || !tipoProblema}
            className={`px-8 py-4 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2 ${
              isObservacaoValida() && tipoProblema
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