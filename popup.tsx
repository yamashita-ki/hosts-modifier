import Host from '@/components/Host'
import HostList from '@/components/HostList'
import { HostsProvider } from '@/components/HostsContext'
import React, { useState } from 'react'

const IndexPopup: React.FC = () => {
  const [selectedHostId, setSelectedHostId] = useState<string | null>(null)
  return (
    <HostsProvider>
      <div style={{ display: 'flex', height: '100vh' }}>
        <HostList setSelectedHostId={setSelectedHostId} />
        <Host selectedHostId={selectedHostId} />
      </div>
    </HostsProvider>
  )
}

export default IndexPopup
