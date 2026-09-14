import { SITE_CONFIG as cfg } from "./config.js";

/* ============================================================
   Utilidades
   ============================================================ */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const hasText = (v) => typeof v === "string" && v.trim().length > 0;
const hasItems = (v) => Array.isArray(v) && v.length > 0;

/** Cria um elemento com atributos e filhos (texto ou nós). */
function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  Object.entries(attrs).forEach(([key, value]) => {
    if (value === null || value === undefined || value === false) return;
    if (key === "class") node.className = value;
    else if (key === "text") node.textContent = value;
    else node.setAttribute(key, value === true ? "" : String(value));
  });
  (Array.isArray(children) ? children : [children]).forEach((child) => {
    if (child === null || child === undefined) return;
    node.append(typeof child === "string" ? document.createTextNode(child) : child);
  });
  return node;
}

/* ============================================================
   WhatsApp — única fonte do número e das mensagens
   ============================================================ */
const WA_NUMBER = String(cfg.contact.whatsappNumber || "").replace(/\D/g, "");
const isWhatsappConfigured = WA_NUMBER.length >= 10;

/**
 * Monta o link do WhatsApp com a mensagem codificada.
 * @param {string} message
 * @returns {string|null} null quando o número não está configurado
 */
export function buildWhatsappLink(message) {
  if (!isWhatsappConfigured) return null;
  const text = encodeURIComponent(message);
  return `https://wa.me/${WA_NUMBER}?text=${text}`;
}

/** Mensagem por contexto: "general" | "faq" | "procedure:<nome>". */
function messageFor(kind) {
  if (kind.startsWith("procedure:")) {
    const name = kind.slice("procedure:".length);
    return cfg.messages.procedure.replace("{procedimento}", name);
  }
  return cfg.messages[kind] || cfg.messages.general;
}

/** Aplica o link (ou o estado "indisponível") em um CTA. */
function applyWhatsappCta(anchor, kind) {
  const href = buildWhatsappLink(messageFor(kind));
  if (href) {
    anchor.href = href;
    anchor.target = "_blank";
    anchor.rel = "noopener";
    anchor.classList.remove("is-unavailable");
    anchor.removeAttribute("aria-disabled");
    return;
  }
  anchor.removeAttribute("href");
  anchor.classList.add("is-unavailable");
  anchor.setAttribute("aria-disabled", "true");
  anchor.setAttribute("role", "link");
  anchor.setAttribute("tabindex", "0");
  anchor.title = "WhatsApp em configuração";
}

function setupWhatsappCtas() {
  $$("[data-wa]").forEach((a) => applyWhatsappCta(a, a.dataset.wa));
  const notice = $("#preview-notice");
  if (notice) notice.hidden = isWhatsappConfigured;
}

/* ============================================================
   Barra informativa
   ============================================================ */
function renderTopbar() {
  $("#topbar-city").textContent = `${cfg.brand.city} — ${cfg.brand.state}`;

  const hours = $("#topbar-hours");
  if (hasItems(cfg.location.hours)) {
    hours.textContent = cfg.location.hours[0];
    hours.hidden = false;
  }

  const ig = $("#topbar-instagram");
  if (hasText(cfg.contact.instagramUrl)) {
    ig.href = cfg.contact.instagramUrl;
    ig.textContent = hasText(cfg.contact.instagramHandle) ? cfg.contact.instagramHandle : "Instagram";
    ig.hidden = false;
  }
}

/* ============================================================
   Menu mobile
   ============================================================ */
function setupMenu() {
  const nav = $("#nav");
  const toggle = $("#nav-toggle");
  const close = $("#nav-close");
  const backdrop = $("#nav-backdrop");
  const mq = window.matchMedia("(max-width: 1023px)");
  let lastFocus = null;

  const setOpen = (open) => {
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    backdrop.hidden = !open;
    document.body.style.overflow = open ? "hidden" : "";
    if (open) {
      lastFocus = document.activeElement;
      close.focus();
    } else if (lastFocus) {
      lastFocus.focus();
    }
  };

  toggle.addEventListener("click", () => setOpen(!nav.classList.contains("is-open")));
  close.addEventListener("click", () => setOpen(false));
  backdrop.addEventListener("click", () => setOpen(false));
  $$(".nav__link, .nav__cta", nav).forEach((link) => link.addEventListener("click", () => {
    if (mq.matches) setOpen(false);
  }));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("is-open")) setOpen(false);
  });
  mq.addEventListener("change", (e) => { if (!e.matches) setOpen(false); });

  // Trap simples de foco dentro do painel enquanto aberto.
  nav.addEventListener("keydown", (e) => {
    if (e.key !== "Tab" || !nav.classList.contains("is-open")) return;
    const focusables = $$("button, a[href]", nav).filter((n) => !n.hidden);
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
}

/* ============================================================
   Imagens (foto real ou placeholder editorial)
   ============================================================ */
function renderPhoto(figure, image, { eager = false } = {}) {
  if (!figure) return;
  if (image && hasText(image.src)) {
    figure.append(el("img", {
      src: image.src,
      alt: image.alt || "",
      width: image.width,
      height: image.height,
      loading: eager ? "eager" : "lazy",
      fetchpriority: eager ? "high" : null,
      decoding: "async",
    }));
    return;
  }
  figure.classList.add("photo--placeholder");
  figure.setAttribute("role", "img");
  figure.setAttribute("aria-label", "Imagem provisória — substituir por fotografia real");
  figure.append(el("p", { class: "photo__caption", text: "Fotografia em breve", "aria-hidden": "true" }));
}

/* ============================================================
   Sobre — identificação profissional
   ============================================================ */
function renderCredentials() {
  const { education, registration, areas } = cfg.professional;
  const fill = (id, value) => {
    const item = $(id);
    if (!hasText(value)) return false;
    $("dd", item).textContent = value;
    item.hidden = false;
    return true;
  };
  const any = [
    fill("#cred-education", education),
    fill("#cred-registration", registration),
    fill("#cred-areas", hasItems(areas) ? areas.join(" · ") : ""),
  ].some(Boolean);
  $("#credentials").hidden = !any;

  const footerReg = $("#footer-registration");
  if (hasText(registration)) { footerReg.textContent = registration; footerReg.hidden = false; }
}

/* ============================================================
   Procedimentos
   ============================================================ */
function renderProcedures() {
  const grid = $("#procedures-grid");
  const fragment = document.createDocumentFragment();

  cfg.procedures.forEach((proc) => {
    const image = cfg.images.procedures[proc.id];
    const media = el("div", { class: "card__media" });
    if (image && hasText(image.src)) {
      media.append(el("img", { src: image.src, alt: image.alt || "", width: image.width, height: image.height, loading: "lazy", decoding: "async" }));
    } else {
      media.classList.add("card__media--placeholder");
      media.setAttribute("aria-hidden", "true");
    }

    const title = el("h3", { class: "card__title", text: proc.name });
    if (cfg.flags.showBumbumAlias && hasText(proc.alias)) {
      title.append(el("span", { class: "card__alias", text: `Também conhecido como “${proc.alias}”` }));
    }

    const cta = el("a", { class: "card__cta" }, [
      "Tirar dúvidas pelo WhatsApp",
      el("span", { "aria-hidden": "true", text: "→" }),
    ]);
    cta.setAttribute("aria-label", `Tirar dúvidas sobre ${proc.name} pelo WhatsApp`);
    applyWhatsappCta(cta, `procedure:${proc.name}`);

    fragment.append(el("li", { class: "card", id: `proc-${proc.id}` }, [
      media,
      el("div", { class: "card__body" }, [title, el("p", { class: "card__text", text: proc.description }), cta]),
    ]));
  });

  grid.replaceChildren(fragment);
}

/* ============================================================
   Diferenciais — nota sobre PMMA (somente com confirmação)
   ============================================================ */
function renderPmmaNote() {
  $("#pmma-note").hidden = cfg.flags.pmmaStatementConfirmed !== true;
}

/* ============================================================
   Avaliações — oculta enquanto não houver dados verificados
   ============================================================ */
function renderReviews() {
  const section = $("#depoimentos");
  const navItem = $('[data-section="depoimentos"]');
  const ready = hasItems(cfg.reviews.items) && hasText(cfg.reviews.googleUrl);

  if (!ready) {
    section.remove();
    navItem?.remove();
    return;
  }

  const grid = $("#reviews-grid");
  const fragment = document.createDocumentFragment();
  cfg.reviews.items.slice(0, 3).forEach((review) => {
    const meta = el("p", { class: "review__meta" }, [el("strong", { text: review.author })]);
    if (hasText(review.date)) meta.append(` · ${review.date}`);
    if (hasText(review.source)) meta.append(` · ${review.source}`);
    if (hasText(review.url)) {
      meta.append(" · ", el("a", { href: review.url, target: "_blank", rel: "noopener", text: "ver avaliação" }));
    }
    fragment.append(el("li", { class: "review" }, [
      el("blockquote", { class: "review__text", text: review.text }),
      meta,
    ]));
  });
  grid.replaceChildren(fragment);
  $("#reviews-link").href = cfg.reviews.googleUrl;
  section.hidden = false;
}

/* ============================================================
   FAQ — acordeão acessível
   ============================================================ */
function renderFaq() {
  const list = $("#faq-list");
  const fragment = document.createDocumentFragment();

  cfg.faq.forEach((item, index) => {
    const panelId = `faq-panel-${index}`;
    const triggerId = `faq-trigger-${index}`;
    const trigger = el("button", {
      class: "accordion__trigger",
      type: "button",
      id: triggerId,
      "aria-expanded": "false",
      "aria-controls": panelId,
    }, [
      el("span", { text: item.question }),
      el("span", { class: "accordion__icon", "aria-hidden": "true" }, [
        el("span", { text: "+" }),
      ]),
    ]);
    const panel = el("div", { class: "accordion__panel", id: panelId, role: "region", "aria-labelledby": triggerId, hidden: true }, [
      el("p", { text: item.answer }),
    ]);

    trigger.addEventListener("click", () => {
      const open = trigger.getAttribute("aria-expanded") === "true";
      trigger.setAttribute("aria-expanded", String(!open));
      panel.hidden = open;
    });

    fragment.append(el("div", { class: "accordion__item" }, [
      el("h3", { class: "accordion__heading", style: "margin:0;font:inherit;" }, trigger),
      panel,
    ]));
  });

  list.replaceChildren(fragment);
}

/* ============================================================
   Localização + mapa sob demanda
   ============================================================ */
function renderLocation() {
  const { addressLine, addressComplement, hours, mapsUrl, mapsEmbedUrl, accessNotes } = cfg.location;
  const { phoneDisplay, instagramUrl, instagramHandle } = cfg.contact;

  const fill = (id, content) => {
    const item = $(id);
    const dd = $("dd", item);
    if (typeof content === "string") {
      if (!hasText(content)) return false;
      dd.textContent = content;
    } else {
      dd.replaceChildren(content);
    }
    item.hidden = false;
    return true;
  };

  const address = [addressLine, addressComplement].filter(hasText).join(", ");
  const hasAddress = fill("#loc-address", address);
  $("#loc-city").textContent = `${cfg.brand.city} — ${cfg.brand.state}`;
  fill("#loc-phone", phoneDisplay);

  const hasHours = hasItems(hours);
  if (hasHours) {
    fill("#loc-hours", el("ul", { class: "info-list__lines", style: "list-style:none;" }, hours.map((h) => el("li", { text: h }))));
  }
  if (hasText(instagramUrl)) {
    fill("#loc-instagram", el("a", { href: instagramUrl, target: "_blank", rel: "noopener", text: hasText(instagramHandle) ? instagramHandle : "Instagram" }));
  }
  if (hasItems(accessNotes)) {
    fill("#loc-access", el("ul", { style: "list-style:none;" }, accessNotes.map((n) => el("li", { text: n }))));
  }

  $("#loc-pending").hidden = hasAddress || hasHours;

  const route = $("#route-link");
  if (hasText(mapsUrl)) { route.href = mapsUrl; route.hidden = false; }

  const mapWrap = $("#map-wrap");
  if (hasText(mapsEmbedUrl)) {
    mapWrap.hidden = false;
    $("#map-address").textContent = [address, `${cfg.brand.city} — ${cfg.brand.state}`].filter(hasText).join(" · ");
    const routeLink = $("#map-route-link");
    if (hasText(mapsUrl)) routeLink.href = mapsUrl; else routeLink.remove();

    let loaded = false;
    const loadMap = () => {
      if (loaded) return;
      loaded = true;
      const iframe = el("iframe", {
        src: mapsEmbedUrl,
        title: "Mapa com a localização da Clínica Renove",
        loading: "lazy",
        referrerpolicy: "no-referrer-when-downgrade",
        allowfullscreen: true,
      });
      $("#map").replaceChildren(iframe);
    };
    $("#map-load").addEventListener("click", loadMap);
    // Carrega sob demanda quando a seção se aproxima da tela (sem bloquear a leitura do endereço).
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver((entries) => {
        if (entries.some((e) => e.isIntersecting)) { loadMap(); io.disconnect(); }
      }, { rootMargin: "300px 0px" });
      io.observe(mapWrap);
    }
  } else {
    mapWrap.remove();
    $("#localizacao .location__grid").style.gridTemplateColumns = "minmax(0, 720px)";
  }
}

/* ============================================================
   Rodapé
   ============================================================ */
function renderFooter() {
  const list = $("#footer-contact");
  const items = [];

  const wa = buildWhatsappLink(cfg.messages.general);
  if (wa) items.push(el("li", {}, el("a", { href: wa, target: "_blank", rel: "noopener", text: "WhatsApp" })));
  if (hasText(cfg.contact.phoneDisplay)) items.push(el("li", { text: cfg.contact.phoneDisplay }));
  if (hasText(cfg.contact.instagramUrl)) {
    items.push(el("li", {}, el("a", { href: cfg.contact.instagramUrl, target: "_blank", rel: "noopener", text: hasText(cfg.contact.instagramHandle) ? cfg.contact.instagramHandle : "Instagram" })));
  }
  if (hasText(cfg.location.addressLine)) items.push(el("li", { text: cfg.location.addressLine }));

  if (items.length) list.replaceChildren(...items);
  else list.replaceChildren(el("li", { text: "Contatos serão informados em breve." }));

  const privacy = $("#footer-privacy");
  if (hasText(cfg.legal.privacyPolicyUrl)) {
    $("a", privacy).href = cfg.legal.privacyPolicyUrl;
    privacy.hidden = false;
  } else {
    privacy.remove();
  }

  $("#year").textContent = String(new Date().getFullYear());
}

/* ============================================================
   Inicialização
   ============================================================ */
function init() {
  renderTopbar();
  setupMenu();
  renderPhoto($('[data-image="hero"]'), cfg.images.hero, { eager: true });
  renderPhoto($('[data-image="about"]'), cfg.images.about);
  renderCredentials();
  renderProcedures();
  renderPmmaNote();
  renderReviews();
  renderFaq();
  renderLocation();
  renderFooter();
  setupWhatsappCtas();
}

init();
