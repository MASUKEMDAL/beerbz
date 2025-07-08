// Gerenciamento de UI e interações
class UIManager {
  constructor() {
    this.modal = null;
    this.toastContainer = null;
    this.init();
  }

  init() {
    this.criarModal();
    this.criarToastContainer();
    this.configurarAnimacoes();
  }

  // Criar modal dinâmico
  criarModal() {
    if (document.getElementById('modal')) return;

    const modal = document.createElement('div');
    modal.id = 'modal';
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal-content">
        <span class="modal-close" onclick="fecharModal()">&times;</span>
        <img class="modal-image" id="imagemModal" alt="Produto">
        <div class="modal-info" id="modalInfo"></div>
      </div>
    `;
    document.body.appendChild(modal);
    this.modal = modal;
  }

  // Criar container de toast
  criarToastContainer() {
    if (document.getElementById('toast-container')) return;

    const container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
    this.toastContainer = container;
  }

  // Configurar animações de scroll
  configurarAnimacoes() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in-up');
        }
      });
    }, observerOptions);

    // Observar elementos que devem animar
    document.querySelectorAll('.produto, .feature, .contact-item').forEach(el => {
      observer.observe(el);
    });
  }
}

// Instanciar gerenciador de UI
const uiManager = new UIManager();

// Função para mostrar toast
function mostrarToast(mensagem, tipo = 'info', duracao = 3000) {
  const toast = document.createElement('div');
  toast.className = `toast ${tipo}`;
  
  const icon = {
    success: 'fas fa-check-circle',
    error: 'fas fa-exclamation-circle',
    warning: 'fas fa-exclamation-triangle',
    info: 'fas fa-info-circle'
  };

  toast.innerHTML = `
    <i class="${icon[tipo] || icon.info}"></i>
    <span>${mensagem}</span>
  `;

  const container = document.getElementById('toast-container');
  if (container) {
    container.appendChild(toast);

    // Mostrar toast
    setTimeout(() => toast.classList.add('show'), 100);

    // Remover toast
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        if (container.contains(toast)) {
          container.removeChild(toast);
        }
      }, 300);
    }, duracao);

    // Permitir fechar clicando
    toast.addEventListener('click', () => {
      toast.classList.remove('show');
      setTimeout(() => {
        if (container.contains(toast)) {
          container.removeChild(toast);
        }
      }, 300);
    });
  }
}

// Função para abrir modal
function abrirModal(imagemSrc, nome = '', descricao = '', preco = 0) {
  const modal = document.getElementById('modal');
  const imagemModal = document.getElementById('imagemModal');
  const modalInfo = document.getElementById('modalInfo');

  if (!modal || !imagemModal) return;

  imagemModal.src = imagemSrc;
  imagemModal.alt = nome;

  // Adicionar informações do produto se fornecidas
  if (nome && modalInfo) {
    modalInfo.innerHTML = `
      <h3>${nome}</h3>
      ${descricao ? `<p class="modal-description">${descricao}</p>` : ''}
      ${preco > 0 ? `<div class="modal-price">R$ ${preco.toFixed(2)}</div>` : ''}
    `;
  } else if (modalInfo) {
    modalInfo.innerHTML = '';
  }

  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';

  // Animação de entrada
  setTimeout(() => {
    modal.classList.add('show');
  }, 10);
}

// Função para fechar modal
function fecharModal() {
  const modal = document.getElementById('modal');
  if (modal) {
    modal.classList.remove('show');
    setTimeout(() => {
      modal.style.display = 'none';
      document.body.style.overflow = 'auto';
    }, 300);
  }
}

// Função para scroll suave melhorado
function scrollSuaveParaElemento(elemento, offset = 70) {
  if (typeof elemento === 'string') {
    elemento = document.querySelector(elemento);
  }
  
  if (!elemento) return;

  const elementoTop = elemento.offsetTop - offset;
  const startPosition = window.pageYOffset;
  const distance = elementoTop - startPosition;
  const duration = 800;
  let start = null;

  function animacao(currentTime) {
    if (start === null) start = currentTime;
    const timeElapsed = currentTime - start;
    const run = ease(timeElapsed, startPosition, distance, duration);
    window.scrollTo(0, run);
    if (timeElapsed < duration) requestAnimationFrame(animacao);
  }

  function ease(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t + b;
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
  }

  requestAnimationFrame(animacao);
}

// Função para validar formulário em tempo real
function configurarValidacaoFormulario() {
  const campos = ['nomeCliente', 'endereco', 'telefone', 'pagamento'];
  
  campos.forEach(campoId => {
    const campo = document.getElementById(campoId);
    if (!campo) return;

    campo.addEventListener('blur', function() {
      validarCampo(this);
    });

    campo.addEventListener('input', function() {
      removerErro(this);
    });
  });
}

// Validar campo individual
function validarCampo(campo) {
  const valor = campo.value.trim();
  let valido = true;
  let mensagem = '';

  switch (campo.id) {
    case 'nomeCliente':
      if (!valor) {
        valido = false;
        mensagem = 'Nome é obrigatório';
      } else if (valor.length < 2) {
        valido = false;
        mensagem = 'Nome deve ter pelo menos 2 caracteres';
      }
      break;

    case 'endereco':
      if (!valor) {
        valido = false;
        mensagem = 'Endereço é obrigatório';
      } else if (valor.length < 10) {
        valido = false;
        mensagem = 'Endereço deve ser mais detalhado';
      }
      break;

    case 'telefone':
      const telefoneNumeros = valor.replace(/\D/g, '');
      if (!valor) {
        valido = false;
        mensagem = 'Telefone é obrigatório';
      } else if (telefoneNumeros.length < 10 || telefoneNumeros.length > 11) {
        valido = false;
        mensagem = 'Telefone deve ter 10 ou 11 dígitos';
      }
      break;

    case 'pagamento':
      if (!valor) {
        valido = false;
        mensagem = 'Selecione uma forma de pagamento';
      }
      break;
  }

  if (!valido) {
    mostrarErroCampo(campo, mensagem);
  } else {
    removerErro(campo);
  }

  return valido;
}

// Mostrar erro no campo
function mostrarErroCampo(campo, mensagem) {
  removerErro(campo);
  
  campo.classList.add('error');
  
  const erro = document.createElement('div');
  erro.className = 'field-error';
  erro.textContent = mensagem;
  
  campo.parentNode.appendChild(erro);
}

// Remover erro do campo
function removerErro(campo) {
  campo.classList.remove('error');
  
  const erro = campo.parentNode.querySelector('.field-error');
  if (erro) {
    erro.remove();
  }
}

// Função para loading de botões
function mostrarLoadingBotao(botao, texto = 'Carregando...') {
  if (!botao) return;
  
  const textoOriginal = botao.innerHTML;
  botao.disabled = true;
  botao.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${texto}`;
  
  return function() {
    botao.disabled = false;
    botao.innerHTML = textoOriginal;
  };
}

// Função para confirmar ações
function confirmarAcao(mensagem, callback) {
  if (confirm(mensagem)) {
    callback();
  }
}

// Função para copiar texto
function copiarTexto(texto) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(texto).then(() => {
      mostrarToast('Texto copiado!', 'success');
    }).catch(() => {
      mostrarToast('Erro ao copiar texto', 'error');
    });
  } else {
    // Fallback para navegadores mais antigos
    const textArea = document.createElement('textarea');
    textArea.value = texto;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      mostrarToast('Texto copiado!', 'success');
    } catch (err) {
      mostrarToast('Erro ao copiar texto', 'error');
    }
    document.body.removeChild(textArea);
  }
}

// Função para detectar dispositivo móvel
function isMobile() {
  return window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Função para otimizar imagens lazy loading
function configurarLazyLoading() {
  const images = document.querySelectorAll('img[data-src]');
  
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove('lazy');
        imageObserver.unobserve(img);
      }
    });
  });

  images.forEach(img => imageObserver.observe(img));
}

// Função para debounce
function debounce(func, wait, immediate) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func(...args);
  };
}

// Configurar validação quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
  configurarValidacaoFormulario();
  configurarLazyLoading();
});

// Expor funções globalmente
window.mostrarToast = mostrarToast;
window.abrirModal = abrirModal;
window.fecharModal = fecharModal;
window.scrollSuaveParaElemento = scrollSuaveParaElemento;
window.mostrarLoadingBotao = mostrarLoadingBotao;
window.confirmarAcao = confirmarAcao;
window.copiarTexto = copiarTexto;
window.isMobile = isMobile;
window.debounce = debounce;