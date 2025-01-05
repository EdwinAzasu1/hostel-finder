import { useState } from "react"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/components/ui/use-toast"
import type { HostelFormValues } from "./HostelForm"
import type { Hostel } from "@/integrations/supabase/types"
import { HostelType } from "./HostelTypeSelect"

export function useHostelOperations() {
  const [hostels, setHostels] = useState<(Hostel & { roomTypes: HostelType[] })[]>([])
  const { toast } = useToast()

  const fetchHostels = async () => {
    const { data: hostelsData, error: hostelsError } = await supabase
      .from("hostels")
      .select("*")
      .order("created_at", { ascending: false })

    if (hostelsError) {
      toast({
        title: "Error",
        description: "Failed to fetch hostels",
        variant: "destructive",
      })
      return
    }

    // Fetch room types for all hostels
    const { data: roomTypesData, error: roomTypesError } = await supabase
      .from("hostel_room_types")
      .select("*")
      .in(
        "hostel_id",
        hostelsData.map((h) => h.id)
      )

    if (roomTypesError) {
      toast({
        title: "Error",
        description: "Failed to fetch room types",
        variant: "destructive",
      })
      return
    }

    // Combine hostels with their room types
    setHostels(
      hostelsData.map((hostel) => ({
        ...hostel,
        price: hostel.price.toString(),
        roomTypes: roomTypesData
          .filter((rt) => rt.hostel_id === hostel.id)
          .map((rt) => rt.room_type as HostelType),
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
    editingHostel: (Hostel & { roomTypes: HostelType[] }) | null
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
        owner_name: values.ownerName,
        owner_contact: values.ownerContact,
        ...(thumbnailUrl && { thumbnail: thumbnailUrl }),
      }

      let hostelId: string

      if (editingHostel) {
        const { error: updateError } = await supabase
          .from("hostels")
          .update(hostelData)
          .eq("id", editingHostel.id)

        if (updateError) throw updateError
        hostelId = editingHostel.id

        // Delete existing room types
        const { error: deleteError } = await supabase
          .from("hostel_room_types")
          .delete()
          .eq("hostel_id", editingHostel.id)

        if (deleteError) throw deleteError
      } else {
        const { data: newHostel, error: insertError } = await supabase
          .from("hostels")
          .insert([hostelData])
          .select()
          .single()

        if (insertError) throw insertError
        hostelId = newHostel.id
      }

      // Insert new room types
      const roomTypesData = values.roomTypes.map((type) => ({
        hostel_id: hostelId,
        room_type: type,
      }))

      const { error: roomTypesError } = await supabase
        .from("hostel_room_types")
        .insert(roomTypesData)

      if (roomTypesError) throw roomTypesError

      toast({
        title: "Success",
        description: editingHostel
          ? "Hostel updated successfully"
          : "New hostel added successfully",
      })

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