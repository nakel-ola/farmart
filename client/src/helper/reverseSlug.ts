const reverseSlug = (text: string = ""): string => {
  const array = text.split("-").map((t) => t.toLowerCase());
  const newText = array.join(" ");
  return newText;
};

export default reverseSlug;