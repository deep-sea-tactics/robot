export type Camera = { asyncOpen: boolean, port: number, description: string }

export const cameras: Camera[] = [
    {
        port: 8081,
        asyncOpen: false,
        description: "Front"
    },
    {
        port: 8083,
        asyncOpen: true,
        description: "Bottom"
    }
]