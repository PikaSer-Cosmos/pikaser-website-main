import { defineStore } from "pinia"
import { useLocalStorage } from "@vueuse/core"

export enum ReadWritingNftClassDisplayStyle {
  SAME_AS_UNREAD  = "same_as_unread",
  COLLAPSED       = "collapsed",
  HIDDEN          = "hidden",
}

export const useWritingNftOptionsStore = defineStore("likecoin_writing_nft_options", {
  state: (() => {
    return {
      only_writing_nft_with_complete_data_visible: useLocalStorage(
        "likecoin_writing_nft_options__only_writing_nft_with_complete_data_visible",
        false,
      ),
      read_writing_nft_class_display_style: useLocalStorage(
      "likecoin_writing_nft_options__read_writing_nft_class_display_style",
      ReadWritingNftClassDisplayStyle.SAME_AS_UNREAD,
      ),
    }
  }),
  actions: {
    update_only_writing_nft_with_complete_data_visible(val: boolean) {
      this.only_writing_nft_with_complete_data_visible = val
    },
  },
})
