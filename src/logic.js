export const levels = (level, lines) => {
  console.log(lines, level);
  switch (level < 9) {
    case level < 9:
      const linesNeeded = (level + 1) * 10;
      console.log(linesNeeded, lines, "Lines needed");

      return lines % linesNeeded === 0 ? level + 1 : level;
    case level < 16 && level > 9:
      return lines % 100 === 0 ? level + 1 : level;
    case level < 26 && level > 15:
      return (lines % ((level - 15) * 10)) + 100 ? level + 1 : level;
    default:
      return lines % 200 === 0 ? level + 1 : level;
  }
};
