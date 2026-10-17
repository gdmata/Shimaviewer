/*
 * VittaPass — Script único do projeto.
 * Reúne script.js, estabelecimentos.js, JavaScript do cadastro de parceiro,
 * configuração Tailwind e funções de clique dos HTML.
 * As rotinas duplicadas de tema foram unificadas.
 */

// Configuração do Tailwind (aplicável só à página que carrega o CDN).
if (typeof tailwind !== 'undefined') {
      tailwind.config = {
        darkMode: 'class',
        theme: {
          extend: {
            fontFamily: {
              'sans': ['Inter', 'system-ui', 'sans-serif'],
            },
            colors: {
              primary: '#3366FF',
              'primary-dark': '#2C58DB',
              secondary: '#132761',
            }
          }
        }
      }
  
}

(function () {
  'use strict';

  // ===== FUNÇÕES COMPARTILHADAS =====
  // Estado da aplicação
  let state = {
    mobileOpen: false,
    darkMode: false,
    establishmentsExpanded: false
  };

  // Funções de inicialização do tema
  function initializeTheme() {
    const savedTheme = localStorage.getItem('vittapass-theme');
    state.darkMode = savedTheme ? savedTheme === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
    updateTheme();
  }

  function updateTheme() {
    document.documentElement.classList.toggle('dark', state.darkMode);
    localStorage.setItem('vittapass-theme', state.darkMode ? 'dark' : 'light');
  
    // Atualizar ícone do tema
    const themeIcon = document.getElementById('theme-icon');
    if (themeIcon) {
      if (state.darkMode) {
        themeIcon.innerHTML = '<circle cx="10" cy="10" r="3.5" /><path d="M10 1.5v2M10 16.5v2M1.5 10h2M16.5 10h2M4 4l1.4 1.4M14.6 14.6L16 16M16 4l-1.4 1.4M5.4 14.6L4 16" />';
      } else {
        themeIcon.innerHTML = '<path d="M16.8 12.5A7 7 0 0 1 7.5 3.2 7 7 0 1 0 16.8 12.5z" />';
      }
    }
  }

  function toggleTheme() {
    state.darkMode = !state.darkMode;
    updateTheme();
  }

  // Funções de controle de estado
  function toggleMobileMenu() {
    state.mobileOpen = !state.mobileOpen;
    const mobileMenu = document.getElementById('mobile-menu');
    const menuButton = document.getElementById('menu-button');
  
    if (state.mobileOpen) {
      mobileMenu.classList.remove('hidden');
      menuButton.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
          <path d="M4 4l12 12M16 4L4 16" />
        </svg>
      `;
    } else {
      mobileMenu.classList.add('hidden');
      menuButton.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
          <path d="M3 5h14M3 10h14M3 15h14" />
        </svg>
      `;
    }
  }

  function closeMobileMenu() {
    state.mobileOpen = false;
    const mobileMenu = document.getElementById('mobile-menu');
    const menuButton = document.getElementById('menu-button');
  
    mobileMenu.classList.add('hidden');
    menuButton.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
        <path d="M3 5h14M3 10h14M3 15h14" />
      </svg>
    `;
  }

  // Função para expandir/contrair estabelecimentos
  function toggleEstablishments() {
    state.establishmentsExpanded = !state.establishmentsExpanded;
  
    const extraEstablishments = document.getElementById('extra-establishments');
    const toggleButton = document.getElementById('toggle-establishments');
    const exploreAllButton = document.getElementById('explore-all-button');
  
    if (extraEstablishments && toggleButton) {
      if (state.establishmentsExpanded) {
        // Mostrar estabelecimentos extras
        extraEstablishments.classList.remove('hidden');
        extraEstablishments.classList.add('grid');
        toggleButton.textContent = 'Ver menos estabelecimentos';
      
        // Mostrar botão "explorar todos"
        if (exploreAllButton) {
          exploreAllButton.classList.remove('hidden');
        }
      
        // Scroll suave para a nova seção
        setTimeout(() => {
          extraEstablishments.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'nearest' 
          });
        }, 100);
      } else {
        // Esconder estabelecimentos extras
        extraEstablishments.classList.add('hidden');
        extraEstablishments.classList.remove('grid');
        toggleButton.textContent = 'Ver mais estabelecimentos';
      
        // Esconder botão "explorar todos"
        if (exploreAllButton) {
          exploreAllButton.classList.add('hidden');
        }
      
        // Scroll de volta para o início da seção
        setTimeout(() => {
          document.getElementById('estabelecimentos').scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
          });
        }, 100);
      }
    }
  }

  // Inicialização quando o DOM estiver carregado
  document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
  
    // Configurar mobile menu
    const menuButton = document.getElementById('menu-button');
    if (menuButton && document.getElementById('mobile-menu')) {
      menuButton.addEventListener('click', toggleMobileMenu);
    }
  
    // Configurar toggle de estabelecimentos
    const toggleEstablishmentsButton = document.getElementById('toggle-establishments');
    if (toggleEstablishmentsButton) {
      toggleEstablishmentsButton.addEventListener('click', toggleEstablishments);
    }
  
    // Smooth scroll para links âncora
    document.addEventListener('click', function(e) {
      const target = e.target;
      if (target.tagName === 'A' && target.getAttribute('href')?.startsWith('#')) {
        e.preventDefault();
        const id = target.getAttribute('href').substring(1);
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      
        // Fechar menu mobile se estiver aberto
        if (state.mobileOpen) {
          closeMobileMenu();
        }
      }
    });
  });

 function alternarVisibilidadeSenha(botao) {
  const campo = botao
    .closest('.relative-box')
    ?.querySelector('input');

  if (!campo) return;

  const mostrar = campo.type === 'password';

  campo.type = mostrar ? 'text' : 'password';

  botao.setAttribute(
    'aria-label',
    mostrar ? 'Ocultar senha' : 'Mostrar senha'
  );

  botao.setAttribute('aria-pressed', String(mostrar));
}

  // ===== LISTAGEM DE ESTABELECIMENTOS =====
  // Dados dos estabelecimentos
  const ALL_ESTABLISHMENTS = [
    {
      name: 'Salão Bella Vista',
      category: 'Cabelo',
      services: ['Corte', 'Coloração', 'Escova'],
      plan: 'Plus',
      rating: 4.8,
      distance: '0.5km',
      address: 'Rua das Flores, 123'
    },
    {
      name: 'Clínica Estética Premium',
      category: 'Pele',
      services: ['Limpeza de Pele', 'Tratamento Facial', 'Peeling'],
      plan: 'Premium',
      rating: 4.9,
      distance: '1.2km',
      address: 'Av. Paulista, 456'
    },
    {
      name: 'Espaço Nail Design',
      category: 'Unhas',
      services: ['Manicure', 'Pedicure', 'Nail Art'],
      plan: 'Básico',
      rating: 4.6,
      distance: '0.8km',
      address: 'Rua Augusta, 789'
    },
    {
      name: 'Barbearia Classic',
      category: 'Cabelo',
      services: ['Corte', 'Barba', 'Tratamento'],
      plan: 'Plus',
      rating: 4.7,
      distance: '0.3km',
      address: 'Rua da Consolação, 321'
    },
    {
      name: 'Studio de Beleza Luxo',
      category: 'Cabelo',
      services: ['Corte', 'Coloração', 'Hidratação', 'Escova'],
      plan: 'Premium',
      rating: 4.9,
      distance: '2.1km',
      address: 'Av. Faria Lima, 654'
    },
    {
      name: 'Clínica de Estética Avançada',
      category: 'Pele',
      services: ['Estética Facial', 'Microagulhamento', 'Limpeza'],
      plan: 'Premium',
      rating: 4.8,
      distance: '1.8km',
      address: 'Rua Oscar Freire, 987'
    },
    {
      name: 'Salão Charme',
      category: 'Cabelo',
      services: ['Corte', 'Escova', 'Penteados'],
      plan: 'Básico',
      rating: 4.5,
      distance: '1.5km',
      address: 'Rua Haddock Lobo, 147'
    },
    {
      name: 'Nail Studio Pro',
      category: 'Unhas',
      services: ['Manicure', 'Pedicure', 'Alongamento'],
      plan: 'Plus',
      rating: 4.7,
      distance: '0.9km',
      address: 'Rua Bela Cintra, 258'
    },
    {
      name: 'Spa Zen Beleza',
      category: 'Pele',
      services: ['Limpeza de Pele', 'Relaxamento', 'Hidratação'],
      plan: 'Plus',
      rating: 4.6,
      distance: '2.3km',
      address: 'Av. Rebouças, 369'
    },
    {
      name: 'Barbearia Moderna',
      category: 'Cabelo',
      services: ['Corte Moderno', 'Barba', 'Sobrancelha'],
      plan: 'Básico',
      rating: 4.4,
      distance: '1.1km',
      address: 'Rua da Bela Vista, 741'
    },
    {
      name: 'Espaço Unhas & Cia',
      category: 'Unhas',
      services: ['Manicure', 'Pedicure', 'Decoração'],
      plan: 'Básico',
      rating: 4.3,
      distance: '1.7km',
      address: 'Rua Teodoro Sampaio, 852'
    },
    {
      name: 'Clínica Facial Expert',
      category: 'Pele',
      services: ['Tratamento Facial', 'Botox', 'Preenchimento'],
      plan: 'Premium',
      rating: 5.0,
      distance: '2.8km',
      address: 'Av. Paulista, 1000'
    }
  ];

  function getPlanClass(plan) {
    const classes = {
      'Básico': 'border-gray-300 text-gray-500 dark:border-slate-600 dark:text-slate-400',
      'Plus': 'border-[#3366FF] text-[#3366FF] dark:border-blue-400 dark:text-blue-400',
      'Premium': 'border-[#132761] text-[#132761] dark:border-blue-300 dark:text-blue-300'
    };
    return classes[plan] || '';
  }

  function renderStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let starsHTML = '';
  
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        starsHTML += '<span class="text-yellow-400">★</span>';
      } else if (i === fullStars && hasHalfStar) {
        starsHTML += '<span class="text-yellow-400">☆</span>';
      } else {
        starsHTML += '<span class="text-gray-300">☆</span>';
      }
    }
  
    return starsHTML;
  }

  function renderEstablishments() {
    return ALL_ESTABLISHMENTS.map(est => `
      <div class="bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col hover:shadow-lg hover:border-gray-300 transition-all dark:bg-slate-900 dark:border-slate-800 dark:hover:border-slate-700">
        <div class="bg-[#3366FF]/6 flex items-center justify-center py-6">
          <div class="w-14 h-14 rounded-xl bg-white border border-[#3366FF]/20 flex items-center justify-center shadow-sm dark:bg-slate-950">
            <span class="text-xl font-extrabold text-[#3366FF]">${est.name.charAt(0)}</span>
          </div>
        </div>
      
        <div class="p-4 flex flex-col flex-1 gap-3">
          <div>
            <h3 class="text-sm font-semibold text-gray-900 leading-snug dark:text-white">${est.name}</h3>
            <p class="text-xs text-gray-400 mt-0.5 dark:text-slate-500">${est.category}</p>
          </div>
        
          <div class="flex items-center gap-2">
            <div class="flex text-xs">${renderStars(est.rating)}</div>
            <span class="text-xs text-gray-500">${est.rating}</span>
            <span class="text-xs text-gray-400">• ${est.distance}</span>
          </div>
        
          <p class="text-xs text-gray-400 dark:text-slate-400">${est.address}</p>
        
          <p class="text-xs text-gray-400 leading-relaxed dark:text-slate-400">${est.services.join(' · ')}</p>
        
          <div class="flex-1"></div>
        
          <a href="#" class="block text-center text-xs font-semibold bg-[#3366FF] text-white py-2.5 rounded-lg hover:bg-[#2C58DB] transition-colors">
            Ver detalhes
          </a>
        
          <div class="flex items-center gap-1.5">
            <span class="text-[10px] text-gray-400 dark:text-slate-500">Plano</span>
            <span class="text-[10px] font-semibold border rounded-full px-2 py-0.5 ${getPlanClass(est.plan)}">${est.plan}</span>
          </div>
        </div>
      </div>
    `).join('');
  }

  // Inicialização exclusiva da lista de estabelecimentos.
  // A homepage também possui #establishments-grid, mas já traz cartões fixos no HTML.
  document.addEventListener('DOMContentLoaded', function () {
    const establishmentsGrid = document.getElementById('establishments-grid');
    const count = document.getElementById('establishments-count');
    if (!establishmentsGrid || !count) return;

    establishmentsGrid.innerHTML = renderEstablishments();
    count.textContent = `${ALL_ESTABLISHMENTS.length} estabelecimentos`;

    fetch('../db.json')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        const parceiros = Array.isArray(data.estabelecimentos)
          ? data.estabelecimentos
          : [];

        const servicos = Array.isArray(data.servicos)
          ? data.servicos
          : [];

        const novos = parceiros
          .filter(p => p.statusAprovacao === 'aprovado' && p.excluidoEm == null)
          .map(p => ({
            name: p.nomeFantasia || 'Estabelecimento parceiro',
            category: p.categoriaPrincipal || 'Serviços',
            services: servicos
              .filter(s => s.estabelecimentoId === p.id && s.status === 'ativo')
              .map(s => s.nome),
            plan: 'Básico',
            rating: Number(p.notaMedia) || 0,
            distance: '—',
            address: [
              p.endereco?.logradouro,
              p.endereco?.numero,
              p.endereco?.cidade
            ].filter(Boolean).join(', ')
          }))
          .filter(p => !ALL_ESTABLISHMENTS.some(e => e.name === p.name));

        if (novos.length) {
          ALL_ESTABLISHMENTS.push(...novos);
          establishmentsGrid.innerHTML = renderEstablishments();
        }

        if (count) {
          count.textContent = `${ALL_ESTABLISHMENTS.length} estabelecimentos`;
        }
      })
      .catch(error => {
        console.warn('Erro ao carregar db.json:', error);
      });
  });

  // ===== ETAPAS DO CADASTRO DE PARCEIRO =====
          let etapaAtual = 1;
          const totalEtapas = 4;

          function mudarEtapa(direcao) {
              const proxima = etapaAtual + direcao;
              if (proxima < 1 || proxima > totalEtapas) {
                  if (proxima < 1) window.location.href = '../Login/login.html';
                  return;
              }
              irParaEtapa(proxima);
          }

          function irParaEtapa(numero) {
              if (numero < 1 || numero > totalEtapas) return;

              document.querySelector(`.etapa[data-step="${etapaAtual}"]`).style.display = 'none';
              document.querySelector(`.etapa[data-step="${numero}"]`).style.display = 'flex';

              etapaAtual = numero;
              atualizarNavegacao();
              window.scrollTo({ top: 0, behavior: 'smooth' });
          }

          function atualizarNavegacao() {
              const btnVoltar = document.getElementById('btnVoltar');
              const btnProximo = document.getElementById('btnProximo');
              const btnPublicar = document.getElementById('btnPublicar');

              document.getElementById('etapaNumero').textContent = etapaAtual;
              btnVoltar.style.display = etapaAtual === 1 ? 'none' : 'block';

              if (etapaAtual === totalEtapas) {
                  btnProximo.style.display = 'none';
                  btnPublicar.style.display = 'block';
              } else {
                  btnProximo.style.display = 'block';
                  btnPublicar.style.display = 'none';
              }

              // Atualiza o destaque das abas no topo
              document.querySelectorAll('.aba').forEach(el => {
                  const step = parseInt(el.dataset.step);
                  if (step === etapaAtual) {
                      el.className = 'btn btn--primary btn--sm flex-1 aba';
                  } else {
                      el.className = 'btn btn--ghost btn--sm flex-1 aba';
                  }
              });
          }

          function adicionarServico() {
              const container = document.getElementById('servicos-container');
              const div = document.createElement('div');
              div.className = 'card--stack';
              div.style.borderTop = '1px solid var(--border-subtle)';
              div.style.paddingTop = '1rem';
              div.innerHTML = `
          <div class="field">
            <label class="field__label">Nome do serviço</label>
            <input type="text" class="input" name="servico_nome[]" placeholder="Ex: Hidratação" required>
          </div>
          <div class="field">
            <label class="field__label">Preço (R$)</label>
            <input type="number" class="input" name="servico_preco[]" placeholder="80,00" step="0.01" required>
          </div>
        `;
              container.appendChild(div);
          }
      
document.addEventListener('DOMContentLoaded', () => {
  const campos = {
    regCpf: 'cpf',
    respCpf: 'cpf',
    documento: 'cnpj'
  };

  Object.entries(campos).forEach(([id, tipo]) => {
    const campo = document.getElementById(id);
    if (!campo) return;

    campo.addEventListener('input', () => {
      let valor = campo.value.replace(/\D/g, '');

      if (tipo === 'cpf') {
        valor = valor.slice(0, 11);
        valor = valor
          .replace(/^(\d{3})(\d)/, '$1.$2')
          .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
          .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4');
      } else {
        valor = valor.slice(0, 14);
        valor = valor
          .replace(/^(\d{2})(\d)/, '$1.$2')
          .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
          .replace(/^(\d{2})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3/$4')
          .replace(/^(\d{2})\.(\d{3})\.(\d{3})\/(\d{4})(\d)/, '$1.$2.$3/$4-$5');
      }

      campo.value = valor;
    });
  });
});
        
  // ===== CLIQUES EXTRAÍDOS DO HTML =====
  document.addEventListener('click', function(event) {
    const element = event.target.closest('[data-js-action]');
    if (!element) return;
    switch (element.dataset.jsAction) {
      case 'toggle-theme':
        toggleTheme();
        break;
       case 'toggle-password':
       case 'toggle-password-login':
         alternarVisibilidadeSenha(element);
        break;
        break;
      case 'go-to-step':
        irParaEtapa(Number(element.dataset.step));
        break;
      case 'add-service':
        adicionarServico();
        break;
      case 'previous-step':
        mudarEtapa(-1);
        break;
      case 'next-step':
        mudarEtapa(1);
        break;
      case 'navigate':
        window.location.href = element.dataset.jsHref;
        break;
    }
  });
})();
