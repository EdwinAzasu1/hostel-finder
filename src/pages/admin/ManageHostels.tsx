import { useState, useEffect } from "react";
import { HostelForm } from "@/components/admin/HostelForm";
import { HostelList } from "@/components/admin/HostelList";
import { useHostelOperations } from "@/components/admin/useHostelOperations";
import { HostelUI } from "@/integrations/supabase/types/hostel";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const ManageHostels = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingHostel, setEditingHostel] = useState<HostelUI | null>(null);
  const { hostels, fetchHostels, handleSubmit, deleteHostel } = useHostelOperations();
  const navigate = useNavigate();

  useEffect(() => {
    checkAdminStatus();
    fetchHostels();
  }, []);

  const checkAdminStatus = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/');
      return;
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', session.user.id)
      .single();

    if (!profile?.is_admin) {
      navigate('/');
    }
  };

  const handleEdit = (hostel: HostelUI) => {
    setEditingHostel(hostel);
    setShowForm(true);
  };

  const handleFormSubmit = async (values: any) => {
    const success = await handleSubmit(values, [], editingHostel);
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