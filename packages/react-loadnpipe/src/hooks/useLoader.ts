import { useEffect, useState } from 'react'
import { Loadable, LoaderInstanceNew, LoaderStatusMapper, _skipped, buildLoaderFromMatcher, isOk } from '../core/loader'


type loaderCreateOptions = {
  noFlickering?: boolean
}

/**
 * create a loader from a value and a matcher
 * @param value 
 * @param matcher 
 * @param options 
 * @returns 
 */
export function useLoader<W, T>(value: W, matcher: LoaderStatusMapper<W, T>, options: loaderCreateOptions = {}) {
  const [loader, setLoader] = useState(() => buildLoaderFromMatcher(value, matcher))
  useEffect(() => {
    if (options.noFlickering && matcher.loading(value) && loader.status === 'ok') {
      return
    }
    setLoader(buildLoaderFromMatcher(value, matcher))
  }, [value])
  return loader
}

/**
 * create a loader from a promise
 * @param promise 
 * @returns 
 */
export function usePromiseLoader<T>(promise: Promise<T> | null | undefined) {
  const [value, setValue] = useState<{ isLoading: boolean, isSkipped: boolean, data: T | null, error: Error | null}>(() => ({
    isLoading: true,
    isSkipped: false,
    data: null,
    error: null
  }))

  useEffect(() => {
    let ignore = false
    setValue({
      isLoading: true,
      isSkipped: false,
      data: null,
      error: null
    })
    if(!promise) {
      setValue({
        isLoading: false,
        isSkipped: true,
        data: null,
        error: null
      })
      return
    }
    promise
      .then((v) => {
        console.log(ignore)
        if(ignore) {
          return
        }

        setValue({
          isLoading: false,
          isSkipped: false,
          data: v,
          error: null
        })
      })
      .catch((e) => {
        if(ignore) {
          return
        }
        setValue({
          isLoading: false,
          isSkipped: false,
          data: null,
          error: e instanceof Error ? e : new Error('error')
        })
      })
      return () => {
        ignore = true
      }
      
  }, [promise])

  const loader = useLoader(value, {
    loading: (v) => v.isLoading,
    ok: (v) => v.data as T,
    error: (v) => v.error ? v.error : false,
    skipped: (v) => v.isSkipped
  })

  return  loader
}

