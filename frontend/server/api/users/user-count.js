import { defineEventHandler, createError } from 'h3';

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    const cookies = parseCookies(event)
    try {
        console.log(222222222)
        const response = await $fetch(`${config.public.apiBaseUrl}/users/get-user-task-count`, {
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

