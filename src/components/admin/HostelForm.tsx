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
import type { Hostel } from "./HostelList"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Hostel name must be at least 2 characters.",
  }),
  price: z.string().min(1, {
    message: "Price is required.",
  }),
  roomType: z.enum(hostelTypes, {
    required_error: "Please select a room type.",
  }),
  ownerName: z.string().min(2, {
    message: "Owner name is required.",
  }),
  ownerContact: z.string().min(10, {
    message: "Valid contact number is required.",
  }),
  description: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface HostelFormProps {
  initialData?: Hostel | null
  onSubmit: (values: FormValues) => void
  onCancel: () => void
}

export function HostelForm({ initialData, onSubmit, onCancel }: HostelFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      price: initialData?.price || "",
      roomType: initialData?.roomType || "single",
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
              <FormLabel>Price (GH₵)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter price per academic year"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Price per academic year in Ghana Cedis
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