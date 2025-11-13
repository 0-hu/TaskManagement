export const COLORS = {
  status: {
    todo: '#FF4D4D',
    inProgress: '#4D7CFF',
    completed: '#4CAF50',
    onHold: '#9E9E9E',
  },
  stat: {
    total: '#4D7CFF',
    inProgress: '#FFA726',
    completed: '#EC407A',
    scheduled: '#4CAF50',
  },
  priority: {
    low: '#4CAF50',
    medium: '#FFA726',
    high: '#FF6B6B',
    urgent: '#D32F2F',
  },
  ui: {
    background: '#F5F5F5',
    card: '#FFFFFF',
    border: '#E0E0E0',
    text: '#424242',
    textSecondary: '#616161',
    primary: '#4D7CFF',
  },
} as const

export const TASK_STATUS = {
  TODO: { label: '예정', color: COLORS.status.todo },
  IN_PROGRESS: { label: '진행중', color: COLORS.status.inProgress },
  COMPLETED: { label: '완료', color: COLORS.status.completed },
  ON_HOLD: { label: '보류', color: COLORS.status.onHold },
} as const
