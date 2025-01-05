import React from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

export const hostelTypes = [
  "single",
  "double",
  "triple",
  "quad",
  "suite",
  "apartment",
] as const

export type HostelType = (typeof hostelTypes)[number]

export function HostelTypeSelect({ form }: { form: any }) {
  const selectedTypes = form.watch("roomTypes") || []

  const handleTypeChange = (type: string) => {
    const currentTypes = form.getValues("roomTypes") || []
    const newTypes = currentTypes.includes(type)
      ? currentTypes.filter((t: string) => t !== type)
      : [...currentTypes, type]
    form.setValue("roomTypes", newTypes)
  }

  return (
    <FormField
      control={form.control}
      name="roomTypes"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Room Types</FormLabel>
          <div className="flex flex-wrap gap-2">
            {hostelTypes.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => handleTypeChange(type)}
                className={`px-3 py-1 rounded-md border ${
                  selectedTypes.includes(type)
                    ? "bg-primary text-primary-foreground"
                    : "bg-background"
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}