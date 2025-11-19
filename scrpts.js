<script>
    // ===== data (personnalise ces objets) =====
    const SKILLS = [
      {name:"Django (4.x)", level:"Expert"},
      {name:"Django REST Framework", level:"Intermédiaire"},
      {name:"WordPress (thèmes & plugins)", level:"Avancé"},
      {name:"HTML5 • CSS3 • JS", level:"Avancé"},
      {name:"HTMX • Alpine.js", level:"Intermédiaire"},
      {name:"Docker • Nginx • Gunicorn", level:"Intermédiaire"},
      {name:"PostgreSQL • MySQL", level:"Avancé"},
      {name:"pfSense • Cisco • VPN", level:"Intermédiaire"},
      {name:"VMware ESXi • Veeam", level:"Intermédiaire"}
    ];

    const PROJECTS = [
      {
        id: "fala",
        title: "Fala Money — Microfinance",
        short: "Plateforme web et application mobile pour microfinance",
        desc: "Conception d’outils internes en Django pour la gestion clients et transactions, création de thèmes WordPress, intégration SSL, migrations DNS et optimisation performance.",
        tags: ["Django","WordPress","Sécurité"],
        img: ""
      },
      {
        id: "alm-cloud",
        title: "ALM Consultants x PENTCAM — Espace Cloud Sécurisé",
        short: "Solution cloud chiffrée pour collaboration inter-entreprises",
        desc: "Mise en place d'un espace cloud sécurisé, gestion des permissions, chiffrement, MFA, automatisation des synchronisations et formation des équipes.",
        tags: ["Sécurité","Cloud","Collaboration"],
        img: ""
      },
      {
        id: "caf-renov",
        title: "CAFEN — Site & CRM",
        short: "Site WordPress et CRM interne en Django",
        desc: "Thème WordPress sur mesure, développement d’un CRM interne en Django, optimisation SEO et sécurisation.",
        tags: ["WordPress","Django","SEO"],
        img: ""
      },
      {
        id: "lenectar",
        title: "Lenectar — E-commerce local",
        short: "Site vitrine et e-commerce pour producteur local",
        desc: "Création du site, intégration paiement, optimisation front-end et suivi analytics.",
        tags: ["E-commerce","Performance"],
        img: ""
      },
      {
        id: "kamix",
        title: "Kamix SARL — Plateforme de paiement",
        short: "Support au déploiement et maintenance",
        desc: "Coordination des mises en production, déploiement et monitoring des applications mobiles et backends.",
        tags: ["DevOps","Monitoring"],
        img: ""
      }
    ];

    // ===== render skills =====
    const skillsGrid = document.getElementById('skillsGrid');
    SKILLS.forEach(s=>{
      const el = document.createElement('div');
      el.className = 'skill';
      el.innerHTML = `<div><div class="name">${s.name}</div><div class="muted level">${s.level}</div></div><div class="row"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M2 12l5 5L22 4" stroke="white" stroke-opacity="0.7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></div>`;
      skillsGrid.appendChild(el);
    });

    // ===== render project filters and projects =====
    const filtersEl = document.getElementById('filters');
    const projectsGrid = document.getElementById('projectsGrid');

    // unique tags
    const TAGS = ['Tous', ...new Set(PROJECTS.flatMap(p=>p.tags))];

    TAGS.forEach((t,i)=>{
      const btn = document.createElement('button');
      btn.className = 'chip' + (i===0 ? ' active':'');
      btn.textContent = t;
      btn.setAttribute('data-tag', t);
      btn.addEventListener('click', ()=> {
        document.querySelectorAll('.chip').forEach(c=>c.classList.remove('active'));
        btn.classList.add('active');
        renderProjects(t === 'Tous' ? null : t);
      });
      filtersEl.appendChild(btn);
    });

    function renderProjects(filterTag = null){
      projectsGrid.innerHTML = '';
      const list = filterTag ? PROJECTS.filter(p=>p.tags.includes(filterTag)) : PROJECTS;
      list.forEach(p=>{
        const card = document.createElement('article');
        card.className = 'project-card';
        card.setAttribute('tabindex', '0');
        card.innerHTML = `
          <div>
            <div class="meta">${p.tags.join(' • ')}</div>
            <h3>${p.title}</h3>
            <p class="muted">${p.short}</p>
            <div class="tags">${p.tags.map(t=>`<span class="tag">${t}</span>`).join('')}</div>
          </div>
          <div style="display:flex;gap:8px;align-items:center;margin-top:12px">
            <button class="btn ghost" data-id="${p.id}" aria-label="Voir le projet ${p.title}">Détails</button>
            <a class="btn ghost" href="#" aria-label="Visiter le projet ${p.title}">Live</a>
          </div>
        `;
        // open modal on button
        card.querySelector('button[data-id]').addEventListener('click', (e)=>{
          openModal(p);
        });
        projectsGrid.appendChild(card);
      });
    }

    // initial render
    renderProjects();

    // ===== modal logic =====
    const modalBackdrop = document.getElementById('modalBackdrop');
    const modalInner = document.getElementById('modalInner');
    const modalClose = document.getElementById('modalClose');

    function openModal(project){
      modalInner.innerHTML = `
        <h3 style="margin-top:0">${project.title}</h3>
        <p class="muted">${project.tags.join(' • ')}</p>
        <p style="margin-top:12px">${project.desc}</p>
        <div style="margin-top:12px"><a class="btn ghost" href="#" aria-label="Voir le site ${project.title}">Visiter</a></div>
      `;
      modalBackdrop.style.display = 'grid';
      modalBackdrop.setAttribute('aria-hidden','false');
      // trap focus: focus close button
      modalClose.focus();
    }

    function closeModal(){
      modalBackdrop.style.display = 'none';
      modalBackdrop.setAttribute('aria-hidden','true');
    }

    modalClose.addEventListener('click', closeModal);
    modalBackdrop.addEventListener('click', (e)=>{
      if(e.target === modalBackdrop) closeModal();
    });
    document.addEventListener('keydown', (e)=>{
      if(e.key === 'Escape') closeModal();
    });

    // ===== contact form handling =====
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    contactForm.addEventListener('submit', (e)=>{
      e.preventDefault();
      const name = contactForm.name.value.trim();
      const email = contactForm.email.value.trim();
      const message = contactForm.message.value.trim();
      if(!name || !email || !message){
        formStatus.textContent = 'Merci de remplir tous les champs.';
        return;
      }
      // Simple validation passed. Use mailto fallback.
      const subject = encodeURIComponent(`Contact portfolio - ${name}`);
      const body = encodeURIComponent(`${message}\n\n---\n${name}\n${email}`);
      const mailto = `mailto:balepajean0506@gmail.com?subject=${subject}&body=${body}`;
      // open default mail client
      window.location.href = mailto;
      formStatus.textContent = 'Votre client mail va s’ouvrir. Si rien ne se passe, envoyez un email à balepajean0506@gmail.com';
    });

    // ===== misc =====
    document.getElementById('year').textContent = new Date().getFullYear();

    // CV download (si tu veux remplacer par un PDF hébergé, mets l'URL)
    document.getElementById('downloadCv').addEventListener('click', (e)=>{
      e.preventDefault();
      // Remplace le lien '#' par le vrai chemin du PDF (ex: '/assets/CV-Jean-Davy.pdf')
      // Si tu veux que je génère le .docx ou .pdf, dis-le moi.
      alert('Remplace le lien # dans le code par le chemin réel vers ton CV (ex: /assets/CV-Jean-Davy.pdf).');
    });

    // accessible focus ring polyfill for keyboard users (visual)
    document.addEventListener('keydown', function onFirstTab(e) {
      if (e.key === 'Tab') {
        document.documentElement.style.scrollBehavior = 'smooth';
        document.body.classList.add('user-is-tabbing');
        window.removeEventListener('keydown', onFirstTab);
      }
    });
  </script>
