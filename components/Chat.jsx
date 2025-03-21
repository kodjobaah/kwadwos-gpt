'use client';

import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";

const Chat = () => {
    const [text, setText] = useState('');
    const [messages, setMessages] = useState([]);

    const chatMutation = useMutation({
        mutationFn: async (query) => {

           const resp = await fetch('/api/chat',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify([...messages, query]),
            });
            const output = await resp.json();
            return output;
        },
        onSuccess: (data) => {
            if(data.error) {
                setMessages((prevEntries) => prevEntries.slice(0, -1));
                toast.error(data.error);
                return;
            }
            setMessages((prev) => [...prev, data]);

        },
        onError: (error) => {
            console.log(error)
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const query = { role : 'user', content: text};
        chatMutation.mutate(query);
        setMessages((prev) => [...prev, query]);
        setText('');
    }


    return (
        <div className='min-h-[calc(100vh-6rem)] grid grid-rows-[1fr,auto]'>
            <div>
              {messages.map(({role, content}, index) => {
                const avatar = role == 'user' ? '🗣️' : '🤖';
                const bcg = role == 'user' ? 'bg-base-200' : 'bg-base-100';
                return (
                    <div 
                    key={index}
                    className={` ${bcg} flex py-6 -mx-8 px-8 text-xl leading-loose border-b border-base-300`}
                    >
                        <span className='mr-4'>{avatar}</span>
                        <p className="max-w-3xl">  {content}</p>

                    </div>
                );
              })}
              {chatMutation.isPending && <span className="loading"></span>}
            </div>
            <form onSubmit={handleSubmit} className="max-w-4xl pt-12">

                <div className='join w-full'>
                    <input
                        type='text'
                        placeholder="Message Kwadwo's GPT"
                        className="input input-bordered join-item w-full"
                        value={text}
                        required
                        onChange={(e) => setText(e.target.value)} />
                    <button type='submit' 
                    className='btn btn-primary join-item'
                    disabled={chatMutation.isPending}
                    >
                        {chatMutation.isPending? 'Please wait..': 'Ask Question'}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default Chat