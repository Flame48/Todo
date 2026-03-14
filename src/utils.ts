export type PT_className = {
  className?: string;
};

export function jcn(
  ...classNames: (string | undefined | null)[]
): string | undefined {
  return classNames?.filter((x) => x)?.join(" ");
}
