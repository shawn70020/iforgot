import { defineEventHandler, sendError } from 'h3'

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    const id = event.context.params.id
    try {
        const response = await $fetch(`${config.public.apiBaseUrl}/files/download/${id}`)
        return response
    } catch (error) {
        return sendError(event, new Error('Failed to fetch file'))
    }
})
