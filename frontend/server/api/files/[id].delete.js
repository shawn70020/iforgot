import { defineEventHandler } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const cookies = parseCookies(event)
  const { id } = event.context.params
  try {
    const response = await $fetch(`${config.public.apiBaseUrl}/files/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${cookies.token}`
    },
    })
    return response
  } catch (error) {
    return { error: 'Failed to ff file' }
  }
})
