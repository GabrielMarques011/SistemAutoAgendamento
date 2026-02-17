// src/App.jsx
import React, { useState } from 'react';
import './App.css';
import 'boxicons/css/boxicons.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import LoginScreen from './components/common/LoginScreen';
import Layout from './components/layout/Layout';
import TransferenciaEndereco from './components/agendamentos/transferencia-endereco/TransferenciaEndereco';
import MudancaPonto from './components/agendamentos/mudanca-ponto/MudancaPonto';
import SemConexao from './components/agendamentos/sem-conexao/SemConexao';
import Lentidao from './components/agendamentos/lentidao/Lentidao';
import QuedaConexao from './components/agendamentos/quedas-conexao/QuedaConexao';
import ConfiRoteador from './components/agendamentos/configuracao/ConfiRoteador';
import TrocaEquipamento from './components/agendamentos/troca-equipamento/TrocaEquipamento';
import Alarmada from './components/agendamentos/alarmada/Alarmada';
import SinalPadrao from './components/agendamentos/sinal-padrao/SinalPadrao';
import ProblemaFonte from './components/agendamentos/problema-fonte/ProblemaFonte';
import Cabeamento from './components/agendamentos/cabeamento/Cabeamento';

function App() {
  const [user, setUser] = useState(null);
  const [activeModule, setActiveModule] = useState('transferencia-endereco');
  const [resetKey, setResetKey] = useState(0); // Chave para forçar reset do formulário

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    setResetKey(0); // Resetar a chave ao fazer logout
  };

  // Função para resetar o formulário de transferência
  const handleResetTransferencia = () => {
    setResetKey(prev => prev + 1); // Altera a chave para forçar remontagem do componente
  };

  // Função para resetar o formulário de mudança de ponto
  const handleResetMudancaPonto = () => {
    setResetKey(prev => prev + 1);
  };

  // Função para resetar o formulário de sem conexão
  const handleResetSemConexao = () => {
    setResetKey(prev => prev + 1);
  };

  // Função para resetar o formulário de lentidão
  const handleResetLentidao = () => {
    setResetKey(prev => prev + 1);
  };

  // Função para resetar o formulário de quedas de conexão
  const handleResetQuedaConexao = () => {
    setResetKey(prev => prev + 1);
  };

  // Função para resetar o formulário de configuração de roteador
  const handleResetConfig = () => {
    setResetKey(prev => prev + 1);
  };

  // Função para resetar o formulário de troca de equipamento
  const handleResetTroca = () => {
    setResetKey(prev => prev + 1);
  };

  // Função para resetar o formulário de alarmada
  const handleResetAlarmada = () => {
    setResetKey(prev => prev + 1);
  };

  // Função para resetar o formulário de sinal fora do padrão
  const handleResetSinalPadrao = () => {
    setResetKey(prev => prev + 1);
  };

  // Função para resetar o formulário de problemas na fonte
  const handleResetProblemaFonte = () => {
    setResetKey(prev => prev + 1);
  };

  // Função para resetar o formulário de cabeamento fora do padrão
  const handleResetCabeamento = () => {
    setResetKey(prev => prev + 1);
  };

  // Renderizar o módulo ativo
  const renderActiveModule = () => {
    switch (activeModule) {
      case 'transferencia-endereco':
        return (
          <TransferenciaEndereco 
            key={`transferencia-${resetKey}`}
            user={user} 
            onReset={handleResetTransferencia}
          />
        );
      
      case 'mudanca-ponto':
        return (
          <MudancaPonto 
            key={`mudanca-${resetKey}`}
            user={user} 
            onReset={handleResetMudancaPonto}
          />
        );

      case 'mudanca-ponto':
        return (
          <MudancaPonto 
            key={`mudanca-${resetKey}`}
            user={user} 
            onReset={handleResetMudancaPonto}
          />
        );

      case 'sem-conexao':
        return (
          <SemConexao
            key={`semconexao-${resetKey}`}
            user={user} 
            onReset={handleResetSemConexao}
          />
        );

      case 'lentidao':
        return (
          <Lentidao
            key={`lentidao-${resetKey}`}
            user={user} 
            onReset={handleResetLentidao}
          />
        );

      case 'quedas-conexao':
        return (
          <QuedaConexao
            key={`quedas-${resetKey}`}
            user={user} 
            onReset={handleResetQuedaConexao}
          />
        );

      case 'configuracao-roteador':
        return (
          <ConfiRoteador
            key={`configuracao-${resetKey}`}
            user={user} 
            onReset={handleResetConfig}
          />
        );

      case 'troca-equipamento':
        return (
          <TrocaEquipamento
            key={`troca-${resetKey}`}
            user={user} 
            onReset={handleResetTroca}
          />
        );
      
      case 'alarmada':
        return (
          <Alarmada
            key={`alarmada-${resetKey}`}
            user={user} 
            onReset={handleResetAlarmada}
          />
        );

      case 'sinal-fora':
        return (
          <SinalPadrao
            key={`sinal-${resetKey}`}
            user={user} 
            onReset={handleResetSinalPadrao}
          />
        );

      case 'problemas-fonte':
        return (
          <ProblemaFonte
            key={`problema-${resetKey}`}
            user={user} 
            onReset={handleResetProblemaFonte}
          />
        );

        case 'cabeamento-padrao':
        return (
          <Cabeamento
            key={`cabeamento-${resetKey}`}
            user={user} 
            onReset={handleResetCabeamento}
          />
        );

      // Para outros módulos (em desenvolvimento)
      case 'instalacao-nova':
      case 'vistoria-tecnica':
      default:
        return (
          <div className="w-full h-full flex items-center justify-center p-8">
            <div className="max-w-2xl w-full text-center">
              <div className="bg-blue-100 w-24 h-24 rounded-full flex items-center justify-center mb-8 mx-auto">
                <div className="text-3xl">🚧</div>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Módulo em Desenvolvimento
              </h2>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                Esta funcionalidade estará disponível em breve. 
                Estamos trabalhando para trazer mais opções de agendamento.
              </p>
              <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200 max-w-md mx-auto">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                  <p className="text-yellow-800 font-medium text-center">
                    No momento, utilize os módulos disponíveis.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  if (!user) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <Layout 
      activeModule={activeModule} 
      setActiveModule={setActiveModule}
      user={user}
      onLogout={handleLogout}
    >
      {renderActiveModule()}
    </Layout>
  );
}

export default App;