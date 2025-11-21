// src/pages/Parametres.jsx
import React, { useState } from "react";
import {
  Container,
  Stack,
  Group,
  Avatar,
  Title,
  Text,
  Card,
  Switch,
  Select,
  TextInput,
  Button,
} from "@mantine/core";
import { IconUser, IconPalette, IconLanguage, IconBell } from "@tabler/icons-react";

const Parametres = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // États pour les préférences
  const [theme, setTheme] = useState("clair");
  const [langue, setLangue] = useState("fr");
  const [notifications, setNotifications] = useState(true);

  // États pour le profil
  const [nom, setNom] = useState(user.nom || "");
  const [email, setEmail] = useState(user.email || "");
  const [motDePasse, setMotDePasse] = useState("");

  const handleSave = () => {
    // Ici tu peux appeler ton backend pour sauvegarder
    console.log({ nom, email, motDePasse, theme, langue, notifications });
    alert("Paramètres sauvegardés !");
  };

  return (
    <Container size="lg" py="xl">
      <Stack gap="xl">
        {/* Profil utilisateur */}
        <Card shadow="md" radius="lg" padding="xl" withBorder>
          <Group align="center" mb="md">
            <Avatar size="lg" color="blue" radius="xl">
              {user.username?.[0]?.toUpperCase() || "U"}
            </Avatar>
            <div>
              <Title order={4}>Profil utilisateur</Title>
              <Text c="dimmed">Modifier vos informations personnelles</Text>
            </div>
          </Group>

          <TextInput
            label="Nom"
            value={nom}
            onChange={(e) => setNom(e.currentTarget.value)}
            className="my-2"
          />
          <TextInput
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
            className="my-2"
          />
          <TextInput
            label="Mot de passe"
            type="password"
            placeholder="••••••"
            value={motDePasse}
            onChange={(e) => setMotDePasse(e.currentTarget.value)}
            className="my-2"
          />
        </Card>

        {/* Préférences */}
        <Card shadow="md" radius="lg" padding="xl" withBorder>
          <Title order={4} mb="sm">
            Préférences
          </Title>

          <Group align="center" mb="md">
            <IconPalette size={24} />
            <Text>Thème :</Text>
            <Select
              value={theme}
              onChange={setTheme}
              data={[
                { value: "clair", label: "Clair" },
                { value: "sombre", label: "Sombre" },
              ]}
              className="ml-auto"
            />
          </Group>

          <Group align="center" mb="md">
            <IconLanguage size={24} />
            <Text>Langue :</Text>
            <Select
              value={langue}
              onChange={setLangue}
              data={[
                { value: "fr", label: "Français" },
                { value: "en", label: "English" },
              ]}
              className="ml-auto"
            />
          </Group>

          <Group align="center" mb="md">
            <IconBell size={24} />
            <Text>Notifications :</Text>
            <Switch
              checked={notifications}
              onChange={(event) => setNotifications(event.currentTarget.checked)}
              className="ml-auto"
            />
          </Group>
        </Card>

        <Button fullWidth mt="md" onClick={handleSave}>
          Sauvegarder
        </Button>
      </Stack>
    </Container>
  );
};

export default Parametres;
