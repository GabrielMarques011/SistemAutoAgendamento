// src/components/Screen3.jsx
import React, { useRef, useEffect, useState } from "react";
import IMask from "imask";
import { House, MapPin, ArrowUp10, MapPinned, EthernetPort, Search, RefreshCw, Building } from "lucide-react";

export default function Screen3({ formData, setFormData, nextStep, prevStep }) {
  const oldCepRef = useRef();
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    if (oldCepRef.current) {
      IMask(oldCepRef.current, { mask: "00000-000" });
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

  // Busca contrato por ID e preenche os campos "antigos" caso estejam vazios
  useEffect(() => {
    const contractId = formData.contractId || formData.id_contrato || formData.contract || "";
    if (!contractId) return;

    const fetchOldAddressFromContract = async () => {
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

        // data pode ser a resposta inteira do IXC ou já uma estrutura custom
        const registro = (data.registros && data.registros[0]) ? data.registros[0] : (data.registro || data);

        if (!registro) {
          setFetchError("Registro de contrato não encontrado na resposta.");
          setLoading(false);
          return;
        }

        // DEBUG TEMP: inspecione no console as chaves/valores retornados
        // Remova esse console.log quando confirmar os nomes dos campos.
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

        // Variantes comuns de nomes para os campos "_novo"
        const enderecoKeys = padraoS
          ? ["endereco_novo", "novo_endereco", "enderecoNovo", "enderecoNovo", "ENDERECO_NOVO", "endereco", "address", "logradouro"]
          : ["endereco", "address", "logradouro", "endereco_novo", "novo_endereco", "enderecoNovo"];

        const numeroKeys = padraoS
          ? ["numero_novo", "novo_numero", "numeroNovo", "nro_novo", "numero", "number", "nro"]
          : ["numero", "number", "nro", "numero_novo"];

        const bairroKeys = padraoS
          ? ["bairro_novo", "novo_bairro", "bairroNovo", "bairro", "neighborhood"]
          : ["bairro", "neighborhood", "bairro_novo"];

        const cepKeys = padraoS
          ? ["cep_novo", "novo_cep", "cepNovo", "cep", "CEP", "Cep"]
          : ["cep", "CEP", "Cep", "cep_novo"];

        const cidadeKeys = padraoS
          ? ["cidade_nova", "novo_cidade", "cidadeNovo", "cidade", "city", "id_cidade", "idCidade"]
          : ["cidade", "city", "id_cidade", "cidade_nova", "id"];

        const complementoKeys = padraoS
          ? ["complemento_novo", "novo_complemento", "complementoNovo", "complemento", "completo", "complement"]
          : ["complemento", "complement", "completo", "complemento_novo"];

        const contratoEndereco = tryPick(registro, enderecoKeys);
        const contratoNumero = tryPick(registro, numeroKeys);
        const contratoBairro = tryPick(registro, bairroKeys);
        const contratoCep = tryPick(registro, cepKeys);
        const contratoCidade = tryPick(registro, cidadeKeys);
        const contratoComplemento = tryPick(registro, complementoKeys);

        // Atualiza apenas campos vazios (não sobrescreve entrada manual do usuário)
        setFormData(prev => ({
          ...prev,
          oldAddress: prev.oldAddress && prev.oldAddress.trim() ? prev.oldAddress : (contratoEndereco || prev.oldAddress || ""),
          oldNumber: prev.oldNumber && String(prev.oldNumber).trim() ? prev.oldNumber : (contratoNumero || prev.oldNumber || ""),
          oldNeighborhood: prev.oldNeighborhood && prev.oldNeighborhood.trim() ? prev.oldNeighborhood : (contratoBairro || prev.oldNeighborhood || ""),
          oldCep: prev.oldCep && String(prev.oldCep).trim() ? prev.oldCep : (formatCepPretty(contratoCep) || prev.oldCep || ""),
          oldCity: prev.oldCity && String(prev.oldCity).trim() ? prev.oldCity : (contratoCidade || prev.oldCity || ""),
          oldComplement: prev.oldComplement && String(prev.oldComplement).trim() ? prev.oldComplement : (contratoComplemento || prev.oldComplement || "")
        }));

      } catch (err) {
        console.error("Erro fetch contrato:", err);
        setFetchError(String(err) || "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    };
    
    fetchOldAddressFromContract();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.contractId]);

  // Busca CEP antigo via API externa (quando usuário clicar Buscar)
  const buscarCepAntigo = async () => {
    const cep = cleanDigits(formData.oldCep || "");
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
        oldAddress: dados.address || prev.oldAddress || "",
        oldNeighborhood: dados.district || prev.oldNeighborhood || "",
        oldCity: dados.city || prev.oldCity || ""
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
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Endereço Antigo do Cliente</h2>
        <p className="text-gray-600 text-lg">Preencha os dados do endereço anterior do cliente</p>
      </div>

      <div className="space-y-6 flex-1">
        {/* Estados de Loading e Erro */}
        {loading && (
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <div className="flex items-center gap-3">
              <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />
              <div>
                <p className="text-blue-800 font-medium">Carregando dados do contrato...</p>
                <p className="text-blue-600 text-sm">Buscando informações do endereço anterior</p>
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

        {/* CEP Antigo */}
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <label className="block text-sm font-semibold text-gray-800 mb-3">CEP Antigo</label>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input
                ref={oldCepRef}
                type="text"
                placeholder="00000-000"
                value={formData.oldCep || ""}
                onChange={e => setFormData({ ...formData, oldCep: e.target.value })}
                className="w-full text-gray-800 pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
              />
            </div>
            <button 
              onClick={buscarCepAntigo}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              Buscar
            </button>
          </div>
        </div>

        {/* Endereço Antigo */}
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <label className="block text-sm font-semibold text-gray-800 mb-3">Endereço</label>
          <div className="relative">
            <House className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Rua, Avenida, etc."
              value={formData.oldAddress || ""}
              onChange={e => setFormData({ ...formData, oldAddress: e.target.value })}
              className="w-full text-gray-800 pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
            />
          </div>
        </div>

        {/* Bairro Antigo */}
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <label className="block text-sm font-semibold text-gray-800 mb-3">Bairro</label>
          <div className="relative">
            <MapPinned className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Nome do bairro"
              value={formData.oldNeighborhood || ""}
              onChange={e => setFormData({ ...formData, oldNeighborhood: e.target.value })}
              className="w-full text-gray-800 pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
            />
          </div>
        </div>

        {/* Número Antigo */}
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <label className="block text-sm font-semibold text-gray-800 mb-3">Número</label>
          <div className="relative">
            <ArrowUp10 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Número do imóvel"
              value={formData.oldNumber || ""}
              onChange={e => setFormData({ ...formData, oldNumber: e.target.value })}
              className="w-full text-gray-800 pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
            />
          </div>
        </div>

        {/* Complemento Antigo */}
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <label className="block text-sm font-semibold text-gray-800 mb-3">Complemento</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Apartamento, bloco, etc. (opcional)"
              value={formData.oldComplement || ""}
              onChange={e => setFormData({ ...formData, oldComplement: e.target.value })}
              className="w-full text-gray-800 pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
            />
          </div>
        </div>

        {/* Seção de Porta */}
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <EthernetPort className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-800">Porta Instalada</h3>
          </div>
          
          <label className="block text-sm font-semibold text-gray-800 mb-4">Existe porta para desativar?</label>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, hasPorta: true })}
              className={`flex-1 px-6 py-4 rounded-xl font-semibold transition-all duration-200 border ${
                formData.hasPorta === true
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg shadow-blue-500/25 border-blue-600 text-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
              }`}
            >
              Sim
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, hasPorta: false })}
              className={`flex-1 px-6 py-4 rounded-xl font-semibold transition-all duration-200 border ${
                formData.hasPorta === false
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg shadow-blue-500/25 border-blue-600 text-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
              }`}
            >
              Não
            </button>
          </div>
        </div>

        {/* Campo de Porta (condicional) */}
        {formData.hasPorta && (
          <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
            <div className="flex items-center gap-2 mb-4">
              <EthernetPort className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-blue-800">Informações da Porta</h3>
            </div>
            
            <label className="block text-sm font-semibold text-gray-800 mb-3">Número da Porta</label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input
                type="text"
                inputMode="numeric"
                placeholder="Número da porta de 1 a 24"
                value={formData.portaNumber || ""}
                onChange={e => {
                  const value = e.target.value;

                  // 1️⃣ Regex: só aceita números (sem espaços, letras ou símbolos)
                  const isValidFormat = /^[0-9]*$/.test(value);

                  // 2️⃣ Verifica se está vazio ou entre 1 e 24
                  const numericValue = Number(value);

                  if (
                    (value === "" || isValidFormat) &&
                    (value === "" || (numericValue >= 1 && numericValue <= 24))
                  ) {
                    setFormData({ ...formData, portaNumber: value });
                  }
                }}
                className="w-full text-gray-800 pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
              />
            </div>
            <small className="block mt-2 text-sm text-gray-500">
              Informe o número da porta que precisa ser desativada (1-24)
            </small>
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
            onClick={() => {
              const cep = String(formData.oldCep || "").trim();
              const endereco = String(formData.oldAddress || "").trim();
              const bairro = String(formData.oldNeighborhood || "").trim();
              const numero = String(formData.oldNumber || "").trim();

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