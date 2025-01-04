import { useState } from "react"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/components/ui/use-toast"
import type { HostelFormValues } from "./HostelForm"
import type { Hostel } from "./HostelList"

export function useHostelOperations() {
  const [hostels, setHostels] = useState<Hostel[]>([])
  const { toast } = useToast()

  const fetchHostels = async () => {
    const { data, error } = await supabase
      .from("hostels")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch hostels",
        variant: "destructive",
      })
      return
    }

    setHostels(
      data.map((hostel) => ({
        ...hostel,
        price: hostel.price.toString(),
        roomType: hostel.room_type,
        ownerName: hostel.owner_name,
        ownerContact: hostel.owner_contact,
      }))
    )
  }

  const uploadImage = async (file: File) => {
    const fileExt = file.name.split(".").pop()
    const filePath = `${crypto.randomUUID()}.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from("hostel_images")
      .upload(filePath, file)

    if (uploadError) {
      throw uploadError
    }

    const { data } = supabase.storage
      .from("hostel_images")
      .getPublicUrl(filePath)

    return data.publicUrl
  }

  const handleSubmit = async (
    values: HostelFormValues,
    selectedImages: File[],
    editingHostel: Hostel | null
  ) => {
    try {
      let thumbnailUrl = null
      if (selectedImages.length > 0) {
        thumbnailUrl = await uploadImage(selectedImages[0])
      }

      const hostelData = {
        name: values.name,
        description: values.description,
        price: parseFloat(values.price),
        room_type: values.roomType,
        owner_name: values.ownerName,
        owner_contact: values.ownerContact,
        ...(thumbnailUrl && { thumbnail: thumbnailUrl }),
      }

      if (editingHostel) {
        const { error } = await supabase
          .from("hostels")
          .update(hostelData)
          .eq("id", editingHostel.id)

        if (error) throw error

        toast({
          title: "Success",
          description: "Hostel updated successfully",
        })
      } else {
        const { error } = await supabase.from("hostels").insert([hostelData])

        if (error) throw error

        toast({
          title: "Success",
          description: "New hostel added successfully",
        })
      }

      await fetchHostels()
      return true
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save hostel",
        variant: "destructive",
      })
      return false
    }
  }

  const deleteHostel = async (id: string) => {
    try {
      const { error } = await supabase.from("hostels").delete().eq("id", id)
      if (error) throw error
      toast({
        title: "Success",
        description: "Hostel deleted successfully",
      })
      await fetchHostels()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete hostel",
        variant: "destructive",
      })
    }
  }

  return {
    hostels,
    fetchHostels,
    handleSubmit,
    deleteHostel,
  }
}