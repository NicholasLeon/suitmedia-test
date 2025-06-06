export function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

export function getQuery(
  params: Record<string, string | number | (string | number)[] | undefined>
) {
  const query = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (Array.isArray(value)) {
      value.forEach((val) => query.append(key, String(val)));
    } else if (value !== undefined) {
      query.append(key, String(value));
    }
  }

  return query.toString();
}
