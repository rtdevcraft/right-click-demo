import React from 'react'
import { describe, it, expect, beforeEach, jest } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { EditTaskForm } from './EditTaskForm'
import type { Task } from '@/types'

const mockTask: Task = {
  id: 1,
  title: 'Initial Title',
  description: '',
  completed: false,
  priority: 'low',
  status: 'To Do',
  assignee: 'Jane Doe',
  dueDate: '2025-01-01',
}

describe('EditTaskForm', () => {
  const onSave = jest.fn()
  const onCancel = jest.fn()
  const user = userEvent.setup()

  beforeEach(() => {
    onSave.mockClear()
    onCancel.mockClear()
  })

  it('renders with the initial task title and focuses the input', () => {
    render(<EditTaskForm task={mockTask} onSave={onSave} onCancel={onCancel} />)
    const input = screen.getByLabelText(/edit task title/i)
    expect(input).toHaveValue(mockTask.title)
    expect(input).toHaveFocus()
  })

  it('calls onSave with updated task when title is changed and save is clicked', async () => {
    render(<EditTaskForm task={mockTask} onSave={onSave} onCancel={onCancel} />)
    const newTitle = 'Updated Task Title'
    const input = screen.getByLabelText(/edit task title/i)
    const saveButton = screen.getByRole('button', { name: /save/i })

    await user.clear(input)
    await user.type(input, newTitle)
    await user.click(saveButton)

    expect(onSave).toHaveBeenCalledTimes(1)
    expect(onSave).toHaveBeenCalledWith({ ...mockTask, title: newTitle })
    expect(onCancel).not.toHaveBeenCalled()
  })

  it('calls onCancel when cancel button is clicked', async () => {
    render(<EditTaskForm task={mockTask} onSave={onSave} onCancel={onCancel} />)
    const cancelButton = screen.getByRole('button', { name: /cancel/i })
    await user.click(cancelButton)

    expect(onCancel).toHaveBeenCalledTimes(1)
    expect(onSave).not.toHaveBeenCalled()
  })

  it('calls onCancel when save is clicked but the title is unchanged', async () => {
    render(<EditTaskForm task={mockTask} onSave={onSave} onCancel={onCancel} />)
    const saveButton = screen.getByRole('button', { name: /save/i })
    await user.click(saveButton)

    expect(onCancel).toHaveBeenCalledTimes(1)
    expect(onSave).not.toHaveBeenCalled()
  })

  it('calls onCancel if the title is cleared', async () => {
    render(<EditTaskForm task={mockTask} onSave={onSave} onCancel={onCancel} />)
    const input = screen.getByLabelText(/edit task title/i)
    const saveButton = screen.getByRole('button', { name: /save/i })

    await user.clear(input)
    await user.click(saveButton)

    expect(onCancel).toHaveBeenCalledTimes(1)
    expect(onSave).not.toHaveBeenCalled()
  })

  it('submits the form when Enter is pressed in the text field', async () => {
    render(<EditTaskForm task={mockTask} onSave={onSave} onCancel={onCancel} />)
    const newTitle = 'Submitted with Enter'
    const input = screen.getByLabelText(/edit task title/i)

    await user.clear(input)
    await user.type(input, `${newTitle}{enter}`)

    expect(onSave).toHaveBeenCalledTimes(1)
    expect(onSave).toHaveBeenCalledWith({ ...mockTask, title: newTitle })
  })
})
