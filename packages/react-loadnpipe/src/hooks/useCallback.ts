import { DependencyList, useCallback } from "react";
import { LoaderInstanceNew, PipeArg, _loading, _skipped, isOk } from "..";
import { getExhaustivePipeArg } from "../utils/pipeArgs.utils";

export function useCallbackLoader<T, U>(loader: LoaderInstanceNew<T>, cb: (loader: T, ...args: any) => void, deps: DependencyList) {
    const _cb = getExhaustivePipeArg(cb)
    return useCallback((...args: any) => {
        if(loader.value === _loading) {
            return _cb.loading?.(...args)
        }
        if(loader.value === _skipped) {
            return _cb.skipped?.(...args)
        }
        if(loader.value instanceof Error) {
            return _cb.error?.(loader.value, ...args)
        }
        if(isOk(loader.value)) {
            return _cb.ok(loader.value, ...args)
        }
        return () => {}
    }, [loader, ...deps])
}
