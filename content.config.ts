import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    content: defineCollection({
      source: '**/*.md',
      type: 'page',
      // Define custom schema for docs collection
      schema: z.object({
        page_type: z.string().optional(),
        list_item_image_path: z.string().optional(),
      })
    }),
  }
})
