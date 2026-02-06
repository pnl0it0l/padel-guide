# Configuração Google AdSense - Padel Guide

## Passos para ativar AdSense:

### 1. Criar conta AdSense

- Vai a https://www.google.com/adsense
- Faz login com conta Google
- Adiciona domínio: padel-guide.vercel.app

### 2. Obter o código do publisher

Após aprovação, vais receber um código tipo: `ca-pub-1234567890123456`

### 3. Atualizar o código no site

**Ficheiro: app/layout.tsx**
Linha 80: Substitui `ca-pub-XXXXXXXXXXXXXXXX` pelo teu código real

**Ficheiro: components/AdBanner.tsx**
Linha 23: Substitui `ca-pub-XXXXXXXXXXXXXXXX` pelo teu código real

### 4. Obter Ad Slot IDs

Depois de aprovado, cria 2 unidades de anúncio no AdSense:

- 1 banner horizontal (topo): vai dar um ID tipo `1234567890`
- 1 banner horizontal (bottom): vai dar outro ID tipo `0987654321`

**Ficheiro: app/page.tsx**

- Linha 90: Substitui `dataAdSlot="1234567890"` pelo ID real do banner topo
- Linha 136: Substitui `dataAdSlot="0987654321"` pelo ID real do banner bottom

### 5. Fazer deploy

```bash
git add .
git commit -m "Update AdSense IDs"
git push
vercel --prod
```

### 6. Aguardar aprovação

- Google demora 1-2 semanas
- Precisas de ter conteúdo original
- Tráfego mínimo recomendado: 100 visitas/dia

## Localização dos anúncios:

✅ Banner horizontal após as notícias (antes dos links)
✅ Banner horizontal antes do footer (depois dos links)

## Nota importante:

Os anúncios só aparecem depois do site ser aprovado pelo Google AdSense!
Até lá, os espaços ficam vazios (é normal).
