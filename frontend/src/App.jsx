import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { shadcnCssVariableResolver } from "./cssVariableResolver.ts";
import { shadcnTheme } from "./theme.ts";
import "./styles.css";
import { useState } from "react";
import UserForm from "./components/users/user-create.jsx";
import UserList from "./components/users/user-list.jsx";

export default function App() {
  const [users, setUsers] = useState([]);

  const addUser = (newUser) => {
    setUsers((prev) => [...prev, newUser]);
  };

  return (
    <>
      <MantineProvider
        theme={shadcnTheme}
        cssVariablesResolver={shadcnCssVariableResolver}
      >
        <div style={{ maxWidth: 600, margin: "40px auto" }}>
          <UserForm onAddUser={addUser} />
          <div style={{ marginTop: 30 }}>
            <UserList users={users} />
          </div>
        </div>
      </MantineProvider>
    </>
  );
}
