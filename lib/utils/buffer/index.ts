type SliceParameters = Parameters<Uint8Array["slice"]>;

/**
 * Slices a buffer as you would an array, using the byte indices.
 * @param buffer The buffer to slice.
 * @returns A buffer containing the resulting bytes.
 */
export const sliceBuffer = (
  buffer: BufferSource,
  ...parameters: SliceParameters
) => Uint8Array.prototype.slice.call(buffer, ...parameters) as Buffer;
