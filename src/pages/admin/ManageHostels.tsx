import { useState } from "react";
import { HostelForm } from "@/components/admin/HostelForm";
import { HostelList } from "@/components/admin/HostelList";
import { useHostelOperations } from "@/components/admin/useHostelOperations";
import { HostelUI } from "@/integrations/supabase/types/hostel";

const ManageHostels = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingHostel, setEditingHostel] = useState<HostelUI | null>(null);
  const { hostels, fetchHostels, handleSubmit, deleteHostel } = useHostelOperations();

  const handleEdit = (hostel: HostelUI) => {
    setEditingHostel(hostel);
    setShowForm(true);
  };

  const handleFormSubmit = async (values: any, selectedImages: File[]) => {
    const success = await handleSubmit(values, selectedImages, editingHostel);
    if (success) {
      setShowForm(false);
      setEditingHostel(null);
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Manage Hostels</h1>
        <button
          onClick={() => {
            setEditingHostel(null);
            setShowForm(true);
          }}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-md"
        >
          Add New Hostel
        </button>
      </div>

      {showForm ? (
        <HostelForm
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingHostel(null);
          }}
          initialData={editingHostel}
        />
      ) : (
        <HostelList
          hostels={hostels}
          onEdit={handleEdit}
          onDelete={deleteHostel}
        />
      )}
    </div>
  );
};

export default ManageHostels;