export type Camera = { asyncOpen: boolean, port: number }

export const cameras: Camera[] = [
    {
        port: 8081,
        asyncOpen: false
    },
    {
        port: 8083,
        asyncOpen: true
    },
    {
        port: 8082,
        asyncOpen: true
    }
]