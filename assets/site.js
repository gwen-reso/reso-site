(function () {
  document.documentElement.classList.add("js");
  var C = Array.isArray(window.CAMPAGNES) ? window.CAMPAGNES : [];
  var CLIENTS = Array.isArray(window.CLIENTS) ? window.CLIENTS : [];
  var PART = Array.isArray(window.PARTENAIRES) ? window.PARTENAIRES : [];
  var PACKS = Array.isArray(window.PACKS) ? window.PACKS : [];
  var COM = typeof window.COMMISSION === "number" ? window.COMMISSION : null;
  var EMAILS = window.EMAILS || {};
  var FOND = Array.isArray(window.FONDATEURS) ? window.FONDATEURS : [];
  var FOCUS = window.FOCUS || null;
  var RECENTES = C.slice().sort(function (a, b) { return String(b.debut || "").localeCompare(String(a.debut || "")); });
  var MOIS = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];
  var nbsp = " ";
  var APERCU = document.querySelectorAll("[data-page]").length > 1;
  var REDUIT = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  var ONGLETS = {};
  function moisAn(iso) { var p = String(iso || "").split("-"); return p.length > 1 ? MOIS[parseInt(p[1], 10) - 1] + "\u00a0" + p[0] : ""; }
  function ongletHash() { var h = (location.hash || "").slice(1); if (ONGLETS[h]) ONGLETS[h](); }

  function fmt(n) {
    if (n >= 1e6) return (Math.round(n / 1e5) / 10).toString().replace(".", ",") + nbsp + "M";
    if (n >= 1e3) return Math.round(n / 1e3) + nbsp + "k";
    return String(n);
  }
  function euros(n) { return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, nbsp) + nbsp + "€"; }
  function el(tag, cls, txt) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (txt != null) e.textContent = txt;
    return e;
  }
  /* pochettes : 1000 px + copie 600 px (nom-600.jpg), le navigateur choisit selon l'écran */
  var POCHETTE = /^(assets\/campagnes\/.+)\.jpg$/;
  function petite(src) { var m = POCHETTE.exec(src || ""); return m ? m[1] + "-600.jpg" : src; }
  function img(src, alt, sizes) {
    var i = el("img"); i.src = src; i.alt = alt || ""; i.loading = "lazy"; i.decoding = "async";
    var m = POCHETTE.exec(src || "");
    if (m) { i.srcset = m[1] + "-600.jpg 600w, " + src + " 1000w"; i.sizes = sizes || "(max-width: 1100px) 46vw, 300px"; i.width = 1000; i.height = 1000; }
    return i;
  }
  function each(sel, fn, racine) { Array.prototype.forEach.call((racine || document).querySelectorAll(sel), fn); }
  function eng(c) { return c.engagement ? String(c.engagement).replace(" ", nbsp) : "—"; }
  function engNum(c) { return parseFloat(String(c.engagement || "0").replace(",", ".")) || 0; }
  var COURBE = '<svg viewBox="88 120 336 270" aria-hidden="true"><path d="M 104.6 373.8 L 162.0 256.0" stroke="#F3F0E8" stroke-width="44.7" fill="none"/><path d="M 198.6 373.8 L 284.7 197.1" stroke="#FFC53D" stroke-width="44.7" fill="none"/><path d="M 292.5 373.8 L 407.4 138.2" stroke="#FF4A1C" stroke-width="44.7" fill="none"/></svg>';

  /* --- adresses e-mail (modifiables dans contenu.js) --- */
  each("[data-email]", function (n) {
    var a = EMAILS[n.getAttribute("data-email")];
    if (!a) return;
    n.textContent = a;
    if (n.tagName === "A") n.href = "mailto:" + a;
  });
  each("form[data-destinataire]", function (f) { if (EMAILS.createurs) f.setAttribute("data-destinataire", EMAILS.createurs); });

  /* --- aperçu : plusieurs pages dans un seul document (#strategies, #campagnes…) --- */
  var pages = Array.prototype.slice.call(document.querySelectorAll("[data-page]"));
  if (pages.length > 1) {
    var noms = pages.map(function (p) { return p.getAttribute("data-page"); });
    var courante = null;
    var pageDe = function (h) {
      var c = "accueil";
      noms.forEach(function (n) { if (h === n || h.indexOf(n + "-") === 0) c = n; });
      return c;
    };
    var route = function () {
      var h = (location.hash || "").slice(1);
      var cible = pageDe(h);
      if (cible === courante) return;
      courante = cible;
      pages.forEach(function (p) { p.hidden = p.getAttribute("data-page") !== cible; });
      document.body.classList.toggle("p-createurs", cible === "createurs");
      each(".site-header.ouvert", function (hd) { hd.classList.remove("ouvert"); });
      var racine = document.documentElement, avant = racine.style.scrollBehavior;
      racine.style.scrollBehavior = "auto";
      var t = h && h !== cible && document.getElementById(h);
      if (t) t.scrollIntoView(); else window.scrollTo(0, 0);
      requestAnimationFrame(function () { racine.style.scrollBehavior = avant; });
      surveillerCta();
      ongletHash();
    };
    document.addEventListener("click", function (e) {
      var a = e.target.closest ? e.target.closest('a[href^="#"]') : null;
      if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      var h = a.getAttribute("href").slice(1);
      if (!h || pageDe(h) === courante) return;
      e.preventDefault();
      try { history.pushState(null, "", "#" + h); } catch (err) { location.hash = h; return; }
      route();
    });
    window.addEventListener("hashchange", route);
    window.addEventListener("popstate", route);
  }

  /* --- menu mobile --- */
  each(".menu-btn", function (b) {
    b.addEventListener("click", function () {
      var h = b.closest(".site-header");
      var ouvert = h.classList.toggle("ouvert");
      b.setAttribute("aria-expanded", ouvert ? "true" : "false");
    });
  });
  each(".site-header .nav a", function (a) {
    a.addEventListener("click", function () {
      var h = a.closest(".site-header"); h.classList.remove("ouvert");
      var b = h.querySelector(".menu-btn"); if (b) b.setAttribute("aria-expanded", "false");
    });
  });

  /* --- bouton d'action flottant (téléphone) : masqué quand sa cible est à l'écran --- */
  var obs = null;
  function surveillerCta() {
    if (!("IntersectionObserver" in window)) return;
    if (obs) obs.disconnect();
    obs = new IntersectionObserver(function (entrees) {
      entrees.forEach(function (en) {
        each('.cta-flottant[data-cible="' + en.target.id + '"]', function (b) { b.classList.toggle("masque", en.isIntersecting); });
      });
    }, { rootMargin: "0px 0px -10% 0px" });
    each(".cta-flottant", function (b) {
      var t = document.getElementById(b.getAttribute("data-cible"));
      if (t && t.offsetParent !== null) obs.observe(t);
    });
  }

  /* --- commission --- */
  if (COM != null) each("[data-commission]", function (s) { s.textContent = String(COM).replace(".", ","); });

  /* --- aperçu des campagnes dans la porte d'entrée --- */
  each("[data-apercu-campagnes]", function (p) {
    var n = RECENTES.slice(0, 4).map(function (c) { return c.artiste; });
    if (n.length) p.textContent = n.join(", ") + "…";
  });

  /* --- téléphones de l'accueil : pochette + vues + engagement --- */
  var phones = document.getElementById("phones");
  if (phones) {
    var avecImage = RECENTES.filter(function (c) { return c.image; }).slice(0, 3);
    var ordre = [1, 0, 2];
    avecImage.forEach(function (c, i) {
      var p = el("figure", "phone p" + (ordre[i] + 1));
      p.style.margin = "0";
      var f = el("div", "fond"); f.style.backgroundImage = "url('" + petite(c.image) + "')"; p.appendChild(f);
      p.appendChild(el("div", "encoche"));
      if (c.genre) p.appendChild(el("span", "badge", c.genre));
      var po = el("div", "pochette"); var im = img(c.image, "Visuel — " + c.artiste + ", " + c.titre, "220px"); im.loading = "eager"; po.appendChild(im); p.appendChild(po);
      var ui = el("figcaption", "ui");
      ui.appendChild(el("b", null, c.artiste));
      ui.appendChild(el("span", "son", "♫ " + c.titre));
      var ch = el("div", "chiffres-phone");
      [[fmt(c.vues || 0), "vues"], [eng(c), "engagement"]].forEach(function (d) {
        var s = el("span"); s.appendChild(el("b", null, d[0])); s.appendChild(document.createTextNode(d[1])); ch.appendChild(s);
      });
      ui.appendChild(ch);
      p.appendChild(ui);
      phones.appendChild(p);
    });
    if (!avecImage.length) phones.hidden = true;
  }

  /* --- logos clients (défilement continu) --- */
  each("[data-clients]", function (cl) {
    if (!CLIENTS.length) return;
    var piste = el("ul");
    [false, true].forEach(function (copie) {
      CLIENTS.forEach(function (c) {
        var li = el("li");
        if (copie) li.setAttribute("aria-hidden", "true");
        if (c.logo) { var i = img(c.logo, copie ? "" : c.nom); i.loading = "eager"; li.appendChild(i); }
        else li.appendChild(el("span", null, c.nom));
        piste.appendChild(li);
      });
    });
    cl.appendChild(piste);
  });
  var pa = document.getElementById("partenaires");
  if (pa && PART.length) {
    pa.appendChild(el("p", "eyebrow", "Partenaires"));
    PART.forEach(function (p) {
      var w = el(p.lien ? "a" : "span");
      if (p.lien) { w.href = p.lien; w.target = "_blank"; w.rel = "noopener"; }
      if (p.logo) w.appendChild(img(p.logo, p.nom)); else w.textContent = p.nom;
      pa.appendChild(w);
    });
    pa.hidden = false;
  }

  /* --- onglets (leviers) --- */
  each("[data-onglets]", function (bloc) {
    var tabs = Array.prototype.slice.call(bloc.querySelectorAll('[role="tab"]'));
    function choisir(t, focus) {
      tabs.forEach(function (x) {
        var actif = x === t;
        x.setAttribute("aria-selected", actif ? "true" : "false");
        x.tabIndex = actif ? 0 : -1;
        var p = document.getElementById(x.getAttribute("aria-controls"));
        if (p) p.hidden = !actif;
      });
      if (focus) t.focus();
      try { document.dispatchEvent(new CustomEvent("onglet", { detail: t.id })); } catch (err) {}
    }
    tabs.forEach(function (t) {
      var f = function () { choisir(t); };
      ONGLETS[t.id] = f;
      if (t.getAttribute("aria-controls")) ONGLETS[t.getAttribute("aria-controls")] = f;
    });
    tabs.forEach(function (t, i) {
      t.addEventListener("click", function () { choisir(t); });
      t.addEventListener("keydown", function (e) {
        var j = null;
        if (e.key === "ArrowRight" || e.key === "ArrowDown") j = (i + 1) % tabs.length;
        if (e.key === "ArrowLeft" || e.key === "ArrowUp") j = (i - 1 + tabs.length) % tabs.length;
        if (e.key === "Home") j = 0;
        if (e.key === "End") j = tabs.length - 1;
        if (j != null) { e.preventDefault(); choisir(tabs[j], true); }
      });
    });
    var initial = tabs.filter(function (t) { return t.getAttribute("aria-selected") === "true"; })[0] || tabs[0];
    if (initial) choisir(initial);
  });

  /* --- packs UGC : révélés depuis le levier UGC --- */
  var zonePacks = document.getElementById("strategies-packs");
  var btnPacks = document.querySelector(".packs-bouton");
  function ouvrirPacks(ouvrir, defiler) {
    if (!zonePacks || !btnPacks) return;
    zonePacks.hidden = !ouvrir;
    btnPacks.setAttribute("aria-expanded", ouvrir ? "true" : "false");
    btnPacks.firstChild.textContent = ouvrir ? "Masquer les exemples de packs " : "Voir des exemples de packs ";
    var fl = btnPacks.querySelector(".fl"); if (fl) fl.textContent = ouvrir ? "↑" : "↓";
    if (ouvrir && defiler) zonePacks.scrollIntoView({ behavior: REDUIT ? "auto" : "smooth", block: "start" });
  }
  if (btnPacks) btnPacks.addEventListener("click", function () { ouvrirPacks(zonePacks.hidden, true); });
  document.addEventListener("onglet", function (e) { if (e.detail !== "strategies-tab-ugc") ouvrirPacks(false); });
  ONGLETS["strategies-packs"] = function () { if (ONGLETS["strategies-tab-ugc"]) ONGLETS["strategies-tab-ugc"](); ouvrirPacks(true, true); };

  /* --- packs UGC : configurateur --- */
  var cfg = document.getElementById("packs-config");
  if (cfg) {
    if (!PACKS.length) { if (btnPacks) btnPacks.hidden = true; if (zonePacks) zonePacks.hidden = true; }
    else {
      var etat = { p: 0, c: 0 };
      var zp = document.getElementById("packs-choix-pack"), zc = document.getElementById("packs-choix-compo");
      var groupeRadio = function (zone, items, cle) {
        zone.innerHTML = "";
        items.forEach(function (it, i) {
          var b = el("button", "seg"); b.type = "button"; b.setAttribute("role", "radio");
          b.appendChild(el("span", "seg-t", it.t)); if (it.s) b.appendChild(el("span", "seg-s", it.s));
          b.addEventListener("click", function () { etat[cle] = i; if (cle === "p" && etat.c >= (PACKS[i].compositions || []).length) etat.c = 0; maj(); });
          b.addEventListener("keydown", function (e) {
            var n = items.length, j = null;
            if (e.key === "ArrowRight" || e.key === "ArrowDown") j = (i + 1) % n;
            if (e.key === "ArrowLeft" || e.key === "ArrowUp") j = (i - 1 + n) % n;
            if (j != null) { e.preventDefault(); etat[cle] = j; maj(); zone.children[j].focus(); }
          });
          zone.appendChild(b);
        });
      };
      var maj = function () {
        var pack = PACKS[etat.p];
        groupeRadio(zp, PACKS.map(function (x) { return { t: x.nom, s: euros(x.budget) }; }), "p");
        var compos = pack.compositions || [];
        groupeRadio(zc, compos.map(function (x) { return { t: x.nom }; }), "c");
        Array.prototype.forEach.call(zp.children, function (b, i) { b.setAttribute("aria-checked", i === etat.p ? "true" : "false"); b.tabIndex = i === etat.p ? 0 : -1; });
        Array.prototype.forEach.call(zc.children, function (b, i) { b.setAttribute("aria-checked", i === etat.c ? "true" : "false"); b.tabIndex = i === etat.c ? 0 : -1; });
        var comp = compos[etat.c] || { talents: 0, detail: [] };
        document.getElementById("packs-prix").textContent = euros(pack.budget);
        document.getElementById("packs-talents").textContent = comp.talents;
        var rep = document.getElementById("packs-repartition");
        rep.innerHTML = "";
        if (COM != null) {
          var barre = el("div", "rep-barre");
          var a = el("span", "rep-com"); a.style.width = COM + "%";
          var b2 = el("span", "rep-cont"); b2.style.width = (100 - COM) + "%";
          barre.appendChild(a); barre.appendChild(b2); rep.appendChild(barre);
          var leg = el("div", "rep-leg");
          var l1 = el("span", "l-com"); l1.appendChild(el("b", null, euros(pack.budget * COM / 100))); l1.appendChild(document.createTextNode("commission RÉSO (" + COM + nbsp + "%)"));
          var l2 = el("span", "l-cont"); l2.appendChild(el("b", null, euros(pack.budget * (100 - COM) / 100))); l2.appendChild(document.createTextNode("achat des contenus (" + (100 - COM) + nbsp + "%)"));
          leg.appendChild(l1); leg.appendChild(l2); rep.appendChild(leg);
        }
        var ul = document.getElementById("packs-paliers");
        ul.innerHTML = "";
        (comp.detail || []).forEach(function (d) {
          var m = /^(\d+)\s*[×x]\s*(.+)$/.exec(d), n = m ? parseInt(m[1], 10) : 1, palier = m ? m[2] : d;
          var li = el("li");
          li.appendChild(el("span", "p-palier", palier + " abonné·e·s"));
          var pts = el("span", "p-points"); pts.setAttribute("aria-hidden", "true");
          for (var k = 0; k < n; k++) pts.appendChild(el("i"));
          li.appendChild(pts);
          li.appendChild(el("span", "p-n", n + " profil" + (n > 1 ? "s" : "")));
          ul.appendChild(li);
        });
      };
      maj();
    }
  }

  /* --- campagnes : nouveautés / catalogue, genres, tri, top vidéo --- */
  var grille = document.getElementById("grille");
  var filtres = document.getElementById("filtres");
  var periodes = Array.prototype.slice.call(document.querySelectorAll(".periode"));
  var periode = "nouveaute", actif = "Tous", tri = "recentes";
  function stat(val, lib) { var x = el("div", "stat"); x.appendChild(el("b", null, val)); x.appendChild(el("span", null, lib)); return x; }
  function pastille(k) {
    var n = String(k.niveau || "").toLowerCase();
    var x = el(k.lien ? "a" : "span", "certif");
    x.setAttribute("data-niveau", /diamant/.test(n) ? "diamant" : /platine/.test(n) ? "platine" : "or");
    var lib = "Certification " + n + " — " + (k.organisme || "") + (k.date ? ", " + k.date : "") + (k.note ? " (" + k.note + ")" : "");
    x.title = lib;
    if (k.lien) { x.href = k.lien; x.target = "_blank"; x.rel = "noopener"; x.setAttribute("aria-label", lib + " (source, nouvel onglet)"); }
    var d = el("i", "disque"); d.setAttribute("aria-hidden", "true"); x.appendChild(d);
    x.appendChild(document.createTextNode(k.niveau + (k.organisme ? " · " + k.organisme : "")));
    return x;
  }
  function boutonVideo(c, cls) {
    var b = el("button", cls || "top-video");
    b.type = "button";
    b.appendChild(el("span", "tv-ico", "▶"));
    b.appendChild(document.createTextNode("Top vidéo"));
    b.setAttribute("aria-label", "Voir la top vidéo de la campagne " + c.artiste + ", " + c.titre + " (TikTok)");
    b.addEventListener("click", function () { ouvrirVideo(c); });
    return b;
  }
  function carte(c) {
    var a = el("article", "carte");
    var v = el("div", "visuel");
    if (c.image) v.appendChild(img(c.image, "Visuel — " + c.artiste + ", " + c.titre));
    else { v.className = "visuel typo"; v.insertAdjacentHTML("beforeend", COURBE); }
    if (c.certif && c.certif.niveau) v.appendChild(pastille(c.certif));
    if (c.video && c.video.url) v.appendChild(boutonVideo(c));
    a.appendChild(v);
    a.appendChild(el("p", "genre", c.genre || ""));
    a.appendChild(el("h3", "artiste", c.artiste));
    a.appendChild(el("p", "titre", c.titre));
    var dates = (c.sortie ? "Sortie " + moisAn(c.sortie) + " · " : "") + (c.debut ? "Campagne " + moisAn(c.debut) : "");
    if (dates) a.appendChild(el("p", "dates", dates));
    var s = el("div", "stats");
    s.appendChild(stat(c.vues ? fmt(c.vues) : "—", "vues"));
    s.appendChild(stat(eng(c), "engagement"));
    a.appendChild(s);
    return a;
  }
  function dePeriode(p) { return C.filter(function (c) { return (c.periode || "nouveaute") === p; }); }
  function majFiltres() {
    if (!filtres) return;
    var genres = [];
    dePeriode(periode).forEach(function (c) { if (c.genre && genres.indexOf(c.genre) < 0) genres.push(c.genre); });
    if (genres.indexOf(actif) < 0) actif = "Tous";
    filtres.innerHTML = "";
    filtres.hidden = genres.length < 2;
    ["Tous"].concat(genres).forEach(function (g) {
      var b = el("button", "filtre", g); b.type = "button"; b.dataset.genre = g;
      b.setAttribute("aria-pressed", g === actif ? "true" : "false");
      b.addEventListener("click", function () { actif = g; majFiltres(); rendre(); });
      filtres.appendChild(b);
    });
  }
  function rendre() {
    if (!grille) return;
    var liste = dePeriode(periode).filter(function (c) { return actif === "Tous" || c.genre === actif; });
    if (tri === "recentes") liste.sort(function (a, b) { return String(b.debut || "").localeCompare(String(a.debut || "")); });
    if (tri === "vues") liste.sort(function (a, b) { return (b.vues || 0) - (a.vues || 0); });
    if (tri === "engagement") liste.sort(function (a, b) { return engNum(b) - engNum(a); });
    grille.innerHTML = "";
    liste.forEach(function (c) { grille.appendChild(carte(c)); });
    each(".tri-b", function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-tri") === tri ? "true" : "false"); });
  }
  function choisirPeriode(btn, focus) {
    periode = btn.getAttribute("data-periode");
    periodes.forEach(function (x) {
      var on = x === btn;
      x.setAttribute("aria-selected", on ? "true" : "false");
      x.tabIndex = on ? 0 : -1;
    });
    if (grille) grille.setAttribute("aria-labelledby", btn.id);
    if (focus) btn.focus();
    majFiltres(); rendre();
  }
  periodes.forEach(function (btn, i) {
    if (!dePeriode(btn.getAttribute("data-periode")).length) btn.hidden = true;
    btn.addEventListener("click", function () { choisirPeriode(btn); });
    btn.addEventListener("keydown", function (e) {
      var j = null, n = periodes.length;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") j = (i + 1) % n;
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") j = (i - 1 + n) % n;
      if (j != null) { e.preventDefault(); choisirPeriode(periodes[j], true); }
    });
  });
  each(".tri-b", function (b) { b.addEventListener("click", function () { tri = b.getAttribute("data-tri"); rendre(); }); });
  if (periodes.length) {
    var premiere = periodes.filter(function (b) { return !b.hidden; })[0];
    if (premiere) choisirPeriode(premiere); else { majFiltres(); rendre(); }
  } else { majFiltres(); rendre(); }

  /* --- focus : une campagne mise en avant --- */
  var zoneFocus = document.getElementById("focus");
  if (zoneFocus) {
    var fc = FOCUS && C.filter(function (c) { return c.id === FOCUS.campagne; })[0];
    if (!fc) { var sfc = zoneFocus.closest("section"); if (sfc) sfc.hidden = true; }
    else {
      var bloc = el("div", "focus-bloc");
      var fig = el("figure", "focus-visuel");
      if (fc.image) fig.appendChild(img(fc.image, "Visuel — " + fc.artiste + ", " + fc.titre, "(max-width: 900px) 92vw, 500px"));
      if (fc.certif && fc.certif.niveau) fig.appendChild(pastille(fc.certif));
      bloc.appendChild(fig);
      var tx = el("div", "focus-texte");
      tx.appendChild(el("p", "eyebrow", "Focus campagne"));
      var h = el("h2", "h-display", fc.artiste); h.id = "clients-focus-titre";
      h.appendChild(el("span", "focus-titre", "« " + fc.titre + " »"));
      tx.appendChild(h);
      var dl = el("dl", "focus-chiffres");
      [[fmt(fc.vues || 0), "vues"], [FOCUS.contenus ? String(FOCUS.contenus) : "", "vidéos"], [eng(fc), "engagement"]].forEach(function (d) {
        if (!d[0]) return;
        var w = el("div"); w.appendChild(el("dt", null, d[1])); w.appendChild(el("dd", null, d[0])); dl.appendChild(w);
      });
      tx.appendChild(dl);
      if (FOCUS.etapes && FOCUS.etapes.length) {
        var ol = el("ol", "focus-frise");
        FOCUS.etapes.forEach(function (e) {
          var li = el("li");
          li.appendChild(el("span", "date", e.date));
          li.appendChild(el("span", "quoi", e.texte));
          ol.appendChild(li);
        });
        tx.appendChild(ol);
      }
      if (fc.video && fc.video.url) {
        var pied = el("div", "focus-video");
        pied.appendChild(boutonVideo(fc, "btn btn-ambre top-video--grand"));
        pied.appendChild(el("p", null, (fc.video.createur || "") + (fc.video.vues ? " · " + fmt(fc.video.vues) + " vues au reporting" : "")));
        tx.appendChild(pied);
      }
      bloc.appendChild(tx);
      zoneFocus.appendChild(bloc);
    }
  }

  /* --- lecteur de top vidéo : l'intégration TikTok ne se charge qu'au clic --- */
  var lecteur = document.getElementById("lecteur");
  function idTikTok(url) { var m = /\/video\/(\d+)/.exec(url || ""); return m ? m[1] : null; }
  function ouvrirVideo(c) {
    var v = c.video || {}, id = idTikTok(v.url);
    if (!lecteur || typeof lecteur.showModal !== "function" || !id) { window.open(v.url, "_blank", "noopener"); return; }
    document.getElementById("lecteur-sur").textContent = "Top vidéo" + (v.createur ? " · " + v.createur : "");
    document.getElementById("lecteur-titre").textContent = c.artiste + " — " + c.titre;
    document.getElementById("lecteur-stats").textContent = v.vues ? fmt(v.vues) + " vues au reporting" : "";
    document.getElementById("lecteur-lien").href = v.url;
    var zone = document.getElementById("lecteur-video");
    zone.innerHTML = "";
    var f = document.createElement("iframe");
    f.src = "https://www.tiktok.com/player/v1/" + id + "?music_info=1&description=1&rel=0";
    f.title = "Vidéo TikTok" + (v.createur ? " de " + v.createur : "");
    f.setAttribute("allow", "encrypted-media; fullscreen; picture-in-picture");
    f.setAttribute("allowfullscreen", "");
    zone.appendChild(f);
    lecteur.showModal();
  }
  if (lecteur) {
    lecteur.addEventListener("close", function () { var z = document.getElementById("lecteur-video"); if (z) z.innerHTML = ""; });
    lecteur.addEventListener("click", function (e) {
      if (e.target === lecteur || (e.target.closest && e.target.closest("[data-fermer]"))) lecteur.close();
    });
  }

  /* --- fondateurs --- */
  var zf = document.getElementById("fondateurs");
  if (zf) {
    if (!FOND.length) { var sf = zf.closest("section"); if (sf) sf.hidden = true; }
    FOND.forEach(function (f) {
      var a = el("article", "fondateur");
      var m = el("div", "monogramme");
      if (f.photo) { m.className = "monogramme photo"; m.appendChild(img(f.photo, f.nom)); }
      else {
        m.setAttribute("aria-hidden", "true");
        m.textContent = String(f.nom || "").split(/\s+/).map(function (x) { return x.charAt(0); }).join("").slice(0, 2).toUpperCase();
      }
      a.appendChild(m);
      var t = el("div", "f-texte");
      t.appendChild(el("h3", null, f.nom));
      if (f.role) t.appendChild(el("p", "role", f.role));
      var ul = el("ul", "parcours");
      (f.parcours || []).forEach(function (x) { ul.appendChild(el("li", null, x)); });
      t.appendChild(ul);
      if (f.lien) { var l = el("a", "f-lien", "LinkedIn ↗"); l.href = f.lien; l.target = "_blank"; l.rel = "noopener"; t.appendChild(l); }
      a.appendChild(t);
      zf.appendChild(a);
    });
  }

  /* --- en-têtes : filet au défilement --- */
  var onScroll = function () { each(".site-header", function (h) { h.classList.toggle("scrolled", window.scrollY > 8); }); };
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();

  /* --- copier du texte (adresse, réponses) --- */
  function copier(txt, noeud, ok, msgOk, msgSel) {
    function selection() {
      if (noeud) {
        var r = document.createRange(); r.selectNodeContents(noeud);
        var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
      }
      if (ok) ok.textContent = msgSel;
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(txt).then(function () { if (ok) ok.textContent = msgOk; }, selection);
    } else selection();
  }
  each("[data-copie]", function (bouton) {
    var adresse = document.getElementById(bouton.getAttribute("data-copie"));
    var ok = bouton.parentNode.querySelector(".copie-ok");
    if (!adresse) return;
    bouton.addEventListener("click", function () {
      copier(adresse.textContent.trim(), adresse, ok, "Adresse copiée", "Adresse sélectionnée — Ctrl/Cmd + C pour copier");
    });
  });

  /* --- espace créateur·ice·s : formulaire → e-mail déjà rempli --- */
  var form = document.getElementById("createurs-formulaire");
  if (form) {
    var etatF = document.getElementById("cf-etat");
    var apercu = document.getElementById("cf-apercu");
    var externe = window.FORMULAIRE_CREATEURS;
    if (externe) {
      var lien = document.getElementById("createurs-form-externe");
      if (lien) { lien.href = externe; lien.target = "_blank"; lien.rel = "noopener"; lien.hidden = false; }
      form.hidden = true;
    }
    var coches = function (nom) {
      return Array.prototype.map.call(form.querySelectorAll('input[name="' + nom + '"]:checked'), function (i) { return i.value; });
    };
    var champ = function (id) { var e = document.getElementById(id); return e ? e.value.trim() : ""; };
    var reponses = function () {
      return {
        nom: champ("cf-nom"), tel: champ("cf-tel"), ville: champ("cf-ville"), comptes: champ("cf-comptes"), audience: champ("cf-audience"),
        genres: coches("genres"), campagnes: coches("campagnes"), profil: coches("profil")[0] || "", statut: coches("statut")[0] || "",
        message: champ("cf-message")
      };
    };
    var texte = function (r) {
      var l = ["Bonjour RÉSO,", "", "Je souhaite rejoindre le réseau.", "", "Nom ou pseudo : " + r.nom, "Téléphone (WhatsApp) : " + r.tel];
      if (r.ville) l.push("Ville : " + r.ville);
      if (r.profil) l.push("Je suis : " + r.profil);
      l.push("Comptes :");
      r.comptes.split(/\n+/).forEach(function (c) { if (c.trim()) l.push("- " + c.trim()); });
      if (r.audience) l.push("Audience : " + r.audience);
      if (r.genres.length) l.push("Genres musicaux : " + r.genres.join(", "));
      if (r.campagnes.length) l.push("Campagnes qui m’intéressent : " + r.campagnes.join(", "));
      if (r.statut) l.push("Statut : " + r.statut);
      if (r.message) { l.push(""); l.push(r.message); }
      l.push(""); l.push("À bientôt,"); l.push(r.nom);
      return l.join("\n");
    };
    var valide = function (r) {
      var manquants = [];
      [["cf-nom", r.nom], ["cf-tel", r.tel], ["cf-comptes", r.comptes]].forEach(function (p) {
        var e = document.getElementById(p[0]);
        e.setAttribute("aria-invalid", p[1] ? "false" : "true");
        if (!p[1]) manquants.push(e);
      });
      if (manquants.length) {
        etatF.textContent = "Indiquez votre nom ou pseudo, votre numéro WhatsApp et au moins un lien vers vos comptes.";
        etatF.className = "form-etat large erreur";
        manquants[0].focus();
        return false;
      }
      return true;
    };
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var r = reponses();
      if (!valide(r)) return;
      var dest = form.getAttribute("data-destinataire");
      var corps = texte(r);
      if (apercu) { apercu.textContent = corps; apercu.hidden = false; }
      etatF.className = "form-etat large";
      etatF.textContent = "Votre messagerie va s’ouvrir avec vos réponses : il ne reste qu’à envoyer. Rien ne s’ouvre ? Copiez vos réponses et envoyez-les à " + dest + ".";
      window.location.href = "mailto:" + dest + "?subject=" + encodeURIComponent("Rejoindre le réseau RÉSO — " + r.nom) + "&body=" + encodeURIComponent(corps);
    });
    var bc = document.getElementById("cf-copier");
    if (bc) bc.addEventListener("click", function () {
      var r = reponses();
      if (!valide(r)) return;
      var dest = form.getAttribute("data-destinataire");
      var corps = texte(r);
      if (apercu) { apercu.textContent = corps; apercu.hidden = false; }
      etatF.className = "form-etat large";
      copier(corps, apercu, etatF, "Réponses copiées : collez-les dans un e-mail à " + dest + ".", "Réponses sélectionnées — Ctrl/Cmd + C, puis collez-les dans un e-mail à " + dest + ".");
    });
  }

  window.addEventListener("hashchange", ongletHash);
  if (pages.length > 1) { route(); } else { surveillerCta(); ongletHash(); }
})();

