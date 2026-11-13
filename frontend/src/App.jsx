import './App.css'
import Sidebar from "./components/sidebar/Sidebar.jsx";
import { ArrowUp, Plus, Search } from 'lucide-react';

function App (){
    return (
        <>
        <div className="app">
            <Sidebar />
        <h2 className="text-10xl font-bold text-indigo-600">
            Hello! How can I help you today?</h2>
        <div className="chat"> 
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
        </div>
</>
    )
}
export default App