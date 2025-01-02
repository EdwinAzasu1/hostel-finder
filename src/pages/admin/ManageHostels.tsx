import React, { useState } from "react"
import { HostelForm } from "@/components/admin/HostelForm"
import { ImageUpload } from "@/components/admin/ImageUpload"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function ManageHostels() {
  const [selectedImages, setSelectedImages] = useState<File[]>([])

  const handleImagesSelected = (files: File[]) => {
    setSelectedImages(files)
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Hostels</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add New Hostel
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Add New Hostel</DialogTitle>
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
              <HostelForm />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Hostel list will be added here */}
      <div className="grid gap-6">
        <p className="text-center text-gray-500">No hostels added yet</p>
      </div>
    </div>
  )
}