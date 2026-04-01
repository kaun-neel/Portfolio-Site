document.addEventListener('DOMContentLoaded', () => {
if(document.getElementById('intro-text')) {
    const introTextElement = document.getElementById('intro-text');
    const timestampElement = document.getElementById('timestamp');
    const navLinks = document.querySelectorAll('.cmd-link');
    const sections = document.querySelectorAll('.section');
    const terminalBody = document.querySelector('.terminal-body');
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const introMessage = "Welcome to my digital workspace portfolio.\nHere you can have a glance about me and my projects in the field of Cybersecurity, Machine Learning, LLM modules, Data training and firewall developments.\n\nSelect a command below to explore:";
    const typingSpeed = 10;
    const introSpeed = 20;
    const contentCache = {};
    let currentAnimation = null;
    sections.forEach(section => {
        const outputDiv = section.querySelector('.output');
        if (outputDiv) {
            contentCache[section.id] = outputDiv.innerHTML;
            outputDiv.innerHTML = '';
        }
    });
    async function typeHtml(html, container) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        async function typeNode(node, parent) {
            if (currentAnimation && currentAnimation !== animationId) return;
            if (node.nodeType === Node.TEXT_NODE) {
                const text = node.textContent;
                const textNode = document.createTextNode('');
                parent.appendChild(textNode);
                for (let i = 0; i < text.length; i++) {
                    if (currentAnimation && currentAnimation !== animationId) return;
                    textNode.textContent += text[i];
                    terminalBody.scrollTop = terminalBody.scrollHeight;
                    await new Promise(r => setTimeout(r, typingSpeed));
                }
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                const element = document.createElement(node.tagName);
                Array.from(node.attributes).forEach(attr => {
                    element.setAttribute(attr.name, attr.value);
                });
                parent.appendChild(element);
                if (node.childNodes.length === 0) return;
                for (const child of Array.from(node.childNodes)) {
                    await typeNode(child, element);
                }
            }
        }
        const animationId = Date.now();
        currentAnimation = animationId;
        container.innerHTML = '';
        for (const child of Array.from(tempDiv.childNodes)) {
            await typeNode(child, container);
        }
        if (currentAnimation === animationId) {
            attachFormListeners();
        }
    }
    let charIndex = 0;
    function typeWriter() {
        if (charIndex < introMessage.length) {
            introTextElement.textContent += introMessage.charAt(charIndex);
            charIndex++;
            setTimeout(typeWriter, introSpeed);
        }
    }
    setTimeout(typeWriter, 500);
    function updateTime() {
        const now = new Date();
        timestampElement.textContent = now.toLocaleTimeString('en-US', { hour12: false });
    }
    setInterval(updateTime, 1000);
    updateTime();
    let audioTimeout = null;
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('data-target');
            const globalAudio = document.getElementById('bg-music');
            if (globalAudio) {
                globalAudio.pause();
                globalAudio.currentTime = 0;
            }
            if (audioTimeout) {
                clearTimeout(audioTimeout);
                audioTimeout = null;
            }
            sections.forEach(section => {
                section.classList.add('hidden');
            });
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.remove('hidden');
                if (targetId === 'music') {
                    const audio = targetSection.querySelector('#bg-music');
                    if (audio) {
                        audio.currentTime = 15;
                        audio.volume = 0.5;
                        audio.play().catch(e => console.log("Audio play failed:", e));
                        audioTimeout = setTimeout(() => {
                            audio.pause();
                            audio.currentTime = 15;
                        }, 60000);
                    }
                }
                const outputDiv = targetSection.querySelector('.output');
                if (outputDiv && contentCache[targetId]) {
                    typeHtml(contentCache[targetId], outputDiv).then(() => {
                        if (targetId === 'music') {
                            const audio = targetSection.querySelector('#bg-music');
                            const btnPause = outputDiv.querySelector('#btn-pause');
                            const btnReplay = outputDiv.querySelector('#btn-replay');
                            const visualizer = outputDiv.querySelector('.visualizer');
                            if (audio) {
                                if (!audio.paused) {
                                    if (btnPause) btnPause.textContent = "[ || ]";
                                    if (visualizer) visualizer.style.opacity = "1";
                                } else {
                                    if (btnPause) btnPause.textContent = "[ ▶ ]";
                                    if (visualizer) visualizer.style.opacity = "0.3";
                                }
                                if (btnPause) {
                                    const newBtnPause = btnPause.cloneNode(true);
                                    btnPause.parentNode.replaceChild(newBtnPause, btnPause);
                                    newBtnPause.addEventListener('click', () => {
                                        if (audio.paused) {
                                            audio.play();
                                            newBtnPause.textContent = "[ || ]";
                                            if (visualizer) visualizer.style.opacity = "1";
                                        } else {
                                            audio.pause();
                                            newBtnPause.textContent = "[ ▶ ]";
                                            if (visualizer) visualizer.style.opacity = "0.3";
                                        }
                                    });
                                }
                                if (btnReplay) {
                                    const newBtnReplay = btnReplay.cloneNode(true);
                                    btnReplay.parentNode.replaceChild(newBtnReplay, btnReplay);
                                    newBtnReplay.addEventListener('click', () => {
                                        audio.currentTime = 15;
                                        audio.play();
                                        if (btnPause) btnPause.textContent = "[ || ]";
                                        if (visualizer) visualizer.style.opacity = "1";
                                        if (audioTimeout) clearTimeout(audioTimeout);
                                        audioTimeout = setTimeout(() => {
                                            audio.pause();
                                            audio.currentTime = 15;
                                            if (btnPause) btnPause.textContent = "[ ▶ ]";
                                            if (visualizer) visualizer.style.opacity = "0.3";
                                        }, 60000);
                                    });
                                }
                            }
                        }
                    });
                }
            }
        });
    });
    const themes = ['', 'theme-green', 'theme-amber'];
    let currentThemeIndex = 0;
    const savedTheme = localStorage.getItem('portfolio-theme');
    if (savedTheme) {
        currentThemeIndex = themes.indexOf(savedTheme);
        if (currentThemeIndex !== -1) {
            body.classList.add(savedTheme);
        } else {
            currentThemeIndex = 0;
        }
    }
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            if (themes[currentThemeIndex]) {
                body.classList.remove(themes[currentThemeIndex]);
            }
            currentThemeIndex = (currentThemeIndex + 1) % themes.length;
            if (themes[currentThemeIndex]) {
                body.classList.add(themes[currentThemeIndex]);
            }
            localStorage.setItem('portfolio-theme', themes[currentThemeIndex]);
        });
    }
    function attachFormListeners() {
        const form = document.querySelector('.cli-form');
        if (form) {
            const newForm = form.cloneNode(true);
            form.parentNode.replaceChild(newForm, form);
            newForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const btn = newForm.querySelector('.btn-submit');
                const originalText = btn.textContent;
                btn.textContent = "[ SENDING... ]";
                btn.disabled = true;
                setTimeout(() => {
                    btn.textContent = "[ SENT SUCCESSFULLY ]";
                    btn.style.borderColor = "var(--accent-color)";
                    btn.style.color = "var(--accent-color)";
                    newForm.reset();
                    setTimeout(() => {
                        btn.textContent = originalText;
                        btn.disabled = false;
                        btn.style.borderColor = "";
                        btn.style.color = "";
                    }, 3000);
                }, 1500);
            });
        }
    }
}
});

        function updateClock() {
            const now = new Date();
            const t = now.toLocaleTimeString('en-GB');
            document.getElementById('clock').textContent = t;
            const d = now.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
            document.getElementById('sb-date').textContent = d;
        }
        setInterval(updateClock, 1000);
        updateClock();
        const sections = [
            'welcome', 'about', 'projects', 'cases', 'contact',
            'proj-graphy', 'proj-debate', 'proj-tempestra',
            'proj-ridescout', 'proj-ghostshell', 'proj-exo', 'case-exo', 'case-adversarial'
        ];
        async function navigate(id) {
            sections.forEach(s => {
                const sec = document.getElementById('sec-' + s);
                if (sec) sec.classList.remove('active');
            });
            document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
            document.querySelectorAll('.tab').forEach(el => el.classList.remove('active'));
            
            const targetSec = document.getElementById('sec-' + id);
            if (targetSec) {
                targetSec.classList.add('active');
                if (targetSec.hasAttribute('data-src') && !targetSec.hasAttribute('data-loaded')) {
                    try {
                        let response = await fetch(targetSec.getAttribute('data-src'));
                        if (response.ok) {
                            targetSec.innerHTML = await response.text();
                            targetSec.setAttribute('data-loaded', 'true');
                        } else {
                            targetSec.innerHTML = `<div style="padding: 20px; color: red;">[!] Error loading content (HTTP ${response.status}). Are you running a local web server?</div>`;
                        }
                    } catch (e) {
                        targetSec.innerHTML = `<div style="padding: 20px; color: red;">[!] Failed to load content via fetch(). This is likely due to browser CORS policy blocking file:// requests. Please run a local web server instead.</div>`;
                    }
                }
            }
            
            const navItem = document.querySelector(`.nav-item[data-section="${id}"]`);
            if (navItem) navItem.classList.add('active');
            
            const tabItem = document.querySelector(`.tab[data-section="${id}"]`);
            if (tabItem) tabItem.classList.add('active');
            
            const sbSection = document.getElementById('sb-section');
            if (sbSection) sbSection.textContent = id.toUpperCase();
        }
        document.querySelectorAll('.nav-item[data-section]').forEach(el => {
            el.addEventListener('click', () => navigate(el.dataset.section));
        });
        document.querySelectorAll('.tab[data-section]').forEach(el => {
            el.addEventListener('click', () => navigate(el.dataset.section));
        });
        const cmds = {
            'cat about.txt': 'about',
            'about': 'about',
            'ls ./projects/': 'projects',
            'ls projects': 'projects',
            'projects': 'projects',
            'cat case_studies.md': 'cases',
            'cases': 'cases',
            'cat nasa_exoplanet_scorer.md': 'case-exo',
            'cat adversarial_robustness.md': 'case-adversarial',
            './contact.sh': 'contact',
            'contact': 'contact',
            './welcome.sh': 'welcome',
            'welcome': 'welcome',
            'home': 'welcome',
            'help': null,
            'clear': null,
        };
        document.getElementById('cmd-input').addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                const val = this.value.trim().toLowerCase();
                if (val === 'help') {
                    alert('Available commands:\n./welcome.sh\ncat about.txt\nls ./projects/\ncat case_studies.md\n./contact.sh\n./music.sh');
                } else if (val === 'clear') {
                    this.value = '';
                } else if (cmds[val] !== undefined && cmds[val] !== null) {
                    navigate(cmds[val]);
                    this.value = '';
                } else if (val) {
                    this.value = '';
                }
            }
        });
        document.getElementById('theme-btn').addEventListener('click', () => {
            document.body.classList.toggle('light');
        });
        function handleSend() {
            const name = document.getElementById('f-name').value;
            const email = document.getElementById('f-email').value;
            const msg = document.getElementById('f-msg').value;
            if (!name || !email || !msg) {
                alert('# Error: All fields required.');
                return;
            }
            const mailto = `mailto:indraneelbose89191@gmail.com?subject=Portfolio Contact from ${encodeURIComponent(name)}&body=${encodeURIComponent(msg + '\n\nFrom: ' + email)}`;
            window.location.href = mailto;
        }
        const hamburger = document.getElementById('hamburger');
        const mobileNav = document.getElementById('mobile-nav');
        const mobileNavOverlay = document.getElementById('mobile-nav-overlay');
        const mobileNavClose = document.getElementById('mobile-nav-close');
        function openMobileNav() {
            hamburger.classList.add('active');
            mobileNav.classList.add('active');
            mobileNavOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
        function closeMobileNav() {
            hamburger.classList.remove('active');
            mobileNav.classList.remove('active');
            mobileNavOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
        if (hamburger) {
            hamburger.addEventListener('click', () => {
                if (mobileNav.classList.contains('active')) {
                    closeMobileNav();
                } else {
                    openMobileNav();
                }
            });
        }
        if (mobileNavClose) {
            mobileNavClose.addEventListener('click', closeMobileNav);
        }
        if (mobileNavOverlay) {
            mobileNavOverlay.addEventListener('click', closeMobileNav);
        }
        document.querySelectorAll('.mobile-nav .nav-item[data-section]').forEach(el => {
            el.addEventListener('click', (e) => {
                e.preventDefault();
                closeMobileNav();
                navigate(el.dataset.section);
            });
        });
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                closeMobileNav();
            }
        });