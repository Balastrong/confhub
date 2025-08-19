import React from "react"
import { useQuery } from "@tanstack/react-query"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
import { countryQueries } from "~/services/queries"

type Props = {
  value?: string
  onChange: (value: string | undefined) => void
  placeholder?: string
}

export function CountrySelect({ value, onChange, placeholder }: Props) {
  const { data: countries = [] } = useQuery(countryQueries.list())

  return (
    <Select
      value={value ?? ""}
      onValueChange={(val) => onChange(val || undefined)}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder ?? "All countries"} />
      </SelectTrigger>
      <SelectContent>
        {countries.map((country) => (
          <SelectItem key={country} value={country}>
            {country}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
