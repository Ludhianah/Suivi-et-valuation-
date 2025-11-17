import { useEffect, useState } from "react";
import {
  Table,
  Paper,
  Title,
  LoadingOverlay,
  Card,
  Text,
  Group,
  Badge,
  Divider,
} from "@mantine/core";
import { IconUser, IconChartBar, IconInfoCircle } from "@tabler/icons-react";
import { getEvaluations } from "../services/evaluationService";

const Evaluation = () => {
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getEvaluations();
      setEvaluations(Array.isArray(data) ? data : data.results || []);
    } catch (error) {
      console.error("Erreur chargement :", error);
      setEvaluations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Paper
      withBorder
      shadow="sm"
      p="md"
      className="min-h-screen bg-gray-50 p-4"
    >
      <LoadingOverlay visible={loading} overlayBlur={2} />
      <Title order={2} className="mb-6 text-gray-800 flex items-center gap-2">
        <IconChartBar size={24} />
        Évaluations
      </Title>

      <div className="overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-200">
        <Table striped highlightOnHover withTableBorder>
          <Table.Thead>
            <Table.Tr>
              <Table.Th className="font-semibold text-gray-700">Année</Table.Th>
              <Table.Th className="font-semibold text-gray-700">Mois</Table.Th>
              <Table.Th className="font-semibold text-gray-700">Employé</Table.Th>
              <Table.Th className="font-semibold text-gray-700">Note Globale</Table.Th>
              <Table.Th className="font-semibold text-gray-700">Détails Savoir-Faire</Table.Th>
              <Table.Th className="font-semibold text-gray-700">Détails Savoir-Être</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {evaluations.length > 0 ? (
              evaluations.map((evalItem, index) => (
                <Table.Tr key={index} className="hover:bg-gray-50 transition-colors">
                  <Table.Td>{evalItem.annee}</Table.Td>
                  <Table.Td>{evalItem.mois_display}</Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <IconUser size={16} />
                      <Text>{evalItem.nom_employe}</Text>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Badge
                      color={
                        evalItem.note_globale >= 80
                          ? "green"
                          : evalItem.note_globale >= 50
                          ? "yellow"
                          : "red"
                      }
                      variant="light"
                    >
                      {evalItem.note_globale}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    {evalItem.id_detail_sf ? (
                      <Card withBorder shadow="sm" p="xs" className="bg-gray-50">
                        <Text size="sm" fw={600} className="flex items-center gap-1 mb-1">
                          <IconInfoCircle size={14} />
                          {evalItem.id_detail_sf.nom_indicateur}
                        </Text>
                        <Divider my="xs" />
                        <Text size="xs" c="dimmed">
                          <Text span fw={500}>Poids :</Text> {evalItem.id_detail_sf.poids}%
                        </Text>
                        <Text size="xs" c="dimmed">
                          <Text span fw={500}>Note :</Text> {evalItem.id_detail_sf.note}
                        </Text>
                        <Text size="xs" c="dimmed">
                          <Text span fw={500}>Note pondérée :</Text> {evalItem.id_detail_sf.note_ponderee}
                        </Text>
                        <Text size="xs" c="dimmed" mt="xs">
                          <Text span fw={500}>Commentaire :</Text> {evalItem.id_detail_sf.commentaire}
                        </Text>
                      </Card>
                    ) : (
                      <Text size="xs" c="gray">Aucun détail</Text>
                    )}
                  </Table.Td>
                  <Table.Td>
                    {evalItem.id_detail_se ? (
                      <Card withBorder shadow="sm" p="xs" className="bg-gray-50">
                        <Text size="sm" fw={600} className="flex items-center gap-1 mb-1">
                          <IconInfoCircle size={14} />
                          {evalItem.id_detail_se.nom_indicateur}
                        </Text>
                        <Divider my="xs" />
                        <Text size="xs" c="dimmed">
                          <Text span fw={500}>Poids :</Text> {evalItem.id_detail_se.poids}%
                        </Text>
                        <Text size="xs" c="dimmed">
                          <Text span fw={500}>Note :</Text> {evalItem.id_detail_se.note}
                        </Text>
                        <Text size="xs" c="dimmed">
                          <Text span fw={500}>Note pondérée :</Text> {evalItem.id_detail_se.note_ponderee}
                        </Text>
                        <Text size="xs" c="dimmed" mt="xs">
                          <Text span fw={500}>Commentaire :</Text> {evalItem.id_detail_se.commentaire}
                        </Text>
                      </Card>
                    ) : (
                      <Text size="xs" c="gray">Aucun détail</Text>
                    )}
                  </Table.Td>
                </Table.Tr>
              ))
            ) : (
              <Table.Tr>
                <Table.Td colSpan={6} align="center" className="py-4 text-gray-500">
                  Aucune évaluation trouvée
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </div>
    </Paper>
  );
};

export default Evaluation;
