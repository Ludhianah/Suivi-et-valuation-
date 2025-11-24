// src/components/IndicateurModal.jsx
import { Modal, TextInput, Group, Button, Title } from "@mantine/core";

const IndicateurModal = ({
  opened,
  onClose,
  title,
  nom,
  setNom,
  description,
  setDescription,
  unite,
  setUnite,
  onSubmit,
  showUnite = false,
  submitText = "Enregistrer",
}) => {
  return (
    <Modal opened={opened} onClose={onClose} title={<Title order={4}>{title}</Title>} centered>
      <div className="space-y-4">
        <TextInput
          label="Nom de l'indicateur"
          placeholder="Ex : Chiffre d'affaires"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          required
        />
        <TextInput
          label="Description"
          placeholder="Ex : Montant total des ventes"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {showUnite && (
          <TextInput
            label="Unité"
            placeholder="Ex : AR"
            value={unite}
            onChange={(e) => setUnite(e.target.value)}
          />
        )}
        <Group justify="flex-end">
          <Button className="bg-blue-600 text-white" onClick={onSubmit}>
            {submitText}
          </Button>
        </Group>
      </div>
    </Modal>
  );
};

export default IndicateurModal;
