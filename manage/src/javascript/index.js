import { auth } from "./firebaseConfig.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import {
  carregarProdutosPorCategoria,
  adicionarEventosEditar,
  abrirPainelAdd,
  fecharPainel,
  adicionarProduto,
  adicionarEventosExcluir
} from "./produtos.js";

const emailsAutorizados = ["gustavo@gamil.com", "jana@gmail.com"];

document.addEventListener("DOMContentLoaded", () => {
  onAuthStateChanged(auth, (user) => {
    if (!user || emailsAutorizados.includes(user.email)) {
      window.location.href = "../index.html";
    } else {
      console.log(`Acesso autorizado ${user.email}`);
    }
  });

  const selectCategoria = document.getElementById("selectCategoria");
  const container = document.getElementById("produtos");

  selectCategoria.addEventListener("change", async () => {
    const categoria = selectCategoria.value;

    if (!categoria) {
      container.innerHTML = "<p>Selecione uma categoria para exibir os produtos.</p>";
      return;
    }

    await carregarProdutosPorCategoria(container, categoria);
    adicionarEventosEditar();
    adicionarEventosExcluir();
  });

  // Abertura e fechamento dos painéis
  document.getElementById('abrir-add').addEventListener('click', abrirPainelAdd);
  document.getElementById('fechar-add').addEventListener('click', () => fecharPainel('painel-add'));
  document.getElementById('form-add-produto').addEventListener('submit', e => {
    e.preventDefault();
    adicionarProduto(e.target);
  });
  document.getElementById('fechar-edicao').addEventListener('click', () => fecharPainel('painel-edicao'));
});
