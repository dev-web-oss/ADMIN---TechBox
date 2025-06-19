// Emails permitidos
const emailsAutorizados = ["gustavogomes2001907@gmail.com", "admin2@seudominio.com"];

firebase.auth().onAuthStateChanged((user) => {
  if (!user || !emailsAutorizados.includes(user.email)) {
    // Redireciona se não for autorizado
    window.location.href = "/ADMIN---Jana/login/login.html";
  }
});

// Função de Logout
function logout() {
  firebase.auth().signOut().then(() => {
      window.location.href = "/ADMIN---Jana/manage/manage.html"; // Redireciona para a página de login
  }).catch((error) => {
      console.error("Erro ao fazer logout: ", error);
  });
}


// Adicionar um botão de logout no painel
const logoutButton = document.createElement('button');
logoutButton.innerText = 'Sair';
logoutButton.onclick = logout;
document.body.appendChild(logoutButton);


// Verificar se o usuário está autenticado
firebase.auth().onAuthStateChanged((user) => {
  if (!user) {
      // Se o usuário não estiver autenticado, redireciona para a tela de login
      window.location.href = "/ADMIN---Jana/index.html";
  }
});

document.getElementById("logout").addEventListener("click", () => {
  firebase.auth().signOut().then(() => {
      window.location.href = "login/index.html";
  });
});
