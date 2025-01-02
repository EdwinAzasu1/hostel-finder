import React, { useState } from "react"
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

export default function ManageHostels() {
  const [hostels, setHostels] = useState<Hostel[]>([])
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [editingHostel, setEditingHostel] = useState<Hostel | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()

  const handleImagesSelected = (files: File[]) => {
    setSelectedImages(files)
  }

  const handleSubmit = (values: Omit<Hostel, "id">) => {
    if (editingHostel) {
      // Update existing hostel
      setHostels((prev) =>
        prev.map((hostel) =>
          hostel.id === editingHostel.id
            ? { ...values, id: hostel.id, images: selectedImages }
            : hostel
        )
      )
      toast({
        title: "Hostel updated",
        description: "The hostel has been successfully updated.",
      })
    } else {
      // Add new hostel
      const newHostel = {
        ...values,
        id: crypto.randomUUID(),
        images: selectedImages,
      }
      setHostels((prev) => [...prev, newHostel])
      toast({
        title: "Hostel added",
        description: "The new hostel has been successfully added.",
      })
    }
    setIsDialogOpen(false)
    setEditingHostel(null)
    setSelectedImages([])
  }

  const handleEdit = (hostel: Hostel) => {
    setEditingHostel(hostel)
    setSelectedImages(hostel.images || [])
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setHostels((prev) => prev.filter((hostel) => hostel.id !== id))
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