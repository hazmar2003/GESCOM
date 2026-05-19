/** Simula latencia de red para que el UI se comporte como con una API real */
export const delay = (ms = 200): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));
