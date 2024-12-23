import type { ValidComponent } from 'solid-js';
import { splitProps } from 'solid-js';

import type { PolymorphicProps } from '@kobalte/core/polymorphic';
import {
  Root as SkeletonPrimitiveRoot,
  type SkeletonRootProps as SkeletonPrimitiveSkeletonRootProps,
} from '@kobalte/core/skeleton';

import { cn } from '~/lib/utils';

type SkeletonRootProps<T extends ValidComponent = 'div'> =
  SkeletonPrimitiveSkeletonRootProps<T> & { class?: string | undefined };

const Skeleton = <T extends ValidComponent = 'div'>(
  props: PolymorphicProps<T, SkeletonRootProps<T>>,
) => {
  const [local, others] = splitProps(props as SkeletonRootProps, ['class']);
  return (
    <SkeletonPrimitiveRoot
      class={cn(
        "bg-primary/10 data-[animate='true']:animate-pulse",
        local.class,
      )}
      {...others}
    />
  );
};

export { Skeleton };
