import { createContext, useContext } from 'react';

const FieldStyleContext = createContext({});

export function FieldStyleProvider({ fieldStyles, children }) {
  return (
    <FieldStyleContext.Provider value={fieldStyles || {}}>{children}</FieldStyleContext.Provider>
  );
}

export function useFieldStyles() {
  return useContext(FieldStyleContext);
}
