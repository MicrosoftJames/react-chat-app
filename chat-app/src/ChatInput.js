<div className="chat-input">
<textarea type="text" 
placeholder="Type a message..." 
value={message}
onChange={e => setMessage(e.target.value)}
onKeyDown={handleKeyDown}
/>                     
<button>Send</button>
</div>