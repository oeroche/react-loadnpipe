import { DependencyList, useCallback, useMemo } from "react";
import { LoaderInstanceNew, PipeArg, _loading, _skipped, isOk } from "..";
import { getExhaustivePipeArg } from "../utils/pipeArgs.utils";

export function useMemoLoader<T>(loader: LoaderInstanceNew<T>, cb: PipeArg<T,void>, deps: DependencyList) {
    const _cb = getExhaustivePipeArg(cb)
    return useMemo(() => {
        if(loader.value === _loading) {
            return _cb.loading?.()
        }
        if(loader.value === _skipped) {
            return _cb.skipped?.()
        }
        if(loader.value instanceof Error) {
            return _cb.error?.(loader.value)
        }
        if(isOk(loader.value)) {
            return _cb.ok(loader.value as T)
        }
        return () => {}
    }, [loader, ...deps])
}
