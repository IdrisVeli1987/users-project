import { useEffect, useState } from "react";
import axios from "axios";
import { IUser } from "../../Interface/user";
import toast, { Toaster } from "react-hot-toast";
import { CgProfile } from "react-icons/cg";

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

  const userNumber = currentUser?.id ? parseInt(currentUser.id) + 1 : "";

  return (
    <div className="max-w-lg w-full mx-auto p-4 bg-white rounded-lg ">
      <h2 className="text-center text-2xl font-bold mb-4">Edit User</h2>
      {currentUser && (
        <>
          <span className="block text-lg font-semibold mb-2 border-4 border-indigo-500 pl-2">
            Пользователь {userNumber}
          </span>
          <form
            onSubmit={handleSubmit}
            className="flex justify-center flex-col w-full"
          >
            <div className="flex items-center gap-4">
              <div className="flex justify-center">
                <CgProfile className="text-blue-500 w-6 h-6 mr-2 flex" />
              </div>
              <label className="w-32 text-right">Должность:</label>
              <div className="flex items-center flex-1 border rounded p-2">
                <input
                  type="text"
                  name="name"
                  value={formData?.name || ""}
                  onChange={handleInputChange}
                  className="flex-1 outline-none"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <label className="w-32 text-right">Отдел:</label>
              <input
                type="text"
                name="surname"
                value={formData?.surname || ""}
                onChange={handleInputChange}
                className="flex-1 p-2 border rounded"
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="w-32 text-right">Компания:</label>
              <input
                type="text"
                name="email"
                value={formData?.email || ""}
                onChange={handleInputChange}
                className="flex-1 p-2 border rounded"
              />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                type="submit"
                className="bg-blue-500 text-white p-2 rounded"
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
        </>
      )}
      <Toaster position="top-right" />
    </div>
  );
};

export default EditUser;
