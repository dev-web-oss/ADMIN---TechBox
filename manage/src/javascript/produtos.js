import { db } from "./firebaseConfig.js";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { uploadImagemParaAppwrite, processarImagensFormulario } from "./appwriteConfig.js";

function configurarComportamentoInputsImagem(formPrefixo) {
  [1, 2, 3, 4, 5].forEach(n => {
    const campoUrl = document.getElementById(`${formPrefixo}Imagem${n}_url`);
    const campoFile = document.getElementById(`${formPrefixo}Imagem${n}_file`);

    if (!campoUrl || !campoFile) return;

    if (campoUrl.value.trim() !== "") {
      campoFile.style.display = "none";
    } else if (campoFile.files.length > 0) {
      campoUrl.style.display = "none";
    } else {
      campoFile.style.display = campoUrl.style.display = "block";
    }

    // Quando digitar uma URL, esconde o upload
    campoUrl.addEventListener("input", () => {
      if (campoUrl.value.trim() !== "") {
        campoFile.style.display = "none";
      } else {
        campoFile.style.display = "block";
      }
    });

    // Quando selecionar um arquivo, esconde a URL
    campoFile.addEventListener("change", () => {
      if (campoFile.files.length > 0) {
        campoUrl.style.display = "none";
      } else {
        campoUrl.style.display = "block";
      }
    });
  });
}

//Função para adicionar preview dinâmico de imagens
function bindImagePreviews(form) {
  [1, 2, 3, 4, 5].forEach(n => {
    const input = form.querySelector(`#edImagem${n}_url`);
    const preview = document.getElementById(`preview${n}`);
    if (!input || !preview) return;
    // Atualiza preview inicial
    preview.src = input.value || "";
    // Ao alterar input, atualiza preview
    input.addEventListener("input", () => {
      preview.src = input.value;
    });
  });
}

function bindAddImagePreviews() {
  const form = document.getElementById('form-add-produto');
  [1, 2, 3, 4, 5].forEach(n => {
    const input   = form.querySelector(`#addImagem${n}_url`);
    const preview = form.querySelector(`#addPreview${n}`);
    if (!input || !preview) return;
    // preview inicial
    preview.src = input.value || '';
    // atualiza ao digitar
    input.addEventListener('input', () => {
      preview.src = input.value;
    });
  });
}

//Abre o painel de excluir
export function abrirPainelDelete() {
  document.getElementById('busca-excluir').value = '';
  document.getElementById('suggestions').innerHTML = '';
  document.getElementById('detalhe-delete').classList.add('hidden');
  document.getElementById('painel-delete').classList.remove('hidden');
}


//Adiciona produto ao Firestore
export async function adicionarProduto(form) {
  const categoria = form.elements.categoria.value;

  const imagens = await processarImagensFormulario(form, "add");

  const data = {
    vendendo: form.addVendendo.checked,
    destaque: form.addDestaque.checked,
    nome: form.addNome.value.trim(),
    descricao: form.addDescricao.value.trim(),
    preco: parseFloat(form.addPreco.value),
    precoPromocional: parseFloat(form.addPrecoPromo.value) || 0,
    ...imagens
  };

  await addDoc(collection(db, `Categorias/${categoria}/Produtos`), data);
  alert('Produto adicionado!');
  fecharPainel('painel-add');
}

//Abre o painel de adicionar
export function abrirPainelAdd() {
  const painel = document.getElementById('painel-add');
  const form   = document.getElementById('form-add-produto');
  form.reset();
  painel.classList.remove('hidden');
  painel.classList.add('visivel');
  bindAddImagePreviews();
  configurarComportamentoInputsImagem("add");
}

export async function carregarProdutosPorCategoria(container, categoriaSelecionada) {
  container.innerHTML = "";
  const categorias = ["Acessorio","Antena","CaboHDMI","CaboDeCelular","CaixaDeSom","Campainha","CapasDeCelular","Carregadores","CartoesDeMemoria","Chaveiros","CoposGarrafas","Ferramentas","FoneDeOuvido","Gimbal", "Lanterna", "Marmita","Massageador","MiniCompressor","Mouse","Pilha","Projetores","Radios","RelogioSmartWatch","Tvbox","Suporte","VideoGame"];

  const categoriasParaBuscar =
    categoriaSelecionada === "Todos" ? categorias : [categoriaSelecionada];

  for (const categoria of categoriasParaBuscar) {
    const ref = collection(db, `Categorias/${categoria}/Produtos`);
    const snap = await getDocs(ref);

    snap.forEach(doc => {
      const p = doc.data();
      const card = document.createElement("div");
      card.classList.add("produto-card");

      const nomeAbreviado = p.nome.length > 45 ? p.nome.slice(0, 40) + "..." : p.nome;
      
      card.innerHTML = `
        <img src="${p.imagem1}" alt="${p.nome}" />
        <div class="infoProduto">
          <h3>${nomeAbreviado}</h3>
          <p>${p.preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p>
          <button 
            class="editarProduto btn" 
            data-categoria="${categoria}" 
            data-id="${doc.id}">
            Editar
          </button>
          <button 
            class="excluirProduto btn" 
            data-categoria="${categoria}" 
            data-id="${doc.id}">
            Excluir
          </button>
        </div>
      `;

      container.appendChild(card);
    });
  }
}


//Esta função adiciona o evento aos botões criados dinamicamente
export function adicionarEventosEditar() {
  document.querySelectorAll('.editarProduto').forEach(btn => {
    btn.addEventListener('click', () => {
      const categoria = btn.dataset.categoria;
      const id = btn.dataset.id;
      editarProduto(categoria, id);
    });
  });
}

export async function editarProduto(categoria, id) {
  const painel = document.getElementById('painel-edicao');
  const form = document.getElementById('form-edicao-produto');

  const ref = doc(db, `Categorias/${categoria}/Produtos/${id}`);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    alert('Produto não encontrado.');
    return;
  }
  const dados = snap.data();

  form.vendendo.checked = dados.vendendo || false;
  form.destaque.checked = dados.destaque || false;
  form.nome.value = dados.nome || '';
  form.descricao.value = dados.descricao || '';
  form.preco.value = dados.preco || 0;
  form.precoPromocional.value = dados.precoPromocional || 0;
  form.edImagem1_url.value = dados.imagem1 || '';
  form.edImagem2_url.value = dados.imagem2 || '';
  form.edImagem3_url.value = dados.imagem3 || '';
  form.edImagem4_url.value = dados.imagem4 || '';
  form.edImagem5_url.value = dados.imagem5 || '';

  painel.classList.remove('hidden');
  painel.classList.add('visivel');

  bindImagePreviews(form);
  configurarComportamentoInputsImagem("ed");

  form.onsubmit = async (e) => {
    e.preventDefault();
    await updateDoc(ref, {
      vendendo: form.vendendo.checked,
      destaque: form.destaque.checked,
      nome: form.nome.value.trim(),
      descricao: form.descricao.value.trim(),
      preco: parseFloat(form.preco.value),
      precoPromocional: parseFloat(form.precoPromocional.value),
      imagem1: form.edImagem1_url.value.trim(),
      imagem2: form.edImagem2_url.value.trim(),
      imagem3: form.edImagem3_url.value.trim(),
      imagem4: form.edImagem4_url.value.trim(),
      imagem5: form.edImagem5_url.value.trim()
    });
    alert('Produto atualizado!');
    fecharPainel('painel-edicao');
  };
}

function confirmarAção(mensagem) {
  return new Promise(resolve => {
    // Criar container do modal
    const modal = document.createElement('div');
    modal.classList.add('confirm-modal');
    modal.innerHTML = `
      <div class="confirm-box">
        <p>${mensagem.replace(/\n/g, '<br>')}</p>
        <div class="btn-group">
          <button class="btn-cancel">Cancelar</button>
          <button class="btn-confirm">Confirmar</button>
        </div>
      </div>
    `;
    document.body.append(modal);

    // Handlers
    modal.querySelector('.btn-cancel').onclick = () => {
      modal.remove();
      resolve(false);
    };
    modal.querySelector('.btn-confirm').onclick = () => {
      modal.remove();
      resolve(true);
    };
  });
}

//Exclui um produto do Firestore
export async function excluirProduto(categoria, id) {
  const ref = doc(db, `Categorias/${categoria}/Produtos/${id}`);
  await deleteDoc(ref);
}

export function adicionarEventosExcluir() {
  document.querySelectorAll('.excluirProduto').forEach(btn => {
    btn.addEventListener('click', async () => {
      const categoria = btn.dataset.categoria;
      const id = btn.dataset.id;
      // pega o nome do produto (do h3 dentro do mesmo card)
      const nome = btn.closest('.infoProduto').querySelector('h3').textContent;
      const msg = `Você tem certeza que deseja excluir o produto <span>"${nome}"</span>?\n\nESTA AÇÃO É PERMANENTE!`;
      const ok = await confirmarAção(msg);
      if (ok) {
        await excluirProduto(categoria, id);
        // opcional: recarregar a lista atual
        const container = document.getElementById('produtos');
        await carregarProdutosPorCategoria(container, categoria);
        adicionarEventosEditar();
        adicionarEventosExcluir();
      }
    });
  });
}

//Fecha painel genérico
export function fecharPainel(idPainel) {
  const painel = document.getElementById(idPainel);
  painel.classList.add('hidden');
  painel.classList.remove('visivel');
}
