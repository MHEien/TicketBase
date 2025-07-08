import { createFileRoute } from '@tanstack/react-router'
import * as React from 'react'

import { useAuth } from '../auth'

export const Route = createFileRoute('/_auth/dashboard')({
  component: DashboardPage,
})

function DashboardPage() {
  const auth = useAuth()

  return (
    <section className="grid gap-2 p-2">
      <h2 className="text-xl font-semibold">Dashboard</h2>
      <div className="bg-gray-100 p-4 rounded-lg">
        <h3 className="font-medium">Welcome back!</h3>
        <p>Hi {auth.user?.name || auth.user?.email || 'User'}!</p>
        {auth.user?.email && <p className="text-sm text-gray-600">Email: {auth.user.email}</p>}
        {auth.user?.role && <p className="text-sm text-gray-600">Role: {auth.user.role}</p>}
      </div>
      <p>You are currently on the dashboard route and successfully authenticated.</p>
    </section>
  )
}
