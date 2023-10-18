// Função que gera um ID único

export function getUniqueId() {
  const timestamp = Date.now().toString(36);
  const randomPart1 = Math.random().toString(36).substring(2);
  const randomPart2 = Math.random().toString(36).substring(2);
  const randomPart3 = Math.random().toString(36).substring(2);
  return `${timestamp}-${randomPart1}-${randomPart2}-${randomPart3}`;
}
