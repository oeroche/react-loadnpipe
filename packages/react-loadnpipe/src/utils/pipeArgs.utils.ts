import { ExhaustivePipeArg, PartialPipeArg, PipeArg } from "..";

export function isExhaustivePipeArg<T, U>(arg: PipeArg<T,U>): arg is ExhaustivePipeArg<T, U> {
return 'ok' in arg
}

export function isPartialPipeArg<T, U>(arg: PipeArg<T,U>): arg is PartialPipeArg<T, U> {
return 'ok' in arg && 'notOk' in arg
}

export function getExhaustivePipeArg<T,U>(pipeFn: PipeArg<T, U>): ExhaustivePipeArg<T,U> {
    let result: ExhaustivePipeArg<T, U>
    if(isPartialPipeArg(pipeFn)) {
    result = {
        ok: pipeFn.ok as any,
        error: pipeFn.notOk as any,
        loading: pipeFn.notOk as any,
        skipped: pipeFn.notOk as any,
    }
    } else if(isExhaustivePipeArg(pipeFn)) {
    result = {
        ok: pipeFn.ok as any,
        error: pipeFn.error ? pipeFn.error : (v: any) => v,
        loading: pipeFn.loading ? pipeFn.loading : (v: any) => v,
        skipped: pipeFn.skipped? pipeFn.skipped : (v: any) => v
    }
    } else {
    result = {
        ok: pipeFn,
        error: (v) => v as any,
        loading: v => v as any,
        skipped: v => v as any
    }
    }
    return result
}