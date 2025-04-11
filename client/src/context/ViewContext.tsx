import ChatsView from "@/components/sidebar/sidebar-views/ChatsView"
import FilesView from "@/components/sidebar/sidebar-views/FilesView"
import RunView from "@/components/sidebar/sidebar-views/RunView"
import SettingsView from "@/components/sidebar/sidebar-views/SettingsView"
import UsersView from "@/components/sidebar/sidebar-views/UsersView"
import useWindowDimensions from "@/hooks/useWindowDimensions"
import { VIEWS, ViewContext as ViewContextType } from "@/types/view"
import { ReactNode, createContext, useContext, useState, useEffect } from "react"
import { 
    FolderGit2, 
    Users, 
    Settings, 
    MessageSquare, 
    Sparkles, 
    Play,
    Code2,
    Terminal
} from "lucide-react"

const ViewContext = createContext<ViewContextType | null>(null)

export const useViews = (): ViewContextType => {
    const context = useContext(ViewContext)
    if (!context) {
        throw new Error("useViews must be used within a ViewContextProvider")
    }
    return context
}

function ViewContextProvider({ children }: { children: ReactNode }) {
    const { isMobile } = useWindowDimensions()
    const [activeView, setActiveView] = useState<VIEWS>(VIEWS.FILES)
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(!isMobile)
    
    // Add data attribute to body for global CSS targeting
    useEffect(() => {
        document.body.setAttribute('data-active-view', activeView);
        return () => {
            document.body.removeAttribute('data-active-view');
        };
    }, [activeView]);
    
    const [viewComponents] = useState({
        [VIEWS.FILES]: <FilesView />,
        [VIEWS.CLIENTS]: <UsersView />,
        [VIEWS.SETTINGS]: <SettingsView />,
        [VIEWS.CHATS]: <ChatsView />,
        [VIEWS.RUN]: <RunView />,
    })
    const [viewIcons] = useState({
        [VIEWS.FILES]: <FolderGit2 className="h-5 w-5" />,
        [VIEWS.CLIENTS]: <Users className="h-5 w-5" />,
        [VIEWS.SETTINGS]: <Settings className="h-5 w-5" />,
        [VIEWS.CHATS]: <MessageSquare className="h-5 w-5" />,
        [VIEWS.RUN]: <Terminal className="h-5 w-5" />,
    })

    return (
        <ViewContext.Provider
            value={{
                activeView,
                setActiveView,
                isSidebarOpen,
                setIsSidebarOpen,
                viewComponents,
                viewIcons,
            }}
        >
            {children}
        </ViewContext.Provider>
    )
}

export { ViewContextProvider }
export default ViewContext
