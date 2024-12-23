import type { JSX, ValidComponent } from 'solid-js';
import { splitProps } from 'solid-js';

import {
  Ellipsis as PaginationPrimitiveEllipsis,
  Item as PaginationPrimitiveItem,
  Items as PaginationPrimitiveItems,
  Next as PaginationPrimitiveNext,
  type PaginationEllipsisProps as PaginationPrimitivePaginationEllipsisProps,
  type PaginationItemProps as PaginationPrimitivePaginationItemProps,
  type PaginationNextProps as PaginationPrimitivePaginationNextProps,
  type PaginationPreviousProps as PaginationPrimitivePaginationPreviousProps,
  type PaginationRootProps as PaginationPrimitivePaginationRootProps,
  Previous as PaginationPrimitivePrevious,
  Root as PaginationPrimitiveRoot,
} from '@kobalte/core/pagination';
import type { PolymorphicProps } from '@kobalte/core/polymorphic';

import { buttonVariants } from '~/components/ui/button_renameme';
import { cn } from '~/lib/utils';

const PaginationItems = PaginationPrimitiveItems;

type PaginationRootProps<T extends ValidComponent = 'nav'> =
  PaginationPrimitivePaginationRootProps<T> & { class?: string | undefined };

const Pagination = <T extends ValidComponent = 'nav'>(
  props: PolymorphicProps<T, PaginationRootProps<T>>,
) => {
  const [local, others] = splitProps(props as PaginationRootProps, ['class']);
  return (
    <PaginationPrimitiveRoot
      class={cn(
        '[&>*]:flex [&>*]:flex-row [&>*]:items-center [&>*]:gap-1',
        local.class,
      )}
      {...others}
    />
  );
};

type PaginationItemProps<T extends ValidComponent = 'button'> =
  PaginationPrimitivePaginationItemProps<T> & { class?: string | undefined };

const PaginationItem = <T extends ValidComponent = 'button'>(
  props: PolymorphicProps<T, PaginationItemProps<T>>,
) => {
  const [local, others] = splitProps(props as PaginationItemProps, ['class']);
  return (
    <PaginationPrimitiveItem
      class={cn(
        buttonVariants({
          variant: 'ghost',
        }),
        'size-10 data-[current]:border',
        local.class,
      )}
      {...others}
    />
  );
};

type PaginationEllipsisProps<T extends ValidComponent = 'div'> =
  PaginationPrimitivePaginationEllipsisProps<T> & {
    class?: string | undefined;
  };

const PaginationEllipsis = <T extends ValidComponent = 'div'>(
  props: PolymorphicProps<T, PaginationEllipsisProps<T>>,
) => {
  const [local, others] = splitProps(props as PaginationEllipsisProps, [
    'class',
  ]);
  return (
    <PaginationPrimitiveEllipsis
      class={cn('flex size-10 items-center justify-center', local.class)}
      {...others}
    >
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
        <title>Pagination ellipsis</title>
        <circle cx="12" cy="12" r="1" />
        <circle cx="19" cy="12" r="1" />
        <circle cx="5" cy="12" r="1" />
      </svg>
      <span class="sr-only">More pages</span>
    </PaginationPrimitiveEllipsis>
  );
};

type PaginationPreviousProps<T extends ValidComponent = 'button'> =
  PaginationPrimitivePaginationPreviousProps<T> & {
    class?: string | undefined;
    children?: JSX.Element;
  };

const PaginationPrevious = <T extends ValidComponent = 'button'>(
  props: PolymorphicProps<T, PaginationPreviousProps<T>>,
) => {
  const [local, others] = splitProps(props as PaginationPreviousProps, [
    'class',
    'children',
  ]);
  return (
    <PaginationPrimitivePrevious
      class={cn(
        buttonVariants({
          variant: 'ghost',
        }),
        'gap-1 pl-2.5',
        local.class,
      )}
      {...others}
    >
      {local.children ?? (
        <>
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
            <title>Pagination previous</title>
            <path d="M15 6l-6 6l6 6" />
          </svg>
          <span>Previous</span>
        </>
      )}
    </PaginationPrimitivePrevious>
  );
};

type PaginationNextProps<T extends ValidComponent = 'button'> =
  PaginationPrimitivePaginationNextProps<T> & {
    class?: string | undefined;
    children?: JSX.Element;
  };

const PaginationNext = <T extends ValidComponent = 'button'>(
  props: PolymorphicProps<T, PaginationNextProps<T>>,
) => {
  const [local, others] = splitProps(props as PaginationNextProps, [
    'class',
    'children',
  ]);
  return (
    <PaginationPrimitiveNext
      class={cn(
        buttonVariants({
          variant: 'ghost',
        }),
        'gap-1 pl-2.5',
        local.class,
      )}
      {...others}
    >
      {local.children ?? (
        <>
          <span>Next</span>
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
            <title>Pagination next</title>
            <path d="M9 6l6 6l-6 6" />
          </svg>
        </>
      )}
    </PaginationPrimitiveNext>
  );
};

export {
  Pagination,
  PaginationItems,
  PaginationItem,
  PaginationEllipsis,
  PaginationPrevious,
  PaginationNext,
};
