# Configuração da Base de Dados Supabase

## Problema de Conexão

O Prisma não consegue conectar diretamente ao Supabase devido a restrições de rede/firewall.

## Solução: Executar SQL Manualmente

### Passos:

1. **Acede ao Supabase Studio**
   - Vai a: https://bsgqfnxmmywozfqlxznp.supabase.co
   - Faz login

2. **Abre o SQL Editor**
   - No menu lateral, clica em "SQL Editor"
   - Clica em "New Query"

3. **Executa o Script**
   - Abre o ficheiro `prisma/supabase-migration.sql`
   - Copia todo o conteúdo
   - Cola no SQL Editor do Supabase
   - Clica em "Run" ou pressiona `Ctrl+Enter`

4. **Verifica as Tabelas**
   - Vai a "Table Editor" no menu lateral
   - Deves ver as tabelas:
     - User, Account, Session, VerificationToken (NextAuth)
     - Tournament, Team, Match (Torneios)

5. **Testa a Aplicação**
   - A aplicação já está a correr em `http://localhost:3000`
   - Faz login com a tua conta Google
   - Clica em "Torneios" no menu
   - Tenta criar um torneio!

## Connection String Atual

```
DATABASE_URL="postgresql://postgres:geyEyVG6fgqQ8m@db.bsgqfnxmmywozfqlxznp.supabase.co:5432/postgres?pgbouncer=true&connection_limit=1"
DIRECT_URL="postgresql://postgres:geyEyVG6fgqQ8m@db.bsgqfnxmmywozfqlxznp.supabase.co:5432/postgres"
```

## Próximos Passos

Depois de executar o SQL:
1. Reinicia o servidor de desenvolvimento (se necessário)
2. Testa criar um torneio
3. Verifica se os dados são guardados no Supabase
