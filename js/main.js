// Desenvolvido por Luiz Fernando de Oliveira Matos
document.addEventListener('DOMContentLoaded', function () {
  const hamburger = document.getElementById('hamburger');
  const menuDrawer = document.getElementById('menuDrawer');
  const closeBtn = document.getElementById('closeBtn');
  const menuOverlay = document.getElementById('menuOverlay');
  const drawerToggles = document.querySelectorAll('.drawer-toggle');
  const menu = document.querySelector('.menu');
  const topbar = document.querySelector('.topbar');

  // Abrir menu
  hamburger?.addEventListener('click', function () {
    hamburger.classList.add('active');
    menuDrawer.classList.add('active');
    menuOverlay.classList.add('active');
  });

  // Fechar menu
  closeBtn?.addEventListener('click', closeMenu);
  menuOverlay?.addEventListener('click', closeMenu);

  function closeMenu() {
    hamburger.classList.remove('active');
    menuDrawer.classList.remove('active');
    menuOverlay.classList.remove('active');
  }

  // Toggle submenus no drawer
  drawerToggles.forEach(toggle => {
    toggle.addEventListener('click', function (e) {
      e.preventDefault();
      const submenu = this.nextElementSibling;
      submenu?.classList.toggle('active');
    });
  });

  // Fechar menu ao clicar em um link
  document.querySelectorAll('.drawer-links a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // ===== MENU ENCOLHENDO AO ROLAR =====
  if (menu) {
    const triggerOffset = (topbar?.offsetHeight || 40); // altura aproximada da topbar
    const isMobile = () => window.matchMedia('(max-width: 768px)').matches;

    const handleScroll = () => {
      if (isMobile()) {
        menu.classList.remove('menu--compact'); // desativa efeito no mobile
        return;
      }
      if (window.scrollY > triggerOffset) {
        menu.classList.add('menu--compact');
      } else {
        menu.classList.remove('menu--compact');
      }
    };

    // chama uma vez ao carregar (caso a página abra já rolada)
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
  }

  // Marca o link do menu correspondente a pagina atual
  const normalizePath = (value) => {
    if (!value) return '/index.html';
    let path = value.split('?')[0].split('#')[0];
    if (path.endsWith('/')) {
      path = `${path}index.html`;
    }
    return path;
  };

  const currentPath = normalizePath(window.location.pathname || '');
  const menuLinks = Array.from(document.querySelectorAll('.menu-links > li > a'));
  const drawerLinks = Array.from(document.querySelectorAll('.drawer-links a'));

  const setActiveLinks = (links) => {
    links.forEach((link) => {
      const href = link.getAttribute('href') || '';
      if (!href || href === '#') return;

      let linkPath = '';
      try {
        linkPath = new URL(href, window.location.origin).pathname;
      } catch (error) {
        return;
      }

      const normalizedLinkPath = normalizePath(linkPath);
      if (normalizedLinkPath === currentPath || currentPath.endsWith(normalizedLinkPath)) {
        link.classList.add('is-active');
      }
    });
  };

  setActiveLinks(menuLinks);
  setActiveLinks(drawerLinks);

  // Lazy loading global para imagens fora de carrossel
  const carouselScopeSelectors = [
    '.hero-carousel',
    '[data-structure-carousel]',
    '.history-media',
    '[data-presidents]',
    '.presidents-carousel',
    '.presidents-window',
  ];

  const isInsideCarousel = (img) =>
    carouselScopeSelectors.some((selector) => Boolean(img.closest(selector)));

  document.querySelectorAll('img').forEach((img) => {
    if (img.dataset.noLazy === 'true') return;
    if (img.hasAttribute('loading')) return;
    if (isInsideCarousel(img)) {
      img.setAttribute('loading', 'eager');
      return;
    }
    if (!img.hasAttribute('loading')) {
      img.setAttribute('loading', 'lazy');
    }
    if (!img.hasAttribute('decoding')) {
      img.setAttribute('decoding', 'async');
    }
  });

  // Toggle da secao "Nossa Estrutura"
  const structureStage = document.querySelector('[data-structure]');
  if (structureStage) {
    const panels = Array.from(structureStage.querySelectorAll('[data-panel]'));
    const buttons = Array.from(structureStage.querySelectorAll('[data-structure-target]'));

    const setActivePanel = (name) => {
      panels.forEach((panel) => {
        panel.classList.toggle('is-active', panel.dataset.panel === name);
      });
    };

    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        setActivePanel(button.dataset.structureTarget);
      });
    });
  }

  // Carrossel simples da estrutura
  document.querySelectorAll('[data-structure-carousel]').forEach((carousel) => {
    let imageList = (carousel.dataset.images || '').split('|').map((item) => item.trim()).filter(Boolean);
    const img = carousel.querySelector('.structure-carousel-image');
    const controls = carousel.querySelectorAll('.structure-carousel-btn');
    if (!img || controls.length === 0) return;

    const initialSrc = (img.getAttribute('src') || '').trim();
    if (initialSrc && !imageList.includes(initialSrc)) {
      imageList = [initialSrc, ...imageList];
    }
    if (imageList.length === 0) return;

    let index = Math.max(0, imageList.indexOf(initialSrc));

    const updateImage = (nextIndex) => {
      index = (nextIndex + imageList.length) % imageList.length;
      img.src = imageList[index];
    };

    controls.forEach((btn) => {
      btn.addEventListener('click', () => {
        const direction = Number(btn.dataset.dir || 0);
        updateImage(index + direction);
      });
    });
  });

  // Carrossel simples da historia
  const historyMedia = document.querySelector('.history-media');
  if (historyMedia) {
    let imageList = (historyMedia.dataset.historyImages || '').split('|').map((item) => item.trim()).filter(Boolean);
    const img = historyMedia.querySelector('.history-photo');
    const controls = historyMedia.querySelectorAll('.history-arrow');
    if (img) {
      const initialSrc = (img.getAttribute('src') || '').trim();
      if (initialSrc && !imageList.includes(initialSrc)) {
        imageList = [initialSrc, ...imageList];
      }
      if (imageList.length) {
        let index = Math.max(0, imageList.indexOf(initialSrc));

        const updateImage = (nextIndex) => {
          index = (nextIndex + imageList.length) % imageList.length;
          img.src = imageList[index];
        };

        controls.forEach((btn, btnIndex) => {
          btn.addEventListener('click', () => {
            const direction = btnIndex === 0 ? -1 : 1;
            updateImage(index + direction);
          });
        });
      }
    }
  }

  // Botao "voltar ao topo"
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  if (scrollTopBtn) {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion.matches ? 'auto' : 'smooth',
      });
    };

    const toggleVisibility = () => {
      scrollTopBtn.classList.toggle('is-visible', window.scrollY > 400);
    };

    scrollTopBtn.addEventListener('click', scrollToTop);
    toggleVisibility();
    window.addEventListener('scroll', toggleVisibility, { passive: true });
    window.addEventListener('resize', toggleVisibility);
  }

  // Copiar PIX
  const pixButtons = Array.from(document.querySelectorAll('.transport-pix-action'));
  if (pixButtons.length) {
    const copyText = async (text) => {
      if (!text) return false;
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      }
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'absolute';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);
      textarea.select();
      const success = document.execCommand('copy');
      document.body.removeChild(textarea);
      return success;
    };

    pixButtons.forEach((btn) => {
      btn.addEventListener('click', async () => {
        const box = btn.closest('.transport-pix-box');
        const value = box?.querySelector('.transport-pix-value')?.textContent?.trim();
        try {
          const ok = await copyText(value);
          if (ok) {
            const prevLabel = btn.getAttribute('aria-label') || '';
            const icon = btn.querySelector('i');
            const prevIconClass = icon?.className || '';
            btn.setAttribute('aria-label', 'PIX copiado!');
            btn.classList.add('is-copied');
            if (icon) {
              icon.className = 'bi bi-check2';
            }
            setTimeout(() => {
              btn.classList.remove('is-copied');
              if (icon) {
                icon.className = prevIconClass || 'bi bi-copy';
              }
              if (prevLabel) btn.setAttribute('aria-label', prevLabel);
            }, 1400);
          }
        } catch (e) {
          // silently ignore
        }
      });
    });
  }

  // Botao flutuante de info no mobile
  const mobileInfoFab = document.getElementById('mobileInfoFab');
  const mobileInfoPanel = document.getElementById('mobileInfoPanel');
  const mobileInfoBackdrop = document.getElementById('mobileInfoBackdrop');
  if (mobileInfoFab && mobileInfoPanel && mobileInfoBackdrop) {
    const contactBlock = Array.from(mobileInfoPanel.querySelectorAll('.mobile-info-block')).find((block) => {
      const title = block.querySelector('.mobile-info-title');
      return /canais de contato/i.test(title?.textContent || '');
    });

    if (contactBlock) {
      // Remove telefone fixo do card mobile.
      contactBlock.querySelectorAll('.mobile-info-card').forEach((card) => {
        const text = (card.textContent || '').toLowerCase();
        if (text.includes('11 2842-2470') || text.includes('fixo')) {
          card.remove();
        }
      });

      // Remove email institucional e card de login do painel mobile.
      contactBlock.querySelectorAll('.mobile-info-item').forEach((item) => {
        const href = (item.getAttribute('href') || '').toLowerCase();
        if (href.includes('mailto:camp@campsantoandre.org.br')) {
          const card = item.closest('.mobile-info-card');
          if (card) card.remove();
        }
      });
      contactBlock.querySelectorAll('.mobile-info-login').forEach((node) => node.remove());

      const ensureEmailCard = (email) => {
        const exists = contactBlock.querySelector(`a.mobile-info-item[href="mailto:${email}"]`);
        if (exists) return;

        const card = document.createElement('div');
        card.className = 'mobile-info-card';

        const link = document.createElement('a');
        link.className = 'mobile-info-item';
        link.href = `mailto:${email}`;
        link.innerHTML = `<i class="bi bi-envelope" aria-hidden="true"></i> ${email}`;

        card.appendChild(link);
        contactBlock.appendChild(card);
      };

      ensureEmailCard('comercial@campsantoandre.org.br');
      ensureEmailCard('estagio@campsantoandre.org.br');
    }

    const closeInfoPanel = () => {
      mobileInfoFab.classList.remove('is-open');
      mobileInfoPanel.classList.remove('is-open');
      mobileInfoBackdrop.classList.remove('is-open');
      mobileInfoPanel.setAttribute('aria-hidden', 'true');
    };

    const openInfoPanel = () => {
      mobileInfoFab.classList.add('is-open');
      mobileInfoPanel.classList.add('is-open');
      mobileInfoBackdrop.classList.add('is-open');
      mobileInfoPanel.setAttribute('aria-hidden', 'false');
    };

    mobileInfoFab.addEventListener('click', () => {
      if (mobileInfoPanel.classList.contains('is-open')) {
        closeInfoPanel();
      } else {
        openInfoPanel();
      }
    });

    mobileInfoBackdrop.addEventListener('click', closeInfoPanel);
  }

  // Toggle e filtros da secao "Equipe"
  const teamStage = document.querySelector('[data-team]');
  if (teamStage) {
    const panels = Array.from(teamStage.querySelectorAll('[data-panel]'));
    const navButtons = Array.from(teamStage.querySelectorAll('[data-team-target]'));
    const filterButtons = Array.from(teamStage.querySelectorAll('[data-team-filter]'));
    const members = Array.from(teamStage.querySelectorAll('[data-dept]'));
    const teamGrid = teamStage.querySelector('.team-grid');

    const setTeamPanel = (name) => {
      panels.forEach((panel) => {
        panel.classList.toggle('is-active', panel.dataset.panel === name);
      });
    };

    const animateTeamMembers = () => {
      if (!teamGrid) return;
      const visibleMembers = members.filter((member) => member.style.display !== 'none');

      teamGrid.classList.remove('is-animating');
      visibleMembers.forEach((member, index) => {
        member.style.animation = 'none';
        member.offsetHeight;
        member.style.animation = '';
        member.style.animationDelay = `${index * 60}ms`;
      });

      teamGrid.offsetHeight;
      teamGrid.classList.add('is-animating');

      if (teamGrid._animationTimer) {
        clearTimeout(teamGrid._animationTimer);
      }
      teamGrid._animationTimer = setTimeout(() => {
        teamGrid.classList.remove('is-animating');
      }, 600 + visibleMembers.length * 60);
    };

    const setFilter = (value) => {
      filterButtons.forEach((btn) => {
        btn.classList.toggle('is-active', btn.dataset.teamFilter === value);
      });
      members.forEach((member) => {
        const dept = member.dataset.dept;
        const show = value === 'all' || dept === value;
        member.style.display = show ? '' : 'none';
      });
      animateTeamMembers();
    };

    navButtons.forEach((button) => {
      button.addEventListener('click', () => {
        setTeamPanel(button.dataset.teamTarget);
      });
    });

    filterButtons.forEach((button) => {
      button.addEventListener('click', () => {
        setFilter(button.dataset.teamFilter);
      });
    });

    setFilter('all');
  }

  // Documentos institucionais: tabs e scroll
  const documentsSection = document.querySelector('.documents-section');
  if (documentsSection) {
    const tabs = Array.from(documentsSection.querySelectorAll('.documents-tab'));
    const yearLists = Array.from(documentsSection.querySelectorAll('.documents-list[data-doc-year]'));
    const scrollBody = documentsSection.querySelector('[data-doc-scroll]');
    const scrollButtons = Array.from(documentsSection.querySelectorAll('.documents-scroll-btn'));

    const setYear = (year) => {
      tabs.forEach((tab) => tab.classList.toggle('is-active', tab.dataset.docYear === year));
      yearLists.forEach((list) => {
        list.classList.toggle('is-active', list.dataset.docYear === year);
      });
      if (scrollBody) scrollBody.scrollTop = 0;
    };

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => setYear(tab.dataset.docYear));
    });

    scrollButtons.forEach((button) => {
      button.addEventListener('click', () => {
        if (!scrollBody) return;
        const direction = button.dataset.scrollDir === 'up' ? -1 : 1;
        scrollBody.scrollBy({ top: direction * 120, behavior: 'smooth' });
      });
    });

    if (tabs.length) setYear(tabs[0].dataset.docYear);
  }

  // Timeline de presidentes
  const presidents = document.querySelector('[data-presidents]');
  if (presidents) {
    const viewport = presidents.querySelector('.presidents-window');
    const track = presidents.querySelector('.presidents-track');
    const cards = Array.from(presidents.querySelectorAll('.president-card'));
    const prevBtn = presidents.querySelector('.presidents-arrow.prev');
    const nextBtn = presidents.querySelector('.presidents-arrow.next');
    const progressFill = document.querySelector('.presidents-progress-fill');
    const progressLabel = document.querySelector('.presidents-progress-label');
    const total = cards.length;

    if (viewport && track && total) {
      let index = 0;
      let ticking = false;

      const getGap = () => {
        const styles = window.getComputedStyle(track);
        const raw = styles.columnGap || styles.gap || '0px';
        const value = parseFloat(raw);
        return Number.isFinite(value) ? value : 0;
      };

      const getStep = () => {
        const first = cards[0];
        const width = first.getBoundingClientRect().width;
        return width + getGap();
      };

      const clampIndex = (value) => Math.max(0, Math.min(total - 1, value));

      const updateProgress = (activeIndex) => {
        cards.forEach((card, i) => card.classList.toggle('is-active', i === activeIndex));
        const percent = ((activeIndex + 1) / total) * 100;
        if (progressFill) progressFill.style.width = `${percent}%`;
        if (progressLabel) progressLabel.textContent = `${activeIndex + 1}/${total}`;
        if (prevBtn) prevBtn.disabled = activeIndex === 0;
        if (nextBtn) nextBtn.disabled = activeIndex === total - 1;
      };

      const scrollToIndex = (nextIndex) => {
        index = clampIndex(nextIndex);
        const left = index * getStep();
        viewport.scrollTo({ left, behavior: 'smooth' });
        updateProgress(index);
      };

      const syncFromScroll = () => {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(() => {
            const step = getStep() || 1;
            const current = Math.round(viewport.scrollLeft / step);
            index = clampIndex(current);
            updateProgress(index);
            ticking = false;
          });
        }
      };

      prevBtn?.addEventListener('click', () => {
        if (index === 0) return;
        scrollToIndex(index - 1);
      });

      nextBtn?.addEventListener('click', () => {
        if (index === total - 1) return;
        scrollToIndex(index + 1);
      });

      viewport.addEventListener('scroll', syncFromScroll, { passive: true });
      window.addEventListener('resize', () => scrollToIndex(index));
      updateProgress(index);
    }
  }

  // Trabalhe Conosco: formulario e confirmacao
  const careerStage = document.querySelector('[data-career]');
  if (careerStage) {
    const form = careerStage.querySelector('.career-form');
    const success = careerStage.querySelector('.career-success');
    const resetBtn = careerStage.querySelector('[data-career-reset]');
    const fileInput = careerStage.querySelector('#careerFile');
    const fileError = careerStage.querySelector('#careerFileError');
    const fileMeta = careerStage.querySelector('#careerFileMeta');
    const submitBtn = careerStage.querySelector('.career-submit');
    const maxSize = 5 * 1024 * 1024;

    const formatBytes = (bytes) => {
      if (!Number.isFinite(bytes)) return '';
      if (bytes < 1024) return `${bytes} B`;
      if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    const updateFileMeta = (file) => {
      if (!fileMeta) return;
      fileMeta.textContent = file ? `${file.name} • ${formatBytes(file.size)}` : '';
    };

    const setError = (message) => {
      if (fileError) fileError.textContent = message || '';
      if (submitBtn) submitBtn.disabled = Boolean(message);
    };

    const setView = (showSuccess) => {
      if (form) form.classList.toggle('is-hidden', showSuccess);
      if (success) success.classList.toggle('is-active', showSuccess);
    };

    if (fileInput) {
      fileInput.addEventListener('change', () => {
        const file = fileInput.files && fileInput.files[0];
        if (!file) {
          setError('');
          updateFileMeta(null);
          return;
        }
        if (file.size > maxSize) {
          setError('Arquivo maior que 5MB. Envie um arquivo de até 5MB.');
          fileInput.value = '';
          updateFileMeta(null);
          return;
        }
        setError('');
        updateFileMeta(file);
      });
    }

    form?.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      const file = fileInput?.files?.[0];
      if (!file || file.size > maxSize) {
        setError('Selecione um arquivo de até 5MB.');
        return;
      }
      const endpoint = form.getAttribute('action');
      if (!endpoint) {
        setError('Envio indisponível no momento.');
        return;
      }
      setError('');
      if (submitBtn) submitBtn.disabled = true;
      try {
        const payload = new FormData(form);
        const response = await fetch(endpoint, { method: 'POST', body: payload });
        const data = await response.json().catch(() => null);
        if (!response.ok || !data || !data.ok) {
          const message = data && data.message ? data.message : 'Nao foi possivel enviar seu curriculo. Tente novamente.';
          setError(message);
          if (submitBtn) submitBtn.disabled = false;
          return;
        }
        setView(true);
      } catch (err) {
        setError('Nao foi possivel enviar seu curriculo. Tente novamente.');
        if (submitBtn) submitBtn.disabled = false;
        return;
      }
    });

    resetBtn?.addEventListener('click', () => {
      if (form) form.reset();
      updateFileMeta(null);
      setError('');
      setView(false);
    });

    setView(false);
  }
});

// Carousel simples
(() => {
  const track = document.querySelector('.hero-track');
  const slides = Array.from(document.querySelectorAll('.hero-slide'));
  const prevBtn = document.querySelector('.hero-arrow.prev');
  const nextBtn = document.querySelector('.hero-arrow.next');
  const dotsContainer = document.querySelector('.hero-dots');
  if (!track || slides.length === 0 || !dotsContainer) return;

  let index = 0;
  let timer;

  // cria dots
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.setAttribute('aria-label', `Ir para slide ${i + 1}`);
    dot.addEventListener('click', () => goTo(i, true));
    dotsContainer.appendChild(dot);
  });
  const dots = Array.from(dotsContainer.children);

  function update() {
    slides.forEach((s, i) => s.classList.toggle('active', i === index));
    dots.forEach((d, i) => d.classList.toggle('active', i === index));
    track.style.transform = `translateX(-${index * 100}%)`;
  }

  function goTo(i, user = false) {
    index = (i + slides.length) % slides.length;
    update();
    if (user) restart();
  }

  function next() { goTo(index + 1); }
  function prev() { goTo(index - 1); }

  function start() {
    timer = setInterval(next, 6000);
  }

  function restart() {
    clearInterval(timer);
    start();
  }

  prevBtn?.addEventListener('click', () => { prev(); restart(); });
  nextBtn?.addEventListener('click', () => { next(); restart(); });

  track.addEventListener('pointerenter', () => clearInterval(timer));
  track.addEventListener('pointerleave', restart);

  update();
  start();
})();

// WhatsApp floating button + modal
window.addEventListener('DOMContentLoaded', () => {
  const fab = document.getElementById('whatsappFab');
  const modal = document.getElementById('whatsappModal');
  const backdrop = document.getElementById('whatsappBackdrop');
  const closeBtn = document.getElementById('whatsappClose');
  if (!fab || !modal || !backdrop || !closeBtn) return;

  const openModal = () => {
    modal.classList.add('is-open');
    backdrop.classList.add('is-open');
  };

  const closeModal = () => {
    modal.classList.remove('is-open');
    backdrop.classList.remove('is-open');
  };

  fab.addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', closeModal);
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeModal();
  });
});

// Carrossel de empresas em esteira
(() => {
  const track = document.getElementById('companiesTrack');
  const prev = document.getElementById('companiesPrev');
  const next = document.getElementById('companiesNext');
  const viewport = document.querySelector('.companies-viewport');

  if (!track || !viewport) return;

  
  const getCompaniesBasePath = () => {
    const path = window.location.pathname || '';
    if (path.includes('/pages/')) {
      return '../';
    }
    return '';
  };
  const companiesBasePath = getCompaniesBasePath();
const companies = [
    { src: 'assets/images/empresas_parceiras/Açofer.png', alt: 'Açofer' },
    { src: 'assets/images/empresas_parceiras/Adria.png', alt: 'Adria' },
    { src: 'assets/images/empresas_parceiras/Albatroz.png', alt: 'Albatroz' },
    { src: 'assets/images/empresas_parceiras/Anchieta Peças.png', alt: 'Anchieta Peças' },
    { src: 'assets/images/empresas_parceiras/Armarinhos Fernando.jpg', alt: 'Armarinhos Fernando' },
    { src: 'assets/images/empresas_parceiras/Bandeirante Quimica.png', alt: 'Bandeirante Quimica' },
    { src: 'assets/images/empresas_parceiras/BDP.png', alt: 'BDP' },
    { src: 'assets/images/empresas_parceiras/Bridgestone.png', alt: 'Bridgestone' },
    { src: 'assets/images/empresas_parceiras/Cabot.png', alt: 'Cabot' },
    { src: 'assets/images/empresas_parceiras/Cartorio.png', alt: 'Cartório' },
    { src: 'assets/images/empresas_parceiras/CBC.png', alt: 'CBC' },
    { src: 'assets/images/empresas_parceiras/Chevron.png', alt: 'Chevron' },
    { src: 'assets/images/empresas_parceiras/China Glass.jpg', alt: 'China Glass' },
    { src: 'assets/images/empresas_parceiras/Cidade Elshadai.png', alt: 'Cidade Elshadai' },
    { src: 'assets/images/empresas_parceiras/Comercial AJA.png', alt: 'Comercial AJA' },
    { src: 'assets/images/empresas_parceiras/Contemp.png', alt: 'Contemp' },
    { src: 'assets/images/empresas_parceiras/Copafer.jpg', alt: 'Copafer' },
    { src: 'assets/images/empresas_parceiras/Creche São Jeronimo.jpg', alt: 'Creche São Jeronimo' },
    { src: 'assets/images/empresas_parceiras/Cromus.png', alt: 'Cromus' },
    { src: 'assets/images/empresas_parceiras/Curaprox.png', alt: 'Curaprox' },
    { src: 'assets/images/empresas_parceiras/Dalferinox.jpg', alt: 'Dalferinox' },
    { src: 'assets/images/empresas_parceiras/Dctech Systems.png', alt: 'Dctech Systems' },
    { src: 'assets/images/empresas_parceiras/Diguinho.png', alt: 'Diguinho' },
    { src: 'assets/images/empresas_parceiras/Dimensional Sonepar.png', alt: 'Dimensional Sonepar' },
    { src: 'assets/images/empresas_parceiras/Divino fogão.png', alt: 'Divino Fogão' },
    { src: 'assets/images/empresas_parceiras/Eagletronica.png', alt: 'Eagletronica' },
    { src: 'assets/images/empresas_parceiras/ECCO BRAZ.png', alt: 'ECCO BRAZ' },
    { src: 'assets/images/empresas_parceiras/Educandário Simão Pedro.jpg', alt: 'Educandário Simão Pedro' },
    { src: 'assets/images/empresas_parceiras/Eletro Forte.jpg', alt: 'Eletro Forte' },
    { src: 'assets/images/empresas_parceiras/Elinox.png', alt: 'Elinox' },
    { src: 'assets/images/empresas_parceiras/Engemet.jpg', alt: 'Engemet' },
    { src: 'assets/images/empresas_parceiras/Escad.png', alt: 'Escad' },
    { src: 'assets/images/empresas_parceiras/Espacial.jpg', alt: 'Espacial' },
    { src: 'assets/images/empresas_parceiras/Eurobras.png', alt: 'Eurobras' },
    { src: 'assets/images/empresas_parceiras/Everlab.jpg', alt: 'Everlab' },
    { src: 'assets/images/empresas_parceiras/Fonte do Sofá.jpg', alt: 'Fonte do Sofá' },
    { src: 'assets/images/empresas_parceiras/Formtap.png', alt: 'Formtap' },
    { src: 'assets/images/empresas_parceiras/Fraternidade Menino Jesus.png', alt: 'Fraternidade Menino Jesus' },
    { src: 'assets/images/empresas_parceiras/Goiania Mauá.png', alt: 'Goiania Mauá' },
    { src: 'assets/images/empresas_parceiras/Grupo Stilo.png', alt: 'Grupo Stilo' },
    { src: 'assets/images/empresas_parceiras/Grupo Toriba.jpg', alt: 'Grupo Toriba' },
    { src: 'assets/images/empresas_parceiras/H.M Consultoria.png', alt: 'H.M Consultoria' },
    { src: 'assets/images/empresas_parceiras/IALP.png', alt: 'IALP' },
    { src: 'assets/images/empresas_parceiras/Instituição Amélia Rodrigues.jpg', alt: 'Instituição Amélia Rodrigues' },
    { src: 'assets/images/empresas_parceiras/JFO SERVICE.jpg', alt: 'JFO SERVICE' },
    { src: 'assets/images/empresas_parceiras/logo Amemiya.png', alt: 'logo Amemiya' },
    { src: 'assets/images/empresas_parceiras/logo_grupo_activas.png', alt: 'logo_grupo_activas' },
    { src: 'assets/images/empresas_parceiras/Lojas Mel.jpg', alt: 'Lojas Mel' },
    { src: 'assets/images/empresas_parceiras/M dias Branco.png', alt: 'M dias Branco' },
    { src: 'assets/images/empresas_parceiras/Magneti Marelli.png', alt: 'Magneti Marelli' },
    { src: 'assets/images/empresas_parceiras/Martini Advogados.jpg', alt: 'Martini Advogados' },
    { src: 'assets/images/empresas_parceiras/Masticmol.png', alt: 'Masticmol' },
    { src: 'assets/images/empresas_parceiras/Mauá Plaza.png', alt: 'Mauá Plaza' },
    { src: 'assets/images/empresas_parceiras/MEGA METAL.png', alt: 'MEGA METAL' },
    { src: 'assets/images/empresas_parceiras/Meimei.png', alt: 'Meimei' },
    { src: 'assets/images/empresas_parceiras/Mercado Herbio.jpg', alt: 'Mercado Herbio' },
    { src: 'assets/images/empresas_parceiras/Micro Parts.png', alt: 'Micro Parts' },
    { src: 'assets/images/empresas_parceiras/Mini mercado Tonaki.jpg', alt: 'Mini mercado Tonaki' },
    { src: 'assets/images/empresas_parceiras/Mitsui.png', alt: 'Mitsui' },
    { src: 'assets/images/empresas_parceiras/NILPEL.png', alt: 'NILPEL' },
    { src: 'assets/images/empresas_parceiras/Nivalmix.jpg', alt: 'Nivalmix' },
    { src: 'assets/images/empresas_parceiras/Objetivo Colégio.jpg', alt: 'Objetivo Colégio' },
    { src: 'assets/images/empresas_parceiras/Odonto Company.png', alt: 'Odonto Company' },
    { src: 'assets/images/empresas_parceiras/Paranapanema.png', alt: 'Paranapanema' },
    { src: 'assets/images/empresas_parceiras/Pentágono.png', alt: 'Pentágono' },
    { src: 'assets/images/empresas_parceiras/Peralta Ambiental.jpg', alt: 'Peralta Ambiental' },
    { src: 'assets/images/empresas_parceiras/Plastifama.png', alt: 'Plastifama' },
    { src: 'assets/images/empresas_parceiras/Pneus Technic.jpg', alt: 'Pneus Technic' },
    { src: 'assets/images/empresas_parceiras/Ponto Forte.jpg', alt: 'Ponto Forte' },
    { src: 'assets/images/empresas_parceiras/PP FILME.jpg', alt: 'PP FILME' },
    { src: 'assets/images/empresas_parceiras/Quality Fix.jpg', alt: 'Quality Fix' },
    { src: 'assets/images/empresas_parceiras/Rassini.png', alt: 'Rassini' },
    { src: 'assets/images/empresas_parceiras/Real Food.png', alt: 'Real Food' },
    { src: 'assets/images/empresas_parceiras/Real Refrigeração.jpg', alt: 'Real Refrigeração' },
    { src: 'assets/images/empresas_parceiras/Realtec Engenharia.png', alt: 'Realtec Engenharia' },
    { src: 'assets/images/empresas_parceiras/Recanto Somasquinho.jpg', alt: 'Recanto Somasquinho' },
    { src: 'assets/images/empresas_parceiras/Rede Alimentos Embalagens.jpg', alt: 'Rede Alimentos Embalagens' },
    { src: 'assets/images/empresas_parceiras/Reyle.png', alt: 'Reyle' },
    { src: 'assets/images/empresas_parceiras/Rhodia.jpg', alt: 'Rhodia' },
    { src: 'assets/images/empresas_parceiras/Saint Gobain Sekurit.jpg', alt: 'Saint Gobain Sekurit' },
    { src: 'assets/images/empresas_parceiras/SANDEFER.png', alt: 'SANDEFER' },
    { src: 'assets/images/empresas_parceiras/Sete Dia Sacolão.png', alt: 'Sete Dia Sacolão' },
    { src: 'assets/images/empresas_parceiras/Shopping Center Leste.png', alt: 'Shopping Center Leste' },
    { src: 'assets/images/empresas_parceiras/Sincomercio.jpg', alt: 'Sincomercio' },
    { src: 'assets/images/empresas_parceiras/SMPV.png', alt: 'SMPV' },
    { src: 'assets/images/empresas_parceiras/Superdisplay.jpg', alt: 'Superdisplay' },
    { src: 'assets/images/empresas_parceiras/Supermercado Fenicia.png', alt: 'Supermercado Fenicia' },
    { src: 'assets/images/empresas_parceiras/Supermercado São Judas.png', alt: 'Supermercado São Judas' },
    { src: 'assets/images/empresas_parceiras/Tecno Print.jpg', alt: 'Tecno Print' },
    { src: 'assets/images/empresas_parceiras/Tenneco.jpg', alt: 'Tenneco' },
    { src: 'assets/images/empresas_parceiras/Tury do Brasil.jpg', alt: 'Tury do Brasil' },
    { src: 'assets/images/empresas_parceiras/Ubs.png', alt: 'Ubs' },
    { src: 'assets/images/empresas_parceiras/Udlog.png', alt: 'Udlog' },
    { src: 'assets/images/empresas_parceiras/Unipar.png', alt: 'Unipar' },
    { src: 'assets/images/empresas_parceiras/Unotech.jpg', alt: 'Unotech' },
    { src: 'assets/images/empresas_parceiras/Veloce.jpg', alt: 'Veloce' },
    { src: 'assets/images/empresas_parceiras/VERTAS.png', alt: 'VERTAS' },
    { src: 'assets/images/empresas_parceiras/Vidrolandia.png', alt: 'Vidrolandia' },
    { src: 'assets/images/empresas_parceiras/Vitrocolor.jpg', alt: 'Vitrocolor' },
    { src: 'assets/images/empresas_parceiras/White Martins.png', alt: 'White Martins' }
  ];


  const PAGE_SIZE = 50;
  const speed = 0.4;
  let animationId;
  let isPaused = false;

  viewport.style.scrollSnapType = 'none';

  const renderCompanies = () => {
    const slice = companies.slice(0, PAGE_SIZE);
    const items = slice
      .map((company) => {
        const safeSrc = encodeURI(companiesBasePath + company.src);
        return `<div class="company-card"><img src="${safeSrc}" alt="${company.alt}" loading="lazy" decoding="async"></div>`;
      })
      .join('');

    track.innerHTML = items + items;
  };

  const start = () => {
    const step = () => {
      if (!isPaused) {
        viewport.scrollLeft += speed;
        const loopPoint = track.scrollWidth / 2;
        if (viewport.scrollLeft >= loopPoint) {
          viewport.scrollLeft = 0;
        }
      }
      animationId = requestAnimationFrame(step);
    };

    animationId = requestAnimationFrame(step);
  };

  const stop = () => {
    if (animationId) cancelAnimationFrame(animationId);
    animationId = null;
  };

  prev?.addEventListener('click', () => {
    viewport.scrollLeft = Math.max(0, viewport.scrollLeft - viewport.clientWidth);
  });

  next?.addEventListener('click', () => {
    viewport.scrollLeft += viewport.clientWidth;
  });

  viewport.addEventListener('pointerenter', () => {
    isPaused = true;
  });

  viewport.addEventListener('pointerleave', () => {
    isPaused = false;
  });

  window.addEventListener('resize', () => {
    const loopPoint = track.scrollWidth / 2;
    if (viewport.scrollLeft >= loopPoint) {
      viewport.scrollLeft = 0;
    }
  });

  renderCompanies();
  start();
})();

// Reveal footer blocks on scroll
(function () {
  var footer = document.querySelector('.site-footer');
  if (!footer) return;

  var revealItems = footer.querySelectorAll('.footer-reveal');
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('footer-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  revealItems.forEach(function (item) {
    observer.observe(item);
  });
})();



 (function () {
    var section = document.querySelector('.numbers-section');
    if (!section) {
      return;
    }

    var reveals = section.querySelectorAll('.numbers-reveal');
    var counters = section.querySelectorAll('.numbers-count');
    var hasAnimated = false;

    function formatNumber(value) {
      return value.toLocaleString('pt-BR');
    }

    function animateCounters() {
      counters.forEach(function (counter) {
        var target = parseInt(counter.getAttribute('data-count'), 10) || 0;
        var duration = 1400;
        var start = performance.now();

        function step(now) {
          var progress = Math.min((now - start) / duration, 1);
          var current = Math.floor(progress * target);
          counter.textContent = formatNumber(current);
          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            counter.textContent = formatNumber(target);
          }
        }

        requestAnimationFrame(step);
      });
    }

    function revealItems() {
      reveals.forEach(function (item, index) {
        item.style.transitionDelay = (index * 80) + 'ms';
        item.classList.add('is-visible');
      });
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !hasAnimated) {
          hasAnimated = true;
          revealItems();
          animateCounters();
          observer.disconnect();
        }
      });
    }, { threshold: 0.35 });

    observer.observe(section);
  })();
