// src/pages/Indicateurs.jsx
import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Group,
  Title,
  Modal,
  LoadingOverlay,
  rem,
  ActionIcon,
} from "@mantine/core";
import { IconPlus, IconEdit, IconTrash } from "@tabler/icons-react";

// --- Import toast ---
import toast, { Toaster } from "react-hot-toast";
// --- Import modal ---
import IndicateurModal from "../components/IndicateurModal";

import {
  getIndicateurSF,
  addIndicateurSF,
  updateIndicateurSF,
  deleteIndicateurSF,
} from "../services/indicateurSFService";

import {
  getIndicateursSE,
  addIndicateurSE,
  updateIndicateurSE,
  deleteIndicateurSE,
} from "../services/indicateurSEService";

const Indicateurs = () => {
  // --------------------- STATES SF ----------------------
  const [sf, setSf] = useState([]);
  const [loadingSF, setLoadingSF] = useState(false);
  const [openModalSF, setOpenModalSF] = useState(false);
  const [sfNom, setSfNom] = useState("");
  const [sfDescription, setSfDescription] = useState("");
  const [sfUnite, setSfUnite] = useState("");
  const [editingSF, setEditingSF] = useState(null);

  // --------------------- STATES SE ----------------------
  const [se, setSe] = useState([]);
  const [loadingSE, setLoadingSE] = useState(false);
  const [openModalSE, setOpenModalSE] = useState(false);
  const [seNom, setSeNom] = useState("");
  const [seDescription, setSeDescription] = useState("");
  const [editingSE, setEditingSE] = useState(null);

  // --------------------- CONFIRM DELETE -----------------
  const [openConfirm, setOpenConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState({ type: "", id: null });

  const confirmDelete = (type, id) => {
    setDeleteTarget({ type, id });
    setOpenConfirm(true);
  };

  const handleConfirmDelete = async () => {
    const { type, id } = deleteTarget;

    try {
      if (type === "SF") {
        await deleteIndicateurSF(id);
        loadSF();
        toast.success("Indicateur SF supprimé avec succès !");
      } else if (type === "SE") {
        await deleteIndicateurSE(id);
        loadSE();
        toast.success("Indicateur SE supprimé avec succès !");
      }
    } catch (error) {
      console.error("Erreur suppression indicateur :", error);
      toast.error("Erreur lors de la suppression de l'indicateur");
    } finally {
      setOpenConfirm(false);
      setDeleteTarget({ type: "", id: null });
    }
  };

  // ---------------------- LOAD DATA ---------------------
  useEffect(() => {
    loadSF();
    loadSE();
  }, []);

  const loadSF = async () => {
    setLoadingSF(true);
    try {
      const data = await getIndicateurSF();
      setSf(data);
    } catch (error) {
      console.error("Erreur récupération indicateurs SF :", error);
      toast.error("Erreur récupération indicateurs SF");
    } finally {
      setLoadingSF(false);
    }
  };

  const loadSE = async () => {
    setLoadingSE(true);
    try {
      const data = await getIndicateursSE();
      setSe(data);
    } catch (error) {
      console.error("Erreur récupération indicateurs SE :", error);
      toast.error("Erreur récupération indicateurs SE");
    } finally {
      setLoadingSE(false);
    }
  };

  // ---------------------- SF HANDLERS ----------------------
  const handleAddSF = async () => {
    if (!sfNom.trim()) return;
    try {
      await addIndicateurSF({
        nom_indicateur: sfNom,
        description: sfDescription,
        unite_mesure: sfUnite,
      });
      resetSFModal();
      loadSF();
      toast.success("Indicateur SF ajouté avec succès !");
    } catch (error) {
      console.error("Erreur ajout indicateur SF :", error);
      toast.error("Erreur lors de l'ajout de l'indicateur SF");
    }
  };

  const handleEditSF = (item) => {
    setEditingSF(item);
    setSfNom(item.nom_indicateur);
    setSfDescription(item.description);
    setSfUnite(item.unite_mesure || "");
    setOpenModalSF(true);
  };

  const handleUpdateSF = async () => {
    if (!sfNom.trim() || !editingSF) return;
    try {
      await updateIndicateurSF(editingSF.id, {
        nom_indicateur: sfNom,
        description: sfDescription,
        unite_mesure: sfUnite,
      });
      resetSFModal();
      loadSF();
      toast.success("Indicateur SF mis à jour avec succès !");
    } catch (error) {
      console.error("Erreur mise à jour indicateur SF :", error);
      toast.error("Erreur lors de la mise à jour de l'indicateur SF");
    }
  };

  const resetSFModal = () => {
    setOpenModalSF(false);
    setEditingSF(null);
    setSfNom("");
    setSfDescription("");
    setSfUnite("");
  };

  // ---------------------- SE HANDLERS ----------------------
  const handleAddSE = async () => {
    if (!seNom.trim()) return;
    try {
      await addIndicateurSE({
        nom_indicateur: seNom,
        description: seDescription,
      });
      resetSEModal();
      loadSE();
      toast.success("Indicateur SE ajouté avec succès !");
    } catch (error) {
      console.error("Erreur ajout indicateur SE :", error);
      toast.error("Erreur lors de l'ajout de l'indicateur SE");
    }
  };

  const handleEditSE = (item) => {
    setEditingSE(item);
    setSeNom(item.nom_indicateur);
    setSeDescription(item.description);
    setOpenModalSE(true);
  };

  const handleUpdateSE = async () => {
    if (!seNom.trim() || !editingSE) return;
    try {
      await updateIndicateurSE(editingSE.id, {
        nom_indicateur: seNom,
        description: seDescription,
      });
      resetSEModal();
      loadSE();
      toast.success("Indicateur SE mis à jour avec succès !");
    } catch (error) {
      console.error("Erreur mise à jour indicateur SE :", error);
      toast.error("Erreur lors de la mise à jour de l'indicateur SE");
    }
  };

  const resetSEModal = () => {
    setOpenModalSE(false);
    setEditingSE(null);
    setSeNom("");
    setSeDescription("");
  };

  return (
    <div className="min-h-screen bg-white p-6 space-y-14">
      {/* Toaster pour les notifications */}
      <Toaster position="top-right" reverseOrder={false} />

      <Title order={2} className="text-gray-800 font-medium mb-4">
        Gestion des Indicateurs
      </Title>

      {/* ====================== SF SECTION =========================== */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <Title order={3} className="text-gray-800 font-medium">
            Indicateurs de Savoir-Faire
          </Title>
          <Button
            onClick={() => setOpenModalSF(true)}
            leftSection={<IconPlus size={16} />}
            className="bg-blue-600 hover:bg-blue-700 text-white"
            radius="md"
          >
            Ajouter
          </Button>
        </div>

        <LoadingOverlay visible={loadingSF} overlayBlur={2} />

        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Nom</Table.Th>
              <Table.Th>Description</Table.Th>
              <Table.Th>Unité</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>
            {sf.length > 0 ? (
              sf.map((item) => (
                <Table.Tr key={item.id}>
                  <Table.Td>{item.nom_indicateur}</Table.Td>
                  <Table.Td>{item.description}</Table.Td>
                  <Table.Td>{item.unite_mesure || "-"}</Table.Td>
                  <Table.Td>
                    <Group spacing="xs">
                      <ActionIcon
                        variant="subtle"
                        color="blue"
                        onClick={() => handleEditSF(item)}
                      >
                        <IconEdit style={{ width: rem(16), height: rem(16) }} />
                      </ActionIcon>

                      <ActionIcon
                        variant="subtle"
                        color="red"
                        onClick={() => confirmDelete("SF", item.id)}
                      >
                        <IconTrash style={{ width: rem(16), height: rem(16) }} />
                      </ActionIcon>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))
            ) : (
              <Table.Tr>
                <Table.Td colSpan={4} align="center">
                  Aucun indicateur SF trouvé
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </div>

      {/* ====================== SE SECTION =========================== */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <Title order={3} className="text-gray-800 font-medium">
            Indicateurs de Savoir-Être
          </Title>
          <Button
            onClick={() => setOpenModalSE(true)}
            leftSection={<IconPlus size={16} />}
            className="bg-blue-600 hover:bg-blue-700 text-white"
            radius="md"
          >
            Ajouter
          </Button>
        </div>

        <LoadingOverlay visible={loadingSE} overlayBlur={2} />

        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Nom</Table.Th>
              <Table.Th>Description</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>
            {se.length > 0 ? (
              se.map((item) => (
                <Table.Tr key={item.id}>
                  <Table.Td>{item.nom_indicateur}</Table.Td>
                  <Table.Td>{item.description}</Table.Td>
                  <Table.Td>
                    <Group spacing="xs">
                      <ActionIcon
                        variant="subtle"
                        color="blue"
                        onClick={() => handleEditSE(item)}
                      >
                        <IconEdit style={{ width: rem(16), height: rem(16) }} />
                      </ActionIcon>

                      <ActionIcon
                        variant="subtle"
                        color="red"
                        onClick={() => confirmDelete("SE", item.id)}
                      >
                        <IconTrash style={{ width: rem(16), height: rem(16) }} />
                      </ActionIcon>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))
            ) : (
              <Table.Tr>
                <Table.Td colSpan={3} align="center">
                  Aucun indicateur SE trouvé
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </div>

      {/* -------------------- MODALS --------------------- */}
      <IndicateurModal
        opened={openModalSF}
        onClose={resetSFModal}
        title={editingSF ? "Modifier un indicateur SF" : "Ajouter un indicateur SF"}
        nom={sfNom}
        setNom={setSfNom}
        description={sfDescription}
        setDescription={setSfDescription}
        unite={sfUnite}
        setUnite={setSfUnite}
        onSubmit={editingSF ? handleUpdateSF : handleAddSF}
        showUnite={true}
        submitText={editingSF ? "Mettre à jour" : "Enregistrer"}
      />

      <IndicateurModal
        opened={openModalSE}
        onClose={resetSEModal}
        title={editingSE ? "Modifier un indicateur SE" : "Ajouter un indicateur SE"}
        nom={seNom}
        setNom={setSeNom}
        description={seDescription}
        setDescription={setSeDescription}
        onSubmit={editingSE ? handleUpdateSE : handleAddSE}
        showUnite={false}
        submitText={editingSE ? "Mettre à jour" : "Enregistrer"}
      />

      {/* -------------------- CONFIRM DELETE MODAL --------------------- */}
      <Modal
        opened={openConfirm}
        onClose={() => setOpenConfirm(false)}
        title="Confirmation de suppression"
        centered
      >
        <p>Voulez-vous vraiment supprimer cet indicateur ?</p>
        <Group position="right" mt="md">
          <Button variant="outline" onClick={() => setOpenConfirm(false)}>
            Annuler
          </Button>
          <Button color="red" onClick={handleConfirmDelete}>
            Supprimer
          </Button>
        </Group>
      </Modal>
    </div>
  );
};

export default Indicateurs;
