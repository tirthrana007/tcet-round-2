"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Volume2, Phone, Coffee, MapPin, VolumeX } from "lucide-react"

interface AlertSystemProps {
  currentAlert: "none" | "level1" | "level2" | "level3"
  alertnessScore: number
}

export function AlertSystem({ currentAlert, alertnessScore }: AlertSystemProps) {
  const [isMuted, setIsMuted] = useState(false)
  const [alertHistory, setAlertHistory] = useState<
    Array<{
      level: string
      time: string
      message: string
    }>
  >([])
  const [alertMessage, setAlertMessage] = useState("")
  const [isPlaying, setIsPlaying] = useState(false)

  const alertConfig = {
    none: {
      color: "bg-green-50 border-green-200",
      textColor: "text-green-800",
      icon: "✓",
      title: "All Clear",
      message: "Driver alertness is optimal",
      action: null,
    },
    level1: {
      color: "bg-yellow-50 border-yellow-200",
      textColor: "text-yellow-800",
      icon: "⚠️",
      title: "Mild Fatigue Detected",
      message: "Consider taking a short break soon",
      action: "Gentle reminder",
    },
    level2: {
      color: "bg-orange-50 border-orange-200",
      textColor: "text-orange-800",
      icon: "🚨",
      title: "Moderate Fatigue Alert",
      message: "Please find a safe place to rest",
      action: "Audio alert + vibration",
    },
    level3: {
      color: "bg-red-50 border-red-200",
      textColor: "text-red-800",
      icon: "🆘",
      title: "Critical Alert - Immediate Action Required",
      message: "Pull over safely immediately",
      action: "Emergency protocol activated",
    },
  }

  const currentConfig = alertConfig[currentAlert]

  // Add alert to history when level changes
  useEffect(() => {
    if (currentAlert !== "none") {
      const newAlert = {
        level: currentAlert,
        time: new Date().toLocaleTimeString(),
        message: currentConfig.message,
      }
      setAlertHistory((prev) => [newAlert, ...prev.slice(0, 4)]) // Keep last 5 alerts
    }
  }, [currentAlert, currentConfig.message])

  // Simulate audio alert
  const playAlert = () => {
    if (!isMuted && currentAlert !== "none") {
      // In a real implementation, this would play actual audio
      console.log(`Playing ${currentAlert} alert sound`)
    }
  }

  useEffect(() => {
    playAlert()
  }, [currentAlert])

  const handleDismissAlert = () => {
    setIsPlaying(false)
  }

  const handleTakeBreak = () => {
    // Simulate break suggestion
    alert("Suggested rest stop: Shell Station - 2.3 miles ahead")
  }

  const handleEmergencyContact = () => {
    // Simulate emergency contact
    alert('Emergency contact notified: "Driver may need assistance"')
  }

  return (
    <div className="space-y-4">
      {/* Main Alert Card */}
      <Card className={`${currentConfig.color} border-2 shadow-lg`}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-lg font-bold">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{currentConfig.icon}</span>
              <span className={currentConfig.textColor}>Alert System</span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setIsMuted(!isMuted)} className="text-sm font-medium">
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                {isMuted ? "Unmute" : "Mute"}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`${currentConfig.textColor} space-y-2`}>
            <h3 className="text-xl font-bold">{currentConfig.title}</h3>
            <p className="text-lg font-medium">{currentConfig.message}</p>
            {currentConfig.action && <p className="text-base font-medium opacity-80">Action: {currentConfig.action}</p>}
          </div>

          {/* Alert Level Indicators */}
          <div className="flex gap-3 mt-4">
            <div
              className={`flex-1 p-3 rounded-lg border ${currentAlert === "level1" ? "bg-yellow-100 border-yellow-300" : "bg-slate-100 border-slate-200"}`}
            >
              <div className="text-center">
                <div className="text-lg font-bold text-slate-900">Level 1</div>
                <div className="text-sm text-slate-600 font-medium">Gentle</div>
              </div>
            </div>
            <div
              className={`flex-1 p-3 rounded-lg border ${currentAlert === "level2" ? "bg-orange-100 border-orange-300" : "bg-slate-100 border-slate-200"}`}
            >
              <div className="text-center">
                <div className="text-lg font-bold text-slate-900">Level 2</div>
                <div className="text-sm text-slate-600 font-medium">Warning</div>
              </div>
            </div>
            <div
              className={`flex-1 p-3 rounded-lg border ${currentAlert === "level3" ? "bg-red-100 border-red-300" : "bg-slate-100 border-slate-200"}`}
            >
              <div className="text-center">
                <div className="text-lg font-bold text-slate-900">Level 3</div>
                <div className="text-sm text-slate-600 font-medium">Critical</div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          {currentAlert !== "none" && (
            <div className="flex gap-3 mt-4">
              <Button variant="outline" size="sm" className="flex-1 text-base font-medium bg-transparent">
                <Coffee className="h-4 w-4 mr-2" />
                Find Rest Stop
              </Button>
              <Button variant="outline" size="sm" className="flex-1 text-base font-medium bg-transparent">
                <MapPin className="h-4 w-4 mr-2" />
                Safe Parking
              </Button>
              {currentAlert === "level3" && (
                <Button variant="destructive" size="sm" className="flex-1 text-base font-medium">
                  <Phone className="h-4 w-4 mr-2" />
                  Emergency Contact
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Alert History */}
      {alertHistory.length > 0 && (
        <Card className="bg-white border-slate-200 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Recent Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alertHistory.map((alert, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <Badge
                      variant={
                        alert.level === "level3" ? "destructive" : alert.level === "level2" ? "default" : "secondary"
                      }
                      className="text-sm font-medium"
                    >
                      {alert.level.toUpperCase()}
                    </Badge>
                    <span className="text-base font-medium text-slate-900">{alert.message}</span>
                  </div>
                  <span className="text-sm text-slate-600 font-medium">{alert.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Alert Configuration */}
      <Card className="bg-white border-slate-200 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-bold">Alert Thresholds</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <span className="text-base font-semibold text-slate-900">Level 1 Trigger</span>
              <span className="text-lg font-bold text-yellow-700">{"<"}75% Alertness</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg border border-orange-200">
              <span className="text-base font-semibold text-slate-900">Level 2 Trigger</span>
              <span className="text-lg font-bold text-orange-700">{"<"}60% Alertness</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-200">
              <span className="text-base font-semibold text-slate-900">Level 3 Trigger</span>
              <span className="text-lg font-bold text-red-700">{"<"}40% Alertness</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
