import React, { useState } from 'react';
import ProgressBar from '../../../components/common/ProcessBar';
import Screen1 from './Screen1';
import Screen2 from './Screen2';
import Screen3 from './Screen3';
import Screen4 from './Screen4';
import Screen5 from './Screen5';
import Screen6 from './Screen6';

function TransferenciaEndereco({ user, onReset }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    clientId: '',
    contractId: '',
    nome_cliente: '',
    telefone: '',
    cidade: '',
    cep: '',
    isCondominio: false,
    condominio: '',
    outroCondominio: '',
    apartment: '',
    block: '',
    address: '',
    neighborhood: '',
    number: '',
    complement: '',
    oldAddress: '',
    oldNeighborhood: '',
    oldNumber: '',
    oldComplement: '',
    hasPorta: false,
    portaNumber: '',
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
      cidade: '',
      cep: '',
      isCondominio: false,
      condominio: '',
      outroCondominio: '',
      apartment: '',
      block: '',
      address: '',
      neighborhood: '',
      number: '',
      complement: '',
      oldAddress: '',
      oldNeighborhood: '',
      oldNumber: '',
      oldComplement: '',
      hasPorta: false,
      portaNumber: '',
      valueType: 'renovacao',
      taxValue: '',
      scheduledDate: '',
      period: 'comercial',
      id_tecnico: user.id_tecnico,
    });
    
    // Chama a função de reset do App.jsx se existir
    if (onReset) {
      onReset();
    }
  };

  return (
    <div className="container mt-4">
      
      {/* Mantemos o ProgressBar no mesmo estilo */}
      <div className="header">
        <ProgressBar currentStep={step} totalSteps={6} stepsLabels={['Cliente', 'Novo Endereço', 'Antigo Endereço', 'Valor', 'Agendamento', 'Revisão']} />
      </div>

      <div className="card">
        {step === 1 && <Screen1 formData={formData} setFormData={setFormData} nextStep={nextStep} />}
        {step === 2 && <Screen2 formData={formData} setFormData={setFormData} nextStep={nextStep} prevStep={prevStep} />}
        {step === 3 && <Screen3 formData={formData} setFormData={setFormData} nextStep={nextStep} prevStep={prevStep} />}
        {step === 4 && <Screen4 formData={formData} setFormData={setFormData} nextStep={nextStep} prevStep={prevStep} />}
        {step === 5 && <Screen5 formData={formData} setFormData={setFormData} nextStep={nextStep} prevStep={prevStep} />}
        {step === 6 && <Screen6 formData={formData} prevStep={prevStep} onReset={resetForm} />}
      </div>
    </div>
  );
}

export default TransferenciaEndereco;