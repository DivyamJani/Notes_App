export const checkGrammar = (html) => {
  const text = html.replace(/<[^>]*>?/gm, "");
  const issues = [];
  if (!/[.?!]$/.test(text.trim())) issues.push("End punctuation is missing.");
  if (/\bi\b/.test(text)) issues.push("'i' should be capitalized to 'I'.");
  return issues;
};
