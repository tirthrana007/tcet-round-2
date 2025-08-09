"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Eye,
  Camera,
  AlertTriangle,
  Shield,
  Brain,
  Trophy,
  MapPin,
  Zap,
  Heart,
  Volume2,
  Play,
  Pause,
  Coffee,
} from "lucide-react"
import { CameraFeed } from "@/components/camera-feed"
import { AlertSystem } from "@/components/alert-system"
import { MetricsDashboard } from "@/components/metrics-dashboard"
import { DriverProfile } from "@/components/driver-profile"
import { EnvironmentalContext } from "@/components/environmental-context"
import { VoiceAssistant } from "@/components/voice-assistant"

export default function DriverAlertnessCopilot() {
  const [isActive, setIsActive] = useState(false)
  const [alertnessScore, setAlertnessScore] = useState(85)
  const [currentAlert, setCurrentAlert] = useState<"none" | "level1" | "level2" | "level3">("none")
  const [tripDuration, setTripDuration] = useState(0)
  const [detectionMetrics, setDetectionMetrics] = useState({
    blinkRate: 18,
    yawnCount: 2,
    headPoseStability: 92,
    gazeDirection: "forward",
    emotionalState: "alert",
  })
  const [cameraRequested, setCameraRequested] = useState(false)

  // Simulate real-time updates
  useEffect(() => {
    if (!isActive) return

    const interval = setInterval(() => {
      setTripDuration((prev) => prev + 1)

      // Simulate changing metrics
      setDetectionMetrics((prev) => ({
        ...prev,
        blinkRate: Math.max(10, Math.min(30, prev.blinkRate + (Math.random() - 0.5) * 4)),
        yawnCount: prev.yawnCount + (Math.random() < 0.02 ? 1 : 0),
        headPoseStability: Math.max(70, Math.min(100, prev.headPoseStability + (Math.random() - 0.5) * 10)),
      }))

      // Update alertness score based on metrics
      const newScore = Math.max(
        20,
        Math.min(
          100,
          100 -
            detectionMetrics.yawnCount * 5 -
            Math.abs(detectionMetrics.blinkRate - 15) * 2 -
            (100 - detectionMetrics.headPoseStability),
        ),
      )
      setAlertnessScore(newScore)

      // Trigger alerts based on score
      if (newScore < 40) {
        setCurrentAlert("level3")
      } else if (newScore < 60) {
        setCurrentAlert("level2")
      } else if (newScore < 75) {
        setCurrentAlert("level1")
      } else {
        setCurrentAlert("none")
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [isActive, detectionMetrics])

  const getAlertColor = () => {
    if (alertnessScore >= 80) return "text-green-500"
    if (alertnessScore >= 60) return "text-yellow-500"
    if (alertnessScore >= 40) return "text-orange-500"
    return "text-red-500"
  }

  const getScoreColor = () => {
    if (alertnessScore >= 80) return "bg-green-500"
    if (alertnessScore >= 60) return "bg-yellow-500"
    if (alertnessScore >= 40) return "bg-orange-500"
    return "bg-red-500"
  }

  const handleToggleMonitoring = () => {
    if (!isActive) {
      setCameraRequested(true)
    }
    setIsActive(!isActive)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 text-slate-900">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-600 rounded-lg shadow-md">
                <Eye className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">AI Driver Co-Pilot</h1>
                <p className="text-lg text-slate-600 font-medium">Advanced Alertness Monitoring System</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-base font-semibold text-slate-600">Alertness Score</div>
                <div className={`text-4xl font-bold ${getAlertColor()}`}>{alertnessScore}%</div>
              </div>

              <Button
                onClick={handleToggleMonitoring}
                variant={isActive ? "destructive" : "default"}
                size="lg"
                className="gap-2 text-lg px-6 py-3 font-semibold"
              >
                {isActive ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                {isActive ? "Stop Monitoring" : "Start Monitoring"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-white border-slate-200 shadow-sm h-14">
            <TabsTrigger value="dashboard" className="gap-2 text-base font-medium">
              <Shield className="h-5 w-5" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="detection" className="gap-2 text-base font-medium">
              <Brain className="h-5 w-5" />
              AI Detection
            </TabsTrigger>
            <TabsTrigger value="profile" className="gap-2 text-base font-medium">
              <Trophy className="h-5 w-5" />
              Driver Profile
            </TabsTrigger>
            <TabsTrigger value="context" className="gap-2 text-base font-medium">
              <MapPin className="h-5 w-5" />
              Context
            </TabsTrigger>
            <TabsTrigger value="assistant" className="gap-2 text-base font-medium">
              <Volume2 className="h-5 w-5" />
              AI Assistant
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Camera Feed */}
              <div className="lg:col-span-2">
                <CameraFeed isActive={isActive} detectionMetrics={detectionMetrics} alertnessScore={alertnessScore} />
              </div>

              {/* Real-time Metrics */}
              <div className="space-y-4">
                <Card className="bg-white border-slate-200 shadow-lg">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                      <Zap className="h-6 w-6 text-blue-500" />
                      Live Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <div className="flex justify-between text-base font-semibold mb-2">
                        <span className="text-slate-700">Alertness Score</span>
                        <span className={`${getAlertColor()} text-lg`}>{alertnessScore}%</span>
                      </div>
                      <Progress value={alertnessScore} className="h-3" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-base">
                      <div className="bg-slate-50 p-4 rounded-lg border">
                        <div className="text-slate-600 font-medium mb-1">Blink Rate</div>
                        <div className="text-2xl font-bold text-slate-900">{detectionMetrics.blinkRate}/min</div>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-lg border">
                        <div className="text-slate-600 font-medium mb-1">Yawns</div>
                        <div className="text-2xl font-bold text-slate-900">{detectionMetrics.yawnCount}</div>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-lg border">
                        <div className="text-slate-600 font-medium mb-1">Head Pose</div>
                        <div className="text-2xl font-bold text-slate-900">{detectionMetrics.headPoseStability}%</div>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-lg border">
                        <div className="text-slate-600 font-medium mb-1">Emotion</div>
                        <div className="text-2xl font-bold text-slate-900 capitalize">
                          {detectionMetrics.emotionalState}
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-200">
                      <div className="flex items-center justify-between text-base font-medium">
                        <span className="text-slate-600">Trip Duration</span>
                        <span className="text-lg font-bold text-slate-900">
                          {Math.floor(tripDuration / 60)}:{(tripDuration % 60).toString().padStart(2, "0")}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Alert System */}
                <AlertSystem currentAlert={currentAlert} alertnessScore={alertnessScore} />
              </div>
            </div>

            {/* Bottom Metrics */}
            <MetricsDashboard isActive={isActive} tripDuration={tripDuration} detectionMetrics={detectionMetrics} />
          </TabsContent>

          <TabsContent value="detection">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5 text-blue-400" />
                    Blink Detection
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-2xl font-bold">{detectionMetrics.blinkRate}/min</div>
                    <div className="text-sm text-slate-400">Eye Aspect Ratio (EAR)</div>
                    <Progress value={(detectionMetrics.blinkRate / 30) * 100} className="h-2" />
                    <div className="text-xs text-slate-500">Normal: 15-20 blinks/min</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Coffee className="h-5 w-5 text-yellow-400" />
                    Yawn Detection
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-2xl font-bold">{detectionMetrics.yawnCount}</div>
                    <div className="text-sm text-slate-400">Mouth Aspect Ratio (MAR)</div>
                    <Progress value={Math.min(100, detectionMetrics.yawnCount * 20)} className="h-2" />
                    <div className="text-xs text-slate-500">Alert threshold: 3+ yawns</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-purple-400" />
                    Head Pose
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-2xl font-bold">{detectionMetrics.headPoseStability}%</div>
                    <div className="text-sm text-slate-400">Stability Score</div>
                    <Progress value={detectionMetrics.headPoseStability} className="h-2" />
                    <div className="text-xs text-slate-500">Tracking micro-sleeps</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-red-400" />
                    Emotion AI
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-2xl font-bold capitalize">{detectionMetrics.emotionalState}</div>
                    <div className="text-sm text-slate-400">Current State</div>
                    <div className="flex gap-1">
                      {["alert", "tired", "stressed", "bored"].map((emotion) => (
                        <Badge
                          key={emotion}
                          variant={emotion === detectionMetrics.emotionalState ? "default" : "outline"}
                          className="text-xs"
                        >
                          {emotion}
                        </Badge>
                      ))}
                    </div>
                    <div className="text-xs text-slate-500">Real-time emotion recognition</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-slate-800 border-slate-700 mt-6">
              <CardHeader>
                <CardTitle>AI Detection Pipeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Camera className="h-8 w-8" />
                    </div>
                    <h3 className="font-semibold mb-2">Computer Vision</h3>
                    <p className="text-sm text-slate-400">MediaPipe facial landmarks detection with 468 key points</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Brain className="h-8 w-8" />
                    </div>
                    <h3 className="font-semibold mb-2">ML Processing</h3>
                    <p className="text-sm text-slate-400">Real-time analysis of EAR, MAR, and pose estimation</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <AlertTriangle className="h-8 w-8" />
                    </div>
                    <h3 className="font-semibold mb-2">Smart Alerts</h3>
                    <p className="text-sm text-slate-400">Adaptive multi-level warning system with personalization</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile">
            <DriverProfile
              alertnessScore={alertnessScore}
              tripDuration={tripDuration}
              detectionMetrics={detectionMetrics}
            />
          </TabsContent>

          <TabsContent value="context">
            <EnvironmentalContext />
          </TabsContent>

          <TabsContent value="assistant">
            <VoiceAssistant currentAlert={currentAlert} alertnessScore={alertnessScore} isActive={isActive} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
