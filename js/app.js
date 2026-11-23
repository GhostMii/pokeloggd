const gridCards = document.querySelector("#grid-cards");
const mensagem = document.querySelector("#mensagem");
const formPesquisa = document.querySelector("#form-pesquisa");

const pesquisaNome = document.querySelector("#pesquisa-nome");
const pesquisaNumero = document.querySelector("#pesquisa-numero");

function mostrarMensagem(texto, tipo) {
  mensagem.textContent = texto;
  mensagem.className = tipo;
}

function normalizarTexto(texto) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function pesquisarPokemon() {
  const nome = normalizarTexto(pesquisaNome.value.trim());
  const numero = pesquisaNumero.value.trim();

  const cards = gridCards.querySelectorAll(".card");

  if (nome === "" && numero === "") {
    mostrarMensagem("Informe um nome ou número para pesquisar.", "erro");
    return;
  }

  if (numero !== "") {
    const numeroConvertido = Number(numero);

    if (
      !Number.isInteger(numeroConvertido) ||
      numeroConvertido < 1 ||
      numeroConvertido > 9999
    ) {
      mostrarMensagem("Informe um número entre 1 e 9999.", "erro");
      return;
    }
  }

  let quantidadeEncontrada = 0;

  cards.forEach(function (card) {
    const nomePokemon = normalizarTexto(
      card.querySelector("h3").textContent
    );

    const numeroPokemon = card.dataset.numero;

    const correspondeNome =
      nome === "" || nomePokemon.includes(nome);

    const correspondeNumero =
      numero === "" || numeroPokemon === String(Number(numero));

    if (correspondeNome && correspondeNumero) {
      card.hidden = false;
      quantidadeEncontrada++;
    } else {
      card.hidden = true;
    }
  });

  if (quantidadeEncontrada > 0) {
    mostrarMensagem(
      `${quantidadeEncontrada} Pokémon encontrado(s).`,
      "sucesso"
    );
  } else {
    mostrarMensagem("Nenhum Pokémon encontrado.", "erro");
  }
}

function marcarCapturado(card) {
  const status = card.querySelector(".status-captura");
  const botao = card.querySelector(".botao-capturar");
  const nomePokemon = card.querySelector("h3").textContent;

  const capturado = card.dataset.capturado === "true";

  if (capturado) {
    card.dataset.capturado = "false";
    card.classList.remove("capturado");

    status.textContent = "Não capturado";
    botao.textContent = "Marcar como capturado";

    mostrarMensagem(
      `${nomePokemon} foi marcado como não capturado.`,
      "sucesso"
    );
  } else {
    card.dataset.capturado = "true";
    card.classList.add("capturado");

    status.textContent = "Capturado!";
    botao.textContent = "Marcar como não capturado";

    mostrarMensagem(`${nomePokemon} foi capturado!`, "sucesso");
  }
}

formPesquisa.addEventListener("submit", function (evento) {
  evento.preventDefault();
  pesquisarPokemon();
});

formPesquisa.addEventListener("reset", function () {
  const cards = gridCards.querySelectorAll(".card");

  cards.forEach(function (card) {
    card.hidden = false;
  });

  mensagem.textContent = "";
  mensagem.className = "";
});

gridCards.addEventListener("click", function (evento) {
  if (evento.target.classList.contains("botao-capturar")) {
    const card = evento.target.closest(".card");

    marcarCapturado(card);
  }
});