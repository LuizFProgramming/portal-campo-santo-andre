(() => {
  const flagMap = [
    { file: 'br.png', lang: 'pt' },
    { file: 'esp.png', lang: 'es' },
    { file: 'eua.png', lang: 'en' }
  ];

  const setLanguage = (lang) => {
    const value = `/pt/${lang}`;
    document.cookie = `googtrans=${value};path=/`;
    document.cookie = `googtrans=${value};path=/;domain=${location.hostname}`;
    location.reload();
  };

  const wireFlags = () => {
    const images = Array.from(document.querySelectorAll('img[src*="assets/icons/"]'));
    images.forEach((img) => {
      const match = flagMap.find((item) => img.src.endsWith(`/${item.file}`));
      if (!match) return;
      const target = img.closest('span') || img;
      target.style.cursor = 'pointer';
      target.addEventListener('click', () => setLanguage(match.lang));
      target.setAttribute('role', 'button');
      target.setAttribute('tabindex', '0');
      target.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          setLanguage(match.lang);
        }
      });
    });
  };

  window.googleTranslateElementInit = () => {
    new window.google.translate.TranslateElement(
      { pageLanguage: 'pt', includedLanguages: 'pt,es,en', autoDisplay: false },
      'google_translate_element'
    );
  };

  const loadGoogleTranslate = () => {
    if (document.getElementById('google_translate_element')) return;
    const container = document.createElement('div');
    container.id = 'google_translate_element';
    container.style.display = 'none';
    document.body.appendChild(container);

    if (document.getElementById('google-translate-script')) return;
    const script = document.createElement('script');
    script.id = 'google-translate-script';
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    document.head.appendChild(script);
  };

  const init = () => {
    loadGoogleTranslate();
    wireFlags();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

window.ss_open_profile = window.ss_open_profile || function () {
  window.open('https://seal.atlas.globalsign.com/gss/profile/one?p1=www.campsantoandre.org.br&p2=3Q2Kg_P4hrI6F8vu83U-S5khMektPX8jq-XF_CE9A4I=&p3=gs', '_blank', 'noopener');
};

(() => {
  const sealImg = document.getElementById('ss_gmo_globalsign_img');
  if (!sealImg) return;

  const baseUrl = 'https://seal.atlas.globalsign.com/gss/one/image?p2=seal_100-50_en.png&p3=gs&p8=0';
  const host = (window.location.hostname || '').toLowerCase();
  const candidates = [];

  if (host.endsWith('campsantoandre.org.br')) {
    const noWww = host.replace(/^www\./, '');
    const withWww = noWww.startsWith('www.') ? noWww : `www.${noWww}`;
    candidates.push(noWww, withWww);
  } else {
    candidates.push('www.campsantoandre.org.br', 'campsantoandre.org.br');
  }

  const uniqueCandidates = [...new Set(candidates)].filter(Boolean);
  let idx = 0;

  const setCandidate = () => {
    if (idx >= uniqueCandidates.length) return;
    const domain = uniqueCandidates[idx];
    const src = `${baseUrl}&p1=${encodeURIComponent(domain)}`;
    sealImg.src = src;
  };

  sealImg.addEventListener('error', () => {
    idx += 1;
    setCandidate();
  });

  setCandidate();
})();

(() => {
  const STORAGE_KEY = 'camp_stats_session';
  const resolveStatsEndpoint = () => {
    const path = window.location.pathname || '/';
    let basePath = path;

    if (/\/(pages|admin)\//.test(path)) {
      basePath = path.replace(/\/(pages|admin)\/.*$/, '/');
    } else {
      basePath = path.replace(/\/[^/]*$/, '/');
    }

    return `${window.location.origin}${basePath}stats/track.php`;
  };

  const ENDPOINT = resolveStatsEndpoint();

  const getSessionId = () => {
    let sessionId = sessionStorage.getItem(STORAGE_KEY);
    if (!sessionId) {
      sessionId = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
      sessionStorage.setItem(STORAGE_KEY, sessionId);
    }
    return sessionId;
  };

  const detectDeviceType = () => {
    const ua = navigator.userAgent.toLowerCase();
    if (/mobile|iphone|ipod|android|ipad|tablet/.test(ua)) {
      return 'mobile';
    }
    return 'desktop';
  };

  const sendPayload = (payload) => {
    try {
      const body = JSON.stringify(payload);
      if (navigator.sendBeacon) {
        navigator.sendBeacon(ENDPOINT, body);
      } else {
        fetch(ENDPOINT, { method: 'POST', body, keepalive: true });
      }
    } catch (error) {
      // Ignore tracking errors to avoid breaking the site.
    }
  };

  const trackPageview = () => {
    const sessionId = getSessionId();
    sendPayload({
      event: 'pageview',
      path: window.location.pathname,
      session_id: sessionId,
      device_type: detectDeviceType(),
    });
  };

  const trackDuration = (startedAt) => {
    const durationMs = Date.now() - startedAt;
    if (durationMs < 1000) return;
    sendPayload({
      event: 'duration',
      duration_ms: durationMs,
    });
  };

  const initTracking = () => {
    const startedAt = Date.now();
    trackPageview();
    window.addEventListener('pagehide', () => trackDuration(startedAt));
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTracking);
  } else {
    initTracking();
  }
})();
