import { createContext, useContext, useState } from "react"
import { Code2, MessageSquare, Users, Settings, Play, Folder } from "lucide-react"
import useWindowDimensions from "@/hooks/useWindowDimensions"

export enum VIEWS {
    CHAT = "CHAT",
    FILES = "FILES",
    USERS = "USERS",
    RUN = "RUN",
    SETTINGS = "SETTINGS"
}

interface ViewContextType {
    activeView: VIEWS
    setActiveView: (view: VIEWS) => void
    isSidebarOpen: boolean
    setIsSidebarOpen: (open: boolean) => void
    viewIcons: Record<VIEWS, typeof Code2>
}

const viewIcons = {
    [VIEWS.CHAT]: MessageSquare,
    [VIEWS.FILES]: Folder,
    [VIEWS.USERS]: Users,
    [VIEWS.RUN]: Play,
    [VIEWS.SETTINGS]: Settings
} as Record<VIEWS, typeof Code2>

const ViewContext = createContext<ViewContextType>({
    activeView: VIEWS.CHAT,
    setActiveView: () => {},
    isSidebarOpen: true,
    setIsSidebarOpen: () => {},
    viewIcons
})

export function ViewProvider({ children }: { children: React.ReactNode }) {
    const { isMobile } = useWindowDimensions()
    const [activeView, setActiveView] = useState<VIEWS>(VIEWS.CHAT)
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(!isMobile)

    return (
        <ViewContext.Provider value={{ 
            activeView, 
            setActiveView,
            isSidebarOpen,
            setIsSidebarOpen,
            viewIcons
        }}>
            {children}
        </ViewContext.Provider>
    )
}

export function useViews() {
    return useContext(ViewContext)
}
