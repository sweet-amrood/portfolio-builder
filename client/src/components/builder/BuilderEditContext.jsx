import { createContext, useContext } from 'react';

const BuilderEditContext = createContext(null);

export function BuilderEditProvider({ children, value }) {
  return <BuilderEditContext.Provider value={value}>{children}</BuilderEditContext.Provider>;
}

export function useBuilderEdit() {
  return useContext(BuilderEditContext);
}
