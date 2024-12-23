import {
  type FieldStore,
  createForm,
  email,
  minLength,
  required,
} from '@modular-forms/solid';
import { useNavigate } from '@solidjs/router';
import { createMutation } from '@tanstack/solid-query';
import { discGolfMetrixLogin } from '~/apiWrapper/login';
import { Button } from '~/components/ui/button';
import { Grid } from '~/components/ui/grid';
import {
  TextField,
  TextFieldInput,
  TextFieldLabel,
} from '~/components/ui/text-field';

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

// biome-ignore lint/style/noDefaultExport: Required for route
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
                navigate('/');
              }}
            >
              <Grid class="gap-4">
                <Field
                  name="email"
                  validate={[
                    required('Please enter your email.'),
                    email('The email address is badly formatted.'),
                  ]}
                >
                  {(field, props) => (
                    <>
                      <TextField>
                        <TextFieldLabel for="email">Email</TextFieldLabel>
                        <TextFieldInput
                          {...props}
                          type="email"
                          id="email"
                          placeholder={'email@example.com'}
                        />
                      </TextField>
                      <FieldInfo field={field} />
                    </>
                  )}
                </Field>
                <Field
                  name="password"
                  validate={[
                    required('Please enter your password.'),
                    minLength(
                      3,
                      'You password must have 3 characters or more.',
                    ),
                  ]}
                >
                  {(field, props) => (
                    <>
                      <TextField>
                        <TextFieldLabel for="password">Password</TextFieldLabel>
                        <TextFieldInput
                          {...props}
                          type="password"
                          id="password"
                          placeholder={'***********'}
                        />
                      </TextField>
                      <FieldInfo field={field} />
                    </>
                  )}
                </Field>
                <Button type="submit" disabled={loginForm.submitting}>
                  {loginForm.submitting ? (
                    <span class="loading loading-spinner" />
                  ) : null}
                  Login
                </Button>
                <p class={'text-center text-error'}>
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

// biome-ignore lint/suspicious/noExplicitAny: Display anything, this type is quite complex
function FieldInfo(props: { field: FieldStore<any, any> }) {
  return <>{props.field.error ? <em>{props.field.error}</em> : null}</>;
}
