// src/components/layout/Header.jsx
import React from 'react';
import { LogOut, User, Shield, Wifi, Calendar } from 'lucide-react';

export default function Header({ user, onLogout, activeModule }) {
  const getModuleTitle = (module) => {
    const titles = {
      'transferencia-endereco': 'Transferência de Endereço',
      'mudanca-ponto': 'Mudança de Ponto',
      'sem-conexao': 'Sem Conexão',
      'lentidao': 'Lentidão',
      'quedas-conexao': 'Quedas de Conexão',
      'configuracao-roteador': 'Configuração de Roteador',
      'alarmada': 'Alarmada',
      'sinal-fora': 'Sinal Fora do Padrão',
      'problemas-fonte': 'Problemas na Fonte de Energia',
      'cabemento-padrao': 'Cabeamento Fora do Padrão',
      'troca-equipamento': 'Troca de Equipamento'
    };
    return titles[module] || 'Sistema de Agendamentos';
  };

  const getModuleDescription = (module) => {
    const descriptions = {
      'transferencia-endereco': 'Agendamento para transferência de endereço do cliente',
      'mudanca-ponto': 'Agendamento para mudança de ponto interno',
      'sem-conexao': 'Agendamento sobre problemas de sem conexão',
      'lentidao': 'Agendamento sobre problemas de lentidão',
      'quedas-conexao': 'Agendamento sobre quedas de conexão',
      'configuracao-roteador': 'Agendamento para configuração de roteador',
      'alarmada': 'Agendamento para verificação de alarmas técnicos',
      'sinal-fora': 'Agendamento para verificação de sinal fora do padrão',
      'problemas-fonte': 'Agendamento para verificação de problemas na fonte de energia',
      'cabemento-padrao': 'Agendamento para verificação de cabeamento fora do padrão',
      'troca-equipamento': 'Agendamento de troca de equipamento'
    };
    return descriptions[module] || 'Selecione um módulo para começar';
  };

  return (
    <header className="bg-gradient-to-r from-gray-800 to-blue-900 shadow-2xl border-b border-blue-700/30">
      <div className="flex items-center justify-between px-8 py-4">
        {/* Lado Esquerdo - Título e Descrição do Módulo */}
        <div className="flex items-center gap-4 flex-1">
          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl font-bold text-white truncate">
              {getModuleTitle(activeModule)}
            </h1>
            <p className="text-blue-200 font-medium mt-1 truncate">
              {getModuleDescription(activeModule)}
            </p>
          </div>
        </div>
        
        {/* Lado Direito - Informações do Usuário e Botão Sair */}
        <div className="flex items-center gap-6">
          {/* Informações do Usuário */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="font-semibold text-white text-sm sm:text-base">
                {user?.nome || 'Usuário'}
              </div>
              <div className="text-blue-200 text-xs sm:text-sm flex items-center gap-1">
                <Shield className="w-3 h-3" />
                Técnico ID: <span className="font-mono bg-blue-700/30 px-1 rounded">{user?.id_tecnico || 'N/A'}</span>
              </div>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white font-bold shadow-lg border border-blue-500/30">
              <User className="w-5 h-5" />
            </div>
          </div>

          {/* Separador Visual */}
          <div className="h-8 w-px bg-blue-600/50"></div>

          {/* Botão Sair */}
          <button 
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2.5 bg-red-600/90 text-white rounded-xl hover:bg-red-700 transition-all duration-200 shadow-lg hover:shadow-red-500/25 hover:scale-105 border border-red-500/30 group"
            title="Sair do sistema"
          >
            <LogOut className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            <span className="hidden sm:inline font-medium">Sair</span>
          </button>
        </div>
      </div>

      {/* Barra de Progresso Sutil */}
      <div className="h-1 bg-gradient-to-r from-blue-500 via-blue-400 to-blue-300 opacity-60"></div>

      {/* Indicador de Status do Sistema */}
      <div className="absolute top-2 right-2 flex items-center gap-1">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        <span className="text-xs text-green-300 font-medium">Online</span>
      </div>
    </header>
  );
}