import { useQueries, useQuery } from '@tanstack/react-query'
import { hasModule, loadModule } from './courses'

/** Loads a module's content chunk on demand. `mod` is undefined while loading or for unknown ids. */
export function useModule(courseId: string | undefined, id: string | undefined) {
  const known = courseId !== undefined && id !== undefined && hasModule(courseId, id)
  const { data, isLoading } = useQuery(moduleQuery(courseId, id, known))
  return { mod: data, loading: known && isLoading, notFound: !known }
}

const moduleQuery = (courseId: string | undefined, id: string | undefined, enabled: boolean) => ({
  queryKey: ['mod', courseId, id],
  queryFn: () => loadModule(courseId!, id!),
  enabled,
  staleTime: Infinity,
})

/** Several modules of one course at once (same cache as useModule), keyed by module id. Unwritten or
 *  still-loading modules are missing from the result. */
export function useModules(courseId: string, ids: string[]) {
  return useQueries({
    queries: ids.map((id) => moduleQuery(courseId, id, hasModule(courseId, id))),
    combine: (results) => Object.fromEntries(ids.flatMap((id, i) => (results[i].data ? [[id, results[i].data]] : []))),
  })
}
