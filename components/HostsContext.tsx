import type { Host } from '@/interfaces/Host'
import type { HostStorage } from '@/interfaces/HostStorage'
import type { Action } from '@/types/Action'
import React, {
  createContext,
  useContext,
  useEffect,
  useReducer
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
      rules: '',
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
  let filteredHosts: Host[]
  let hosts;
  switch (action.type) {
    case 'ADD_HOST':
      chrome.storage.local.get(['hosts'], (result: HostStorage) => {
        const currentHosts = Array.isArray(result.hosts) ? result.hosts : [];
        const updatedHosts = [...currentHosts, newHost]
        chrome.storage.local.set({ hosts: updatedHosts })
      })
      hosts = Array.isArray(state.hosts) ? state.hosts : [];
      return {
        ...state,
        hosts: [...hosts, newHost]
      }
      case 'REMOVE_HOST':
        filteredHosts = (Array.isArray(state?.hosts) ? state.hosts : []).filter(
          (host: Host) => !action.hostIdList?.includes(host.id)
        ) ?? [];
        chrome.storage.local.set({ hosts: filteredHosts });
        if (filteredHosts.length === 0) return { hosts: initialState.hosts };
        return { ...state, hosts: filteredHosts };
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
      chrome.storage.local.set({ hosts: newState.hosts })
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
  const [state, dispatch] = useReducer(hostsReducer, initialState);

  useEffect(() => {
    const fetchHosts = async () => {
      const result = await new Promise<{ hosts: Host[] }>((resolve) => {
        chrome.storage.local.get(['hosts'], (data: HostStorage) => {
          resolve(data as { hosts: Host[] });
        });
      });

      if (result.hosts) {
        dispatch({ type: 'INITIALIZE_HOST', hosts: result.hosts });
      }
    };

    fetchHosts();
  }, []);

  return (
    <HostsContext.Provider value={{ state, dispatch }}>
      {children}
    </HostsContext.Provider>
  );
}


export const useHosts = () => {
  const context = useContext(HostsContext)
  if (!context) return { state: initialState, dispatch: () => {} }
  return context
}
