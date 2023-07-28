import React, { createContext, useState } from 'react';

export const ApiContext = createContext();

const ApiContextProvider = ({ children }) => {
  // Set a default value if the env variable is not defined
  const [apiUrlBase, setApiUrlBase] = useState(process.env.API_URL_BASE || 'http://localhost:8787/api');

  return (
    <ApiContext.Provider value={{ apiUrlBase, setApiUrlBase }}>
      {children}
    </ApiContext.Provider>
  );
};

export default ApiContextProvider;