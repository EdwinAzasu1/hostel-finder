import React, { useState, useEffect } from "react"
import { HostelForm } from "@/components/admin/HostelForm"
import { ImageUpload } from "@/components/admin/ImageUpload"
import { HostelList, type Hostel } from "@/components/admin/HostelList"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/integrations/supabase/client"

export default function ManageHostels() {
  const [hostels, setHostels] = useState<Hostel[]>([])
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [editingHostel, setEditingHostel] = useState<Hostel | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchHostels()
  }, [])

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

  const handleImagesSelected = (files: File[]) => {
    setSelectedImages(files)
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

  const handleSubmit = async (values: Omit<Hostel, "id">) => {
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

      setIsDialogOpen(false)
      setEditingHostel(null)
      setSelectedImages([])
      fetchHostels()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save hostel",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (hostel: Hostel) => {
    setEditingHostel(hostel)
    setSelectedImages([])
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("hostels").delete().eq("id", id)

      if (error) throw error

      setHostels((prev) => prev.filter((hostel) => hostel.id !== id))
      toast({
        title: "Success",
        description: "Hostel deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete hostel",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Hostels</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingHostel(null)}>
              <Plus className="mr-2 h-4 w-4" /> Add New Hostel
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>
                {editingHostel ? "Edit Hostel" : "Add New Hostel"}
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-6">
              <ImageUpload onImagesSelected={handleImagesSelected} />
              {selectedImages.length > 0 && (
                <div className="grid grid-cols-3 gap-4">
                  {selectedImages.map((image, index) => (
                    <div
                      key={index}
                      className="relative aspect-video rounded-lg overflow-hidden"
                    >
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Preview ${index + 1}`}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  ))}
                </div>
              )}
              <HostelForm
                initialData={editingHostel}
                onSubmit={handleSubmit}
                onCancel={() => setIsDialogOpen(false)}
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {hostels.length > 0 ? (
        <HostelList
          hostels={hostels}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ) : (
        <div className="text-center text-gray-500 py-8">
          No hostels added yet. Click the button above to add your first hostel.
        </div>
      )}
    </div>
  )
}