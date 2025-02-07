// context/ClientContext.tsx
import React, { createContext, useState, useContext } from 'react'

interface ClientContextType {
  refreshClients: () => void
}

const ClientContext = createContext<ClientContextType | undefined>(undefined)

interface ClientProviderProps {
  children: React.ReactNode
}

export const ClientProvider: React.FC<ClientProviderProps> = ({ children }) => {
  const [refreshKey, setRefreshKey] = useState(0)

  const refreshClients = () => {
    setRefreshKey((prevKey) => prevKey + 1)
  }

  return (
    <ClientContext.Provider value={{ refreshClients }}>
      {children}
    </ClientContext.Provider>
  )
}

export const useClientContext = () => {
  const context = useContext(ClientContext)
  if (!context) {
    throw new Error('useClientContext must be used within a ClientProvider')
  }
  return context
}
