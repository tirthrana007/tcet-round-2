'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle, Volume2, Phone, Coffee, MapPin } from 'lucide-react'

interface AlertSystemProps {
  currentAlert: 'none' | 'level1' | 'level2' | 'level3'
  alertnessScore: number
}

export function AlertSystem({ currentAlert, alertnessScore }: AlertSystemProps) {
  const [alertMessage, setAlertMessage] = useState('')
  const [isPlaying, setIsPlaying] = useState(false)

  const alertConfig = {
    none: {
      color: 'bg-green-500',
      message: 'All systems normal',
      icon: '✓',
      action: null
    },
    level1: {
      color: 'bg-yellow-500',
      message: 'You seem tired, want a break?',
      icon: '⚠️',
      action: 'Gentle reminder'
    },
    level2: {
      color: 'bg-orange-500',
      message: 'Please take a break soon',
      icon: '🚨',
      action: 'Audio alert'
    },
    level3: {
      color: 'bg-red-500',
      message: 'IMMEDIATE ATTENTION REQUIRED',
      icon: '🚨',
      action: 'Emergency protocol'
    }
  }

  useEffect(() => {
    const config = alertConfig[currentAlert]
    setAlertMessage(config.message)
    
    if (currentAlert !== 'none') {
      setIsPlaying(true)
      const timer = setTimeout(() => setIsPlaying(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [currentAlert])

  const handleDismissAlert = () => {
    setIsPlaying(false)
  }

  const handleTakeBreak = () => {
    // Simulate break suggestion
    alert('Suggested rest stop: Shell Station - 2.3 miles ahead')
  }

  const handleEmergencyContact = () => {
    // Simulate emergency contact
    alert('Emergency contact notified: "Driver may need assistance"')
  }

  return (
    <Card className="bg-white border-slate-200 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-xl font-bold">
          <AlertTriangle className="h-6 w-6 text-yellow-500" />
          <span className="text-slate-900">Alert System</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Alert Status */}
        <div className={`p-5 rounded-lg ${alertConfig[currentAlert].color} ${isPlaying ? 'animate-pulse' : ''} border-2`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{alertConfig[currentAlert].icon}</span>
              <div>
                <div className="font-bold text-white text-lg mb-1">
                  {currentAlert === 'none' ? 'Normal' : `Level ${currentAlert.slice(-1)} Alert`}
                </div>
                <div className="text-base text-white/90 font-medium">{alertMessage}</div>
              </div>
            </div>
            {isPlaying && (
              <Button
                onClick={handleDismissAlert}
                variant="secondary"
                size="lg"
                className="font-semibold"
              >
                Dismiss
              </Button>
            )}
          </div>
        </div>

        {/* Alert Actions */}
        {currentAlert !== 'none' && (
          <div className="space-y-4">
            <div className="text-base font-bold text-slate-800">Suggested Actions:</div>
            
            {currentAlert === 'level1' && (
              <div className="space-y-3">
                <Button
                  onClick={handleTakeBreak}
                  variant="outline"
                  size="lg"
                  className="w-full justify-start gap-3 text-base font-medium"
                >
                  <Coffee className="h-5 w-5" />
                  Find nearby rest stop
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full justify-start gap-3 text-base font-medium"
                >
                  <Volume2 className="h-5 w-5" />
                  Play energizing music
                </Button>
              </div>
            )}

            {currentAlert === 'level2' && (
              <div className="space-y-2">
                <Button
                  onClick={handleTakeBreak}
                  variant="default"
                  size="sm"
                  className="w-full justify-start gap-2"
                >
                  <MapPin className="h-4 w-4" />
                  Navigate to rest area
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start gap-2"
                >
                  <Volume2 className="h-4 w-4" />
                  Increase alert volume
                </Button>
              </div>
            )}

            {currentAlert === 'level3' && (
              <div className="space-y-2">
                <Button
                  onClick={handleEmergencyContact}
                  variant="destructive"
                  size="sm"
                  className="w-full justify-start gap-2"
                >
                  <Phone className="h-4 w-4" />
                  Contact emergency contact
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  className="w-full justify-start gap-2"
                >
                  <MapPin className="h-4 w-4" />
                  Find immediate parking
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Alert History */}
        <div className="pt-4 border-t border-slate-200">
          <div className="text-base font-bold text-slate-800 mb-3">Recent Alerts</div>
          <div className="space-y-2 text-sm font-medium">
            <div className="flex justify-between text-slate-700">
              <span>Level 1 Alert</span>
              <span>2 min ago</span>
            </div>
            <div className="flex justify-between text-slate-700">
              <span>Yawn detected</span>
              <span>5 min ago</span>
            </div>
            <div className="flex justify-between text-slate-700">
              <span>Blink rate low</span>
              <span>8 min ago</span>
            </div>
          </div>
        </div>

        {/* Personalization Settings */}
        <div className="pt-3 border-t border-slate-200">
          <div className="text-sm font-medium text-slate-700 mb-2">Alert Preferences</div>
          <div className="flex gap-2 flex-wrap">
            <Badge variant="outline" className="text-xs">Voice alerts</Badge>
            <Badge variant="outline" className="text-xs">Vibration</Badge>
            <Badge variant="outline" className="text-xs">Auto-contact</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
