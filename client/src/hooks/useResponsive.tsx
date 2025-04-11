import { useEffect, useState } from "react"
import useWindowDimensions from "./useWindowDimensions"

// This hook is used to hide sidebar and other components when keyboard is open on mobile devices and to adjust the height of the sidebar views and editor
function useResponsive() {
    const [minHeightReached, setMinHeightReached] = useState(false)
    const { height, isMobile } = useWindowDimensions()
    const [viewHeight, setViewHeight] = useState(height)

    useEffect(() => {
        if (height < 500 && isMobile) {
            setMinHeightReached(true)
            setViewHeight(height)
        } else if (isMobile) {
            setMinHeightReached(false)
            // Use percentage-based height for mobile to solve responsive issues
            setViewHeight(Math.min(height - 60, window.innerHeight - 60))
        } else {
            setMinHeightReached(false)
            setViewHeight(height)
        }
    }, [height, isMobile])

    return { viewHeight, minHeightReached }
}

export default useResponsive
