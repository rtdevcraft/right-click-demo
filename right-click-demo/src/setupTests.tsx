import '@testing-library/jest-dom'
import { vi } from 'vitest'

vi.mock('@mui/icons-material', () => {
  return new Proxy(
    {},
    {
      get: (target, prop) => {
        return () => <svg data-testid={`${String(prop)}Icon`} />
      },
    }
  )
})
