
function MessageList(){
    const messages = []
   return(
       <>
       <div className="flex flex-col">
        
        {
           messages.map((message, index) => (
            <div key ={index}>
                {message.content}
                </div>
         ))}

       </div>
       </>
    )}