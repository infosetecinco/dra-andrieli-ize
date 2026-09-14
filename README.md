# Site — Dra. Andrieli Ize (Clínica Renove, Primavera do Leste — MT)

Página institucional estática em HTML, CSS e JavaScript puros (sem build, sem dependências).

## Como executar

Os arquivos usam módulos ES (`<script type="module">`), então precisam ser servidos por HTTP.
Qualquer servidor estático funciona:

```bash
# Python
python -m http.server 8080
# ou Node
npx serve .
```

Abra `http://localhost:8080`.

## Onde editar

| O quê | Onde |
|---|---|
| WhatsApp, Instagram, telefone | `js/config.js` → `contact` |
| Endereço, horários, link/embed do Google Maps | `js/config.js` → `location` |
| Formação, registro, áreas de atuação | `js/config.js` → `professional` |
| Fotos (retrato, atendimento, procedimentos) | coloque os arquivos em `assets/` e aponte em `js/config.js` → `images` |
| Procedimentos, FAQ, mensagens do WhatsApp | `js/config.js` → `procedures`, `faq`, `messages` |
| Avaliações verificadas + link do Google | `js/config.js` → `reviews` |
| Frase sobre PMMA / apelido "Dra. Bumbum" | `js/config.js` → `flags` |
| Política de Privacidade | `js/config.js` → `legal.privacyPolicyUrl` |
| Textos fixos das seções (hero, sobre, etapas, diferenciais, chamada final) | `index.html` |
| Cores, tipografia, espaçamentos | `css/styles.css` (tokens em `:root`) |
| Título/descrição SEO, Open Graph, robots | `<head>` de `index.html` |

Campos vazios são ocultados automaticamente (sem espaços em branco nem textos "[inserir]").

## Comportamentos automáticos

- **WhatsApp não configurado** → todos os CTAs ficam desativados (sem link fictício) e um aviso de prévia aparece no topo.
- **Avaliações vazias** → a seção e o item "Avaliações" do menu são removidos.
- **Sem embed do mapa** → o bloco do mapa é removido; o botão "Abrir rota" só aparece com `mapsUrl`.
- **Sem foto** → placeholder editorial abstrato com a legenda "Fotografia em breve".
- **PMMA** → a frase só aparece com `flags.pmmaStatementConfirmed = true`.

## Antes de publicar

1. Preencher `contact.whatsappNumber` (somente dígitos, com país e DDD — ex.: `5566999999999`).
2. Trocar `<meta name="robots" content="noindex, nofollow">` por `index, follow` em `index.html`.
3. Informar URL absoluta de `og:image` (e substituir o SVG por imagem 1200×630 real).
4. Substituir as imagens placeholder por fotos reais e revisar os textos alternativos.
5. Ver a lista de pendências em `PENDENCIAS.md`.
