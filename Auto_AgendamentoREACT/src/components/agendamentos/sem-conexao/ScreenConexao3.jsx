// src/components/Screen3.jsx
import React, { useRef, useEffect, useState } from "react";
import IMask from "imask";
import { House, MapPin, ArrowUp10, MapPinned, EthernetPort, Search, RefreshCw, Building } from "lucide-react";

export default function ScreenConexao3({ formData, setFormData, nextStep, prevStep }) {
  const cepRef = useRef();
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    if (cepRef.current) {
      IMask(cepRef.current, { mask: "00000-000" });
    }
  }, []);

  // função utilitária para limpar dígitos
  const cleanDigits = (s) => (String(s || "").replace(/\D/g, "") || "");

  // formata para XXXXX-XXX quando possível
  const formatCepPretty = (raw) => {
    try {
      const digits = cleanDigits(raw);
      if (digits.length === 8) return `${digits.slice(0,5)}-${digits.slice(5)}`;
      return raw || "";
    } catch (e) {
      return raw || "";
    }
  };

  // Busca contrato por ID e preenche os campos do endereço atual caso estejam vazios
  useEffect(() => {
    const contractId = formData.contractId || formData.id_contrato || formData.contract || "";
    if (!contractId) return;

    const fetchCurrentAddressFromContract = async () => {
      setLoading(true);
      setFetchError(null);
      try {
        const payload = {
          qtype: "id",
          query: String(contractId),
          oper: "=",
          page: "1",
          rp: "1"
        };

        const res = await fetch(`http://10.0.30.251:5000/api/cliente_contrato`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          console.warn("Erro ao obter contrato:", data);
          setFetchError(data.error || "Erro ao buscar contrato");
          setLoading(false);
          return;
        }

        const registro = (data.registros && data.registros[0]) ? data.registros[0] : (data.registro || data);

        if (!registro) {
          setFetchError("Registro de contrato não encontrado na resposta.");
          setLoading(false);
          return;
        }

        console.log("DEBUG /cliente_contrato -> registro raw:", registro);

        const tryPick = (obj, keys) => {
          for (const k of keys) {
            if (Object.prototype.hasOwnProperty.call(obj, k)) {
              const v = obj[k];
              if (v !== undefined && v !== null && String(v).trim() !== "") return v;
            }
          }
          return "";
        };

        // detecta 'S' de várias formas possíveis (string, número, booleano)
        const padraoVal = registro.endereco_padrao_cliente ?? registro.endereco_padrao ?? registro.enderecoPadrao ?? registro.endereco_padrao === 1 ? registro.endereco_padrao : undefined;
        const padraoS = (() => {
          const v = padraoVal;
          if (v === undefined || v === null) return false;
          const s = String(v).trim().toUpperCase();
          return (s === "S" || s === "1" || s === "TRUE" || s === "T" || s === "SIM" || s === "Y");
        })();

        // Variantes comuns de nomes para os campos
        const enderecoKeys = ["endereco", "address", "logradouro", "endereco_novo", "novo_endereco", "enderecoNovo"];
        const numeroKeys = ["numero", "number", "nro", "numero_novo"];
        const bairroKeys = ["bairro", "neighborhood", "bairro_novo"];
        const cepKeys = ["cep", "CEP", "Cep", "cep_novo"];
        const cidadeKeys = ["cidade", "city", "id_cidade", "cidade_nova", "id"];
        const complementoKeys = ["complemento", "complement", "completo", "complemento_novo"];

        const contratoEndereco = tryPick(registro, enderecoKeys);
        const contratoNumero = tryPick(registro, numeroKeys);
        const contratoBairro = tryPick(registro, bairroKeys);
        const contratoCep = tryPick(registro, cepKeys);
        const contratoCidade = tryPick(registro, cidadeKeys);
        const contratoComplemento = tryPick(registro, complementoKeys);

        // Atualiza apenas campos vazios (não sobrescreve entrada manual do usuário)
        setFormData(prev => ({
          ...prev,
          endereco_atual: prev.endereco_atual && prev.endereco_atual.trim() ? prev.endereco_atual : (contratoEndereco || prev.endereco_atual || ""),
          numero_atual: prev.numero_atual && String(prev.numero_atual).trim() ? prev.numero_atual : (contratoNumero || prev.numero_atual || ""),
          bairro_atual: prev.bairro_atual && prev.bairro_atual.trim() ? prev.bairro_atual : (contratoBairro || prev.bairro_atual || ""),
          cep_atual: prev.cep_atual && String(prev.cep_atual).trim() ? prev.cep_atual : (formatCepPretty(contratoCep) || prev.cep_atual || ""),
          cidade_atual: prev.cidade_atual && String(prev.cidade_atual).trim() ? prev.cidade_atual : (contratoCidade || prev.cidade_atual || ""),
          complemento_atual: prev.complemento_atual && String(prev.complemento_atual).trim() ? prev.complemento_atual : (contratoComplemento || prev.complemento_atual || "")
        }));

      } catch (err) {
        console.error("Erro fetch contrato:", err);
        setFetchError(String(err) || "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    };
    
    fetchCurrentAddressFromContract();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.contractId]);

  // Busca CEP atual via API externa (quando usuário clicar Buscar)
  const buscarCepAtual = async () => {
    const cep = cleanDigits(formData.cep_atual || "");
    if (cep.length !== 8) {
      alert("Digite um CEP válido.");
      return;
    }
    try {
      const res = await fetch(`https://cep.awesomeapi.com.br/json/${cep}`);
      const dados = await res.json();
      if (dados.erro) {
        alert("CEP não encontrado.");
        return;
      }
      setFormData(prev => ({
        ...prev,
        endereco_atual: dados.address || prev.endereco_atual || "",
        bairro_atual: dados.district || prev.bairro_atual || "",
        cidade_atual: dados.city || prev.cidade_atual || ""
      }));
    } catch (err) {
      console.error(err);
      alert("Erro ao buscar CEP.");
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header da Tela */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Endereço Atual do Cliente</h2>
        <p className="text-gray-600 text-lg">Confirme ou preencha os dados do endereço atual do cliente</p>
      </div>

      <div className="space-y-6 flex-1">
        {/* Estados de Loading e Erro */}
        {loading && (
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <div className="flex items-center gap-3">
              <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />
              <div>
                <p className="text-blue-800 font-medium">Carregando dados do contrato...</p>
                <p className="text-blue-600 text-sm">Buscando informações do endereço atual</p>
              </div>
            </div>
          </div>
        )}
        
        {fetchError && (
          <div className="bg-red-50 rounded-xl p-4 border border-red-200">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <div>
                <p className="text-red-800 font-medium">Erro ao carregar dados</p>
                <p className="text-red-600 text-sm">{fetchError}</p>
              </div>
            </div>
          </div>
        )}

        {/* CEP Atual */}
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <label className="block text-sm font-semibold text-gray-800 mb-3">CEP Atual</label>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input
                ref={cepRef}
                type="text"
                placeholder="00000-000"
                value={formData.cep_atual || ""}
                onChange={e => setFormData({ ...formData, cep_atual: e.target.value })}
                className="w-full text-gray-800 pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
              />
            </div>
            <button 
              onClick={buscarCepAtual}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              Buscar
            </button>
          </div>
        </div>

        {/* Endereço Atual */}
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <label className="block text-sm font-semibold text-gray-800 mb-3">Endereço Atual</label>
          <div className="relative">
            <House className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Rua, Avenida, etc."
              value={formData.endereco_atual || ""}
              onChange={e => setFormData({ ...formData, endereco_atual: e.target.value })}
              className="w-full text-gray-800 pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
            />
          </div>
        </div>

        {/* Bairro Atual */}
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <label className="block text-sm font-semibold text-gray-800 mb-3">Bairro Atual</label>
          <div className="relative">
            <MapPinned className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Nome do bairro"
              value={formData.bairro_atual || ""}
              onChange={e => setFormData({ ...formData, bairro_atual: e.target.value })}
              className="w-full text-gray-800 pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
            />
          </div>
        </div>

        {/* Número Atual */}
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <label className="block text-sm font-semibold text-gray-800 mb-3">Número Atual</label>
          <div className="relative">
            <ArrowUp10 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Número do imóvel"
              value={formData.numero_atual || ""}
              onChange={e => setFormData({ ...formData, numero_atual: e.target.value })}
              className="w-full text-gray-800 pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
            />
          </div>
        </div>

        {/* Complemento Atual */}
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <label className="block text-sm font-semibold text-gray-800 mb-3">Complemento Atual</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Apartamento, bloco, etc. (opcional)"
              value={formData.complemento_atual || ""}
              onChange={e => setFormData({ ...formData, complemento_atual: e.target.value })}
              className="w-full text-gray-800 pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
            />
          </div>
        </div>

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
            onClick={() => {
              const cep = String(formData.cep_atual || "").trim();
              const endereco = String(formData.endereco_atual || "").trim();
              const bairro = String(formData.bairro_atual || "").trim();
              const numero = String(formData.numero_atual || "").trim();

              // 🔹 Verificação obrigatória de todos os campos
              if (!cep) {
                alert("Por favor, preencha o CEP antes de continuar.");
                return;
              }

              if (!/^\d{5}-?\d{3}$/.test(cep)) {
                alert("Informe um CEP válido no formato 00000-000.");
                return;
              }

              if (!endereco) {
                alert("Por favor, preencha o campo Rua/Avenida antes de continuar.");
                return;
              }

              if (!bairro) {
                alert("Por favor, preencha o campo Bairro antes de continuar.");
                return;
              }

              if (!numero) {
                alert("Por favor, preencha o campo Número antes de continuar.");
                return;
              }

              // Se tudo estiver preenchido corretamente → avança
              nextStep();
            }}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2"
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