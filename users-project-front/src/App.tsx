import { useState } from "react";
import EditUser from "./Components/EditUser";
import Users from "./Components/Users";

const App = () => {
  const [currentUserId, setCurrentUserId] = useState<null | string>(null);
  return (
    <div className="grid grid-cols-[1fr_2fr]">
      <Users
        currentUserId={currentUserId}
        setCurrentUserId={setCurrentUserId}
      />
      <EditUser
        currentUserId={currentUserId}
        setCurrentUserId={setCurrentUserId}
      />
    </div>
  );
};

export default App;
