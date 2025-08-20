import React from 'react'
import type { RefObject } from 'react'

/**
 * Defines the structure of a single task object.
 */
export type Task = {
  id: number
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  status: 'To Do' | 'In Progress' | 'Done'
  assignee: string
  dueDate: string
  completed: boolean
}

/**
 * Defines the props for the TaskCard component.
 */
export type TaskCardProps = {
  task: Task
  onContextMenu: (
    event: React.MouseEvent,
    itemType: string,
    itemData: ContextMenuItemData
  ) => void
  onToggleComplete: (taskId: number) => void
}

/**
 * Defines the shape of an object that describes a single menu item.
 */
export type MenuItemType = {
  icon: React.ReactNode
  text: string
  action: string
  destructive?: boolean
}

/**
 * Represents the data associated with the item that was right-clicked.
 * It can be a task or another entity like a workspace.
 */
export type ContextMenuItemData = Task | { type: string }

/**
 * Describes the state of the context menu, including its position and the
 * data of the item it relates to. It's null when the menu is closed.
 */
export type ContextMenuState = {
  anchorPosition: { x: number; y: number }
  itemType: string
  itemData: ContextMenuItemData
} | null

/**
 * Defines the props for the ContextMenu component.
 */
export type ContextMenuProps<T> = {
  anchorPosition: { x: number; y: number } | null
  onClose: () => void
  itemType: string
  itemData: T // Now T is recognized as the generic parameter
  onAction: (action: string, itemData: T) => void
  triggerElRef: RefObject<HTMLElement | null>
}
