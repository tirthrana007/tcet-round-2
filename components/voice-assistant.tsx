"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Volume2, VolumeX, Mic, MicOff, MessageCircle, Settings, User, Bot } from "lucide-react"

interface VoiceAssistantProps {
  currentAlert: "none" | "level1" | "level2" | "level3"
  alertnessScore: number
  isActive: boolean
}

interface Message {
  id: number
  type: "user" | "assistant"
  content: string
  timestamp: Date
}

export function VoiceAssistant({ currentAlert, alertnessScore, isActive }: VoiceAssistantProps) {
  const [isListening, setIsListening] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState([75])
  const [personality, setPersonality] = useState("friendly")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: "assistant",
      content: "Hello! I'm your AI driving companion. I'm here to help keep you alert and safe on the road.",
      timestamp: new Date(),
    },
  ])
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const personalities = {
    friendly: {
      name: "Friendly",
      description: "Warm and encouraging",
      color: "bg-blue-50 border-blue-200 text-blue-800",
    },
    professional: {
      name: "Professional",
      description: "Direct and informative",
      color: "bg-slate-50 border-slate-200 text-slate-800",
    },
    motivational: {
      name: "Motivational",
      description: "Energetic and uplifting",
      color: "bg-green-50 border-green-200 text-green-800",
    },
    calm: {
      name: "Calm",
      description: "Soothing and relaxed",
      color: "bg-purple-50 border-purple-200 text-purple-800",
    },
  }

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Generate contextual messages based on alert level
  useEffect(() => {
    if (!isActive) return

    const generateContextualMessage = () => {
      let message = ""

      switch (currentAlert) {
        case "level1":
          const level1Messages = [
            "I notice you might be getting a bit tired. How about some fresh air?",
            "Your blink rate suggests mild fatigue. Consider a short break soon.",
            "You're doing great! Just a gentle reminder to stay alert.",
          ]
          message = level1Messages[Math.floor(Math.random() * level1Messages.length)]
          break

        case "level2":
          const level2Messages = [
            "I'm detecting signs of fatigue. Please find a safe place to rest.",
            "Your alertness has dropped. Time for a break - safety first!",
            "Let's pull over safely. A 15-minute rest will help you feel refreshed.",
          ]
          message = level2Messages[Math.floor(Math.random() * level2Messages.length)]
          break

        case "level3":
          const level3Messages = [
            "URGENT: Please pull over immediately. Your safety is critical.",
            "Critical fatigue detected. Find the nearest safe stopping point now.",
            "This is serious - please stop driving and rest immediately.",
          ]
          message = level3Messages[Math.floor(Math.random() * level3Messages.length)]
          break

        default:
          if (Math.random() < 0.1) {
            // 10% chance for encouraging messages
            const encouragingMessages = [
              "You're maintaining excellent alertness! Keep up the great driving.",
              "Your focus is impressive today. Safe travels!",
              "Everything looks good from here. You're a model driver!",
            ]
            message = encouragingMessages[Math.floor(Math.random() * encouragingMessages.length)]
          }
      }

      if (message) {
        addAssistantMessage(message)
      }
    }

    const interval = setInterval(generateContextualMessage, 30000) // Every 30 seconds
    return () => clearInterval(interval)
  }, [currentAlert, isActive])

  const addAssistantMessage = (content: string) => {
    setIsTyping(true)

    setTimeout(() => {
      const newMessage: Message = {
        id: Date.now(),
        type: "assistant",
        content,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, newMessage])
      setIsTyping(false)
    }, 1000) // Simulate typing delay
  }

  const addUserMessage = (content: string) => {
    const newMessage: Message = {
      id: Date.now(),
      type: "user",
      content,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, newMessage])

    // Simulate assistant response
    setTimeout(() => {
      const responses = [
        "I understand. Let me help you with that.",
        "Thanks for letting me know. I'll adjust accordingly.",
        "Got it! I'm here to support your safe driving.",
        "That's helpful feedback. I'll keep that in mind.",
      ]
      addAssistantMessage(responses[Math.floor(Math.random() * responses.length)])
    }, 2000)
  }

  const handleQuickResponse = (response: string) => {
    addUserMessage(response)
  }

  const toggleListening = () => {
    setIsListening(!isListening)
    if (!isListening) {
      // Simulate voice recognition
      setTimeout(() => {
        addUserMessage("I'm feeling a bit tired, but I'm okay to continue.")
        setIsListening(false)
      }, 3000)
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="space-y-6">
      {/* Voice Assistant Control */}
      <Card className="bg-white border-slate-200 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold flex items-center gap-3">
            <MessageCircle className="h-6 w-6 text-green-500" />
            AI Voice Assistant
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => setIsMuted(!isMuted)}
                variant={isMuted ? "destructive" : "default"}
                size="lg"
                className="text-base font-semibold"
              >
                {isMuted ? <VolumeX className="h-5 w-5 mr-2" /> : <Volume2 className="h-5 w-5 mr-2" />}
                {isMuted ? "Unmute" : "Mute"}
              </Button>

              <Button
                onClick={toggleListening}
                variant={isListening ? "destructive" : "outline"}
                size="lg"
                className="text-base font-semibold"
              >
                {isListening ? <MicOff className="h-5 w-5 mr-2" /> : <Mic className="h-5 w-5 mr-2" />}
                {isListening ? "Stop Listening" : "Voice Input"}
              </Button>
            </div>

            <Badge variant={isActive ? "default" : "secondary"} className="text-sm font-semibold px-3 py-1">
              {isActive ? "ACTIVE" : "STANDBY"}
            </Badge>
          </div>

          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-base font-semibold text-slate-900">Volume</span>
              <span className="text-lg font-bold text-slate-900">{volume[0]}%</span>
            </div>
            <Slider value={volume} onValueChange={setVolume} max={100} step={1} className="w-full" disabled={isMuted} />
          </div>

          <div>
            <span className="text-base font-semibold text-slate-900 mb-3 block">Assistant Personality</span>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(personalities).map(([key, config]) => (
                <Button
                  key={key}
                  variant={personality === key ? "default" : "outline"}
                  onClick={() => setPersonality(key)}
                  className="text-base font-medium h-auto p-3"
                >
                  <div className="text-center">
                    <div className="font-semibold">{config.name}</div>
                    <div className="text-xs opacity-80">{config.description}</div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Conversation */}
      <Card className="bg-white border-slate-200 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold">Conversation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`flex gap-3 max-w-[80%] ${message.type === "user" ? "flex-row-reverse" : "flex-row"}`}>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.type === "user" ? "bg-blue-100" : "bg-green-100"
                    }`}
                  >
                    {message.type === "user" ? (
                      <User className="h-4 w-4 text-blue-600" />
                    ) : (
                      <Bot className="h-4 w-4 text-green-600" />
                    )}
                  </div>
                  <div
                    className={`p-3 rounded-lg border ${
                      message.type === "user"
                        ? "bg-blue-50 border-blue-200"
                        : personalities[personality as keyof typeof personalities].color
                    }`}
                  >
                    <p className="text-base font-medium">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">{formatTime(message.timestamp)}</p>
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3 justify-start">
                <div className="flex gap-3 max-w-[80%]">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-green-100">
                    <Bot className="h-4 w-4 text-green-600" />
                  </div>
                  <div
                    className={`p-3 rounded-lg border ${personalities[personality as keyof typeof personalities].color}`}
                  >
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-current rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-current rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Responses */}
          <div className="mt-6 pt-4 border-t border-slate-200">
            <div className="text-base font-semibold text-slate-900 mb-3">Quick Responses</div>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={() => handleQuickResponse("I'm feeling alert and focused")}
                className="text-sm font-medium h-auto p-3"
              >
                I'm feeling alert
              </Button>
              <Button
                variant="outline"
                onClick={() => handleQuickResponse("I need a break soon")}
                className="text-sm font-medium h-auto p-3"
              >
                Need a break
              </Button>
              <Button
                variant="outline"
                onClick={() => handleQuickResponse("Thanks for the reminder")}
                className="text-sm font-medium h-auto p-3"
              >
                Thanks for reminder
              </Button>
              <Button
                variant="outline"
                onClick={() => handleQuickResponse("Adjust sensitivity please")}
                className="text-sm font-medium h-auto p-3"
              >
                Adjust sensitivity
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assistant Status */}
      <Card className="bg-white border-slate-200 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold flex items-center gap-3">
            <Settings className="h-6 w-6 text-purple-500" />
            Assistant Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-slate-50 rounded-lg border">
              <div className="text-lg font-bold text-slate-900">Voice Recognition</div>
              <div className={`text-base font-medium ${isListening ? "text-green-600" : "text-slate-600"}`}>
                {isListening ? "Listening" : "Standby"}
              </div>
            </div>
            <div className="text-center p-3 bg-slate-50 rounded-lg border">
              <div className="text-lg font-bold text-slate-900">Audio Output</div>
              <div className={`text-base font-medium ${isMuted ? "text-red-600" : "text-green-600"}`}>
                {isMuted ? "Muted" : "Active"}
              </div>
            </div>
            <div className="text-center p-3 bg-slate-50 rounded-lg border">
              <div className="text-lg font-bold text-slate-900">Personality</div>
              <div className="text-base font-medium text-blue-600 capitalize">{personality}</div>
            </div>
            <div className="text-center p-3 bg-slate-50 rounded-lg border">
              <div className="text-lg font-bold text-slate-900">Messages</div>
              <div className="text-base font-medium text-purple-600">{messages.length}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
