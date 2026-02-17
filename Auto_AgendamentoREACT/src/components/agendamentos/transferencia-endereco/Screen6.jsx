// src/components/Screen6.jsx
import React, { useState } from "react";
import { CheckCircle2, User, MapPin, Calendar, DollarSign, AlertCircle, Copy, Check, ArrowLeft, Phone, FileText, Home, Building } from "lucide-react";

export default function Screen6({ formData, prevStep, onReset }) {
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
    if (!formData.isCondominio) {
      return formData.complemento || "Nenhum";
    }
    
    const condominioName = formData.condominioName || formData.condominio || "Condomínio";
    const bloco = formData.bloco || "";
    const apartamento = formData.apartment || formData.apartamento || "";
    
    const parts = [condominioName];
    
    if (bloco) {
      parts.push(`Bloco ${bloco}`);
    }
    
    if (apartamento) {
      parts.push(`Apartamento ${apartamento}`);
    }
    
    return parts.join(" / ");
  };

  const handleFinalize = async () => {
    setLoading(true);

    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = storedUser.id_tecnico || "147";
    const isCondo = !!formData.isCondominio;

    try {
      const transferPayload = {
        id_responsavel_tecnico: userId,
        clientId: formData.clientId,
        contractId: formData.contractId,
        cep: formData.cep,
        isCondominio: isCondo,
        id_condominio: isCondo ? (formData.condominio || formData.condominioId || formData.id_condominio || "") : "",
        condominio: isCondo ? (formData.condominioName || formData.condominio || "") : "",
        bloco: isCondo ? (formData.bloco || "") : "",
        apartamento: isCondo ? (formData.apartment || formData.apartamento || "") : "",
        address: formData.address || "",
        neighborhood: formData.neighborhood || "",
        number: formData.number || "",
        oldAddress: formData.oldAddress || "",
        oldNeighborhood: formData.oldNeighborhood || "",
        oldNumber: formData.oldNumber || "",
        oldComplemento: formData.oldComplemento || "",
        hasPorta: !!formData.hasPorta,
        portaNumber: formData.portaNumber || "",
        valueType: formData.valueType || "renovacao",
        taxValue: formData.taxValue || "",
        scheduledDate: formatScheduledDate(),
        period: formData.period || "",
        nome_cliente: formData.nome_cliente || "",
        telefone: formData.telefone_celular || "",
        cidade: formData.cityId || formData.cidade || formData.city || "",
        state: formData.state || "",
        lat: formData.lat ?? formData.latitude ?? "",
        lng: formData.lng ?? formData.longitude ?? "",
        city_ibge: formData.city_ibge || "",
        complemento: formData.complemento || "",
        melhor_horario_reserva: formData.melhor_horario_reserva || periodToReserveLetter[formData.period] || "Q",
      };

      console.log("Enviando /api/transfer payload:", transferPayload);

      const resTransfer = await fetch("http://10.0.30.251:5000/api/transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transferPayload)
      });

      const jsonTransfer = await resTransfer.json().catch(() => ({ error: "Resposta inválida do servidor" }));

      if (!resTransfer.ok) {
        const errMsg = jsonTransfer.error || JSON.stringify(jsonTransfer);
        throw new Error(`Falha na transferência: ${errMsg}`);
      }

      console.log("Transferência criada:", jsonTransfer);

      const cepSanitized = (formData.cep || "").replace(/\D/g, "");
      const validCep = cepSanitized && cepSanitized.length === 8 && !/^0+$/.test(cepSanitized);

      const updatePayload = {
        contractId: formData.contractId,
        id_contrato: formData.contractId,
        clientId: formData.clientId,
        endereco: formData.address || "",
        address: formData.address || "",
        numero: formData.number || "",
        number: formData.number || "",
        bairro: formData.neighborhood || "",
        neighborhood: formData.neighborhood || "",
        complemento: formData.complemento || "",
        cidade: formData.cityId || formData.cidade || formData.city || "",
        city: formData.cityId || formData.city || formData.cidade || "",
        estado: formData.state || formData.estado || "SP",
        state: formData.state || "",
        lat: formData.lat ?? formData.latitude ?? "",
        lng: formData.lng ?? formData.longitude ?? "",
        latitude: formData.lat ?? formData.latitude ?? "",
        longitude: formData.lng ?? formData.longitude ?? "",
        city_ibge: formData.city_ibge || "",
        motivo_cancelamento: " ",
        isCondominio: isCondo,
        id_condominio: isCondo ? (formData.condominio || formData.condominioId || formData.id_condominio || "") : "",
        condominio: isCondo ? (formData.condominioName || formData.condominio || "") : "",
        bloco: isCondo ? (formData.bloco || "") : "",
        apartamento: isCondo ? (formData.apartment || formData.apartamento || "") : "",
        melhor_horario_reserva: transferPayload.melhor_horario_reserva,
      };

      if (validCep) {
        updatePayload.cep = cepSanitized;
      }

      console.log("Enviando /api/update_contrato payload:", updatePayload);

      const resUpdate = await fetch("http://10.0.30.251:5000/api/update_contrato", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatePayload)
      });

      const jsonUpdate = await resUpdate.json().catch(() => ({ error: "Resposta inválida do servidor no update_contrato" }));

      if (!resUpdate.ok) {
        throw new Error(jsonUpdate.error || JSON.stringify(jsonUpdate));
      }

      console.log("Contrato atualizado:", jsonUpdate);

      setSuccessData({
        protocolo: jsonTransfer.protocolo_os || jsonTransfer.id_ticket,
        endereco: `${formData.address}, ${formData.number} - ${formData.neighborhood}`,
        complemento: formatComplemento(formData),
        dataPeriodo: `${formatDateForDisplay(formData.scheduledDate)} - ${formatPeriodForDisplay(formData.period)}`
      });

    } catch (err) {
      console.error("Erro ao finalizar agendamento:", err);
      alert("Erro ao finalizar: " + (err.message || String(err)));
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    const text = `Poderia por gentileza confirmar se está tudo correto?

*Protocolo Nº:* ${successData.protocolo}
*Endereço:* ${successData.endereco}
*Complemento:* ${successData.complemento}
*Data/Período:* ${successData.dataPeriodo}`;

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
    // Verifica se existe a prop onReset (para voltar ao início do formulário)
    if (onReset) {
      onReset();
    } else {
      // Fallback: recarrega a página (comportamento antigo)
      window.location.reload();
    }
  };

  // Tela de sucesso
  if (successData) {
    return (
      <div className="h-full flex flex-col">
        {/* Header da Tela */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Agendamento Concluído!</h2>
          <p className="text-gray-600 text-lg">Seu agendamento foi realizado com sucesso</p>
        </div>

        <div className="space-y-6 flex-1">
          {/* Card de Confirmação */}
          <div className="bg-green-50 rounded-xl p-6 border border-green-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle2 className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-green-800">Agendamento Confirmado</h3>
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
                  <span className="text-sm font-semibold text-green-700">Endereço</span>
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
*Endereço:* ${successData.endereco}
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
              Novo Agendamento
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
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Revisão do Agendamento</h2>
        <p className="text-gray-600 text-lg">Revise os dados antes de finalizar a transferência</p>
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

        {/* Novo Endereço */}
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <MapPin className="w-6 h-6 text-green-600" />
            </div>
            <label className="text-sm font-semibold text-gray-800">Novo Endereço</label>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-gray-600">CEP:</span>
              </div>
              <p className="text-gray-800 font-medium">{formData.cep || "—"}</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-gray-600">Endereço:</span>
              </div>
              <p className="text-gray-800 font-medium">{formData.address || "—"}</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <Home className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-gray-600">Número:</span>
              </div>
              <p className="text-gray-800 font-medium">{formData.number || "—"}</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-gray-600">Bairro:</span>
              </div>
              <p className="text-gray-800 font-medium">{formData.neighborhood || "—"}</p>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-gray-600">Latitude:</span>
              </div>
              <p className="text-gray-800 font-medium">{formData.lat || formData.latitude || "—"}</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-gray-600">Longitude:</span>
              </div>
              <p className="text-gray-800 font-medium">{formData.lng || formData.longitude || "—"}</p>
            </div>

            {formData.complemento && (
              <div className="md:col-span-2 bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <Home className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-gray-600">Complemento:</span>
                </div>
                <p className="text-gray-800 font-medium">{formData.complemento}</p>
              </div>
            )}

            {formData.isCondominio && (
              <div className="md:col-span-2 bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="flex items-center gap-2 mb-3">
                  <Building className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-semibold text-blue-700">Condomínio</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="bg-white rounded-lg p-3 border border-blue-100">
                    <span className="text-sm font-medium text-gray-600 block mb-1">Nome:</span>
                    <p className="text-gray-800 font-medium">{formData.condominioName || formData.condominio || "—"}</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-blue-100">
                    <span className="text-sm font-medium text-gray-600 block mb-1">Bloco:</span>
                    <p className="text-gray-800 font-medium">{formData.bloco || "—"}</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-blue-100">
                    <span className="text-sm font-medium text-gray-600 block mb-1">Apartamento:</span>
                    <p className="text-gray-800 font-medium">{formData.apartment || formData.apartamento || "—"}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Endereço Antigo */}
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MapPin className="w-6 h-6 text-blue-600" />
            </div>
            <label className="text-sm font-semibold text-gray-800">Endereço Antigo</label>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-600">CEP:</span>
              </div>
              <p className="text-gray-800 font-medium">{formData.oldCep || "—"}</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-600">Endereço:</span>
              </div>
              <p className="text-gray-800 font-medium">{formData.oldAddress || "—"}</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <Home className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-600">Número:</span>
              </div>
              <p className="text-gray-800 font-medium">{formData.oldNumber || "—"}</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-600">Bairro:</span>
              </div>
              <p className="text-gray-800 font-medium">{formData.oldNeighborhood || "—"}</p>
            </div>
            {formData.hasPorta && (
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <Home className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-600">Porta:</span>
                </div>
                <p className="text-gray-800 font-medium">{formData.portaNumber || "—"}</p>
              </div>
            )}
          </div>
        </div>

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

        {/* Valor */}
        {formData.valueType && (
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
              <label className="text-sm font-semibold text-gray-800">Valor</label>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-600">Tipo:</span>
                </div>
                <p className="text-gray-800 font-medium">
                  {formData.valueType === "renovacao" ? "Renovação de Contrato" : "Taxa"}
                </p>
              </div>
              {formData.valueType === "taxa" && formData.taxValue && (
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-gray-600">Valor da Taxa:</span>
                  </div>
                  <p className="text-gray-800 font-medium">{formData.taxValue}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Alerta de atenção */}
        <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg mt-0.5 flex-shrink-0">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-yellow-800 mb-1">Atenção</p>
              <p className="text-sm text-yellow-700">
                Ao finalizar, será criado um ticket, ordens de serviço e o contrato será atualizado. 
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