import { createState, State, useState } from '@hookstate/core';

export const globalState = createState<any[]>([])

const wrapState = (s: State<any[]>) => ({
  get: () => s.value,
  itemsRemove: (id: string) => {
    globalState.set(value => {
      const idx = value.findIndex(e => e.id === id)
      value.splice(idx, 1)
      return value;
    })
  },
  itemsAdd: (obj: any) => {
    globalState.set(value => {
      let delay = 0;
      if (Array.isArray(obj))
        value.unshift(...obj.map(e => { e.delay = delay + 150; delay += 150; return e;}))
      else
        value.unshift(obj)
      console.log(value)
      return value;
    })
  },
  itemsUpdate: (obj: any) => {
    globalState.set(value => {
      return value.map(e => e.id === obj.id ? { ...obj, id: e.id } : e);
    })
  },
  itemsReset: () => {
    globalState.set([])
  }
})

export const accessGlobalState = () => wrapState(globalState)
export const useGlobalState = () => wrapState(useState(globalState))
// export const reset = () => {
//   items.set([])
// }

// export const itemsAdd = (obj: any) => {
//   items.set(value => {
//     if (Array.isArray(obj))
//       value.unshift(...obj)
//     else
//       value.unshift(obj)
//     return value;
//   })
// }
// export const itemsRemove = (id: string) => {
//   items.set(value => {
//     const idx = value.findIndex(e => e.id === id)
//     value.splice(idx, 1)
//     return value;
//   })
// }