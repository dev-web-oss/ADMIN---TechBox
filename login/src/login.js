// Configuração Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCjfIJ0FuH-VWRdj0rHFapnEKkr6bIUlvY",
  authDomain: "tech-box-cb857.firebaseapp.com",
  projectId: "tech-box-cb857",
  storageBucket: "tech-box-cb857.firebasestorage.app",
  messagingSenderId: "792563612882",
  appId: "1:792563612882:web:8466799e268140dfcb010b"
};
  
  firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  
  // Emails autorizados (mesmos que você cadastrou manualmente)
  const emailsAutorizados = ["gustavo@gmail.com", "jana@gmail.com"];
  
  document.getElementById("loginBtn").addEventListener("click", () => {
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value;
    const erroMensagem = document.getElementById("erro-mensagem");
  
    if (!email || !senha) {
      erroMensagem.textContent = "Preencha todos os campos.";
      return;
    }
  
    auth.signInWithEmailAndPassword(email, senha)
      .then((result) => {
        const user = result.user;
  
        if (emailsAutorizados.includes(user.email)) {
          // Redireciona para o painel
          window.location.href = "./manage/manage.html";
        } else {
          auth.signOut();
          erroMensagem.textContent = "Este email não está autorizado.";
        }
      })
      .catch((error) => {
        console.error("Erro no login:", error);
        erroMensagem.textContent = "Email ou senha incorretos.";
      });
  });  