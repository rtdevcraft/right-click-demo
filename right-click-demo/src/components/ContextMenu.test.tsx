import React, { createRef } from 'react'
import { describe, it, expect, beforeEach, jest } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ContextMenu } from './ContextMenu'
import type { Task } from '@/types'

const mockTask: Task = {
  id: 1,
  title: 'Mock Task',
  description: '',
  completed: false,
  priority: 'low',
  status: 'To Do',
  assignee: 'Jane Doe',
  dueDate: '2025-01-01',
}

const mockAnchorPosition = { x: 100, y: 100 }
const triggerElRef = createRef<HTMLDivElement>()

describe('ContextMenu', () => {
  const onClose = jest.fn()
  const onAction = jest.fn()
  const user = userEvent.setup()

  beforeEach(() => {
    onClose.mockClear()
    onAction.mockClear()
  })

  it('does not render when anchorPosition is null', () => {
    render(
      <ContextMenu<Task>
        anchorPosition={null}
        onClose={onClose}
        itemType='task'
        itemData={mockTask}
        onAction={onAction}
        triggerElRef={triggerElRef}
      />
    )
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('renders the correct menu items for itemType "task"', () => {
    render(
      <ContextMenu<Task>
        anchorPosition={mockAnchorPosition}
        onClose={onClose}
        itemType='task'
        itemData={mockTask}
        onAction={onAction}
        triggerElRef={triggerElRef}
      />
    )

    expect(screen.getByRole('menuitem', { name: 'Edit' })).toBeInTheDocument()
    expect(
      screen.getByRole('menuitem', { name: 'Mark Complete' })
    ).toBeInTheDocument()
    expect(screen.getByRole('menuitem', { name: 'Delete' })).toBeInTheDocument()
  })

  it('calls onAction and onClose when a menu item is clicked', async () => {
    render(
      <ContextMenu<Task>
        anchorPosition={mockAnchorPosition}
        onClose={onClose}
        itemType='task'
        itemData={mockTask}
        onAction={onAction}
        triggerElRef={triggerElRef}
      />
    )

    const editButton = screen.getByRole('menuitem', { name: 'Edit' })
    await user.click(editButton)

    expect(onAction).toHaveBeenCalledTimes(1)
    expect(onAction).toHaveBeenCalledWith('edit', mockTask)
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('applies destructive styling to the delete item', () => {
    render(
      <ContextMenu<Task>
        anchorPosition={mockAnchorPosition}
        onClose={onClose}
        itemType='task'
        itemData={mockTask}
        onAction={onAction}
        triggerElRef={triggerElRef}
      />
    )

    const deleteMenuItem = screen.getByRole('menuitem', { name: 'Delete' })
    // This robustly checks that MUI applied its 'error' color class,
    // rather than checking a specific, brittle RGB value.
    expect(deleteMenuItem.querySelector('.MuiListItemText-root')).toHaveClass(
      'Mui-error'
    )
  })
})
