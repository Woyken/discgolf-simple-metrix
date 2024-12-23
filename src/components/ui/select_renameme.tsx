import type { JSX, ValidComponent } from 'solid-js';
import { splitProps } from 'solid-js';

import type { PolymorphicProps } from '@kobalte/core/polymorphic';
import {
  Content as SelectPrimitiveContent,
  HiddenSelect as SelectPrimitiveHiddenSelect,
  Icon as SelectPrimitiveIcon,
  Item as SelectPrimitiveItem,
  ItemIndicator as SelectPrimitiveItemIndicator,
  ItemLabel as SelectPrimitiveItemLabel,
  Listbox as SelectPrimitiveListbox,
  Portal as SelectPrimitivePortal,
  Root as SelectPrimitiveRoot,
  type SelectContentProps as SelectPrimitiveSelectContentProps,
  type SelectItemProps as SelectPrimitiveSelectItemProps,
  type SelectTriggerProps as SelectPrimitiveSelectTriggerProps,
  Trigger as SelectPrimitiveTrigger,
  Value as SelectPrimitiveValue,
} from '@kobalte/core/select';

import { cn } from '~/lib/utils';

const Select = SelectPrimitiveRoot;
const SelectValue = SelectPrimitiveValue;
const SelectHiddenSelect = SelectPrimitiveHiddenSelect;

type SelectTriggerProps<T extends ValidComponent = 'button'> =
  SelectPrimitiveSelectTriggerProps<T> & {
    class?: string | undefined;
    children?: JSX.Element;
  };

const SelectTrigger = <T extends ValidComponent = 'button'>(
  props: PolymorphicProps<T, SelectTriggerProps<T>>,
) => {
  const [local, others] = splitProps(props as SelectTriggerProps, [
    'class',
    'children',
  ]);
  return (
    <SelectPrimitiveTrigger
      class={cn(
        'flex h-10 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        local.class,
      )}
      {...others}
    >
      {local.children}
      <SelectPrimitiveIcon
        as="svg"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="size-4 opacity-50"
      >
        <path d="M8 9l4 -4l4 4" />
        <path d="M16 15l-4 4l-4 -4" />
      </SelectPrimitiveIcon>
    </SelectPrimitiveTrigger>
  );
};

type SelectContentProps<T extends ValidComponent = 'div'> =
  SelectPrimitiveSelectContentProps<T> & { class?: string | undefined };

const SelectContent = <T extends ValidComponent = 'div'>(
  props: PolymorphicProps<T, SelectContentProps<T>>,
) => {
  const [local, others] = splitProps(props as SelectContentProps, ['class']);
  return (
    <SelectPrimitivePortal>
      <SelectPrimitiveContent
        class={cn(
          'relative z-50 min-w-32 overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-80',
          local.class,
        )}
        {...others}
      >
        <SelectPrimitiveListbox class="m-0 p-1" />
      </SelectPrimitiveContent>
    </SelectPrimitivePortal>
  );
};

type SelectItemProps<T extends ValidComponent = 'li'> =
  SelectPrimitiveSelectItemProps<T> & {
    class?: string | undefined;
    children?: JSX.Element;
  };

const SelectItem = <T extends ValidComponent = 'li'>(
  props: PolymorphicProps<T, SelectItemProps<T>>,
) => {
  const [local, others] = splitProps(props as SelectItemProps, [
    'class',
    'children',
  ]);
  return (
    <SelectPrimitiveItem
      class={cn(
        'relative mt-0 flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        local.class,
      )}
      {...others}
    >
      <SelectPrimitiveItemIndicator class="absolute right-2 flex size-3.5 items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="size-4"
        >
          <title>Select dropdown arrow</title>
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M5 12l5 5l10 -10" />
        </svg>
      </SelectPrimitiveItemIndicator>
      <SelectPrimitiveItemLabel>{local.children}</SelectPrimitiveItemLabel>
    </SelectPrimitiveItem>
  );
};

export {
  Select,
  SelectValue,
  SelectHiddenSelect,
  SelectTrigger,
  SelectContent,
  SelectItem,
};
