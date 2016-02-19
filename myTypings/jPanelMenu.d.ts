

declare module jPanelMenu {
    interface iConfig {
        menu:    string
        trigger: string
        duration: number
        openPosition: string
    }

    interface iInstance {
        on:()=>void
        off:()=>void
    }
}