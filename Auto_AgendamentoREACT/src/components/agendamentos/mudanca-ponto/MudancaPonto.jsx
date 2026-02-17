// src/components/agendamentos/mudanca-ponto/MudancaPonto.jsx
import React, { useState } from 'react';
import ProgressBar from '../../../components/common/ProcessBar';
import ScreenMudanca1 from './ScreenMudanca1';
import ScreenMudanca2 from './ScreenMudanca2';
import ScreenMudanca3 from './ScreenMudanca3';
import ScreenMudanca4 from './ScreenMudanca4';
import ScreenMudanca5 from './ScreenMudanca5';
import ScreenMudanca6 from './ScreenMudanca6';



function MudancaPonto({ user, onReset }) {
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
    valueType: 'renovacao',
    taxValue: '',
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
      valueType: 'renovacao',
      taxValue: '',
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
        <ProgressBar currentStep={step} totalSteps={6} stepsLabels={['Cliente', 'Observação', 'Confirmar Endereço','Valor', 'Agendamento','Revisão']} />
      </div>

      <div className="card">
        {step === 1 && <ScreenMudanca1 formData={formData} setFormData={setFormData} nextStep={nextStep} />}
        {step === 2 && <ScreenMudanca2 formData={formData} setFormData={setFormData} nextStep={nextStep} prevStep={prevStep}/>}
        {step === 3 && <ScreenMudanca3 formData={formData} setFormData={setFormData} nextStep={nextStep} prevStep={prevStep} />}
        {step === 4 && <ScreenMudanca4 formData={formData} setFormData={setFormData} nextStep={nextStep} prevStep={prevStep} />}
        {step === 5 && <ScreenMudanca5 formData={formData} setFormData={setFormData} nextStep={nextStep} prevStep={prevStep} />}
        {step === 6 && <ScreenMudanca6 formData={formData} prevStep={prevStep} onReset={resetForm} />}
      </div>
    </div>
  );
}

export default MudancaPonto;