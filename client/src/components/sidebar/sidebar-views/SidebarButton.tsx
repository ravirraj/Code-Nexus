import { useChatRoom } from "@/context/ChatContext"
import { useViews } from "@/context/ViewContext"
import { VIEWS } from "@/types/view"
import { buttonStyles } from "../tooltipStyles"
import { ElementType } from "react"

interface SidebarButtonProps {
    viewName: VIEWS
    icon: ElementType
    onClick?: () => void
    className?: string
}

const SidebarButton = ({ viewName, icon: Icon, onClick, className }: SidebarButtonProps) => {
    const { activeView, setActiveView, isSidebarOpen, setIsSidebarOpen } = useViews()
    const { isNewMessage } = useChatRoom()

    const handleViewClick = () => {
        if (onClick) {
            onClick()
            return
        }
        
        if (viewName === activeView) {
            setIsSidebarOpen(!isSidebarOpen)
        } else {
            setIsSidebarOpen(true)
            setActiveView(viewName)
        }
    }

    return (
        <div className="relative flex flex-col items-center">
            <button
                onClick={handleViewClick}
                className={`${buttonStyles.base} ${buttonStyles.hover} ${className || ''}`}
                data-active={viewName === activeView}
                data-view={viewName}
                aria-label={`View ${viewName}`}
            >
                <div className="flex items-center justify-center"><Icon /></div>
                {viewName === VIEWS.CHAT && isNewMessage && (
                    <div className="absolute right-0 top-0 h-3 w-3 rounded-full bg-primary"></div>
                )}
            </button>
        </div>
    )
}

export default SidebarButton
