// src/components/LoginScreen.jsx
import React, { useState, useEffect } from "react";
import { LogIn, User, Lock, AlertCircle, Eye, EyeOff, CalendarCheck, Wifi, Shield } from "lucide-react";

const USERS = {
  "marques": { id_tecnico: "306", senha: "admin", nome: "Gabriel Marques" },
  "lucas.silva": { id_tecnico: "404", senha: "sup@404", nome: "Lucas Silva" },
  "rodrigo.akira": { id_tecnico: "367", senha: "sup@367", nome: "Rodrigo Akira" },
  "pedro.santos": { id_tecnico: "359", senha: "sup@359", nome: "Pedro Santos" },
  "pedro.guedes": { id_tecnico: "390", senha: "sup@390", nome: "Pedro Guedes" },
  "lucca.ramos": { id_tecnico: "381", senha: "sup@381", nome: "Lucca Ramos" },
  "kayky.cabral": { id_tecnico: "387", senha: "sup@387", nome: "Kayky Cabral" },
  "joao.miyake": { id_tecnico: "345", senha: "sup@345", nome: "João Miyake" },
  "joao.gomes": { id_tecnico: "313", senha: "sup@313", nome: "João Gomes" },
  "gabriel.rosa": { id_tecnico: "307", senha: "sup@307", nome: "Gabriel Rosa" },
  "gabriel.lima": { id_tecnico: "386", senha: "sup@386", nome: "Gabriel Lima" },
  "marcos.piazzi": { id_tecnico: "389", senha: "sup@389", nome: "Marcos Piazzi" },
  "alison.silva": { id_tecnico: "337", senha: "sup@337", nome: "Alison Silva" },
  "pedro.boni": { id_tecnico: "422", senha: "sup@422", nome: "Pedro Boni" },
  "rafael.guedes": { id_tecnico: "423", senha: "sup@423", nome: "Rafael Guedes" },
  "ricardo.correa": { id_tecnico: "421", senha: "sup@421", nome: "Ricardo Correa" },
  "samuel.mendes": { id_tecnico: "415", senha: "sup@415", nome: "Samuel Mendes" },
  "ryan.silva": { id_tecnico: "414", senha: "sup@414", nome: "Ryan Silva" },
  "joao.victor": { id_tecnico: "416", senha: "sup@416", nome: "João Victor" },
  "cesar": { id_tecnico: "202", senha: "cesaradmin", nome: "Cesar" }, 
  "financeiro": { id_tecnico: "126", senha: "nm12345678", nome: "Setor Financeiro" }, // Usuario financeiro = User Douglas
  "alves": { id_tecnico: "246", senha: "nm12345678", nome: "Henrique Alves" }, // Usuario Alves
  "felipe": { id_tecnico: "309", senha: "sup@309", nome: "Felipe Ferreira" }, // Usuario Felipe FERREIRINHA
};

export default function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Carregar usuário lembrado ao iniciar
  useEffect(() => {
    const savedUser = localStorage.getItem("rememberedUser");
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUsername(userData.username);
      setRememberMe(true);
    }
  }, []);

  // Contador para desbloqueio
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && isLocked) {
      setIsLocked(false);
      setAttempts(0);
    }
  }, [countdown, isLocked]);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Validações iniciais
    if (!username.trim() || !senha.trim()) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    if (isLocked) {
      setError(`Tentativas excedidas. Aguarde ${countdown} segundos.`);
      return;
    }

    setLoading(true);
    setError("");

    // Simular delay de rede
    await new Promise(resolve => setTimeout(resolve, 800));

    const userKey = username.trim().toLowerCase();
    const user = USERS[userKey];
    
    if (!user) {
      handleFailedAttempt("Usuário não encontrado.");
      setLoading(false);
      return;
    }

    if (user.senha !== senha) {
      handleFailedAttempt("Senha incorreta.");
      setLoading(false);
      return;
    }

    // Login bem-sucedido
    const userData = {
      nome: user.nome,
      username: userKey,
      id_tecnico: user.id_tecnico,
    };

    // Salvar dados
    if (rememberMe) {
      localStorage.setItem("rememberedUser", JSON.stringify({ username: userKey }));
    } else {
      localStorage.removeItem("rememberedUser");
    }

    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("lastLogin", new Date().toISOString());

    // Resetar tentativas
    setAttempts(0);
    setLoading(false);
    
    // Feedback visual de sucesso antes de redirecionar
    setTimeout(() => onLogin(userData), 500);
  };

  const handleFailedAttempt = (message) => {
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    
    if (newAttempts >= 3) {
      setIsLocked(true);
      setCountdown(30); // 30 segundos de bloqueio
      setError(`Muitas tentativas falhas. Conta bloqueada por 30 segundos.`);
    } else if (newAttempts === 2) {
      setError(`${message} Mais uma tentativa incorreta bloqueará sua conta.`);
    } else {
      setError(`${message} Tentativas restantes: ${3 - newAttempts}`);
    }
  };

  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
    // Limpar erro quando usuário começar a digitar
    if (error) setError("");
  };

  const getPasswordStrength = (password) => {
    if (password.length === 0) return { strength: 0, text: "", color: "" };
    if (password.length < 4) return { strength: 1, text: "Fraca", color: "bg-red-500" };
    if (password.length < 8) return { strength: 2, text: "Média", color: "bg-yellow-500" };
    return { strength: 3, text: "Forte", color: "bg-green-500" };
  };

  const passwordStrength = getPasswordStrength(senha);

  return (
    <div className="fixed inset-0 overflow-auto">
      {/* Background Image Container - Ocupa 100% da tela */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url('https://nmultifibra.com.br/_next/image?url=%2FQuem%20somos.png&w=3840&q=75')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }}
      />
      
      {/* Overlay escuro para melhor contraste */}
      <div className="absolute inset-0 bg-black bg-opacity-60 z-1"></div>
      
      {/* Efeito de partículas sutil */}
      <div className="absolute inset-0 opacity-10 z-1">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full animate-pulse"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-white rounded-full animate-pulse delay-300"></div>
        <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-white rounded-full animate-pulse delay-700"></div>
      </div>

      {/* Conteúdo Centralizado */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Card Principal */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-8">
            {/* Header Corporativo */}
            <div className="text-center mb-8">
              <div className="flex justify-center items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl shadow-lg">
                  <Wifi className="w-8 h-8 text-white" />
                </div>
                <div className="text-left">
                  <h1 className="text-2xl font-bold text-gray-900 leading-tight">
                    NMultiFibra
                  </h1>
                  <p className="text-sm text-blue-600 font-medium">
                    Sistema Corporativo
                  </p>
                </div>
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Acesso ao Sistema
              </h2>
              <p className="text-gray-600">
                Agendamento Automático de Serviços
              </p>
            </div>

            {/* Formulário */}
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Usuário */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Usuário
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all bg-white text-gray-900 placeholder-gray-400 hover:border-gray-400"
                    placeholder="ex: gabriel.marques"
                    value={username}
                    onChange={handleInputChange(setUsername)}
                    disabled={loading || isLocked}
                    autoComplete="username"
                  />
                </div>
              </div>

              {/* Senha */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-semibold text-gray-700">
                    Senha
                  </label>
                  {senha && (
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${passwordStrength.color}`}></div>
                      <span className="text-xs text-gray-500">{passwordStrength.text}</span>
                    </div>
                  )}
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all bg-white text-gray-900 placeholder-gray-400 hover:border-gray-400"
                    placeholder="Digite sua senha"
                    value={senha}
                    onChange={handleInputChange(setSenha)}
                    disabled={loading || isLocked}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading || isLocked}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 disabled:opacity-50 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Lembrar de mim */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    disabled={loading}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                  />
                  <span className="text-sm text-gray-700">Lembrar usuário</span>
                </label>
                
                {/* Indicador de tentativas */}
                {attempts > 0 && !isLocked && (
                  <div className="flex items-center gap-1">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full ${
                          i < attempts ? 'bg-red-500' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Mensagem de Erro */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 animate-shake">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                    <p className="text-sm text-red-700 font-medium">{error}</p>
                  </div>
                </div>
              )}

              {/* Botão de Login */}
              <button
                type="submit"
                disabled={loading || isLocked || !username.trim() || !senha.trim()}
                className="w-full px-4 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Verificando...
                  </>
                ) : isLocked ? (
                  <>
                    <Lock className="w-5 h-5" />
                    Bloqueado ({countdown}s)
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                    Acessar Sistema
                  </>
                )}
              </button>
            </form>

            {/* Informações de Segurança Corporativa */}
            {/* <div className="mt-6 pt-6 border-t border-gray-200/50">
              <div className="flex items-center justify-center gap-3 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  <span>Sistema Seguro</span>
                </div>
                <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                <div className="flex items-center gap-1">
                  <CalendarCheck className="w-3 h-3" />
                  <span>Agendamento</span>
                </div>
              </div>
            </div> */}
          </div>

          {/* Footer Corporativo */}
          <div className="mt-6 text-center">
            <p className="text-sm text-white/80">
              Desenvolvido por <span className="font-semibold text-white">Gabriel Marques</span>
            </p>
            <p className="text-xs text-white/60 mt-1">
              Sistema Corporativo NMultiFibra • v2.0 • {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}