// Função que verifica se o e-mail possui erros de digitação e retorna uma sugestão de correção
export function checkEmailTypos(email) {
  const emailParts = email.split("@");
  if (emailParts.length !== 2) {
    return;
  }

  const domain = emailParts[1];
  const corrections = {
    "outlok.com": "outlook.com",
    "otlook.com": "outlook.com",
    "gamil.com": "gmail.com",
    "gmial.com": "gmail.com",
    "hotmal.com": "hotmail.com",
    "hotmai.com": "hotmail.com",
    "hotmial.com": "hotmail.com",
    "live.con": "live.com",
    "live.cmo": "live.com",
    "live.cm": "live.com",
  };

  if (corrections[domain]) {
    return `Você quis dizer ${emailParts[0]}@${corrections[domain]}?`;
  }

  return null;
}
