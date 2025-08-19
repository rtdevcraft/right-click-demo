'use client'

import React, { useState, useCallback } from 'react'
import { Box, Typography, ThemeProvider, CssBaseline } from '@mui/material'
import { TaskCard } from '@/components/TaskCard'
import { ContextMenu } from '@/components/ContextMenu'
import { EditTaskForm } from '@/components/EditTaskForm'
import theme from '@/theme/theme'
import type { Task, ContextMenuState, ContextMenuItemData } from '@/types'
import { initialTasks } from '@/lib/data/mockTasks'

export default function ContextMenuDemo() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [contextMenu, setContextMenu] = useState<ContextMenuState>(null)
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null)

  const handleToggleComplete = useCallback((taskId: number) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    )
  }, [])

  const handleCloseContextMenu = useCallback(() => {
    setContextMenu(null)
  }, [])

  const handleContextMenu = useCallback(
    (e: React.MouseEvent, itemType: string, itemData: ContextMenuItemData) => {
      e.preventDefault()
      setContextMenu({
        anchorPosition: { x: e.clientX, y: e.clientY },
        itemType,
        itemData,
      })
    },
    []
  )

  const handleMenuAction = useCallback(
    (action: string, itemData: ContextMenuItemData) => {
      console.log('Action:', action, 'on item:', itemData)
      if (action === 'edit' && 'id' in itemData) {
        setEditingTaskId(itemData.id)
      }
      handleCloseContextMenu()
    },
    [handleCloseContextMenu]
  )

  const handleSaveTask = useCallback((updatedTask: Task) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === updatedTask.id ? updatedTask : task
      )
    )
    setEditingTaskId(null)
  }, [])

  const handleCancelEdit = useCallback(() => {
    setEditingTaskId(null)
  }, [])

  const handleContainerRightClick = (e: React.MouseEvent) => {
    handleContextMenu(e, 'container', { type: 'workspace' })
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          p: 4,
          minHeight: '100vh',
          bgcolor: 'background.default',
        }}
      >
        <Typography variant='h4' gutterBottom>
          Context Menu Demo
        </Typography>
        <Typography
          variant='body1'
          sx={{
            mb: 4,
            color: 'text.secondary',
            maxWidth: 600,
            textAlign: 'center',
          }}
        >
          Right-click on a task or the workspace below.
        </Typography>
        <Box
          onContextMenu={handleContainerRightClick}
          sx={{
            width: '100%',
            maxWidth: 900,
            minHeight: 500,
            p: 3,
            bgcolor: 'background.paper',
            borderRadius: 3,
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          }}
        >
          {tasks.map((task) => (
            <Box key={task.id}>
              {editingTaskId === task.id ? (
                <EditTaskForm
                  task={task}
                  onSave={handleSaveTask}
                  onCancel={handleCancelEdit}
                />
              ) : (
                <TaskCard
                  task={task}
                  onContextMenu={handleContextMenu}
                  onToggleComplete={handleToggleComplete}
                />
              )}
            </Box>
          ))}
        </Box>
        {contextMenu && (
          <ContextMenu
            anchorPosition={contextMenu.anchorPosition}
            onClose={handleCloseContextMenu}
            itemType={contextMenu.itemType}
            itemData={contextMenu.itemData}
            onAction={handleMenuAction}
          />
        )}
      </Box>
    </ThemeProvider>
  )
}
