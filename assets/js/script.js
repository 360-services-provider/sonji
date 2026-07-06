// Sticky Header effect on scroll
window.addEventListener('scroll', () => {
  const header = document.querySelector('header');
  if (header) {
    header.classList.toggle('scrolled', window.scrollY > 20);
  }
});

// Smooth scroll implementation for local anchors
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth'
      });
    }
  });
});

/* ==========================================================================
   Figma Mode Interaction Script
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  const figmaContainer = document.getElementById('figma-container');
  const toggleBtn = document.getElementById('figma-mode-toggle');
  const playBtn = document.getElementById('play-mode-btn');
  const layersList = document.getElementById('layers-list');
  const selectedLayerName = document.getElementById('selected-layer-name');
  const cssSpecContent = document.getElementById('css-spec-content');
  const frameHeightDisplay = document.getElementById('frame-height-display');

  if (!figmaContainer) return;

  // Initialize Figma Mode (Force enabled)
  const initFigmaMode = () => {
    disableFigmaMode();
  };

  const enableFigmaMode = () => {
    figmaContainer.classList.remove('figma-mode-disabled');
    figmaContainer.classList.add('figma-mode-enabled');
    if (toggleBtn) {
      toggleBtn.classList.add('in-figma-mode');
      const span = toggleBtn.querySelector('span');
      if (span) span.textContent = 'Preview Live Site';
    }
    if (window.innerWidth > 768) {
      document.body.style.overflow = 'hidden'; // Lock browser scroll
    } else {
      document.body.style.overflow = ''; // Allow browser scroll on mobile
    }
    
    // Auto-update frame height value in sidebar
    const desktopFrame = document.getElementById('desktop-frame');
    if (desktopFrame && frameHeightDisplay) {
      frameHeightDisplay.textContent = desktopFrame.offsetHeight;
    }
    
    // Refresh layers list
    buildLayersList();
  };

  const disableFigmaMode = () => {
    figmaContainer.classList.remove('figma-mode-enabled');
    figmaContainer.classList.add('figma-mode-disabled');
    document.body.style.overflow = '';
  };

  // Toggle events (Disabled to enforce Figma-only mode)

  // Build the list of layers dynamically based on elements inside the website viewport
  const buildLayersList = () => {
    if (!layersList) return;
    layersList.innerHTML = '';

    // Find all sections or main layout blocks
    const sections = document.querySelectorAll('.website-viewport > section, .website-viewport > footer');
    sections.forEach((section, idx) => {
      const id = section.getAttribute('id') || `section-${idx}`;
      let name = section.className.split(' ')[0].replace('-section', '');
      
      // Capitalize and format name
      name = name.charAt(0).toUpperCase() + name.slice(1);
      if (section.tagName.toLowerCase() === 'footer') name = 'Footer';
      if (name.includes('-')) name = name.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

      const li = document.createElement('li');
      li.innerHTML = `
        <a class="layer-link" data-target="${id}">
          <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor" style="opacity:0.6; margin-right:4px;"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
          ❖ ${name} Section
        </a>
      `;

      const link = li.querySelector('.layer-link');
      link.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Remove active class from all links
        document.querySelectorAll('.layer-link').forEach(l => l.classList.remove('active'));
        link.classList.add('active');

        // Scroll section into view inside canvas
        const targetSec = document.getElementById(id);
        if (targetSec) {
          targetSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
          
          // Add outline selector highlight effect on target frame
          document.querySelectorAll('.website-viewport > section, .website-viewport > footer').forEach(s => {
            s.style.outline = 'none';
            s.style.outlineOffset = '0';
          });
          targetSec.style.outline = '2px solid #18a0fb';
          targetSec.style.outlineOffset = '-2px';

          // Update sidebar design spec panel
          if (selectedLayerName) selectedLayerName.textContent = `❖ ${name} Section`;
          if (cssSpecContent) {
            updateCSSInspector(name, id);
          }
        }
      });

      layersList.appendChild(li);
    });
  };

  // Generate mock CSS code for inspected elements
  const updateCSSInspector = (name, id) => {
    const el = document.getElementById(id);
    if (!el) return;

    const styles = window.getComputedStyle(el);
    const bg = styles.backgroundColor;
    const padding = styles.padding;
    const border = styles.borderBottom;

    cssSpecContent.textContent = `/* CSS Spec for #${id} */
#${id} {
  display: flex;
  background: ${bg};
  padding: ${padding};
  border-bottom: ${border};
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
}`;
  };

  // Premium Mouse Hover Tilt Effect for interactive cards
  const applyTiltEffect = () => {
    const cards = document.querySelectorAll('.interactive-card');
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left; // x position within element
        const y = e.clientY - rect.top;  // y position within element
        
        const xc = rect.width / 2;
        const yc = rect.height / 2;
        
        // Calculate tilt angle (max 10 degrees tilt)
        const angleX = (yc - y) / 10;
        const angleY = (x - xc) / 10;
        
        card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) translateY(-8px) scale(1.02)`;
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)';
        card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
      });

      card.addEventListener('mouseenter', () => {
        card.style.transition = 'none'; // Disengage transition for fluid mouse tracking
      });
    });
  };

  // 3D Cubes Animation — driven entirely by CSS @keyframes
  // (entrance + continuous float are declared in main.css)
  // This function is kept as a hook for future scroll-parallax additions.
  const initCubesAnimation = () => {
    const heroSection = document.getElementById('hero-section');
    if (!heroSection) return;
    // CSS handles all animation — nothing to do in JS
  };

  // Carousel Initialization
  const initCarousel = () => {
    const wrapper = document.getElementById('ai-carousel');
    if (!wrapper) return;

    const slides = Array.from(wrapper.querySelectorAll('.carousel-slide'));
    const nextBtn = wrapper.querySelector('.next-btn');
    const prevBtn = wrapper.querySelector('.prev-btn');
    let currentIndex = 0;

    const updateCarousel = () => {
      slides.forEach((slide, index) => {
        slide.classList.remove('active', 'prev', 'next', 'hidden');
        if (index === currentIndex) {
          slide.classList.add('active');
        } else if (index === (currentIndex - 1 + slides.length) % slides.length) {
          slide.classList.add('prev');
        } else if (index === (currentIndex + 1) % slides.length) {
          slide.classList.add('next');
        } else {
          slide.classList.add('hidden');
        }
      });
    };

    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % slides.length;
      updateCarousel();
    });

    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      updateCarousel();
    });

    // Make side slides clickable to navigate
    slides.forEach((slide) => {
      slide.addEventListener('click', (e) => {
        if (slide.classList.contains('prev')) {
          currentIndex = (currentIndex - 1 + slides.length) % slides.length;
          updateCarousel();
        } else if (slide.classList.contains('next')) {
          currentIndex = (currentIndex + 1) % slides.length;
          updateCarousel();
        }
      });
    });

    updateCarousel();
  };

  // Infinite Marquee Initialization
  const initMarquee = () => {
    const track = document.querySelector('#crypto-marquee .marquee-track');
    if (!track) return;
    
    // Get original items
    const items = Array.from(track.children);
    
    // Duplicate 2 times so we have 3 identical sets
    items.forEach(item => {
      track.appendChild(item.cloneNode(true));
    });
    items.forEach(item => {
      track.appendChild(item.cloneNode(true));
    });
    
    track.style.animation = 'marquee-scroll 20s linear infinite';
  };

  // Run initializer
  initFigmaMode();
  applyTiltEffect();
  initCubesAnimation();
  initCarousel();
  initMarquee();
  initGTMExpert();
  initFullGTMTool();
});

/* ==========================================================================
   GTM / CTA Expert Interactive Logic
   ========================================================================== */
function initGTMExpert() {
  const modeButtons   = document.querySelectorAll('.gtm-mode-btn');
  const activeLabel   = document.getElementById('gtm-active-label');
  const generateBtn   = document.getElementById('gtm-generate-btn');
  const outputContainer = document.getElementById('gtm-output');
  const textInput     = document.getElementById('gtm-input');

  if (!generateBtn || !outputContainer) return;

  const modeLabels = {
    launch:  'Launch Campaign Mode',
    adcopy:  'Ad Copy Mode',
    cta:     'CTA Generator Mode',
    abtest:  'A/B Testing Mode'
  };

  const modeOutputs = {
    launch: [
      { type: 'GTM Strategy — Phase 1', text: '"Identify early adopters via LinkedIn outreach + Product Hunt launch. Target 500 signups in 14 days."', score: '96/100', channel: '🗺 Full Strategy', featured: true },
      { type: 'Value Prop Statement',   text: '"The fastest way to launch premium digital products — from idea to market in one platform."', score: '91/100', channel: '📌 Website Hero' },
      { type: 'Channel Recommendation', text: '"Focus on LinkedIn Ads + SEO content for B2B. Launch email drip sequence on Day 0."', score: '84/100', channel: '📣 Multi-Channel' }
    ],
    adcopy: [
      { type: 'Power Headline', text: '"Stop Wasting Hours on Design. Ship Premium UI in Minutes."', score: '95/100', channel: '📰 Google Ads', featured: true },
      { type: 'Emotional Hook', text: '"Your competitors are already using AI assets. Are you?"', score: '89/100', channel: '📱 Social Media' },
      { type: 'Pain-Point Opener', text: '"Tired of generic templates? Get design stock that actually converts."', score: '83/100', channel: '📧 Email Subject' }
    ],
    cta: [
      { type: 'Conversion CTA', text: '"Start Building for Free — No Credit Card Needed"', score: '97/100', channel: '🖥 Landing Page', featured: true },
      { type: 'Urgency CTA', text: '"Claim Your Spot — Only 200 Early Access Seats Left"', score: '88/100', channel: '⚡ Pop-up Banner' },
      { type: 'Value CTA', text: '"Get 500+ Premium Assets — Join Free Today"', score: '81/100', channel: '📲 Mobile Button' }
    ],
    abtest: [
      { type: 'Variant A — Direct',   text: '"Sign Up Free"', score: 'Est. CTR: 4.2%', channel: '⚖️ A vs B Test', featured: true },
      { type: 'Variant B — Value',    text: '"Get Free Access"', score: 'Est. CTR: 5.8%', channel: '⚖️ A vs B Test' },
      { type: 'Variant C — Urgency',  text: '"Join Now — Limited Spots"', score: 'Est. CTR: 6.1%', channel: '⚖️ A vs B Test' }
    ]
  };

  let currentMode = 'launch';

  // Mode switching
  modeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      modeButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentMode = btn.dataset.mode;
      if (activeLabel) activeLabel.textContent = modeLabels[currentMode];
      if (textInput) {
        const hints = {
          launch: "Describe your product and target launch goals…",
          adcopy: "Enter your product name and core benefit…",
          cta:    "Describe your offer and desired user action…",
          abtest: "Enter what you want to test (button text, headline, etc.)…"
        };
        textInput.placeholder = hints[currentMode];
      }
    });
  });

  // Generate button logic
  generateBtn.addEventListener('click', () => {
    generateBtn.classList.add('loading');
    generateBtn.innerHTML = `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" class="spin-icon"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg> Generating…`;

    setTimeout(() => {
      const outputs = modeOutputs[currentMode];
      renderOutputCards(outputs);

      generateBtn.classList.remove('loading');
      generateBtn.innerHTML = `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg> Generate`;
    }, 1200);
  });

  // Render output cards
  function renderOutputCards(outputs) {
    outputContainer.innerHTML = '';
    outputs.forEach((item, i) => {
      const card = document.createElement('div');
      card.className = 'gtm-output-card' + (item.featured ? ' featured' : '');
      card.style.animationDelay = `${i * 0.1}s`;

      card.innerHTML = `
        ${item.featured ? '<div class="gtm-output-badge">⭐ Best Match</div>' : ''}
        <div class="gtm-output-type">${item.type}</div>
        <div class="gtm-output-text">${item.text}</div>
        <div class="gtm-output-meta">
          <span class="gtm-score">${item.score}</span>
          <span class="gtm-channel">${item.channel}</span>
        </div>
        <div class="gtm-output-actions">
          <button class="btn btn-sm gtm-copy-btn">Copy</button>
          <button class="btn btn-secondary btn-sm">Refine</button>
        </div>
      `;

      // Copy button handler
      card.querySelector('.gtm-copy-btn').addEventListener('click', function() {
        const text = item.text.replace(/^"|"$/g, '');
        navigator.clipboard.writeText(text).then(() => {
          this.textContent = '✓ Copied!';
          setTimeout(() => { this.textContent = 'Copy'; }, 2000);
        });
      });

      outputContainer.appendChild(card);
    });
  }
}

/* ==========================================================================
   Full GTM / CTA Dedicated Tool Logic
   ========================================================================== */
function initFullGTMTool() {
  const generateBtn = document.getElementById('full-tool-generate-btn');
  const resultsContainer = document.getElementById('full-tool-results');
  const tonePills = document.querySelectorAll('.tone-pill');
  const tabButtons = document.querySelectorAll('.result-tab');
  const tabPanels = document.querySelectorAll('.tab-panel');
  const emptyState = document.getElementById('empty-state');
  const savedCountBadge = document.getElementById('saved-count');
  const exportAllBtn = document.getElementById('export-all-btn');
  const clearSavedBtn = document.getElementById('clear-saved-btn');
  
  if (!generateBtn || !resultsContainer) return;

  // Tone Selection
  let selectedTone = 'bold';
  tonePills.forEach(pill => {
    pill.addEventListener('click', () => {
      tonePills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      selectedTone = pill.dataset.tone;
    });
  });

  // State Management
  let currentOutputs = {
    gtm: {},
    cta: {},
    messaging: {}
  };

  let savedAssets = JSON.parse(localStorage.getItem('gtm_saved_assets') || '[]');
  updateSavedBadge();

  // Templates Dictionary
  const templates = {
    gtm: {
      audienceSummary: {
        title: "Target Audience Summary",
        tag: "GTM Strategy",
        variations: [
          (p, a, i, o, g, c, d) => `Primary target audience consists of ${a || 'early-stage founders'} operating within the ${i || 'SaaS'} sector. They face intense competition, require agile toolsets, and look for immediate execution velocity.`,
          (p, a, i, o, g, c, d) => `Focusing on high-growth ${a || 'growth marketers'} in the ${i || 'e-commerce'} space. They are characterized by a strong focus on key conversion metrics and immediate ROI validation for ${p}.`
        ]
      },
      persona: {
        title: "ICP / Buyer Persona Snapshot",
        tag: "GTM Persona",
        variations: [
          (p, a, i, o, g, c, d) => `**ICP Profile: The Growth Architect**\n- **Role:** Head of Growth, Marketing Director, or Technical Founder.\n- **Key Pain Point:** Wasting resources on non-converting ad spend.\n- **Value Driver:** Turnkey messaging systems like ${p} that guarantee rapid market testing.`,
          (p, a, i, o, g, c, d) => `**ICP Profile: The Efficiency Professional**\n- **Role:** Product Manager or Agency lead targeting ${i || 'B2B Tech'}.\n- **Behavior:** Obsessed with micro-conversions, landing page performance, and risk reversal techniques.`
        ]
      },
      positioning: {
        title: "Strategic Positioning Statement",
        tag: "GTM Positioning",
        variations: [
          (p, a, i, o, g, c, d) => `For ${a || 'founders'} who are tired of high acquisition costs, ${p} is the conversion strategy framework in the ${i || 'modern space'} that transforms static campaigns into high-converting assets.`,
          (p, a, i, o, g, c, d) => `Unlike generic copywriting tools, ${p} provides ${a || 'marketers'} with a direct, psychology-backed campaign launchpad tailored specifically for ${i || 'the creator economy'}.`
        ]
      },
      painpoints: {
        title: "Key Pain Points Addressed",
        tag: "Pain Points",
        variations: [
          (p, a, i, o, g, c, d) => `1. **High CAC:** Extreme ad fatigue on ${c || 'paid socials'} causing high acquisition overhead.\n2. **Slow Deployment:** Bottlenecks in engineering and copy coordination.\n3. **Low Conversion:** High landing page bounce rates on standard CTA blocks.`,
          (p, a, i, o, g, c, d) => `1. **Friction Fatigue:** Too many form fields and secondary choices confusing users.\n2. **Weak Value Props:** Messaging that focuses on features instead of outcomes.\n3. **Unoptimized Offers:** Offers that lack proper risk-reversal mechanics (${o || 'free trials'}).`
        ]
      },
      usp: {
        title: "Differentiators & USP",
        tag: "USP Profile",
        variations: [
          (p, a, i, o, g, c, d) => `Combines psychology-centric copy layout rules with instant implementation guides. Fine-tuned specifically for ${i || 'conversion marketing'} with a native layout aesthetic.`,
          (p, a, i, o, g, c, d) => `Offers modular, hot-swappable positioning hooks and copy variations designed to fit modern responsive viewports with zero design overhead.`
        ]
      },
      pillars: {
        title: "Messaging Pillars",
        tag: "Brand Core",
        variations: [
          (p, a, i, o, g, c, d) => `1. **Extreme Velocity:** Shift from concept to campaign in minutes.\n2. **Conversion First:** Every line of copy must earn its viewport space.\n3. **Risk Eradication:** Lead with a strong ${o || 'risk-free offer'} to boost trust.`,
          (p, a, i, o, g, c, d) => `1. **Clarity over Cleverness:** Eliminate marketing jargon in favor of direct benefit.\n2. **Native UX Harmony:** Ensure elements feel integrated with the user's software environment.\n3. **Immediate Utility:** Let users touch and try the value before asking for commitments.`
        ]
      },
      launchAngles: {
        title: "Launch Angle Ideas",
        tag: "Launch Concept",
        variations: [
          (p, a, i, o, g, c, d) => `**Angle A (The Catalyst):** "Stop building page elements from scratch. Deploy conversion-backed campaign structures in seconds."\n**Angle B (The Data Check):** "The marketing playbook backed by over 10,000 recorded user sessions."`,
          (p, a, i, o, g, c, d) => `**Angle A (Risk Reversal Focus):** "Deploy ${p} with absolute peace of mind. Zero commitments, maximum visual authority."\n**Angle B (The Modern Contrast):** "Why growth agencies are abandoning generic layouts for native, high-fidelity components."`
        ]
      },
      channels: {
        title: "Recommended Channels",
        tag: "Channels",
        variations: [
          (p, a, i, o, g, c, d) => `Deploy sponsored copy campaigns on ${c || 'LinkedIn Ads'} targeting specific roles (e.g. CMO, Growth Lead). Support with email nurturing workflows.`,
          (p, a, i, o, g, c, d) => `Focus heavily on Google Search Ads capture for high-intent queries (e.g., "${p} template", "${i} conversion tips"), followed by Meta retargeting campaigns.`
        ]
      },
      path: {
        title: "Funnel Direction / Conversion Path",
        tag: "Conversion Path",
        variations: [
          (p, a, i, o, g, c, d) => `1. Paid acquisition traffic on ${c || 'Meta ads'} -> 2. Landing page with interactive hero -> 3. High-intent offer sign-up (${o || 'Start Free'}) -> 4. Immediate email onboarding.`,
          (p, a, i, o, g, c, d) => `1. Organic search / SEO -> 2. Value-first blog post or playground -> 3. Soft CTA download (Conversion Guide) -> 4. Secondary demo consultation nudge.`
        ]
      }
    },
    cta: {
      direct: {
        title: "Direct Conversion CTAs",
        tag: "Direct CTA",
        variations: [
          (p, a, i, o, g, c, d) => `Get Started with ${p} Free →`,
          (p, a, i, o, g, c, d) => `Claim Your ${o || 'Exclusive Offer'} Now`
        ]
      },
      soft: {
        title: "Soft Conversion CTAs",
        tag: "Soft CTA",
        variations: [
          (p, a, i, o, g, c, d) => `See how it works in 90 seconds`,
          (p, a, i, o, g, c, d) => `Explore the interactive templates`
        ]
      },
      urgency: {
        title: "Urgency CTAs",
        tag: "Urgency CTA",
        variations: [
          (p, a, i, o, g, c, d) => `Claim Your Spot — Only 47 Licenses Left`,
          (p, a, i, o, g, c, d) => `Lock in 20% off yearly before Friday midnight`
        ]
      },
      leadMagnet: {
        title: "Lead Magnet CTAs",
        tag: "Lead Magnet",
        variations: [
          (p, a, i, o, g, c, d) => `Download the Free Campaign Playbook`,
          (p, a, i, o, g, c, d) => `Get our conversion blueprint checklist`
        ]
      },
      demo: {
        title: "Demo & Consultation CTAs",
        tag: "Consultation",
        variations: [
          (p, a, i, o, g, c, d) => `Book a 15-Minute Strategy Sprint`,
          (p, a, i, o, g, c, d) => `Talk to a Conversion Specialist`
        ]
      },
      purchase: {
        title: "Purchase-Focused CTAs",
        tag: "Purchase CTA",
        variations: [
          (p, a, i, o, g, c, d) => `Buy Lifetime Access to ${p} Today`,
          (p, a, i, o, g, c, d) => `Secure Your License & Upgrade`
        ]
      },
      saasTrial: {
        title: "SaaS-Style Trial CTAs",
        tag: "SaaS Trial",
        variations: [
          (p, a, i, o, g, c, d) => `Start Free 14-Day Trial (No Credit Card)`,
          (p, a, i, o, g, c, d) => `Try ${p} Free — Cancel Anytime`
        ]
      }
    },
    messaging: {
      headline: {
        title: "Hero Headline Options",
        tag: "Headline Hook",
        variations: [
          (p, a, i, o, g, c, d) => `The ultimate campaign framework built for ${a || 'growth teams'}.`,
          (p, a, i, o, g, c, d) => `Stop wasting conversion opportunities. Launch ${p} today.`,
          (p, a, i, o, g, c, d) => `The conversion-first framework optimized for ${i || 'e-commerce'}.`
        ]
      },
      subheadline: {
        title: "Supporting Subheadlines",
        tag: "Subheadline",
        variations: [
          (p, a, i, o, g, c, d) => `Engineer conversion-centric strategy structures, high-performance ad hooks, and friction-free call-to-actions in minutes.`,
          (p, a, i, o, g, c, d) => `Say goodbye to guesswork. Implement copy guidelines backed by marketing psychology, tailored for ${a || 'modern founders'}.`
        ]
      },
      valueProp: {
        title: "Value Proposition Copy",
        tag: "Value Prop",
        variations: [
          (p, a, i, o, g, c, d) => `We build digital campaigns that command attention. Refined visual aesthetics combined with conversion-focused hooks designed for instant lift.`,
          (p, a, i, o, g, c, d) => `Designed to remove copywriting bottlenecks, enabling teams to launch new pricing structures and offers without developer delays.`
        ]
      },
      sectionCopy: {
        title: "Landing Page Section Copy",
        tag: "Landing Copy",
        variations: [
          (p, a, i, o, g, c, d) => `**Section Header:** "Engineered for Acquisition"\n**Body Copy:** "Why build marketing campaigns from scratch? Deploy gorgeous, copy-optimized pages that speak directly to the core pain points of ${a || 'your buyers'}."`,
          (p, a, i, o, g, c, d) => `**Section Header:** "Launch Without Copywriting Friction"\n**Body Copy:** "Accelerate your launch cycle with pre-validated messaging angles, urgency-backed CTAs, and clear risk reversals."`
        ]
      },
      adHooks: {
        title: "Ad Hooks / Offer Angles",
        tag: "Ad Hooks",
        variations: [
          (p, a, i, o, g, c, d) => `**Hook 1:** "Your competitors are launching campaigns in hours. Why are you still waiting weeks?"\n**Hook 2:** "Stop guessing what CTA makes ${a || 'people'} click. Here is the framework."`,
          (p, a, i, o, g, c, d) => `**Hook 1:** "Is your conversion rate lagging? Try these 7 psychology-backed hooks."\n**Hook 2:** "The secret acquisition system growth agencies use to launch products in the ${i || 'modern'} space."`
        ]
      },
      adPrimary: {
        title: "Ad Primary Text",
        tag: "Ad Body",
        variations: [
          (p, a, i, o, g, c, d) => `Tired of spending thousands on copywriting agencies? Deploy high-performance campaign copy today. Specifically designed for ${a || 'growth teams'} in the ${i || 'startup'} sector. Get started with our launch offer: ${o || 'Free instant trial'}.`,
          (p, a, i, o, g, c, d) => `Acquiring leads for ${p} shouldn't be a gamble. Implement conversion-focused copy and double your click-through rates. Try it free today.`
        ]
      },
      emailSubject: {
        title: "Email Subject Lines",
        tag: "Email Subject",
        variations: [
          (p, a, i, o, g, c, d) => `🚨 Quick question about your ${i || 'marketing'} campaigns...`,
          (p, a, i, o, g, c, d) => `The conversion formula that boosted our CTR by 38%`,
          (p, a, i, o, g, c, d) => `Exclusive early access to ${p} + Special launch offer`
        ]
      },
      framingAngles: {
        title: "Offer Framing Angles",
        tag: "Offer Framing",
        variations: [
          (p, a, i, o, g, c, d) => `**Angle A (Risk Reversal):** "Try the complete system free for 14 days. Cancel with a single click."\n**Angle B (ROI Focus):** "Just one extra conversion covers the yearly subscription."`,
          (p, a, i, o, g, c, d) => `**Angle A (Social Proof):** "Join 5,000+ conversion experts scaling acquisition with ${p}."\n**Angle B (Urgency):** "Offer expires this Friday. Lock in your custom pricing."`
        ]
      }
    }
  };

  // Tab switching logic
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const tabName = btn.dataset.tab;
      
      tabPanels.forEach(panel => {
        panel.style.display = 'none';
        panel.classList.remove('active');
      });
      
      const activePanel = document.getElementById(`panel-${tabName}`);
      if (activePanel) {
        activePanel.style.display = 'flex';
        activePanel.classList.add('active');
      }

      if (tabName === 'saved') {
        renderSavedTab();
      }
    });
  });

  // Generate Action
  generateBtn.addEventListener('click', () => {
    const prodName = document.getElementById('gtm-prod-name').value.trim() || 'Your Product';
    const audience = document.getElementById('gtm-target-audience').value.trim() || 'SaaS Founders & Creators';
    const industry = document.getElementById('gtm-industry').value.trim() || 'Software & Tech';
    const offer = document.getElementById('gtm-offer').value.trim() || '14-Day Free Trial';
    const goalSelect = document.getElementById('gtm-goal');
    const goal = goalSelect.options[goalSelect.selectedIndex].text;
    const channelSelect = document.getElementById('gtm-marketing-channel');
    const channel = channelSelect.options[channelSelect.selectedIndex].text;
    const desc = document.getElementById('gtm-description').value.trim() || 'A premium optimization asset.';
    const extra = document.getElementById('gtm-extra').value.trim();

    // Trigger Loading State
    generateBtn.classList.add('loading');
    generateBtn.disabled = true;
    generateBtn.innerHTML = `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" class="spin-icon" style="animation: spin 1s linear infinite;"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg> Engineering GTM Assets…`;

    setTimeout(() => {
      // Clear empty state
      if (emptyState) emptyState.style.display = 'none';
      exportAllBtn.style.display = 'inline-block';

      // Generate results for GTM, CTA, Messaging
      generateAllTabs(prodName, audience, industry, offer, goal, channel, desc, extra);

      // Render Active Tab Panel
      const currentTab = document.querySelector('.result-tab.active').dataset.tab;
      renderTabPanel(currentTab);

      // Release Loading State
      generateBtn.classList.remove('loading');
      generateBtn.disabled = false;
      generateBtn.innerHTML = `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg> Generate Campaign Strategy`;
      
      // Auto scroll to results section
      const targetSec = document.getElementById('gtm-tool-section');
      if (targetSec) {
        targetSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 1500);
  });

  // Export Action
  exportAllBtn.addEventListener('click', () => {
    let exportText = `=========================================\n`;
    exportText += `APPSTOCK EXCHANGE - GTM & CTA STRATEGY\n`;
    exportText += `Generated: ${new Date().toLocaleDateString()}\n`;
    exportText += `Tone: ${selectedTone.toUpperCase()}\n`;
    exportText += `=========================================\n\n`;

    Object.keys(currentOutputs).forEach(tab => {
      exportText += `### SECTION: ${tab.toUpperCase()} ###\n\n`;
      Object.keys(currentOutputs[tab]).forEach(key => {
        const item = currentOutputs[tab][key];
        exportText += `>> ${item.title} (${item.tag})\n`;
        exportText += `${item.text}\n\n`;
      });
    });

    const blob = new Blob([exportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `appstock-gtm-campaign-strategy.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });

  // Clear Saved Action
  clearSavedBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear all saved campaign assets?')) {
      savedAssets = [];
      localStorage.setItem('gtm_saved_assets', JSON.stringify(savedAssets));
      updateSavedBadge();
      renderSavedTab();
    }
  });

  // Generator engine functions
  function generateAllTabs(p, a, i, o, g, c, d, ex) {
    // GTM Strategies
    Object.keys(templates.gtm).forEach(key => {
      const entry = templates.gtm[key];
      const randomIndex = Math.floor(Math.random() * entry.variations.length);
      currentOutputs.gtm[key] = {
        title: entry.title,
        tag: entry.tag,
        text: entry.variations[randomIndex](p, a, i, o, g, c, d),
        args: [p, a, i, o, g, c, d],
        type: 'gtm',
        key: key
      };
    });

    // CTA Options
    Object.keys(templates.cta).forEach(key => {
      const entry = templates.cta[key];
      const randomIndex = Math.floor(Math.random() * entry.variations.length);
      currentOutputs.cta[key] = {
        title: entry.title,
        tag: entry.tag,
        text: entry.variations[randomIndex](p, a, i, o, g, c, d),
        args: [p, a, i, o, g, c, d],
        type: 'cta',
        key: key
      };
    });

    // Messaging Options
    Object.keys(templates.messaging).forEach(key => {
      const entry = templates.messaging[key];
      const randomIndex = Math.floor(Math.random() * entry.variations.length);
      currentOutputs.messaging[key] = {
        title: entry.title,
        tag: entry.tag,
        text: entry.variations[randomIndex](p, a, i, o, g, c, d),
        args: [p, a, i, o, g, c, d],
        type: 'messaging',
        key: key
      };
    });
  }

  function renderTabPanel(tabName) {
    if (tabName === 'saved') {
      renderSavedTab();
      return;
    }

    const panel = document.getElementById(`panel-${tabName}`);
    if (!panel) return;

    panel.innerHTML = '';
    const outputs = currentOutputs[tabName];
    if (!outputs || Object.keys(outputs).length === 0) {
      panel.innerHTML = `
        <div class="empty-state-view">
          <div class="empty-icon">💡</div>
          <h4>No Assets Generated Yet</h4>
          <p>Please enter your details and click Generate to see assets here.</p>
        </div>
      `;
      return;
    }

    Object.keys(outputs).forEach(key => {
      const item = outputs[key];
      const block = createResultBlock(item, false);
      panel.appendChild(block);
    });
  }

  function createResultBlock(item, isSavedCard) {
    const block = document.createElement('div');
    block.className = 'result-block';
    
    block.innerHTML = `
      <div class="result-meta">
        <span class="result-tag-pill">${item.tag}</span>
        <span class="result-score-pill">95/100 Effectiveness</span>
      </div>
      <h4>${item.title}</h4>
      <div class="result-copy-box">
        <p class="copy-text">${formatMarkdownText(item.text)}</p>
        <button class="copy-action-btn" title="Copy to Clipboard">
          <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>
        </button>
      </div>
      <div class="result-block-actions">
        ${isSavedCard ? 
          `<button class="btn btn-secondary btn-sm remove-saved-btn">🗑️ Remove</button>` : 
          `<button class="btn btn-secondary btn-sm save-variation-btn">⭐ Save to Collection</button>
           <button class="btn btn-secondary btn-sm regenerate-card-btn">🔄 Regenerate</button>`
        }
      </div>
    `;

    // Copy to clipboard
    block.querySelector('.copy-action-btn').addEventListener('click', function() {
      navigator.clipboard.writeText(item.text).then(() => {
        this.classList.add('copied');
        this.innerHTML = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#10b981" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>`;
        setTimeout(() => {
          this.classList.remove('copied');
          this.innerHTML = `<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>`;
        }, 1500);
      });
    });

    if (!isSavedCard) {
      // Save Variation
      block.querySelector('.save-variation-btn').addEventListener('click', function() {
        if (!savedAssets.some(saved => saved.text === item.text)) {
          savedAssets.push({
            id: Date.now() + Math.random().toString(36).substr(2, 9),
            title: item.title,
            tag: item.tag,
            text: item.text,
            type: item.type,
            key: item.key
          });
          localStorage.setItem('gtm_saved_assets', JSON.stringify(savedAssets));
          updateSavedBadge();
          this.textContent = '✓ Saved!';
          this.disabled = true;
          setTimeout(() => {
            this.textContent = '⭐ Save to Collection';
            this.disabled = false;
          }, 2000);
        } else {
          alert('This asset is already saved!');
        }
      });

      // Regenerate Card
      block.querySelector('.regenerate-card-btn').addEventListener('click', function() {
        const type = item.type;
        const key = item.key;
        const entry = templates[type][key];
        const currentVariations = entry.variations;
        
        let nextIndex;
        // Keep picking random index until it's different from the current one
        do {
          nextIndex = Math.floor(Math.random() * currentVariations.length);
        } while (currentVariations.length > 1 && currentVariations[nextIndex](...item.args) === item.text);

        const newText = currentVariations[nextIndex](...item.args);
        
        // Update model state
        currentOutputs[type][key].text = newText;
        
        // Update DOM with simple animation
        const textEl = block.querySelector('.copy-text');
        textEl.style.opacity = 0;
        setTimeout(() => {
          textEl.innerHTML = formatMarkdownText(newText);
          textEl.style.opacity = 1;
        }, 200);

        // Update action parameters
        item.text = newText;
      });
    } else {
      // Remove Saved
      block.querySelector('.remove-saved-btn').addEventListener('click', () => {
        savedAssets = savedAssets.filter(saved => saved.id !== item.id);
        localStorage.setItem('gtm_saved_assets', JSON.stringify(savedAssets));
        updateSavedBadge();
        renderSavedTab();
      });
    }

    return block;
  }

  function renderSavedTab() {
    const panel = document.getElementById('panel-saved');
    if (!panel) return;

    panel.innerHTML = '';
    if (savedAssets.length === 0) {
      clearSavedBtn.style.display = 'none';
      panel.innerHTML = `
        <div class="empty-state-view">
          <div class="empty-icon">⭐</div>
          <h4>No Saved Assets Yet</h4>
          <p>Click "Save to Collection" on any output block to add it to your persistent workspace collection.</p>
        </div>
      `;
      return;
    }

    clearSavedBtn.style.display = 'inline-block';
    savedAssets.forEach(item => {
      const block = createResultBlock(item, true);
      panel.appendChild(block);
    });
  }

  function updateSavedBadge() {
    if (savedCountBadge) {
      savedCountBadge.textContent = savedAssets.length;
    }
  }

  function formatMarkdownText(text) {
    // Quick custom formatter to handle basic markdown headers and bullet points
    return text
      .replace(/\n/g, '<br>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/-\s(.*?)(<br>|$)/g, '<li>$1</li>')
      .replace(/1\.\s(.*?)(<br>|$)/g, '<ol><li>$1</li></ol>');
  }

  // Bind panels display correctly
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;
      renderTabPanel(target);
    });
  });
}



