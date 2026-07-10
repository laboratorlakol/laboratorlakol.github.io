export function isValidFivemSecret(req: Request): boolean {
  const expected = process.env.FIVEM_API_SECRET;
  if (!expected) return false;
  return req.headers.get("x-fivem-secret") === expected;
}
