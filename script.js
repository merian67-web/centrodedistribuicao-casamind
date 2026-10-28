/* ============================================
   UNI.CO COMERCIO S/A — script.js
   Interações, animações e comportamento dinâmico
   ============================================ */

(function () {
    'use strict';

    /* ============================================
       1. MENU MOBILE (HAMBÚRGUER)
       ============================================ */
    const menuToggle = document.getElementById('menuToggle');
    const nav = document.getElementById('nav');

    if (menuToggle && nav) {
        menuToggle.addEventListener('click', function () {
            nav.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            if (nav.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // Fecha o menu ao clicar em qualquer link
        document.querySelectorAll('.nav a').forEach(function (link) {
            link.addEventListener('click', function () {
                nav.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            });
        });

        // Fecha o menu ao clicar fora
        document.addEventListener('click', function (e) {
            if (!nav.contains(e.target) && !menuToggle.contains(e.target)) {
                nav.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    /* ============================================
       2. HEADER DINÂMICO AO ROLAR
       ============================================ */
    const header = document.querySelector('.header');

    function handleHeaderScroll() {
        if (!header) return;
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleHeaderScroll, { passive: true });

    /* ============================================
       3. SCROLL SUAVE PARA ÂNCORAS (fallback)
       ============================================ */
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId === '') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    /* ============================================
       4. ANIMAÇÃO FADE-IN AO ROLAR (IntersectionObserver)
       ============================================ */
    const observerElements = document.querySelectorAll(
        '.sobre-card, .marca-card, .dados-card, .cnae-box, .contato-item, .privacidade-card, .stat-card'
    );

    observerElements.forEach(function (el) {
        el.classList.add('fade-in');
    });

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.12,
                rootMargin: '0px 0px -40px 0px'
            }
        );

        observerElements.forEach(function (el) {
            observer.observe(el);
        });
    } else {
        // Fallback para navegadores antigos
        observerElements.forEach(function (el) {
            el.classList.add('visible');
        });
    }

    /* ============================================
       5. CONTADOR ANIMADO (Hero Stats)
       ============================================ */
    const statNumbers = document.querySelectorAll('.stat-number');

    function animateCounter(el) {
        const rawText = el.textContent.trim();
        // Extrai número e sufixo (ex: "400+" -> 400 e "+")
        const match = rawText.match(/^([\d.,]+)(.*)$/);
        if (!match) return;

        const numericPart = match[1].replace(/[.,]/g, '');
        const suffix = match[2] || '';
        const target = parseInt(numericPart, 10);

        if (isNaN(target)) return;

        const duration = 1600;
        const startTime = performance.now();
        const startValue = 0;

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Easing out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(startValue + (target - startValue) * eased);

            // Formata com pontos para milhares
            const formatted = current.toLocaleString('pt-BR');
            el.textContent = formatted + suffix;

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.textContent = target.toLocaleString('pt-BR') + suffix;
            }
        }

        requestAnimationFrame(update);
    }

    if ('IntersectionObserver' in window && statNumbers.length) {
        const counterObserver = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        animateCounter(entry.target);
                        counterObserver.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.5 }
        );

        statNumbers.forEach(function (el) {
            counterObserver.observe(el);
        });
    }

    /* ============================================
       6. BOTÃO "VOLTAR AO TOPO"
       ============================================ */
    const backToTop = document.createElement('button');
    backToTop.id = 'backToTop';
    backToTop.setAttribute('aria-label', 'Voltar ao topo');
    backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
    document.body.appendChild(backToTop);

    // Estilos inline (para não depender do CSS caso queira reutilizar)
    Object.assign(backToTop.style, {
        position: 'fixed',
        bottom: '30px',
        right: '30px',
        width: '52px',
        height: '52px',
        borderRadius: '50%',
        border: 'none',
        background: 'linear-gradient(135deg, #ff4757, #a29bfe)',
        color: '#fff',
        fontSize: '1.1rem',
        cursor: 'pointer',
        boxShadow: '0 10px 25px rgba(255, 71, 87, 0.4)',
        opacity: '0',
        visibility: 'hidden',
        transform: 'translateY(20px)',
        transition: 'all 0.35s ease',
        zIndex: '999'
    });

    window.addEventListener(
        'scroll',
        function () {
            if (window.scrollY > 500) {
                backToTop.style.opacity = '1';
                backToTop.style.visibility = 'visible';
                backToTop.style.transform = 'translateY(0)';
            } else {
                backToTop.style.opacity = '0';
                backToTop.style.visibility = 'hidden';
                backToTop.style.transform = 'translateY(20px)';
            }
        },
        { passive: true }
    );

    backToTop.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    backToTop.addEventListener('mouseenter', function () {
        backToTop.style.transform = 'translateY(-4px) scale(1.08)';
    });
    backToTop.addEventListener('mouseleave', function () {
        backToTop.style.transform = 'translateY(0) scale(1)';
    });

    /* ============================================
       7. LINK ATIVO NA NAVEGAÇÃO (scroll spy)
       ============================================ */
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav a[href^="#"]');

    function scrollSpy() {
        const scrollPos = window.scrollY + 120;

        sections.forEach(function (section) {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(function (link) {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', scrollSpy, { passive: true });

    // Estilo do link ativo (injetado dinamicamente)
    const activeStyle = document.createElement('style');
    activeStyle.textContent = `
        .nav a.active {
            background: linear-gradient(135deg, #ff4757, #ff6b9d);
            color: #fff !important;
            box-shadow: 0 6px 18px rgba(255, 71, 87, 0.35);
        }
        .nav a.active i {
            color: #fff !important;
        }
        @media (max-width: 768px) {
            .nav a.active {
                transform: none;
            }
        }
    `;
    document.head.appendChild(activeStyle);

    /* ============================================
       8. ANO DINÂMICO NO FOOTER
       ============================================ */
    const footerYear = document.querySelector('.footer-bottom p');
    if (footerYear) {
        const year = new Date().getFullYear();
        footerYear.innerHTML = footerYear.innerHTML.replace(/\d{4}/, year);
    }

    /* ============================================
       9. EFEITO PARALLAX SUAVE NO HERO (opcional)
       ============================================ */
    const hero = document.querySelector('.hero');
    if (hero && window.matchMedia('(min-width: 992px)').matches) {
        window.addEventListener(
            'scroll',
            function () {
                const scrolled = window.pageYOffset;
                if (scrolled < window.innerHeight) {
                    hero.style.backgroundPositionY = scrolled * 0.3 + 'px';
                }
            },
            { passive: true }
        );
    }

    /* ============================================
       10. LOG DE BOAS-VINDAS (console)
       ============================================ */
    console.log(
        '%c Uni.co Comercio S/A ',
        'background: linear-gradient(135deg, #ff4757, #a29bfe); color:#fff; font-size:16px; font-weight:bold; padding:8px 16px; border-radius:8px;'
    );
    console.log(
        '%c Site institucional carregado com sucesso ✅',
        'color: #00b894; font-weight: bold; font-size: 13px;'
    );
})();
