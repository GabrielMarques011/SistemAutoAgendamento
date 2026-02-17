// src/components/Screen1.jsx
import React, { useState } from 'react';
import { User, Phone, FileText, CreditCard, Loader, Search, X } from 'lucide-react';

export default function ScreenAlarmada1({ formData, setFormData, nextStep }) {
  const [loading, setLoading] = useState(false);
  const [contracts, setContracts] = useState([]);
  const [clientFound, setClientFound] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [contractWarning, setContractWarning] = useState(null);

  // Função para validar se é CPF ou CNPJ
  const validateDocument = (doc = '') => {
    const digits = doc.replace(/\D/g, '');
    if (digits.length === 11) return 'CPF válido';
    if (digits.length === 14) return 'CNPJ válido';
    return false;
  };

  const onlyDigits = (s = '') => s.replace(/\D/g, '');

  const resetAll = () => {
    setContracts([]);
    setClientFound(false);
    setErrorMsg(null);
    setContractWarning(null);
    setFormData(prev => ({
      ...prev,
      cpf_cnpj: '',
      clientId: '',
      nome_cliente: '',
      telefone_celular: '',
      contractId: ''
    }));
  };

  const handleBuscarCliente = async () => {
    setErrorMsg(null);

    const digits = onlyDigits(formData.cpf_cnpj);
    const documentValidation = validateDocument(formData.cpf_cnpj);

    if (!documentValidation) {
      alert('Digite um CPF (11 dígitos) ou CNPJ (14 dígitos) válido.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        qtype: 'cnpj_cpf',
        query: digits,
        oper: '=',
        page: '1',
        rp: '1'
      };

      const resp = await fetch(`http://10.0.30.251:5000/api/cliente`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await resp.json();

      if (!resp.ok) {
        const msg = data.error || 'Cliente não encontrado';
        setErrorMsg(typeof data === 'object' ? JSON.stringify(data) : msg);
        throw new Error(msg);
      }

      const clienteRegistro = data;
      const foundId = clienteRegistro.id || clienteRegistro.ID || clienteRegistro.id_cliente || '';

      setFormData(prev => ({
        ...prev,
        clientId: foundId,
        nome_cliente: clienteRegistro.razao || clienteRegistro.nome || clienteRegistro.nome_cliente || prev.nome_cliente || '',
        telefone_celular: clienteRegistro.fone || clienteRegistro.telefone_celular || prev.telefone_celular || ''
      }));

      setClientFound(true);
      await buscarContratos(foundId);
    } catch (err) {
      console.error('Erro buscar cliente:', err);
      if (!errorMsg) setErrorMsg(err.message || String(err));
      setClientFound(false);
      setContracts([]);
      setContractWarning(null);
    } finally {
      setLoading(false);
    }
  };

  // função utilitária que verifica o campo status_internet e seta o aviso se necessário
  function checkContractInternetStatus(rawRecord) {
    if (!rawRecord) {
      setContractWarning(null);
      return;
    }

    // tenta várias chaves possíveis que o IXC pode retornar
    const statusRaw = (
      rawRecord.status_internet ||
      rawRecord.statusInternet ||
      rawRecord.status_internet_contrato ||
      rawRecord.status_contrato ||
      rawRecord.status ||
      rawRecord.st ||
      ""
    ).toString().trim().toUpperCase();

    const statusMap = {
      CM: 'Bloqueio Manual',
      CA: 'Bloqueio Automático',
      FA: 'Financeiro em Atraso',
      AA: 'Aguardando Assinatura',
      A: 'Ativo'
    };

    if (!statusRaw) {
      setContractWarning(null);
      return;
    }

    // Se for exatamente 'A' (ativo) não mostramos aviso
    if (statusRaw === 'A' || statusRaw === 'ATIVO') {
      setContractWarning(null); // tudo ok
      return;
    }

    // monta mensagem amigável
    const human = statusMap[statusRaw] || statusRaw;
    setContractWarning(`Atenção: esse contrato tem status de internet "${human}" (${statusRaw}).`);
  }

  const buscarContratos = async (clientId) => {
    setErrorMsg(null);
    setContractWarning(null);
    if (!clientId) return;
    setLoading(true);
    try {
      const payload = {
        qtype: 'id_cliente',
        query: String(clientId),
        oper: '=',
        page: '1',
        rp: '50'
      };

      const resp = await fetch(`http://10.0.30.251:5000/api/cliente_contrato`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await resp.json();
      if (!resp.ok) {
        const msg = data.error || 'Erro ao buscar contratos';
        setErrorMsg(typeof data === 'object' ? JSON.stringify(data) : msg);
        throw new Error(msg);
      }

      const registros = data.registros || [];

      // utilitário para extrair o status do contrato (tenta várias chaves)
      const extractStatusCode = (r) => {
        const s = r.status || r.situacao || r.st || r.status_contrato || r.statusContrato || r.status_contrato_internet || "";
        return String(s || "").trim().toUpperCase().charAt(0) || "";
      };

      const statusLabel = (code) => {
        const map = { P: "Pré-contrato", A: "Ativo", I: "Inativo", N: "Negativado", D: "Desistiu" };
        return map[code] || (code || "");
      };

      // Normaliza mantendo o registro cru para checar status_internet e status do contrato
      const normalized = registros.map(r => {
        const id = r.id || r.ID || r.id_contrato || r.numero || '';
        const label = r.contrato || r.contrato_descricao || (r.contrato ? String(r.contrato) : (`Contrato ${id}`));
        const statusCode = extractStatusCode(r);
        return {
          id,
          label,
          raw: r,
          statusCode,
          statusLabel: statusLabel(statusCode)
        };
      });

      // Filtra EXCLUINDO contratos com status 'D' (Desistiu) e 'I' (Inativo)
      const visible = normalized.filter(c => !['D', 'I'].includes(String(c.statusCode)));

      setContracts(visible);

      // se só houver 1 contrato visível já seleciona automaticamente e verifica status_internet
      if (visible.length === 1) {
        const single = visible[0];
        setFormData(prev => ({ ...prev, contractId: single.id }));
        checkContractInternetStatus(single.raw);
      } else {
        // limpar contractId caso o cliente tenha sido trocado ou haja múltiplos contratos
        setFormData(prev => ({ ...prev, contractId: '' }));
      }
    } catch (err) {
      console.error('Erro buscar contratos:', err);
      if (!errorMsg) setErrorMsg(err.message || String(err));
      setContracts([]);
      setContractWarning(null);
    } finally {
      setLoading(false);
    }
  };

  const handleContractSelect = (e) => {
    const val = e.target.value;
    setFormData(prev => ({ ...prev, contractId: val }));

    // procura o objeto completo na lista
    const found = contracts.find(c => String(c.id) === String(val));
    if (found) {
      checkContractInternetStatus(found.raw);
    } else {
      setContractWarning(null);
    }
  };

  const handleNext = () => {
    if (!formData.clientId) {
      alert('Selecione ou busque um cliente antes de prosseguir.');
      return;
    }
    if (!formData.contractId) {
      alert('Escolha o contrato do cliente antes de prosseguir.');
      return;
    }
    nextStep();
  };

  return (
    <div className="h-full flex flex-col">
      {/* Overlay de Loading Corporativo */}
      {loading && (
        <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-50 rounded-2xl">
          <div className="flex flex-col items-center gap-4 p-6 bg-white rounded-2xl shadow-2xl border border-blue-200">
            <Loader className="w-10 h-10 text-blue-600 animate-spin" />
            <div className="text-center">
              <p className="text-gray-800 font-semibold text-lg">Buscando informações...</p>
              <p className="text-gray-600 mt-1">Aguarde enquanto carregamos os dados do cliente</p>
            </div>
          </div>
        </div>
      )}

      {/* Header da Tela */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Cliente e Contrato</h2>
        <p className="text-gray-600 text-lg">Busque por CPF ou CNPJ para localizar o cliente e escolher o contrato</p>
      </div>

      <div className="space-y-6 flex-1">
        {/* CPF/CNPJ */}
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <label className="block text-sm font-semibold text-gray-800 mb-3">CPF ou CNPJ do Cliente</label>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input
                type="text"
                placeholder="000.000.000-00 ou 00.000.000/0000-00"
                value={formData.cpf_cnpj || ""}
                onChange={e => setFormData({ ...formData, cpf_cnpj: e.target.value })}
                disabled={loading}
                className="w-full text-gray-800 bg-white pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-all"
              />
            </div>
            <button 
              type="button" 
              onClick={handleBuscarCliente} 
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              {loading ? 'Buscando...' : 'Buscar'}
            </button>
            <button 
              type="button" 
              onClick={resetAll} 
              disabled={loading}
              title="Limpar"
              className="px-4 py-3 bg-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed transition-all duration-200 border border-gray-300 flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Limpar
            </button>
          </div>
          <small className="block mt-2 text-sm text-gray-500">Você pode colar o CPF/CNPJ com pontos/traço/barras ou somente números.</small>
        </div>

        {/* ID do Cliente */}
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <label className="block text-sm font-semibold text-gray-800 mb-3">ID do Cliente</label>
          <input
            type="text"
            value={formData.clientId || ''}
            disabled
            placeholder="Preenchido automaticamente após a busca"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-100 text-gray-600 cursor-not-allowed font-medium"
          />
        </div>

        {/* Contrato do Cliente */}
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <label className="block text-sm font-semibold text-gray-800 mb-3">Contrato do Cliente</label>

          {contracts.length > 0 ? (
            <>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5 pointer-events-none" />
                <select 
                  value={formData.contractId || ''} 
                  onChange={handleContractSelect}
                  disabled={loading}
                  className="w-full text-gray-800 pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all appearance-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">-- Selecione o contrato --</option>
                  {contracts.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.label} ({c.id}) - {c.statusLabel}
                    </option>
                  ))}
                </select>
              </div>

              {/* Banner de aviso sobre status_internet */}
              {contractWarning && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-yellow-800">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                    <strong className="text-yellow-800">Atenção:</strong>
                    <span>{contractWarning}</span>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input
                  type="text"
                  placeholder={clientFound ? "Digite o ID do contrato ou busque contratos" : "Busque o cliente primeiro"}
                  value={formData.contractId || ''}
                  onChange={e => setFormData({ ...formData, contractId: e.target.value })}
                  disabled={!clientFound || loading}
                  className="w-full pl-10 pr-4 py-3 text-gray-600 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-all"
                />
              </div>
              <small className="block mt-2 text-sm text-gray-500">
                {clientFound ? 'Escolha na lista (se houver) ou digite o ID do contrato.' : 'Busque primeiro o cliente para listar contratos.'}
              </small>
            </div>
          )}
        </div>

        {/* Nome do Cliente */}
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <label className="block text-sm font-semibold text-gray-800 mb-3">Nome do Cliente que irá Receber a Equipe</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input
              type="text"
              value={formData.nome_cliente || ''}
              onChange={e => setFormData({ ...formData, nome_cliente: e.target.value })}
              placeholder="Nome será preenchido automaticamente"
              disabled={loading}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-800 disabled:bg-gray-100 disabled:cursor-not-allowed transition-all"
            />
          </div>
        </div>

        {/* Telefone */}
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <label className="block text-sm font-semibold text-gray-800 mb-3">Telefone de quem irá Receber a Equipe</label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input
              type="text"
              value={formData.telefone_celular || ''}
              onChange={e => setFormData({ ...formData, telefone_celular: e.target.value })}
              placeholder="Telefones serão preenchidos automaticamente"
              disabled={loading}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-800 disabled:bg-gray-100 disabled:cursor-not-allowed transition-all"
            />
          </div>
        </div>

        {/* Mensagem de Erro */}
        {errorMsg && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <div>
                <strong className="text-red-800 font-semibold block">Erro no processo:</strong>
                <div className="mt-1 text-sm text-red-700 whitespace-pre-wrap">{errorMsg}</div>
              </div>
            </div>
          </div>
        )}

        {/* Botão Próximo */}
        <div className="flex justify-end pt-4">
          <button 
            onClick={handleNext} 
            disabled={loading}
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