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
import { useHostelOperations } from "@/components/admin/useHostelOperations"

export default function ManageHostels() {
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [editingHostel, setEditingHostel] = useState<Hostel | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { hostels, fetchHostels, handleSubmit, deleteHostel } =
    useHostelOperations()

  useEffect(() => {
    fetchHostels()
  }, [])

  const handleImagesSelected = (files: File[]) => {
    setSelectedImages(files)
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
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editingHostel ? "Edit Hostel" : "Add New Hostel"}
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-4">
              <ImageUpload onImagesSelected={handleImagesSelected} />
              {selectedImages.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
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
                onSubmit={async (values) => {
                  const success = await handleSubmit(
                    values,
                    selectedImages,
                    editingHostel
                  )
                  if (success) {
                    setIsDialogOpen(false)
                    setEditingHostel(null)
                    setSelectedImages([])
                  }
                }}
                onCancel={() => setIsDialogOpen(false)}
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <HostelList
        hostels={hostels}
        onEdit={(hostel) => {
          setEditingHostel(hostel)
          setIsDialogOpen(true)
        }}
        onDelete={deleteHostel}
      />
    </div>
  )
}