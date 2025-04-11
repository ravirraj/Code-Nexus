import { ChangeEvent, ReactNode } from "react"
import { PiCaretDownBold } from "react-icons/pi"

interface SelectProps {
    onChange: (e: ChangeEvent<HTMLSelectElement>) => void
    value: string
    options?: string[]
    title?: string
    children?: ReactNode
    className?: string
    id?: string
}

function Select({ onChange, value, options, title, children, className, id }: SelectProps) {
    return (
        <div className="relative w-full">
            {title && <label className="mb-2">{title}</label>}
            <select
                id={id}
                className={className}
                value={value}
                onChange={onChange}
            >
                {options ? (
                    options.sort().map((option) => {
                        const value = option
                        const name = option.charAt(0).toUpperCase() + option.slice(1)
                        return (
                            <option key={name} value={value}>
                                {name}
                            </option>
                        )
                    })
                ) : (
                    children
                )}
            </select>
            <PiCaretDownBold
                size={16}
                className="absolute bottom-3 right-4 z-10 text-white"
            />
        </div>
    )
}

export default Select
