const getInitials = (str) => {
  if (!str) return "";
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
};

export default getInitials;
