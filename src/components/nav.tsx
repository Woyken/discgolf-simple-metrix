import { A, useLocation } from "@solidjs/router";
import { createQuery } from "@tanstack/solid-query";
import { createMemo, Show, Suspense } from "solid-js";
import { discGolfMetrixGetAccountSettings } from "~/apiWrapper/getAccountSettings";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuDescription,
  NavigationMenuIcon,
  NavigationMenuItem,
  NavigationMenuLabel,
  NavigationMenuLink,
  NavigationMenuTrigger,
} from "./ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const useSettingsQuery = () => {
  return createQuery(() => ({
    queryKey: ["settings"],
    queryFn: async () => {
      const result = await discGolfMetrixGetAccountSettings();
      return result;
    },
  }));
};

export default function NavHandleLogin() {
  const location = useLocation();
  const isLoggedIn = createMemo(() => location.pathname !== "/login");
  return (
    <Show when={isLoggedIn()}>
      <Nav />
    </Show>
  );
}

function Nav() {
  return (
    <div class="flex items-center justify-between mx-auto px-4 py-4">
      <NavigationMenu>
        <NavigationMenuTrigger as={A} href="/">
          Disc Golf Metrix
        </NavigationMenuTrigger>
        <NavigationMenuItem>
          <NavigationMenuTrigger>
            Getting started
            <NavigationMenuIcon />
          </NavigationMenuTrigger>

          <NavigationMenuContent class="grid w-[90vw] grid-rows-3 gap-3 sm:w-[500px] sm:grid-cols-2 md:w-[500px] lg:w-[500px] lg:grid-cols-[.75fr_1fr] [&>li:first-child]:row-span-3">
            <NavigationMenuLink
              class="box-border flex size-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline focus:shadow-md"
              href="https://solid-ui.com"
            >
              <NavigationMenuLabel class="mb-2 mt-4 text-lg font-medium">
                Lorem.
              </NavigationMenuLabel>
              <NavigationMenuDescription class="text-sm leading-tight text-muted-foreground">
                Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                Accusamus ratione consectetur blanditiis incidunt ducimus cum.
              </NavigationMenuDescription>
            </NavigationMenuLink>

            <NavigationMenuLink href="/docs">
              <NavigationMenuLabel>Lorem, ipsum.</NavigationMenuLabel>
              <NavigationMenuDescription>
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Minima
                sint illo nam!
              </NavigationMenuDescription>
            </NavigationMenuLink>

            <NavigationMenuLink href="/docs/installation/overview">
              <NavigationMenuLabel>Lorem, ipsum.</NavigationMenuLabel>
              <NavigationMenuDescription>
                Lorem, ipsum dolor sit amet consectetur adipisicing.
              </NavigationMenuDescription>
            </NavigationMenuLink>

            <NavigationMenuLink href="/docs/dark-mode/overview">
              <NavigationMenuLabel>Lorem.</NavigationMenuLabel>
              <NavigationMenuDescription>
                Lorem ipsum dolor sit amet.
              </NavigationMenuDescription>
            </NavigationMenuLink>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>
            Overview
            <NavigationMenuIcon />
          </NavigationMenuTrigger>

          <NavigationMenuContent class="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
            <NavigationMenuLink href="#">
              <NavigationMenuLabel>Introduction</NavigationMenuLabel>
              <NavigationMenuDescription>
                Lorem ipsum dolor sit amet.
              </NavigationMenuDescription>
            </NavigationMenuLink>

            <NavigationMenuLink href="#">
              <NavigationMenuLabel>Getting started</NavigationMenuLabel>
              <NavigationMenuDescription>
                Lorem ipsum dolor sit amet consectetur.
              </NavigationMenuDescription>
            </NavigationMenuLink>
            <NavigationMenuLink href="#">
              <NavigationMenuLabel>Lorem, ipsum.</NavigationMenuLabel>
              <NavigationMenuDescription>
                Lorem ipsum, dolor sit amet consectetur adipisicing.
              </NavigationMenuDescription>
            </NavigationMenuLink>
            <NavigationMenuLink href="#">
              <NavigationMenuLabel>Lorem.</NavigationMenuLabel>
              <NavigationMenuDescription>
                Lorem ipsum dolor sit amet consectetur.
              </NavigationMenuDescription>
            </NavigationMenuLink>
            <NavigationMenuLink href="#">
              <NavigationMenuLabel>Lorem.</NavigationMenuLabel>
              <NavigationMenuDescription>
                Lorem, ipsum dolor.
              </NavigationMenuDescription>
            </NavigationMenuLink>
            <NavigationMenuLink href="#">
              <NavigationMenuLabel>Lorem, ipsum.</NavigationMenuLabel>
              <NavigationMenuDescription>
                Lorem ipsum dolor sit.
              </NavigationMenuDescription>
            </NavigationMenuLink>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenu>
      <UserNav />
    </div>
  );
}

function UserNav() {
  const settingsQuery = useSettingsQuery();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        as={Button<"button">}
        variant="ghost"
        class="relative h-8 w-8 rounded-full"
      >
        <Avatar class="h-8 w-8">
          <Suspense>
            <Show
              when={settingsQuery.data?.imageUrl}
              fallback={
                <AvatarFallback>
                  {settingsQuery.data?.firstName?.[0].toUpperCase() ?? "F"}
                  {settingsQuery.data?.lastName?.[0].toUpperCase() ?? "L"}
                </AvatarFallback>
              }
            >
              {(url) => <AvatarImage alt="User avatar" src={url().href} />}
            </Show>
          </Suspense>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent class="w-56">
        <DropdownMenuLabel class="font-normal">
          <div class="flex flex-col space-y-1">
            <p class="text-sm font-medium leading-none">
              <Suspense>
                {settingsQuery.data?.firstName} {settingsQuery.data?.lastName}
              </Suspense>
            </p>
            <p class="text-xs leading-none text-muted-foreground">
              <Suspense>{settingsQuery.data?.email}</Suspense>
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem as={A} href="/profile">
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem as={A} href="/settings">
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem as={A} href="/logout">
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
