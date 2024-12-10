import { useNavigate } from "@solidjs/router";
import { createMutation } from "@tanstack/solid-query";
import { discGolfMetrixLogin } from "~/apiWrapper/login";
import { Button } from "~/components/ui/button";
import {
  TextField,
  TextFieldInput,
  TextFieldLabel,
} from "~/components/ui/text-field";
import {
  createForm,
  required,
  email,
  minLength,
  FieldStore,
} from "@modular-forms/solid";
import { Grid } from "~/components/ui/grid";

function useLoginMutation() {
  return createMutation(() => ({
    mutationFn: async (params: { email: string; password: string }) => {
      const result = await discGolfMetrixLogin(params.email, params.password);
      return result;
    },
    // onSuccess(data) {
    //   tokenStore.setToken(data);
    // },
  }));
}

export default function Login() {
  return <LoginForm />;
}
type LoginFormType = {
  email: string;
  password: string;
};

function LoginForm() {
  const loginMutation = useLoginMutation();
  const navigate = useNavigate();

  const [loginForm, { Form, Field }] = createForm<LoginFormType>();

  return (
    <div class="flex min-h-screen items-center bg-base-200">
      <div class="card mx-auto w-full max-w-2xl shadow-xl">
        <div class="grid grid-cols-1 rounded-xl bg-base-100 md:grid-cols-1">
          <div class="px-10 py-24">
            <h2 class="mb-2 text-center text-2xl font-semibold">Login</h2>
            <Form
              onSubmit={async (value) => {
                await loginMutation.mutateAsync({
                  email: value.email,
                  password: value.password,
                });
                navigate("/");
              }}
            >
              <Grid class="gap-4">
                <Field
                  name="email"
                  validate={[
                    required("Please enter your email."),
                    email("The email address is badly formatted."),
                  ]}
                  children={(field, props) => (
                    <>
                      <TextField>
                        <TextFieldLabel for="email">Email</TextFieldLabel>
                        <TextFieldInput
                          {...props}
                          type="email"
                          id="email"
                          placeholder={"email@example.com"}
                        />
                      </TextField>
                      <FieldInfo field={field} />
                    </>
                  )}
                />
                <Field
                  name="password"
                  validate={[
                    required("Please enter your password."),
                    minLength(
                      3,
                      "You password must have 3 characters or more."
                    ),
                  ]}
                  children={(field, props) => (
                    <>
                      <TextField>
                        <TextFieldLabel for="password">Password</TextFieldLabel>
                        <TextFieldInput
                          {...props}
                          type="password"
                          id="password"
                          placeholder={"***********"}
                        />
                      </TextField>
                      <FieldInfo field={field} />
                    </>
                  )}
                />
                <Button type="submit" disabled={loginForm.submitting}>
                  {loginForm.submitting ? (
                    <span class="loading loading-spinner"></span>
                  ) : null}
                  Login
                </Button>
                <p class={`text-center text-error`}>
                  {loginMutation.error?.message}
                </p>
              </Grid>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function FieldInfo(props: { field: FieldStore<any, any> }) {
  return <>{props.field.error ? <em>{props.field.error}</em> : null}</>;
}
