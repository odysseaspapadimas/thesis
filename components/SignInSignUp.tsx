import { Button, Divider, PasswordInput, Tabs, TabsValue, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { signIn } from "next-auth/react";
import { Dispatch, SetStateAction } from "react";

type Props = {
  activeTab: TabsValue;
  setActiveTab: Dispatch<SetStateAction<TabsValue>>;
};

const SignInSignUp = ({ activeTab, setActiveTab }: Props) => {
  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },

    validate: {
      email: (value) =>
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)
          ? null
          : "Invalid email",

      password: (value) =>
        value.length >= 8 ? null : "Password must be at least 8 characters",
    },
  });

  type FormValues = typeof form.values;

  const handleSubmit = (values: FormValues) => {
    form.validate();
    console.log(values);
  };

  return (
    <Tabs
      value={activeTab}
      onTabChange={setActiveTab}
      variant="pills"
    >
      <Tabs.List position="center">
        <Tabs.Tab value="sign-in">Sign-in</Tabs.Tab>
        <Tabs.Tab value="sign-up">Sign-up</Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="sign-in">
        <div className="grid place-items-center p-4">
          <button
            aria-label="Continue with google"
            role="button"
            onClick={() => signIn("google")}
            className="focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-700 bg-white py-3.5 px-4 border rounded-lg border-gray-700 flex items-center"
          >
            <img
              src="https://tuk-cdn.s3.amazonaws.com/can-uploader/sign_in-svg2.svg"
              alt="google"
            />
            <p className="text-base font-medium ml-4 text-gray-700">
              Continue with Google
            </p>
          </button>
        </div>
      </Tabs.Panel>
      <Tabs.Panel value="sign-up">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            required
            label="Email"
            placeholder="email@example.com"
            {...form.getInputProps("email")}
          />

          <PasswordInput
            required
            placeholder="Password"
            label="Password"
            description="Password must include at least one letter, number and special character"
            {...form.getInputProps("password")}
          />

          <Button className="bg-primary mt-4" type="submit">
            Sign-up
          </Button>

          <Divider my="xs" label="or" labelPosition="center" />
        </form>
        <div className="grid place-items-center p-4">
          <button
            aria-label="Continue with google"
            role="button"
            onClick={() => signIn("google")}
            className="focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-700 bg-white py-3.5 px-4 border rounded-lg border-gray-700 flex items-center"
          >
            <img
              src="https://tuk-cdn.s3.amazonaws.com/can-uploader/sign_in-svg2.svg"
              alt="google"
            />
            <p className="text-base font-medium ml-4 text-gray-700">
              Continue with Google
            </p>
          </button>
        </div>
      </Tabs.Panel>
    </Tabs>
  );
};
export default SignInSignUp;
