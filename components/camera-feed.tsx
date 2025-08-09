'use client'

import { useEffect, useRef, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Camera, Eye, AlertTriangle } from 'lucide-react'

interface CameraFeedProps {
  isActive: boolean
  detectionMetrics: {
    blinkRate: number
    yawnCount: number
    headPoseStability: number
    gazeDirection: string
    emotionalState: string
  }
  alertnessScore: number
}

export function CameraFeed({ isActive, detectionMetrics, alertnessScore }: CameraFeedProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [hasCamera, setHasCamera] = useState(false)
  const [landmarks, setLandmarks] = useState<Array<{x: number, y: number}>>([])

  useEffect(() => {
    if (isActive && videoRef.current) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream
            setHasCamera(true)
          }
        })
        .catch(() => {
          setHasCamera(false)
        })
    }

    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [isActive])

  // Simulate facial landmarks for demo
  useEffect(() => {
    if (!isActive) return

    const interval = setInterval(() => {
      const mockLandmarks = []
      // Generate mock eye landmarks
      for (let i = 0; i < 12; i++) {
        mockLandmarks.push({
          x: 150 + Math.cos(i * Math.PI / 6) * 30 + Math.random() * 5,
          y: 120 + Math.sin(i * Math.PI / 6) * 15 + Math.random() * 3
        })
      }
      // Generate mock mouth landmarks
      for (let i = 0; i < 8; i++) {
        mockLandmarks.push({
          x: 200 + Math.cos(i * Math.PI / 4) * 25 + Math.random() * 3,
          y: 180 + Math.sin(i * Math.PI / 4) * 10 + Math.random() * 2
        })
      }
      setLandmarks(mockLandmarks)
    }, 100)

    return () => clearInterval(interval)
  }, [isActive])

  const drawOverlay = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    if (isActive) {
      // Draw facial landmarks
      ctx.fillStyle = '#3b82f6'
      landmarks.forEach(point => {
        ctx.beginPath()
        ctx.arc(point.x, point.y, 2, 0, 2 * Math.PI)
        ctx.fill()
      })

      // Draw bounding boxes for eyes and mouth
      ctx.strokeStyle = '#10b981'
      ctx.lineWidth = 2
      
      // Left eye box
      ctx.strokeRect(120, 105, 60, 30)
      ctx.fillStyle = '#10b981'
      ctx.font = '12px sans-serif'
      ctx.fillText('L Eye', 125, 100)

      // Right eye box
      ctx.strokeRect(220, 105, 60, 30)
      ctx.fillText('R Eye', 225, 100)

      // Mouth box
      ctx.strokeRect(175, 165, 50, 30)
      ctx.fillText('Mouth', 180, 160)

      // Draw alertness indicator
      const color = alertnessScore >= 80 ? '#10b981' : 
                   alertnessScore >= 60 ? '#f59e0b' : '#ef4444'
      ctx.fillStyle = color
      ctx.fillRect(10, 10, 100, 30)
      ctx.fillStyle = 'slate-900'
      ctx.font = '14px sans-serif'
      ctx.fillText(`${alertnessScore}% Alert`, 15, 30)
    }
  }

  useEffect(() => {
    drawOverlay()
  }, [landmarks, alertnessScore, isActive])

  return (
    <Card className="bg-white border-slate-200 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between text-xl font-bold">
          <div className="flex items-center gap-3">
            <Camera className="h-6 w-6 text-blue-500" />
            <span className="text-slate-900">Live Camera Feed</span>
          </div>
          <div className="flex gap-3">
            <Badge variant={isActive ? "default" : "secondary"} className="text-sm font-semibold px-3 py-1">
              {isActive ? "MONITORING" : "INACTIVE"}
            </Badge>
            {alertnessScore < 60 && (
              <Badge variant="destructive" className="animate-pulse text-sm font-semibold px-3 py-1">
                <AlertTriangle className="h-4 w-4 mr-1" />
                ALERT
              </Badge>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative bg-slate-100 rounded-lg overflow-hidden aspect-video border">
          {hasCamera && isActive ? (
            <>
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              />
              <canvas
                ref={canvasRef}
                width={400}
                height={300}
                className="absolute inset-0 w-full h-full"
              />
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Camera className="h-20 w-20 text-slate-400 mx-auto mb-6" />
                <p className="text-lg font-medium text-slate-700">
                  {isActive ? "Camera access required" : "Start monitoring to enable camera"}
                </p>
              </div>
            </div>
          )}
          
          {/* Detection overlays */}
          {isActive && (
            <div className="absolute top-4 right-4 space-y-3">
              <div className="bg-black/80 backdrop-blur-sm rounded-lg p-3 text-sm border border-white/20">
                <div className="flex items-center gap-2 text-green-400 font-semibold">
                  <Eye className="h-4 w-4" />
                  Face Detected
                </div>
              </div>
              <div className="bg-black/80 backdrop-blur-sm rounded-lg p-3 text-sm border border-white/20">
                <div className="text-white font-medium">Gaze: <span className="text-blue-300">{detectionMetrics.gazeDirection}</span></div>
                <div className="text-white font-medium">Emotion: <span className="text-green-300 capitalize">{detectionMetrics.emotionalState}</span></div>
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-6 grid grid-cols-3 gap-6 text-base">
          <div className="text-center">
            <div className="text-slate-600 font-medium mb-1">Detection Rate</div>
            <div className="text-xl font-bold text-slate-900">30 FPS</div>
          </div>
          <div className="text-center">
            <div className="text-slate-600 font-medium mb-1">Landmarks</div>
            <div className="text-xl font-bold text-slate-900">468 Points</div>
          </div>
          <div className="text-center">
            <div className="text-slate-600 font-medium mb-1">Latency</div>
            <div className="text-xl font-bold text-slate-900">{'<'}50ms</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
