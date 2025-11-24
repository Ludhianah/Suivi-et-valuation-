// src/pages/Indicateurs.jsx
import { useEffect, useState } from "react";
import {
  Table,
  Button,
  TextInput,
  Group,
  Title,
  Modal,
  LoadingOverlay,
  rem,
  ActionIcon,
} from "@mantine/core";
import { IconPlus, IconEdit, IconTrash } from "@tabler/icons-react";

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
    } catch (error) {
      console.error("Erreur ajout indicateur SF :", error);
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
    } catch (error) {
      console.error("Erreur mise à jour indicateur SF :", error);
    }
  };

  const handleDeleteSF = async (id) => {
    if (!confirm("Voulez-vous vraiment supprimer cet indicateur SF ?")) return;
    try {
      await deleteIndicateurSF(id);
      loadSF();
    } catch (error) {
      console.error("Erreur suppression indicateur SF :", error);
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
    } catch (error) {
      console.error("Erreur ajout indicateur SE :", error);
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
    } catch (error) {
      console.error("Erreur mise à jour indicateur SE :", error);
    }
  };

  const handleDeleteSE = async (id) => {
    if (!confirm("Voulez-vous vraiment supprimer cet indicateur SE ?")) return;
    try {
      await deleteIndicateurSE(id);
      loadSE();
    } catch (error) {
      console.error("Erreur suppression indicateur SE :", error);
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
                        onClick={() => handleDeleteSF(item.id)}
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
                        onClick={() => handleDeleteSE(item.id)}
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

      {/* -------------------- MODAL SF --------------------- */}
      <Modal
        opened={openModalSF}
        onClose={resetSFModal}
        title={
          <Title order={4}>
            {editingSF ? "Modifier un indicateur SF" : "Ajouter un indicateur SF"}
          </Title>
        }
        centered
      >
        <div className="space-y-4">
          <TextInput
            label="Nom de l'indicateur"
            placeholder="Ex : Chiffre d'affaires"
            value={sfNom}
            onChange={(e) => setSfNom(e.target.value)}
            required
          />
          <TextInput
            label="Description"
            placeholder="Ex : Montant total des ventes"
            value={sfDescription}
            onChange={(e) => setSfDescription(e.target.value)}
          />
          <TextInput
            label="Unité"
            placeholder="Ex : AR"
            value={sfUnite}
            onChange={(e) => setSfUnite(e.target.value)}
          />

          <Group justify="flex-end">
            <Button
              onClick={editingSF ? handleUpdateSF : handleAddSF}
              className="bg-blue-600 text-white"
            >
              {editingSF ? "Mettre à jour" : "Enregistrer"}
            </Button>
          </Group>
        </div>
      </Modal>

      {/* -------------------- MODAL SE --------------------- */}
      <Modal
        opened={openModalSE}
        onClose={resetSEModal}
        title={
          <Title order={4}>
            {editingSE ? "Modifier un indicateur SE" : "Ajouter un indicateur SE"}
          </Title>
        }
        centered
      >
        <div className="space-y-4">
          <TextInput
            label="Nom de l'indicateur"
            placeholder="Ex : Capacité à travailler sans supervision"
            value={seNom}
            onChange={(e) => setSeNom(e.target.value)}
            required
          />
          <TextInput
            label="Description"
            placeholder="Ex : Capacité à travailler en autonomie"
            value={seDescription}
            onChange={(e) => setSeDescription(e.target.value)}
          />

          <Group justify="flex-end">
            <Button
              onClick={editingSE ? handleUpdateSE : handleAddSE}
              className="bg-blue-600 text-white"
            >
              {editingSE ? "Mettre à jour" : "Enregistrer"}
            </Button>
          </Group>
        </div>
      </Modal>
    </div>
  );
};

export default Indicateurs;
