export function isValidFivemSecret(req: Request): boolean {
  const expected = process.env.FIVEM_API_SECRET;
  if (!expected) return false; // fail closed if not configured
  const provided = req.headers.get("x-fivem-secret");
  return provided === expected;
}
