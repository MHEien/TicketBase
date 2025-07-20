import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/events/")({
  component: EventsIndexComponent,
});

function EventsIndexComponent() {
  return <div>Select an event.</div>;
}