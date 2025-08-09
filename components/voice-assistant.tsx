'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Volume2, VolumeX, Mic, MicOff, MessageCircle, Settings, Play, Pause, SkipForward, Coffee, Music } from 'lucide-react'

interface VoiceAssistantProps {
  currentAlert: 'none' | 'level1' | 'level2' | 'level3'
  alertnessScore: number
  isActive: boolean
}

export function VoiceAssistant({ currentAlert, alertnessScore, isActive }: VoiceAssistantProps) {
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [volume, setVolume] = useState([75])
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [currentMessage, setCurrentMessage] = useState('')
  const [conversationHistory, setConversationHistory] = useState([
    { type: 'assistant', message: 'Hello! I\'m your AI driving co-pilot. I\'m here to keep you safe and alert.', time: '10:30 AM' },
    { type: 'user', message: 'How am I doing so far?', time: '10:32 AM' },
    { type: 'assistant', message: 'You\'re doing great! Your alertness score is 87%. Keep up the good work!', time: '10:32 AM' }
  ])

  const assistantPersonalities = [
    { name: 'Professional', voice: 'calm', description: 'Formal and direct communication' },
    { name: 'Friendly', voice: 'warm', description: 'Encouraging and supportive tone' },
    { name: 'Energetic', voice: 'upbeat', description: 'High energy to keep you awake' },
    { name: 'Zen', voice: 'peaceful', description: 'Calming and stress-reducing' }
  ]

  const [selectedPersonality, setSelectedPersonality] = useState('Friendly')

  // Simulate voice messages based on alert level
  useEffect(() => {
    if (!isActive || !voiceEnabled) return

    let message = ''
    switch (currentAlert) {
      case 'level1':
        message = 'Hey there! I noticed you might be getting a bit tired. How about we find a nice coffee shop nearby?'
        break
      case 'level2':
        message = 'I\'m concerned about your alertness level. Let\'s take a break at the next rest stop, okay?'
        break
      case 'level3':
        message = 'ATTENTION! Please pull over safely immediately. Your safety is my top priority.'
        break
      default:
        if (Math.random() < 0.1) { // Random encouraging messages
          const encouragements = [
            'You\'re doing fantastic! Keep those eyes on the road.',
            'Great driving! Your alertness score is looking good.',
            'I love how focused you are today. Safe travels!',
            'Perfect posture! You\'re a model driver.'
          ]
          message = encouragements[Math.floor(Math.random() * encouragements.length)]
        }
    }

    if (message && message !== currentMessage) {
      setCurrentMessage(message)
      setIsSpeaking(true)
      
      // Add to conversation history
      setConversationHistory(prev => [...prev, {
        type: 'assistant',
        message,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }])

      // Simulate speaking duration
      setTimeout(() => setIsSpeaking(false), 3000)
    }
  }, [currentAlert, isActive, voiceEnabled, currentMessage])

  const handleVoiceCommand = () => {
    setIsListening(!isListening)
    
    if (!isListening) {
      // Simulate voice recognition
      setTimeout(() => {
        const commands = [
          'How am I doing?',
          'Find a coffee shop',
          'Play some music',
          'Tell me a joke',
          'What\'s the weather like?'
        ]
        const command = commands[Math.floor(Math.random() * commands.length)]
        
        setConversationHistory(prev => [...prev, {
          type: 'user',
          message: command,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }])

        // Generate response
        let response = ''
        switch (command) {
          case 'How am I doing?':
            response = `Your alertness score is ${alertnessScore}%. ${alertnessScore > 80 ? 'Excellent work!' : 'Let\'s work on staying more alert.'}`
            break
          case 'Find a coffee shop':
            response = 'I found a Starbucks 1.2 miles ahead on your right. Perfect for a quick energy boost!'
            break
          case 'Play some music':
            response = 'Playing your "Road Trip Energy" playlist. Let\'s keep those good vibes going!'
            break
          case 'Tell me a joke':
            response = 'Why don\'t cars ever get tired? Because they always have spare energy! 😄'
            break
          case 'What\'s the weather like?':
            response = 'It\'s partly cloudy, 72°F with good visibility. Perfect driving conditions!'
            break
          default:
            response = 'I\'m here to help! Try asking about your driving performance or nearby stops.'
        }

        setTimeout(() => {
          setConversationHistory(prev => [...prev, {
            type: 'assistant',
            message: response,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }])
        }, 1000)

        setIsListening(false)
      }, 2000)
    }
  }

  return (
    <div className="space-y-6">
      {/* Voice Assistant Control */}
      <Card className="bg-white border-slate-200 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-xl font-bold">
            <div className="flex items-center gap-3">
              <Volume2 className="h-6 w-6 text-blue-500" />
              <span className="text-slate-900">AI Voice Assistant</span>
            </div>
            <Badge variant={isSpeaking ? "default" : "secondary"} className="animate-pulse text-sm font-semibold px-3 py-1">
              {isSpeaking ? 'Speaking' : 'Ready'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                onClick={handleVoiceCommand}
                variant={isListening ? "destructive" : "default"}
                size="lg"
                className="gap-3 text-base font-semibold px-6 py-3"
              >
                {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                {isListening ? 'Stop Listening' : 'Voice Command'}
              </Button>
              
              <Button
                onClick={() => setVoiceEnabled(!voiceEnabled)}
                variant="outline"
                size="lg"
                className="gap-3 text-base font-semibold px-6 py-3"
              >
                {voiceEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
                {voiceEnabled ? 'Mute' : 'Unmute'}
              </Button>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-base font-semibold text-slate-700">Volume</span>
              <div className="w-32">
                <Slider
                  value={volume}
                  onValueChange={setVolume}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>
              <span className="text-base font-bold text-slate-900 w-12">{volume[0]}%</span>
            </div>
          </div>

          {isListening && (
            <div className="p-5 bg-blue-500/20 border-2 border-blue-500/40 rounded-lg">
              <div className="flex items-center gap-3 text-blue-600">
                <Mic className="h-5 w-5 animate-pulse" />
                <span className="text-base font-bold">Listening...</span>
              </div>
              <div className="text-base text-blue-700 font-medium mt-2">
                Try saying: "How am I doing?", "Find a coffee shop", or "Play music"
              </div>
            </div>
          )}

          {currentMessage && (
            <div className="p-5 bg-green-500/20 border-2 border-green-500/40 rounded-lg">
              <div className="flex items-center gap-3 text-green-600">
                <MessageCircle className="h-5 w-5" />
                <span className="text-base font-bold">Current Message</span>
              </div>
              <div className="text-base text-green-700 font-medium mt-2">{currentMessage}</div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Conversation History */}
        <Card className="bg-white border-slate-200 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-green-400" />
              Conversation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {conversationHistory.map((item, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-2 ${
                    item.type === 'assistant' 
                      ? 'bg-blue-50 border-blue-200' 
                      : 'bg-green-50 border-green-200 ml-8'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-bold text-slate-700">
                      {item.type === 'assistant' ? 'AI Co-Pilot' : 'You'}
                    </span>
                    <span className="text-sm font-medium text-slate-500">{item.time}</span>
                  </div>
                  <div className="text-base font-medium text-slate-800">{item.message}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Assistant Personality */}
        <Card className="bg-white border-slate-200 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-purple-400" />
              Assistant Personality
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {assistantPersonalities.map((personality) => (
                <div
                  key={personality.name}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedPersonality === personality.name
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                  onClick={() => setSelectedPersonality(personality.name)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-semibold">{personality.name}</div>
                      <div className="text-sm text-slate-600">{personality.description}</div>
                    </div>
                    {selectedPersonality === personality.name && (
                      <Badge variant="default">Active</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-600">
              <div className="text-sm font-medium text-slate-700 mb-2">Quick Actions</div>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <Coffee className="h-3 w-3" />
                  Find Coffee
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <Music className="h-3 w-3" />
                  Play Music
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Entertainment & Engagement */}
      <Card className="bg-white border-slate-200 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music className="h-5 w-5 text-pink-400" />
            Entertainment & Engagement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 rounded-lg border">
              <div className="flex items-center gap-2 mb-2">
                <Music className="h-4 w-4 text-blue-400" />
                <span className="font-semibold">Music Control</span>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-slate-600">Now Playing: Road Trip Hits</div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Play className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Pause className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <SkipForward className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg border">
              <div className="flex items-center gap-2 mb-2">
                <MessageCircle className="h-4 w-4 text-green-400" />
                <span className="font-semibold">Conversation Topics</span>
              </div>
              <div className="space-y-1 text-sm">
                <div className="text-slate-600">• Travel stories</div>
                <div className="text-slate-600">• Fun facts</div>
                <div className="text-slate-600">• Driving tips</div>
                <div className="text-slate-600">• Weather updates</div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg border">
              <div className="flex items-center gap-2 mb-2">
                <Coffee className="h-4 w-4 text-yellow-400" />
                <span className="font-semibold">Break Suggestions</span>
              </div>
              <div className="space-y-1 text-sm">
                <div className="text-slate-600">• Nearby coffee shops</div>
                <div className="text-slate-600">• Rest areas</div>
                <div className="text-slate-600">• Scenic viewpoints</div>
                <div className="text-slate-600">• Gas stations</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
