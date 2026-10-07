(function () {
  var WA = document.body.getAttribute("data-wa");
  var EMPTY = document.body.getAttribute("data-empty") || "Queria agendar.";
  var INTRO = "Olá, eu vim do website de vocês.";

  function waUrl(text) {
    return "https://wa.me/" + WA + "?text=" + encodeURIComponent(text);
  }

  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  var sections = ["inicio", "servicos", "agenda", "avaliacoes", "contato"].map(function (id) {
    return [id, document.getElementById(id)];
  });

  function setCurrent() {
    var y = window.scrollY + 120;
    var current = "inicio";
    sections.forEach(function (item) {
      if (item[1] && item[1].offsetTop <= y) current = item[0];
    });
    document.querySelectorAll("[data-nav]").forEach(function (link) {
      if (link.getAttribute("data-nav") === current) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
  }

  setCurrent();
  window.addEventListener("scroll", setCurrent, { passive: true });

  var form = document.getElementById("quote-form");
  var waLinks = document.querySelectorAll("[data-wa]");

  function filled(value) {
    return String(value || "").trim();
  }

  function messageFromForm() {
    var lines = [INTRO];
    if (!form) {
      lines.push(EMPTY);
      return lines.join("\n");
    }
    var nome = filled(form.elements.nome && form.elements.nome.value);
    var servico = filled(form.elements.servico && form.elements.servico.value);
    var data = filled(form.elements.data && form.elements.data.value);
    var horario = filled(form.elements.horario && form.elements.horario.value);
    if (nome) lines.push("Nome: " + nome);
    if (servico) lines.push("Serviço: " + servico);
    if (data) lines.push("Data: " + data);
    if (horario) lines.push("Horário: " + horario);
    if (!nome && !servico && !data && !horario) lines.push(EMPTY);
    return lines.join("\n");
  }

  function syncWaLinks() {
    var href = waUrl(messageFromForm());
    waLinks.forEach(function (link) {
      link.setAttribute("href", href);
    });
  }

  syncWaLinks();
  if (form) {
    form.addEventListener("input", syncWaLinks);
    form.addEventListener("change", syncWaLinks);
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      syncWaLinks();
      window.open(waUrl(messageFromForm()), "_blank", "noopener,noreferrer");
    });
  }
})();
