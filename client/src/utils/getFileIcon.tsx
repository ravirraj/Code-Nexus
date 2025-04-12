import { Icon } from "@iconify/react"
import { LuFile } from "react-icons/lu"

const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase()

    switch (extension) {
        // Web
        case 'html':
            return <Icon icon="vscode-icons:file-type-html" className="h-4 w-4 text-orange-500" />
        case 'css':
            return <Icon icon="vscode-icons:file-type-css" className="h-4 w-4 text-blue-500" />
        case 'js':
        case 'jsx':
            return <Icon icon="vscode-icons:file-type-js-official" className="h-4 w-4 text-yellow-500" />
        case 'ts':
        case 'tsx':
            return <Icon icon="vscode-icons:file-type-typescript-official" className="h-4 w-4 text-blue-500" />
        
        // Programming Languages
        case 'py':
            return <Icon icon="vscode-icons:file-type-python" className="h-4 w-4 text-yellow-500" />
        case 'java':
            return <Icon icon="vscode-icons:file-type-java" className="h-4 w-4 text-red-500" />
        case 'cpp':
        case 'c':
            return <Icon icon="vscode-icons:file-type-cpp" className="h-4 w-4 text-blue-500" />
        case 'cs':
            return <Icon icon="vscode-icons:file-type-csharp" className="h-4 w-4 text-purple-500" />
        case 'go':
            return <Icon icon="vscode-icons:file-type-go" className="h-4 w-4 text-blue-500" />
        case 'rs':
            return <Icon icon="vscode-icons:file-type-rust" className="h-4 w-4 text-orange-500" />
        case 'rb':
            return <Icon icon="vscode-icons:file-type-ruby" className="h-4 w-4 text-red-500" />
        case 'php':
            return <Icon icon="vscode-icons:file-type-php" className="h-4 w-4 text-purple-500" />
        
        // Data
        case 'json':
            return <Icon icon="vscode-icons:file-type-json" className="h-4 w-4 text-yellow-500" />
        case 'xml':
            return <Icon icon="vscode-icons:file-type-xml" className="h-4 w-4 text-orange-500" />
        case 'yaml':
        case 'yml':
            return <Icon icon="vscode-icons:file-type-yaml" className="h-4 w-4 text-green-500" />
        case 'md':
            return <Icon icon="vscode-icons:file-type-markdown" className="h-4 w-4 text-blue-500" />
        
        // Config
        case 'env':
            return <Icon icon="vscode-icons:file-type-env" className="h-4 w-4 text-green-500" />
        case 'gitignore':
            return <Icon icon="vscode-icons:file-type-git" className="h-4 w-4 text-red-500" />
        
        // Default
        default:
            return <LuFile className="h-4 w-4 text-slate-400" />
    }
}

export default getFileIcon 