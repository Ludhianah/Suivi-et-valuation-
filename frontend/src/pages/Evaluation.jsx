import { useEffect, useState } from "react";
import {
  Table,
  Title,
  LoadingOverlay,
  Card,
  Text,
  Group,
  Badge,
  Divider,
  Tooltip,
  rem,
  Button,
  Modal,
  Select,
  NumberInput,
  Textarea,
} from "@mantine/core";
import { IconUser, IconChartBar, IconInfoCircle, IconPlus } from "@tabler/icons-react";
import {
  getEvaluations,
  createEvaluation,
} from "../services/evaluationService";
import { getEmployes } from "../services/employeService";
import { getIndicateurSF } from "../services/indicateurSFService";
import { getIndicateursSE } from "../services/indicateurSEService";
import toast from "react-hot-toast";

const Evaluation = () => {
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modale
  const [opened, setOpened] = useState(false);

  // Formulaire état
  const [employes, setEmployes] = useState([]);
  const [mois, setMois] = useState("");
  const [annee, setAnnee] = useState("");
  const [selectedEmploye, setSelectedEmploye] = useState("");

  const [indicateursSF, setIndicateursSF] = useState([]);
  const [indicateursSE, setIndicateursSE] = useState([]);

  const [detailsSF, setDetailsSF] = useState({});
  const [detailsSE, setDetailsSE] = useState({});

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getEvaluations();
      setEvaluations(Array.isArray(data) ? data : data.results || []);
    } finally {
      setLoading(false);
    }
  };

  const fetchFormData = async () => {
    const e = await getEmployes();
    setEmployes(e.map((x) => ({ value: x.id.toString(), label: x.nom })));

    setIndicateursSF(await getIndicateurSF());
    setIndicateursSE(await getIndicateursSE());
  };

  useEffect(() => {
    fetchData();
    fetchFormData();
  }, []);


  const handleSubmit = async () => {
    const payload = {
      annee: Number(annee),
      mois: Number(mois),
      id_employe: Number(selectedEmploye),

      details_sf: Object.keys(detailsSF).map((id) => ({
        id_sf: Number(id),
        note: detailsSF[id].note || "",
        commentaire: detailsSF[id].commentaire || "",
      })),

      details_se: Object.keys(detailsSE).map((id) => ({
        id_se: Number(id),
        note: detailsSE[id].note || "",
        commentaire: detailsSE[id].commentaire || "",
      })),
    };

    try {
      await createEvaluation(payload);

      // Notification succès
      toast.success("Évaluation créée avec succès !");

      setOpened(false);
      fetchData();
    } catch (err) {
      console.error("Erreur création :", err);

      // Notification erreur
      toast.error("Erreur lors de la création de l’évaluation");
    }
  };

  const renderTooltipContent = (detail) => (
    <Card withBorder shadow="md" p="md" radius="md" className="bg-white">
      <Text size="sm" fw={600}>{detail.nom_indicateur}</Text>
      <Divider my="xs" />

      <Text size="xs" c="dimmed">
        <b>Poids :</b> {detail.poids}%
      </Text>
      <Text size="xs" c="dimmed">
        <b>Note :</b> {detail.note}
      </Text>
      <Text size="xs" c="dimmed">
        <b>Note pondérée :</b> {detail.note_ponderee}
      </Text>

      {detail.commentaire && (
        <Text size="xs" c="dimmed" mt={rem(8)}>
          <b>Commentaire :</b> {detail.commentaire}
        </Text>
      )}
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <LoadingOverlay visible={loading} overlayBlur={2} />

      {/* HEADER */}
      <Group justify="space-between" className="mb-6">
        <Title order={2} className="text-gray-800 flex items-center gap-2">
          <IconChartBar size={24} />
          Évaluations
        </Title>

        <Button leftSection={<IconPlus size={16} />} onClick={() => setOpened(true)}>
          Créer une évaluation
        </Button>
      </Group>

      {/* MODALE */}
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        size="xl"
        title={<Title order={4} fw={700}>Créer une évaluation</Title>}
      >

        <Title order={5}>Informations générales</Title>

        <Select
          label="Employé"
          data={employes}
          value={selectedEmploye}
          onChange={setSelectedEmploye}
          className="my-2"
          required
        />

        <Select
          label="Mois"
          data={[
            { value: "1", label: "Janvier" },
            { value: "2", label: "Février" },
            { value: "3", label: "Mars" },
            { value: "4", label: "Avril" },
            { value: "5", label: "Mai" },
            { value: "6", label: "Juin" },
            { value: "7", label: "Juillet" },
            { value: "8", label: "Août" },
            { value: "9", label: "Septembre" },
            { value: "10", label: "Octobre" },
            { value: "11", label: "Novembre" },
            { value: "12", label: "Décembre" },
          ]}
          value={mois}
          onChange={setMois}
          required
        />

        <NumberInput
          label="Année"
          min={2020}
          max={2100}
          value={annee}
          onChange={setAnnee}
          className="my-2"
          required
        />

        <Divider my="md" />

        {/* DETAILS SF */}
        <Title order={5}>Détails Savoir-Faire</Title>
        {indicateursSF.map((sf) => (
          <div key={sf.id} className="my-2">
            <Text fw={500}>{sf.nom_indicateur}</Text>

            <NumberInput
              label="Note"
              min={0}
              max={10}
              onChange={(val) =>
                setDetailsSF((prev) => ({
                  ...prev,
                  [sf.id]: { ...prev[sf.id], note: val },
                }))
              }
            />

            <Textarea
              label="Commentaire"
              className="mt-1"
              onChange={(e) =>
                setDetailsSF((prev) => ({
                  ...prev,
                  [sf.id]: { ...prev[sf.id], commentaire: e.target.value },
                }))
              }
            />
          </div>
        ))}

        <Divider my="md" />

        {/* DETAILS SE */}
        <Title order={5}>Détails Savoir-Être</Title>
        {indicateursSE.map((se) => (
          <div key={se.id} className="my-2">
            <Text fw={500}>{se.nom_indicateur}</Text>

            <NumberInput
              label="Note"
              min={0}
              max={10}
              onChange={(val) =>
                setDetailsSE((prev) => ({
                  ...prev,
                  [se.id]: { ...prev[se.id], note: val },
                }))
              }
            />

            <Textarea
              label="Commentaire"
              className="mt-1"
              onChange={(e) =>
                setDetailsSE((prev) => ({
                  ...prev,
                  [se.id]: { ...prev[se.id], commentaire: e.target.value },
                }))
              }
            />
          </div>
        ))}


        <Button fullWidth className="mt-3" onClick={handleSubmit}>
          Créer l’évaluation
        </Button>
      </Modal>

      {/* TABLEAU */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-200">
        <Table striped highlightOnHover withTableBorder>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Année</Table.Th>
              <Table.Th>Mois</Table.Th>
              <Table.Th>Employé</Table.Th>
              <Table.Th>Note Globale</Table.Th>
              <Table.Th>Détails Savoir-Faire</Table.Th>
              <Table.Th>Détails Savoir-Être</Table.Th>
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>
            {evaluations.length > 0 ? (
              evaluations.map((evalItem, index) => (
                <Table.Tr key={index}>
                  <Table.Td>{evalItem.annee}</Table.Td>
                  <Table.Td>{evalItem.mois_display}</Table.Td>

                  <Table.Td>
                    <Group gap="xs">
                      <IconUser size={16} />
                      <Text>{evalItem.nom_employe}</Text>
                    </Group>
                  </Table.Td>

                  <Table.Td>
                    <Badge
                      color={
                        evalItem.note_globale >= 80
                          ? "green"
                          : evalItem.note_globale >= 50
                            ? "yellow"
                            : "red"
                      }
                      variant="light"
                    >
                      {evalItem.note_globale}
                    </Badge>
                  </Table.Td>

                  <Table.Td>
                    {evalItem.id_detail_sf ? (
                      <Tooltip
                        label={renderTooltipContent(evalItem.id_detail_sf)}
                        position="top"
                        withArrow
                        multiline
                        width={280}
                      >
                        <Card withBorder p="xs" radius="sm" className="cursor-help">
                          <Group gap={rem(6)}>
                            <IconInfoCircle size={16} className="text-blue-500" />
                            <Text fw={500}>{evalItem.id_detail_sf.nom_indicateur}</Text>
                          </Group>
                        </Card>
                      </Tooltip>
                    ) : (
                      <Text size="xs" c="gray">
                        Aucun détail
                      </Text>
                    )}
                  </Table.Td>

                  <Table.Td>
                    {evalItem.id_detail_se ? (
                      <Tooltip
                        label={renderTooltipContent(evalItem.id_detail_se)}
                        position="top"
                        withArrow
                        multiline
                        width={280}
                      >
                        <Card withBorder p="xs" radius="sm" className="cursor-help">
                          <Group gap={rem(6)}>
                            <IconInfoCircle size={16} className="text-blue-500" />
                            <Text fw={500}>{evalItem.id_detail_se.nom_indicateur}</Text>
                          </Group>
                        </Card>
                      </Tooltip>
                    ) : (
                      <Text size="xs" c="gray">
                        Aucun détail
                      </Text>
                    )}
                  </Table.Td>
                </Table.Tr>
              ))
            ) : (
              <Table.Tr>
                <Table.Td colSpan={6} align="center" className="py-4 text-gray-500">
                  Aucune évaluation trouvée
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </div>
    </div>
  );
};

export default Evaluation;
