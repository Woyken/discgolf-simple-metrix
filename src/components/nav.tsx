// import { useLocation } from "@solidjs/router";

import { A } from "@solidjs/router";

export default function Nav() {
  // const location = useLocation();
  // const active = (path: string) =>
  //   path == location.pathname
  //     ? "border-sky-600"
  //     : "border-transparent hover:border-sky-600";
  return (
    <div class="navbar bg-base-100">
      <div class="flex-none">
        <button class="btn btn-square btn-ghost">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            class="inline-block h-5 w-5 stroke-current"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </button>
      </div>
      <div class="flex-1">
        <a class="btn btn-ghost text-xl">daisyUI</a>
      </div>
      <div class="flex-none">
        <button class="btn btn-square btn-ghost">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            class="inline-block h-5 w-5 stroke-current"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
            ></path>
          </svg>
        </button>
        <div class="dropdown dropdown-end">
          <div
            tabindex="0"
            role="button"
            class="btn btn-ghost btn-circle avatar"
          >
            <div class="w-10 rounded-full">
              <img
                alt="Tailwind CSS Navbar component"
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
              />
            </div>
          </div>
          <ul
            tabindex="0"
            class="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            <li>
              <A href="/profile">Profile</A>
            </li>
            <li>
              <A href="/settings">Settings</A>
            </li>
            <li>
              <A href="/logout">Logout</A>
            </li>
          </ul>
        </div>
      </div>
    </div>

    // <nav class="navbar bg-base-100">
    //   <ul class="container flex items-center p-3 text-gray-200">
    //     <li class={`border-b-2 ${active("/")} mx-1.5 sm:mx-6`}>
    //       <a href="/">Home</a>
    //     </li>
    //     <li class={`border-b-2 ${active("/about")} mx-1.5 sm:mx-6`}>
    //       <a href="/about">About</a>
    //     </li>
    //     <li class={`border-b-2 ${active("/login")} mx-1.5 sm:mx-6`}>
    //       <a href="/login">Login</a>
    //     </li>
    //   </ul>
    // </nav>
  );
}
