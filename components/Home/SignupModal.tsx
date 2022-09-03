import { Button, Modal, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useSWRConfig } from "swr";

const SignupModal = ({ session }: { session: Session }) => {

  const form = useForm({
    initialValues: {
      username: "",
    },

    validate: {
      username: (value) => {
        if (value.length >= 3 && value.toLowerCase() === value && !/\s/.test(value)) {
          return null
        } else if (value.length < 3) {
          return "Username should be at least 3 characters long"
        } else if (value.toLowerCase() !== value) {
          return "Username should be in all lowercase"
        } else if(/\s/.test(value)) {
          return "Username should not include spaces"
        }
      },
    },
  });

  type FormValues = typeof form.values;

  const { mutate } = useSWRConfig();

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: FormValues) => {
    form.validate();
    console.log(values);

    const res = await fetch("/api/user/createUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: session?.user?.email,
        username: values.username,
        createdAt: new Date(),
        image_url: session?.user?.image
      }),
    });

    const data = await res.json();

    if (data.success) {
      setLoading(false);
      mutate("/api/user/userExists?email=" + session?.user?.email);
      mutate("/api/user?email=" + session?.user?.email);
    }
  };
  const [opened, setOpened] = useState(true);

  return (
    <Modal
      opened={opened}
      onClose={() => setOpened(false)}
      closeOnClickOutside={false}
      closeOnEscape={false}
      withCloseButton={false}
      title="Welcome! Choose a username"
    >
      <form
        onSubmit={form.onSubmit(handleSubmit)}
        className="flex flex-col space-y-2"
      >
        <TextInput
          placeholder="Username e.g. luffy02"
          {...form.getInputProps("username")}
        />
        <Button loading={loading} type="submit" className="self-center bg-primary">
          Submit
        </Button>
      </form>
    </Modal>
  );
};
export default SignupModal;
