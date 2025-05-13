import { registerGlobalMiddleware } from "@tanstack/react-start"
import { globalLoggerMiddleware } from "./services/auth.api"

registerGlobalMiddleware({
  middleware: [globalLoggerMiddleware],
})
