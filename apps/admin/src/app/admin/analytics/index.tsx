import { createFileRoute } from '@tanstack/react-router'
import { DataVisualization } from '@/components/data-visualization'

export const Route = createFileRoute('/admin/analytics/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <DataVisualization />
}
