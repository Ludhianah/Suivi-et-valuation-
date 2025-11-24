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
  Paper,
} from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";

import { getIndicateurSF, addIndicateurSF} from "../services/indicateurSFService";
import { getIndicateursSE, addIndicateurSE } from "../services/indicateurSEService";

const Indicateurs = () => {
  // --------------------- STATES SF ----------------------
  const [sf, setSf] = useState([]);
  const [loadingSF, setLoadingSF] = useState(false);
  const [openModalSF, setOpenModalSF] = useState(false);

  const [sfNom, setSfNom] = useState("");
  const [sfDescription, setSfDescription] = useState("");
  const [sfUnite, setSfUnite] = useState("");

  // --------------------- STATES SE ----------------------
  const [se, setSe] = useState([]);
  const [loadingSE, setLoadingSE] = useState(false);
  const [openModalSE, setOpenModalSE] = useState(false);

  const [seNom, setSeNom] = useState("");
  const [seDescription, setSeDescription] = useState("");

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

  // ---------------------- ADD SF -----------------------
  const handleAddSF = async () => {
    if (!sfNom.trim()) return;

    try {
      await addIndicateurSF({
        nom_indicateur: sfNom,
        description: sfDescription,
        unite_mesure: sfUnite,
      });

      setOpenModalSF(false);
      setSfNom("");
      setSfDescription("");
      setSfUnite("");
      loadSF();
    } catch (error) {
      console.error("Erreur ajout indicateur SF :", error);
    }
  };

  // ---------------------- ADD SE -----------------------
  const handleAddSE = async () => {
    if (!seNom.trim()) return;

    try {
      await addIndicateurSE({
        nom_indicateur: seNom,
        description: seDescription,
      });

      setOpenModalSE(false);
      setSeNom("");
      setSeDescription("");
      loadSE();
    } catch (error) {
      console.error("Erreur ajout indicateur SE :", error);
    }
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
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>
            {sf.length > 0 ? (
              sf.map((item) => (
                <Table.Tr key={item.id}>
                  <Table.Td>{item.nom_indicateur}</Table.Td>
                  <Table.Td>{item.description}</Table.Td>
                  <Table.Td>{item.unite_mesure || "-"}</Table.Td>
                </Table.Tr>
              ))
            ) : (
              <Table.Tr>
                <Table.Td colSpan={3} align="center">
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
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>
            {se.length > 0 ? (
              se.map((item) => (
                <Table.Tr key={item.id}>
                  <Table.Td>{item.nom_indicateur}</Table.Td>
                  <Table.Td>{item.description}</Table.Td>
                </Table.Tr>
              ))
            ) : (
              <Table.Tr>
                <Table.Td colSpan={2} align="center">
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
        onClose={() => setOpenModalSF(false)}
        title={<Title order={4}>Ajouter un indicateur SF</Title>}
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
              onClick={handleAddSF}
              className="bg-blue-600 text-white"
            >
              Enregistrer
            </Button>
          </Group>
        </div>
      </Modal>

      {/* -------------------- MODAL SE --------------------- */}
      <Modal
        opened={openModalSE}
        onClose={() => setOpenModalSE(false)}
        title={<Title order={4}>Ajouter un indicateur SE</Title>}
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
              onClick={handleAddSE}
              className="bg-blue-600 text-white"
            >
              Enregistrer
            </Button>
          </Group>
        </div>
      </Modal>
    </div>
  );
};

export default Indicateurs;
