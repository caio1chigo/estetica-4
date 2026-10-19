(() => {
  "use strict";

  /* CONFIGURAÇÃO: número do WhatsApp com código do país e DDD, só dígitos. Ex.: 5561999999999 */
  const WHATSAPP = "";
  const MESSAGE = "Olá! Gostaria de agendar uma avaliação com a Dra. Fizzame Sá.";

  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const hasWhats = /^\d{10,15}$/.test(WHATSAPP);
  const whatsUrl = text => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;

  /* loading de apresentação: o contador é visual, não mede o carregamento real */
  const loader = $("#loader");
  function runLoader(done) {
    if (!loader || reduce || !document.documentElement.classList.contains("js")) { loader?.remove(); done(); return; }
    const fill = $("#loader-fill"), count = $("#loader-count");
    const duration = 1800, t0 = performance.now();
    let finished = false;
    function end() {
      if (finished) return; finished = true;
      loader.classList.add("done");
      setTimeout(() => loader.remove(), 800);
      done();
    }
    (function step(now) {
      const p = Math.min((now - t0) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const value = Math.round(eased * 100);
      fill.style.transform = `scaleX(${eased})`;
      count.textContent = value;
      if (p < 1) requestAnimationFrame(step); else setTimeout(end, 280);
    })(t0);
    setTimeout(end, 4500);
  }

  /* entrada suave ao rolar, executada uma vez */
  function initReveal() {
    const items = $$(".reveal");
    if (reduce || !("IntersectionObserver" in window)) { items.forEach(i => i.classList.add("in")); return; }
    items.forEach(el => {
      const siblings = [...el.parentElement.children].filter(c => c.classList.contains("reveal"));
      el.style.setProperty("--d", Math.min(siblings.indexOf(el), 5) * 90 + "ms");
    });
    const io = new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    }), { threshold: .12, rootMargin: "0px 0px -30px 0px" });
    items.forEach(i => io.observe(i));
  }

  /* cabeçalho e menu */
  const header = $(".header");
  const onScroll = () => header?.classList.toggle("scrolled", scrollY > 20);
  addEventListener("scroll", onScroll, { passive: true }); onScroll();

  const btn = $("#menu-btn"), menu = $("#menu");
  function setMenu(open) {
    menu.classList.toggle("open", open);
    btn.classList.toggle("open", open);
    btn.setAttribute("aria-expanded", String(open));
    btn.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  }
  btn?.addEventListener("click", () => setMenu(!menu.classList.contains("open")));
  $$("a", menu).forEach(a => a.addEventListener("click", () => setMenu(false)));
  addEventListener("keydown", e => { if (e.key === "Escape") setMenu(false); });
  addEventListener("resize", () => { if (innerWidth > 820) setMenu(false); });
/* Botão de voltar ao topo */
const topButton = document.querySelector("#back-to-top");

if (topButton) {
  function updateTop() {
    topButton.classList.toggle("visible", window.scrollY > 500);
  }

  window.addEventListener("scroll", updateTop, { passive: true });

  // Define o estado inicial, inclusive ao recarregar a página.
  updateTop();

  topButton.addEventListener("click", (event) => {
    event.preventDefault();

    window.scrollTo({
      top: 0,
      behavior: reduce ? "instant" : "smooth"
    });
  });
}
  /* botões de agendamento: usam WhatsApp quando o número estiver configurado */
  if (hasWhats) $$("[data-cta]").forEach(a => { a.href = whatsUrl(MESSAGE); a.target = "_blank"; a.rel = "noopener noreferrer"; });

  /* comparador antes/depois (só inicia se o bloco estiver ativo no HTML) */
  $$(".compare").forEach(box => {
    const range = $(".compare-range", box);
    const set = v => box.style.setProperty("--pos", v + "%");
    range?.addEventListener("input", () => set(range.value));
    set(range?.value || 50);
  });

  /* formulário */
  const form = $("#form"), note = $("#form-note");
  form?.addEventListener("submit", e => {
    e.preventDefault();
    const data = new FormData(form);
    const nome = String(data.get("nome") || "").trim();
    const tel = String(data.get("telefone") || "").trim();
    const msg = String(data.get("mensagem") || "").trim();
    if (!nome || !tel) { note.textContent = "Preencha nome e WhatsApp para continuar."; return; }
    if (hasWhats) {
      const text = `${MESSAGE}\n\nNome: ${nome}\nWhatsApp: ${tel}` + (msg ? `\nMensagem: ${msg}` : "");
      window.open(whatsUrl(text), "_blank", "noopener");
      note.textContent = "Abrindo o WhatsApp.";
    } else {
      note.textContent = "Demonstração: nenhum dado foi enviado ou armazenado.";
    }
  });

  const year = $("#year"); if (year) year.textContent = new Date().getFullYear();

  initReveal();
  runLoader(() => {});
})();
const topButton=document.querySelector("#back-to-top");
function updateTop(){topButton.classList.toggle("visible",window.scrollY>500);}