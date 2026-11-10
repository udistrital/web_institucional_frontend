export function getMapUrl(address: string | null | undefined) {
  if (!address) return null;

  const query = `${address}, Bogotá, Colombia`;
  return `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
}
