import { useEffect, useMemo, useState } from "react"
import { LoaderInstanceNew, PipeArg, _skipped, isOk, loaderInnerValue } from ".."

type Deps = any[]

type Operator<A, T> = {
  name: string,
  execute: (from: LoaderInstanceNew<A>,  context: ExecutionContext,  next: (loader: LoaderInstanceNew<any>, ctx?: ExecutionContext) => void) => void
}

type ExecutionContext = {
  index: number,
  currentInnerLoaders: LoaderInstanceNew<any>[],
  //readonly previousInnerLoaders: LoaderInstanceNew<any>[],
  isDirty: boolean
}

interface Pipe {
  <A, Z>(loader: LoaderInstanceNew<A>, pipeArg1: PipeArg<A, Z> | Operator<A,Z>, deps?: Deps): LoaderInstanceNew<Z>
  <A, B, Z>(loader: LoaderInstanceNew<A>, pipeArg1: PipeArg<A, B> | Operator<A, B>, pipeArg2: PipeArg<B, Z> | Operator<B, Z>, deps?: Deps): LoaderInstanceNew<Z>
  <A, B, C, Z>(loader: LoaderInstanceNew<A>, pipeArg1: PipeArg<A, B> | Operator<A, B>, pipeArg2: PipeArg<B, C> | Operator<B, C>, pipeArg3: PipeArg<C, Z> | Operator<C, Z>, deps?: Deps): LoaderInstanceNew<Z>
  <A, B, C, D, Z>(loader: LoaderInstanceNew<A>, pipeArg1: PipeArg<A, B> | Operator<A, B>, pipeArg2: PipeArg<B, C> | Operator<B, C>, pipeArg3: PipeArg<C, D> | Operator<C, D>, pipeArg4: PipeArg<D, Z> | Operator<D, Z>, deps?: Deps): LoaderInstanceNew<Z>
  <A, B, C, D, E, Z>(loader: LoaderInstanceNew<A>, pipeArg1: PipeArg<A, B> | Operator<A, B>, pipeArg2: PipeArg<B, C> | Operator<B, C>, pipeArg3: PipeArg<C, D> | Operator<C, D>, pipeArg4: PipeArg<D, E> | Operator<D, E>, pipeArg5: PipeArg<E, Z> | Operator<E, Z>, deps?: Deps): LoaderInstanceNew<Z>
  <A, B, C, D, E, F, Z>(loader: LoaderInstanceNew<A>, pipeArg1: PipeArg<A, B> | Operator<A, B>, pipeArg2: PipeArg<B, C> | Operator<B, C>, pipeArg3: PipeArg<C, D> | Operator<C, D>, pipeArg4: PipeArg<D, E> | Operator<D, E>, pipeArg5: PipeArg<E, F> | Operator<E, F>, deps?: Deps): LoaderInstanceNew<Z>
  <A, B, C, D, E, F, G, Z>(loader: LoaderInstanceNew<A>, pipeArg1: PipeArg<A, B> | Operator<A, B>, pipeArg2: PipeArg<B, C> | Operator<B, C>, pipeArg3: PipeArg<C, D> | Operator<C, D>, pipeArg4: PipeArg<D, E> | Operator<D, E>, pipeArg5: PipeArg<E, F> | Operator<E, F>, pipeArg6: PipeArg<F, G> | Operator<F, G>, deps?: Deps): LoaderInstanceNew<Z>
}


export const map = <A, B>(fn: (a: A) => B): Operator<A, B> => ({
  name: 'map',
  execute: (from, c, next) => {
    next(from.pipe(fn))
  }
})

export const reduce = <A>(fn: (a: A, b: A) => A): Operator<A,A> => {
    let previousOkValue: A | undefined = undefined
    let previousFrom: LoaderInstanceNew<A> | undefined = undefined
    let previous: LoaderInstanceNew<A> | undefined = undefined
    let wasDirty = false
    return {
    name: 'reduce',
    execute: (from, c, next) => {
      let result
      if(isOk(from.value) && previousOkValue  && previousFrom && (!isOk(previousFrom.value) || (!c.isDirty && wasDirty))) { // Issue with no flickering we de not pass by a not ok value maybe add a marker to the loader (like dirty)
        result = new LoaderInstanceNew(fn(from.value, previousOkValue)) 
        previousFrom = from
        previousOkValue = fn(from.value, previousOkValue)
      }
      else if(isOk(from.value) && !previousOkValue) {
        result = from
        previousOkValue = from.value
        previousFrom = from
      }
      else {
        result = previous ? previous : from
        previousFrom = from
      }
      wasDirty = c.isDirty
      previous = result
      next(result)
    }
  }
}

function deepEqual(x: any, y: any) {
  if (x === y) {
    return true;
  }
  else if ((typeof x == "object" && x != null) && (typeof y == "object" && y != null)) {
    if (Object.keys(x).length != Object.keys(y).length)
      return false;

    for (var prop in x) {
      if (y.hasOwnProperty(prop))
      {  
        if (! deepEqual(x[prop], y[prop]))
          return false;
      }
      else
        return false;
    }
    
    return true;
  }
  else 
    return false;
}

export const inspect = <A>(fn: (a: loaderInnerValue<A>) => void): Operator<A,A> => {
  let previous: LoaderInstanceNew<A> | undefined = undefined
  return {
    name: 'inspect',
    execute: (from, c, next) => {
      if(!previous) {
        fn(from.value)
      }
      if(previous && !deepEqual(previous.value, from.value)) {
        fn(from.value)
      }
      previous = from
      next(from)
    }
  }
}

export const filter = <A>(fn: (a: A) => boolean): Operator<A,A> => ({
  name: 'filter',
  execute: (loader, c, next) => {
    if(isOk(loader.value) && fn(loader.value)) {
      return next(loader)
    }
    return next(new LoaderInstanceNew(_skipped) as LoaderInstanceNew<A>)
  }
})

export const noFlickering = <A>(): Operator<A,A> => {
 let previous: LoaderInstanceNew<A> | undefined = undefined
 return {
  name: 'noFlickering',
  execute: (from, c, next) => {
    if(previous && isOk(previous) && !isOk(from.value)) { 
      return next(previous, {...c, isDirty: true})
    }
    previous = from
    return next(from)
  }
}
}

export const tap = <A>(fn: (a: A) => void): Operator<A,A> => ({
  name: 'tap',
  execute: (from, c, next) => {
    if(from.status === 'ok' && isOk(from.value)) {
     fn(from.value)
    }
    return next(from)
  }
})


export const debounce = <A>(time: number): Operator<A,A> => {
  let timeout: any
  let previous: LoaderInstanceNew<A> | undefined = undefined
  return {
    name: 'debounce',
    execute: (from, c, next) => {
      clearTimeout(timeout)
      const index = c.index
      timeout = setTimeout(() => {
        next(from, {...c, index }) // we will pursue later
      }, time)
      if(previous) {
        next(previous)
      } else {
        previous = new LoaderInstanceNew(_skipped) as LoaderInstanceNew<A> 
        next(previous)
      }
    }
  }

}

const isOperator = (arg: any): arg is Operator<any, any> => {
  return !!(arg && arg.name && arg.execute)
}



export const usePipeLoader: Pipe = (loader: LoaderInstanceNew<any>,...pipeFns: any[]) => {
  const [result, setResult] = useState<LoaderInstanceNew<any>>(() => new LoaderInstanceNew(_skipped) as LoaderInstanceNew<any>)
  
  let _deps = [loader.value]
  let pipeFns_: PipeArg<any, any>[] = pipeFns

  if(pipeFns[pipeFns.length - 1] instanceof Array) {
    _deps = [loader.value, ...pipeFns[pipeFns.length - 1]];
    pipeFns_ = pipeFns.slice(0, length - 1) as PipeArg<any, any>[]
  }

  const chainOfResponsability = useMemo(() => { // useChainOfResponsability ? Maybe a builder could be nice
    //create handlers
    const handlers = pipeFns_.map((fn) => {
      return new Handler((from, context, next) => {
        if(isOperator(fn)) {
            fn.execute(from, context, next)
            return
        }
        next(from.pipe(fn))
      })
    })

    //make the chain
    handlers.forEach((handler, index, handlers) => {
      if(!handlers[index + 1]) {
        return
      }
      handler.setNext(handlers[index + 1])
    })

    return handlers[0]
  }
, [])


  useEffect(() => {

    let ignore = false; // ignore pending updates if a new occurs

    const initialContext: ExecutionContext = {
      index: 0,
      currentInnerLoaders: [],
      isDirty: false
    }
    

    if(!chainOfResponsability) {
      setResult(loader)
    }
    
    chainOfResponsability.handle(loader, initialContext , c => {
      if(ignore) { // a new update is pending we ignore this one
        return
      }
      setResult(() => c.currentInnerLoaders[c.currentInnerLoaders.length - 1])
    })
    return () => {
      ignore = true
    }
  }, _deps)

  if(!result) {
    return loader
  }
  return result 
}


// Chain of responsability pattern
class Handler<A,T> {
  private nextHandler?: Handler<T, any>;
  private index: number = 0
  constructor(private handler: (from: LoaderInstanceNew<A>, context: ExecutionContext, next: (l: LoaderInstanceNew<T>) => void) => void) {}
  setNext(handler: Handler<T, any>) {
    handler.setIndex(this.index + 1)
    this.nextHandler = handler
  }

  handle(from: LoaderInstanceNew<any>,context: ExecutionContext, onFinished?: (c: ExecutionContext) => void) {
    const next = (loader: LoaderInstanceNew<any>, ctx = context) => {
      const from = loader
      ctx.currentInnerLoaders[this.index] = loader 
      ctx.index = this.index + 1

      if(this.nextHandler) {
         this.nextHandler.handle(from, ctx, onFinished)
      }
      else {
        onFinished?.(context)
      }
    }

    this.handler(from, context, next)

  }
  

  /**
   * used to keep track of the order of the handlers
   **/
  private setIndex(index: number) {
    this.index = index
  }
}