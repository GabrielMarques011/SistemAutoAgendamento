// src/components/agendamentos/mudanca-ponto/MudancaPonto.jsx
import React, { useState } from 'react';
import ProgressBar from '../../common/ProcessBar';
import ScreenCabeamento1 from './ScreenCabeamento1';
import ScreenCabeamento2 from './ScreenCabeamento2';
import ScreenCabeamento3 from './ScreenCabeamento3';
import ScreenCabeamento4 from './ScreenCabeamento4';
import ScreenCabeamento5 from './ScreenCabeamento5';

function Cabeamento({ user, onReset }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    clientId: '',
    contractId: '',
    nome_cliente: '',
    telefone: '',
    isCondominio: false,
    condominio: '',
    outroCondominio: '',
    apartment: '',
    block: '',
    cep_atual: '',
    endereco_atual: '',
    bairro_atual: '',
    numero_atual: '',
    complemento_atual: '',
    cidade_atual: '',
    scheduledDate: '',
    period: 'comercial',
    id_tecnico: user.id_tecnico,
  });

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  // Função para resetar o formulário
  const resetForm = () => {
    setStep(1);
    setFormData({
      clientId: '',
      contractId: '',
      nome_cliente: '',
      telefone: '',
      isCondominio: false,
      condominio: '',
      outroCondominio: '',
      apartment: '',
      block: '',
      cep_atual: '',
      endereco_atual: '',
      bairro_atual: '',
      numero_atual: '',
      complemento_atual: '',
      cidade_atual: '',
      scheduledDate: '',
      period: 'comercial',
      id_tecnico: user.id_tecnico,
    });
    
    if (onReset) {
      onReset();
    }
  };

  return (
    <div className="container mt-4">
      {/* Mantemos o ProgressBar no mesmo estilo */}
      <div className="header">
        <ProgressBar currentStep={step} totalSteps={5} stepsLabels={['Cliente', 'Observação', 'Confirmar Endereço', 'Agendamento','Revisão']} />
      </div>

      <div className="card">
        {step === 1 && <ScreenCabeamento1 formData={formData} setFormData={setFormData} nextStep={nextStep} />}
        {step === 2 && <ScreenCabeamento2 formData={formData} setFormData={setFormData} nextStep={nextStep} prevStep={prevStep}/>}
        {step === 3 && <ScreenCabeamento3 formData={formData} setFormData={setFormData} nextStep={nextStep} prevStep={prevStep} />}
        {step === 4 && <ScreenCabeamento4 formData={formData} setFormData={setFormData} nextStep={nextStep} prevStep={prevStep} />}
        {step === 5 && <ScreenCabeamento5 formData={formData} prevStep={prevStep} onReset={resetForm} />}
      </div>
    </div>
  );
}

export default Cabeamento;