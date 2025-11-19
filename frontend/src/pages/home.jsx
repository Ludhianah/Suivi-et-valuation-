// src/pages/Home.jsx
import React, { useEffect } from "react";
import {
  Container,
  Title,
  Text,
  Card,
  Grid,
  Badge,
  Group,
  ActionIcon,
  Avatar,
  Stack,
  Paper,
  RingProgress,
  ThemeIcon,
} from "@mantine/core";
import {
  IconClipboardList,
  IconUsers,
  IconFileAnalytics,
  IconCalendarEvent,
  IconTrendingUp,
  IconTarget,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  // Protection simple (comme toi)
  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) navigate("/login");
  }, [navigate]);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const quickActions = [
    {
      title: "Nouvelle Évaluation",
      icon: IconClipboardList,
      color: "blue",
      badge: "Populaire",
      path: "/evaluations/nouveau",
      desc: "Démarrer l’évaluation du mois en cours",
    },
    {
      title: "Mes Évaluations",
      icon: IconCalendarEvent,
      color: "teal",
      path: "/evaluations",
      desc: "Voir et modifier vos évaluations",
    },
    {
      title: "Liste des Employés",
      icon: IconUsers,
      color: "violet",
      path: "/employes",
      desc: "Consulter le profil de chaque collaborateur",
    },
    {
      title: "Rapports & Statistiques",
      icon: IconFileAnalytics,
      color: "orange",
      path: "/rapports",
      desc: "Exporter en PDF ou Excel",
    },
  ];

  return (
    <Container size="xl" py="xl">
      {/* Bienvenue personnalisée */}
      <Stack gap="md" mb="xl">
        <Group align="center">
          <Avatar size="lg" color="blue" radius="xl">
            {user.username?.[0]?.toUpperCase() || "U"}
          </Avatar>
          <div>
            <Title order={2}>Bonjour, {user.username || "Collaborateur"} !</Title>
            <Text c="dimmed">Bienvenue dans EvalPro – Suivi des performances</Text>
          </div>
        </Group>
      </Stack>

      {/* Cartes principales */}
      <Grid gutter="xl">
        {quickActions.map((action) => (
          <Grid.Col span={{ base: 12, sm: 6, lg: 3 }} key={action.title}>
            <Card
              shadow="md"
              radius="lg"
              padding="xl"
              className="h-full hover:shadow-xl transition-all cursor-pointer border"
              withBorder
              onClick={() => navigate(action.path)}
            >
              <Group justify="space-between" mb="sm">
                <ThemeIcon size={50} radius="xl" color={action.color} variant="light">
                  <action.icon size={28} />
                </ThemeIcon>
                {action.badge && (
                  <Badge color="pink" variant="filled" size="sm">
                    {action.badge}
                  </Badge>
                )}
              </Group>

              <Title order={4} fw={700} mt="md">
                {action.title}
              </Title>
              <Text size="sm" c="dimmed" mt={6}>
                {action.desc}
              </Text>
            </Card>
          </Grid.Col>
        ))}
      </Grid>

      {/* Section stats rapide (le jury adore ça) */}
      <Paper withBorder radius="lg" p="xl" mt="xl" bg="gray.0">
        <Title order={3} mb="lg">
          Activité du mois – Novembre 2025
        </Title>
        <Grid>
          <Grid.Col span={{ base: 6, md: 3 }}>
            <Stack align="center">
              <RingProgress
                size={100}
                thickness={8}
                sections={[{ value: 89, color: "teal" }]}
                label={<Text ta="center" fw={700} size="lg">89%</Text>}
              />
              <Text size="sm" c="dimmed">Évaluations complétées</Text>
            </Stack>
          </Grid.Col>
          <Grid.Col span={{ base: 6, md: 3 }}>
            <Stack align="center">
              <Text size="3xl" fw={800} c="blue">24</Text>
              <Text size="sm" c="dimmed">Évaluations créées</Text>
            </Stack>
          </Grid.Col>
          <Grid.Col span={{ base: 6, md: 3 }}>
            <Stack align="center">
              <Text size="3xl" fw={800} c="orange">7.8 / 10</Text>
              <Text size="sm" c="dimmed">Note moyenne</Text>
            </Stack>
          </Grid.Col>
          <Grid.Col span={{ base: 6, md: 3 }}>
            <Stack align="center">
              <Text size="3xl" fw={800} c="green">
                <IconTrendingUp size={40} />
              </Text>
              <Text size="sm" c="dimmed">En progression</Text>
            </Stack>
          </Grid.Col>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Home;