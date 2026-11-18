/* ==========================================================================
   RÉSO — CONTENU ÉDITABLE DU SITE
   Listes : EMAILS, COMMISSION, PACKS, CLIENTS, PARTENAIRES, CAMPAGNES,
   FOCUS, FONDATEURS, FORMULAIRE_CREATEURS. Pour ajouter un élément : copiez un bloc { ... },
   collez-le, modifiez les valeurs. Une virgule entre deux blocs.

   Images : déposez-les dans assets/clients/, assets/partenaires/ ou
   assets/campagnes/ et indiquez le chemin.
     - Logos : PNG transparent, une seule couleur claire (ivoire #F3F0E8)
     - Pochettes : JPG carré de 1000 px, plus une copie de 600 px nommée
       <nom>-600.jpg (le site charge la bonne taille selon l'écran).
       Sans pochette, la carte affiche une vignette aux couleurs de RÉSO.

   Avant de publier : accord écrit du label / de l'artiste pour citer la
   campagne, ses chiffres, sa pochette et son logo.
   ========================================================================== */

/* Adresses e-mail affichées sur le site.
   contact   → bloc « Nous écrire » de toutes les pages (labels, artistes, management)
   createurs → formulaire « Rejoindre le réseau » de l'espace créateur·ice·s
   contact@reso-digital.fr existe (groupe Google, arrive chez Gwen et Anthony). Adresse créateur·ice·s : à créer
   d'abord dans Google Workspace (alias ou groupe) avant de les mettre ici. */
window.EMAILS = {
  contact: "contact@reso-digital.fr",
  createurs: "gwen@reso-digital.fr"
};

/* Commission RÉSO, en % du budget HT — la même pour tous les clients. */
window.COMMISSION = 30;

/* Exemples de packs UGC (page « Nos stratégies », levier UGC). Aucun résultat garanti :
   engagement de moyens (profils, contenus, délais).
   Pour retirer les packs du site : window.PACKS = [];  */
window.PACKS = [
  {
    nom: "Small",
    budget: 1500,
    compositions: [
      { nom: "Top profils",      talents: 3,  detail: ["1 × +500 k", "2 × 300–500 k"] },
      { nom: "Middle profils",   talents: 10, detail: ["1 × 150–300 k", "5 × 50–150 k", "4 × 10–50 k"] },
      { nom: "Mix top / middle", talents: 6,  detail: ["1 × 300–500 k", "2 × 150–300 k", "3 × 50–150 k"] }
    ]
  },
  {
    nom: "Middle",
    budget: 3000,
    compositions: [
      { nom: "Top profils",      talents: 5,  detail: ["1 × +1 M", "1 × +500 k", "3 × 300–500 k"] },
      { nom: "Middle profils",   talents: 20, detail: ["3 × 150–300 k", "10 × 50–150 k", "7 × 10–50 k"] },
      { nom: "Mix top / middle", talents: 10, detail: ["1 × +1 M", "2 × 300–500 k", "3 × 150–300 k", "4 × 50–150 k"] }
    ]
  },
  {
    nom: "Top",
    budget: 5000,
    compositions: [
      { nom: "Top profils",      talents: 9,  detail: ["2 × +1 M", "3 × +500 k", "4 × 300–500 k"] },
      { nom: "Middle profils",   talents: 35, detail: ["8 × 150–300 k", "15 × 50–150 k", "12 × 10–50 k"] },
      { nom: "Mix top / middle", talents: 18, detail: ["1 × +1 M", "2 × +500 k", "3 × 300–500 k", "5 × 150–300 k", "7 × 50–150 k"] }
    ]
  }
];

/* Maisons de disques, labels et producteurs qui nous ont confié des campagnes */
window.CLIENTS = [
  { nom: "Sony Music",              logo: "assets/clients/sony-music.png" },
  { nom: "Universal Music France",  logo: "assets/clients/universal-music-france.png" },
  { nom: "Warner Music France",     logo: "assets/clients/warner-music-france.png" },
  { nom: "Wagram Music",            logo: "assets/clients/wagram-music.png" },
  { nom: "Because Music",           logo: "assets/clients/because-music.png" },
  { nom: "Believe",                 logo: "assets/clients/believe.png" }
];

/* Partenaires (agences de créateur·ice·s, outils, médias…).
   Tant que la liste est vide, le bloc « Partenaires » ne s'affiche pas.
   Exemple : { nom: "Nom", logo: "assets/partenaires/nom.png", lien: "https://…" } */
window.PARTENAIRES = [
];

/* Campagnes (page « Nos clients »). Règle : uniquement les campagnes à plus
   d'1 M de vues au reporting (tableau de suivi + e-mails de reporting).
   Deux onglets : « Nouveautés » (campagne lancée moins de 2 mois après la sortie
   du titre, ou avant) et « Catalogue » (titre sorti depuis plus longtemps).
   Chaque carte affiche les mêmes deux chiffres, tirés du reporting de fin de
   campagne : vues et engagement.
   Champs :
     id          identifiant unique (sert au focus)
     artiste, titre, genre
     periode     "nouveaute" ou "catalogue"
     sortie      date de sortie du titre (AAAA-MM-JJ), facultatif
     debut       début de la campagne (AAAA-MM-JJ) — sert au tri « Récentes »
     vues        nombre entier ; engagement : texte, ex. "10,4 %"
     image       visuel carré dans assets/campagnes/
     certif      certification SNEP du titre (uniquement si vérifiée dans
                 https://snepmusique.com/les-certifications/) ; note : précision
                 affichée au survol (ex. "titre original")
     video       top vidéo de la campagne : { url, createur, vues } — le bouton
                 « Top vidéo » n'apparaît que si url est rempli
   Les 3 campagnes les plus récentes avec visuel apparaissent dans les
   téléphones de la page d'accueil. Les filtres par genre suivent l'ordre
   d'apparition des genres dans cette liste.
   Dates « debut » marquées (est.) : date de réception du brief + 7 jours,
   faute de date de lancement dans les échanges — à corriger si besoin. */
window.CAMPAGNES = [
  /* ---------- Nouveautés ---------- */
  { id: "leto-pineapple", artiste: "Leto", titre: "Pineapple",
    genre: "Rap & urbain FR", periode: "nouveaute", sortie: "2026-04-10", debut: "2026-05-21",
    vues: 6400000, engagement: "10,4 %", image: "assets/campagnes/leto-pineapple.jpg",
    certif: { niveau: "Diamant", organisme: "SNEP", date: "06/08/2026",
              lien: "https://snepmusique.com/les-certifications/?interprete=Leto&titre=Pineapple" },
    video: { url: "https://www.tiktok.com/@angelina_deoll/video/7650567842718387488",
             createur: "@angelina_deoll", vues: 464500 } },
  { id: "naza-tu-m-aimes-plus", artiste: "Naza", titre: "Tu m'aimes plus",
    genre: "Rap & urbain FR", periode: "nouveaute", sortie: "2026-04-17", debut: "2026-05-04" /* est. */,
    vues: 3100000, engagement: "12,8 %", image: "assets/campagnes/naza-tu-m-aimes-plus.jpg" },
  { id: "keblack-franglish-uber", artiste: "Keblack & Franglish", titre: "Uber ft. Mauvais Djo",
    genre: "Rap & urbain FR", periode: "nouveaute", sortie: "2026-06-19", debut: "2026-07-28",
    vues: 1800000, engagement: "7,5 %", image: "assets/campagnes/keblack-franglish-uber.jpg",
    certif: { niveau: "Or", organisme: "SNEP", date: "22/10/2026",
              lien: "https://snepmusique.com/les-certifications/?interprete=Keblack&titre=Uber" } },
  { id: "ze-mamacita", artiste: "Zé", titre: "Mamacita",
    genre: "Rap & urbain FR", periode: "nouveaute", sortie: "2026-07-23", debut: "2026-07-30" /* est. */,
    vues: 1500000, engagement: "6,8 %", image: "assets/campagnes/ze-mamacita.jpg" },
  { id: "bedry-nickiminaj", artiste: "Bryan Countach & Bedry", titre: "NICKIMINAJ",
    genre: "Rap & urbain FR", periode: "nouveaute", sortie: "2026-03-09", debut: "2026-04-15" /* est. */,
    vues: 1400000, engagement: "12,4 %", image: "assets/campagnes/bryan-countach-bedry-nickiminaj.jpg" },
  { id: "naza-jul-pas-d-problemes", artiste: "Naza & Jul", titre: "Pas d'problèmes",
    genre: "Rap & urbain FR", periode: "nouveaute", sortie: "2026-10-09", debut: "2026-10-13" /* est. */,
    vues: 1100000, engagement: "7,8 %", image: "assets/campagnes/naza-jul-pas-d-problemes.jpg" },
  { id: "naza-ketchup", artiste: "Naza", titre: "Ketchup",
    genre: "Rap & urbain FR", periode: "nouveaute", sortie: "2026-07-24", debut: "2026-07-28",
    vues: 1100000, engagement: "13,4 %", image: "assets/campagnes/naza-ketchup.jpg" },
  { id: "djcassuk-mavado-addicted-to-you", artiste: "djcassuk & Mavado", titre: "Addicted to You",
    genre: "Pop inter", periode: "nouveaute", sortie: "2026-06-12", debut: "2026-07-02" /* est. */,
    vues: 5200000, engagement: "10,2 %", image: "assets/campagnes/djcassuk-mavado-addicted-to-you.jpg" },
  { id: "tame-impala-dracula-fevrier", artiste: "Tame Impala × JENNIE", titre: "Dracula (remix)",
    genre: "Pop inter", periode: "nouveaute", sortie: "2026-02-06", debut: "2026-02-25",
    vues: 2200000, engagement: "10,7 %", image: "assets/campagnes/tame-impala-jennie-dracula.jpg",
    certif: { niveau: "Diamant", organisme: "SNEP", date: "09/07/2026", note: "titre original",
              lien: "https://snepmusique.com/les-certifications/?interprete=Tame+Impala&titre=Dracula" } },
  { id: "estl-te-rencontrer-encore", artiste: "ESTL", titre: "Te rencontrer encore",
    genre: "Chanson", periode: "nouveaute", sortie: "2026-04-03", debut: "2026-04-27" /* est. */,
    vues: 1100000, engagement: "10,7 %", image: "assets/campagnes/estl-te-rencontrer-encore.jpg",
    certif: { niveau: "Or", organisme: "SNEP", date: "13/11/2026",
              lien: "https://snepmusique.com/les-certifications/?interprete=ESTL&titre=Te+rencontrer+encore" } },
  { id: "blasterjaxx-unfaithful", artiste: "Blasterjaxx", titre: "Unfaithful",
    genre: "Électro", periode: "nouveaute", sortie: "2026-01-09", debut: "2026-02-09" /* est. */,
    vues: 1400000, engagement: "10,3 %", image: "assets/campagnes/blasterjaxx-unfaithful.jpg" },

  /* ---------- Catalogue ---------- */
  { id: "dominic-fike-babydoll", artiste: "Dominic Fike", titre: "Babydoll",
    genre: "Pop inter", periode: "catalogue", sortie: "2018-10-16", debut: "2026-03-02",
    vues: 5800000, engagement: "10,2 %", image: "assets/campagnes/dominic-fike-babydoll.jpg",
    certif: { niveau: "Diamant", organisme: "SNEP", date: "16/07/2026",
              lien: "https://snepmusique.com/les-certifications/?interprete=Dominic+Fike&titre=Babydoll" } },
  { id: "tame-impala-dracula-mai", artiste: "Tame Impala × JENNIE", titre: "Dracula (remix)",
    genre: "Pop inter", periode: "catalogue", sortie: "2026-02-06", debut: "2026-05-17",
    vues: 5200000, engagement: "9,2 %", image: "assets/campagnes/tame-impala-jennie-dracula.jpg",
    certif: { niveau: "Diamant", organisme: "SNEP", date: "09/07/2026", note: "titre original",
              lien: "https://snepmusique.com/les-certifications/?interprete=Tame+Impala&titre=Dracula" } },
  { id: "pinkpantheress-stateside", artiste: "PinkPantheress ft. Zara Larsson", titre: "Stateside",
    genre: "Pop inter", periode: "catalogue", sortie: "2025-04-25", debut: "2026-01-15",
    vues: 1500000, engagement: "6 %", image: "assets/campagnes/pinkpantheress-stateside.jpg",
    certif: { niveau: "Or", organisme: "SNEP", date: "07/05/2026",
              lien: "https://snepmusique.com/les-certifications/?interprete=PinkPantheress&titre=Stateside" } },
  { id: "harry-styles-coming-up-roses", artiste: "Harry Styles", titre: "Coming Up Roses",
    genre: "Pop inter", periode: "catalogue", sortie: "2026-03-06", debut: "2026-10-05" /* est. */,
    vues: 1400000, engagement: "14,1 %", image: "assets/campagnes/harry-styles-coming-up-roses.jpg" },
  { id: "dominic-fike-white-keys", artiste: "Dominic Fike", titre: "White Keys",
    genre: "Pop inter", periode: "catalogue", sortie: "2025-11-14", debut: "2026-04-21" /* est. */,
    vues: 1400000, engagement: "11,7 %", image: "assets/campagnes/dominic-fike-white-keys.jpg" },
  { id: "rosalia-sauvignon-blanc", artiste: "ROSALÍA", titre: "Sauvignon Blanc",
    genre: "Pop inter", periode: "catalogue", sortie: "2025-11-07", debut: "2026-02-05" /* est. */,
    vues: 1300000, engagement: "7,9 %", image: "assets/campagnes/rosalia-sauvignon-blanc.jpg" },
  { id: "dua-lipa-training-season", artiste: "Dua Lipa", titre: "Training Season (live)",
    genre: "Pop inter", periode: "catalogue", sortie: "2024-02-15", debut: "2026-09-01",
    vues: 1200000, engagement: "12,4 %", image: "assets/campagnes/dua-lipa-training-season.jpg",
    certif: { niveau: "Diamant", organisme: "SNEP", date: "28/11/2024", note: "titre original",
              lien: "https://snepmusique.com/les-certifications/?titre=Training+Season" } },
  { id: "slayyyter-dance", artiste: "Slayyyter", titre: "DANCE…",
    genre: "Électro", periode: "nouveaute", sortie: "2026-03-27", debut: "2026-06-01" /* est. */,
    vues: 3500000, engagement: "6,2 %", image: "assets/campagnes/slayyyter-dance.jpg" },
  { id: "depeche-mode-enjoy-the-silence", artiste: "Depeche Mode", titre: "Enjoy the Silence",
    genre: "Rock & indé", periode: "catalogue", sortie: "1990-03-16", debut: "2026-10-09" /* est. */,
    vues: 1100000, engagement: "13,5 %", image: "assets/campagnes/depeche-mode-enjoy-the-silence.jpg" },
  { id: "dean-martin-let-it-snow", artiste: "Dean Martin", titre: "Let It Snow",
    genre: "Variété inter", periode: "catalogue", debut: "2025-12-01",
    vues: 4900000, engagement: "10,1 %", image: "assets/campagnes/dean-martin-let-it-snow.jpg" }
];

/* Focus (page « Nos clients », au-dessus des exemples) : une campagne mise en
   avant, choisie par son id dans CAMPAGNES. Pour retirer le bloc :
   window.FOCUS = null; */
window.FOCUS = {
  campagne: "leto-pineapple",
  contenus: 41,
  etapes: [
    { date: "10 avril 2026",        texte: "Sortie du single" },
    { date: "21 mai – 16 juin 2026", texte: "Campagne TikTok : 41 vidéos" },
    { date: "6 août 2026",          texte: "Single de diamant (SNEP)" }
  ]
};

/* Fondateurs (page « Qui sommes-nous »). photo (facultatif) : JPG carré dans
   assets/fondateurs/ — sans photo, la carte affiche les initiales. */
window.FONDATEURS = [
  { nom: "Gwen Briant",  role: "Co-fondateur",
    parcours: ["Ex-Universal Music", "Ex-Believe", "Co-fondateur du label Triple-Double"] },
  { nom: "Anthony Joao", role: "Co-fondateur",
    parcours: ["Fondateur de Punch Promo", "Fondateur de Punch Label"] }
];

/* Espace créateur·ice·s : lien vers un formulaire en ligne (Google Forms,
   Tally…). Tant qu'il est vide, la page affiche son propre formulaire, qui
   prépare un e-mail déjà rempli. Exemple : "https://forms.gle/…" */
window.FORMULAIRE_CREATEURS = "";

