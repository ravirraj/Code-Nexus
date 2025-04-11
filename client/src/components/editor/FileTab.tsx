import { useFileSystem } from "@/context/FileContext"
import { getIconClassName } from "@/utils/getIconClassName"
import { Icon } from "@iconify/react"
import { IoClose } from "react-icons/io5"
import cn from "classnames"
import { useEffect, useRef } from "react"
import customMapping from "@/utils/customMapping"
import { useSettings } from "@/context/SettingContext"
import langMap from "lang-map"
import useWindowDimensions from "@/hooks/useWindowDimensions"

function FileTab() {
    const {
        openFiles,
        closeFile,
        activeFile,
        updateFileContent,
        setActiveFile,
    } = useFileSystem()
    const fileTabRef = useRef<HTMLDivElement>(null)
    const { setLanguage } = useSettings()
    const { width, isMobile } = useWindowDimensions()

    const changeActiveFile = (fileId: string) => {
        // If the file is already active, do nothing
        if (activeFile?.id === fileId) return

        updateFileContent(activeFile?.id || "", activeFile?.content || "")

        const file = openFiles.find((file) => file.id === fileId)
        if (file) {
            setActiveFile(file)
        }
    }

    useEffect(() => {
        const fileTabNode = fileTabRef.current
        if (!fileTabNode) return

        const handleWheel = (e: WheelEvent) => {
            if (e.deltaY > 0) {
                fileTabNode.scrollLeft += 100
            } else {
                fileTabNode.scrollLeft -= 100
            }
        }

        fileTabNode.addEventListener("wheel", handleWheel)

        return () => {
            fileTabNode.removeEventListener("wheel", handleWheel)
        }
    }, [])

    // Update the editor language when a file is opened
    useEffect(() => {
        if (activeFile?.name === undefined) return
        // Get file extension on file open and set language when file is opened
        const extension = activeFile.name.split(".").pop()
        if (!extension) return

        // Check if custom mapping exists
        if (customMapping[extension]) {
            setLanguage(customMapping[extension])
            return
        }

        const language = langMap.languages(extension)
        setLanguage(language[0])
    }, [activeFile?.name, setLanguage])

    // Determine if we should truncate filenames based on screen width
    const getMaxNameLength = () => {
        if (width < 400) return 10;
        if (width < 640) return 15;
        if (width < 768) return 20;
        return 30;
    };

    // Function to truncate filename for display
    const truncateFileName = (fileName: string) => {
        const maxLength = getMaxNameLength();
        if (fileName.length <= maxLength) return fileName;
        
        const ext = fileName.split('.').pop() || '';
        const name = fileName.substring(0, fileName.length - ext.length - 1);
        
        if (name.length <= maxLength - 3 - ext.length) return fileName;
        
        return `${name.substring(0, maxLength - 3 - ext.length)}...${ext ? '.' + ext : ''}`;
    };

    return (
        <div
            className={cn(
                "flex h-[40px] sm:h-[50px] w-full select-none gap-1 sm:gap-2 overflow-x-auto p-1 sm:p-2 pb-0",
                "scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent"
            )}
            ref={fileTabRef}
        >
            {openFiles.map((file) => (
                <span
                    key={file.id}
                    className={cn(
                        "flex w-fit cursor-pointer items-center rounded-t-md px-1 sm:px-2 py-0.5 sm:py-1 text-white text-xs sm:text-sm",
                        { "bg-darkHover": file.id === activeFile?.id },
                    )}
                    onClick={() => changeActiveFile(file.id)}
                >
                    <Icon
                        icon={getIconClassName(file.name)}
                        fontSize={isMobile ? 18 : 22}
                        className="mr-1 sm:mr-2 min-w-fit"
                    />
                    <p
                        className="flex-grow cursor-pointer overflow-hidden truncate"
                        title={file.name}
                    >
                        {truncateFileName(file.name)}
                    </p>
                    <IoClose
                        className="ml-1 sm:ml-3 inline rounded-md hover:bg-darkHover"
                        size={isMobile ? 16 : 20}
                        onClick={(e) => {
                            e.stopPropagation();
                            closeFile(file.id);
                        }}
                    />
                </span>
            ))}
        </div>
    )
}

export default FileTab
