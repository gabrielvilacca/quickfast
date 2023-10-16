export const validateFullName = (fullName) => {
  const nameSplit = fullName.trim().split(" ");

  if (nameSplit.length < 2 || !nameSplit[0] || !nameSplit[1]) {
    console.log("invalid full name: " + fullName);
    return {
      isValidName: false,
      message: "Insira seu nome completo, incluindo nome e sobrenome.",
    };
  }

  return { isValidFullName: true, message: "" };
};

export const validateEmail = (email) => {
  // Validando o email com uma expressão regular mais robusta
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // Verificando se o email começa ou termina com um caractere inválido
  const invalidStartEnd =
    email.startsWith(".") || email.startsWith("@") || email.endsWith(".");

  if (!emailRegex.test(email) || invalidStartEnd) {
    return { isValidEmail: false, message: "Insira um e-mail válido." };
  }

  return { isValidEmail: true, message: "" };
};

export const validatePassword = (password) => {
  // Validando a senha (mínimo de 8 caracteres, pelo menos 1 letra maiúscula, 1 letra minúscula, 1 número e 1 caractere especial)
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;

  if (!passwordRegex.test(password)) {
    return {
      isValidPassword: false,
      message:
        "A senha precisa ter pelo menos 8 caracteres, incluindo 1 letra maiúscula, 1 letra minúscula, 1 número e 1 caractere especial.",
    };
  }

  return { isValidPassword: true, message: "" };
};
