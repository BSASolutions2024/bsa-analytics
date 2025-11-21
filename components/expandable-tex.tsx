"use client"

import { useState } from "react"

export default function ExpandableText({ text, max = 100 }: { text: string; max?: number }) {
    const [expanded, setExpanded] = useState(false)

    const isLong = text.length > max
    const displayText = expanded ? text : text.slice(0, max)

    return (
        <div className="whitespace-normal wrap-break-words">
            <p className="inline">
                {displayText}
                {!expanded && isLong && "..."}
            </p>

            {isLong && (
                <button
                    className="ml-1 text-blue-600 text-xs underline"
                    onClick={() => setExpanded(!expanded)}
                >
                    {expanded ? "See less" : "See more"}
                </button>
            )}
        </div>
    )
}
