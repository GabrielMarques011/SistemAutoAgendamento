// src/useAgendamento.js
import { useState } from 'react';

export function useAgendamento() {
  const [formData, setFormData] = useState({
    id_cliente: '',
    id_contrato: '',
    nome_cliente: '',
    telefone: '',
    endereco: '',
    numero: '',
    bairro: '',
    cep: '',
    cidade: '',
    valor: '',
    data: '',
    periodo: '',
    des_porta: '',
    endereco_antigo: ''
  });

  const updateData = (newData) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

  const isReadyToSubmit = () => {
    return formData.id_cliente && formData.id_contrato;
  };

  const enviarAgendamento = async () => {
    if (!isReadyToSubmit()) {
      console.warn('Dados incompletos. Ainda não será enviado.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/cliente', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (!response.ok) {
        console.error('Erro ao consultar cliente:', data);
        return data;
      }

      console.log('Agendamento realizado com sucesso:', data);
      return data;

    } catch (err) {
      console.error('Erro ao conectar com o backend:', err);
      return { error: err.message };
    }
  };

  return { formData, updateData, enviarAgendamento };
}
