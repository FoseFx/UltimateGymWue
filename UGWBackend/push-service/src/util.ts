export function isJestTest(args: string[]): boolean {
  for (const arg of args) {
    const split = arg.split("/");
    const last = split[split.length - 1];
    if (last === "jest") {
      return true;
    }
  }
  return false;
}
