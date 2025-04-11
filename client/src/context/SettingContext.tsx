import { createContext, useContext, useEffect, useState } from "react"
import { Settings, SettingContextType } from "@/types/setting"
import { ReactNode } from "react"

const defaultSettings: Settings = {
    theme: "dark",
    language: "javascript",
    fontSize: 14,
    fontFamily: "monospace",
}

const SettingContext = createContext<SettingContextType | null>(null)

export const useSettings = (): SettingContextType => {
    const context = useContext(SettingContext)
    if (!context) {
        throw new Error("useSettings must be used within a SettingProvider")
    }
    return context
}

export function SettingProvider({ children }: { children: ReactNode }) {
    const storedSettings = JSON.parse(
        localStorage.getItem("settings") || "{}"
    ) as Settings

    const storedTheme =
        storedSettings.theme !== undefined
            ? storedSettings.theme
            : defaultSettings.theme

    const storedLanguage =
        storedSettings.language !== undefined
            ? storedSettings.language
            : defaultSettings.language

    const storedFontSize =
        storedSettings.fontSize !== undefined
            ? storedSettings.fontSize
            : defaultSettings.fontSize

    const storedFontFamily =
        storedSettings.fontFamily !== undefined
            ? storedSettings.fontFamily
            : defaultSettings.fontFamily

    const [theme, setTheme] = useState<string>(storedTheme)
    const [language, setLanguage] = useState<string>(storedLanguage)
    const [fontSize, setFontSize] = useState<number>(storedFontSize)
    const [fontFamily, setFontFamily] = useState<string>(storedFontFamily)
    const [tabSize, setTabSize] = useState(4)

    const resetSettings = () => {
        setTheme(defaultSettings.theme)
        setLanguage(defaultSettings.language)
        setFontSize(defaultSettings.fontSize)
        setFontFamily(defaultSettings.fontFamily)
        setTabSize(4)
    }

    useEffect(() => {
        const settings: Settings = {
            theme,
            language,
            fontSize,
            fontFamily,
        }
        localStorage.setItem("settings", JSON.stringify(settings))
    }, [theme, language, fontSize, fontFamily])

    return (
        <SettingContext.Provider
            value={{
                theme,
                setTheme,
                language,
                setLanguage,
                fontSize,
                setFontSize,
                fontFamily,
                setFontFamily,
                tabSize,
                setTabSize,
                resetSettings
            }}
        >
            {children}
        </SettingContext.Provider>
    )
}
