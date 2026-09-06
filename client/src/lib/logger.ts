const isDev = import.meta.env.VITE_DEV_ENV

export const logger = {
    debug: (...args:unknown[]) => {
        if(isDev){
            console.debug('[DEBUG]',...args)
        }
    },
    info: (...args:unknown[]) => {
        if(isDev){
            console.info('[INFO]',...args)
        }
    },
    warn: (...args:unknown[])=> {
        console.warn('[WARNING]',...args)
    },
    error: (...args:unknown[])=> {
        console.error('[ERROR]',...args)
    }
}