export interface RenameHostAction {
  type: 'RENAME_HOST'
  hostId: string
  payload: {
    name: string
  }
}
