import React from "react";
import { CalendarDays, Clock, CheckCircle, AlertCircle } from "lucide-react";

export default function ScreenMudanca4({ formData, setFormData, nextStep, prevStep }) {
  const today = new Date();
  const maxDate = new Date();
  maxDate.setFullYear(today.getFullYear() + 2);

  const formatDate = (d) => d.toISOString().split("T")[0];

  const periodMapToReserve = {
    comercial: "Q", // Comercial -> Qualquer
    manha: "M",
    tarde: "T",
    noite: "N", // caso adicione opção Noite futuramente
  };

  const periodDetails = {
    comercial: { label: "Comercial", hours: "8h às 17h", description: "Período comercial completo" },
    manha: { label: "Manhã", hours: "8h às 12h", description: "Período matutino" },
    tarde: { label: "Tarde", hours: "13h às 17h", description: "Período vespertino" }
  };

  const handleValidateDate = () => {
    if (!formData.scheduledDate) return;
    const selectedDate = new Date(formData.scheduledDate);
    if (isNaN(selectedDate.getTime())) {
      alert("Data inválida. Use o formato correto.");
      setFormData({ ...formData, scheduledDate: "" });
      return;
    }
    if (selectedDate < today || selectedDate > maxDate) {
      alert("Data fora do intervalo permitido.");
      setFormData({ ...formData, scheduledDate: "" });
    }
  };

  const handleSelectPeriod = (period) => {
    setFormData({
      ...formData,
      period,
      melhor_horario_reserva: periodMapToReserve[period] || "Q",
    });
  };

  const handleNext = () => {
    if (!formData.scheduledDate || !formData.period) {
      alert("Selecione uma data válida e o período antes de prosseguir.");
      return;
    }

    const selectedDate = new Date(formData.scheduledDate);
    if (
      isNaN(selectedDate.getTime()) ||
      selectedDate < today ||
      selectedDate > maxDate
    ) {
      alert("A data selecionada é inválida ou fora do intervalo permitido.");
      return;
    }

    nextStep();
  };

  const formatDisplayDate = (dateString) => {
    return new Date(dateString + "T00:00:00").toLocaleDateString("pt-BR", {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header da Tela */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Agendamento do Serviço</h2>
        <p className="text-gray-600 text-lg">Selecione a data e o período para agendamento do serviço técnico</p>
      </div>

      <div className="space-y-6 flex-1">
        {/* Data do Agendamento */}
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <CalendarDays className="w-5 h-5 text-gray-600" />
            <label className="text-sm font-semibold text-gray-800">Data do Agendamento</label>
          </div>
          
          <div className="relative">
            <CalendarDays className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5 pointer-events-none" />
            <input
              type="date"
              min={formatDate(today)}
              max={formatDate(maxDate)}
              value={formData.scheduledDate || ""}
              onChange={(e) =>
                setFormData({ ...formData, scheduledDate: e.target.value })
              }
              onBlur={handleValidateDate}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-700 bg-white font-medium"
            />
          </div>
          
          <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
            <div className="flex items-center gap-2 text-sm text-blue-700">
              <AlertCircle className="w-4 h-4" />
              <span>Período disponível: até {maxDate.toLocaleDateString("pt-BR")}</span>
            </div>
          </div>
        </div>

        {/* Período */}
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-gray-600" />
            <label className="text-sm font-semibold text-gray-800">Período de Atendimento</label>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {Object.entries(periodDetails).map(([period, details]) => (
              <button
                key={period}
                type="button"
                onClick={() => handleSelectPeriod(period)}
                className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                  formData.period === period
                    ? "bg-gradient-to-r text-blue-600 shadow-lg shadow-blue-500/25 border-blue-600 transform -translate-y-0.5"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400 hover:shadow-md"
                }`}
                aria-pressed={formData.period === period}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className={`font-semibold text-lg ${
                      formData.period === period ? "text-blue-700" : "text-gray-800"
                    }`}>
                      {details.label}
                    </div>
                    <div className={`text-sm font-medium ${
                      formData.period === period ? "text-blue-700" : "text-blue-600"
                    }`}>
                      {details.hours}
                    </div>
                  </div>
                  {formData.period === period && (
                    <CheckCircle className="w-5 h-5 text-blue-700 flex-shrink-0" />
                  )}
                </div>
                <div className={`text-sm ${
                  formData.period === period ? "text-blue-700" : "text-gray-500"
                }`}>
                  {details.description}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Confirmação do Agendamento */}
        {formData.scheduledDate && formData.period && (
          <div className="bg-green-50 rounded-xl p-6 border border-green-200">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <h3 className="text-lg font-semibold text-green-800">Agendamento Confirmado</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4 border border-green-100">
                <div className="flex items-center gap-2 mb-2">
                  <CalendarDays className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-semibold text-green-700">Data Selecionada</span>
                </div>
                <p className="text-gray-800 font-medium">
                  {formatDisplayDate(formData.scheduledDate)}
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-green-100">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-semibold text-green-700">Período Selecionado</span>
                </div>
                <p className="text-gray-800 font-medium">
                  {periodDetails[formData.period].label} • {periodDetails[formData.period].hours}
                </p>
                {formData.melhor_horario_reserva && (
                  <p className="text-xs text-gray-500 mt-1">
                    Código reserva: {formData.melhor_horario_reserva}
                  </p>
                )}
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-green-100 rounded-lg border border-green-200">
              <p className="text-sm text-green-800 text-center">
                ✅ Agendamento confirmado com sucesso! Proceda para o próximo passo.
              </p>
            </div>
          </div>
        )}

        {/* Aviso de Seleção Necessária */}
        {(!formData.scheduledDate || !formData.period) && (
          <div className="bg-blue-50 rounded-xl p-6 border border-blue-200 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <p className="text-blue-800 font-medium">Selecione data e período para continuar</p>
            </div>
            <p className="text-blue-600 text-sm">
              Escolha uma data disponível e o período de atendimento desejado
            </p>
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
            disabled={!formData.scheduledDate || !formData.period}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none flex items-center gap-2"
          >
            <span>Confirmar Agendamento</span>
            <CheckCircle className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}