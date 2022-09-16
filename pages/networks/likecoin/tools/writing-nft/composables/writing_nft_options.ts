import { defineStore } from "pinia"
import { useLocalStorage } from "@vueuse/core"

export const useWritingNftOptionsStore = defineStore("likecoin_writing_nft_options", {
  state: (() => {
    return {
      only_writing_nft_with_complete_data_visible: useLocalStorage(
        "likecoin_writing_nft_options__only_writing_nft_with_complete_data_visible",
        false,
      )
    }
  }),
  actions: {
    update_only_writing_nft_with_complete_data_visible(val: boolean) {
      this.only_writing_nft_with_complete_data_visible = val
    },
  },
})
