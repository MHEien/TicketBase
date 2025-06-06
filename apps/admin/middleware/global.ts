import { registerGlobalMiddleware } from '@tanstack/react-start'
import { authMiddleware } from './auth'

// Register global middleware
registerGlobalMiddleware({
  middleware: [authMiddleware],
}) 