<script>
  import { url } from '@roxi/routify'

</script>

<main>
    <body class="flex flex-col min-h-screen ">
      <nav
        class="px-4 font-sans bg-white text-center flex justify-between items-center
        my-4 mx-auto container overflow-hidden">
        <a href={$url('/')}>
          <img src="/logo.svg" class="h-10" alt="logo" />
        </a>
      </nav>
      <hr />

      <div class="flex-grow">
        <slot />
      </div>

      <footer class="font-sans bg-black text-white">
        <div
          class="mx-auto max-w-2xl overflow-hidden flex justify-between
          items-center">
          <ul class="text-sm text-gray-700 list-none p-0 flex items-center">
            <li>
              <a href={$url('/')} class="block mr-4 w-32">
                <img src="/logo.svg" class="" alt="logo" />
              </a>
            </li>
            <li>
              <a
                href={$url('/empresa')}
                class="inline-block py-2 px-3 text-gray-200 hover:text-gray-400
                no-underline">
                Empresa
              </a>
            </li>
            <li>
              <a
                href={$url('/acercade')}
                class="inline-block py-2 px-3 text-gray-200 hover:text-gray-400
                no-underline">
                Acerca de
              </a>
            </li>
          </ul>
          <p class="inline-block py-2 px-3 text-gray-200 text-xs">
            ©2020-2022 Biale Hermanos S.H. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </body>
</main>
