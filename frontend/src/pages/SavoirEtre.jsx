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
  LoadingOverlay,
  Select,
} from "@mantine/core";
import { IconEdit, IconTrash, IconPlus } from "@tabler/icons-react";

import {
  getSavoirEtres,
  createSavoirEtre,
  updateSavoirEtre,
  deleteSavoirEtre,
} from "../services/savoirEtreService";

// ⚠️ Correction ici : getIndicateursSE
import { getIndicateursSE } from "../services/indicateurSEService";

const SavoirEtre = () => {
  const [savoirEtres, setSavoirEtres] = useState([]);
  const [indicateurs, setIndicateurs] = useState([]);

  const [nomIndicateur, setNomIndicateur] = useState("");
  const [poids, setPoids] = useState("");
  const [editId, setEditId] = useState(null);
  const [opened, setOpened] = useState(false);
  const [loading, setLoading] = useState(false);

  // Charger les Savoir-Être
  const fetchSavoirEtre = async () => {
    try {
      setLoading(true);
      const data = await getSavoirEtres();
      setSavoirEtres(Array.isArray(data) ? data : data.results || []);
    } catch (error) {
      console.error("Erreur chargement :", error);
      setSavoirEtres([]);
    } finally {
      setLoading(false);
    }
  };

  // Charger les indicateurs SE
  const fetchIndicateurs = async () => {
    try {
      const data = await getIndicateursSE(); // ✔ correction ici
      setIndicateurs(Array.isArray(data) ? data : data.results || []);
    } catch (error) {
      console.error("Erreur chargement indicateurs :", error);
      setIndicateurs([]);
    }
  };

  useEffect(() => {
    fetchSavoirEtre();
    fetchIndicateurs();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nomIndicateur || !poids) return;

    setLoading(true);

    const payload = {
      id_indicateur_se: nomIndicateur,
      poids_pourcentage: parseFloat(poids),
    };

    try {
      if (editId) {
        await updateSavoirEtre(editId, payload);
      } else {
        await createSavoirEtre(payload);
      }
      resetForm();
      fetchSavoirEtre();
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
    setNomIndicateur(item.id_indicateur_se.toString());
    setPoids(item.poids_pourcentage.toString());
    setOpened(true);
  };

  const handleDeleteClick = async (id) => {
    if (!window.confirm("Supprimer ce savoir-être ?")) return;

    setLoading(true);
    try {
      await deleteSavoirEtre(id);
      fetchSavoirEtre();
    } catch (error) {
      console.error("Erreur suppression :", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <LoadingOverlay visible={loading} overlayBlur={2} />

      {/* Header */}
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
          className="bg-blue-600 hover:bg-blue-700 text-white"
          radius="md"
        >
          Ajouter
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-200">
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Indicateur</Table.Th>
              <Table.Th>Poids (%)</Table.Th>
              <Table.Th className="text-center">Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {savoirEtres.length > 0 ? (
              savoirEtres.map((se) => (
                <Table.Tr key={se.id}>
                  <Table.Td>{se.nom_indicateur}</Table.Td>
                  <Table.Td>{se.poids_pourcentage}</Table.Td>
                  <Table.Td className="text-center">
                    <Group spacing={0} position="center">
                      <ActionIcon variant="subtle" color="blue" onClick={() => handleEdit(se)}>
                        <IconEdit style={{ width: rem(16), height: rem(16) }} />
                      </ActionIcon>

                      <ActionIcon variant="subtle" color="red" onClick={() => handleDeleteClick(se.id)}>
                        <IconTrash style={{ width: rem(16), height: rem(16) }} />
                      </ActionIcon>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))
            ) : (
              <Table.Tr>
                <Table.Td colSpan={3} align="center">
                  Aucun Savoir-Être trouvé
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </div>

      {/* Modal */}
      <Modal opened={opened} onClose={resetForm} title={<Title order={4}>{editId ? "Modifier" : "Ajouter"}</Title>} centered>
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Select indicateur SE */}
          <Select
            label="Nom de l’indicateur"
            placeholder="Sélectionner un indicateur"
            data={indicateurs.map((i) => ({
              value: i.id.toString(),
              label: i.nom_indicateur,
            }))}
            value={nomIndicateur}
            onChange={setNomIndicateur}
            searchable
            required
          />

          {/* Poids */}
          <TextInput
            label="Poids (%)"
            type="number"
            min="0"
            max="100"
            value={poids}
            onChange={(e) => setPoids(e.target.value)}
            required
          />

          <Group justify="flex-end">
            <Button variant="outline" onClick={resetForm}>
              Annuler
            </Button>
            <Button type="submit" className="bg-blue-600 text-white">
              {editId ? "Modifier" : "Ajouter"}
            </Button>
          </Group>
        </form>
      </Modal>
    </div>
  );
};

export default SavoirEtre;
