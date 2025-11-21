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
  Box,
  Flex,
} from "@mantine/core";
import { IconEdit, IconTrash, IconPlus } from "@tabler/icons-react";
import {
  getDepartements,
  createDepartement,
  updateDepartement,
  deleteDepartement,
} from "../services/departementService";

const Departement = () => {
  const [departements, setDepartements] = useState([]);
  const [nom, setNom] = useState("");
  const [editId, setEditId] = useState(null);
  const [opened, setOpened] = useState(false);

  const fetchData = async () => {
    try {
      const data = await getDepartements();
      setDepartements(data);
    } catch (error) {
      console.error("Erreur chargement départements :", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nom.trim()) return;
    try {
      if (editId) {
        await updateDepartement(editId, { nom_departement: nom });
      } else {
        await createDepartement({ nom_departement: nom });
      }
      setNom("");
      setEditId(null);
      fetchData();
      setOpened(false);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde :", error);
    }
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setNom(item.nom_departement);
    setOpened(true);
  };

  const handleDeleteClick = async (id) => {
    if (!window.confirm("Supprimer ce département ?")) return;
    try {
      await deleteDepartement(id);
      fetchData();
    } catch (error) {
      console.error("Erreur suppression :", error);
    }
  };

  return (
    <Box className="p-6 bg-white min-h-screen">
      {/* En-tête avec titre et bouton "Ajouter" */}
      <Flex justify="space-between" align="center" mb="lg">
        <Title order={2} className="text-gray-800">
          Départements
        </Title>
        <Button
          onClick={() => {
            setEditId(null);
            setNom("");
            setOpened(true);
          }}
          leftSection={<IconPlus size={16} />}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Ajouter
        </Button>
      </Flex>

      {/* Tableau des départements */}
      <Box className="rounded-lg shadow-sm overflow-hidden">
        <Table striped highlightOnHover withTableBorder>
          <Table.Thead>
            <Table.Tr>
              <Table.Th className="font-semibold text-gray-700">Département</Table.Th>
              <Table.Th className="font-semibold text-gray-700">Créé le</Table.Th>
              <Table.Th
                className="font-semibold text-gray-700 text-center"
                style={{ textAlign: 'center', width: '120px' }}
              >
                Actions
              </Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {departements.map((d) => (
              <Table.Tr key={d.id}>
                <Table.Td>{d.nom_departement}</Table.Td>
                <Table.Td>{new Date(d.date_creation).toLocaleDateString()}</Table.Td>
                <Table.Td style={{ textAlign: 'center', width: '120px' }}>
                  <Group gap="xs" justify="center">
                   <ActionIcon
                        variant="subtle"
                        color="blue"
                        onClick={() => handleEdit(d)}
                        className="p-0 hover:bg-blue-50 transition-colors"
                      >
                        <IconEdit style={{ width: rem(16), height: rem(16) }} />
                      </ActionIcon>
                    <ActionIcon
                      variant="subtle"
                      color="red"
                      onClick={() => handleDeleteClick(d.id)}
                      className="hover:bg-red-100"
                    >
                      <IconTrash style={{ width: rem(16), height: rem(16) }} />
                    </ActionIcon>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Box>

      {/* Modal pour ajouter/modifier */}
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title={editId ? "Modifier le département" : "Ajouter un département"}
        centered
        overlayProps={{ opacity: 0.55, blur: 3 }}
      >
        <form onSubmit={handleSubmit}>
          <TextInput
            label="Nom du département"
            placeholder="Ex: Informatique"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            required
            className="mb-4"
          />
          <Group justify="flex-end" mt="md">
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {editId ? "Modifier" : "Ajouter"}
            </Button>
          </Group>
        </form>
      </Modal>
    </Box>
  );
};

export default Departement;
