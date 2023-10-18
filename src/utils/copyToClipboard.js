async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    console.log("Texto copiado para a área de transferência");
  } catch (err) {
    console.error("Falha ao copiar texto: ", err);
  }
}

export default copyToClipboard;
