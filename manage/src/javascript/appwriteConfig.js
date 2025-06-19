const { Client, Storage, ID } = window.Appwrite;

const client = new Client();

client
  .setEndpoint('https://fra.cloud.appwrite.io/v1')
  .setProject('681421890038cfa6491a');

const storage = new Storage(client);

export { client, storage, ID };

export async function uploadImagemParaAppwrite(file) {
  const response = await storage.createFile('jana-presentes-e-perfumaria', ID.unique(), file);
  return storage.getFileView('jana-presentes-e-perfumaria', response.$id).href;
}

export async function processarImagensFormulario(form, prefixo) {
  const imagens = {};

  for (let i = 1; i <= 5; i++) {
    const campoUrl  = form.querySelector(`#${prefixo}Imagem${i}_url`);
    const campoFile = form.querySelector(`#${prefixo}Imagem${i}_file`);

    if (campoUrl && campoUrl.value.trim() !== "") {
      imagens[`imagem${i}`] = campoUrl.value.trim();
    } 
    else if (campoFile && campoFile.files.length > 0) {
      const file = campoFile.files[0];
      const urlUpload = await uploadImagemParaAppwrite(file);
      imagens[`imagem${i}`] = urlUpload;
    } 
    else {
      imagens[`imagem${i}`] = "";
    }
  }

  return imagens;
}