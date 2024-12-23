import type { ValidComponent } from 'solid-js';
import { splitProps } from 'solid-js';

import {
  Fallback as ImagePrimitiveFallback,
  type ImageFallbackProps as ImagePrimitiveImageFallbackProps,
  type ImageImgProps as ImagePrimitiveImageImgProps,
  type ImageRootProps as ImagePrimitiveImageRootProps,
  Img as ImagePrimitiveImg,
  Root as ImagePrimitiveRoot,
} from '@kobalte/core/image';
import type { PolymorphicProps } from '@kobalte/core/polymorphic';

import { cn } from '~/lib/utils';

type AvatarRootProps<T extends ValidComponent = 'span'> =
  ImagePrimitiveImageRootProps<T> & {
    class?: string | undefined;
  };

const Avatar = <T extends ValidComponent = 'span'>(
  props: PolymorphicProps<T, AvatarRootProps<T>>,
) => {
  const [local, others] = splitProps(props as AvatarRootProps, ['class']);
  return (
    <ImagePrimitiveRoot
      class={cn(
        'relative flex size-10 shrink-0 overflow-hidden rounded-full',
        local.class,
      )}
      {...others}
    />
  );
};

type AvatarImageProps<T extends ValidComponent = 'img'> =
  ImagePrimitiveImageImgProps<T> & {
    class?: string | undefined;
  };

const AvatarImage = <T extends ValidComponent = 'img'>(
  props: PolymorphicProps<T, AvatarImageProps<T>>,
) => {
  const [local, others] = splitProps(props as AvatarImageProps, ['class']);
  return (
    <ImagePrimitiveImg
      class={cn('aspect-square size-full', local.class)}
      {...others}
    />
  );
};

type AvatarFallbackProps<T extends ValidComponent = 'span'> =
  ImagePrimitiveImageFallbackProps<T> & { class?: string | undefined };

const AvatarFallback = <T extends ValidComponent = 'span'>(
  props: PolymorphicProps<T, AvatarFallbackProps<T>>,
) => {
  const [local, others] = splitProps(props as AvatarFallbackProps, ['class']);
  return (
    <ImagePrimitiveFallback
      class={cn(
        'flex size-full items-center justify-center bg-muted',
        local.class,
      )}
      {...others}
    />
  );
};

export { Avatar, AvatarImage, AvatarFallback };
