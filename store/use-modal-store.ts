import { create } from 'zustand'

type IModalType =
  | 'deleteArticleModal'
  | 'editTagModal'
  | 'deleteTagModal'
  | 'createEchoModal'
  | 'deleteEchoModal'
  | 'editEchoModal'
  | 'createTagModal'
  | null

interface IModalStore {
  modalType: IModalType
  payload: unknown
  setModalOpen: (modalType: IModalType, payload?: unknown) => void
  onModalClose: () => void
}

export const useModalStore = create<IModalStore>(set => ({
  modalType: null,
  payload: null,
  setModalOpen: (modalType, payload = {}) => {
    set({
      modalType,
      payload,
    })
  },
  // *可以直接不用这个函数的, 直接使用 setModalOpen(null) 来替代, 但是我想更纯粹一点
  onModalClose: () => {
    set({ modalType: null })
  },
}))
