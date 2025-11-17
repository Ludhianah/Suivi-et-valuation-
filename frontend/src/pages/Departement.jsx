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
} from "@mantine/core";
import { IconEdit, IconTrash } from "@tabler/icons-react";

// 🔹 Import des fonctions du service pour gérer les départements
import {
  getDepartements,
  createDepartement,
  updateDepartement,
  deleteDepartement,
} from "../services/departementService";

const Departement = () => {
  // 🔹 États du composant
  const [departements, setDepartements] = useState([]); // liste des départements
  const [nom, setNom] = useState(""); // nom du département en cours d'ajout/modification
  const [editId, setEditId] = useState(null); // id du département en modification
  const [opened, setOpened] = useState(false); // état du modal (ouvert/fermé)

  // 🔹 Fonction pour récupérer les départements depuis l'API
  const fetchData = async () => {
    try {
      const data = await getDepartements();
      setDepartements(data); // mise à jour du state avec les départements récupérés
    } catch (error) {
      console.error("Erreur chargement départements :", error);
    }
  };

  // 🔹 useEffect pour charger les départements au montage du composant
  useEffect(() => {
    fetchData();
  }, []);

  // 🔹 Fonction pour gérer l'ajout ou la modification d'un département
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nom.trim()) return; // éviter les noms vides

    try {
      if (editId) {
        // 🔸 Modification
        await updateDepartement(editId, { nom_departement: nom });
      } else {
        // 🔸 Ajout
        await createDepartement({ nom_departement: nom });
      }
      setNom(""); // réinitialisation du champ
      setEditId(null); // réinitialisation de l'état d'édition
      fetchData(); // recharger la liste
      setOpened(false); // fermer le modal
    } catch (error) {
      console.error("Erreur lors de la sauvegarde :", error);
    }
  };

  // 🔹 Préparer le modal pour la modification d'un département
  const handleEdit = (item) => {
    setEditId(item.id); // enregistrer l'id du département à modifier
    setNom(item.nom_departement); // remplir le champ avec le nom existant
    setOpened(true); // ouvrir le modal
  };

  // 🔹 Supprimer un département
  const handleDeleteClick = async (id) => {
    if (!window.confirm("Supprimer ce département ?")) return; // confirmation

    try {
      await deleteDepartement(id);
      fetchData(); // recharger la liste après suppression
    } catch (error) {
      console.error("Erreur suppression :", error);
    }
  };

  return (
    <div className="p-4">
      {/* Titre de la page */}
      <Title order={2} className="mb-4">Départements</Title>

      {/* Bouton pour ouvrir le modal d'ajout */}
      <Button
        onClick={() => {
          setEditId(null); // mode ajout
          setNom(""); // réinitialiser le champ
          setOpened(true); // ouvrir le modal
        }}
        className="mb-4 bg-blue-600 hover:bg-blue-700"
      >
        Ajouter un département
      </Button>

      {/* Modal pour ajouter ou modifier un département */}
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title={editId ? "Modifier le département" : "Ajouter un département"}
      >
        <form onSubmit={handleSubmit}>
          <TextInput
            label="Nom du département"
            placeholder="Nom du département"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            required
            className="mb-4"
          />
          <Group justify="flex-end" mt="md">
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              {editId ? "Modifier" : "Ajouter"}
            </Button>
          </Group>
        </form>
      </Modal>

      {/* Tableau affichant la liste des départements */}
      <Table striped highlightOnHover withTableBorder>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Département</Table.Th>
            <Table.Th>Créé le</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {departements.map((d) => (
            <Table.Tr key={d.id}>
              <Table.Td>{d.nom_departement}</Table.Td>
              <Table.Td>{new Date(d.date_creation).toLocaleDateString()}</Table.Td>
              <Table.Td>
                <Group gap="xs" justify="center">
                  {/* Bouton pour modifier */}
                  <ActionIcon variant="filled" color="yellow" onClick={() => handleEdit(d)}>
                    <IconEdit style={{ width: rem(16), height: rem(16) }} />
                  </ActionIcon>
                  {/* Bouton pour supprimer */}
                  <ActionIcon variant="filled" color="red" onClick={() => handleDeleteClick(d.id)}>
                    <IconTrash style={{ width: rem(16), height: rem(16) }} />
                  </ActionIcon>
                </Group>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </div>
  );
};

export default Departement;
