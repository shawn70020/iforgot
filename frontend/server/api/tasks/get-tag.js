import { defineEventHandler, getQuery, createError } from 'h3';

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    const cookies = parseCookies(event)
    const query = getQuery(event);
    const tag = query.tag;
    try {
        const response = await $fetch(`${config.public.apiBaseUrl}/tasks/get-tag`, {
            method: 'GET',
            params: { tag },
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

