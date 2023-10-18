import SHA256 from "crypto-js/sha256";

export function hashString(input, shouldLowercase = true) {
  const dataToHash = shouldLowercase ? input.toLowerCase() : input;
  return SHA256(dataToHash).toString();
}
