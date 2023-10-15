import { useHosts } from '@/components/HostsContext'
import type { HostListProps } from '@/interfaces/HostListProps'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import { Button, Input, Tooltip } from '@mui/material'
import React, { useState } from 'react'

const HostList: React.FC<HostListProps> = ({ setSelectedHostId }) => {
  const { state, dispatch } = useHosts()
  const [editingHostId, setEditingHostId] = useState<string | null>(null)
  const [newName, setNewName] = useState<string>('')
  const selectedHostIdList = (Array.isArray(state?.hosts) ? state.hosts : []).filter((host) => host.active).map((host) => host.id)

  const handleHostClick = (hostId: string) => {
    setSelectedHostId(hostId)
  }

  const handleDoubleClick = (hostId: string, name: string) => {
    if (hostId === '00000-info') return
    setEditingHostId(hostId)
    setNewName(name)
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewName(e.target.value)
  }

  const handleNameSubmit = () => {
    if (editingHostId !== null) {
      dispatch({
        type: 'RENAME_HOST',
        hostId: editingHostId,
        payload: { name: newName }
      })
      setEditingHostId(null)
    }
  }

  const handleNameSubmitByEnterKey = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === 'Enter') {
      handleNameSubmit()
      e.preventDefault()
    }
  }

  return (
    <div
      style={{
        width: '200px',
        borderRight: '1px none',
        padding: '10px',
        backgroundColor: '#f4f4f4'
      }}>
      {(Array.isArray(state.hosts) ? state.hosts : [])
        .sort((a, b) => a.id.localeCompare(b.id))
        .map((host) => (
          <div
            key={host.id}
            style={{ marginBottom: '5px' }}
            onClick={() => {
              handleHostClick(host.id)
            }}>
            {editingHostId === host.id ? (
              <Input
                color="primary"
                onBlur={handleNameSubmit}
                value={newName}
                onChange={handleNameChange}
                onKeyDown={handleNameSubmitByEnterKey}
              />
            ) : (
              <Button
                onDoubleClick={() => {
                  handleDoubleClick(host.id, host.name)
                }}
                onClick={() => {
                  dispatch({ type: 'TOGGLE_HOST', hostId: host.id })
                }}
                style={{
                  backgroundColor: host.active ? '#ced4da' : '#e9ecef',
                  color: host.active ? '#0d6efd' : '#495057',
                  width: '100%',
                  border: 'none',
                  textTransform: 'none',
                }}>
                {host.active ? (
                  <Tooltip title="active">
                    <CheckIcon />
                  </Tooltip>
                ) : (
                  <Tooltip title="inactive">
                    <CloseIcon />
                  </Tooltip>
                )}
                {host.name}
              </Button>
            )}
          </div>
        ))}
      <Button
        onClick={() => {
          dispatch({ type: 'ADD_HOST' })
        }}
        style={{ width: '100%' }}>
        Add Host
      </Button>
      {selectedHostIdList.length > 0 && (
        <Button
          style={{
            color: '#fff',
            backgroundColor: '#dc3545',
            width: '100%',
            marginTop: '5px',
            border: 'none'
          }}
          onClick={() => {
            dispatch({ type: 'REMOVE_HOST', hostIdList: selectedHostIdList })
          }}>
          Remove Host
        </Button>
      )}
    </div>
  )
}

export default HostList
