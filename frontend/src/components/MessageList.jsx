import { useEffect, useRef } from "react"
import ReactMarkdown from "react-markdown"
import  {Copy, Pencil} from 'lucide-react'
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

function MessageList(props){
    const messages = props.messages;
    const bottomRef = useRef(null)

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
    }, [messages])

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
                <div className={`chat-message box-border min-w-0 max-w-full break-words [overflow-wrap:anywhere] rounded-2xl border p-4 leading-relaxed shadow-sm ${
                        message.role === "user"
                    ? "rounded-br-md border-indigo-200 bg-indigo-100 text-indigo-950"
                    : "rounded-bl-md border-slate-200 bg-white text-slate-800"
                }`}>
                {message.pending ? (
                    
                    <span className="response-typing" aria-label="Agent is responding">
                        <i />
                        <i />
                        <i />
                    </span>

                ) : message.role === "assistant" ? (
                <ReactMarkdown 
                components={{
                    code({children, className, ...props }){
                        // Extract programming language from Markdown className
                        const language = /language-(\w+)/.exec(className || "")?.[1] || "text";
                        return(
                            <SyntaxHighlighter language={language} style={oneDark}>
                    {children}
                </SyntaxHighlighter>
                        )
                    }
                }}
                >{message.content}</ReactMarkdown>
                ) : message.content}
                
                </div>
                <div className="self-end gap-2 p-1 cursor-pointer flex invisible group-hover:visible">
    
                <Copy size={15} />
                <Pencil size={15} />

                </div>
                </div>
                </div>
         ))}
         <div ref={bottomRef} />
       </div>
       </>
    )}
    export default MessageList;