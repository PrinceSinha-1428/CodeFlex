"use client";

import { vapi } from "@/lib/vapi";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const GenerateProgramPage = () => {
  const [callActive, setCallActive] = useState<boolean>(false);
  const [connecting, setConnecting] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [callEnded, setCallEnded] = useState<boolean>(false);
  const [messages, setMessages] = useState([]);
  const router = useRouter();
  const {user} = useUser();
  const messageContainerRef = useRef<HTMLDivElement>(null);

  // auto scroll messages
  useEffect(() => {
    if(messageContainerRef.current){
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  },[messages]);

  // navigate user to profile page after call ends
  useEffect(() => {
    if(callEnded){
      const redirectTimer = setTimeout(() => {
        router.push("/profile");
      },1500);

      return () => clearTimeout(redirectTimer);
    }
  },[callEnded,router])

  // setup event listeners
  useEffect(() => {

    const handleCallStart = () => {
      console.log("Call Started");
      setConnecting(false);
      setCallActive(true);
      setCallEnded(false);
    };
    const handleCallEnd = () => {
      console.log("call ended");
      setCallActive(false);
      setConnecting(false);
      setIsSpeaking(false);
      setCallEnded(true);
    };
    const handleSpeechStart = () => {
      console.log("Ai Speaking");
      setIsSpeaking(true);
    };
    const handleSpeechEnd = () => {
      console.log("Ai stoped Speaking");
      setIsSpeaking(false);
    };
    const handleMessage = (message: string) => {
      
    };
    const handleError = (error: Error) => {
      console.log("Vapi error",error);
      setConnecting(false);
      setCallActive(false);
    };

    vapi.on("call-start",handleCallStart)
    .on("call-end",handleCallEnd)
    .on("speech-start",handleSpeechStart)
    .on("speech-end",handleSpeechEnd)
    .on("message",handleMessage)
    .on("error",handleError)

    // cleanup function when component unmounted
    return () => {
      vapi.off("call-start",handleCallStart)
    .off("call-end",handleCallEnd)
    .off("speech-start",handleSpeechStart)
    .off("speech-end",handleSpeechEnd)
    .off("message",handleMessage)
    .off("error",handleError)
    }
  },[])

  const toggleCall = async () => {
    if(callActive){
      vapi.stop();
    }else {
      try {
        setConnecting(true);
        setMessages([]);
        setCallEnded(false);
        const fullName = user?.firstName ?  `${user?.firstName} ${user?.lastName || ""}`.trim() : "There";
        await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!,{
          variableValues: {
            full_name: fullName
          }
        })
      } catch (error) {
        console.log("Error starting call",error);
        setConnecting(false);
      }
    }
  }

  return (
    <div>
      generate program
    </div>
  )
}

export default GenerateProgramPage
 