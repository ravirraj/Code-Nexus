import { useSettings } from "@/context/SettingContext"
import Select from "@/components/common/Select"
import { editorFonts } from "@/resources/Fonts"
import { editorThemes } from "@/resources/Themes"
import { langs } from "@uiw/codemirror-extensions-langs"

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

    const langNames = Object.keys(langs)

    const resetSettings = () => {
        setTheme("system")
        setLanguage("javascript")
        setFontSize(12)
        setFontFamily("monospace")
        setTabSize(4)
    }

    return (
        <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b border-slate-700/50 p-4">
                <h2 className="text-lg font-semibold text-white">Settings</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="font-family" className="block text-sm font-medium text-slate-300">
                            Font Family
                        </label>
                        <Select
                            id="font-family"
                            value={fontFamily}
                            onChange={(e) => setFontFamily(e.target.value)}
                            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-300 focus:border-indigo-500 focus:outline-none"
                        >
                            {editorFonts.map((font) => (
                                <option key={font} value={font}>{font}</option>
                            ))}
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="font-size" className="block text-sm font-medium text-slate-300">
                            Font Size: {fontSize}px
                        </label>
                        <input
                            type="range"
                            id="font-size"
                            min="8"
                            max="24"
                            value={fontSize}
                            onChange={(e) => setFontSize(parseInt(e.target.value))}
                            className="w-full accent-indigo-500"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="theme" className="block text-sm font-medium text-slate-300">
                            Theme
                        </label>
                        <Select
                            id="theme"
                            value={theme}
                            onChange={(e) => setTheme(e.target.value)}
                            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-300 focus:border-indigo-500 focus:outline-none"
                        >
                            {Object.keys(editorThemes).map((themeName) => (
                                <option key={themeName} value={themeName}>{themeName}</option>
                            ))}
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="language" className="block text-sm font-medium text-slate-300">
                            Language
                        </label>
                        <Select
                            id="language"
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-300 focus:border-indigo-500 focus:outline-none"
                        >
                            {langNames.map((lang) => (
                                <option key={lang} value={lang}>{lang}</option>
                            ))}
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="tab-size" className="block text-sm font-medium text-slate-300">
                            Tab Size
                        </label>
                        <input
                            type="number"
                            id="tab-size"
                            min="2"
                            max="8"
                            value={tabSize}
                            onChange={(e) => setTabSize(parseInt(e.target.value))}
                            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-300 focus:border-indigo-500 focus:outline-none"
                        />
                    </div>

                    <button
                        onClick={resetSettings}
                        className="w-full rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-600 focus:outline-none"
                    >
                        Reset Settings
                    </button>
                </div>
            </div>
        </div>
    )
}
