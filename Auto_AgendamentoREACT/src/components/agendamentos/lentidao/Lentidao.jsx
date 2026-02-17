// src/components/agendamentos/mudanca-ponto/MudancaPonto.jsx
import React, { useState } from 'react';
import ProgressBar from '../../common/ProcessBar';
import ScreenLentidao1 from './ScreenLentidao1';
import ScreenLentidao2 from './ScreenLentidao2';
import ScreenLentidao3 from './ScreenLentidao3';
import ScreenLentidao4 from './ScreenLentidao4';
import ScreenLentidao5 from './ScreenLentidao5';

function Lentidao({ user, onReset }) {
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
        {step === 1 && <ScreenLentidao1 formData={formData} setFormData={setFormData} nextStep={nextStep} />}
        {step === 2 && <ScreenLentidao2 formData={formData} setFormData={setFormData} nextStep={nextStep} prevStep={prevStep}/>}
        {step === 3 && <ScreenLentidao3 formData={formData} setFormData={setFormData} nextStep={nextStep} prevStep={prevStep} />}
        {step === 4 && <ScreenLentidao4 formData={formData} setFormData={setFormData} nextStep={nextStep} prevStep={prevStep} />}
        {step === 5 && <ScreenLentidao5 formData={formData} prevStep={prevStep} onReset={resetForm} />}
      </div>
    </div>
  );
}

export default Lentidao;