import React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { HostelType } from "./HostelTypeSelect"
import { Badge } from "@/components/ui/badge"

export interface Hostel {
  id: string
  name: string
  price: string
  roomTypes: HostelType[]
  ownerName: string
  ownerContact: string
  description?: string
  images?: File[]
}

interface HostelListProps {
  hostels: Hostel[]
  onEdit: (hostel: Hostel) => void
  onDelete: (id: string) => void
}

export function HostelList({ hostels, onEdit, onDelete }: HostelListProps) {
  const { toast } = useToast()

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this hostel?")) {
      onDelete(id)
      toast({
        title: "Hostel deleted",
        description: "The hostel has been successfully deleted.",
      })
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Hostel Name</TableHead>
            <TableHead>Room Types</TableHead>
            <TableHead>Price (GH₵)</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {hostels.map((hostel) => (
            <TableRow key={hostel.id}>
              <TableCell className="font-medium">{hostel.name}</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {hostel.roomTypes.map((type) => (
                    <Badge key={type} variant="secondary">
                      {type}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell>{hostel.price}</TableCell>
              <TableCell>{hostel.ownerName}</TableCell>
              <TableCell>{hostel.ownerContact}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onEdit(hostel)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDelete(hostel.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}