/*
======================================================
Projeto Casamento — Luciana ❤ Thiago
Versão 0.3.0
======================================================
*/

/* -----------------------------------------------------
   1. BOTÃO "ABRIR CONVITE"
----------------------------------------------------- */
const openInvitation = document.getElementById("openInvitation");

if (openInvitation) {
  openInvitation.addEventListener("click", () => {
    openInvitation.innerHTML = "Preparando uma surpresa...";
    openInvitation.disabled = true;

    setTimeout(() => {
      document.getElementById("historia")?.scrollIntoView({ behavior: "smooth" });
      openInvitation.innerHTML = "Abrir Convite";
      openInvitation.disabled = false;
    }, 900);
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
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzxSTMEGI_psUt4G_fQ5Pr5B4i3EtU_E94Smc6eAyraEcm2jBn1K8wAo0EnYk0b96Ui/exec";

const rsvpForm = document.getElementById("rsvpForm");
const rsvpStatus = document.getElementById("rsvpStatus");
const rsvpSubmit = document.getElementById("rsvpSubmit");

if (rsvpForm) {
  rsvpForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (APPS_SCRIPT_URL.includes("https://script.google.com/macros/s/AKfycbzxSTMEGI_psUt4G_fQ5Pr5B4i3EtU_E94Smc6eAyraEcm2jBn1K8wAo0EnYk0b96Ui/exec")) {
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
