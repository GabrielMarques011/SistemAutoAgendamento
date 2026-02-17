// src/components/agendamentos/mudanca-ponto/MudancaPonto.jsx
import React, { useState } from 'react';
import ProgressBar from '../../common/ProcessBar';
import ScreenAlarmada1 from './ScreenAlarmada1';
import ScreenAlarmada2 from './ScreenAlarmada2';
import ScreenAlarmada3 from './ScreenAlarmada3';
import ScreenAlarmada4 from './ScreenAlarmada4';
import ScreenAlarmada5 from './ScreenAlarmada5';

function Alarmada({ user, onReset }) {
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
        {step === 1 && <ScreenAlarmada1 formData={formData} setFormData={setFormData} nextStep={nextStep} />}
        {step === 2 && <ScreenAlarmada2 formData={formData} setFormData={setFormData} nextStep={nextStep} prevStep={prevStep}/>}
        {step === 3 && <ScreenAlarmada3 formData={formData} setFormData={setFormData} nextStep={nextStep} prevStep={prevStep} />}
        {step === 4 && <ScreenAlarmada4 formData={formData} setFormData={setFormData} nextStep={nextStep} prevStep={prevStep} />}
        {step === 5 && <ScreenAlarmada5 formData={formData} prevStep={prevStep} onReset={resetForm} />}
      </div>
    </div>
  );
}

export default Alarmada;