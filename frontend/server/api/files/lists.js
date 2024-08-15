import { defineEventHandler, getQuery, parseCookies, createError } from 'h3';

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    const cookies = parseCookies(event);

    try {
        const { taskId } = getQuery(event);
        if (!taskId) {
            throw createError({
                statusCode: 400,
                statusMessage: 'taskId is required'
            });
        }

        const response = await $fetch(`${config.public.apiBaseUrl}/files/lists`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${cookies.token}`
            },
            params: { taskId } // 添加 taskId 参数
        });

        return response;
    } catch (error) {
        throw createError({
            statusCode: error.response?.status || 500,
            statusMessage: error.response?.data?.message || 'Server Error'
        });
    }
});
