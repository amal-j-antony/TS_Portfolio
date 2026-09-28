

export const logger = {
    debug: (...args:unknown[]) => {
        console.debug('[DEBUG]',...args)
    },
    info: (...args:unknown[]) => {
            console.info('[INFO]',...args)        
    },
    warn: (...args:unknown[])=> {
        console.warn('[WARNING]',...args)
    },
    error: (...args:unknown[])=> {
        console.error('[ERROR]',...args)
    }
}

export const functionErrorLog = (fn:string,error:any) => {
    console.log(`[${fn}]:${error.message}`);
    
}