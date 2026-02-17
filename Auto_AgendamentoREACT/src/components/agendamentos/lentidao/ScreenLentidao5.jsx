import React, { useState } from "react";
import { CheckCircle2, User, MapPin, Calendar, DollarSign, AlertCircle, Copy, Check, ArrowLeft, Phone, FileText, Home, Building, MessageSquare } from "lucide-react";

export default function ScreenLentidao5({ formData, prevStep, onReset }) {
  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [copied, setCopied] = useState(false);

  const periodToHour = {
    comercial: "10:00:00",
    manha: "08:00:00",
    tarde: "13:00:00",
  };

  const periodToReserveLetter = {
    comercial: "Q",
    manha: "M",
    tarde: "T",
    noite: "N",
  };

  const formatScheduledDate = () => {
    if (!formData.scheduledDate) return "";
    const hour = periodToHour[formData.period] || "10:00:00";
    return `${formData.scheduledDate} ${hour}`;
  };

  const formatDateForDisplay = (dateString) => {
    if (!dateString) return "";
    try {
      return new Date(dateString + 'T00:00:00').toLocaleDateString('pt-BR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const formatPeriodForDisplay = (period) => {
    if (!period) return "";
    const periodMap = {
      comercial: "Comercial (8h às 17h)",
      manha: "Manhã (8h às 12h)",
      tarde: "Tarde (13h às 17h)",
      noite: "Noite"
    };
    return periodMap[period] || period.charAt(0).toUpperCase() + period.slice(1);
  };

  const formatComplemento = (formData) => {
    return formData.complemento_atual || "Nenhum";
  };

  const truncateObservacao = (observacao) => {
    if (!observacao) return "";
    if (observacao.length <= 100) return observacao;
    return observacao.substring(0, 100) + "...";
  };

  const handleFinalize = async () => {
    setLoading(true);

    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = storedUser.id_tecnico || "147";

    try {
      // 1. Primeiro, atualizar o contrato com o endereço atual (incluindo complemento)
      const updatePayload = {
        contractId: formData.contractId,
        id_contrato: formData.contractId,
        clientId: formData.clientId,
        
        // Campos de endereço que serão atualizados no contrato
        endereco: formData.endereco_atual,
        numero: formData.numero_atual,
        bairro: formData.bairro_atual,
        cep: formData.cep_atual,
        cidade: formData.cidade_atual,
        complemento: formData.complemento_atual,
        
        // Campos adicionais que sua rota espera
        motivo_cancelamento: " ",
        melhor_horario_reserva: periodToReserveLetter[formData.period] || "Q",
      };

      console.log("Enviando /api/update_contrato payload:", updatePayload);

      const resUpdate = await fetch("http://10.0.30.251:5000/api/update_contrato", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatePayload)
      });

      const jsonUpdate = await resUpdate.json().catch(() => ({ error: "Resposta inválida do servidor no update_contrato" }));

      if (!resUpdate.ok) {
        console.warn("Aviso: Falha ao atualizar contrato, mas continuando com abertura de quedas:", jsonUpdate);
        // Não vamos lançar erro aqui para não bloquear o fluxo principal
      } else {
        console.log("Contrato atualizado com sucesso:", jsonUpdate);
      }

      // 2. Segundo, criar a abertura de quedas de conexão
      const quedasPayload = {
        id_responsavel_tecnico: userId,
        clientId: formData.clientId,
        contractId: formData.contractId,
        // Dados do endereço atual
        cep_atual: formData.cep_atual || "",
        endereco_atual: formData.endereco_atual || "",
        bairro_atual: formData.bairro_atual || "",
        numero_atual: formData.numero_atual || "",
        complemento_atual: formData.complemento_atual || "",
        cidade_atual: formData.cidade_atual || "",
        // Dados da queda
        tipo_mudanca: formData.tipo_mudanca || "",
        ponto_atual: formData.ponto_atual || "",
        ponto_novo: formData.ponto_novo || "",
        observacoes: formData.observacao || "",
        // Dados do agendamento
        scheduledDate: formatScheduledDate(),
        period: formData.period || "",
        nome_cliente: formData.nome_cliente || "",
        telefone: formData.telefone_celular || "",
        melhor_horario_reserva: periodToReserveLetter[formData.period] || "Q",
      };

      console.log("Enviando /api/quedas payload:", quedasPayload);

      const resQuedas = await fetch("http://10.0.30.251:5000/api/lentidao", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(quedasPayload)
      });

      const jsonQuedas = await resQuedas.json().catch(() => ({ error: "Resposta inválida do servidor" }));

      if (!resQuedas.ok) {
        const errMsg = jsonQuedas.error || JSON.stringify(jsonQuedas);
        throw new Error(`Falha na abertura de quedas: ${errMsg}`);
      }

      console.log("Quedas de conexão criada:", jsonQuedas);

      setSuccessData({
        protocolo: jsonQuedas.protocolo_os || jsonQuedas.id_ticket,
        endereco: `${formData.endereco_atual}, ${formData.numero_atual} - ${formData.bairro_atual}`,
        complemento: formatComplemento(formData),
        dataPeriodo: `${formatDateForDisplay(formData.scheduledDate)} - ${formatPeriodForDisplay(formData.period)}`,
        observacao: formData.observacao || "Nenhuma observação informada"
      });

    } catch (err) {
      console.error("Erro ao finalizar abertura de quedas:", err);
      alert("Erro ao finalizar: " + (err.message || String(err)));
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    const text = `Poderia por gentileza confirmar se está tudo correto?

*Protocolo Nº:* ${successData.protocolo}
*Endereço Atual:* ${successData.endereco}
*Complemento:* ${successData.complemento}
*Data/Período:* ${successData.dataPeriodo}
*Observações:* ${successData.observacao}`; // AQUI: Incluindo observação no texto copiável

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error('Falha ao copiar texto: ', err);
      alert('Falha ao copiar texto. Por favor, copie manualmente.');
    }
  };

  const handleNewScheduling = () => {
    if (onReset) {
      onReset();
    } else {
      window.location.reload();
    }
  };

  // Tela de sucesso
  if (successData) {
    return (
      <div className="h-full flex flex-col">
        {/* Header da Tela */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Lentidão Concluída!</h2>
          <p className="text-gray-600 text-lg">Sua lentidão foi agendada com sucesso</p>
        </div>

        <div className="space-y-6 flex-1">
          {/* Card de Confirmação */}
          <div className="bg-green-50 rounded-xl p-6 border border-green-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle2 className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-green-800">Lentidão Confirmada</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-white rounded-xl p-4 border border-green-100">
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-semibold text-blue-700">Protocolo</span>
                </div>
                <p className="text-gray-800 font-bold text-lg">
                  {successData.protocolo}
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-4 border border-green-100">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-semibold text-green-700">Endereço Atual</span>
                </div>
                <p className="text-gray-800 font-medium">
                  {successData.endereco}
                </p>
              </div>

              <div className="bg-white rounded-xl p-4 border border-green-100">
                <div className="flex items-center gap-2 mb-3">
                  <Home className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-semibold text-blue-700">Complemento</span>
                </div>
                <p className="text-gray-800 font-medium">
                  {successData.complemento}
                </p>
              </div>

              <div className="bg-white rounded-xl p-4 border border-green-100">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-semibold text-green-700">Data/Período</span>
                </div>
                <p className="text-gray-800 font-medium">
                  {successData.dataPeriodo}
                </p>
              </div>

              {/* NOVA SEÇÃO: Observações */}
              <div className="bg-white rounded-xl p-4 border border-green-100 md:col-span-2">
                <div className="flex items-center gap-2 mb-3">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-semibold text-blue-700">Observações</span>
                </div>
                <p className="text-gray-800 font-medium">
                  {successData.observacao}
                </p>
              </div>
            </div>

            {/* Área de Cópia */}
            <div className="bg-white rounded-xl p-6 border border-green-200">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <Copy className="w-5 h-5 text-blue-600" />
                  <h4 className="text-lg font-semibold text-gray-800">Resumo para Enviar ao Cliente</h4>
                </div>
                <button
                  onClick={copyToClipboard}
                  className={`px-6 py-3 font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2 ${
                    copied 
                      ? "bg-green-600 text-white" 
                      : "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800"
                  }`}
                >
                  {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  {copied ? "Copiado!" : "Copiar Resumo"}
                </button>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <pre className="whitespace-pre-wrap text-sm text-gray-800 font-medium">
{`Poderia por gentileza confirmar se está tudo correto?

*Protocolo Nº:* ${successData.protocolo}
*Endereço Atual:* ${successData.endereco}
*Complemento:* ${successData.complemento}
*Data/Período:* ${successData.dataPeriodo}`}
                </pre>
              </div>

              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-center gap-2 text-sm text-blue-800">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span>📋 Clique em "Copiar Resumo" e cole no WhatsApp para enviar ao cliente</span>
                </div>
              </div>
            </div>
          </div>

          {/* Botão Novo Agendamento */}
          <div className="flex justify-center pt-6">
            <button
              onClick={handleNewScheduling}
              className="px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5" />
              Nova Abertura de Lentidão
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Tela de revisão original
  return (
    <div className="h-full flex flex-col">
      {/* Header da Tela */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Revisão da Lentidão</h2>
        <p className="text-gray-600 text-lg">Revise os dados antes de finalizar a lentidão</p>
      </div>

      <div className="space-y-6 flex-1">
        {/* Dados do Cliente */}
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <label className="text-sm font-semibold text-gray-800">Dados do Cliente</label>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <User className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-600">Nome:</span>
              </div>
              <p className="text-gray-800 font-medium">{formData.nome_cliente || "—"}</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-600">ID do Cliente:</span>
              </div>
              <p className="text-gray-800 font-medium">{formData.clientId || "—"}</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <Phone className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-600">Telefone:</span>
              </div>
              <p className="text-gray-800 font-medium">{formData.telefone_celular || "—"}</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-600">ID do Contrato:</span>
              </div>
              <p className="text-gray-800 font-medium">{formData.contractId || "—"}</p>
            </div>
          </div>
        </div>

        {/* Endereço Atual */}
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MapPin className="w-6 h-6 text-blue-600" />
            </div>
            <label className="text-sm font-semibold text-gray-800">Endereço Atual</label>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-600">CEP:</span>
              </div>
              <p className="text-gray-800 font-medium">{formData.cep_atual || "—"}</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-600">Endereço:</span>
              </div>
              <p className="text-gray-800 font-medium">{formData.endereco_atual || "—"}</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <Home className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-600">Número:</span>
              </div>
              <p className="text-gray-800 font-medium">{formData.numero_atual || "—"}</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-600">Bairro:</span>
              </div>
              <p className="text-gray-800 font-medium">{formData.bairro_atual || "—"}</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <Home className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-600">Complemento:</span>
              </div>
              <p className="text-gray-800 font-medium">{formData.complemento_atual || "—"}</p>
            </div>
          </div>
        </div>

        {/* NOVA SEÇÃO: Observações */}
        {formData.observacao && (
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MessageSquare className="w-6 h-6 text-blue-600" />
              </div>
              <label className="text-sm font-semibold text-gray-800">Observações</label>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-5">
                <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                <span className="text-sm font-medium text-gray-600">Descrição:</span>
              </div>
              <p className="text-gray-800 font-medium whitespace-pre-wrap">
                {formData.observacao}
              </p>
              <div className="mt-2 text-xs text-gray-500 text-right">
                {formData.observacao.length} caracteres
              </div>
            </div>
          </div>
        )}

        {/* Agendamento */}
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
            <label className="text-sm font-semibold text-gray-800">Agendamento</label>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-gray-600">Data:</span>
              </div>
              <p className="text-gray-800 font-medium">
                {formatDateForDisplay(formData.scheduledDate) || "—"}
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-gray-600">Período:</span>
              </div>
              <p className="text-gray-800 font-medium">
                {formatPeriodForDisplay(formData.period) || "—"}
              </p>
            </div>
          </div>
        </div>

        {/* Alerta de atenção */}
        <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg mt-0.5 flex-shrink-0">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-yellow-800 mb-1">Atenção</p>
              <p className="text-sm text-yellow-700">
                Ao finalizar, será criado um ticket de lentidão. 
                Certifique-se de que todos os dados estão corretos antes de prosseguir.
              </p>
            </div>
          </div>
        </div>

        {/* Botões de Navegação */}
        <div className="flex justify-between pt-6">
          <button
            onClick={prevStep}
            disabled={loading}
            className="px-8 py-4 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2 border border-gray-300"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar
          </button>
          <button
            onClick={handleFinalize}
            disabled={loading}
            className="px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-xl hover:from-green-700 hover:to-green-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Enviando...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5" />
                Finalizar Agendamento
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}