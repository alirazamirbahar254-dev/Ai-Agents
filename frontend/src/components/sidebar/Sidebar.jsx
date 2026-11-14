import "./Sidebar.css";
import {Bot, Search, PanelLeft, MessageSquarePlus, CalendarClock, History} from 'lucide-react';


function Sidebar({isOpen, onToggle}){
    return(
        <>
    <div className={`sidebar-collapse-control ${isOpen ? "is-open" : "is-closed"}`}>
      <button
        id="toggle_sibar"
        aria-label={isOpen ? "Collapse sidebar" : "Open sidebar"}
        aria-expanded={isOpen}
        onClick={onToggle}
      >
        <PanelLeft size={18}/>
      </button>
    </div>
    
    <div className={ `sidebar ${isOpen ? "flex" :"hidden"}`}>
    <div className="header">
    <div className="sidebar_brand">
      <span className="sidebar_brand-icon" aria-hidden="true">
        <Bot size={21} strokeWidth={2.2} />
      </span>
      <span className="sidebar_brand-name">AI Agent</span>
    </div>
    <div className="sidebar_btn ">
    <button id="search"><Search size={18}/></button>
    
    </div>
   </div>
   <div>
    <button id="new_chat">
      <MessageSquarePlus size={18} />
      <span>New Chat</span>
    </button>

    <button id="scheduled">
      <CalendarClock size={18} />
      <span>Scheduled</span>
    </button>
  
    <button id="History">
      <History size={18} />
      <span>History</span>
    </button>


   </div>
    </div>
        </>
    )
}

export default Sidebar;
