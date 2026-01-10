import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }) => {
    // For simplified setup, we always use the provided locale (default: 'es')
    return {
        messages: (await import(`./messages/${locale || 'es'}.json`)).default
    };
});
