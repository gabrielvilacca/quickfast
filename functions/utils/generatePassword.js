function generatePassword() {
  const chars = "abcdefgbhijklmnopqrstuvwxyzABCDEFGHYJKLMNIPQRSWXYZ1234567890";
  let x = 0;
  let password = "";
  while (x < 8) {
    const random = Math.floor(Math.random() * (chars.length - 1));
    password += chars[random];
    x++;
  }

  return password;
}

module.exports = generatePassword;
