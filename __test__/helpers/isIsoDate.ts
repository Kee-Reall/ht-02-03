export function isIsoDate(str: string): boolean {
    if(typeof str !== "string") return false;
    if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(str)) return false;
    const d = new Date(str);
    //@ts-ignore
    return d instanceof Date && !isNaN(d) && d.toISOString()===str; // valid date
}