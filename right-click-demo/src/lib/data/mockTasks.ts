import type { Task } from '@/types'

export const initialTasks: Task[] = [
  {
    id: 1,
    title: 'Design homepage mockup',
    description: 'Create wireframes and high-fidelity mockups.',
    priority: 'high',
    status: 'In Progress',
    assignee: 'John Doe',
    dueDate: '2025-07-15',
    completed: false,
  },
  {
    id: 2,
    title: 'Implement user authentication',
    description: 'Set up login/signup functionality with JWT.',
    priority: 'medium',
    status: 'To Do',
    assignee: 'Jane Smith',
    dueDate: '2025-07-20',
    completed: false,
  },
  {
    id: 3,
    title: 'Write comprehensive unit tests',
    description: 'Add test coverage for all API endpoints.',
    priority: 'low',
    status: 'Done',
    assignee: 'Mike Johnson',
    dueDate: '2025-07-10',
    completed: true,
  },
]
