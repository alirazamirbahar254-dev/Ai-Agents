
import { useEffect, useRef, useState } from "react"
import ReactMarkdown from "react-markdown"
import { Check, CircleX, Copy, Eye, Pencil } from 'lucide-react'
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

function renderMessageContent(message){
    if(message.role !== "assistant") return message.content

    return(
        <ReactMarkdown
            components={{
                code({children, className}){
                    const language = /language-(\w+)/.exec(className || "")?.[1] || "text";
                    return(
                        <SyntaxHighlighter
                            language={language}
                            style={oneDark}
                            className={className}
                            codeTagProps={{ "data-language": language }}
                        >
                            {children}
                        </SyntaxHighlighter>
                    )
                }
            }}
        >
            {message.content}
        </ReactMarkdown>
    )
}

function htmlToMarkdown(element){
    const convert = (node) => {
        if(node.nodeType === 3) return node.textContent || ""
        if(node.nodeType !== 1) return ""

        const children = Array.from(node.childNodes).map(convert).join("")
        switch(node.tagName){
            case "H1":
            case "H2":
            case "H3":
            case "H4":
            case "H5":
            case "H6":
                return `${"#".repeat(Number(node.tagName[1]))} ${children.trim()}\n\n`
            case "P":
            case "DIV":
                return `${children}\n\n`
            case "STRONG":
            case "B":
                return `**${children}**`
            case "EM":
            case "I":
                return `*${children}*`
            case "DEL":
            case "S":
                return `~~${children}~~`
            case "CODE":
                return node.parentElement?.tagName === "PRE" ? children : `\`${children}\``
            case "PRE": {
                const code = node.querySelector("code")
                const language = code?.getAttribute("data-language")
                    || /language-(\w+)/.exec(`${node.className} ${code?.className || ""}`)?.[1]
                return `\`\`\`${language || ""}\n${node.textContent?.replace(/\n+$/, "") || ""}\n\`\`\`\n\n`
            }
            case "UL":
            case "OL":
                return `${Array.from(node.children).map((item, index) =>
                    `${node.tagName === "OL" ? `${index + 1}.` : "-"} ${Array.from(item.childNodes).map(convert).join("").trim()}`
                ).join("\n")}\n\n`
            case "A":
                return `[${children}](${node.getAttribute("href") || ""})`
            case "BR":
                return "\n"
            default:
                return children
        }
    }

    return Array.from(element.childNodes).map(convert).join("").replace(/\n{3,}/g, "\n\n").trim()
}

function MessageList(props){
    const messages = props.messages;
    const setMessages = props.setMessages;

    const bottomRef = useRef(null)
    const editorRef = useRef(null)

    const copyFeedbackTimeoutRef = useRef(null)
    const [copyFeedback, setCopyFeedback] = useState(null)
    const [edit, setEdit] = useState(null)
    const [editDimensions, setEditDimensions] = useState(null)

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
    }, [messages])

    useEffect(() => () => window.clearTimeout(copyFeedbackTimeoutRef.current), [])

    if (messages.length === 0) return null

   return(
       <>
      
       <div className="flex w-full min-w-0 flex-col gap-2">
        {
           messages.map((message, index) => (
            <div key ={index}className={`flex w-full min-w-0 ${
                
                message.role === "user"
                ? "justify-end"
                : "justify-start"
                
            }`}
            >

                <div className="flex flex-col group">
                <div style={edit === index && editDimensions ? {
                    width: `${editDimensions.width}px`,
                    minHeight: `${editDimensions.height}px`
                } : undefined} className={`chat-message box-border min-w-0 max-w-full break-words [overflow-wrap:anywhere] rounded-2xl border p-4 leading-relaxed shadow-sm ${
                        message.role === "user" ? "rounded-br-md" : "rounded-bl-md"
                    } ${
                        
                        edit === index
                            ? "chat-message--editing"
                            : message.role === "user"
                                ? "border-indigo-200 bg-indigo-100 text-indigo-950"
                                : "border-slate-200 bg-white text-slate-800"
                }`}>
                {message.pending ? (
                    
                    <span className="response-typing" aria-label="Agent is responding">
                        <i />
                        <i />
                        <i />
                    </span>

                ):edit === index ?(
                    <div
                        ref={editorRef}
                        className="chat-message-editor min-w-0 outline-none"
                        style={editDimensions ? {
                            minHeight: `${Math.max(40, editDimensions.height - 34)}px`
                        } : undefined}
                        contentEditable
                        suppressContentEditableWarning
                        role="textbox"
                        aria-label="Edit message"
                        aria-multiline="true"
                    >
                        {renderMessageContent(message)}
                    </div>
                ) : renderMessageContent(message)}
                
                </div>
                <div className="self-end gap-0 p-1 bg-transparent border-none flex invisible group-hover:visible items-center -translate-y-1">
                
                <button
                    aria-label={copyFeedback?.index === index
                        ? copyFeedback.status === "copied" ? "Message copied" : "Copy failed"
                        : "Copy message"}
                    className="flex h-6 w-6 flex-none cursor-pointer items-center justify-center border-0 bg-transparent p-0"
                    onClick={async (event) => {
                        let status = "copied"
                        try {
                            const card = event.currentTarget.closest(".group")?.querySelector(".chat-message")
                            if (!card) throw new Error("Cannot find message content to copy")
                            await navigator.clipboard.writeText(card.innerText)
                        } catch (error) {
                            console.error("Failed to copy message to clipboard", error)
                            status = "failed"
                        }

                        setCopyFeedback({ index, status })
                        window.clearTimeout(copyFeedbackTimeoutRef.current)
                        copyFeedbackTimeoutRef.current = window.setTimeout(() => {
                            setCopyFeedback((current) => current?.index === index ? null : current)
                        }, 1500)
                    }}
                >
                    {copyFeedback?.index === index
                        ? copyFeedback.status === "copied"
                            ? <Check size={15} className="text-emerald-600" />
                            : <CircleX size={15} className="text-red-500" />
                        : <Copy size={15} />}
                </button>

                <button
                    aria-label={edit === index ? "Preview and save message" : "Edit message"}
                    className="flex h-6 w-6 flex-none cursor-pointer items-center justify-center border-0 bg-transparent p-0"
                    onClick={(event) => {
                        if(edit === index){
                            const content = editorRef.current
                                ? htmlToMarkdown(editorRef.current)
                                : message.content
                            setMessages((currentMessages) => currentMessages.map((item, itemIndex) =>
                                itemIndex === index ? { ...item, content } : item
                            ))
                            setEdit(null)
                            return
                        }
                        
                        const card = event.currentTarget.closest(".group")?.querySelector(".chat-message")
                        const bounds = card?.getBoundingClientRect()
                        setEditDimensions(bounds ? { width: bounds.width, height: bounds.height } : null)
                        setEdit(index)
                    }}
                >
                    {edit === index
                        ? <Eye size={15} className="cursor-pointer" />
                        : <Pencil size={15} className="cursor-pointer" />}
                </button>
                 
                </div>
                </div>
                </div>
         ))}

         <div ref={bottomRef} />
       </div>
       </>
    )}
    export default MessageList;