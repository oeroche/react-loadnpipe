import { useState, useEffect } from "react"
import { Loadable, LoaderInstanceNew } from ".."

/**
 * Wrap a loadable (raw value or loader instance) into a loader instance
 * if a loader instance is passed, it will be returned as is
 * if a raw value is passed, it will be wrapped into a loader instance
 * @param value a Loadable
 * @returns a Loader
 */
export function useWrapLoader<T>(value: Loadable<T>) {
  const [result, setResult] = useState<LoaderInstanceNew<T>>(() => LoaderInstanceNew.wrap(value))

  useEffect(() => {
    setResult(LoaderInstanceNew.wrap(value))
  }, [value])

  return result
}