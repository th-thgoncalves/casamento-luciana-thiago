/*
======================================================
Projeto Casamento — Luciana ❤ Thiago
Versão 0.4.0
======================================================
*/

/* -----------------------------------------------------
   1. BOTÃO "ABRIR CONVITE" + MÚSICA DE FUNDO
----------------------------------------------------- */
const openInvitation = document.getElementById("openInvitation");
const bgMusic = document.getElementById("bgMusic");
const musicToggle = document.getElementById("musicToggle");

function tocarMusica() {
  if (!bgMusic) return;
  if (!bgMusic.dataset.pulou) {
    bgMusic.currentTime = 10; // pula o início silencioso da faixa
    bgMusic.dataset.pulou = "1";
  }
  bgMusic.play()
    .then(() => {
      musicToggle?.classList.add("is-playing");
      if (musicToggle) musicToggle.textContent = "🔊";
    })
    .catch(() => {
      // Se o navegador bloquear (ou o arquivo ainda não existir), fica silencioso sem quebrar o site.
    });
}

if (openInvitation) {
  openInvitation.addEventListener("click", () => {
    openInvitation.innerHTML = "Preparando uma surpresa...";
    openInvitation.disabled = true;
    tocarMusica();

    setTimeout(() => {
      document.getElementById("historia")?.scrollIntoView({ behavior: "smooth" });
      openInvitation.innerHTML = "Abrir Convite";
      openInvitation.disabled = false;
    }, 900);
  });
}

if (musicToggle && bgMusic) {
  musicToggle.addEventListener("click", () => {
    if (bgMusic.paused) {
      tocarMusica();
    } else {
      bgMusic.pause();
      musicToggle.classList.remove("is-playing");
      musicToggle.textContent = "🔇";
    }
  });
}

/* -----------------------------------------------------
   2. CONTAGEM REGRESSIVA
----------------------------------------------------- */
function iniciarContagem() {
  const container = document.getElementById("countdown");
  if (!container) return;

  const dataAlvo = new Date(container.dataset.weddingDate).getTime();
  const elDias = document.getElementById("cd-dias");
  const elHoras = document.getElementById("cd-horas");
  const elMin = document.getElementById("cd-min");
  const elSeg = document.getElementById("cd-seg");

  function atualizar() {
    const agora = Date.now();
    const diff = dataAlvo - agora;

    if (diff <= 0) {
      [elDias, elHoras, elMin, elSeg].forEach(el => el.textContent = "00");
      clearInterval(timer);
      return;
    }

    const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
    const horas = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const min = Math.floor((diff / (1000 * 60)) % 60);
    const seg = Math.floor((diff / 1000) % 60);

    elDias.textContent = String(dias).padStart(2, "0");
    elHoras.textContent = String(horas).padStart(2, "0");
    elMin.textContent = String(min).padStart(2, "0");
    elSeg.textContent = String(seg).padStart(2, "0");
  }

  atualizar();
  const timer = setInterval(atualizar, 1000);
}
iniciarContagem();

/* -----------------------------------------------------
   3. ANIMAÇÃO AO ROLAR (reveal on scroll)
----------------------------------------------------- */
const revealEls = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window && revealEls.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealEls.forEach(el => observer.observe(el));
} else {
  revealEls.forEach(el => el.classList.add("is-visible"));
}

/* -----------------------------------------------------
   4. FORMULÁRIO DE CONFIRMAÇÃO (RSVP) → GOOGLE APPS SCRIPT
----------------------------------------------------- */

// IMPORTANTE: troque pela URL gerada ao publicar o Google Apps Script como
// "Aplicativo da Web" (Implantar > Nova implantação > Aplicativo da Web).
// Ela termina em "/exec".
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz2NI7Isd95k2y5_-vxr67eRlAqr4WeG50n1EAFBU29iMyjgvbGBJ0MoxM1VNVABeaT/exec";

const rsvpForm = document.getElementById("rsvpForm");
const rsvpStatus = document.getElementById("rsvpStatus");
const rsvpSubmit = document.getElementById("rsvpSubmit");

if (rsvpForm) {
  rsvpForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (APPS_SCRIPT_URL.includes("COLE_AQUI")) {
      rsvpStatus.textContent = "Formulário ainda não conectado à planilha (configure o APPS_SCRIPT_URL em app.js).";
      rsvpStatus.dataset.state = "error";
      return;
    }

    const dados = new FormData(rsvpForm);
    rsvpSubmit.disabled = true;
    rsvpSubmit.textContent = "Enviando...";
    rsvpStatus.textContent = "";
    rsvpStatus.dataset.state = "";

    try {
      // O Apps Script implantado como Web App não retorna cabeçalhos CORS
      // legíveis para 'fetch' comum, por isso usamos no-cors: o envio
      // funciona, mas não conseguimos ler a resposta de volta.
      await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        body: dados,
      });

      rsvpForm.reset();
      rsvpStatus.textContent = "Presença confirmada! Muito obrigado 💛";
      rsvpStatus.dataset.state = "success";
    } catch (erro) {
      console.error(erro);
      rsvpStatus.textContent = "Não foi possível enviar agora. Tente novamente em instantes.";
      rsvpStatus.dataset.state = "error";
    } finally {
      rsvpSubmit.disabled = false;
      rsvpSubmit.textContent = "Confirmar Presença";
    }
  });
}

/* -----------------------------------------------------
   5. MENSAGENS PARA OS NOIVOS → GOOGLE APPS SCRIPT
----------------------------------------------------- */
const mensagemForm = document.getElementById("mensagemForm");
const mensagemStatus = document.getElementById("mensagemStatus");
const mensagemSubmit = document.getElementById("mensagemSubmit");
const mensagensLista = document.getElementById("mensagensLista");
const mensagensVazio = document.getElementById("mensagensVazio");

function renderizarMensagens(lista) {
  if (!mensagensLista) return;

  // Remove itens antigos (menos o aviso de "lista vazia")
  [...mensagensLista.querySelectorAll(".mensagem-item")].forEach(el => el.remove());

  if (!lista || lista.length === 0) {
    if (mensagensVazio) mensagensVazio.style.display = "block";
    return;
  }

  if (mensagensVazio) mensagensVazio.style.display = "none";

  lista.forEach(item => {
    const p = document.createElement("p");
    p.className = "mensagem-item";
    const nome = document.createElement("strong");
    nome.textContent = item.nome + ": ";
    p.appendChild(nome);
    p.appendChild(document.createTextNode(item.mensagem));
    mensagensLista.prepend(p);
  });
}

async function carregarMensagens() {
  if (!mensagensLista || APPS_SCRIPT_URL.includes("COLE_AQUI")) return;
  try {
    const resposta = await fetch(`${APPS_SCRIPT_URL}?acao=mensagens`);
    const dados = await resposta.json();
    renderizarMensagens(dados.mensagens || []);
  } catch (erro) {
    // Se não conseguir carregar (ex: CORS bloqueado), mantém o estado atual sem quebrar a página.
    console.error("Não foi possível carregar as mensagens:", erro);
  }
}
carregarMensagens();

if (mensagemForm) {
  mensagemForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const dados = new FormData(mensagemForm);
    mensagemSubmit.disabled = true;
    mensagemSubmit.textContent = "Enviando...";
    mensagemStatus.textContent = "";
    mensagemStatus.dataset.state = "";

    try {
      await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        body: dados,
      });

      // Mostra a mensagem na hora, sem esperar recarregar (o no-cors não deixa confirmar o envio)
      renderizarMensagens([
        { nome: dados.get("nome"), mensagem: dados.get("mensagem") },
        ...[...mensagensLista.querySelectorAll(".mensagem-item")].map(el => ({
          nome: el.querySelector("strong").textContent.replace(": ", ""),
          mensagem: el.textContent.replace(el.querySelector("strong").textContent, "")
        }))
      ]);

      mensagemForm.reset();
      mensagemStatus.textContent = "Mensagem enviada! Obrigado 💛";
      mensagemStatus.dataset.state = "success";
    } catch (erro) {
      console.error(erro);
      mensagemStatus.textContent = "Não foi possível enviar agora. Tente novamente em instantes.";
      mensagemStatus.dataset.state = "error";
    } finally {
      mensagemSubmit.disabled = false;
      mensagemSubmit.textContent = "Enviar Mensagem";
    }
  });
}
