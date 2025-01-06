import React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { HostelTypeSelect, hostelTypes } from "./HostelTypeSelect"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Hostel name must be at least 2 characters.",
  }),
  price: z.string().min(1, {
    message: "Base price is required.",
  }),
  roomTypes: z.array(z.enum(hostelTypes)).min(1, {
    message: "Select at least one room type.",
  }),
  roomPrices: z.record(z.string().min(1, "Price is required for each room type")),
  ownerName: z.string().min(2, {
    message: "Owner name is required.",
  }),
  ownerContact: z.string().min(10, {
    message: "Valid contact number is required.",
  }),
  description: z.string().optional(),
})

export type HostelFormValues = z.infer<typeof formSchema>

interface HostelFormProps {
  initialData?: {
    name: string
    price: string
    roomTypes: typeof hostelTypes[number][]
    roomPrices?: Record<string, string>
    ownerName: string
    ownerContact: string
    description?: string
  } | null
  onSubmit: (values: HostelFormValues) => void
  onCancel: () => void
}

export function HostelForm({ initialData, onSubmit, onCancel }: HostelFormProps) {
  const form = useForm<HostelFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      price: initialData?.price || "",
      roomTypes: initialData?.roomTypes || [],
      roomPrices: initialData?.roomPrices || {},
      ownerName: initialData?.ownerName || "",
      ownerContact: initialData?.ownerContact || "",
      description: initialData?.description || "",
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hostel Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter hostel name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Base Price (GH₵)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter base price per academic year"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Base price per academic year in Ghana Cedis
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <HostelTypeSelect form={form} />

        <FormField
          control={form.control}
          name="ownerName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Owner Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter owner name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="ownerContact"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Owner Contact</FormLabel>
              <FormControl>
                <Input placeholder="Enter contact number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter hostel description"
                  className="resize-none h-20"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4">
          <Button type="submit">
            {initialData ? "Update Hostel" : "Add Hostel"}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  )
}