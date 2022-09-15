import { defineStore } from "pinia"
import { useLocalStorage } from "@vueuse/core"
import superjson from "superjson"

export const useWritingNftFollowingCreatorAddressListStore = defineStore("LikecoinWritingNftFollowingCreatorAddressList", {
  state: (() => {
    return {
      address_list: useLocalStorage(
        "LikecoinWritingNftFollowingCreatorAddressList",
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
    has_any_address(state): boolean {
      return state.address_list.size > 0
    },
    address_list_array(state): string[] {
      return Array.from(state.address_list)
    },
  },
  actions: {
    addOneAddress(address: string) {
      this.address_list.add(address)
    },
    removeOneAddress(address: string) {
      this.address_list.delete(address)
    },
  },
})
