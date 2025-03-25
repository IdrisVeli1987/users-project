import { useEffect, useState } from "react";
import axios from "axios";
import { FaUser } from "react-icons/fa";
import { IUser } from "../../Interface/user";

interface IProps {
  currentUserId: string | null;
  setCurrentUserId: (id: string | null) => void;
}

const Users: React.FC<IProps> = ({ currentUserId, setCurrentUserId }) => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axios.get<IUser[]>(
          `${import.meta.env.VITE_BACKEND_URL}/users`
        );
        setUsers(data);
      } catch {
        setError("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [currentUserId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <ul className="h-[100vh] overflow-auto">
      {users.map(({ id }, index) => (
        <li
          key={id}
          className="flex gap-4 items-center p-4 hover:bg-blue-100 cursor-pointer font-bold text-xl"
          onClick={() => setCurrentUserId(id)}
        >
          <FaUser className="text-blue-500" />
          <span>
            Пользователь {index + 1}
            {/* {name} {surname} - {email}  */}
          </span>
        </li>
      ))}
    </ul>
  );
};

export default Users;
