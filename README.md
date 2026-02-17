# 📅 SistemAutoAgendamento

> Sistema fullstack para gerenciar automaticamente a criação de Ordens de Serviço e o fluxo de atendimentos do suporte técnico.

---

## 📋 Sobre o Projeto

O **SistemAutoAgendamento** é uma aplicação **fullstack** que combina um frontend moderno em **React** com um backend em **Python/Node.js**, formando uma solução completa para automação do processo de agendamento e criação de Ordens de Serviço (OS) no suporte técnico.

O sistema elimina o trabalho manual de agendar atendimentos e abrir OS, centralizando em uma interface visual intuitiva todo o fluxo que antes era feito de forma dispersa — seja por e-mail, planilhas ou sistemas externos. Integra-se à API do sistema de suporte para criar, consultar e gerenciar OS e atendimentos de forma automática.

---

## 🏗️ Arquitetura

O projeto é dividido em duas camadas bem definidas:

```
SistemAutoAgendamento/
│
├── Auto_AgendamentoREACT/         # 🎨 Frontend — Interface React
│
├── Auto_Agendamento_BACKEND/      # ⚙️  Backend — API e lógica de negócio
│
├── .gitignore
└── README.md
```

### Stack Tecnológica

| Camada | Tecnologia | Proporção |
|--------|-----------|-----------|
| Frontend | React + JavaScript + CSS | 88.1% |
| Backend | Python + Node.js | 11.9% |

---

## 🎨 Frontend — `Auto_AgendamentoREACT`

Interface web desenvolvida com **React**, responsável por toda a experiência do usuário. Permite:

- Visualizar a **agenda de atendimentos** disponíveis
- **Criar e agendar** novas Ordens de Serviço de forma guiada
- Consultar o **status de chamados** em andamento
- Gerenciar o **fluxo de atendimentos** da equipe de suporte
- Navegar por uma interface responsiva e amigável

### Estrutura típica do frontend

```
Auto_AgendamentoREACT/
│
├── public/                # Arquivos estáticos e index.html
├── src/
│   ├── components/        # Componentes reutilizáveis (calendário, formulários, cards)
│   ├── pages/             # Páginas da aplicação (Dashboard, Agendamento, OS)
│   ├── services/          # Comunicação com o backend (axios/fetch)
│   ├── hooks/             # Custom hooks de estado e lógica
│   └── App.js             # Componente raiz e configuração de rotas
├── package.json
└── .env                   # Variáveis de ambiente (URL da API)
```

---

## ⚙️ Backend — `Auto_Agendamento_BACKEND`

Camada de servidor responsável pela lógica de negócio, integração com a API do sistema de suporte e exposição de endpoints para o frontend. Desenvolvido em **Python** com suporte a scripts **Node.js** para tarefas auxiliares.

Responsabilidades:

- Receber as requisições do frontend e processá-las
- Comunicar-se com a **API do sistema de suporte** para criar e consultar OS
- Validar regras de negócio (horários disponíveis, conflitos de agenda, etc.)
- Gerenciar o estado dos agendamentos e atendimentos
- Expor uma **API REST** consumida pelo frontend React

### Estrutura típica do backend

```
Auto_Agendamento_BACKEND/
│
├── app.py / server.py     # Ponto de entrada da aplicação
├── routes/                # Definição dos endpoints da API REST
├── services/              # Lógica de integração com API externa do suporte
├── models/                # Modelos e estruturas de dados
├── config/                # Configurações de ambiente e conexões
└── requirements.txt       # Dependências Python
```

---

## 🔄 Fluxo do Sistema

```
Usuário
   │
   ▼
[Frontend React]  ──── HTTP/REST ────▶  [Backend Python]
   │                                          │
   │  • Exibe agenda disponível               │  • Valida disponibilidade
   │  • Formulário de agendamento             │  • Aplica regras de negócio
   │  • Listagem de OS abertas                │  • Cria OS na API externa
   │                                          │
   └──────────────────────────────────────────┘
                                              │
                                              ▼
                                    [API do Sistema de Suporte]
                                    • Criação de OS
                                    • Consulta de chamados
                                    • Atualização de status
```

---

## 🚀 Como Rodar o Projeto

### Pré-requisitos

- [Node.js](https://nodejs.org/) v16+
- [Python](https://www.python.org/) 3.8+
- `npm` ou `yarn`
- `pip`
- Credenciais de acesso à API do sistema de suporte

---

### ⚙️ Backend

```bash
# 1. Entre na pasta do backend
cd Auto_Agendamento_BACKEND

# 2. Crie e ative o ambiente virtual Python
python -m venv venv
source venv/bin/activate      # Linux/macOS
venv\Scripts\activate         # Windows

# 3. Instale as dependências
pip install -r requirements.txt

# 4. Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com suas credenciais

# 5. Inicie o servidor
python app.py
```

O backend estará disponível em: `http://localhost:5000`

---

### 🎨 Frontend

```bash
# 1. Entre na pasta do frontend
cd Auto_AgendamentoREACT

# 2. Instale as dependências
npm install

# 3. Configure a URL do backend no .env
echo "REACT_APP_API_URL=http://localhost:5000" > .env

# 4. Inicie o servidor de desenvolvimento
npm start
```

O frontend estará disponível em: `http://localhost:3000`

---

## 🔐 Variáveis de Ambiente

### Backend (`.env`)

```env
# API do sistema de suporte
API_BASE_URL=https://sua-api-de-suporte.com
API_TOKEN=seu_token_aqui

# Configurações do servidor
PORT=5000
DEBUG=True

```

### Frontend (`.env`)

```env
REACT_APP_API_URL=http://localhost:5000
```

> ⚠️ **Nunca** commite arquivos `.env` com credenciais reais. Certifique-se de que estão listados no `.gitignore`.

---

## 📦 Dependências Principais

### Frontend

| Pacote | Descrição |
|--------|-----------|
| `react` | Biblioteca principal de UI |
| `react-router-dom` | Gerenciamento de rotas SPA |
| `axios` | Requisições HTTP para o backend |
| `react-calendar`| Componente de calendário interativo |

### Backend

| Pacote | Descrição |
|--------|-----------|
| `flask` ou `fastapi` | Framework web para a API REST |
| `requests` | Requisições HTTP para a API de suporte |
| `python-dotenv` | Gerenciamento de variáveis de ambiente |
| `flask-cors` | Habilita CORS para comunicação com o React |

---

## 🛠️ Rodando em Produção

Para ambientes de produção, recomenda-se:

**Frontend:** Gerar o build otimizado e servir via Nginx ou Vercel

```bash
cd Auto_AgendamentoREACT
npm run build
# A pasta /build conterá os arquivos estáticos prontos para deploy
```

**Backend:** Utilizar Gunicorn + Nginx ou um serviço como Railway/Render

```bash
pip install gunicorn
gunicorn app:app --workers 4 --bind 0.0.0.0:5000
```

**Processo contínuo com PM2:**

```bash
npm install -g pm2

# Backend Python
pm2 start "python app.py" --name "autoagendamento-backend"

# Frontend (servidor de produção)
pm2 start "npm start" --name "autoagendamento-frontend" --cwd ./Auto_AgendamentoREACT
```

---

## 🌟 Diferenciais do Sistema

- **Arquitetura desacoplada** — Frontend e backend completamente separados, facilitando manutenção e escalabilidade
- **Automação completa** — Da interface ao sistema de suporte, sem intervenção manual
- **Validação inteligente** — O backend garante integridade das regras de negócio antes de criar OS
- **Interface moderna** — React oferece experiência fluida e responsiva para a equipe

---

## 👤 Autor

**Gabriel Marques**
- GitHub: [@GabrielMarques011](https://github.com/GabrielMarques011)

---

## 📄 Licença

Este projeto não possui uma licença definida. Entre em contato com o autor para mais informações sobre uso e distribuição.