import Index from './layouts/index.svelte'
import NotFound from './layouts/notFound.svelte'
import Lots from './layouts/lots.svelte'

const routes = { '/': Index, '/lots/:bbl': Lots, '*': NotFound }

export { routes }
