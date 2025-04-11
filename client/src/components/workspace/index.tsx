import { useAppContext } from "@/context/AppContext"
import useResponsive from "@/hooks/useResponsive"
import useWindowDimensions from "@/hooks/useWindowDimensions"
import { ACTIVITY_STATE } from "@/types/app"
import DrawingEditor from "../drawing/DrawingEditor"
import EditorComponent from "../editor/EditorComponent"
import cn from "classnames"
import { useViews } from "@/context/ViewContext"

function WorkSpace() {
    const { viewHeight } = useResponsive()
    const { activityState } = useAppContext()
    const { isMobile } = useWindowDimensions()
    const { isSidebarOpen } = useViews()

    // Calculate height based on mobile or desktop view
    const calculatedHeight = isMobile ? '100%' : viewHeight;

    return (
        <div
            className={cn(
                "w-full max-w-full flex-grow overflow-hidden",
                {
                    "absolute left-0 top-0 z-10": isMobile,
                    "relative": !isMobile,
                    "ml-[60px]": isMobile && !isSidebarOpen,
                    "ml-0": isMobile && isSidebarOpen
                }
            )}
            style={{ 
                height: calculatedHeight,
                paddingBottom: isMobile ? '10px' : '0',
                maxHeight: 'calc(100vh - 60px)'
            }}
        >
            {activityState === ACTIVITY_STATE.DRAWING ? (
                <DrawingEditor />
            ) : (
                <EditorComponent />
            )}
        </div>
    )
}

export default WorkSpace
