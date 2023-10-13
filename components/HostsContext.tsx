import type { Host } from '@/interfaces/Host'
import type { HostStorage } from '@/interfaces/HostStorage'
import type { Action } from '@/types/Action'
import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState
} from 'react'
import { ulid } from 'ulid'

interface Props {
  children: React.ReactNode
}

const initialState: HostStorage = {
  hosts: [
    {
      id: '00000-info',
      active: false,
      rules: '',
      name: 'INFO',
      editable: false
    },
    {
      id: ulid(),
      active: true,
      rules: '127.0.0.1 hoge.com',
      name: 'New Host',
      editable: true
    }
  ]
}

export const HostsContext = createContext<
  { state: HostStorage; dispatch: React.Dispatch<Action> } | undefined
>(undefined)

const hostsReducer: React.Reducer<HostStorage, Action> = (state, action) => {
  let newState
  const newHost = {
    id: ulid(),
    active: false,
    rules: '',
    name: 'New Host',
    editable: true
  }
  let filteredHosts:
  
  

  
  Host[]
  let latestHost: Host
  let updatedHosts: Host[]
  switch (action.type) {
    case 'ADD_HOST':
      chrome.storage.local.get(['hosts'], (result: HostStorage) => {
        const currentHosts = result.hosts || []
        const updatedHosts = [...currentHosts, newHost]
        chrome.storage.local.set({ hosts: updatedHosts })
      })
      return {
        ...state,
        hosts: [...state.hosts, newHost]
      }
    case 'REMOVE_HOST':
      chrome.storage.local.get(['hosts'], (result: HostStorage) => {
        const currentHosts = result.hosts || []
        const updatedHosts = currentHosts.filter(
          (host: Host) => host.id !== action.hostId
        )
        chrome.storage.local.set({ hosts: updatedHosts })
      })
      filteredHosts = state.hosts.filter(
        (host: Host) => host.id !== action.hostId
      )
      if (filteredHosts.length === 0) return { hosts: initialState.hosts }

      latestHost = filteredHosts[0]

      updatedHosts = filteredHosts.map((host) =>
        host.id === latestHost.id && host.id != '00000-info'
          ? { ...host, active: true }
          : { ...host, active: false }
      )

      return { ...state, hosts: updatedHosts }
    case 'TOGGLE_HOST':
      newState = {
        ...state,
        hosts: state.hosts.map((host) =>
          host.id === action.hostId && host.id != '00000-info'
            ? { ...host, active: !host.active }
            : host
        )
      }
      chrome.storage.local.set({ hosts: newState.hosts })
      return newState

    case 'UPDATE_RULES':
      newState = {
        ...state,
        hosts: state.hosts.map((host) =>
          host.id === action.hostId ? { ...host, rules: action.rules } : host
        )
      }
      chrome.storage.local.set({ hosts: newState })
      return newState
    case 'RENAME_HOST':
      newState = {
        ...state,
        hosts: state.hosts.map((host) => {
          if (host.id === action.hostId) {
            const updatedHost = { ...host, ...action.payload }
            return updatedHost
          }
          return host
        })
      }
      chrome.storage.local.set({ hosts: newState.hosts })
      return newState
    case 'INITIALIZE_HOST':
      return {
        ...state,
        hosts: action.hosts
      }
    default:
      return state
  }
}

export const HostsProvider: React.FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(hostsReducer, initialState)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHosts = async () => {
      const result = await new Promise<{ hosts: Host[] }>((resolve) => {
        chrome.storage.local.get(['hosts'], (data: HostStorage) => {
          resolve(data as { hosts: Host[] })
        })
      })

      if (result.hosts?.length > 0) {
        dispatch({ type: 'INITIALIZE_HOST', hosts: result.hosts })
      }
      setLoading(false)
    }

    fetchHosts()
  }, [])
  if (loading) {
    return <div>Loading...</div>
  }
  return (
    <HostsContext.Provider value={{ state, dispatch }}>
      {children}
    </HostsContext.Provider>
  )
}

export const useHosts = () => {
  const context = useContext(HostsContext)
  if (!context) return { state: initialState, dispatch: () => {} }
  return context
}
