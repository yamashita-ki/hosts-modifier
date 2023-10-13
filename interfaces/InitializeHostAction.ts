import type { Host } from '@/interfaces/Host'

export interface InitializeHostAction {
  type: 'INITIALIZE_HOST'
  hosts: Host[]
}
