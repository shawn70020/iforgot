import { defineEventHandler, readBody, createError } from 'h3';
import { $fetch } from 'ohmyfetch';

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    try {
        const body = await readBody(event);

        const response = await $fetch(`${config.public.apiBaseUrl}/users/check-email`, {
            method: 'POST',
            body,
        });

        return response;
    } catch (error) {
        throw createError({
            statusCode: error.response?.status || 500,
            statusMessage: error.response?.data?.message || 'Internal Server Error'
        });
    }
});
