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

  // Initialize Figma Mode based on localStorage
  const initFigmaMode = () => {
    const isEnabled = localStorage.getItem('figmaMode') === 'enabled';
    if (isEnabled) {
      enableFigmaMode();
    } else {
      disableFigmaMode();
    }
  };

  const enableFigmaMode = () => {
    figmaContainer.classList.remove('figma-mode-disabled');
    figmaContainer.classList.add('figma-mode-enabled');
    toggleBtn.classList.add('in-figma-mode');
    toggleBtn.querySelector('span').textContent = 'Preview Live Site';
    localStorage.setItem('figmaMode', 'enabled');
    document.body.style.overflow = 'hidden'; // Lock browser scroll
    
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
    toggleBtn.classList.remove('in-figma-mode');
    toggleBtn.querySelector('span').textContent = 'Figma Design Mode';
    localStorage.setItem('figmaMode', 'disabled');
    document.body.style.overflow = ''; // Release browser scroll
  };

  // Toggle events
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      if (figmaContainer.classList.contains('figma-mode-disabled')) {
        enableFigmaMode();
      } else {
        disableFigmaMode();
      }
    });
  }

  if (playBtn) {
    playBtn.addEventListener('click', () => {
      disableFigmaMode();
    });
  }

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

  // Exploded Image Sequence Animation
  const initExplodedAnimation = () => {
    const canvas = document.getElementById('exploded-canvas');
    if (!canvas) return;

    const context = canvas.getContext('2d');
    canvas.width = 1158; // Adjust to image width
    canvas.height = 770; // Adjust to image height

    const frameCount = 265;
    const currentFrame = index => (
      `IMAGES2/${(index + 1).toString().padStart(5, '0')}.png`
    );

    const images = [];
    const imageSeq = { frame: 0 };

    // Preload images
    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      img.src = currentFrame(i);
      images.push(img);
    }

    const render = () => {
      if (images[imageSeq.frame]) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(images[imageSeq.frame], 0, 0, canvas.width, canvas.height);
      }
    };

    images[0].onload = render;

    // Handle Scroll
    window.addEventListener('scroll', () => {
      const section = document.getElementById('hero-section');
      if (!section) return;

      const scrollTop = window.scrollY - section.offsetTop;
      const scrollableHeight = section.scrollHeight - window.innerHeight;

      if (scrollTop >= 0 && scrollTop <= scrollableHeight && scrollableHeight > 0) {
        const fraction = scrollTop / scrollableHeight;
        const frameIndex = Math.min(
          frameCount - 1,
          Math.floor(fraction * frameCount)
        );
        
        // Request animation frame for smooth rendering
        if (imageSeq.frame !== frameIndex) {
          imageSeq.frame = frameIndex;
          requestAnimationFrame(render);
        }
      } else if (scrollTop > scrollableHeight) {
        if (imageSeq.frame !== frameCount - 1) {
          imageSeq.frame = frameCount - 1;
          requestAnimationFrame(render);
        }
      } else if (scrollTop < 0) {
        if (imageSeq.frame !== 0) {
          imageSeq.frame = 0;
          requestAnimationFrame(render);
        }
      }
    }, { passive: true });
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
  initExplodedAnimation();
  initCarousel();
  initMarquee();
});
