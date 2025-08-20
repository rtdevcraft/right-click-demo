import React from 'react'
import { describe, it, expect, beforeEach, jest } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TaskCard } from './TaskCard'
import type { Task } from '@/types'

const mockTask: Task = {
  id: 1,
  title: 'Test Task Title',
  description: 'A description for the test task.',
  completed: false,
  priority: 'high',
  status: 'In Progress',
  assignee: 'John Doe',
  dueDate: '2025-12-31',
}

describe('TaskCard', () => {
  const onContextMenu = jest.fn()
  const onToggleComplete = jest.fn()
  const user = userEvent.setup()

  beforeEach(() => {
    onContextMenu.mockClear()
    onToggleComplete.mockClear()
  })

  it('renders all task details correctly', () => {
    render(
      <TaskCard
        task={mockTask}
        onContextMenu={onContextMenu}
        onToggleComplete={onToggleComplete}
      />
    )

    expect(screen.getByText(mockTask.title)).toBeInTheDocument()
    expect(screen.getByText(mockTask.description)).toBeInTheDocument()
    expect(
      screen.getByText(mockTask.priority.toUpperCase())
    ).toBeInTheDocument()
    expect(screen.getByText(mockTask.status)).toBeInTheDocument()
    expect(screen.getByText(mockTask.dueDate!)).toBeInTheDocument()
    expect(
      screen.getByText(mockTask.assignee!.charAt(0).toUpperCase())
    ).toBeInTheDocument()
  })

  it('applies line-through style when task is completed', () => {
    const completedTask = { ...mockTask, completed: true }
    render(
      <TaskCard
        task={completedTask}
        onContextMenu={onContextMenu}
        onToggleComplete={onToggleComplete}
      />
    )

    const titleElement = screen.getByText(completedTask.title)
    expect(titleElement).toHaveStyle('text-decoration: line-through')
  })

  it('calls onToggleComplete with the task ID when the completion icon is clicked', async () => {
    render(
      <TaskCard
        task={mockTask}
        onContextMenu={onContextMenu}
        onToggleComplete={onToggleComplete}
      />
    )

    const toggleButton = screen.getByRole('button', {
      name: `Toggle completion for ${mockTask.title}`,
    })
    await user.click(toggleButton)

    expect(onToggleComplete).toHaveBeenCalledTimes(1)
    expect(onToggleComplete).toHaveBeenCalledWith(mockTask.id)
  })

  it('calls onContextMenu when the card is right-clicked', async () => {
    render(
      <TaskCard
        task={mockTask}
        onContextMenu={onContextMenu}
        onToggleComplete={onToggleComplete}
      />
    )

    const cardElement = screen.getByRole('article', {
      name: `Task: ${mockTask.title}`,
    })
    await user.pointer({ keys: '[MouseRight]', target: cardElement })

    expect(onContextMenu).toHaveBeenCalledTimes(1)
    expect(onContextMenu).toHaveBeenCalledWith(
      expect.any(Object),
      'task',
      mockTask
    )
  })

  it('calls onContextMenu when the More options icon is clicked', async () => {
    render(
      <TaskCard
        task={mockTask}
        onContextMenu={onContextMenu}
        onToggleComplete={onToggleComplete}
      />
    )

    const moreButton = screen.getByRole('button', { name: /more options/i })
    await user.click(moreButton)

    expect(onContextMenu).toHaveBeenCalledTimes(1)
    expect(onContextMenu).toHaveBeenCalledWith(
      expect.any(Object),
      'task',
      mockTask
    )
  })
})
