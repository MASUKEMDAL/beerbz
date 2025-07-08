// Gerenciamento avançado do carrinho
class CarrinhoManager {
  constructor() {
    this.carrinho = this.carregarCarrinho();
    this.listeners = [];
  }

  // Carregar carrinho do localStorage
  carregarCarrinho() {
    try {
      const saved = localStorage.getItem('beer_bz_carrinho');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Erro ao carregar carrinho:', error);
      return [];
    }
  }

  // Salvar carrinho no localStorage
  salvarCarrinho() {
    try {
      localStorage.setItem('beer_bz_carrinho', JSON.stringify(this.carrinho));
      this.notificarListeners();
    } catch (error) {
      console.error('Erro ao salvar carrinho:', error);
    }
  }

  // Adicionar item ao carrinho
  adicionarItem(produto, tipo = 'produto') {
    const item = {
      ...produto,
      id: Date.now() + Math.random(),
      tipo: tipo,
      quantidade: 1,
      adicionadoEm: new Date().toISOString()
    };

    // Verificar se já existe item similar
    const itemExistente = this.carrinho.find(i => 
      i.nome === produto.nome && i.tipo === tipo
    );

    if (itemExistente) {
      itemExistente.quantidade += 1;
    } else {
      this.carrinho.push(item);
    }

    this.salvarCarrinho();
    return item;
  }

  // Remover item do carrinho
  removerItem(itemId) {
    const index = this.carrinho.findIndex(item => item.id === itemId);
    if (index !== -1) {
      const item = this.carrinho.splice(index, 1)[0];
      this.salvarCarrinho();
      return item;
    }
    return null;
  }

  // Atualizar quantidade
  atualizarQuantidade(itemId, novaQuantidade) {
    const item = this.carrinho.find(i => i.id === itemId);
    if (item && novaQuantidade > 0) {
      item.quantidade = novaQuantidade;
      this.salvarCarrinho();
      return item;
    } else if (item && novaQuantidade <= 0) {
      return this.removerItem(itemId);
    }
    return null;
  }

  // Limpar carrinho
  limparCarrinho() {
    this.carrinho = [];
    this.salvarCarrinho();
  }

  // Obter total
  obterTotal() {
    return this.carrinho.reduce((total, item) => {
      return total + (item.preco * item.quantidade);
    }, 0);
  }

  // Obter quantidade total de itens
  obterQuantidadeTotal() {
    return this.carrinho.reduce((total, item) => total + item.quantidade, 0);
  }

  // Obter itens do carrinho
  obterItens() {
    return [...this.carrinho];
  }

  // Verificar se carrinho está vazio
  estaVazio() {
    return this.carrinho.length === 0;
  }

  // Adicionar listener para mudanças
  adicionarListener(callback) {
    this.listeners.push(callback);
  }

  // Remover listener
  removerListener(callback) {
    const index = this.listeners.indexOf(callback);
    if (index !== -1) {
      this.listeners.splice(index, 1);
    }
  }

  // Notificar listeners sobre mudanças
  notificarListeners() {
    this.listeners.forEach(callback => {
      try {
        callback(this.carrinho);
      } catch (error) {
        console.error('Erro ao notificar listener:', error);
      }
    });
  }

  // Validar carrinho antes do checkout
  validarCarrinho() {
    const erros = [];

    if (this.estaVazio()) {
      erros.push('Carrinho está vazio');
    }

    // Verificar se todos os itens têm preços válidos
    this.carrinho.forEach((item, index) => {
      if (!item.preco || item.preco <= 0) {
        erros.push(`Item ${index + 1} tem preço inválido`);
      }
      if (!item.quantidade || item.quantidade <= 0) {
        erros.push(`Item ${index + 1} tem quantidade inválida`);
      }
    });

    return {
      valido: erros.length === 0,
      erros: erros
    };
  }

  // Obter resumo do carrinho
  obterResumo() {
    const total = this.obterTotal();
    const quantidadeTotal = this.obterQuantidadeTotal();
    const tiposDeItens = [...new Set(this.carrinho.map(item => item.tipo))];

    return {
      total: total,
      quantidadeTotal: quantidadeTotal,
      quantidadeItens: this.carrinho.length,
      tiposDeItens: tiposDeItens,
      itens: this.obterItens()
    };
  }

  // Aplicar desconto (se necessário no futuro)
  aplicarDesconto(porcentagem) {
    if (porcentagem < 0 || porcentagem > 100) {
      throw new Error('Porcentagem de desconto inválida');
    }

    const desconto = this.obterTotal() * (porcentagem / 100);
    return {
      subtotal: this.obterTotal(),
      desconto: desconto,
      total: this.obterTotal() - desconto
    };
  }

  // Exportar carrinho para compartilhamento
  exportarCarrinho() {
    return {
      itens: this.carrinho,
      total: this.obterTotal(),
      exportadoEm: new Date().toISOString(),
      versao: '1.0'
    };
  }
}

// Instância global do gerenciador de carrinho
const carrinhoManager = new CarrinhoManager();

// Funções de conveniência para compatibilidade
function adicionarAoCarrinhoAvancado(produto, tipo = 'produto') {
  const item = carrinhoManager.adicionarItem(produto, tipo);
  mostrarToast('Produto adicionado ao carrinho!', 'success');
  
  // Animação do botão do carrinho
  const cartBtn = document.querySelector('.cart-toggle');
  if (cartBtn) {
    cartBtn.style.transform = 'scale(1.2)';
    setTimeout(() => {
      cartBtn.style.transform = 'scale(1)';
    }, 200);
  }
  
  return item;
}

function removerDoCarrinhoAvancado(itemId) {
  const item = carrinhoManager.removerItem(itemId);
  if (item) {
    mostrarToast('Produto removido do carrinho', 'warning');
  }
  return item;
}

function atualizarQuantidadeItem(itemId, novaQuantidade) {
  return carrinhoManager.atualizarQuantidade(itemId, novaQuantidade);
}

// Listener para atualizar UI quando carrinho mudar
carrinhoManager.adicionarListener((carrinho) => {
  atualizarUICarrinho();
});

// Atualizar UI do carrinho
function atualizarUICarrinho() {
  const resumo = carrinhoManager.obterResumo();
  
  // Atualizar contador
  const cartCount = document.getElementById('cartCount');
  if (cartCount) {
    cartCount.textContent = resumo.quantidadeTotal;
    cartCount.style.display = resumo.quantidadeTotal > 0 ? 'flex' : 'none';
  }
  
  // Atualizar lista de itens
  const itensCarrinho = document.getElementById('itensCarrinho');
  const cartEmpty = document.getElementById('cartEmpty');
  const cartSummary = document.getElementById('cartSummary');
  const totalSpan = document.getElementById('total');
  
  if (!itensCarrinho) return;
  
  itensCarrinho.innerHTML = '';
  
  if (carrinhoManager.estaVazio()) {
    if (cartEmpty) cartEmpty.style.display = 'flex';
    if (cartSummary) cartSummary.style.display = 'none';
    return;
  }
  
  if (cartEmpty) cartEmpty.style.display = 'none';
  if (cartSummary) cartSummary.style.display = 'block';
  
  resumo.itens.forEach((item) => {
    const li = document.createElement('li');
    li.className = 'cart-item';
    li.innerHTML = `
      <img src="${item.imagem}" alt="${item.nome}" class="cart-item-image">
      <div class="cart-item-info">
        <div class="cart-item-name">${item.nome}</div>
        <div class="cart-item-price">R$ ${item.preco.toFixed(2)}</div>
        ${item.quantidade > 1 ? `<div class="cart-item-quantity">Qtd: ${item.quantidade}</div>` : ''}
      </div>
      <div class="cart-item-controls">
        ${item.quantidade > 1 ? `
          <button class="quantity-btn" onclick="atualizarQuantidadeItem('${item.id}', ${item.quantidade - 1})">
            <i class="fas fa-minus"></i>
          </button>
          <span class="quantity-display">${item.quantidade}</span>
        ` : ''}
        <button class="cart-item-remove" onclick="removerDoCarrinhoAvancado('${item.id}')">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    `;
    itensCarrinho.appendChild(li);
  });
  
  if (totalSpan) {
    totalSpan.textContent = resumo.total.toFixed(2);
  }
}

// Validação avançada do pedido
function validarPedidoCompleto() {
  const validacaoCarrinho = carrinhoManager.validarCarrinho();
  const erros = [...validacaoCarrinho.erros];
  
  // Validar dados do cliente
  const nome = document.getElementById('nomeCliente')?.value.trim();
  const endereco = document.getElementById('endereco')?.value.trim();
  const telefone = document.getElementById('telefone')?.value.trim();
  const pagamento = document.getElementById('pagamento')?.value;
  
  if (!nome) erros.push('Nome é obrigatório');
  if (!endereco) erros.push('Endereço é obrigatório');
  if (!telefone) erros.push('Telefone é obrigatório');
  if (!pagamento) erros.push('Forma de pagamento é obrigatória');
  
  // Validar formato do telefone
  if (telefone) {
    const telefoneNumeros = telefone.replace(/\D/g, '');
    if (telefoneNumeros.length < 10 || telefoneNumeros.length > 11) {
      erros.push('Telefone deve ter 10 ou 11 dígitos');
    }
  }
  
  return {
    valido: erros.length === 0,
    erros: erros
  };
}

// Gerar mensagem do WhatsApp melhorada
function gerarMensagemWhatsApp() {
  const resumo = carrinhoManager.obterResumo();
  const nome = document.getElementById('nomeCliente').value.trim();
  const endereco = document.getElementById('endereco').value.trim();
  const telefone = document.getElementById('telefone').value.trim();
  const pagamento = document.getElementById('pagamento').value;
  
  let mensagem = `🍺 *PEDIDO BEER BZ* 🍺\n\n`;
  mensagem += `👤 *Cliente:* ${nome}\n`;
  mensagem += `📍 *Endereço:* ${endereco}\n`;
  mensagem += `📱 *Telefone:* ${telefone}\n`;
  mensagem += `💳 *Pagamento:* ${pagamento}\n\n`;
  mensagem += `📋 *ITENS DO PEDIDO:*\n`;
  
  resumo.itens.forEach((item, index) => {
    const subtotal = item.preco * item.quantidade;
    mensagem += `${index + 1}. ${item.nome}`;
    if (item.quantidade > 1) {
      mensagem += ` (${item.quantidade}x)`;
    }
    mensagem += ` - R$ ${subtotal.toFixed(2)}\n`;
  });
  
  mensagem += `\n💰 *TOTAL: R$ ${resumo.total.toFixed(2)}*\n`;
  mensagem += `📦 *Total de itens:* ${resumo.quantidadeTotal}\n\n`;
  mensagem += `⏰ Pedido realizado em: ${new Date().toLocaleString('pt-BR')}\n\n`;
  mensagem += `Obrigado por escolher a Beer BZ! 🍻`;
  
  return mensagem;
}

// Inicializar carrinho quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
  atualizarUICarrinho();
});

// Expor funções globalmente
window.carrinhoManager = carrinhoManager;
window.adicionarAoCarrinhoAvancado = adicionarAoCarrinhoAvancado;
window.removerDoCarrinhoAvancado = removerDoCarrinhoAvancado;
window.atualizarQuantidadeItem = atualizarQuantidadeItem;
window.validarPedidoCompleto = validarPedidoCompleto;
window.gerarMensagemWhatsApp = gerarMensagemWhatsApp;