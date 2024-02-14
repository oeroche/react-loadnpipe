import { useState, useEffect } from "react"

export type LoaderStatusMapper<W, T> = {
  loading: (v: W) => boolean
  ok: (v: W) => false | T
  error: (v: W) => boolean | Error
  skipped: (v: W) => boolean
}

export type LoaderStatus = 'initial' | 'loading' | 'ok' | Error | 'skipped'
export type Loadable<T> = T | LoaderInstanceNew<T>
type loaderValue<T> = T | typeof _loading | typeof _skipped | typeof _initial | Error

export const _loading = Symbol.for('loading')
export const _skipped = Symbol.for('skipped')
export const _initial = Symbol.for('initial')
type Deps = any[]


export type ExhaustivePipeArg<T, U> = {
  ok: (v: T, prev?: T) => U,
  error?: (v: any, prev?: T) => U,
  skipped?: (prev?: T) => U,
  loading?: (prev?: T) => U
} 

export type PartialPipeArg<T, U> = {
  ok: (v: T, prev?: T) => U,
  notOk: (v: T, prev?: T) => U,
}

export type Operator<A, T>  =  {
  name: string,
  execute:  (loader: LoaderInstanceNew<A>, previous: LoaderInstanceNew<any>, currentInnerLoaders: LoaderInstanceNew<any>[], previousInnerLoaders: LoaderInstanceNew<any>[]) => Promise<LoaderInstanceNew<T>> | LoaderInstanceNew<T>
}

export type PipeArg<T, U> = ((v: T, prev?: T) => U) | PartialPipeArg<T,U> | ExhaustivePipeArg<T, U>


export function isExhaustivePipeArg<T, U>(arg: PipeArg<T,U>): arg is ExhaustivePipeArg<T, U> {
  return 'ok' in arg
}

export function isPartialPipeArg<T, U>(arg: PipeArg<T,U>): arg is PartialPipeArg<T, U> {
  return 'ok' in arg && 'notOk' in arg
}

interface Pipe {
  <A,Z>(fn1: PipeArg<A, Z>, deps?: Deps): LoaderInstanceNew<Z>
  <A,B,Z>(fn1: PipeArg<A, B>, fn2: PipeArg<B, Z>, deps?: Deps): LoaderInstanceNew<Z>
  <A,B,C,Z>(fn1: PipeArg<A, B>, fn2: PipeArg<B, C>, fn3: PipeArg<C, Z>, deps?: Deps): LoaderInstanceNew<Z>
  <A,B,C,D,Z>(fn1: PipeArg<A, B>, fn2: PipeArg<B, C>, fn3: PipeArg<C, D>, fn4: PipeArg<D, Z>, deps?: Deps): LoaderInstanceNew<Z>
  <A,B,C,D,E,Z>(fn1: PipeArg<A, B>, fn2: PipeArg<B, C>, fn3: PipeArg<C, D>, fn4: PipeArg<D, E>, fn5: PipeArg<E, Z>, deps?: Deps): LoaderInstanceNew<Z>
  <A,B,C,D,E,F,Z>(fn1: PipeArg<A, B>, fn2: PipeArg<B, C>, fn3: PipeArg<C, D>, fn4: PipeArg<D, E>, fn5: PipeArg<E, F>, fn6: PipeArg<F, Z>, deps?: Deps): LoaderInstanceNew<Z>
  <A,B,C,D,E,F,G,Z>(fn1: PipeArg<A, B>, fn2: PipeArg<B, C>, fn3: PipeArg<C, D>, fn4: PipeArg<D, E>, fn5: PipeArg<E, F>, fn6: PipeArg<F, G>, fn7: PipeArg<G, Z>, deps?: Deps): LoaderInstanceNew<Z>
  <A,B,C,D,E,F,G,H,Z>(fn1: PipeArg<A, B>, fn2: PipeArg<B, C>, fn3: PipeArg<C, D>, fn4: PipeArg<D, E>, fn5: PipeArg<E, F>, fn6: PipeArg<F, G>, fn7: PipeArg<G, H>, fn8: PipeArg<H, Z>, deps?: Deps): LoaderInstanceNew<Z>
  <A,B,C,D,E,F,G,H,I,Z>(fn1: PipeArg<A, B>, fn2: PipeArg<B, C>, fn3: PipeArg<C, D>, fn4: PipeArg<D, E>, fn5: PipeArg<E, F>, fn6: PipeArg<F, G>, fn7: PipeArg<G, H>, fn8: PipeArg<H, I>, fn9: PipeArg<I, Z>, deps?: Deps): LoaderInstanceNew<Z>
  <A,B,C,D,E,F,G,H,I,J,Z>(fn1: PipeArg<A, B>, fn2: PipeArg<B, C>, fn3: PipeArg<C, D>, fn4: PipeArg<D, E>, fn5: PipeArg<E, F>, fn6: PipeArg<F, G>, fn7: PipeArg<G, H>, fn8: PipeArg<H, I>, fn9: PipeArg<I, J>, fn10: PipeArg<J, Z>, deps?: Deps): LoaderInstanceNew<Z>
  <A,B,C,D,E,F,G,H,I,J,K,Z>(fn1: PipeArg<A, B>, fn2: PipeArg<B, C>, fn3: PipeArg<C, D>, fn4: PipeArg<D, E>, fn5: PipeArg<E, F>, fn6: PipeArg<F, G>, fn7: PipeArg<G, H>, fn8: PipeArg<H, I>, fn9: PipeArg<I, J>, fn10: PipeArg<J, K>, fn11: PipeArg<K, Z>, deps?: Deps): LoaderInstanceNew<Z>
  <A,B,C,D,E,F,G,H,I,J,K,L,Z>(fn1: PipeArg<A, B>, fn2: PipeArg<B, C>, fn3: PipeArg<C, D>, fn4: PipeArg<D, E>, fn5: PipeArg<E, F>, fn6: PipeArg<F, G>, fn7: PipeArg<G, H>, fn8: PipeArg<H, I>, fn9: PipeArg<I, J>, fn10: PipeArg<J, K>, fn11: PipeArg<K, L>, fn12: PipeArg<L, Z>, deps?: Deps): LoaderInstanceNew<Z>
  <A,B,C,D,E,F,G,H,I,J,K,L,M,Z>(fn1: PipeArg<A, B>, fn2: PipeArg<B, C>, fn3: PipeArg<C, D>, fn4: PipeArg<D, E>, fn5: PipeArg<E, F>, fn6: PipeArg<F, G>, fn7: PipeArg<G, H>, fn8: PipeArg<H, I>, fn9: PipeArg<I, J>, fn10: PipeArg<J, K>, fn11: PipeArg<K, L>, fn12: PipeArg<L, M>, fn13: PipeArg<M, Z>, deps?: Deps): LoaderInstanceNew<Z>
  <A,B,C,D,E,F,G,H,I,J,K,L,M,N,Z>(fn1: PipeArg<A, B>, fn2: PipeArg<B, C>, fn3: PipeArg<C, D>, fn4: PipeArg<D, E>, fn5: PipeArg<E, F>, fn6: PipeArg<F, G>, fn7: PipeArg<G, H>, fn8: PipeArg<H, I>, fn9: PipeArg<I, J>, fn10: PipeArg<J, K>, fn11: PipeArg<K, L>, fn12: PipeArg<L, M>, fn13: PipeArg<M, N>, fn14: PipeArg<N, Z>, deps?: Deps): LoaderInstanceNew<Z>
}

interface MatchFromNotOk<prev, T> {
  ok<R>(cb: (data: T) => R): prev | R
}

interface MatchFromSkipped<prev, T> {
  loading<R>(cb: (prev?: T) => R): MatchFromLoading<prev | R, T>
}

interface MatchFromLoading<prev, T> {
  error<R>(cb: (e: Error) => R): MatchFromError<prev | R, T>
}

interface MatchFromError<prev, T> {
  ok<R>(cb: (data: T) => R): prev | R
}

interface LoaderMatcher<P> {
  skipped<R>(cb: (prev?: P) => R): MatchFromSkipped<R, P>
  notOk<R>(cb: (prev?: P) => R): MatchFromNotOk<R, P>
  loadingOrSkipped<R>(cb: (prev?: P) => R): MatchFromLoading<R, P>
}

class LoaderMatchImpl<T>
  implements
    LoaderMatcher<T>,
    MatchFromNotOk<T, any>,
    MatchFromSkipped<T, any>,
    MatchFromLoading<T, any>,
    MatchFromError<T, any>
{
  private finished?: boolean = false
  private result?: any

  // eslint-disable-next-line no-useless-constructor
  constructor(
    private readonly value: T | Error | typeof _loading | typeof _skipped,
  ) {}

  loadingOrSkipped<R>(cb: () => R): MatchFromLoading<any, T> {
    if (this.finished) {
      return this
    }
    if (this.value === _loading || this.value === _skipped) {
      this.result = cb()
      this.finished = true
    }
    return this
  }

  loading<val>(cb: () => val): MatchFromLoading<any, any> {
    if (this.finished) {
      return this
    }
    if (this.value === _loading) {
      this.result = cb()
      this.finished = true
    }
    return this
  }

  skipped<R>(cb: () => R): MatchFromSkipped<any, any> {
    if (this.finished) {
      return this
    }
    if (this.value === _skipped) {
      this.result = cb()
      this.finished = true
    }
    return this
  }

  notOk<R>(cb: () => R): MatchFromNotOk<any, any> {
    if (this.finished) {
      return this
    }
    if (
      this.value === _loading ||
      this.value === _skipped ||
      this.value instanceof Error
    ) {
      this.result = cb()
      this.finished = true
    } else {
    }
    return this
  }

  error<R>(cb: (e: Error) => R): MatchFromError<any, any> {
    if (this.finished) {
      return this
    }
    if (this.value instanceof Error) {
      this.result = cb(this.value)
      this.finished = true
    }
    return this
  }

  ok<result>(value: (value: T) => result): T | result {
    if (!this.finished) {
      this.result = value(this.value as T)
    }
    return this.result
  }
}

export function isOk<T>(value: loaderValue<T>): value is T {
  return value !== _loading && value !== _skipped && !(value instanceof Error)
}

function getStatus<T>(value: T | Error | typeof _loading | typeof _skipped): LoaderStatus {
  if (value === _loading) {
    return 'loading'
  } else if (value === _skipped) {
    return 'skipped'
  } else if (value instanceof Error) {
    return value
  } else {
    return 'ok'
  }
}

export type loaderInnerValue<T> = T | typeof _loading | typeof _skipped | typeof _initial | Error


export class LoaderInstanceNew<T> {
  private readonly _value: loaderValue<T>
  private readonly _dirty: boolean

  static wrap<T>(value: T | LoaderInstanceNew<T>): LoaderInstanceNew<T> {
    if(value instanceof LoaderInstanceNew) {
      return value
    }
    return new LoaderInstanceNew(value)
  }
  
  constructor(value: T | typeof _loading | typeof _skipped | typeof _initial | Error, dirty = false) {
    this._value = value
    this._dirty = dirty
  }

  pipe<R>(pipeFn: PipeArg<T, R>): LoaderInstanceNew<R> {
    let pipeArgs_: ExhaustivePipeArg<T, R>
      if(isPartialPipeArg(pipeFn)) {
        pipeArgs_ = {
          ok: pipeFn.ok as any,
          error: pipeFn.notOk as any,
          loading: pipeFn.notOk as any,
          skipped: pipeFn.notOk as any,
        }
      } else if(isExhaustivePipeArg(pipeFn)) {
        pipeArgs_ = {
          ok: pipeFn.ok as any,
          error: pipeFn.error ? pipeFn.error : (v: any) => v,
          loading: pipeFn.loading ? pipeFn.loading : (v: any) => v,
          skipped: pipeFn.skipped? pipeFn.skipped : (v: any) => v
        }
      } else {
        pipeArgs_ = {
          ok: pipeFn,
          error: (v) => v as any,
          loading: v => v as any,
          skipped: v => v as any
        }
      }

    if(!pipeArgs_) {
      throw new Error('no valid pipe argument for loader.pipe()')
    }

    if(this._value === _loading && pipeArgs_.loading) {
      return new LoaderInstanceNew(pipeArgs_.loading(this._value as T ))
    }
    if(this._value === _skipped && pipeArgs_.skipped) {
      return new LoaderInstanceNew(pipeArgs_.skipped(this._value as T ))
    }
    if(this._value instanceof Error && pipeArgs_.error) {
      return new LoaderInstanceNew(pipeArgs_.error(this._value as T ))
    }
    
    return new LoaderInstanceNew(pipeArgs_.ok(this._value as T ))
    
  }
  /**
   * @deprecated
   * @param source 
   * @returns 
   */
  update(source: T | typeof _loading | typeof _skipped | typeof _initial | Error) {
    return buildLoaderFromMatcher(source, {
      loading: () => source === _loading,
      ok: () => source !== _loading && source !== _skipped && !(source instanceof Error) ? source : false,
      error: () => source instanceof Error ? source : false,
      skipped: () => source === _skipped
    })
  }

  unwrapOr<R>(fallback: R): T | R {
    return this.match.notOk(() => fallback).ok((v) => v)
  }

  get match() {
    return new LoaderMatchImpl(this.value) as LoaderMatcher<T>
  }
  
  get status() {
    return getStatus(this.value)
  }

  get value() {
    return this._value
  }

  get dirty() {
    return this._dirty
  }
}

export function buildLoaderFromMatcher<W, T>(
  source: W,
  matcher: LoaderStatusMapper<W, T>,
): LoaderInstanceNew<T> {
    if (matcher.skipped(source)) {
      return new LoaderInstanceNew(_skipped) as unknown as LoaderInstanceNew<T>
    } else if (matcher.loading(source)) {
      return new LoaderInstanceNew(_loading) as unknown as LoaderInstanceNew<T>
    } else if (matcher.error(source)) {
      const value =
        matcher.error(source) instanceof Error
          ? (matcher.error(source) as Error)
          : new Error('error')

      return new LoaderInstanceNew(value) as unknown as LoaderInstanceNew<T>
    } else {
      const value = matcher.ok(source) as T
      return new LoaderInstanceNew(value) 
    }
}