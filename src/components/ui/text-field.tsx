import type { ValidComponent } from 'solid-js';
import { mergeProps, splitProps } from 'solid-js';

import type { PolymorphicProps } from '@kobalte/core';
import {
  Description as TextFieldPrimitiveDescription,
  ErrorMessage as TextFieldPrimitiveErrorMessage,
  Input as TextFieldPrimitiveInput,
  Label as TextFieldPrimitiveLabel,
  Root as TextFieldPrimitiveRoot,
  TextArea as TextFieldPrimitiveTextArea,
  type TextFieldDescriptionProps as TextFieldPrimitiveTextFieldDescriptionProps,
  type TextFieldErrorMessageProps as TextFieldPrimitiveTextFieldErrorMessageProps,
  type TextFieldInputProps as TextFieldPrimitiveTextFieldInputProps,
  type TextFieldLabelProps as TextFieldPrimitiveTextFieldLabelProps,
  type TextFieldRootProps as TextFieldPrimitiveTextFieldRootProps,
  type TextFieldTextAreaProps as TextFieldPrimitiveTextFieldTextAreaProps,
} from '@kobalte/core/text-field';
import { cva } from 'class-variance-authority';

import { cn } from '~/lib/utils';

type TextFieldRootProps<T extends ValidComponent = 'div'> =
  TextFieldPrimitiveTextFieldRootProps<T> & {
    class?: string | undefined;
  };

const TextField = <T extends ValidComponent = 'div'>(
  props: PolymorphicProps<T, TextFieldRootProps<T>>,
) => {
  const [local, others] = splitProps(props as TextFieldRootProps, ['class']);
  return (
    <TextFieldPrimitiveRoot
      class={cn('flex flex-col gap-1', local.class)}
      {...others}
    />
  );
};

type TextFieldInputProps<T extends ValidComponent = 'input'> =
  TextFieldPrimitiveTextFieldInputProps<T> & {
    class?: string | undefined;
    type?:
      | 'button'
      | 'checkbox'
      | 'color'
      | 'date'
      | 'datetime-local'
      | 'email'
      | 'file'
      | 'hidden'
      | 'image'
      | 'month'
      | 'number'
      | 'password'
      | 'radio'
      | 'range'
      | 'reset'
      | 'search'
      | 'submit'
      | 'tel'
      | 'text'
      | 'time'
      | 'url'
      | 'week';
  };

const TextFieldInput = <T extends ValidComponent = 'input'>(
  rawProps: PolymorphicProps<T, TextFieldInputProps<T>>,
) => {
  const props = mergeProps<TextFieldInputProps<T>[]>(
    { type: 'text' },
    rawProps,
  );
  const [local, others] = splitProps(props as TextFieldInputProps, [
    'type',
    'class',
  ]);
  return (
    <TextFieldPrimitiveInput
      type={local.type}
      class={cn(
        'flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[invalid]:border-error-foreground data-[invalid]:text-error-foreground',
        local.class,
      )}
      {...others}
    />
  );
};

type TextFieldTextAreaProps<T extends ValidComponent = 'textarea'> =
  TextFieldPrimitiveTextFieldTextAreaProps<T> & { class?: string | undefined };

const TextFieldTextArea = <T extends ValidComponent = 'textarea'>(
  props: PolymorphicProps<T, TextFieldTextAreaProps<T>>,
) => {
  const [local, others] = splitProps(props as TextFieldTextAreaProps, [
    'class',
  ]);
  return (
    <TextFieldPrimitiveTextArea
      class={cn(
        'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        local.class,
      )}
      {...others}
    />
  );
};

const labelVariants = cva(
  'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
  {
    variants: {
      variant: {
        label: 'data-[invalid]:text-destructive',
        description: 'font-normal text-muted-foreground',
        error: 'text-xs text-destructive',
      },
    },
    defaultVariants: {
      variant: 'label',
    },
  },
);

type TextFieldLabelProps<T extends ValidComponent = 'label'> =
  TextFieldPrimitiveTextFieldLabelProps<T> & { class?: string | undefined };

const TextFieldLabel = <T extends ValidComponent = 'label'>(
  props: PolymorphicProps<T, TextFieldLabelProps<T>>,
) => {
  const [local, others] = splitProps(props as TextFieldLabelProps, ['class']);
  return (
    <TextFieldPrimitiveLabel
      class={cn(labelVariants(), local.class)}
      {...others}
    />
  );
};

type TextFieldDescriptionProps<T extends ValidComponent = 'div'> =
  TextFieldPrimitiveTextFieldDescriptionProps<T> & {
    class?: string | undefined;
  };

const TextFieldDescription = <T extends ValidComponent = 'div'>(
  props: PolymorphicProps<T, TextFieldDescriptionProps<T>>,
) => {
  const [local, others] = splitProps(props as TextFieldDescriptionProps, [
    'class',
  ]);
  return (
    <TextFieldPrimitiveDescription
      class={cn(labelVariants({ variant: 'description' }), local.class)}
      {...others}
    />
  );
};

type TextFieldErrorMessageProps<T extends ValidComponent = 'div'> =
  TextFieldPrimitiveTextFieldErrorMessageProps<T> & {
    class?: string | undefined;
  };

const TextFieldErrorMessage = <T extends ValidComponent = 'div'>(
  props: PolymorphicProps<T, TextFieldErrorMessageProps<T>>,
) => {
  const [local, others] = splitProps(props as TextFieldErrorMessageProps, [
    'class',
  ]);
  return (
    <TextFieldPrimitiveErrorMessage
      class={cn(labelVariants({ variant: 'error' }), local.class)}
      {...others}
    />
  );
};

export {
  TextField,
  TextFieldInput,
  TextFieldTextArea,
  TextFieldLabel,
  TextFieldDescription,
  TextFieldErrorMessage,
};
