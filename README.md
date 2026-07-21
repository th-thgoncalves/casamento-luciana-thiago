# Projeto Casamento Luciana ❤️ Thiago
Versão 0.3.0

Site de convite de casamento em página única, com confirmação de presença (RSVP) integrada ao Google Sheets via Google Apps Script. Hospedado gratuitamente no GitHub Pages.

## Estrutura

```
casamento/
├── index.html
├── README.md
└── assets/
    ├── css/
    │   ├── variables.css
    │   ├── style.css
    │   ├── animations.css
    │   └── responsive.css
    ├── js/
    │   └── app.js
    ├── fotos/
    ├── musicas/
    ├── icones/
    └── fontes/
```

## Seções já implementadas (estrutura)
- [x] Bem-vindo (hero)
- [x] Nossa História (texto de exemplo — falta o conteúdo real)
- [x] Galeria (grid pronto — faltam as fotos)
- [x] Contagem Regressiva (funcional, calcula a partir de `data-wedding-date`)
- [x] Cerimônia (falta endereço/horário reais e link do mapa)
- [x] Recepção (falta endereço/horário reais e link do mapa)
- [x] Confirmação de Presença — RSVP (formulário funcional, falta conectar ao Apps Script)
- [x] Lista de Presentes (falta definir o formato: link externo, Pix, etc.)
- [x] Mensagens (estrutura pronta, conteúdo opcional)
- [x] Contato / Rodapé (falta telefone/e-mail)

## Pendências para colocar no ar
1. Substituir os textos entre colchetes `[ ]` pelo conteúdo real.
2. Adicionar as fotos em `assets/fotos/` e trocar os `.foto-placeholder` por `<img>`.
3. Criar o Google Apps Script, publicá-lo como Web App e colar a URL em `APPS_SCRIPT_URL` no `app.js`.
4. Criar a planilha do Google Sheets com as abas Dashboard, Convidados, Respostas e Pendentes.
5. Testar em celular (Android/iPhone) e revisar antes de publicar no GitHub Pages.
