import { Globe, MapPin, MonitorSpeaker } from "lucide-react"

export type EventMode = "in-person" | "hybrid" | "online"

export const EVENT_MODE_CONFIG = {
  "in-person": {
    label: "In Person",
    icon: MapPin,
  },
  hybrid: {
    label: "Hybrid",
    icon: MonitorSpeaker,
  },
  online: {
    label: "Online",
    icon: Globe,
  },
} as const satisfies Record<
  EventMode,
  { label: string; icon: React.ComponentType<any> }
>

export const getEventModeConfig = (mode: EventMode) => EVENT_MODE_CONFIG[mode]
