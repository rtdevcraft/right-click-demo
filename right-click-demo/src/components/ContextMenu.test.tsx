import React from 'react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ContextMenu } from './ContextMenu'
import type { Task, ContextMenuProps } from '@/types'

// Mock data for the task
const mockTask: Task = {
  id: 1,
  title: 'Test Task',
  description: 'A test description',
  completed: false,
  priority: 'medium',
  status: 'To Do',
  assignee: 'Jane Doe',
  dueDate: '2025-12-31',
}

// Reusable mock props
const mockProps: ContextMenuProps<Task> = {
  anchorPosition: { x: 100, y: 100 },
  onClose: vi.fn(),
  onAction: vi.fn(),
  itemType: 'task',
  itemData: mockTask,
  triggerElRef: { current: document.createElement('button') },
}

describe('ContextMenu', () => {
  const user = userEvent.setup()
  const { onAction, onClose } = mockProps

  // Clear mocks before each test to ensure a clean slate
  beforeEach(() => {
    vi.clearAllMocks()
    document.body.appendChild(mockProps.triggerElRef.current!)
    mockProps.triggerElRef.current!.focus()
  })

  it('renders null when anchorPosition is not provided', () => {
    const { container } = render(
      <ContextMenu {...mockProps} anchorPosition={null} />
    )
    expect(container).toBeEmptyDOMElement()
  })

  it('renders the correct menu items for a task', () => {
    render(<ContextMenu {...mockProps} />)
    expect(screen.getByRole('menuitem', { name: /edit/i })).toBeInTheDocument()
    expect(
      screen.getByRole('menuitem', { name: /mark complete/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('menuitem', { name: /delete/i })
    ).toBeInTheDocument()
  })

  it('calls onClose when the backdrop is clicked', async () => {
    render(<ContextMenu {...mockProps} />)
    await user.click(document.body)
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onAction and onClose when a menu item is clicked', async () => {
    render(<ContextMenu {...mockProps} />)
    const editMenuItem = screen.getByRole('menuitem', { name: /edit/i })
    await user.click(editMenuItem)

    expect(onAction).toHaveBeenCalledTimes(1)
    expect(onAction).toHaveBeenCalledWith('edit', mockTask)
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('applies destructive styling to the delete item', () => {
    render(<ContextMenu {...mockProps} />)
    const deleteMenuItem = screen.getByRole('menuitem', { name: /delete/i })
    expect(deleteMenuItem).toHaveStyle({ color: 'rgb(211, 47, 47)' })
  })

  it('sets focus on the first menu item on render', async () => {
    render(<ContextMenu {...mockProps} />)
    const firstItem = screen.getByRole('menuitem', { name: /edit/i })
    await waitFor(() => {
      expect(firstItem).toHaveFocus()
    })
  })

  it('returns focus to the trigger element on close', async () => {
    const { unmount } = render(<ContextMenu {...mockProps} />)
    expect(mockProps.triggerElRef.current).toHaveFocus()
    const firstItem = screen.getByRole('menuitem', { name: /edit/i })
    await waitFor(() => {
      expect(firstItem).toHaveFocus()
    })
    unmount()
    expect(mockProps.triggerElRef.current).toHaveFocus()
  })
})
