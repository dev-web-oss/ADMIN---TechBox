document.addEventListener("DOMContentLoaded", () => {
      initApp();
});

function initApp() {
  const menu = document.getElementById("menu");
  const conteudo = document.getElementById("conteudo");
  const btnP = document.getElementById("btnProdutos");
  const btnA = document.getElementById("btnAvaliacoes");
  const btnE = document.getElementById("btnEstatisticas");

  btnP.addEventListener("click", () => {
    window.location.href = "produtoAdmin.html";
  });
  
  btnA.addEventListener("click", () => {
    window.location.href = "avaliacoes.html";
  });
  
  btnE.addEventListener("click", () => {
    window.location.href = "estatistica.html";
  });
}
