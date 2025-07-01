export const log = {
  error: (label: string, error?: unknown) => {
    if (!error) {
      console.error(label);
    } else {
      console.error(label, error);
    }
  },
};
