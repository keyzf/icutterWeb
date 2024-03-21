import Loadable from 'react-loadable';
import Loading from '@/components/PageLoading';

const Project = Loadable({
    loader: () => import('./Project'),
    loading: Loading
})
const Movie = Loadable({
    loader: () => import('./Movie'),
    loading: Loading
})

const CreateProject = Loadable({
    loader: () => import('./CreateProject'),
    loading: Loading
})

const MaterialMine = Loadable({
    loader: () => import('./MaterialMine'),
    loading: Loading
})

export default {
    Project,
    Movie,
    CreateProject,
    MaterialMine,
}