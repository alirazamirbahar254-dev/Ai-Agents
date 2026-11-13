import "./Sidebar.css";
import {Search, PanelLeft,  MessageSquarePlus} from 'lucide-react';

function Sidebar(){
    return(
        <>
    <div className="sidebar">
    <div className="header">
    <p>AI Agent</p>
    <div className="sidebar_btn">
    <button id="search"><Search size={18} /></button>
    <button id="toggle_sibar"><PanelLeft size={18}/></button>
    </div>
   </div>
   <div>
    <button id="new_chat">
      <MessageSquarePlus size={18} />
      <span>New Chat</span>
    </button>
   </div>
    </div>
        </>
    )
}

export default Sidebar;
