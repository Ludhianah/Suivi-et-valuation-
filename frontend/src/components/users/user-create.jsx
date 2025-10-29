import { useState } from "react";
import { TextInput, Button, Group, Table, Card, Title } from "@mantine/core";

function UserForm({ onAddUser }) {
  const [formData, setFormData] = useState({ name: "", email: "" });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    onAddUser(formData);
    setFormData({ name: "", email: "" });
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Title order={4} mb="sm">Add New User</Title>
      <form onSubmit={handleSubmit}>
        <TextInput
          label="Name"
          name="name"
          placeholder="Enter name"
          value={formData.name}
          onChange={handleChange}
          required
          mb="sm"
        />
        <TextInput
          label="Email"
          name="email"
          placeholder="Enter email"
          value={formData.email}
          onChange={handleChange}
          required
          mb="sm"
        />
        <Group justify="flex-end" mt="md">
          <Button type="submit">Add User</Button>
        </Group>
      </form>
    </Card>
  );
}

export default UserForm;
