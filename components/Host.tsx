import { HostsContext } from '@/components/HostsContext'
import RuleInput from '@/components/RuleInput'
import type { Host } from '@/interfaces/Host'
import type { HostProps } from '@/interfaces/HostProps'
import React, { useContext } from 'react'

const Host: React.FC<HostProps> = ({ selectedHostId }) => {
  const { state } = useContext(HostsContext)!
  const selectedHost: Host | undefined = (Array.isArray(state?.hosts) ? state.hosts : []).find(
    (host: { id: string }) => host.id === selectedHostId
  )
  const selectedHostRules = selectedHost ? selectedHost.rules : null

  return (
    <div style={{ flex: 1, padding: '10px' }}>
      <RuleInput
        hostId={selectedHostId || ''}
        placeholder="127.0.0.1 example.com"
        initialValue={selectedHostRules || ''}
      />
    </div>
  )
}

export default Host
