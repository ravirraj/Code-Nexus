import { useAppContext } from "@/context/AppContext"
import { useFileSystem } from "@/context/FileContext"
import { useSettings } from "@/context/SettingContext"
import { useSocket } from "@/context/SocketContext"
import { useViews } from "@/context/ViewContext"
import usePageEvents from "@/hooks/usePageEvents"
import useResponsive from "@/hooks/useResponsive"
import useWindowDimensions from "@/hooks/useWindowDimensions"
import { editorThemes } from "@/resources/Themes"
import { FileSystemItem } from "@/types/file"
import { SocketEvent } from "@/types/socket"
import { color } from "@uiw/codemirror-extensions-color"
import { hyperLink } from "@uiw/codemirror-extensions-hyper-link"
import { LanguageName, loadLanguage } from "@uiw/codemirror-extensions-langs"
import CodeMirror, {
    Extension,
    ViewUpdate,
    scrollPastEnd,
} from "@uiw/react-codemirror"
import { useEffect, useMemo, useState } from "react"
import toast from "react-hot-toast"
import { cursorTooltipBaseTheme, tooltipField } from "./tooltip"
import cn from "classnames"

function Editor() {
    const { users, currentUser } = useAppContext()
    const { activeFile, setActiveFile } = useFileSystem()
    const { theme, language, fontSize } = useSettings()
    const { socket } = useSocket()
    const { viewHeight } = useResponsive()
    const { width, isMobile } = useWindowDimensions()
    const { isSidebarOpen } = useViews()
    const [timeOut, setTimeOut] = useState(setTimeout(() => {}, 0))
    const filteredUsers = useMemo(
        () => users.filter((u) => u.username !== currentUser.username),
        [users, currentUser],
    )
    const [extensions, setExtensions] = useState<Extension[]>([])

    // Calculate responsive fontSize
    const responsiveFontSize = useMemo(() => {
        if (width < 400) {
            return Math.max(fontSize - 2, 12); // Minimum 12px font size
        } else if (width < 768) {
            return Math.max(fontSize - 1, 13); // Minimum 13px font size
        }
        return fontSize;
    }, [fontSize, width]);

    const onCodeChange = (code: string, view: ViewUpdate) => {
        if (!activeFile) return

        const file: FileSystemItem = { ...activeFile, content: code }
        setActiveFile(file)
        const cursorPosition = view.state?.selection?.main?.head
        socket.emit(SocketEvent.TYPING_START, { cursorPosition })
        socket.emit(SocketEvent.FILE_UPDATED, {
            fileId: activeFile.id,
            newContent: code,
        })
        clearTimeout(timeOut)

        const newTimeOut = setTimeout(
            () => socket.emit(SocketEvent.TYPING_PAUSE),
            1000,
        )
        setTimeOut(newTimeOut)
    }

    // Listen wheel event to zoom in/out and prevent page reload
    usePageEvents()

    useEffect(() => {
        const extensions = [
            color,
            hyperLink,
            tooltipField(filteredUsers),
            cursorTooltipBaseTheme,
            scrollPastEnd(),
        ]
        
        // Convert language name to lowercase and handle common variations
        const normalizedLanguage = language.toLowerCase().replace(/\s+/g, '')
        const langExt = loadLanguage(normalizedLanguage as LanguageName)
        
        if (langExt) {
            extensions.push(langExt)
        } else {
            // Try common language aliases
            const languageAliases: Record<string, LanguageName> = {
                'javascript': 'javascript',
                'js': 'javascript',
                'typescript': 'typescript',
                'ts': 'typescript',
                'python': 'python',
                'py': 'python',
                'java': 'java',
                'cpp': 'cpp',
                'c++': 'cpp',
                'csharp': 'csharp',
                'cs': 'csharp',
                'c#': 'csharp',
                'html': 'html',
                'css': 'css',
                'json': 'json',
                'markdown': 'markdown',
                'md': 'markdown',
                'sql': 'sql',
                'php': 'php',
                'ruby': 'ruby',
                'rb': 'ruby',
                'rust': 'rust',
                'rs': 'rust',
                'go': 'go',
                'golang': 'go',
                'swift': 'swift',
                'kotlin': 'kotlin',
                'kt': 'kotlin',
                'scala': 'scala',
                'r': 'r',
                'shell': 'shell',
                'bash': 'shell',
                'sh': 'shell',
                'yaml': 'yaml',
                'yml': 'yaml',
                'xml': 'xml',
                'dockerfile': 'dockerfile',
                'docker': 'dockerfile'
            }
            
            const alias = languageAliases[normalizedLanguage]
            if (alias) {
                const aliasExt = loadLanguage(alias)
                if (aliasExt) {
                    extensions.push(aliasExt)
                } else {
                    toast.error(
                        `Syntax highlighting is unavailable for ${language}. Please try a different language setting.`,
                        { duration: 5000 }
                    )
                }
            } else {
                toast.error(
                    `Syntax highlighting is unavailable for ${language}. Please try a different language setting.`,
                    { duration: 5000 }
                )
            }
        }

        setExtensions(extensions)
    }, [filteredUsers, language])

    // Calculate editor height to account for file tabs
    const editorHeight = isMobile ? 'calc(100% - 10px)' : (viewHeight - 50) + 'px';

    return (
        <div className={cn(
            "editor-container relative w-full h-full", 
            { "sidebar-open": isSidebarOpen && isMobile }
        )}>
        <CodeMirror
            theme={editorThemes[theme]}
            onChange={onCodeChange}
            value={activeFile?.content}
            extensions={extensions}
            minHeight="100%"
            maxWidth="100vw"
                basicSetup={{
                    lineNumbers: !isMobile || width >= 480,
                    foldGutter: !isMobile || width >= 480,
                    highlightActiveLineGutter: true,
                    dropCursor: true,
                    allowMultipleSelections: true,
                    indentOnInput: true,
                    highlightActiveLine: true,
                    highlightSelectionMatches: true,
                }}
            style={{
                    fontSize: responsiveFontSize + "px",
                    height: editorHeight,
                position: "relative",
                    padding: isMobile ? "0.5rem" : "1rem",
                    zIndex: isMobile && isSidebarOpen ? 25 : 15,
                    maxHeight: '100%'
            }}
                className="responsive-editor"
        />
        </div>
    )
}

export default Editor
