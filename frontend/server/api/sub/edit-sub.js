import { defineEventHandler, readBody, createError } from 'h3';

export default defineEventHandler(async (event) => {
    console.log(1111111111)
    const config = useRuntimeConfig();
    const cookies = parseCookies(event)
    try {
        console.log(88887777)
        const body = await readBody(event);
        const response = await $fetch(`${config.public.apiBaseUrl}/sub/edit-sub`, {
            method: 'POST',
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

