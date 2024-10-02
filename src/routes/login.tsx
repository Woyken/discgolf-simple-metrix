import { useNavigate } from "@solidjs/router";
import { createForm, FieldApi } from "@tanstack/solid-form";
import { createMutation } from "@tanstack/solid-query";
import { valibotValidator } from "@tanstack/valibot-form-adapter";
import { email, minLength, pipe, string } from "valibot";
import { discGolfMetrixLogin } from "~/apiWrapper/login";

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

function LoginForm() {
  const loginMutation = useLoginMutation();
  const navigate = useNavigate();

  const form = createForm(() => ({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      await loginMutation.mutateAsync({
        email: value.email,
        password: value.password,
      });
      navigate("/");
    },
    // Add a validator to support Valibot usage in Form and Field
    validatorAdapter: valibotValidator(),
  }));

  return (
    <div class="flex min-h-screen items-center bg-base-200">
      <div class="card mx-auto w-full max-w-2xl shadow-xl">
        <div class="grid grid-cols-1 rounded-xl bg-base-100 md:grid-cols-1">
          <div class="px-10 py-24">
            <h2 class="mb-2 text-center text-2xl font-semibold">Login</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
              }}
            >
              <div class="mb-4">
                <div class={`form-control w-full`}>
                  <label class="label">
                    <span class={"label-text text-base-content"}>Email</span>
                  </label>
                  <form.Field
                    name="email"
                    validators={{
                      onChange: pipe(string(), email()),
                    }}
                    children={(field) => {
                      return (
                        <>
                          <input
                            type="email"
                            name={field().name}
                            value={field().state.value}
                            onBlur={field().handleBlur}
                            onInput={(e) =>
                              field().handleChange(e.currentTarget.value)
                            }
                            placeholder={"email@example.com"}
                            class="input input-bordered w-full"
                          />
                          <FieldInfo field={field()} />
                        </>
                      );
                    }}
                  />
                </div>
                <div class={`form-control w-full`}>
                  <label class="label">
                    <span class={"label-text text-base-content"}>Password</span>
                  </label>
                  <form.Field
                    name="password"
                    validators={{
                      onChange: pipe(string(), minLength(3)),
                    }}
                    children={(field) => (
                      <>
                        <input
                          type="password"
                          name={field().name}
                          value={field().state.value}
                          onBlur={field().handleBlur}
                          onInput={(e) =>
                            field().handleChange(e.currentTarget.value)
                          }
                          placeholder={"***********"}
                          class="input input-bordered w-full"
                        />
                        <FieldInfo field={field()} />
                      </>
                    )}
                  />
                </div>
              </div>
              <p class={`text-center text-error`}>
                {loginMutation.error?.message}
              </p>
              <form.Subscribe
                selector={(state) => ({
                  canSubmit: state.canSubmit,
                  isSubmitting: state.isSubmitting,
                })}
                children={(state) => {
                  return (
                    <button
                      type="submit"
                      class={"btn btn-primary mt-2 w-full"}
                      disabled={!state().canSubmit}
                    >
                      {state().isSubmitting ? (
                        <span class="loading loading-spinner"></span>
                      ) : null}
                      Login
                    </button>
                  );
                }}
              />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function FieldInfo(props: { field: FieldApi<any, any, any, any> }) {
  return (
    <>
      {props.field.state.meta.errors ? (
        <em>{props.field.state.meta.errors}</em>
      ) : null}
      {props.field.state.meta.isValidating ? "Validating..." : null}
    </>
  );
}
