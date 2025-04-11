enum VIEWS {
    CHAT = "CHAT",
    FILES = "FILES",
    USERS = "USERS",
    RUN = "RUN",
    SETTINGS = "SETTINGS"
}

interface ViewContext {
    activeView: VIEWS
    setActiveView: (activeView: VIEWS) => void
    isSidebarOpen: boolean
    setIsSidebarOpen: (isSidebarOpen: boolean) => void
    viewIcons: Record<VIEWS, any>
}

export { ViewContext, VIEWS }
