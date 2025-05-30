import React, { createContext, useState } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [usuarioLogado, setUsuarioLogado] = useState(false);
  const [totalDoado, setTotalDoado] = useState(0);

  return (
    <AppContext.Provider value={{ usuarioLogado, setUsuarioLogado, totalDoado, setTotalDoado }}>
      {children}
    </AppContext.Provider>
  );
};
