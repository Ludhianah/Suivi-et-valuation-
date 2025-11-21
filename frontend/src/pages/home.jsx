// src/pages/Home.jsx
import React, { useEffect } from "react";
import {
  Container,
  Title,
  Text,
  Card,
  Grid,
  Group,
  Avatar,
  Stack,
  Paper,
  RingProgress,
  ThemeIcon,
} from "@mantine/core";
import {
  IconClipboardList,
  IconBook,
  IconUserCheck,
  IconBuilding,
  IconTrendingUp,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) navigate("/login");
  }, [navigate]);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // *** 4 CARTES, AVEC DEPARTEMENT AJOUTÉ ***
  const quickActions = [
    {
      title: "Savoir-Faire",
      icon: IconBook,
      color: "blue",
      path: "/savoir-faire",
      desc: "Compétences techniques et maîtrise des tâches.",
    },
    {
      title: "Savoir-Être",
      icon: IconUserCheck,
      color: "green",
      path: "/savoir-etre",
      desc: "Attitudes professionnelles et comportements valorisés.",
    },
    {
      title: "Évaluation",
      icon: IconClipboardList,
      color: "violet",
      path: "/evaluation",
      desc: "Résumé global des performances mensuelles.",
    },
    {
      title: "Département",
      icon: IconBuilding,
      color: "orange",
      path: "/departement",
      desc: "Gérer les départements et leur structure.",
    },
  ];

  return (
    <Container size="lg" py="xl">
      {/* Bienvenue */}
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
      <Grid justify="center" gutter="lg">
        {quickActions.map((action) => (
          <Grid.Col
            span={{ base: 12, sm: 6, lg: 3 }}
            key={action.title}
            style={{ display: "flex", justifyContent: "center" }} // CENTRER LES CARTES
          >
            <Card
              shadow="md"
              radius="lg"
              padding="xl"
              withBorder
              onClick={() => navigate(action.path)}
              className="hover:shadow-xl transition-all cursor-pointer"
              style={{
                width: "100%",
                maxWidth: "350px", // RÉTRÉCIT LES CARTES
              }}
            >
              <Group justify="space-between" mb="sm">
                <ThemeIcon size={50} radius="xl" color={action.color} variant="light">
                  <action.icon size={28} />
                </ThemeIcon>
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

      {/* Stats du mois */}
      <Paper withBorder radius="lg" p="xl" mt="xl" bg="white">
        <Title order={3} mb="lg">
          Activité du mois – Novembre 2025
        </Title>

        <Grid align="center">
          {/* 1 */}
          <Grid.Col span={{ base: 6, md: 3 }}>
            <Stack align="center" gap={4}>
              <RingProgress
                size={100}
                thickness={8}
                sections={[{ value: 89, color: "teal" }]}
                label={<Text ta="center" fw={700} size="lg">89%</Text>}
              />
              <Text size="sm" c="dimmed">Évaluations complétées</Text>
            </Stack>
          </Grid.Col>

          {/* 2 */}
          <Grid.Col span={{ base: 6, md: 3 }}>
            <Stack align="center" gap={4}>
              <Text size="3xl" fw={800} c="blue">24</Text>
              <Text size="sm" c="dimmed">Évaluations créées</Text>
            </Stack>
          </Grid.Col>

          {/* 3 */}
          <Grid.Col span={{ base: 6, md: 3 }}>
            <Stack align="center" gap={4}>
              <Text size="3xl" fw={800} c="orange">7.8 / 10</Text>
              <Text size="sm" c="dimmed">Note moyenne</Text>
            </Stack>
          </Grid.Col>

          {/* 4 */}
          <Grid.Col span={{ base: 6, md: 3 }}>
            <Stack align="center" gap={4}>
              <IconTrendingUp size={45} color="green" />
              <Text size="sm" c="dimmed">En progression</Text>
            </Stack>
          </Grid.Col>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Home;
