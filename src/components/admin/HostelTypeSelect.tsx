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
  return (
    <FormField
      control={form.control}
      name="roomType"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Room Type</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select room type" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {hostelTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}