import { useEffect, useState } from "react";
import {
  Table,
  Button,
  TextInput,
  Group,
  Select,
  Title,
  ActionIcon,
  Modal,
  rem,
  LoadingOverlay,
} from "@mantine/core";
import { IconEdit, IconTrash, IconPlus } from "@tabler/icons-react";
import {
  getSavoirFaires,
  createSavoirFaire,
  updateSavoirFaire,
  deleteSavoirFaire,
} from "../services/savoirFaireService";
import { getDepartements } from "../services/departementService";
import { getIndicateurSF } from "../services/indicateurSFService";

const SavoirFaire = () => {
  const [savoirFaires, setSavoirFaires] = useState([]);
  const [departements, setDepartements] = useState([]);
  const [indicateurs, setIndicateurs] = useState([]);
  const [nomIndicateur, setNomIndicateur] = useState("");
  const [departementId, setDepartementId] = useState("");
  const [poids, setPoids] = useState("");
  const [objectif, setObjectif] = useState("");
  const [editId, setEditId] = useState(null);
  const [opened, setOpened] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [sfData, deptData, indicateurData] = await Promise.all([
        getSavoirFaires(),
        getDepartements(),
        getIndicateurSF(),
      ]);
      setSavoirFaires(Array.isArray(sfData) ? sfData : sfData.results || []);
      setDepartements(Array.isArray(deptData) ? deptData : deptData.results || []);
      setIndicateurs(Array.isArray(indicateurData) ? indicateurData : indicateurData.results || []);
    } catch (error) {
      console.error("Erreur chargement :", error);
      setSavoirFaires([]);
      setDepartements([]);
      setIndicateurs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nomIndicateur || !departementId || !poids || !objectif) return;
    setLoading(true);
    try {
      const payload = {
        id_departement: parseInt(departementId),
        id_indicateur_sf: parseInt(nomIndicateur),
        poids_pourcentage: parseFloat(poids),
        objectif: objectif,
      };
      if (editId) {
        await updateSavoirFaire(editId, payload);
      } else {
        await createSavoirFaire(payload);
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
    setDepartementId("");
    setPoids("");
    setObjectif("");
    setEditId(null);
    setOpened(false);
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setNomIndicateur(item.id_indicateur_sf.toString());
    setDepartementId(item.id_departement.toString());
    setPoids(item.poids_pourcentage);
    setObjectif(item.objectif);
    setOpened(true);
  };

  const handleDeleteClick = async (id) => {
    if (!window.confirm("Supprimer ce savoir-faire ?")) return;
    setLoading(true);
    try {
      await deleteSavoirFaire(id);
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
          Savoir-Faire
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
      <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th className="font-medium text-gray-600">Département</Table.Th>
              <Table.Th className="font-medium text-gray-600">Indicateur</Table.Th>
              <Table.Th className="font-medium text-gray-600">Objectif</Table.Th>
              <Table.Th className="font-medium text-gray-600">Poids (%)</Table.Th>
              <Table.Th className="font-medium text-gray-600 text-center">Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {savoirFaires.length > 0 ? (
              savoirFaires.map((sf) => (
                <Table.Tr
                  key={sf.id}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <Table.Td className="text-gray-700">{sf.nom_departement}</Table.Td>
                  <Table.Td className="text-gray-700">{sf.nom_indicateur}</Table.Td>
                  <Table.Td className="text-gray-700">{sf.objectif}</Table.Td>
                  <Table.Td className="text-gray-700">{sf.poids_pourcentage}</Table.Td>
                  <Table.Td className="text-center">
                    <Group spacing={0} position="center">
                      <ActionIcon
                        variant="subtle"
                        color="blue"
                        onClick={() => handleEdit(sf)}
                        className="p-0"
                      >
                        <IconEdit style={{ width: rem(16), height: rem(16) }} />
                      </ActionIcon>
                      <ActionIcon
                        variant="subtle"
                        color="red"
                        onClick={() => handleDeleteClick(sf.id)}
                        className="p-0"
                      >
                        <IconTrash style={{ width: rem(16), height: rem(16) }} />
                      </ActionIcon>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))
            ) : (
              <Table.Tr>
                <Table.Td colSpan={5} align="center" className="py-6 text-gray-400">
                  Aucun Savoir-Faire trouvé
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
            {editId ? "Modifier le Savoir-Faire" : "Ajouter un Savoir-Faire"}
          </Title>
        }
        centered
        radius="md"
        shadow="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <Select
            label="Département"
            placeholder="Choisir un département"
            data={departements.map((d) => ({
              value: d.id.toString(),
              label: d.nom_departement,
            }))}
            value={departementId}
            onChange={setDepartementId}
            required
            className="w-full"
            searchable
            radius="md"
          />
          <Select
            label="Indicateur"
            placeholder="Choisir un indicateur"
            data={indicateurs.map((i) => ({
              value: i.id.toString(),
              label: i.nom_indicateur,
            }))}
            value={nomIndicateur}
            onChange={setNomIndicateur}
            required
            className="w-full"
            searchable
            radius="md"
          />
          <TextInput
            label="Objectif"
            placeholder="Objectif du savoir-faire"
            value={objectif}
            onChange={(e) => setObjectif(e.target.value)}
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

export default SavoirFaire;
