import type { Echo } from '@prisma/client'
import { create } from 'zustand'

interface IEchoStore {
  echos: Echo[]
  setEchos: (echos: Echo[]) => void
  isFirstRender: boolean
  markRendered: () => void
}

export const useEchoStore = create<IEchoStore>(set => ({
  isFirstRender: true,
  echos: [],
  setEchos: echos => set({ echos }),
  markRendered: () => set({ isFirstRender: false }),
}))
