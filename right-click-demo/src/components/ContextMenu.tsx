import React, { useMemo } from 'react'
import {
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material'
import {
  Edit,
  Delete,
  ContentCopy,
  Share,
  Archive,
  Star,
  Schedule,
  Person,
  Flag,
  Assignment,
  CheckCircle,
} from '@mui/icons-material'
import type { ContextMenuProps, MenuItemType } from '@/types'

// Define menu item configurations outside the component to prevent re-creation
const menuConfig = {
  common: [
    { icon: <Edit fontSize='small' />, text: 'Edit', action: 'edit' },
    {
      icon: <ContentCopy fontSize='small' />,
      text: 'Duplicate',
      action: 'duplicate',
    },
    { icon: <Share fontSize='small' />, text: 'Share', action: 'share' },
  ],
  task: [
    {
      icon: <CheckCircle fontSize='small' />,
      text: 'Mark Complete',
      action: 'complete',
    },
    {
      icon: <Person fontSize='small' />,
      text: 'Assign to...',
      action: 'assign',
    },
    {
      icon: <Schedule fontSize='small' />,
      text: 'Set Due Date',
      action: 'due-date',
    },
    {
      icon: <Flag fontSize='small' />,
      text: 'Set Priority',
      action: 'priority',
    },
    {
      icon: <Star fontSize='small' />,
      text: 'Add to Favorites',
      action: 'favorite',
    },
  ],
  container: [
    {
      icon: <Assignment fontSize='small' />,
      text: 'Create Task',
      action: 'create-task',
    },
    {
      icon: <Archive fontSize='small' />,
      text: 'Archive All',
      action: 'archive-all',
    },
  ],
  destructive: [
    {
      icon: <Archive fontSize='small' />,
      text: 'Archive',
      action: 'archive',
    },
    {
      icon: <Delete fontSize='small' />,
      text: 'Delete',
      action: 'delete',
      destructive: true,
    },
  ],
}

const getMenuItems = (itemType: string): (MenuItemType | 'divider')[] => {
  if (itemType === 'task') {
    return [
      ...menuConfig.common,
      'divider',
      ...menuConfig.task,
      'divider',
      ...menuConfig.destructive,
    ]
  }
  if (itemType === 'container') {
    return [...menuConfig.common, 'divider', ...menuConfig.container]
  }
  return menuConfig.common
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
  anchorPosition,
  onClose,
  itemType,
  itemData,
  onAction,
}) => {
  const menuItems = useMemo(() => getMenuItems(itemType), [itemType])

  const handleAction = (action: string) => {
    onAction(action, itemData)
    onClose()
  }

  return (
    <Menu
      open={anchorPosition !== null}
      onClose={onClose}
      anchorReference='anchorPosition'
      anchorPosition={
        anchorPosition
          ? { top: anchorPosition.y, left: anchorPosition.x }
          : undefined
      }
      slotProps={{
        paper: {
          elevation: 12,
          sx: {
            minWidth: 220,
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
            p: 0.5,
          },
        },
      }}
    >
      {menuItems.map((item, index) => {
        if (item === 'divider') {
          return <Divider key={`divider-${index}`} sx={{ my: 0.5 }} />
        }
        return (
          <MenuItem
            key={item.action}
            onClick={() => handleAction(item.action)}
            sx={{
              borderRadius: 1,
              mx: 0.5,
              color: item.destructive ? 'error.main' : 'text.primary',
              '&:hover': {
                bgcolor: item.destructive
                  ? 'rgba(239, 68, 68, 0.1)'
                  : 'action.hover',
              },
            }}
          >
            <ListItemIcon sx={{ color: 'inherit', minWidth: 36 }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.text}
              primaryTypographyProps={{ fontSize: 14, fontWeight: 500 }}
            />
          </MenuItem>
        )
      })}
    </Menu>
  )
}
