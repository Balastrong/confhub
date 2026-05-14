import { createServerFn } from "@tanstack/react-start"
import { countriesService } from "./service.server"

export const getCountries = createServerFn({ method: "GET" }).handler(
  async () => {
    return countriesService.getCountries()
  },
)
