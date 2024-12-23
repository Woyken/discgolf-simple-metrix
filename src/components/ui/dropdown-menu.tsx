import type { Component, ComponentProps, JSX, ValidComponent } from 'solid-js';
import { splitProps } from 'solid-js';

import {
  CheckboxItem as DropdownMenuPrimitiveCheckboxItem,
  Content as DropdownMenuPrimitiveContent,
  type DropdownMenuCheckboxItemProps as DropdownMenuPrimitiveDropdownMenuCheckboxItemProps,
  type DropdownMenuContentProps as DropdownMenuPrimitiveDropdownMenuContentProps,
  type DropdownMenuGroupLabelProps as DropdownMenuPrimitiveDropdownMenuGroupLabelProps,
  type DropdownMenuItemProps as DropdownMenuPrimitiveDropdownMenuItemProps,
  type DropdownMenuRadioItemProps as DropdownMenuPrimitiveDropdownMenuRadioItemProps,
  type DropdownMenuRootProps as DropdownMenuPrimitiveDropdownMenuRootProps,
  type DropdownMenuSeparatorProps as DropdownMenuPrimitiveDropdownMenuSeparatorProps,
  type DropdownMenuSubContentProps as DropdownMenuPrimitiveDropdownMenuSubContentProps,
  type DropdownMenuSubTriggerProps as DropdownMenuPrimitiveDropdownMenuSubTriggerProps,
  Group as DropdownMenuPrimitiveGroup,
  GroupLabel as DropdownMenuPrimitiveGroupLabel,
  Item as DropdownMenuPrimitiveItem,
  ItemIndicator as DropdownMenuPrimitiveItemIndicator,
  Portal as DropdownMenuPrimitivePortal,
  RadioGroup as DropdownMenuPrimitiveRadioGroup,
  RadioItem as DropdownMenuPrimitiveRadioItem,
  Root as DropdownMenuPrimitiveRoot,
  Separator as DropdownMenuPrimitiveSeparator,
  Sub as DropdownMenuPrimitiveSub,
  SubContent as DropdownMenuPrimitiveSubContent,
  SubTrigger as DropdownMenuPrimitiveSubTrigger,
  Trigger as DropdownMenuPrimitiveTrigger,
} from '@kobalte/core/dropdown-menu';
import type { PolymorphicProps } from '@kobalte/core/polymorphic';

import { cn } from '~/lib/utils';

const DropdownMenuTrigger = DropdownMenuPrimitiveTrigger;
const DropdownMenuPortal = DropdownMenuPrimitivePortal;
const DropdownMenuSub = DropdownMenuPrimitiveSub;
const DropdownMenuGroup = DropdownMenuPrimitiveGroup;
const DropdownMenuRadioGroup = DropdownMenuPrimitiveRadioGroup;

const DropdownMenu: Component<DropdownMenuPrimitiveDropdownMenuRootProps> = (
  props,
) => {
  return <DropdownMenuPrimitiveRoot gutter={4} {...props} />;
};

type DropdownMenuContentProps<T extends ValidComponent = 'div'> =
  DropdownMenuPrimitiveDropdownMenuContentProps<T> & {
    class?: string | undefined;
  };

const DropdownMenuContent = <T extends ValidComponent = 'div'>(
  props: PolymorphicProps<T, DropdownMenuContentProps<T>>,
) => {
  const [, rest] = splitProps(props as DropdownMenuContentProps, ['class']);
  return (
    <DropdownMenuPrimitivePortal>
      <DropdownMenuPrimitiveContent
        class={cn(
          'z-50 min-w-32 origin-[var(--kb-menu-content-transform-origin)] animate-content-hide overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[expanded]:animate-content-show',
          props.class,
        )}
        {...rest}
      />
    </DropdownMenuPrimitivePortal>
  );
};

type DropdownMenuItemProps<T extends ValidComponent = 'div'> =
  DropdownMenuPrimitiveDropdownMenuItemProps<T> & {
    class?: string | undefined;
  };

const DropdownMenuItem = <T extends ValidComponent = 'div'>(
  props: PolymorphicProps<T, DropdownMenuItemProps<T>>,
) => {
  const [, rest] = splitProps(props as DropdownMenuItemProps, ['class']);
  return (
    <DropdownMenuPrimitiveItem
      class={cn(
        'relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        props.class,
      )}
      {...rest}
    />
  );
};

const DropdownMenuShortcut: Component<ComponentProps<'span'>> = (props) => {
  const [, rest] = splitProps(props, ['class']);
  return (
    <span
      class={cn('ml-auto text-xs tracking-widest opacity-60', props.class)}
      {...rest}
    />
  );
};

const DropdownMenuLabel: Component<
  ComponentProps<'div'> & { inset?: boolean }
> = (props) => {
  const [, rest] = splitProps(props, ['class', 'inset']);
  return (
    <div
      class={cn(
        'px-2 py-1.5 text-sm font-semibold',
        props.inset && 'pl-8',
        props.class,
      )}
      {...rest}
    />
  );
};

type DropdownMenuSeparatorProps<T extends ValidComponent = 'hr'> =
  DropdownMenuPrimitiveDropdownMenuSeparatorProps<T> & {
    class?: string | undefined;
  };

const DropdownMenuSeparator = <T extends ValidComponent = 'hr'>(
  props: PolymorphicProps<T, DropdownMenuSeparatorProps<T>>,
) => {
  const [, rest] = splitProps(props as DropdownMenuSeparatorProps, ['class']);
  return (
    <DropdownMenuPrimitiveSeparator
      class={cn('-mx-1 my-1 h-px bg-muted', props.class)}
      {...rest}
    />
  );
};

type DropdownMenuSubTriggerProps<T extends ValidComponent = 'div'> =
  DropdownMenuPrimitiveDropdownMenuSubTriggerProps<T> & {
    class?: string | undefined;
    children?: JSX.Element;
  };

const DropdownMenuSubTrigger = <T extends ValidComponent = 'div'>(
  props: PolymorphicProps<T, DropdownMenuSubTriggerProps<T>>,
) => {
  const [, rest] = splitProps(props as DropdownMenuSubTriggerProps, [
    'class',
    'children',
  ]);
  return (
    <DropdownMenuPrimitiveSubTrigger
      class={cn(
        'flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent',
        props.class,
      )}
      {...rest}
    >
      {props.children}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="ml-auto size-4"
      >
        <title>Dropdown trigger</title>
        <path d="M9 6l6 6l-6 6" />
      </svg>
    </DropdownMenuPrimitiveSubTrigger>
  );
};

type DropdownMenuSubContentProps<T extends ValidComponent = 'div'> =
  DropdownMenuPrimitiveDropdownMenuSubContentProps<T> & {
    class?: string | undefined;
  };

const DropdownMenuSubContent = <T extends ValidComponent = 'div'>(
  props: PolymorphicProps<T, DropdownMenuSubContentProps<T>>,
) => {
  const [, rest] = splitProps(props as DropdownMenuSubContentProps, ['class']);
  return (
    <DropdownMenuPrimitiveSubContent
      class={cn(
        'z-50 min-w-32 origin-[var(--kb-menu-content-transform-origin)] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in',
        props.class,
      )}
      {...rest}
    />
  );
};

type DropdownMenuCheckboxItemProps<T extends ValidComponent = 'div'> =
  DropdownMenuPrimitiveDropdownMenuCheckboxItemProps<T> & {
    class?: string | undefined;
    children?: JSX.Element;
  };

const DropdownMenuCheckboxItem = <T extends ValidComponent = 'div'>(
  props: PolymorphicProps<T, DropdownMenuCheckboxItemProps<T>>,
) => {
  const [, rest] = splitProps(props as DropdownMenuCheckboxItemProps, [
    'class',
    'children',
  ]);
  return (
    <DropdownMenuPrimitiveCheckboxItem
      class={cn(
        'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        props.class,
      )}
      {...rest}
    >
      <span class="absolute left-2 flex size-3.5 items-center justify-center">
        <DropdownMenuPrimitiveItemIndicator>
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
            <title>Dropdown indicator</title>
            <path d="M5 12l5 5l10 -10" />
          </svg>
        </DropdownMenuPrimitiveItemIndicator>
      </span>
      {props.children}
    </DropdownMenuPrimitiveCheckboxItem>
  );
};

type DropdownMenuGroupLabelProps<T extends ValidComponent = 'span'> =
  DropdownMenuPrimitiveDropdownMenuGroupLabelProps<T> & {
    class?: string | undefined;
  };

const DropdownMenuGroupLabel = <T extends ValidComponent = 'span'>(
  props: PolymorphicProps<T, DropdownMenuGroupLabelProps<T>>,
) => {
  const [, rest] = splitProps(props as DropdownMenuGroupLabelProps, ['class']);
  return (
    <DropdownMenuPrimitiveGroupLabel
      class={cn('px-2 py-1.5 text-sm font-semibold', props.class)}
      {...rest}
    />
  );
};

type DropdownMenuRadioItemProps<T extends ValidComponent = 'div'> =
  DropdownMenuPrimitiveDropdownMenuRadioItemProps<T> & {
    class?: string | undefined;
    children?: JSX.Element;
  };

const DropdownMenuRadioItem = <T extends ValidComponent = 'div'>(
  props: PolymorphicProps<T, DropdownMenuRadioItemProps<T>>,
) => {
  const [, rest] = splitProps(props as DropdownMenuRadioItemProps, [
    'class',
    'children',
  ]);
  return (
    <DropdownMenuPrimitiveRadioItem
      class={cn(
        'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        props.class,
      )}
      {...rest}
    >
      <span class="absolute left-2 flex size-3.5 items-center justify-center">
        <DropdownMenuPrimitiveItemIndicator>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="size-2 fill-current"
          >
            <title>Dropdown indicator</title>
            <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
          </svg>
        </DropdownMenuPrimitiveItemIndicator>
      </span>
      {props.children}
    </DropdownMenuPrimitiveRadioItem>
  );
};

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuPortal,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuCheckboxItem,
  DropdownMenuGroup,
  DropdownMenuGroupLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
};
