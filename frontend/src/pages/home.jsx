import React, { useEffect } from "react";
import { Button, Container, Title, Text, Card } from "@mantine/core";
import { IconLogout } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    // Conteneur principal en plein écran
    <div className="h-screen w-full bg-gray-50 flex flex-col items-center justify-center p-0 m-0">
      {/* Utilisation du composant Container de Mantine pour le contenu */}
      <Container size="md" className="text-center">
        <Title order={1} className="text-blue-600 mb-6">
          Suivi et Évaluation des Employés

        </Title>
        <Text size="lg" className="text-gray-700 mb-8">
         Consultez les performances de votre équipe et gérez les évaluations en temps réel.
        </Text>
        {/* Utilisation du composant Card de Mantine */}
        <Card shadow="sm" padding="lg" className="bg-white border border-gray-100">
          <Title order={2} className="text-gray-800 mb-3">
            Que faire maintenant ?
          </Title>
          <Text className="text-gray-600">
            Explore les sections disponibles dans le menu ou commence par personnaliser ton profil.
          </Text>
        </Card>
      </Container>
    </div>
  );
};

export default Home;
