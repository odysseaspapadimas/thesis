import { Button, Divider, PasswordInput, Tabs, TabsValue, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { signIn, SignInOptions } from "next-auth/react";
import { useRouter } from "next/router";
import { Dispatch, SetStateAction } from "react";

type Props = {
  activeTab: TabsValue;
  setActiveTab: Dispatch<SetStateAction<TabsValue>>;
  setOpened: Dispatch<SetStateAction<boolean>>;
};

const SignInSignUp = ({ activeTab, setActiveTab, setOpened }: Props) => {
  const router = useRouter();

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

  const formSignUp = useForm({
    initialValues: {
      email: "",
      password: "",
      username: ""
    },

    validate: {
      email: (value) =>
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)
          ? null
          : "Invalid email",

      password: (value) =>
        value.length >= 8 ? null : "Password must be at least 8 characters",
      username: (value) => {
        if (value.length >= 3 && value.toLowerCase() === value && !/\s/.test(value)) {
          return null
        } else if (value.length < 3) {
          return "Username should be at least 3 characters long"
        } else if (value.toLowerCase() !== value) {
          return "Username should be in all lowercase"
        } else if (/\s/.test(value)) {
          return "Username should not include spaces"
        }
      },
    },
  });

  type FormValues = typeof form.values;

  const handleLogin = async (values: FormValues) => {
    form.validate();
    console.log(values);

    const options = { redirect: false, email: values.email, password: values.password } as SignInOptions;

    const res = await signIn("credentials", options);

    if (res?.ok) {
      setOpened(false);

      showNotification({
        title: 'Signed-in!',
        message: 'You successfully signed-in!',
        color: "green"
      })
    }

    console.log(res, 'res')

    if (res?.error?.includes("password")) {
      form.setFieldError("password", res?.error);
    } else if (res?.error?.includes("exist")) {
      form.setFieldError("email", res?.error);
    }
  };


  type FormSignupValues = typeof formSignUp.values;

  const handleSignup = async (values: FormSignupValues) => {
    form.validate();
    console.log(values);

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: values.email,
        password: values.password,
        username: values.username
      })
    })

    const data = await res.json();

    if (data.ok) {
      const options = { redirect: false, email: values.email, password: values.password } as SignInOptions;

      const res = await signIn("credentials", options)

      if (res?.ok) {
        setOpened(false);

        showNotification({
          title: 'Signed-up!',
          message: 'You successfully signed-up and were signed-in!',
          color: "green"
        })
      }
    }
    console.log(data, 'signupres');
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

        <form onSubmit={form.onSubmit(handleLogin)}>
          <TextInput
            required
            withAsterisk={false}
            name="email"
            autoComplete="email"
            type="email"
            label="Email"
            placeholder="email@example.com"
            {...form.getInputProps("email")}
          />


          <PasswordInput
            required
            withAsterisk={false}
            placeholder="Password"
            label="Password"
            {...form.getInputProps("password")}
          />

          <Button className="bg-primary mt-4" type="submit">
            Sign-in
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
      <Tabs.Panel value="sign-up">
        <form onSubmit={formSignUp.onSubmit(handleSignup)}>
          <TextInput
            required
            label="Username"
            placeholder="eg. luffy02"
            {...formSignUp.getInputProps("username")}
          />
          <TextInput
            required
            name="email"
            autoComplete="email"
            type="email"
            label="Email"
            placeholder="email@example.com"
            {...formSignUp.getInputProps("email")}
          />

          <PasswordInput
            required
            placeholder="Password"
            label="Password"
            description="Password must include at least one letter, number and special character"
            {...formSignUp.getInputProps("password")}
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
