import { useEffect, useState } from "react";
import axios from "axios";
import { IUser } from "../../Interface/user";
import toast, { Toaster } from "react-hot-toast";

interface IProps {
  currentUserId: string | null;
  setCurrentUserId: (id: string | null) => void;
}

const EditUser = ({ currentUserId, setCurrentUserId }: IProps) => {
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<IUser | null>(null);

  useEffect(() => {
    if (currentUserId) {
      const fetchUser = async () => {
        try {
          const endpoint = import.meta.env.VITE_BACKEND_URL;
          const { data } = await axios.get<IUser>(
            `${endpoint}/users/${currentUserId}`
          );
          setCurrentUser(data);
          setFormData(data); 
        } catch (err) {
          setError("Failed to fetch user data");
        }
      };
      fetchUser();
    }
  }, [currentUserId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData?.name || !formData?.surname || !formData?.email) {
      toast.error("All fields are required!"); 
      return; 
    }

    if (formData && currentUserId) {
      try {
        const endpoint = import.meta.env.VITE_BACKEND_URL;
        const res = await axios.put(
          `${endpoint}/users/${currentUserId}`,
          formData
        );
        if (res.status === 200 && res.statusText === "OK") {
          setCurrentUserId(null); 
          setCurrentUser(null); 
          toast.success("User updated successfully!");
        }
      } catch (err) {
        setError("Failed to update user data");
      }
    }
  };

  const handleCancel = () => {
    setCurrentUserId(null); 
    setCurrentUser(null); 
    setFormData(null); 
  };

  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2 className="text-center p-4 text-2xl font-bold">Edit User</h2>
      {currentUser && (
        <form onSubmit={handleSubmit}>
          <div className="p-4">
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={formData?.name || ""}
              onChange={handleInputChange}
              className="block w-full p-2 border"
            />
          </div>
          <div className="p-4">
            <label>Surname:</label>
            <input
              type="text"
              name="surname"
              value={formData?.surname || ""}
              onChange={handleInputChange}
              className="block w-full p-2 border"
            />
          </div>
          <div className="p-4">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData?.email || ""}
              onChange={handleInputChange}
              className="block w-full p-2 border"
            />
          </div>
          <div className="p-4">
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded mr-2"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-500 text-white p-2 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
      <Toaster position="top-right" />
    </div>
  );
};

export default EditUser;
