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
import toast, { Toaster } from "react-hot-toast";

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

  // ⚠️ Modal de confirmation suppression
  const [deleteId, setDeleteId] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

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
      toast.error("Erreur lors du chargement des données !");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nomIndicateur || !departementId || !poids || !objectif) {
      toast.error("Veuillez remplir tous les champs !");
      return;
    }
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
        toast.success("Savoir-Faire modifié avec succès !");
      } else {
        await createSavoirFaire(payload);
        toast.success("Savoir-Faire ajouté avec succès !");
      }
      resetForm();
      fetchData();
    } catch (error) {
      console.error("Erreur sauvegarde :", error);
      toast.error("Erreur lors de la sauvegarde !");
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

  // ⚠️ Préparer la suppression
  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setDeleteModalOpen(true);
  };

  // ⚠️ Confirmer la suppression
  const confirmDelete = async () => {
    if (!deleteId) return;
    setLoading(true);
    try {
      await deleteSavoirFaire(deleteId);
      toast.success("Savoir-Faire supprimé !");
      fetchData();
    } catch (error) {
      console.error("Erreur suppression :", error);
      toast.error("Erreur lors de la suppression !");
    } finally {
      setLoading(false);
      setDeleteModalOpen(false);
      setDeleteId(null);
    }
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <Toaster position="top-right" reverseOrder={false} />
      <LoadingOverlay visible={loading} overlayBlur={2} />

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
              <Table.Th>Département</Table.Th>
              <Table.Th>Indicateur</Table.Th>
              <Table.Th>Objectif</Table.Th>
              <Table.Th>Poids (%)</Table.Th>
              <Table.Th className="text-center">Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {savoirFaires.length > 0 ? (
              savoirFaires.map((sf) => (
                <Table.Tr key={sf.id}>
                  <Table.Td>{sf.nom_departement}</Table.Td>
                  <Table.Td>{sf.nom_indicateur}</Table.Td>
                  <Table.Td>{sf.objectif}</Table.Td>
                  <Table.Td>{sf.poids_pourcentage}</Table.Td>
                  <Table.Td className="text-center">
                    <Group spacing={0} position="center">
                      <ActionIcon variant="subtle" color="blue" onClick={() => handleEdit(sf)} className="p-0">
                        <IconEdit style={{ width: rem(16), height: rem(16) }} />
                      </ActionIcon>
                      <ActionIcon variant="subtle" color="red" onClick={() => handleDeleteClick(sf.id)} className="p-0">
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

      {/* Modal ajout / modification */}
      <Modal
        opened={opened}
        onClose={resetForm}
        title={editId ? "Modifier le Savoir-Faire" : "Ajouter un Savoir-Faire"}
        centered
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <Select
            label="Département"
            placeholder="Choisir un département"
            data={departements.map((d) => ({ value: d.id.toString(), label: d.nom_departement }))}
            value={departementId}
            onChange={setDepartementId}
            required
          />
          <Select
            label="Indicateur"
            placeholder="Choisir un indicateur"
            data={indicateurs.map((i) => ({ value: i.id.toString(), label: i.nom_indicateur }))}
            value={nomIndicateur}
            onChange={setNomIndicateur}
            required
          />
          <TextInput label="Objectif" value={objectif} onChange={(e) => setObjectif(e.target.value)} required />
          <TextInput
            label="Poids (%)"
            value={poids}
            type="number"
            min="0"
            max="100"
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

      {/* Modal de confirmation suppression */}
      <Modal
        opened={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirmer la suppression"
        centered
      >
        <TextInput value="Voulez-vous vraiment supprimer ce Savoir-Faire ?" readOnly variant="unstyled" />
        <Group justify="flex-end" mt="md">
          <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
            Annuler
          </Button>
          <Button color="red" onClick={confirmDelete}>
            Supprimer
          </Button>
        </Group>
      </Modal>
    </div>
  );
};

export default SavoirFaire;
