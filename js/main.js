// Dados dos produtos
const produtos = [
  {
    nome: "Chopp Pilsen 1L",
    preco: 14.50,
    imagem: "Pilsen.jpeg",
    categoria: "pilsen",
    descricao: "Chopp Pilsen tradicional, refrescante e equilibrado. Perfeito para qualquer ocasião.",
    badge: "Tradicional"
  },
  {
    nome: "Chopp Puro Malte 1L",
    preco: 15.50,
    imagem: "Malte.jpeg",
    categoria: "malte",
    descricao: "Chopp artesanal feito com puro malte, sabor encorpado e aroma marcante.",
    badge: "Premium"
  },
  {
    nome: "Chopp Vinho 1L",
    preco: 17.50,
    imagem: "Vinho.jpeg",
    categoria: "especial",
    descricao: "Chopp especial com toque de vinho, sabor único e sofisticado.",
    badge: "Especial"
  }
];

const acessorios = [
  {
    nome: "Camisa Beer BZ Black",
    preco: 59.90,
    imagem: "Polo Black.jpeg",
    categoria: "roupas",
    descricao: "Camisa polo premium com logo Beer BZ bordado. Tecido de alta qualidade.",
    badge: "Exclusivo"
  },
  {
    nome: "Camisa Beer BZ Bege",
    preco: 59.90,
    imagem: "Polo Bege.jpeg",
    categoria: "roupas",
    descricao: "Camisa polo bege elegante com acabamento premium e logo bordado.",
    badge: "Exclusivo"
  },
  {
    nome: "Moletom Beer BZ",
    preco: 129.90,
    imagem: "Moleton Black.png",
    categoria: "roupas",
    descricao: "Moletom confortável e estiloso, perfeito para os dias mais frios.",
    badge: "Conforto"
  },
  {
    nome: "Viseira Beer BZ",
    preco: 39.90,
    imagem: "viseira.jpeg",
    categoria: "acessorios",
    descricao: "Viseira ajustável com logo Beer BZ, proteção e estilo em um só produto.",
    badge: "Estilo"
  }
];

// Estado da aplicação
let carrinho = [];
let filtroAtivo = 'all';

// Elementos DOM
const listaProdutos = document.getElementById('listaProdutos');
const listaAcessorios = document.getElementById('listaAcessorios');
const cartCount = document.getElementById('cartCount');
const cartSidebar = document.getElementById('cartSidebar');
const cartOverlay = document.getElementById('cartOverlay');
const itensCarrinho = document.getElementById('itensCarrinho');
const totalSpan = document.getElementById('total');
const cartEmpty = document.getElementById('cartEmpty');
const cartSummary = document.getElementById('cartSummary');

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
  // Simular loading
  setTimeout(() => {
    document.getElementById('loading').classList.add('hidden');
  }, 2000);
  
  renderizarProdutos();
  renderizarAcessorios();
  configurarFiltros();
  configurarNavegacao();
  configurarScrollSuave();
  atualizarCarrinho();
});

// Renderização de produtos
function renderizarProdutos() {
  listaProdutos.innerHTML = '';
  
  const produtosFiltrados = filtroAtivo === 'all' 
    ? produtos 
    : produtos.filter(produto => produto.categoria === filtroAtivo);
  
  produtosFiltrados.forEach((produto, index) => {
    const card = document.createElement('div');
    card.className = 'produto fade-in-up';
    card.innerHTML = `
      ${produto.badge ? `<div class="produto-badge">${produto.badge}</div>` : ''}
      <img src="${produto.imagem}" alt="${produto.nome}" class="img-produto" onclick="abrirModal('${produto.imagem}', '${produto.nome}', '${produto.descricao}', ${produto.preco})"/>
      <h3>${produto.nome}</h3>
      <p class="produto-descricao">${produto.descricao}</p>
      <div class="produto-preco">R$ ${produto.preco.toFixed(2)}</div>
      <button onclick="adicionarAoCarrinho(${index}, 'produto')">
        <i class="fas fa-cart-plus"></i>
        Adicionar ao Carrinho
      </button>
    `;
    listaProdutos.appendChild(card);
  });
}

// Renderização de acessórios
function renderizarAcessorios() {
  listaAcessorios.innerHTML = '';
  
  acessorios.forEach((item, index) => {
    const card = document.createElement('div');
    card.className = 'produto fade-in-up';
    card.innerHTML = `
      ${item.badge ? `<div class="produto-badge">${item.badge}</div>` : ''}
      <img src="${item.imagem}" alt="${item.nome}" class="img-produto" onclick="abrirModal('${item.imagem}', '${item.nome}', '${item.descricao}', ${item.preco})"/>
      <h3>${item.nome}</h3>
      <p class="produto-descricao">${item.descricao}</p>
      <div class="produto-preco">R$ ${item.preco.toFixed(2)}</div>
      <button onclick="adicionarAoCarrinho(${index}, 'acessorio')">
        <i class="fas fa-cart-plus"></i>
        Adicionar ao Carrinho
      </button>
    `;
    listaAcessorios.appendChild(card);
  });
}

// Configurar filtros
function configurarFiltros() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remover classe active de todos os botões
      filterBtns.forEach(b => b.classList.remove('active'));
      
      // Adicionar classe active ao botão clicado
      btn.classList.add('active');
      
      // Atualizar filtro ativo
      filtroAtivo = btn.dataset.filter;
      
      // Re-renderizar produtos
      renderizarProdutos();
    });
  });
}

// Adicionar ao carrinho
function adicionarAoCarrinho(index, tipo) {
  const item = tipo === 'produto' ? produtos[index] : acessorios[index];
  
  carrinho.push({
    ...item,
    id: Date.now() + Math.random(),
    tipo: tipo
  });
  
  atualizarCarrinho();
  mostrarToast('Produto adicionado ao carrinho!', 'success');
  
  // Animação do botão do carrinho
  const cartBtn = document.querySelector('.cart-toggle');
  cartBtn.style.transform = 'scale(1.2)';
  setTimeout(() => {
    cartBtn.style.transform = 'scale(1)';
  }, 200);
}

// Atualizar carrinho
function atualizarCarrinho() {
  // Atualizar contador
  cartCount.textContent = carrinho.length;
  cartCount.style.display = carrinho.length > 0 ? 'flex' : 'none';
  
  // Limpar lista
  itensCarrinho.innerHTML = '';
  
  if (carrinho.length === 0) {
    cartEmpty.style.display = 'flex';
    cartSummary.style.display = 'none';
    return;
  }
  
  cartEmpty.style.display = 'none';
  cartSummary.style.display = 'block';
  
  let total = 0;
  
  carrinho.forEach((item, index) => {
    const li = document.createElement('li');
    li.className = 'cart-item';
    li.innerHTML = `
      <img src="${item.imagem}" alt="${item.nome}" class="cart-item-image">
      <div class="cart-item-info">
        <div class="cart-item-name">${item.nome}</div>
        <div class="cart-item-price">R$ ${item.preco.toFixed(2)}</div>
      </div>
      <button class="cart-item-remove" onclick="removerDoCarrinho(${index})">
        <i class="fas fa-trash"></i>
      </button>
    `;
    itensCarrinho.appendChild(li);
    total += item.preco;
  });
  
  totalSpan.textContent = total.toFixed(2);
}

// Remover do carrinho
function removerDoCarrinho(index) {
  carrinho.splice(index, 1);
  atualizarCarrinho();
  mostrarToast('Produto removido do carrinho', 'warning');
}

// Toggle carrinho
function toggleCart() {
  cartSidebar.classList.toggle('active');
  cartOverlay.classList.toggle('active');
  document.body.style.overflow = cartSidebar.classList.contains('active') ? 'hidden' : 'auto';
}

// Enviar pedido
function enviarPedido() {
  const nome = document.getElementById('nomeCliente').value.trim();
  const endereco = document.getElementById('endereco').value.trim();
  const telefone = document.getElementById('telefone').value.trim();
  const pagamento = document.getElementById('pagamento').value;

  // Validações
  if (!nome || !endereco || !telefone || !pagamento) {
    mostrarToast('Por favor, preencha todos os campos obrigatórios', 'error');
    return;
  }

  if (carrinho.length === 0) {
    mostrarToast('Adicione pelo menos um produto ao carrinho', 'error');
    return;
  }

  // Validar telefone (formato básico)
  const telefoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$|^\d{10,11}$/;
  if (!telefoneRegex.test(telefone.replace(/\D/g, ''))) {
    mostrarToast('Por favor, insira um telefone válido', 'error');
    return;
  }

  // Montar mensagem do WhatsApp
  let mensagem = `🍺 *PEDIDO BEER BZ* 🍺\n\n`;
  mensagem += `👤 *Cliente:* ${nome}\n`;
  mensagem += `📍 *Endereço:* ${endereco}\n`;
  mensagem += `📱 *Telefone:* ${telefone}\n`;
  mensagem += `💳 *Pagamento:* ${pagamento}\n\n`;
  mensagem += `📋 *ITENS DO PEDIDO:*\n`;
  
  carrinho.forEach((item, index) => {
    mensagem += `${index + 1}. ${item.nome} - R$ ${item.preco.toFixed(2)}\n`;
  });
  
  const total = carrinho.reduce((sum, item) => sum + item.preco, 0);
  mensagem += `\n💰 *TOTAL: R$ ${total.toFixed(2)}*\n\n`;
  mensagem += `⏰ Pedido realizado em: ${new Date().toLocaleString('pt-BR')}\n\n`;
  mensagem += `Obrigado por escolher a Beer BZ! 🍻`;

  // Abrir WhatsApp
  const whatsappURL = `https://wa.me/5534997771785?text=${encodeURIComponent(mensagem)}`;
  window.open(whatsappURL, '_blank');
  
  // Limpar carrinho e fechar sidebar
  carrinho = [];
  atualizarCarrinho();
  toggleCart();
  
  // Limpar formulário
  document.getElementById('nomeCliente').value = '';
  document.getElementById('endereco').value = '';
  document.getElementById('telefone').value = '';
  document.getElementById('pagamento').value = '';
  
  mostrarToast('Pedido enviado com sucesso!', 'success');
}

// Scroll suave para seções
function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    const offsetTop = section.offsetTop - 70; // Compensar altura do navbar
    window.scrollTo({
      top: offsetTop,
      behavior: 'smooth'
    });
  }
}

// Configurar navegação
function configurarNavegacao() {
  // Navbar scroll effect
  window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    
    // Atualizar links ativos
    atualizarLinksAtivos();
  });
  
  // Mobile menu toggle
  window.toggleMobileMenu = function() {
    const navMenu = document.querySelector('.nav-menu');
    const hamburger = document.querySelector('.hamburger');
    
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
  };
  
  // Fechar menu mobile ao clicar em link
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      const navMenu = document.querySelector('.nav-menu');
      const hamburger = document.querySelector('.hamburger');
      
      navMenu.classList.remove('active');
      hamburger.classList.remove('active');
    });
  });
}

// Atualizar links ativos na navegação
function atualizarLinksAtivos() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  
  let currentSection = '';
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    const sectionHeight = section.offsetHeight;
    
    if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
      currentSection = section.getAttribute('id');
    }
  });
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${currentSection}`) {
      link.classList.add('active');
    }
  });
}

// Configurar scroll suave
function configurarScrollSuave() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const offsetTop = target.offsetTop - 70;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });
}

// Formatação de telefone
document.getElementById('telefone')?.addEventListener('input', function(e) {
  let value = e.target.value.replace(/\D/g, '');
  
  if (value.length <= 11) {
    if (value.length <= 10) {
      value = value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    } else {
      value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
  }
  
  e.target.value = value;
});

// Fechar carrinho ao clicar fora
document.addEventListener('click', function(e) {
  if (!cartSidebar.contains(e.target) && !e.target.closest('.cart-toggle')) {
    if (cartSidebar.classList.contains('active')) {
      toggleCart();
    }
  }
});

// Fechar modal ao clicar fora
window.onclick = function(event) {
  const modal = document.getElementById('modal');
  if (event.target === modal) {
    fecharModal();
  }
};

// Atalhos de teclado
document.addEventListener('keydown', function(e) {
  // ESC para fechar modal ou carrinho
  if (e.key === 'Escape') {
    const modal = document.getElementById('modal');
    if (modal.style.display === 'flex') {
      fecharModal();
    } else if (cartSidebar.classList.contains('active')) {
      toggleCart();
    }
  }
});

// Expor funções globalmente
window.adicionarAoCarrinho = adicionarAoCarrinho;
window.removerDoCarrinho = removerDoCarrinho;
window.toggleCart = toggleCart;
window.enviarPedido = enviarPedido;
window.scrollToSection = scrollToSection;