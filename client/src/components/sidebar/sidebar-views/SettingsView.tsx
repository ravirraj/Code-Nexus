import { useSettings } from "@/context/SettingContext"
import Select from "@/components/common/Select"
import { editorFonts } from "@/resources/Fonts"
import { editorThemes } from "@/resources/Themes"
import { langNames } from "@uiw/codemirror-extensions-langs"

export default function SettingsView() {
    const { 
        theme,
        setTheme,
        language,
        setLanguage,
        fontSize,
        setFontSize,
        fontFamily,
        setFontFamily,
        tabSize,
        setTabSize
    } = useSettings()

    const resetSettings = () => {
        setTheme("system")
        setLanguage("javascript")
        setFontSize(12)
        setFontFamily("monospace")
        setTabSize(4)
    }

    return (
        <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b border-gray-200 p-4">
                <h2 className="text-lg font-semibold">Settings</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-4">
                    <div>
                        <label htmlFor="font-family" className="block text-sm font-medium text-gray-700">
                            Font Family
                        </label>
                        <Select
                            title="Font Family"
                            value={fontFamily}
                            onChange={(e) => setFontFamily(e.target.value)}
                            options={editorFonts}
                        />
                    </div>
                    <div>
                        <label htmlFor="font-size" className="block text-sm font-medium text-gray-700">
                            Font Size
                        </label>
                        <input
                            type="range"
                            id="font-size"
                            min="8"
                            max="24"
                            value={fontSize}
                            onChange={(e) => setFontSize(parseInt(e.target.value))}
                        />
                    </div>
                    <div>
                        <label htmlFor="theme" className="block text-sm font-medium text-gray-700">
                            Theme
                        </label>
                        <Select
                            title="Theme"
                            value={theme}
                            onChange={(e) => setTheme(e.target.value)}
                            options={Object.keys(editorThemes)}
                        />
                    </div>
                    <div>
                        <label htmlFor="language" className="block text-sm font-medium text-gray-700">
                            Language
                        </label>
                        <Select
                            title="Language"
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            options={langNames}
                        />
                    </div>
                    <div>
                        <label htmlFor="tab-size" className="block text-sm font-medium text-gray-700">
                            Tab Size
                        </label>
                        <input
                            type="number"
                            id="tab-size"
                            min="2"
                            max="8"
                            value={tabSize}
                            onChange={(e) => setTabSize(parseInt(e.target.value))}
                        />
                    </div>
                    <button
                        className="mt-4 rounded-md bg-primary p-2 text-black"
                        onClick={resetSettings}
                    >
                        Reset Settings
                    </button>
                </div>
            </div>
        </div>
    )
}
