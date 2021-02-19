<script>
    import { goto, url } from '@roxi/routify'
    import { sesion } from '../../store'
  
    if ($sesion) {
      console.log($sesion)
      $goto('/admin/mapa')
    } else {
        $goto('/')
    }
  </script>