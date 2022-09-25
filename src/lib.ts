export const enterKey = (fn: () => void) => {
  return (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      fn();
    }
  };
};
