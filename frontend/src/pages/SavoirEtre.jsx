import { useEffect, useState } from "react";
import {
  Table,
  Button,
  TextInput,
  Group,
  Title,
  ActionIcon,
  Modal,
  rem,
  Paper,
  LoadingOverlay,
} from "@mantine/core";
import { IconEdit, IconTrash, IconPlus } from "@tabler/icons-react";
import {
  getSavoirEtres,
  createSavoirEtre,
  updateSavoirEtre,
  deleteSavoirEtre,
} from "../services/savoirEtreService";

const SavoirEtre = () => {
  const [savoirEtres, setSavoirEtres] = useState([]);
  const [nomIndicateur, setNomIndicateur] = useState("");
  const [poids, setPoids] = useState("");
  const [editId, setEditId] = useState(null);
  const [opened, setOpened] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getSavoirEtres();
      setSavoirEtres(Array.isArray(data) ? data : data.results || []);
    } catch (error) {
      console.error("Erreur chargement :", error);
      setSavoirEtres([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nomIndicateur.trim() || !poids) return;
    setLoading(true);
    try {
      const payload = {
        id_indicateur_se: nomIndicateur,
        poids_pourcentage: parseFloat(poids),
      };
      if (editId) {
        await updateSavoirEtre(editId, payload);
      } else {
        await createSavoirEtre(payload);
      }
      resetForm();
      fetchData();
    } catch (error) {
      console.error("Erreur sauvegarde :", error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setNomIndicateur("");
    setPoids("");
    setEditId(null);
    setOpened(false);
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setNomIndicateur(item.id_indicateur_se);
    setPoids(item.poids_pourcentage);
    setOpened(true);
  };

  const handleDeleteClick = async (id) => {
    if (!window.confirm("Supprimer ce savoir-être ?")) return;
    setLoading(true);
    try {
      await deleteSavoirEtre(id);
      fetchData();
    } catch (error) {
      console.error("Erreur suppression :", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper withBorder shadow="sm" p="md" className="min-h-screen bg-gray-50 p-4">
      <LoadingOverlay visible={loading} overlayBlur={2} />

      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <Title order={2} className="text-gray-800">
          Savoir-Être
        </Title>
        <Button
          onClick={() => {
            resetForm();
            setOpened(true);
          }}
          leftSection={<IconPlus size={16} />}
          className="bg-blue-600 hover:bg-blue-700 transition-colors"
        >
          Ajouter
        </Button>
      </div>

      {/* Tableau */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-200">
        <Table striped highlightOnHover withTableBorder>
          <Table.Thead>
            <Table.Tr>
              <Table.Th className="font-semibold text-gray-700">Indicateur</Table.Th>
              <Table.Th className="font-semibold text-gray-700">Poids (%)</Table.Th>
              <Table.Th className="font-semibold text-gray-700">Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {savoirEtres.length > 0 ? (
              savoirEtres.map((se) => (
                <Table.Tr key={se.id} className="hover:bg-gray-50 transition-colors">
                  <Table.Td>{se.nom_indicateur}</Table.Td>
                  <Table.Td>{se.poids_pourcentage}</Table.Td>
                  <Table.Td>
                    <Group gap="xs" justify="center">
                      <ActionIcon
                        variant="filled"
                        color="yellow"
                        onClick={() => handleEdit(se)}
                        className="hover:scale-105 transition-transform"
                      >
                        <IconEdit style={{ width: rem(16), height: rem(16) }} />
                      </ActionIcon>
                      <ActionIcon
                        variant="filled"
                        color="red"
                        onClick={() => handleDeleteClick(se.id)}
                        className="hover:scale-105 transition-transform"
                      >
                        <IconTrash style={{ width: rem(16), height: rem(16) }} />
                      </ActionIcon>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))
            ) : (
              <Table.Tr>
                <Table.Td colSpan={3} align="center" className="py-4 text-gray-500">
                  Aucun Savoir-Être trouvé
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </div>

      {/* Modal */}
      <Modal
        opened={opened}
        onClose={resetForm}
        title={<Title order={4} className="text-gray-800">{editId ? "Modifier le Savoir-Être" : "Ajouter un Savoir-Être"}</Title>}
        centered
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <TextInput
            label="Nom de l'indicateur"
            placeholder="Nom de l'indicateur"
            value={nomIndicateur}
            onChange={(e) => setNomIndicateur(e.target.value)}
            required
            className="w-full"
          />
          <TextInput
            label="Poids (%)"
            placeholder="Poids en pourcentage"
            value={poids}
            onChange={(e) => setPoids(e.target.value)}
            required
            className="w-full"
            type="number"
            min="0"
            max="100"
          />
          <Group justify="flex-end" mt="md">
            <Button type="button" variant="outline" onClick={resetForm} className="border-gray-300 text-gray-700 hover:bg-gray-50">
              Annuler
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 transition-colors">
              {editId ? "Modifier" : "Ajouter"}
            </Button>
          </Group>
        </form>
      </Modal>
    </Paper>
  );
};

export default SavoirEtre;
