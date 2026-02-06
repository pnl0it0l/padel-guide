# 🎾 Guia de Teste - Feature de Torneios

## ✅ Pré-requisitos Completos

- [x] Base de dados Supabase configurada
- [x] Tabelas criadas (User, Account, Session, Tournament, Team, Match)
- [x] NextAuth configurado com Prisma Adapter
- [x] API routes criadas
- [x] UI components criados
- [x] Navegação adicionada ao header

## 🧪 Testes a Realizar

### 1. Acesso à Página de Torneios

1. Abre o browser e vai a `http://localhost:3000`
2. **Faz login** com a tua conta Google (se ainda não estiveres autenticado)
3. Clica em **"Torneios"** no menu de navegação
4. Deves ver a página de torneios com:
   - Header com "Padel Guide" e botão "Criar Torneio"
   - Filtros: Todos, Rascunhos, Ativos, Concluídos
   - Mensagem "Nenhum torneio encontrado" (se for a primeira vez)

### 2. Criar um Torneio Simples (2 equipas)

1. Clica em **"+ Criar Torneio"**
2. **Passo 1 - Informação Básica:**
   - Nome: "Torneio Teste"
   - Data: Escolhe uma data
   - Campos: 1
   - Clica "Continuar"

3. **Passo 2 - Formato:**
   - Seleciona "Playoff Direto"
   - Formato dos Jogos: "Melhor de 3"
   - Clica "Continuar"

4. **Passo 3 - Equipas:**
   - Equipa 1:
     - Jogador 1: "João Silva"
     - Jogador 2: "Maria Santos"
     - Nome da Equipa: "Equipa A" (opcional)
   - Equipa 2:
     - Jogador 1: "Pedro Costa"
     - Jogador 2: "Ana Ferreira"
     - Nome da Equipa: "Equipa B" (opcional)
   - Clica "Continuar"

5. **Passo 4 - Rever:**
   - Confirma todos os dados
   - Clica "🎾 Criar Torneio"

6. **Resultado Esperado:**
   - Deves ser redirecionado para a página de detalhes do torneio
   - Vês as 2 equipas
   - Vês 1 jogo criado (Equipa A vs Equipa B)

### 3. Criar um Torneio com 4 Equipas (Grupos)

1. Volta à página de torneios
2. Clica em "Criar Torneio"
3. **Passo 1:**
   - Nome: "Torneio de Verão 2026"
   - Data: Escolhe uma data
   - Campos: 2

4. **Passo 2:**
   - Seleciona "Grupos + Playoff"
   - Número de Grupos: 2
   - Formato: "Pro-Set"

5. **Passo 3:**
   - Adiciona 4 equipas (usa o botão "+ Adicionar Equipa")
   - Preenche os nomes dos jogadores

6. **Passo 4:**
   - Confirma e cria

7. **Resultado Esperado:**
   - 4 equipas divididas em 2 grupos
   - Jogos de fase de grupos criados
   - Status: "Ativo"

### 4. Testar Formato Por Tempo

1. Cria um novo torneio
2. No Passo 2, seleciona:
   - Formato dos Jogos: "Por Tempo"
   - Duração: 20 minutos
3. Completa o resto normalmente
4. **Resultado Esperado:**
   - Torneio criado com formato "Por Tempo (20min)"

### 5. Ver Detalhes do Torneio

1. Na lista de torneios, clica num torneio
2. **Deves ver:**
   - Nome e data do torneio
   - Cards com: Status, Equipas, Jogos, Formato
   - Tabs: "Jogos" e "Classificação"
   - Lista de jogos com equipas

3. **Tab Jogos:**
   - Vê os jogos organizados por ronda/grupo
   - Cada jogo mostra as equipas
   - Botão "Inserir Resultado" (se ainda não concluído)

4. **Tab Classificação:**
   - Lista de equipas
   - Vitórias e derrotas
   - Pontos

### 6. Inserir Resultado (Modal)

1. Num jogo pendente, clica "Inserir Resultado"
2. **Deves ver:**
   - Modal com os nomes das equipas
   - Campos para inserir sets ganhos
   - Botões "Cancelar" e "Guardar"

**Nota:** A funcionalidade de guardar resultados ainda precisa ser implementada completamente.

## 🐛 Possíveis Erros e Soluções

### Erro: "Unauthorized" ou "User not found"
- **Causa:** Não estás autenticado ou o user não existe na BD
- **Solução:** Faz logout e login novamente

### Erro: "Failed to fetch tournaments"
- **Causa:** Problema de conexão com a BD
- **Solução:** Verifica se o `.env` tem a DATABASE_URL correta

### Erro: Página em branco
- **Causa:** Erro de JavaScript no browser
- **Solução:** Abre as Developer Tools (F12) e vê a consola

### Erro: "PrismaClientInitializationError"
- **Causa:** Prisma Client não foi gerado ou BD não está acessível
- **Solução:** 
  1. Executa `pnpm prisma generate`
  2. Verifica a connection string

## 📸 Screenshots Recomendados

Tira screenshots de:
1. ✅ Página de lista de torneios (vazia)
2. ✅ Wizard de criação - Passo 1
3. ✅ Wizard de criação - Passo 2
4. ✅ Wizard de criação - Passo 3
5. ✅ Wizard de criação - Passo 4 (review)
6. ✅ Página de detalhes do torneio
7. ✅ Tab de classificação
8. ✅ Modal de inserir resultado

## ✨ Funcionalidades Implementadas

- ✅ Autenticação com Google (NextAuth + Prisma)
- ✅ Criar torneios com configuração personalizada
- ✅ Suporte para 2+ equipas
- ✅ Formatos: Playoff Direto e Grupos + Playoff
- ✅ Formatos de jogo: Melhor de 3, Pro-Set, Por Tempo
- ✅ Geração automática de jogos
- ✅ Alocação de campos
- ✅ Visualização de torneios
- ✅ Filtros por status
- ✅ Página de detalhes com jogos e classificação
- ⏳ Inserir resultados (UI pronta, backend precisa ser conectado)

## 🚀 Próximos Passos (Se Necessário)

1. Implementar a funcionalidade completa de inserir resultados
2. Adicionar edição de torneios
3. Adicionar eliminação de torneios
4. Melhorar a visualização de brackets (árvore de playoffs)
5. Adicionar estatísticas e gráficos
6. Notificações em tempo real
7. Exportar resultados para PDF

## 💡 Dicas

- Usa dados realistas nos testes
- Testa com diferentes números de equipas (2, 4, 8, 16)
- Testa os diferentes formatos
- Verifica se os jogos são criados corretamente
- Confirma que os dados são guardados no Supabase (vai ao Table Editor)

---

**Boa sorte com os testes! 🎾**
