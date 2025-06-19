import { carregarAvaliacoes } from "./avaliacoes";

document.addEventListener("DOMContentLoaded", () => {
  const conteudo = {
    innerHTML: "",
    querySelector: (id) => document.querySelector(id),
  };
  // Este "conteudo" simula o que você usava antes, mas agora com base no `body`
  carregarAvaliacoes(document.body);
});