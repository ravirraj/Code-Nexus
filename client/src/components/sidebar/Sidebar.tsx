import SidebarButton from "@/components/sidebar/sidebar-views/SidebarButton"
import { useAppContext } from "@/context/AppContext"
import { useSocket } from "@/context/SocketContext"
import { useViews } from "@/context/ViewContext"
import useResponsive from "@/hooks/useResponsive"
import useWindowDimensions from "@/hooks/useWindowDimensions"
import { ACTIVITY_STATE } from "@/types/app"
import { SocketEvent } from "@/types/socket"
import { VIEWS } from "@/types/view"
import { Code2, Pencil, X } from "lucide-react"
import { Tooltip } from 'react-tooltip'
import { useState, useEffect } from 'react'
import cn from "classnames"

function Sidebar() {
    const {
        activeView,
        isSidebarOpen,
        viewComponents,
        viewIcons,
        setIsSidebarOpen,
        setActiveView,
    } = useViews()
    const { minHeightReached } = useResponsive()
    const { activityState, setActivityState } = useAppContext()
    const { socket } = useSocket()
    const { isMobile, width } = useWindowDimensions()
    const [showTooltip, setShowTooltip] = useState(true)
    const [previousView, setPreviousView] = useState<string | null>(null)

    // Handle view changes and sidebar state
    useEffect(() => {
        if (activeView !== previousView) {
            setPreviousView(activeView)
        }
    }, [activeView])

    // Close sidebar on small screens when orientation changes
    useEffect(() => {
        if (width < 768 && isSidebarOpen) {
            setIsSidebarOpen(false);
        }
    }, [width]);

    const handleViewChange = (view: string) => {
        if (view === activeView) {
            // If clicking the same view, toggle sidebar instead of closing
            setIsSidebarOpen(!isSidebarOpen)
        } else {
            // If clicking different view, open sidebar and change view
            setActiveView(view)
            setIsSidebarOpen(true)
        }
    }

    const changeState = () => {
        setShowTooltip(false)
        if (activityState === ACTIVITY_STATE.CODING) {
            setActivityState(ACTIVITY_STATE.DRAWING)
            socket.emit(SocketEvent.REQUEST_DRAWING)
        } else {
            setActivityState(ACTIVITY_STATE.CODING)
        }

        if (isMobile) {
            setIsSidebarOpen(false)
        }
    }

    const closeSidebar = () => {
        setIsSidebarOpen(false);
    }

    const mainActions = [
        { view: VIEWS.FILES, label: "Files" },
        { view: VIEWS.CHATS, label: "Chat" },
    ]

    const secondaryActions = [
        { view: VIEWS.RUN, label: "Run Code" },
        { view: VIEWS.CLIENTS, label: "Users" },
        { view: VIEWS.SETTINGS, label: "Settings" },
    ]

    // Get extra height for chat view
    const getChatViewStyle = () => {
        if (isMobile && activeView === VIEWS.CHATS) {
            return {
                height: 'calc(100% - 60px)',
                maxHeight: '100%',
                paddingBottom: '70px', // Extra padding for chat input
            };
        }
        return {};
    };

    // Get mobile sidebar height based on active view
    const getMobileSidebarStyle = () => {
        if (isMobile) {
            const baseStyle = {
                height: 'calc(100% - 60px)',
                maxHeight: '100%',
                width: '100%',
                left: '0',
            };
            
            // Special handling for chat view
            if (activeView === VIEWS.CHATS) {
                return {
                    ...baseStyle,
                    height: 'calc(100vh - 60px)',
                    maxHeight: 'calc(100vh - 60px)',
                    overflow: 'visible' // Ensure content isn't clipped
                };
            }
            
            return {
                ...baseStyle,
                overflow: 'auto' // Default overflow for other views
            };
        }
        
        return {
            height: 'calc(100vh - 60px)',
            maxHeight: '100%',
            overflow: 'auto' // Default for desktop
        };
    };

    return (
        <aside className="flex h-screen w-full md:h-full md:max-h-screen md:min-h-screen md:w-auto">
            {/* Main Sidebar */}
            <div
                className={cn(
                    "fixed left-0 top-[60px] z-50 flex h-[calc(100vh-60px)] w-[60px] min-w-[60px] flex-col justify-between border-r border-slate-700/50 bg-slate-900/95 backdrop-blur-md md:py-3",
                    {
                        hidden: minHeightReached,
                    },
                )}
                style={{
                    height: isMobile ? 'calc(100% - 60px)' : 'calc(100vh - 60px)',
                    maxHeight: '100%'
                }}
            >
                {/* Top Section */}
                <div className="flex flex-col gap-1.5">
                    {/* Main Actions Group */}
                    <div className="flex w-full flex-col gap-1.5 px-2">
                        {mainActions.map(({ view, label }) => (
                            <div key={view} className="relative flex items-center group">
                                <SidebarButton
                                    viewName={view}
                                    icon={viewIcons[view]}
                                    onClick={() => handleViewChange(view)}
                                    className={cn(
                                        "w-full rounded-lg p-2.5 transition-all duration-200",
                                        "hover:bg-indigo-500/10 hover:text-indigo-400",
                                        "data-[active=true]:bg-indigo-500/20 data-[active=true]:text-indigo-400",
                                        "border border-transparent hover:border-indigo-500/20"
                                    )}
                                />
                                <div 
                                    className="absolute left-14 hidden whitespace-nowrap rounded-lg bg-slate-800/95 px-2.5 py-1 text-sm text-slate-200 opacity-0 transition-all duration-200 group-hover:opacity-100 md:block"
                                    data-tooltip-id={`tooltip-${view}`}
                                    data-tooltip-content={label}
                                >
                                    {label}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Divider */}
                    <div className="my-1.5 hidden h-px w-full bg-gradient-to-r from-transparent via-slate-700/50 to-transparent px-2 md:block" />

                    {/* Secondary Actions Group */}
                    <div className="hidden w-full flex-col gap-1.5 px-2 md:flex">
                        {secondaryActions.map(({ view, label }) => (
                            <div key={view} className="relative flex items-center group">
                                <SidebarButton
                                    viewName={view}
                                    icon={viewIcons[view]}
                                    onClick={() => handleViewChange(view)}
                                    className={cn(
                                        "w-full rounded-lg p-2.5 transition-all duration-200",
                                        "hover:bg-indigo-500/10 hover:text-indigo-400",
                                        "data-[active=true]:bg-indigo-500/20 data-[active=true]:text-indigo-400",
                                        "border border-transparent hover:border-indigo-500/20"
                                    )}
                                />
                                <div 
                                    className="absolute left-14 hidden whitespace-nowrap rounded-lg bg-slate-800/95 px-2.5 py-1 text-sm text-slate-200 opacity-0 transition-all duration-200 group-hover:opacity-100 md:block"
                                    data-tooltip-id={`tooltip-${view}`}
                                    data-tooltip-content={label}
                                >
                                    {label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="mt-auto hidden w-full px-2 pb-3 md:block">
                    <button
                        className={cn(
                            "flex w-full items-center justify-center rounded-lg p-2.5 transition-all duration-200",
                            "hover:bg-indigo-500/10 hover:text-indigo-400",
                            "border border-transparent hover:border-indigo-500/20"
                        )}
                        onClick={changeState}
                        onMouseEnter={() => setShowTooltip(true)}
                        data-tooltip-id="activity-state-tooltip"
                        data-tooltip-content={
                            activityState === ACTIVITY_STATE.CODING
                                ? "Switch to Drawing Mode"
                                : "Switch to Coding Mode"
                        }
                    >
                        {activityState === ACTIVITY_STATE.CODING ? (
                            <Pencil className="h-5 w-5" />
                        ) : (
                            <Code2 className="h-5 w-5" />
                        )}
                    </button>
                </div>

                {/* Mobile View */}
                <div className="flex w-full flex-wrap justify-around gap-1 px-2 py-1 md:hidden">
                    {[...mainActions, ...secondaryActions].map(({ view, label }) => (
                        <div key={view} className="relative">
                            <SidebarButton
                                viewName={view}
                                icon={viewIcons[view]}
                                onClick={() => handleViewChange(view)}
                                className={cn(
                                    "rounded-lg p-2 transition-all duration-200",
                                    "hover:bg-indigo-500/10 hover:text-indigo-400",
                                    "data-[active=true]:bg-indigo-500/20 data-[active=true]:text-indigo-400",
                                    "border border-transparent hover:border-indigo-500/20"
                                )}
                            />
                            <div 
                                className="absolute left-1/2 top-full mt-1 hidden -translate-x-1/2 whitespace-nowrap rounded-lg bg-slate-800/95 px-2.5 py-1 text-xs text-slate-200 opacity-0 transition-all duration-200 group-hover:opacity-100 md:hidden"
                                data-tooltip-id={`tooltip-${view}`}
                                data-tooltip-content={label}
                            >
                                {label}
                            </div>
                        </div>
                    ))}
                    <div className="relative">
                        <button
                            className={cn(
                                "flex items-center justify-center rounded-lg p-2 transition-all duration-200",
                                "hover:bg-indigo-500/10 hover:text-indigo-400",
                                "border border-transparent hover:border-indigo-500/20"
                            )}
                            onClick={changeState}
                            data-tooltip-id="activity-state-tooltip"
                            data-tooltip-content={
                                activityState === ACTIVITY_STATE.CODING
                                    ? "Switch to Drawing Mode"
                                    : "Switch to Coding Mode"
                            }
                        >
                            {activityState === ACTIVITY_STATE.CODING ? (
                                <Pencil className="h-4 w-4 sm:h-5 sm:w-5" />
                            ) : (
                                <Code2 className="h-4 w-4 sm:h-5 sm:w-5" />
                            )}
                        </button>
                        <div 
                            className="absolute left-1/2 top-full mt-1 hidden -translate-x-1/2 whitespace-nowrap rounded-lg bg-slate-800/95 px-2.5 py-1 text-xs text-slate-200 opacity-0 transition-all duration-200 group-hover:opacity-100 md:hidden"
                            data-tooltip-id="activity-state-tooltip-mobile"
                            data-tooltip-content={
                                activityState === ACTIVITY_STATE.CODING
                                    ? "Switch to Drawing Mode"
                                    : "Switch to Coding Mode"
                            }
                        >
                            {activityState === ACTIVITY_STATE.CODING ? "Drawing" : "Coding"}
                        </div>
                    </div>
                </div>
            </div>

            {/* Sidebar Content Panel */}
            <div
                className={cn(
                    "fixed left-[60px] top-[60px] z-30 w-[280px] sm:w-[320px] flex-col bg-slate-900/95 backdrop-blur-md transition-all duration-200 ease-in-out md:block",
                    {
                        "translate-x-0 opacity-100 fullscreen-mobile": isSidebarOpen,
                        "-translate-x-full opacity-0": !isSidebarOpen,
                    }
                )}
                style={getMobileSidebarStyle()}
            >
                <div className="flex items-center justify-between border-b border-slate-700/50 px-4 py-2 md:hidden">
                    <h2 className="text-lg font-semibold text-white">{activeView}</h2>
                    <button 
                        onClick={closeSidebar}
                        className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>
                <div 
                    className="h-full overflow-y-auto"
                >
                    {viewComponents[activeView]}
                </div>
            </div>

            {showTooltip && (
                <Tooltip
                    id="activity-state-tooltip"
                    place="right"
                    offset={15}
                    className="!z-50"
                    style={{
                        backgroundColor: "rgb(30, 41, 59)",
                    }}
                />
            )}
        </aside>
    )
}

export default Sidebar
