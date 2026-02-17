// src/components/Screen2.jsx
import React, { useRef, useState, useEffect } from "react";
import IMask from "imask";
import { House, MapPin, ArrowUp10, MapPinned, Search, Building, RefreshCw } from "lucide-react";

export default function Screen2({ formData, setFormData, nextStep, prevStep }) {
  const cepRef = useRef();
  const [loadingCep, setLoadingCep] = useState(false);
  const [condominios, setCondominios] = useState([]);
  const [loadingCondominios, setLoadingCondominios] = useState(false);
  const [searchCondominio, setSearchCondominio] = useState("");

  const [errors, setErrors] = useState({
    address: null,
    cep: null,
    neighborhood: null,
    number: null,
  });

  useEffect(() => {
    if (cepRef.current) {
      IMask(cepRef.current, { mask: "00000-000" });
    }
  }, []);

  useEffect(() => {
    setErrors((prev) => ({
      ...prev,
      address:
        formData.address && formData.address.trim() ? null : prev.address,
      neighborhood:
        formData.neighborhood && formData.neighborhood.trim()
          ? null
          : prev.neighborhood,
      number:
        formData.number && String(formData.number).trim()
          ? null
          : prev.number,
      cep: validateCep(formData.cep) ? null : prev.cep,
    }));
  }, [formData.address, formData.neighborhood, formData.number, formData.cep]);

  useEffect(() => {
    if (formData.isCondominio) {
      fetchCondominios();
    }
  }, [formData.isCondominio]);

  const fetchCondominios = async () => {
    setLoadingCondominios(true);
    try {
      const res = await fetch("http://10.0.30.251:5000/api/condominios");
      if (!res.ok) {
        console.warn("Falha ao buscar condomínios", res.status);
        setCondominios([]);
        return;
      }
      const json = await res.json();
      const sorted = (json.registros || []).sort((a, b) =>
        (a.condominio || "").localeCompare(b.condominio || "")
      );
      setCondominios(sorted);
    } catch (err) {
      console.error("Erro ao buscar condomínios:", err);
      setCondominios([]);
    } finally {
      setLoadingCondominios(false);
    }
  };

  const cleanDigits = (s) => String(s || "").replace(/\D/g, "") || "";
  const validateCep = (cepValue) => cleanDigits(cepValue).length === 8;

  const buscarCep = async () => {
    const cep = cleanDigits(formData.cep);
    if (cep.length !== 8) {
      setErrors((prev) => ({ ...prev, cep: "Digite um CEP válido (8 dígitos)." }));
      alert("Digite um CEP válido.");
      return;
    }

    setLoadingCep(true);
    try {
      const res = await fetch(`http://10.0.30.251:5000/api/cep/${cep}`);
      const dados = await res.json();

      if (!res.ok) {
        const msg = dados.error || "Erro desconhecido ao buscar CEP.";
        alert(msg);
        return;
      }

      const normalizedCep = cleanDigits(dados.cep);
      setFormData({
        ...formData,
        cep: normalizedCep || formData.cep,
        address: dados.address || formData.address || "",
        neighborhood: dados.district || formData.neighborhood || "",
        cidade: dados.city || dados.cityId || formData.cidade || "",
        state: dados.state || formData.state || "",
        city_ibge: dados.city_ibge || formData.city_ibge || "",
        lat: dados.lat || dados.latitude || "",
        lng: dados.lng || dados.longitude || "",
        latitude: dados.lat || dados.latitude || "",
        longitude: dados.lng || dados.longitude || "",
        cityId: dados.cityId || null,
      });
      setErrors((prev) => ({ ...prev, cep: null }));
    } catch (err) {
      console.error(err);
      alert("Erro ao buscar CEP.");
    } finally {
      setLoadingCep(false);
    }
  };

  const buildUpdatePayload = (source) => {
    const payload = {
      contractId: source.contractId || source.id_contrato || source.contract || "",
      address: source.address || "",
      number: source.number || "",
      neighborhood: source.neighborhood || "",
      cep: source.cep || "",
      cidade: source.cidade || source.city || "",
      state: source.state || "",
      complement: source.complemento || source.complement || "",
      lat: source.lat || source.latitude || "",
      lng: source.lng || source.longitude || "",
      city_ibge: source.city_ibge || source.cityIbge || "",
      isCondominio: !!source.isCondominio,
      id_condominio: source.isCondominio ? source.condominio || "" : "",
      condominio: source.isCondominio ? source.condominio || "" : "",
      condominioName: source.isCondominio ? source.condominioName || "" : "",
      bloco: source.isCondominio ? source.bloco || "" : "",
      apartment: source.isCondominio ? source.apartment || source.apartamento || "" : "",
      apartamento: source.isCondominio ? source.apartment || source.apartamento || "" : "",
    };
    return payload;
  };

  const handleNext = async () => {
    const newErrors = { ...errors };

    let ok = true;
    if (!formData.address?.trim()) { newErrors.address = "Endereço é obrigatório."; ok = false; }
    if (!formData.neighborhood?.trim()) { newErrors.neighborhood = "Bairro é obrigatório."; ok = false; }
    if (!formData.number?.trim()) { newErrors.number = "Número é obrigatório."; ok = false; }
    if (!validateCep(formData.cep)) { newErrors.cep = "CEP inválido (8 dígitos)."; ok = false; }

    if (formData.isCondominio) {
      if (!formData.complemento?.trim()) {
        if (!formData.bloco?.trim()) { newErrors.bloco = "Bloco é obrigatório."; ok = false; }
        if (!(formData.apartment || formData.apartamento)?.trim()) { newErrors.apartment = "Apartamento é obrigatório."; ok = false; }
      } else {
        newErrors.bloco = null;
        newErrors.apartment = null;
      }
    }

    setErrors(newErrors);

    if (!ok) {
      alert("Preencha os campos obrigatórios corretamente.");
      return;
    }

    const payload = buildUpdatePayload(formData);
    nextStep();
  };

  const normalizeString = (str) =>
    str?.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() || "";

  const filteredCondominios = condominios.filter((c) => {
    const termo = normalizeString(searchCondominio);
    return (
      normalizeString(c.condominio).includes(termo) ||
      (c.referencia && normalizeString(c.referencia).includes(termo))
    );
  });

  return (
    <div className="h-full flex flex-col">
      {/* Header da Tela */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Informe o Novo Endereço</h2>
        <p className="text-gray-600 text-lg">Preencha os dados do endereço de instalação</p>
      </div>

      <div className="space-y-6 flex-1">
        {/* CEP */}
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <label className="block text-sm font-semibold text-gray-800 mb-3">CEP</label>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input
                ref={cepRef}
                type="text"
                placeholder="00000-000"
                value={formData.cep || ""}
                onChange={(e) => { setFormData({ ...formData, cep: e.target.value }); setErrors(prev => ({ ...prev, cep: null })); }}
                className={`w-full text-gray-800 pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white ${
                  errors.cep ? "border-red-500" : "border-gray-300"
                }`}
              />
            </div>
            <button 
              onClick={buscarCep} 
              disabled={loadingCep} 
              className={`px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2 ${
                loadingCep ? "opacity-50" : ""
              }`}
            >
              {loadingCep ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              {loadingCep ? "Buscando..." : "Buscar"}
            </button>
          </div>
          {errors.cep && (
            <div className="mt-2 flex items-center gap-2 text-red-600 text-sm">
              <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
              {errors.cep}
            </div>
          )}
        </div>

        {/* Endereço */}
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <label className="block text-sm font-semibold text-gray-800 mb-3">Endereço</label>
          <div className="relative">
            <House className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Rua, Avenida, etc." 
              value={formData.address || ""} 
              onChange={(e) => { setFormData({ ...formData, address: e.target.value }); setErrors(prev => ({ ...prev, address: null })); }} 
              className={`w-full  text-gray-800 pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white ${
                errors.address ? "border-red-500" : "border-gray-300"
              }`} 
            />
          </div>
          {errors.address && (
            <div className="mt-2 flex items-center gap-2 text-red-600 text-sm">
              <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
              {errors.address}
            </div>
          )}
        </div>

        {/* Bairro */}
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <label className="block text-sm font-semibold text-gray-800 mb-3">Bairro</label>
          <div className="relative">
            <MapPinned className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Nome do bairro" 
              value={formData.neighborhood || ""} 
              onChange={(e) => { setFormData({ ...formData, neighborhood: e.target.value }); setErrors(prev => ({ ...prev, neighborhood: null })); }} 
              className={`w-full text-gray-800 pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white ${
                errors.neighborhood ? "border-red-500" : "border-gray-300"
              }`} 
            />
          </div>
          {errors.neighborhood && (
            <div className="mt-2 flex items-center gap-2 text-red-600 text-sm">
              <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
              {errors.neighborhood}
            </div>
          )}
        </div>

        {/* Número */}
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <label className="block text-sm font-semibold text-gray-800 mb-3">Número</label>
          <div className="relative">
            <ArrowUp10 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Número do imóvel" 
              value={formData.number || ""} 
              onChange={(e) => { setFormData({ ...formData, number: e.target.value }); setErrors(prev => ({ ...prev, number: null })); }} 
              className={`w-full text-gray-800 text-gray-800 pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white ${
                errors.number ? "border-red-500" : "border-gray-300"
              }`} 
            />
          </div>
          {errors.number && (
            <div className="mt-2 flex items-center gap-2 text-red-600 text-sm">
              <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
              {errors.number}
            </div>
          )}
        </div>

        {/* Complemento */}
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <label className="block text-sm font-semibold text-gray-800 mb-3">Complemento</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Apartamento, bloco, etc. (opcional)" 
              value={formData.complemento || ""} 
              onChange={(e) => setFormData({ ...formData, complemento: e.target.value })} 
              className="w-full text-gray-800 pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white" 
            />
          </div>
        </div>

        {/* É Condomínio? Checkbox */}
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative">
              <input
                id="isCondominio"
                type="checkbox"
                checked={!!formData.isCondominio}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setFormData(prev => ({
                    ...prev,
                    isCondominio: checked,
                    ...(checked ? {} : { id_condominio: " ", condominio: "", condominioName: "", bloco: " ", apartment: " ", apartamento: " " })
                  }));
                  if (checked) fetchCondominios();
                }}
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
              />
            </div>
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-semibold text-gray-800 group-hover:text-gray-900 transition-colors">
                É Condomínio?
              </span>
            </div>
          </label>
        </div>

        {/* Campos condicionais para Condomínio */}
        {formData.isCondominio && (
          <div className="bg-blue-50 rounded-xl p-6 border border-blue-200 space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <Building className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-blue-800">Informações do Condomínio</h3>
            </div>

            {/* Pesquisar Condomínio */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">Pesquisar Condomínio</label>
              <input 
                type="text" 
                placeholder="Digite nome ou referência do condomínio" 
                value={searchCondominio} 
                onChange={(e) => setSearchCondominio(e.target.value)} 
                className="w-full text-gray-800 py-3 px-4 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>

            {/* Condomínio */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">Condomínio</label>
              <div className="flex gap-3">
                <select 
                  value={formData.condominio || ""} 
                  onChange={(e) => {
                    const selectedId = e.target.value;
                    const selected = condominios.find(c => String(c.id) === String(selectedId));
                    if (selected) {
                      const normalizedCep = cleanDigits(selected.cep);
                      setFormData({
                        ...formData,
                        condominio: selectedId,
                        condominioName: selected.condominio || "",
                        id_condominio: selectedId,
                        address: selected.endereco || formData.address || "",
                        number: selected.numero || formData.number || "",
                        neighborhood: (selected.bairro || "").trim() || formData.neighborhood || "",
                        cep: normalizedCep || formData.cep || "",
                        cityId: selected.id_cidade ? String(selected.id_cidade) : formData.cityId || "",
                      });
                      setErrors({ ...errors, address: null, neighborhood: null, number: null, cep: null });
                    } else {
                      setFormData({ ...formData, condominio: "", condominioName: "", id_condominio: "" });
                    }
                  }} 
                  className="flex-1 py-3 px-4 text-gray-800 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" 
                  disabled={loadingCondominios}
                >
                  <option value="">— Selecione o condomínio —</option>
                  {filteredCondominios.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.condominio} {c.bairro ? `— ${c.bairro}` : ""}
                    </option>
                  ))}
                </select>
                <button 
                  type="button" 
                  onClick={fetchCondominios} 
                  disabled={loadingCondominios}
                  className="px-4 text-white py-3 bg-blue-600 font-semibold rounded-xl hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
                >
                  {loadingCondominios ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4" />
                  )}
                  Atualizar
                </button>
              </div>
            </div>

            {/* Bloco e Apartamento */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3">Bloco</label>
                <input 
                  type="text" 
                  placeholder="Bloco" 
                  value={formData.bloco || ""} 
                  onChange={(e) => setFormData({ ...formData, bloco: e.target.value })} 
                  className="w-full text-gray-800 py-3 px-4 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3">Apartamento</label>
                <input 
                  type="text" 
                  placeholder="Apartamento" 
                  value={formData.apartment || formData.apartamento || ""} 
                  onChange={(e) => setFormData({ ...formData, apartment: e.target.value, apartamento: e.target.value })} 
                  className="w-full text-gray-800  py-3 px-4 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" 
                />
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
            onClick={handleNext}
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