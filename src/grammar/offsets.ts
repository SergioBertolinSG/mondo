/** Convierte offsets UTF-8 de LingoTweaker a índices UTF-16 de JavaScript. */
export function utf8ByteOffsetToUtf16(text: string, byteOffset: number): number {
  if (byteOffset <= 0) return 0
  let bytes = 0
  let units = 0
  for (const character of text) {
    const size = new TextEncoder().encode(character).length
    if (bytes + size > byteOffset) break
    bytes += size
    units += character.length
  }
  return units
}
