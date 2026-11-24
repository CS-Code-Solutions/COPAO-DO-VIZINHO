// WhatsApp configurado: 55 + 51 + 99887726
const WHATSAPP_LOJA = "555199887726";

// Valor da Caipirinha com Picolé (ajuste se necessário)
const PRECO_CAIPIRINHA = 22.00;

let carrinho = JSON.parse(localStorage.getItem("copao_vizinho_cart")) || [];
let redLabelSelecionado = { tamanho: "550 ml", preco: 19.90 };

function formatarMoeda(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function salvarCarrinho() {
  localStorage.setItem("copao_vizinho_cart", JSON.stringify(carrinho));
  atualizarInterface();
}

function adicionarAoCarrinho(nome, preco) {
  const existente = carrinho.find((item) => item.nome === nome);
  if (existente) {
    existente.qtd += 1;
  } else {
    carrinho.push({ nome, preco, qtd: 1 });
  }
  salvarCarrinho();
}

function adicionarDireto(nome, preco) {
  adicionarAoCarrinho(nome, preco);
}

function adicionarCaipirinha() {
  const sabor = document.getElementById("caipi-sabor").value;
  const destilado = document.getElementById("caipi-destilado").value;
  const nomeCompleto = `Caipirinha c/ Picolé (${sabor} + ${destilado})`;
  adicionarAoCarrinho(nomeCompleto, PRECO_CAIPIRINHA);
}

function selecionarTamanho(botao) {
  document.querySelectorAll(".size-btn").forEach((btn) => btn.classList.remove("active"));
  botao.classList.add("active");

  const tamanho = botao.getAttribute("data-size");
  const preco = parseFloat(botao.getAttribute("data-price"));
  redLabelSelecionado = { tamanho, preco };

  document.getElementById("red-price-display").textContent = formatarMoeda(preco);
}

function adicionarRedLabel() {
  const nomeCompleto = `Red Label + Energético (${redLabelSelecionado.tamanho})`;
  adicionarAoCarrinho(nomeCompleto, redLabelSelecionado.preco);
}

function alterarQuantidade(index, delta) {
  carrinho[index].qtd += delta;
  if (carrinho[index].qtd <= 0) {
    carrinho.splice(index, 1);
  }
  salvarCarrinho();
}

function atualizarInterface() {
  const floatingBtn = document.getElementById("floating-cart-btn");
  const cartCount = document.getElementById("cart-count");
  const floatingTotal = document.getElementById("cart-floating-total");
  const modalTotal = document.getElementById("modal-total");
  const cartItemsContainer = document.getElementById("cart-items");

  const totalItens = carrinho.reduce((acc, item) => acc + item.qtd, 0);
  const valorTotal = carrinho.reduce((acc, item) => acc + item.preco * item.qtd, 0);

  if (totalItens === 0) {
    floatingBtn.classList.add("hidden");
    document.getElementById("cart-modal").classList.add("hidden");
    return;
  }

  floatingBtn.classList.remove("hidden");
  cartCount.textContent = totalItens;
  floatingTotal.textContent = formatarMoeda(valorTotal);
  modalTotal.textContent = formatarMoeda(valorTotal);

  cartItemsContainer.innerHTML = carrinho
    .map(
      (item, index) => `
      <div class="cart-item">
        <div class="cart-item-info">
          <h4>${item.nome}</h4>
          <span>${formatarMoeda(item.preco * item.qtd)}</span>
        </div>
        <div class="qty-controls">
          <button type="button" onclick="alterarQuantidade(${index}, -1)">-</button>
          <span>${item.qtd}</span>
          <button type="button" onclick="alterarQuantidade(${index}, 1)">+</button>
        </div>
      </div>
    `
    )
    .join("");
}

function toggleCartModal() {
  const modal = document.getElementById("cart-modal");
  modal.classList.toggle("hidden");
}

function enviarWhatsApp() {
  if (carrinho.length === 0) return;

  const nome = document.getElementById("cliente-nome").value.trim();
  const apartamento = document.getElementById("cliente-apartamento").value.trim();
  const torre = document.getElementById("cliente-torre").value.trim();
  const pagamento = document.getElementById("forma-pagamento").value;

  if (!nome) {
    alert("Por favor, informe seu nome.");
    return;
  }

  if (!apartamento || !torre) {
    alert("Por favor, informe o apartamento e a torre.");
    return;
  }

  let texto = `*🍹 NOVO PEDIDO - COPÃO DO VIZINHO*\n\n`;
  texto += `*Nome:* ${nome}\n`;
  texto += `*Apartamento:* ${apartamento}\n`;
  texto += `*Torre:* ${torre}\n`;
  texto += `*Forma de pagamento:* ${pagamento}\n\n`;
  texto += `*📋 ITENS DO PEDIDO:*\n`;

  let total = 0;
  carrinho.forEach((item) => {
    const subtotal = item.preco * item.qtd;
    total += subtotal;
    texto += `• ${item.qtd}x ${item.nome} — ${formatarMoeda(subtotal)}\n`;
  });

  texto += `\n*💰 TOTAL: ${formatarMoeda(total)}*`;

  const url = `https://wa.me/${WHATSAPP_LOJA}?text=${encodeURIComponent(texto)}`;
  window.open(url, "_blank");
}

document.getElementById("caipi-price-display").textContent = formatarMoeda(PRECO_CAIPIRINHA);
atualizarInterface();
