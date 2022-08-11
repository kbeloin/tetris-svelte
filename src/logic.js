export const levels = (level, lines) => {
  return lines >= (level + 1) * 10 ? level + 1 : level;
};
