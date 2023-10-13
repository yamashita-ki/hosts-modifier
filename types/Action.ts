import type { AddHostAction } from '@/interfaces/AddHostAction'
import type { InitializeHostAction } from '@/interfaces/InitializeHostAction'
import type { RemoveHostAction } from '@/interfaces/RemoveHostAction'
import type { RenameHostAction } from '@/interfaces/RenameHostAction'
import type { ToggleHostAction } from '@/interfaces/ToggleHostAction'
import type { UpdateRulesAction } from '@/interfaces/UpdateRulesAction'

export type Action =
  | AddHostAction
  | InitializeHostAction
  | RemoveHostAction
  | ToggleHostAction
  | UpdateRulesAction
  | RenameHostAction
