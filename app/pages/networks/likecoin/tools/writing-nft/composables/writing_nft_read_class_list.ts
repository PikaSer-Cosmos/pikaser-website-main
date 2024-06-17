import { defineStore } from "pinia"
import { useLocalStorage } from "@vueuse/core"
import superjson from "superjson"

export const useWritingNftReadClassIdList = defineStore("WritingNftReadClassIdList", {
  state: (() => {
    return {
      id_list: useLocalStorage(
        "LikecoinWritingNftReadClassIdList",
        new Set<string>(),
        {
          serializer: {
            read: (raw) => superjson.parse(raw),
            write: (val) => superjson.stringify(val),
          },
        },
      )
    }
  }),
  getters: {
    has_any_id(state): boolean {
      return state.id_list.size > 0
    },
    id_list_array(state): string[] {
      return Array.from(state.id_list)
    },
    has_id(state): boolean {
      return (nft_class_id) => state.id_list.has(nft_class_id)
    },
  },
  actions: {
    addOneClassId(nft_class_id: string) {
      this.id_list.add(nft_class_id)
    },
    removeOneClassId(nft_class_id: string) {
      this.id_list.delete(nft_class_id)
    },
  },
})
