import { InternalServerErrorException } from '@nestjs/common';

/**
 * Makes sure the initial array is extended to at least the length items from the filler.
 *
 * We throw an error if the preconditions fail (the two array is smaller then the expected length).
 *
 * You can skip this by setting the skipCheck flag. If the skipCheck flag is set the result is not guaranteed.
 */
export const extendArray = <T = unknown>(
  initial: T[],
  filler: T[],
  length: number,
  skipCheck: boolean = false,
) => {
  if (initial.length >= length) return initial;

  if (!skipCheck && initial.length + filler.length < length) {
    throw new InternalServerErrorException(
      "Initial and filler don't have enough items.",
    );
  }

  return [...initial, ...filler.slice(0, length - initial.length)];
};
