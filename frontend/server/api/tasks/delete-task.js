import { defineEventHandler, readBody, createError } from 'h3';

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    const cookies = parseCookies(event)
    try {
        const body = await readBody(event);
        const response = await $fetch(`${config.public.apiBaseUrl}/tasks/delete-task`, {
            method: 'DELETE',
            body,
            headers: {
                Authorization: `Bearer ${cookies.token}`
            },
        });

        return response;
    } catch (error) {
        throw createError({
            statusCode: error.response?.status || 500,
            statusMessage: error.response?.data?.message || ' Server Error'
        });
    }
});

