// ===== LabTryAI - Interactive Script =====

document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initMobileMenu();
    initScrollReveal();
    initFAQ();
    initPricingToggle();
    initChatWidget();
    initStartCall();
});

// ===== Navbar Scroll Effect =====
function initNavbar() {
    const navbar = document.getElementById('navbar');

    function updateNavbar() {
        if (window.scrollY > 50) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
    }

    window.addEventListener('scroll', updateNavbar, { passive: true });
    updateNavbar();
}

// ===== Mobile Menu =====
function initMobileMenu() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = document.getElementById('menu-icon');
    let isOpen = false;

    menuBtn.addEventListener('click', () => {
        isOpen = !isOpen;
        mobileMenu.classList.toggle('hidden');

        if (isOpen) {
            menuIcon.setAttribute('d', 'M6 18L18 6M6 6l12 12');
        } else {
            menuIcon.setAttribute('d', 'M4 6h16M4 12h16M4 18h16');
        }
    });

    // Close menu when clicking a link
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            isOpen = false;
            mobileMenu.classList.add('hidden');
            menuIcon.setAttribute('d', 'M4 6h16M4 12h16M4 18h16');
        });
    });
}

// ===== Scroll Reveal =====
function initScrollReveal() {
    const sections = document.querySelectorAll('section');

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -80px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const children = entry.target.querySelectorAll('.reveal');
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.classList.add('revealed');
                    }, index * 100);
                });
            }
        });
    }, observerOptions);

    // Add reveal class to animatable elements
    sections.forEach(section => {
        const heading = section.querySelector('h2');
        const subtext = section.querySelector('h2 + p');
        const cards = section.querySelectorAll('.grid > div');

        if (heading) heading.classList.add('reveal');
        if (subtext) subtext.classList.add('reveal', 'reveal-delay-1');
        cards.forEach((card, i) => {
            card.classList.add('reveal', `reveal-delay-${Math.min(i + 1, 4)}`);
        });

        observer.observe(section);
    });
}

// ===== FAQ Accordion =====
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const toggle = item.querySelector('.faq-toggle');
        const content = item.querySelector('.faq-content');

        toggle.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all
            faqItems.forEach(other => {
                other.classList.remove('active');
                const otherContent = other.querySelector('.faq-content');
                otherContent.classList.remove('open');
                otherContent.classList.add('hidden');
            });

            // Toggle current
            if (!isActive) {
                item.classList.add('active');
                content.classList.remove('hidden');
                content.classList.add('open');
            }
        });
    });
}

// ===== Pricing Toggle =====
function initPricingToggle() {
    const toggle = document.getElementById('pricing-toggle');
    const monthlyLabel = document.getElementById('monthly-label');
    const annualLabel = document.getElementById('annual-label');
    let isAnnual = false;

    toggle.addEventListener('click', () => {
        isAnnual = !isAnnual;
        toggle.classList.toggle('active');

        if (isAnnual) {
            monthlyLabel.classList.remove('text-white');
            monthlyLabel.classList.add('text-dark-400');
            annualLabel.classList.remove('text-dark-400');
            annualLabel.classList.add('text-white');
        } else {
            monthlyLabel.classList.add('text-white');
            monthlyLabel.classList.remove('text-dark-400');
            annualLabel.classList.add('text-dark-400');
            annualLabel.classList.remove('text-white');
        }

        // Update prices
        document.querySelectorAll('[data-monthly]').forEach(el => {
            const monthly = el.getAttribute('data-monthly');
            const annual = el.getAttribute('data-annual');
            el.textContent = `$${isAnnual ? annual : monthly}`;
        });
    });
}

// ===== Chat Widget =====
function initChatWidget() {
    const fab = document.getElementById('chat-fab');
    const widget = document.getElementById('chat-widget');
    const closeBtn = document.getElementById('close-chat-btn');
    const openChatBtn = document.getElementById('open-chat-btn');
    const input = document.getElementById('chat-input');
    const sendBtn = document.getElementById('chat-send-btn');
    const messages = document.getElementById('chat-messages');

    function openChat() {
        widget.classList.remove('hidden');
        fab.classList.add('hidden');
        input.focus();
    }

    function closeChat() {
        widget.classList.add('hidden');
        fab.classList.remove('hidden');
    }

    fab.addEventListener('click', openChat);
    closeBtn.addEventListener('click', closeChat);
    openChatBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openChat();
        // Scroll to bottom of page near the widget
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    });

    // Demo chat responses
    const demoResponses = [
        "That's a great question! LabTryAI can handle both inbound and outbound calls with natural-sounding AI voices. Our agents can schedule appointments, answer FAQs, qualify leads, and much more.",
        "We integrate with popular CRMs like Salesforce, HubSpot, and GoHighLevel. Calendar integrations include Google Calendar, Calendly, and Outlook. We also support Twilio and other VoIP providers.",
        "Getting started is easy! Just pick a plan, configure your AI agent using our templates, connect your phone number or embed the chat widget, and you're live in minutes.",
        "Our Professional plan is our most popular choice. It includes 500 voice minutes, unlimited chat messages, 3 AI agents, CRM integration, and priority support for $149/month.",
        "Yes, we take security very seriously. We offer SOC 2 compliance, HIPAA compliance for healthcare, and follow GDPR regulations. All data is encrypted end-to-end.",
        "Absolutely! You can customize the AI's name, voice, personality, knowledge base, and conversation scripts. It will respond in a way that matches your brand perfectly.",
        "Our AI handles about 85% of inquiries without human intervention. For complex issues, it seamlessly transfers the call or chat to your team with full context."
    ];

    let responseIndex = 0;

    function sendMessage() {
        const text = input.value.trim();
        if (!text) return;

        // Add user message
        addMessage(text, 'user');
        input.value = '';

        // Show typing indicator
        showTyping();

        // Simulate AI response
        setTimeout(() => {
            removeTyping();
            const response = demoResponses[responseIndex % demoResponses.length];
            addMessage(response, 'bot');
            responseIndex++;
        }, 1000 + Math.random() * 1000);
    }

    function addMessage(text, sender) {
        const div = document.createElement('div');
        div.className = `flex items-start space-x-2 ${sender === 'user' ? 'justify-end' : ''}`;

        if (sender === 'bot') {
            div.innerHTML = `
                <div class="w-7 h-7 bg-primary-600/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg class="w-3.5 h-3.5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                </div>
                <div class="bg-dark-800 rounded-2xl rounded-tl-md px-3 py-2 max-w-[85%]">
                    <p class="text-sm text-dark-200">${escapeHtml(text)}</p>
                </div>
            `;
        } else {
            div.innerHTML = `
                <div class="bg-primary-600 rounded-2xl rounded-tr-md px-3 py-2 max-w-[85%]">
                    <p class="text-sm text-white">${escapeHtml(text)}</p>
                </div>
            `;
        }

        messages.appendChild(div);
        messages.scrollTop = messages.scrollHeight;
    }

    function showTyping() {
        const div = document.createElement('div');
        div.id = 'typing-indicator';
        div.className = 'flex items-start space-x-2';
        div.innerHTML = `
            <div class="w-7 h-7 bg-primary-600/20 rounded-full flex items-center justify-center flex-shrink-0">
                <svg class="w-3.5 h-3.5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
            </div>
            <div class="bg-dark-800 rounded-2xl rounded-tl-md px-4 py-3">
                <div class="typing-indicator">
                    <span></span><span></span><span></span>
                </div>
            </div>
        `;
        messages.appendChild(div);
        messages.scrollTop = messages.scrollHeight;
    }

    function removeTyping() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) indicator.remove();
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    sendBtn.addEventListener('click', sendMessage);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
}

// ===== Start Call (Twilio + Voiceflow) =====
function initStartCall() {
    const phoneInput = document.getElementById('phone-input');
    const startCallBtn = document.getElementById('start-call-btn');
    const btnText = startCallBtn.querySelector('span');
    const btnIcon = startCallBtn.querySelector('svg');

    startCallBtn.addEventListener('click', async () => {
        const phone = phoneInput.value.trim();

        if (!phone) {
            phoneInput.focus();
            phoneInput.classList.add('border-red-500');
            setTimeout(() => phoneInput.classList.remove('border-red-500'), 2000);
            return;
        }

        // Disable button and show loading
        startCallBtn.disabled = true;
        btnText.textContent = 'Calling...';
        startCallBtn.classList.add('opacity-75', 'cursor-not-allowed');

        try {
            const response = await fetch('/api/call', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phoneNumber: phone }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                btnText.textContent = 'Call Sent!';
                startCallBtn.classList.remove('bg-primary-600', 'hover:bg-primary-500');
                startCallBtn.classList.add('bg-green-600');
                phoneInput.value = '';

                setTimeout(() => {
                    btnText.textContent = 'Start Call';
                    startCallBtn.classList.remove('bg-green-600');
                    startCallBtn.classList.add('bg-primary-600', 'hover:bg-primary-500');
                }, 4000);
            } else {
                btnText.textContent = data.error || 'Failed';
                startCallBtn.classList.remove('bg-primary-600', 'hover:bg-primary-500');
                startCallBtn.classList.add('bg-red-600');

                setTimeout(() => {
                    btnText.textContent = 'Start Call';
                    startCallBtn.classList.remove('bg-red-600');
                    startCallBtn.classList.add('bg-primary-600', 'hover:bg-primary-500');
                }, 3000);
            }
        } catch (err) {
            btnText.textContent = 'Error - Try Again';
            startCallBtn.classList.remove('bg-primary-600', 'hover:bg-primary-500');
            startCallBtn.classList.add('bg-red-600');

            setTimeout(() => {
                btnText.textContent = 'Start Call';
                startCallBtn.classList.remove('bg-red-600');
                startCallBtn.classList.add('bg-primary-600', 'hover:bg-primary-500');
            }, 3000);
        } finally {
            startCallBtn.disabled = false;
            startCallBtn.classList.remove('opacity-75', 'cursor-not-allowed');
        }
    });

    // Allow Enter key to trigger call
    phoneInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') startCallBtn.click();
    });
}

// ===== Smooth scroll for anchor links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            const navHeight = document.getElementById('navbar').offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;
            window.scrollTo({ top: targetPosition, behavior: 'smooth' });
        }
    });
});
