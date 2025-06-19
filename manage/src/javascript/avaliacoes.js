import { db } from "./firebaseConfig.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { Chart } from "https://esm.sh/chart.js";

export async function carregarAvaliacoes(conteudoEl) {
  const snap = await getDocs(collection(db, "Avaliacoes"));
  let total = 0, count = 0, html = "";

  snap.forEach(doc => {
    const a = doc.data();
    total += a.estrelas;
    count++;
    html += `
      <div style="border:1px solid #ddd; padding:10px; margin:10px 0;">
        <img src="${a.foto}" width="50" height="50" style="border-radius:50%;" />
        <strong>${a.nome}</strong> – ${a.estrelas}⭐
        <p>${a.comentario}</p>
      </div>`;
  });

  const media = (total / count).toFixed(2);
  conteudoEl.innerHTML = `
    <h2>Média de Avaliações: ${media}</h2>
    <canvas id="graficoPizza" width="400" height="400"></canvas>
    <h3>Comentários</h3>
    <div>${html}</div>
  `;

  const ctx = document.getElementById("graficoPizza").getContext("2d");
  new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["Média", "Até 5"],
      datasets: [{ data: [media, 5 - media], backgroundColor: ["#4caf50", "#e0e0e0"] }]
    }
  });
}