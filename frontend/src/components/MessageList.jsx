
import { useEffect, useRef } from "react"

function MessageList(props){
    const messages = props.messages;
    const bottomRef = useRef(null)

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
    }, [messages])

    if (messages.length === 0) return null

   return(
       <>
       <div className="flex w-full min-w-0 flex-col gap-3">
        {
           messages.map((message, index) => (
            <div key ={index}className={`flex w-full min-w-0 ${
                message.role === "user"
                ? "justify-end"
                : "justify-start"
            }`}
            >
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
                ) : message.content}
                </div>
                </div>
         ))}
         <div ref={bottomRef} />
       </div>
       </>
    )}
    export default MessageList;