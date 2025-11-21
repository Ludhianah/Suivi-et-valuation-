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
    <div className="min-h-screen bg-white p-6">
      <LoadingOverlay visible={loading} overlayBlur={2} />

      {/* En-tête */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
        <Title order={2} className="text-gray-800 font-medium">
          Savoir-Être
        </Title>
        <Button
          onClick={() => {
            resetForm();
            setOpened(true);
          }}
          leftSection={<IconPlus size={16} />}
          className="bg-blue-600 hover:bg-blue-700 transition-colors text-white"
          radius="md"
        >
          Ajouter
        </Button>
      </div>

      {/* Tableau */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-200">
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th className="font-medium text-gray-600">Indicateur</Table.Th>
              <Table.Th className="font-medium text-gray-600">Poids (%)</Table.Th>
              <Table.Th className="font-medium text-gray-600 text-center">Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {savoirEtres.length > 0 ? (
              savoirEtres.map((se) => (
                <Table.Tr
                  key={se.id}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <Table.Td className="text-gray-700">{se.nom_indicateur}</Table.Td>
                  <Table.Td className="text-gray-700">{se.poids_pourcentage}</Table.Td>
                  <Table.Td className="text-center">
                    <Group spacing={0} position="center">
                      <ActionIcon
                        variant="subtle"
                        color="blue"
                        onClick={() => handleEdit(se)}
                        className="p-0 hover:bg-blue-50 transition-colors"
                      >
                        <IconEdit style={{ width: rem(16), height: rem(16) }} />
                      </ActionIcon>
                      <ActionIcon
                        variant="subtle"
                        color="red"
                        onClick={() => handleDeleteClick(se.id)}
                        className="p-0 hover:bg-red-50 transition-colors"
                      >
                        <IconTrash style={{ width: rem(16), height: rem(16) }} />
                      </ActionIcon>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))
            ) : (
              <Table.Tr>
                <Table.Td colSpan={3} align="center" className="py-6 text-gray-400">
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
        title={
          <Title order={4} className="text-gray-800 font-medium">
            {editId ? "Modifier le Savoir-Être" : "Ajouter un Savoir-Être"}
          </Title>
        }
        centered
        radius="md"
        shadow="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <TextInput
            label="Nom de l'indicateur"
            placeholder="Nom de l'indicateur"
            value={nomIndicateur}
            onChange={(e) => setNomIndicateur(e.target.value)}
            required
            className="w-full"
            radius="md"
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
            radius="md"
          />
          <Group justify="flex-end" mt="md">
            <Button
              type="button"
              variant="outline"
              onClick={resetForm}
              className="border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
              radius="md"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 transition-colors text-white"
              radius="md"
            >
              {editId ? "Modifier" : "Ajouter"}
            </Button>
          </Group>
        </form>
      </Modal>
    </div>
  );
};

export default SavoirEtre;
