// Formata números de telefone de acordo com o país

export const formatBRPhoneNumber = (number) => {
  const cleaned = ("" + number).replace(/\D/g, "");
  let match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);

  // Para números com 8 dígitos
  if (!match) {
    match = cleaned.match(/^(\d{2})(\d{4})(\d{4})$/);
  }

  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }

  return number;
};

export const formatUSPhoneNumber = (number) => {
  const cleaned = ("" + number).replace(/\D/g, "");
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return number;
};

export const formatPTPhoneNumber = (number) => {
  const cleaned = ("" + number).replace(/\D/g, "");
  let match = cleaned.match(/^(\d{2})(\d{3})(\d{4})$/);

  // Para números com o código do país +351
  if (!match) {
    match = cleaned.match(/^351(\d{2})(\d{3})(\d{4})$/);
  }

  if (match) {
    return `${match[1]} ${match[2]} ${match[3]}`;
  }

  return number;
};

export const getCountryCode = (country) => {
  switch (country) {
    case "BR":
      return "55";
    case "US":
      return "1";
    case "PT":
      return "351";
    default:
      return "55";
  }
};
