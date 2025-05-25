import type { Echo } from '@prisma/client'
import { create } from 'zustand'

interface IEchoStore {
  echos: Echo[]
  setEchos: (echos: Echo[]) => void
}

export const useEchoStore = create<IEchoStore>(set => ({
  echos: [],
  setEchos: echos => set({ echos }),
}))
