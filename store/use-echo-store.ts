import type { Echo } from '@prisma/client'
import { create } from 'zustand'

interface IEchoStore {
  echos: Echo[]
  isFirstRender: boolean
  setEchos: (echos: Echo[]) => void
  markRendered: () => void
}

export const useEchoStore = create<IEchoStore>(set => ({
  echos: [],
  isFirstRender: true,
  setEchos: echos => set({ echos }),
  markRendered: () => set({ isFirstRender: false }),
}))
