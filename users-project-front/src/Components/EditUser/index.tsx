import { useEffect, useState } from "react";
import axios from "axios";
import { IUser } from "../../Interface/user";
import toast, { Toaster } from "react-hot-toast";

// Define the props interface with types for currentUserId and setCurrentUserId
interface IProps {
  currentUserId: string | null;
  setCurrentUserId: (id: string | null) => void;
}

// Define the EditUser component
const EditUser = ({ currentUserId, setCurrentUserId }: IProps) => {
  const [currentUser, setCurrentUser] = useState<IUser | null>(null); // Typed as IUser or null
  const [error, setError] = useState<string | null>(null); // Typed as string or null
  const [formData, setFormData] = useState<IUser | null>(null); // Typed as IUser or null

  // Fetch user data on currentUserId change
  useEffect(() => {
    if (currentUserId) {
      const fetchUser = async () => {
        try {
          const endpoint = import.meta.env.VITE_BACKEND_URL;
          const { data } = await axios.get<IUser>(
            `${endpoint}/users/${currentUserId}`
          );
          setCurrentUser(data);
          setFormData(data); // Pre-fill form data with fetched user
        } catch (err) {
          setError("Failed to fetch user data");
        }
      };
      fetchUser();
    }
  }, [currentUserId]);

  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  // Handle form submission (PUT request to update user data)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if any required fields are empty
    if (!formData?.name || !formData?.surname || !formData?.email) {
      toast.error("All fields are required!"); // Show toast error if any field is empty
      return; // Prevent submission if fields are empty
    }

    if (formData && currentUserId) {
      try {
        const endpoint = import.meta.env.VITE_BACKEND_URL;
        const res = await axios.put(
          `${endpoint}/users/${currentUserId}`,
          formData
        );
        if (res.status === 200 && res.statusText === "OK") {
          setCurrentUserId(null); // Reset userId after successful update
          setCurrentUser(null); // Reset current user data
          toast.success("User updated successfully!");
        }
      } catch (err) {
        setError("Failed to update user data");
      }
    }
  };

  // Cancel editing and reset currentUserId and formData
  const handleCancel = () => {
    setCurrentUserId(null); // Reset userId
    setCurrentUser(null); // Reset current user data
    setFormData(null); // Reset form data
  };

  // Show error message if an error occurs
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
      <Toaster position="top right" />
    </div>
  );
};

export default EditUser;
