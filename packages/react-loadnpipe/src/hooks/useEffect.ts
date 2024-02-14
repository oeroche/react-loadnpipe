import { DependencyList, EffectCallback, useEffect, useMemo } from "react"
import { ExhaustivePipeArg, LoaderInstanceNew, PartialPipeArg, PipeArg, _loading, _skipped, isExhaustivePipeArg, isOk, isPartialPipeArg } from ".."
import { getExhaustivePipeArg } from "../utils/pipeArgs.utils"

export function useEffectLoader<T>(loader: LoaderInstanceNew<T>,  effect : PipeArg<T, ReturnType<EffectCallback>> , deps: DependencyList = [])  {
    const _effectCb = useMemo(() => getExhaustivePipeArg(effect), [])
    useEffect(() =>{
        if(loader.value === _loading)
            {return _effectCb.loading?.()}
        if(loader.value === _skipped)
        { 
            return _effectCb.skipped?.()
        }
        if(loader.value instanceof Error) {
            return _effectCb.error?.(loader.value)
        }
        return _effectCb.ok(loader.value as T)
        
    }, [loader, ...deps])
}


