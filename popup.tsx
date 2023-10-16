import Host from '@/components/Host'
import HostList from '@/components/HostList'
import { HostsProvider } from '@/components/HostsContext'
import React, { useEffect, useState } from 'react'

const IndexPopup: React.FC = () => {
  const [selectedHostId, setSelectedHostId] = useState<string | null>(null)
  useEffect(() => {
    setSelectedHostId('00000-info')
  }, [setSelectedHostId])
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
