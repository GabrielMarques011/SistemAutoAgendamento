import React, { useState } from 'react';
import { MapPin, Home, Users, Settings, Wifi, Building, Calendar, BarChart3, Shield, EthernetPort, Angry, WifiCog, WifiOff, ChevronDown, ChevronRight, AudioWaveform, UserRoundCog, Cable, Plug, RouteOff, ChartNoAxesCombined, Router, Clock, Phone, CheckCircle, Info } from 'lucide-react';

const menuCategories = [
  {
    id: 'mudanca-endereco-ponto',
    label: 'Mudança de Endereço/Ponto',
    icon: MapPin,
    items: [
      {
        id: 'transferencia-endereco',
        label: 'Transferência de Endereço',
        icon: MapPin,
        description: 'Agendamento para mudança de endereço',
        active: true
      },
      {
        id: 'mudanca-ponto',
        label: 'Mudança de Ponto',
        icon: Home,
        description: 'Alteração de ponto interno',
        active: true
      }
    ]
  },
  {
    id: 'bds-logicos',
    label: 'BDs Lógicos',
    icon: UserRoundCog,
    items: [
      {
        id: 'sem-conexao',
        label: 'Sem Conexão',
        icon: EthernetPort,
        description: 'Agendamento sobre problemas de sem conexão',
        active: true
      },
      {
        id: 'lentidao',
        label: 'Lentidão',
        icon: WifiCog,
        description: 'Agendamento sobre problemas de lentidão',
        active: true
      },
      {
        id: 'quedas-conexao',
        label: 'Quedas de Conexão',
        icon: WifiOff,
        description: 'Agendamento sobre quedas de conexão',
        active: true
      },
      {
        id: 'configuracao-roteador',
        label: 'Configuração de Roteador',
        icon: Settings,
        description: 'Configurações avançadas do roteador',
        active: true
      }
    ]
  },
  {
    id: 'bds-fisicos',
    label: 'BDs Físicos',
    icon: AudioWaveform,
    items: [
      {
        id: 'troca-equipamento',
        label: 'Troca de Equipamento',
        icon: Router,
        description: 'Agendamento de troca de equipamento',
        active: true
      },
      {
        id: 'alarmada',
        label: 'Alarmada',
        icon: RouteOff,
        description: 'Problemas com alarme na rede',
        active: true
      },
      {
        id: 'sinal-fora',
        label: 'Sinal Fora do Padrão',
        icon: ChartNoAxesCombined,
        description: 'Problemas com sinal fora do padrão',
        active: true
      },
      /* {
        id: 'problemas-fonte',
        label: 'Problemas Fonte',
        icon: Plug,
        description: 'Problemas relacionados à fonte de energia',
        active: true
      }, */
      {
        id: 'cabeamento-padrao',
        label: 'Cabeamento Incorreto',
        icon: Cable,
        description: 'Problemas relacionados à cabeamento fora do padrão',
        active: true
      }
    ]
  }
];

const atendimentosCategorias = [
  {
    id: 'atendimentos-solucionados',
    label: 'Atendimentos Solucionados',
    icon: CheckCircle,
    items: [
      {
        id: 'sem-conexao-solucionado',
        label: 'Sem Conexão',
        icon: EthernetPort,
        description: 'Atendimento solucionado - Sem conexão',
        active: true
      },
      {
        id: 'lentidao-solucionado',
        label: 'Lentidão',
        icon: WifiCog,
        description: 'Atendimento solucionado - Lentidão',
        active: false
      },
      {
        id: 'quedas-conexao-solucionado',
        label: 'Quedas de Conexão',
        icon: WifiOff,
        description: 'Atendimento solucionado - Quedas de conexão',
        active: false
      }
    ]
  },
  {
    id: 'atendimentos-informativos',
    label: 'Atendimentos Informativos',
    icon: Info,
    items: [
      {
        id: 'finalizacao-os',
        label: 'Finalização de OS',
        icon: CheckCircle,
        description: 'Finalização de Ordem de Serviço',
        active: false
      },
      {
        id: 'reagendamento',
        label: 'Reagendamento',
        icon: Calendar,
        description: 'Reagendamento de atendimento',
        active: false
      },
      {
        id: 'rompimento',
        label: 'Rompimento',
        icon: Calendar,
        description: 'Rompimento na região',
        active: false
      }
    ]
  }
];

export default function Sidebar({ activeModule, setActiveModule }) {
  const [expandedCategories, setExpandedCategories] = useState({
    'mudanca-endereco-ponto': false,
    'bds-logicos': false,
    'bds-fisicos': false
  });

  const [expandedAtendimentos, setExpandedAtendimentos] = useState({
    'atendimentos-solucionados': false,
    'atendimentos-informativos': false
  });
  
  const [activeView, setActiveView] = useState('agendamentos'); // 'agendamentos' ou 'atendimentos'

  const toggleCategory = (categoryId) => {
    if (activeView === 'agendamentos') {
      setExpandedCategories(prev => ({
        ...prev,
        [categoryId]: !prev[categoryId]
      }));
    } else {
      setExpandedAtendimentos(prev => ({
        ...prev,
        [categoryId]: !prev[categoryId]
      }));
    }
  };

  return (
    <div className="w-[20%] bg-gradient-to-b from-gray-800 to-gray-900 shadow-2xl border-r border-blue-700/30 flex flex-col">
      {/* Header do Sidebar */}
      <div className="p-6 border-b border-blue-700/30">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
            <Wifi className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">NMultiFibra</h2>
            <p className="text-blue-200 text-sm">Painel Corporativo</p>
          </div>
        </div>
        
        {/* Seletor de Visualização - AGENDAMENTOS / ATENDIMENTOS */}
        <div className="mt-6 bg-gray-700/50 rounded-xl p-1 border border-gray-600/30">
          <div className="grid grid-cols-2 gap-1">
            <button
              onClick={() => setActiveView('agendamentos')}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg transition-all duration-200 ${
                activeView === 'agendamentos'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg shadow-blue-500/25 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-gray-600/50'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span className="text-sm font-semibold">Agendamentos</span>
            </button>
            
            <button
              onClick={() => setActiveView('atendimentos')}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg transition-all duration-200 ${
                activeView === 'atendimentos'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg shadow-blue-500/25 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-gray-600/50'
              }`}
            >
              <Phone className="w-4 h-4" />
              <span className="text-sm font-semibold">Atendimentos</span>
            </button>
          </div>
        </div>

        <div className="mt-4">
          <div className="text-xs text-blue-300/60 uppercase font-semibold tracking-wider">
            {activeView === 'agendamentos' ? 'Módulos de Agendamento' : 'Tipos de Atendimento'}
          </div>
        </div>
      </div>

      {/* Menu de Navegação */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {activeView === 'agendamentos' ? (
          /* CONTEÚDO DOS AGENDAMENTOS */
          <>
            {menuCategories.map((category) => {
              const CategoryIcon = category.icon;
              const isExpanded = expandedCategories[category.id];
              
              return (
                <div key={category.id} className="space-y-1">
                  {/* Cabeçalho da Categoria */}
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className="w-full text-left p-3 rounded-lg transition-all duration-200 group bg-gray-700/30 hover:bg-gray-700/50 border border-gray-600/30 hover:border-blue-500/20"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-gray-600/50 group-hover:bg-blue-500/20 transition-colors">
                        <CategoryIcon className="w-4 h-4 text-gray-300 group-hover:text-white" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-200 group-hover:text-white text-left text-sm">
                          {category.label}
                        </div>
                      </div>

                      <div className="text-gray-400 group-hover:text-white transition-colors">
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </div>
                    </div>
                  </button>

                  {/* Itens da Categoria */}
                  {isExpanded && (
                    <div className="ml-4 space-y-1 border-l-2 border-gray-600/30 pl-2">
                      {category.items.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeModule === item.id;
                        
                        return (
                          <button
                            key={item.id}
                            onClick={() => item.active && setActiveModule(item.id)}
                            disabled={!item.active}
                            className={`w-full text-left p-3 rounded-xl transition-all duration-200 group ${
                              isActive
                                ? 'bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg shadow-blue-500/25 border border-blue-500/30'
                                : item.active
                                ? 'bg-gray-700/30 hover:bg-gray-700/50 border border-transparent hover:border-blue-500/20'
                                : 'bg-gray-800/30 opacity-60 cursor-not-allowed'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg transition-colors ${
                                isActive 
                                  ? 'bg-white/20' 
                                  : item.active
                                  ? 'bg-gray-600/30 group-hover:bg-blue-500/20'
                                  : 'bg-gray-700/30'
                              }`}>
                                <Icon className={`w-4 h-4 ${
                                  isActive 
                                    ? 'text-white' 
                                    : item.active
                                    ? 'text-gray-300 group-hover:text-white'
                                    : 'text-gray-500'
                                }`} />
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                <div className={`font-medium transition-colors text-left text-sm ${
                                  isActive 
                                    ? 'text-white' 
                                    : item.active
                                    ? 'text-gray-200 group-hover:text-white'
                                    : 'text-gray-500'
                                }`}>
                                  {item.label}
                                </div>
                                <div className={`text-xs transition-colors text-left ${
                                  isActive 
                                    ? 'text-blue-100' 
                                    : item.active
                                    ? 'text-gray-400 group-hover:text-blue-200'
                                    : 'text-gray-500'
                                }`}>
                                  {item.description}
                                </div>
                              </div>

                              {/* Indicadores */}
                              <div className="flex items-center gap-2">
                                {isActive && (
                                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                )}
                                
                                {!item.active && (
                                  <span className="text-xs bg-gray-700 text-gray-400 px-2 py-1 rounded border border-gray-600">
                                    Em breve
                                  </span>
                                )}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </>
        ) : (
          /* CONTEÚDO DOS ATENDIMENTOS */
          <div className="space-y-4">
            {atendimentosCategorias.map((category) => {
              const CategoryIcon = category.icon;
              const isExpanded = expandedAtendimentos[category.id];
              
              return (
                <div key={category.id} className="space-y-2">
                  {/* Cabeçalho da Categoria de Atendimentos */}
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className="w-full text-left p-3 rounded-lg transition-all duration-200 group bg-gray-700/30 hover:bg-gray-700/50 border border-gray-600/30 hover:border-blue-500/20"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-gray-600/50 group-hover:bg-blue-500/20 transition-colors">
                        <CategoryIcon className="w-4 h-4 text-gray-300 group-hover:text-white" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-200 group-hover:text-white text-left text-sm">
                          {category.label}
                        </div>
                      </div>

                      <div className="text-gray-400 group-hover:text-white transition-colors">
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </div>
                    </div>
                  </button>

                  {/* Itens da Categoria de Atendimentos */}
                  {isExpanded && (
                    <div className="ml-4 space-y-1 border-l-2 border-gray-600/30 pl-2">
                      {category.items.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeModule === item.id;
                        
                        return (
                          <button
                            key={item.id}
                            onClick={() => item.active && setActiveModule(item.id)}
                            disabled={!item.active}
                            className={`w-full text-left p-3 rounded-xl transition-all duration-200 group ${
                              isActive
                                ? 'bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg shadow-blue-500/25 border border-blue-500/30'
                                : item.active
                                ? 'bg-gray-700/30 hover:bg-gray-700/50 border border-transparent hover:border-blue-500/20'
                                : 'bg-gray-800/30 opacity-60 cursor-not-allowed'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg transition-colors ${
                                isActive 
                                  ? 'bg-white/20' 
                                  : item.active
                                  ? 'bg-gray-600/30 group-hover:bg-blue-500/20'
                                  : 'bg-gray-700/30'
                              }`}>
                                <Icon className={`w-4 h-4 ${
                                  isActive 
                                    ? 'text-white' 
                                    : item.active
                                    ? 'text-gray-300 group-hover:text-white'
                                    : 'text-gray-500'
                                }`} />
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                <div className={`font-medium transition-colors text-left text-sm ${
                                  isActive 
                                    ? 'text-white' 
                                    : item.active
                                    ? 'text-gray-200 group-hover:text-white'
                                    : 'text-gray-500'
                                }`}>
                                  {item.label}
                                </div>
                                <div className={`text-xs transition-colors text-left ${
                                  isActive 
                                    ? 'text-blue-100' 
                                    : item.active
                                    ? 'text-gray-400 group-hover:text-blue-200'
                                    : 'text-gray-500'
                                }`}>
                                  {item.description}
                                </div>
                              </div>

                              {/* Indicadores */}
                              <div className="flex items-center gap-2">
                                {isActive && (
                                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                )}
                                
                                {!item.active && (
                                  <span className="text-xs bg-gray-700 text-gray-400 px-2 py-1 rounded border border-gray-600">
                                    Em breve
                                  </span>
                                )}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Informação adicional sobre atendimentos */}
            <div className="mt-4 p-3 bg-gray-700/30 rounded-lg border border-gray-600/30">
              <div className="text-xs text-gray-300 text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Phone className="w-3 h-3 text-blue-400" />
                  <span className="font-semibold text-blue-300">Atendimento Rápido</span>
                </div>
                <p className="text-gray-400">
                  Registro rápido de atendimentos técnicos solucionados e informativos
                </p>
              </div>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}