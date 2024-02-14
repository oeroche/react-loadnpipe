import { useEffect, useMemo, useState } from "react";
import { Loadable, LoaderInstanceNew, _initial, _loading, _skipped } from "..";

type LoaderArray<l> = l extends readonly [Loadable<infer val>, ...infer rest]
  ? readonly [val, ...LoaderArray<rest>]
  : l extends readonly Loadable<infer val>[]
    ? readonly val[]
    : l extends readonly []
      ? readonly []
      : never;

export function useAllLoaders<T extends readonly LoaderInstanceNew<any>[]>(...loaders: T): LoaderInstanceNew<LoaderArray<T>> {

    const result = useMemo<LoaderInstanceNew<LoaderArray<T>>>(() => {
        if(loaders.some(l => l.status === 'skipped')) {
            return new LoaderInstanceNew(_skipped) as any
        }
        if(loaders.some(l => l.status === 'loading')) {
            return new LoaderInstanceNew(_loading)
        }
        if(loaders.some(l => l.value instanceof Error)) {
            const e = loaders.find(l => l.value instanceof Error)
            return new LoaderInstanceNew(e!.value)
        }

        return new LoaderInstanceNew(loaders.map(l => l.value))
    }, [...loaders])


    return result
}

export function useAnyLoader<T>(...loaders: LoaderInstanceNew<T>[]): LoaderInstanceNew<T> {
    if(loaders.some(l => l.status === 'ok')) {
        return new LoaderInstanceNew(loaders.find(l => l.status === 'ok')!.value)
    }

    if(loaders.some(l => l.status === 'skipped')) {
        return new LoaderInstanceNew(_skipped) as unknown as LoaderInstanceNew<T>
    }
    if(loaders.some(l => l.status === 'loading')) {
        return new LoaderInstanceNew(_loading) as unknown as LoaderInstanceNew<T>
    }
    if(loaders.some(l => l.value instanceof Error)) {
        const e = loaders.find(l => l.value instanceof Error)
        return new LoaderInstanceNew(e) as unknown as LoaderInstanceNew<T>
    }

    return new LoaderInstanceNew(_initial) as unknown as LoaderInstanceNew<T>

}