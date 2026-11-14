import './App.css';
import {API_BASE_URL} from './config.js' 
import {useEffect, useRef, useState} from 'react'
import Sidebar from "./components/sidebar/Sidebar.jsx";
import MessageList from "./components/MessageList.jsx";
import { ArrowUp, Plus, Mic } from 'lucide-react';

function App (){
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [message, setMessage] = useState("")
    const [messages, setMessages] = useState([])
    const textareaRef = useRef(null)
    const requestIdRef = useRef(0)
    const mascotRef = useRef(null)
    const pointerPositionRef = useRef(null)

    const handlePointerMove = (event) => {
        pointerPositionRef.current = { x: event.clientX, y: event.clientY }
    }

    const handlePointerLeave = () => {
        pointerPositionRef.current = null
    }

    useEffect(() => {
        if (messages.length > 0 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

        const eyes = Array.from(mascotRef.current?.querySelectorAll(".welcome-eye") ?? [])
        const pupils = eyes.flatMap((eye) => {
            const pupil = eye.querySelector(".welcome-pupil")
            return pupil ? [{ eye, pupil, x: 0, y: 0 }] : []
        })
        const startedAt = performance.now()
        let lastFrame = startedAt
        let animationFrame

        const animateEyes = (now) => {
            const elapsed = (now - startedAt) / 1000
            const easing = 1 - Math.exp(-Math.min(now - lastFrame, 64) / 90)
            lastFrame = now

            pupils.forEach((gaze) => {
                const bounds = gaze.eye.getBoundingClientRect()
                const pointer = pointerPositionRef.current
                const targetX = pointer
                    ? Math.max(-3, Math.min(3, (pointer.x - (bounds.left + bounds.width / 2)) / 20))
                    : Math.sin(elapsed * 0.65) * 2.5
                const targetY = pointer
                    ? Math.max(-3, Math.min(3, (pointer.y - (bounds.top + bounds.height / 2)) / 20))
                    : Math.sin(elapsed * 0.5 + 1.2) * 1.5

                gaze.x += (targetX - gaze.x) * easing
                gaze.y += (targetY - gaze.y) * easing
                gaze.pupil.style.transform = `translate(${gaze.x}px, ${gaze.y}px)`
            })

            animationFrame = requestAnimationFrame(animateEyes)
        }

        animationFrame = requestAnimationFrame(animateEyes)
        return () => cancelAnimationFrame(animationFrame)
    }, [messages.length])

    const sendMessage = async () => {
        if (!message.trim()) return

        const outgoingMessage = message
        const requestId = ++requestIdRef.current
        setMessages((currentMessages) => [
            ...currentMessages,
            { role: "user", content: outgoingMessage },
            { role: "assistant", content: "", pending: true, requestId }
        ])

        setMessage("")
        if (textareaRef.current) {
            textareaRef.current.style.height = '40px'
            textareaRef.current.style.overflowY = 'hidden'
        }

        try {
            const result = await fetch(`${API_BASE_URL}/chat`, {
                method: "POST",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({ message: outgoingMessage })
            })

            if (!result.ok) {
                throw new Error(`Chat request failed with status ${result.status}`)
            }

            const data = await result.json()
            setMessages((currentMessages) => currentMessages.map((item) =>
                item.requestId === requestId
                    ? { ...item, content: data.response, pending: false }
                    : item
            ))
        } catch (error) {
            setMessages((currentMessages) => currentMessages.map((item) =>
                item.requestId === requestId
                    ? { ...item, content: "The agent couldn't reply. Please try again.", pending: false }
                    : item
            ))
            throw error
        }
    }

    return (
        <>
        <div
            className={`app ${sidebarOpen ? "sidebar-open" : "sidebar-collapsed"}`}
            onPointerMove={messages.length === 0 ? handlePointerMove : undefined}
            onPointerLeave={messages.length === 0 ? handlePointerLeave : undefined}
        >
            <Sidebar
                isOpen={sidebarOpen}
                onToggle={() => setSidebarOpen((open) => !open)}
            />
        <main className="min-w-0 flex h-[calc(100vh-40px)] min-h-0 flex-1 flex-col w-full items-center">
        <div className="flex min-h-0 w-full flex-1 flex-col items-center overflow-y-auto">
        {messages.length === 0 ? (
            <div className="flex w-full flex-1 flex-col items-center justify-center gap-5 px-6 text-center">
                <div className="welcome-mascot" ref={mascotRef} aria-hidden="true">
                    <div className="welcome-face">
                        <div className="welcome-eyes">
                            <span className="welcome-eye"><span className="welcome-pupil" /></span>
                            <span className="welcome-eye"><span className="welcome-pupil" /></span>
                        </div>
                        <div className="welcome-expression">
                            <span className="welcome-cheek" />
                            <span className="welcome-smile" />
                            <span className="welcome-cheek" />
                        </div>
                    </div>
                </div>
                <h2 className="welcome-content-width text-2xl font-bold leading-tight tracking-tight text-indigo-600 sm:text-3xl md:text-4xl lg:text-5xl">
                    Hello! How can I help you today?
                </h2>
            </div>
        ) : (
            <div className="box-border flex min-w-0 flex-col w-[80%] p-4">
                <MessageList messages={messages} setMessages={setMessages}/>
                <inputchat />
            </div>
        )}

        </div>
        <div className="chat welcome-content-width mt-auto"> 
            <button id="plus-icon"><Plus size={23} /></button>
            <textarea
                ref={textareaRef}
                placeholder="Ask me anything..."
                rows={1}
                value={message}
                onKeyDown={(event) => {
                    if (event.key === 'Enter' && !event.shiftKey) {
                        event.preventDefault()
                        sendMessage()
                    }
                }}

                onChange={(event) => {
                    setMessage(event.target.value)
                    const textarea = event.currentTarget;
                    textarea.style.height = 'auto';
                    textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
                    textarea.style.overflowY = textarea.scrollHeight > 200 ? 'auto' : 'hidden';
                }}
            />
            
            <button id="mic"><Mic size={23}/></button>
            <button id="arrow-icon" onClick={sendMessage}><ArrowUp size={23} /></button>
            
        </div>
        </main> 
        </div>
</>
    )
}
export default App