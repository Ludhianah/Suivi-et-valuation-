import "@mantine/core/styles.css"; // Importer le style de base de Mantine
import { MantineProvider } from "@mantine/core"; // Fournisseur de thème Mantine
import { shadcnCssVariableResolver } from "./cssVariableResolver.ts"; // Résolveur de variables CSS personnalisé utilisé par Mantine Hub
import { shadcnTheme } from "./theme.ts"; // Thème personnalisé utilisé par Mantine Hub
import "./styles.css"; // Importer les styles globaux personnalisés
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
