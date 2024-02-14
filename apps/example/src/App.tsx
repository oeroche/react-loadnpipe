import { useState } from 'react'
import './App.css'
import { usePromise$, usePipe$, useLoader, map, noFlickering, filter } from 'react-loadnpipe'
import { DocumentNode, NoInfer, OperationVariables, QueryHookOptions, TypedDocumentNode, gql, useQuery } from '@apollo/client'
import ClassicPromiseResolution from './usePromiseComp/classic'
import LnpPromiseResolution from './usePromiseComp/lnp'


function* generator() {
  let id = 0
  while (true) {
    yield id++
  }
}

const gen = generator()

function stringOfLength(length: number) {
  return new Array(length).fill('a').join('')
}

async function loadSomething() {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  const nextId = gen.next().value
  return { foo: 'hello' + stringOfLength(nextId || 0), id: nextId}
}

// async function loadSomethingElse() {
//   await new Promise((resolve) => setTimeout(resolve, 4000))
//   return { baz: 'world!', id: gen.next().value }
// }

async function loadSomethingWithError(): Promise<{foo: string; id: number | void }> {
  await new Promise((resolve) => setTimeout(resolve, 2000))
  throw new Error('Something went wrong')
}


// usage with apollo client
function useQuery$<TData = any, TVariables extends OperationVariables = OperationVariables>(query: DocumentNode | TypedDocumentNode<TData, TVariables>, options?: QueryHookOptions<NoInfer<TData>, NoInfer<TVariables>>) {
  const queryObject = useQuery(query, options)
  const loader = useLoader(queryObject, {
    loading(v) {
      return v.loading
    },
    error(v) {
      return v.error ? v.error : false
    },
    ok(v) {
      return v
    },
    skipped(v) {
      return !v.called
    }
  })

  return [loader, queryObject] as const
}

//TODO: add example with fetch and react query.

const RICKANDMORTYQUERY = gql`
  query rickAndMorty {
    characters {
      results {
        name
      }
    }
  }
`

function App() {
  const [promise, setPromise] = useState<Promise<{foo: string, id: number | void}>>(() => loadSomething())
  //const [promise2, setPromise2] = useState<Promise<{baz: string, id: number | void}>>(() => loadSomethingElse())
  const hello$ = usePromise$(promise);
  //const world$ = usePromise$(promise2);
  //const helloWorld$ = useAll$(hello$, world$).pipe(([a, b]) => ([a.foo, b.baz].join(' '))); // transform a tuple of loaders into a loader of a tuple
  const data$ = usePipe$(hello$,
    noFlickering(),
    a => a.foo.length,
    filter((v: number) => v > 10),
    map((v: number) => v.toString()),
    a => a
  )


//   const [rickAndMorty$] = useQuery$(RICKANDMORTYQUERY) // TODO: create a version that derives from a loader
//  // const noflickeringData$ = usePipe$(hello$, (v) => v.foo)
  
//    const mapNotOKSource$ = usePromise$(promise2)
//   // const mappedNotOk$ = usePipe$(mapNotOKSource$, {
//   //   notOk: () => "it is ok though",
//   //   ok: (v) => v.baz
//   // })

   return (
    <>
      <ClassicPromiseResolution />
      <LnpPromiseResolution />
      <div>
        {/* {
        hello$.match
        .skipped(() => <div>Skipped</div>)
        .loading(() => <div>Loading...</div>)
        .error((e) => <div>Error: {e.message}</div>)
        .ok((data) => <div>Ok: {data.foo} {data.foo.length} </div>)
       }

       {
        data$.match
        .notOk(() => <div>not ok</div>)
        .ok((data) => <div>Ok: {data}</div>)
       } */}
       {/* {
        noflickeringData$.match
        .loadingOrSkipped(() => <div>Loading...</div>)
        .error((e) => <div>Error: {e.message}</div>)
        .ok((data) => <div>Ok no flickering: {`${data}`}</div>)
       } */}
       {/* {
        helloWorld$.match
        .loadingOrSkipped(() => <div>Loading...</div>)
        .error((e) => <div>Error: {e.message}</div>)
        .ok((v) => <div>Ok: {v}</div>)
       }
      {
        rickAndMorty$.match
        .loadingOrSkipped(() => <div>Loading...</div>)
        .error((e) => <div>Error: {e.message}</div>)
        .ok((v) => <div>Ok: {v.data.characters.results.map((c) => c.name).join(', ')}</div>)
      }
      {
        rickAndMorty$.match
        .loadingOrSkipped(() => <div>Loading...</div>)
        .error((e) => <div>Error: {e.message}</div>)
        .ok((v) => (<button onClick={() => v.refetch()}>Reload</button>))
      } */}
      {/* {
        mappedNotOk$.match
        .notOk(() => <div>Not ok</div>)
        .ok((v) => <div>Ok: {v}</div>)
      } */}
       </div>
      <div>
        <button onClick={() => setPromise(loadSomething())}>Reload</button>
        <button onClick={() => setPromise(loadSomethingWithError())}>Reload with error</button>
      </div>

    </>
  )
}

App.whyDidYouRender = true
export default App
