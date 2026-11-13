import './App.css';
import Sidebar from "./components/sidebar/Sidebar.jsx";
import MessageList from "./components/MessageList.jsx";
import { ArrowUp, Plus, Search } from 'lucide-react';

function App (){
    return (

        <>
        <div className="app">
            <Sidebar />
        <main className="min-w-0 flex flex-1 flex-col w-full h-screen items-center justify-between">
        <h2 className="text-10xl font-bold text-indigo-600">
            Hello! How can I help you today?</h2>

        <div className="flex flex-1 flex-col w-full items-center">

        <div className="box-border flex min-w-0 flex-1 flex-col w-[80%] p-4">
            <MessageList/>
            <inputchat />

        </div>
            
        </div>
        <div className="chat mt-auto"> 
            <button id="plus-icon"><Plus size={23} /></button>
            <textarea
                placeholder="Ask me anything..."
                rows={1}
                onChange={(event) => {
                    const textarea = event.currentTarget;
                    textarea.style.height = 'auto';
                    textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
                    textarea.style.overflowY = textarea.scrollHeight > 200 ? 'auto' : 'hidden';
                }}
            />
            <button id="arrow-icon"><ArrowUp size={23} /></button>
        </div>
        </main> 
        </div>
</>
    )
}
export default App