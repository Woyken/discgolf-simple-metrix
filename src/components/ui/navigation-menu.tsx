import type { JSX, ValidComponent } from 'solid-js';
import { splitProps } from 'solid-js';

import type { PolymorphicProps } from '@kobalte/core';
import {
  Content as NavigationMenuPrimitiveContent,
  Icon as NavigationMenuPrimitiveIcon,
  Item as NavigationMenuPrimitiveItem,
  ItemDescription as NavigationMenuPrimitiveItemDescription,
  ItemLabel as NavigationMenuPrimitiveItemLabel,
  Menu as NavigationMenuPrimitiveMenu,
  type NavigationMenuContentProps as NavigationMenuPrimitiveNavigationMenuContentProps,
  type NavigationMenuItemDescriptionProps as NavigationMenuPrimitiveNavigationMenuItemDescriptionProps,
  type NavigationMenuItemLabelProps as NavigationMenuPrimitiveNavigationMenuItemLabelProps,
  type NavigationMenuItemProps as NavigationMenuPrimitiveNavigationMenuItemProps,
  type NavigationMenuRootProps as NavigationMenuPrimitiveNavigationMenuRootProps,
  type NavigationMenuTriggerProps as NavigationMenuPrimitiveNavigationMenuTriggerProps,
  type NavigationMenuViewportProps as NavigationMenuPrimitiveNavigationMenuViewportProps,
  Portal as NavigationMenuPrimitivePortal,
  Root as NavigationMenuPrimitiveRoot,
  Trigger as NavigationMenuPrimitiveTrigger,
  Viewport as NavigationMenuPrimitiveViewport,
} from '@kobalte/core/navigation-menu';

import { cn } from '~/lib/utils';

const NavigationMenuItem = NavigationMenuPrimitiveMenu;

type NavigationMenuProps<T extends ValidComponent = 'ul'> =
  NavigationMenuPrimitiveNavigationMenuRootProps<T> & {
    class?: string | undefined;
    children?: JSX.Element;
  };

const NavigationMenu = <T extends ValidComponent = 'ul'>(
  props: PolymorphicProps<T, NavigationMenuProps<T>>,
) => {
  const [local, others] = splitProps(props as NavigationMenuProps, [
    'class',
    'children',
  ]);
  return (
    <NavigationMenuPrimitiveRoot
      gutter={6}
      class={cn(
        'group/menu flex w-max flex-1 list-none items-center justify-center data-[orientation=vertical]:flex-col [&>li]:w-full',
        local.class,
      )}
      {...others}
    >
      {local.children}
      <NavigationMenuViewport />
    </NavigationMenuPrimitiveRoot>
  );
};

type NavigationMenuTriggerProps<T extends ValidComponent = 'button'> =
  NavigationMenuPrimitiveNavigationMenuTriggerProps<T> & {
    class?: string | undefined;
  };

const NavigationMenuTrigger = <T extends ValidComponent = 'button'>(
  props: PolymorphicProps<T, NavigationMenuTriggerProps<T>>,
) => {
  const [local, others] = splitProps(props as NavigationMenuTriggerProps, [
    'class',
  ]);
  return (
    <NavigationMenuPrimitiveTrigger
      class={cn(
        'group/trigger inline-flex h-10 w-full items-center justify-center whitespace-nowrap rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[expanded]:bg-accent/50',
        local.class,
      )}
      {...others}
    />
  );
};
const NavigationMenuIcon = () => {
  return (
    <NavigationMenuPrimitiveIcon aria-hidden="true">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="relative top-px ml-1 size-3 transition duration-200 group-data-[expanded]/trigger:rotate-180 group-data-[orientation=vertical]/menu:-rotate-90 group-data-[orientation=vertical]/menu:group-data-[expanded]/trigger:rotate-90"
      >
        <title>Menu icon</title>
        <path d="M6 9l6 6l6 -6" />
      </svg>
    </NavigationMenuPrimitiveIcon>
  );
};

type NavigationMenuViewportProps<T extends ValidComponent = 'li'> =
  NavigationMenuPrimitiveNavigationMenuViewportProps<T> & {
    class?: string | undefined;
  };

const NavigationMenuViewport = <T extends ValidComponent = 'li'>(
  props: PolymorphicProps<T, NavigationMenuViewportProps<T>>,
) => {
  const [local, others] = splitProps(props as NavigationMenuViewportProps, [
    'class',
  ]);
  return (
    <NavigationMenuPrimitiveViewport
      class={cn(
        // base settings
        'pointer-events-none z-[1000] flex h-[var(--kb-navigation-menu-viewport-height)] w-[var(--kb-navigation-menu-viewport-width)] origin-[var(--kb-menu-content-transform-origin)] items-center justify-center overflow-x-clip overflow-y-visible rounded-md border bg-popover opacity-0 shadow-lg data-[expanded]:pointer-events-auto data-[orientation=vertical]:overflow-y-clip data-[orientation=vertical]:overflow-x-visible data-[expanded]:rounded-md',
        // animate
        'animate-content-hide transition-[width,height] duration-200 ease-in data-[expanded]:animate-content-show data-[expanded]:opacity-100 data-[expanded]:ease-out',
        local.class,
      )}
      {...others}
    />
  );
};

type NavigationMenuContentProps<T extends ValidComponent = 'ul'> =
  NavigationMenuPrimitiveNavigationMenuContentProps<T> & {
    class?: string | undefined;
  };

const NavigationMenuContent = <T extends ValidComponent = 'ul'>(
  props: PolymorphicProps<T, NavigationMenuContentProps<T>>,
) => {
  const [local, others] = splitProps(props as NavigationMenuContentProps, [
    'class',
  ]);
  return (
    <NavigationMenuPrimitivePortal>
      <NavigationMenuPrimitiveContent
        class={cn(
          // base settings
          'pointer-events-none absolute left-0 top-0 box-border p-4 focus:outline-none data-[expanded]:pointer-events-auto',
          // base animation settings
          'data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out',
          // left to right
          'data-[orientation=horizontal]:data-[motion=from-start]:slide-in-from-left-52 data-[orientation=horizontal]:data-[motion=to-end]:slide-out-to-right-52',
          // right to left
          'data-[orientation=horizontal]:data-[motion=from-end]:slide-in-from-right-52 data-[orientation=horizontal]:data-[motion=to-start]:slide-out-to-left-52',
          // top to bottom
          'data-[orientation=vertical]:data-[motion=from-start]:slide-in-from-top-52 data-[orientation=vertical]:data-[motion=to-end]:slide-out-to-bottom-52',
          //bottom to top
          'data-[orientation=vertical]:data-[motion=from-end]:slide-in-from-bottom-52 data-[orientation=vertical]:data-[motion=to-start]:slide-out-to-bottom-52',
          local.class,
        )}
        {...others}
      />
    </NavigationMenuPrimitivePortal>
  );
};

type NavigationMenuLinkProps<T extends ValidComponent = 'a'> =
  NavigationMenuPrimitiveNavigationMenuItemProps<T> & {
    class?: string | undefined;
  };

const NavigationMenuLink = <T extends ValidComponent = 'a'>(
  props: PolymorphicProps<T, NavigationMenuLinkProps<T>>,
) => {
  const [local, others] = splitProps(props as NavigationMenuLinkProps, [
    'class',
  ]);
  return (
    <NavigationMenuPrimitiveItem
      class={cn(
        'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors  hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
        local.class,
      )}
      {...others}
    />
  );
};

type NavigationMenuLabelProps<T extends ValidComponent = 'div'> =
  NavigationMenuPrimitiveNavigationMenuItemLabelProps<T> & {
    class?: string | undefined;
  };

const NavigationMenuLabel = <T extends ValidComponent = 'div'>(
  props: PolymorphicProps<T, NavigationMenuLabelProps<T>>,
) => {
  const [local, others] = splitProps(props as NavigationMenuLabelProps, [
    'class',
  ]);
  return (
    <NavigationMenuPrimitiveItemLabel
      class={cn('text-sm font-medium leading-none', local.class)}
      {...others}
    />
  );
};

type NavigationMenuDescriptionProps<T extends ValidComponent = 'div'> =
  NavigationMenuPrimitiveNavigationMenuItemDescriptionProps<T> & {
    class?: string | undefined;
  };

const NavigationMenuDescription = <T extends ValidComponent = 'div'>(
  props: PolymorphicProps<T, NavigationMenuDescriptionProps<T>>,
) => {
  const [local, others] = splitProps(props as NavigationMenuDescriptionProps, [
    'class',
  ]);
  return (
    <NavigationMenuPrimitiveItemDescription
      class={cn('text-sm leading-snug text-muted-foreground', local.class)}
      {...others}
    />
  );
};

export {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuIcon,
  NavigationMenuViewport,
  NavigationMenuContent,
  NavigationMenuLink,
  NavigationMenuLabel,
  NavigationMenuDescription,
};
