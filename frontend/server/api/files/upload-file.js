import { defineEventHandler, readBody, createError, parseCookies } from 'h3';

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    const cookies = parseCookies(event);

    if (event.req.method === 'POST') {
        try {
            const body = await readBody(event);

            // 获取预签名 URL
            const presignedUrlResponse = await $fetch(`${config.public.apiBaseUrl}/files/generate-presigned-url`, {
                method: 'GET',
                params: {
                    filename: body.filename,
                    contentType: body.contentType,
                },
                headers: {
                    Authorization: `Bearer ${cookies.token}`,
                },
            });

            return presignedUrlResponse;
        } catch (error) {
            throw createError({
                statusCode: error.response?.status || 500,
                statusMessage: error.response?.data?.message || 'Server Error',
            });
        }
    }
});
