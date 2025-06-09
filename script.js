const produtos = [
  {
    nome: "Chopp Pilsen 1L",
    preco: 14.50,
    imagem: "Pilsen.jpeg"
  },
  {
    nome: "Chopp Puro Malte 1L",
    preco: 15.50,
    imagem: "Malte.jpeg"
  },
  {
    nome: "Chopp Vinho 1L",
    preco: 17.50,
    imagem: "Vinho.jpeg"
  },
];

const acessorios = [
  {
    nome: "Camisa Beer BZ Black",
    preco: 59.90,
    imagem: "Polo Black.jpeg"
  },
  {
    nome: "Camisa Beer BZ Bege",
    preco: 59.90,
    imagem: "Polo Bege.jpeg"
  },
  {
    nome: "Moletom Beer BZ",
    preco: 129.90,
    imagem: "Moleton Black.png"
  },
  {
    nome: "Viseira Beer BZ",
    preco: 39.90,
    imagem: "viseira.jpeg"
  }
];

const lista = document.getElementById('listaProdutos');
const listaAcessorios = document.getElementById('listaAcessorios');
const ulCarrinho = document.getElementById('itensCarrinho');
const totalSpan = document.getElementById('total');
const carrinho = [];

// Renderiza produtos
produtos.forEach((prod, index) => {
  const card = document.createElement('div');
  card.className = 'produto';
  card.innerHTML = `
    <img src="${prod.imagem}" alt="${prod.nome}" class="img-produto" onclick="abrirModal('${prod.imagem}')"/>
    <h3>${prod.nome}</h3>
    <p>R$ ${prod.preco.toFixed(2)}</p>
    <button onclick="adicionar(${index})">Adicionar</button>
  `;
  lista.appendChild(card);
});

// Renderiza acessórios
acessorios.forEach((item, index) => {
  const card = document.createElement("div");
  card.className = "produto";
  card.innerHTML = `
    <img src="${item.imagem}" alt="${item.nome}" class="img-produto" onclick="abrirModal('${item.imagem}')"/>
    <h3>${item.nome}</h3>
    <p>R$ ${item.preco.toFixed(2)}</p>
    <button onclick="adicionarAcessorio(${index})">Adicionar</button>
  `;
  listaAcessorios.appendChild(card);
});

// Adiciona produto
function adicionar(index) {
  carrinho.push(produtos[index]);
  atualizarCarrinho();
}

// Adiciona acessório
function adicionarAcessorio(index) {
  carrinho.push(acessorios[index]);
  atualizarCarrinho();
}

// Atualiza lista do carrinho
function atualizarCarrinho() {
  ulCarrinho.innerHTML = '';
  let total = 0;
  carrinho.forEach((item, index) => {
    const li = document.createElement('li');
    li.innerHTML = `${item.nome} - R$ ${item.preco.toFixed(2)} 
    <button onclick="removerItemCarrinho(${index})">Remover</button>`;
    ulCarrinho.appendChild(li);
    total += item.preco;
  });
  totalSpan.textContent = total.toFixed(2);
}

// Função para remover item do carrinho
function removerItemCarrinho(index) {
  carrinho.splice(index, 1); // Remove o item do array
  atualizarCarrinho(); // Atualiza a lista do carrinho
}

// Envia pedido para o WhatsApp
function enviarPedido() {
  const nome = document.getElementById('nomeCliente').value;
  const endereco = document.getElementById('endereco').value;
  const telefone = document.getElementById('telefone').value;

  if (!nome || !endereco || !telefone || carrinho.length === 0) {
    alert('Preencha os dados e adicione ao menos um produto.');
    return;
  }

  let texto = `Olá! Gostaria de fazer um pedido:\n\n`;
  carrinho.forEach(item => {
    texto += `• ${item.nome} - R$ ${item.preco.toFixed(2)}\n`;
  });
  texto += `\nTotal: R$ ${totalSpan.textContent}`;
  texto += `\n\nNome: ${nome}\nEndereço: ${endereco}\nTelefone: ${telefone}`;

  const whatsappURL = `https://wa.me/5534997771785?text=${encodeURIComponent(texto)}`;
  window.open(whatsappURL, '_blank');
}

// Modal
function abrirModal(imagemSrc) {
  const modal = document.getElementById("modal");
  const imagemModal = document.getElementById("imagemModal");
  modal.style.display = "flex";
  imagemModal.src = imagemSrc;
}

function fecharModal() {
  document.getElementById("modal").style.display = "none";
}

window.onclick = function(event) {
  const modal = document.getElementById("modal");
  if (event.target === modal) {
    modal.style.display = "none";
  }
};
