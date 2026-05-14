import { isNotNull } from "drizzle-orm"
import { db } from "~/lib/db"
import { eventTable } from "~/lib/db/schema"

export type CountriesServiceDeps = {
  db: typeof db
}

export function createCountriesService(deps: CountriesServiceDeps) {
  return {
    async getCountries() {
      try {
        const rows = await deps.db
          .select({ country: eventTable.country })
          .from(eventTable)
          .where(isNotNull(eventTable.country))

        return [
          ...new Set(
            rows
              .map((row) => row.country?.trim())
              .filter(
                (country): country is string => !!country && country.length > 0,
              ),
          ),
        ].sort((left, right) => left.localeCompare(right))
      } catch (error) {
        console.error("Error fetching countries", error)
        return []
      }
    },
  }
}

export const countriesService = createCountriesService({ db })
