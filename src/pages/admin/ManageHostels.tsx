import { useState } from "react";
import { Button } from "@/components/ui/button";
import { HostelForm } from "@/components/admin/HostelForm";
import { HostelList } from "@/components/admin/HostelList";
import { useHostelOperations } from "@/components/admin/useHostelOperations";
import type { HostelFormValues } from "@/components/admin/HostelForm";
import type { HostelUI } from "@/integrations/supabase/types/hostel";

export default function ManageHostels() {
  const [showForm, setShowForm] = useState(false);
  const [editingHostel, setEditingHostel] = useState<HostelFormValues | null>(null);
  const { hostels, fetchHostels, handleSubmit, deleteHostel } = useHostelOperations();

  const handleFormSubmit = async (values: HostelFormValues, images: File[]) => {
    const success = await handleSubmit(values, images, editingHostel as HostelUI);
    if (success) {
      setShowForm(false);
      setEditingHostel(null);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingHostel(null);
  };

  const handleEdit = (hostel: HostelUI) => {
    const formattedHostel: HostelFormValues = {
      name: hostel.name,
      price: hostel.price.toString(),
      description: hostel.description || "",
      ownerName: hostel.ownerName,
      ownerContact: hostel.ownerContact,
      roomTypes: hostel.roomTypes.map(rt => rt.room_type) as ("single" | "double" | "triple" | "quad" | "suite" | "apartment")[],
      roomPrices: Object.fromEntries(
        hostel.roomTypes.map(rt => [rt.room_type, rt.price.toString()])
      ),
    };
    setEditingHostel(formattedHostel);
    setShowForm(true);
  };

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Manage Hostels</h1>
        {!showForm && (
          <Button onClick={() => setShowForm(true)}>Add New Hostel</Button>
        )}
      </div>

      {showForm ? (
        <HostelForm
          initialData={editingHostel}
          onSubmit={handleFormSubmit}
          onCancel={handleCancel}
        />
      ) : (
        <HostelList
          hostels={hostels}
          onEdit={handleEdit}
          onDelete={deleteHostel}
          onRefresh={fetchHostels}
        />
      )}
    </div>
  );
}