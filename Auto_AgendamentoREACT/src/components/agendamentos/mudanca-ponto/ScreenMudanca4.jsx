import React from "react";
import { DollarSign, RefreshCw, FileText, CreditCard } from "lucide-react";

export default function ScreenMudanca4({ formData, setFormData, nextStep, prevStep }) {
  return (
    <div className="h-full flex flex-col">
      {/* Header da Tela */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Informe o Valor do Serviço</h2>
        <p className="text-gray-600 text-lg">Selecione o tipo de valor e informe o montante quando necessário</p>
      </div>

      <div className="space-y-6 flex-1">
        {/* Seleção do Tipo de Valor */}
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="w-5 h-5 text-gray-600" />
            <label className="text-sm font-semibold text-gray-800">Tipo de Valor:</label>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, valueType: "renovacao" })}
              className={`flex-1 px-6 py-6 rounded-xl font-semibold transition-all duration-200 border-2 ${
                formData.valueType === "renovacao"
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg shadow-blue-500/25 border-blue-600 text-blue-600'
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
              type="button"
              onClick={() => setFormData({ ...formData, valueType: "taxa" })}
              className={`flex-1 px-6 py-6 rounded-xl font-semibold transition-all duration-200 border-2 ${
                formData.valueType === "taxa"
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg shadow-blue-500/25 border-blue-600 text-blue-600'
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
        {formData.valueType === "taxa" && (
          <div className="bg-blue-50 rounded-xl p-6 border border-blue-200 transition-all duration-300">
            <div className="flex items-center gap-2 mb-6">
              <DollarSign className="w-5 h-5 text-blue-600" />
              <label className="text-lg font-semibold text-blue-800">Valor da Taxa</label>
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
                  type="button"
                  onClick={() => setFormData({ ...formData, taxValue: item.value })}
                  className={`flex flex-col items-center justify-center gap-3 p-4 rounded-xl font-semibold transition-all duration-200 border-2 ${
                    formData.taxValue === item.value
                      ? "bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg shadow-blue-500/25 border-blue-600 text-blue-600"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:border-blue-300 hover:shadow-md"
                  }`}
                >
                  <DollarSign className={`w-6 h-6 text-gray-700${
                    formData.taxValue === item.value ? "text-blue-600" : "text-blue-600"
                  }`} />
                  <div>
                    <div className="text-lg">{item.value}</div>
                    <div className={`text-xs mt-1 ${
                      formData.taxValue === item.value ? "text-blue-600" : "text-gray-00"
                    }`}>
                      {item.label}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* <div className="mt-6 p-4 bg-white rounded-lg border border-blue-100">
              <div className="flex items-center gap-2 text-sm text-blue-700">
                <FileText className="w-4 h-4" />
                <span>Valor selecionado: <strong>{formData.taxValue || "Nenhum"}</strong></span>
              </div>
            </div> */}

            <small className="block mt-4 text-sm text-blue-600 text-center">
              Selecione o valor da taxa a ser cobrada pelo serviço
            </small>
          </div>
        )}

        {/* Mensagem quando nenhum tipo é selecionado */}
        {!formData.valueType && (
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

        {/* Resumo da Seleção */}
        {(formData.valueType || formData.taxValue) && (
          <div className="bg-green-50 rounded-xl p-4 border border-green-200">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <div>
                <p className="text-green-800 font-medium">
                  {formData.valueType === "renovacao" 
                    ? "Renovação de Contrato selecionada" 
                    : `Taxa de ${formData.taxValue || "R$0,00"} selecionada`
                  }
                </p>
                <p className="text-green-600 text-sm mt-1">
                  {formData.valueType === "renovacao" 
                    ? "Serviço será realizado sem custos adicionais" 
                    : "Valor será cobrado conforme selecionado"
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
            onClick={nextStep}
            disabled={!formData.valueType}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none flex items-center gap-2"
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