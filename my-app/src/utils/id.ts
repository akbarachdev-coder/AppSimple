/** Dependency-free unique id: timestamp + random suffix. */
export function createId(prefix = ''): string {
  const random = Math.random().toString(36).slice(2, 8);
  return `${prefix}${Date.now().toString(36)}${random}`;
}
