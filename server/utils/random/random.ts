import type { Events } from './types';

export const getRandomEvent = (events: Events): string | undefined => {
  const fullProbability = Object.values(events).reduce(
    (acc, probability) => acc + probability,
    0
  );

  if (fullProbability > 1) {
    throw new Error('Invalid probability');
  }

  const randomValue = Math.random();

  let prevValueSum = 0;
  return Object.keys(events).find((event: string) => {
    const probability = events[event];

    if (
      randomValue > prevValueSum &&
      randomValue - prevValueSum <= probability
    ) {
      return true;
    }

    prevValueSum += probability;
  });
};
