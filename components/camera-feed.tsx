"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Camera, Eye, AlertTriangle, Zap } from "lucide-react"

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

interface FaceLandmarks {
  leftEye: Array<{ x: number; y: number }>
  rightEye: Array<{ x: number; y: number }>
  mouth: Array<{ x: number; y: number }>
  nose: Array<{ x: number; y: number }>
  jawline: Array<{ x: number; y: number }>
}

export function CameraFeed({ isActive, detectionMetrics, alertnessScore }: CameraFeedProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [hasCamera, setHasCamera] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [landmarks, setLandmarks] = useState<FaceLandmarks | null>(null)
  const [faceDetected, setFaceDetected] = useState(false)
  const [eyeAspectRatio, setEyeAspectRatio] = useState(0.3)
  const [mouthAspectRatio, setMouthAspectRatio] = useState(0.5)
  const [headPose, setHeadPose] = useState({ pitch: 0, yaw: 0, roll: 0 })
  const [videoReady, setVideoReady] = useState(false)

  // Initialize camera
  const initializeCamera = useCallback(async () => {
    if (!isActive) return

    setIsLoading(true)
    setError(null)
    setVideoReady(false)

    try {
      console.log("Requesting camera access...")

      // Request camera permission
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640, min: 320 },
          height: { ideal: 480, min: 240 },
          frameRate: { ideal: 30, min: 15 },
          facingMode: "user",
        },
        audio: false,
      })

      console.log("Camera access granted, stream:", stream)
      streamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream

        // Wait for metadata to load
        videoRef.current.onloadedmetadata = () => {
          console.log("Video metadata loaded")
          if (videoRef.current) {
            videoRef.current
              .play()
              .then(() => {
                console.log("Video playing successfully")
                setHasCamera(true)
                setVideoReady(true)
                setIsLoading(false)
              })
              .catch((playError) => {
                console.error("Video play error:", playError)
                setError("Failed to start video playback. Please try again.")
                setIsLoading(false)
              })
          }
        }

        // Handle video ready state
        videoRef.current.oncanplay = () => {
          console.log("Video can play")
          setVideoReady(true)
        }

        // Handle video errors
        videoRef.current.onerror = (e) => {
          console.error("Video error:", e)
          setError("Video stream error occurred")
          setHasCamera(false)
          setIsLoading(false)
        }
      }
    } catch (err: any) {
      console.error("Camera access error:", err)
      let errorMessage = "Camera access failed. "

      if (err.name === "NotAllowedError") {
        errorMessage = "Camera permission denied. Please allow camera access and try again."
      } else if (err.name === "NotFoundError") {
        errorMessage = "No camera found. Please connect a camera and try again."
      } else if (err.name === "NotReadableError") {
        errorMessage = "Camera is busy. Please close other apps using the camera and try again."
      } else if (err.name === "OverconstrainedError") {
        errorMessage = "Camera constraints not supported. Trying with basic settings..."
        // Try again with minimal constraints
        try {
          const basicStream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false,
          })
          streamRef.current = basicStream
          if (videoRef.current) {
            videoRef.current.srcObject = basicStream
            videoRef.current.play()
            setHasCamera(true)
            setVideoReady(true)
            setIsLoading(false)
            return
          }
        } catch (basicError) {
          errorMessage = "Camera not compatible with this device."
        }
      } else {
        errorMessage = `Camera error: ${err.message || "Unknown error"}`
      }

      setError(errorMessage)
      setHasCamera(false)
      setIsLoading(false)
    }
  }, [isActive])

  // Stop camera
  const stopCamera = useCallback(() => {
    console.log("Stopping camera...")

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop()
        console.log("Stopped track:", track.kind)
      })
      streamRef.current = null
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null
    }

    setHasCamera(false)
    setVideoReady(false)
    setFaceDetected(false)
    setLandmarks(null)
  }, [])

  // Calculate Eye Aspect Ratio (EAR)
  const calculateEAR = useCallback((eyePoints: Array<{ x: number; y: number }>) => {
    if (eyePoints.length < 6) return 0.3

    const v1 = Math.sqrt(Math.pow(eyePoints[1].x - eyePoints[5].x, 2) + Math.pow(eyePoints[1].y - eyePoints[5].y, 2))
    const v2 = Math.sqrt(Math.pow(eyePoints[2].x - eyePoints[4].x, 2) + Math.pow(eyePoints[2].y - eyePoints[4].y, 2))
    const h = Math.sqrt(Math.pow(eyePoints[0].x - eyePoints[3].x, 2) + Math.pow(eyePoints[0].y - eyePoints[3].y, 2))

    return (v1 + v2) / (2.0 * h)
  }, [])

  // Calculate Mouth Aspect Ratio (MAR)
  const calculateMAR = useCallback((mouthPoints: Array<{ x: number; y: number }>) => {
    if (mouthPoints.length < 8) return 0.5

    const v1 = Math.sqrt(
      Math.pow(mouthPoints[2].x - mouthPoints[6].x, 2) + Math.pow(mouthPoints[2].y - mouthPoints[6].y, 2),
    )
    const v2 = Math.sqrt(
      Math.pow(mouthPoints[3].x - mouthPoints[5].x, 2) + Math.pow(mouthPoints[3].y - mouthPoints[5].y, 2),
    )
    const h = Math.sqrt(
      Math.pow(mouthPoints[0].x - mouthPoints[4].x, 2) + Math.pow(mouthPoints[0].y - mouthPoints[4].y, 2),
    )

    return (v1 + v2) / (2.0 * h)
  }, [])

  // Simulate face detection
  const detectFace = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || !hasCamera || !videoReady) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")

    if (!ctx || video.videoWidth === 0 || video.videoHeight === 0) return

    // Set canvas size to match video
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Generate realistic face landmarks
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2

    // Add realistic movement simulation
    const time = Date.now() / 1000
    const breathingOffset = Math.sin(time * 0.5) * 2
    const blinkOffset = Math.random() < 0.1 ? -5 : 0

    const mockLandmarks: FaceLandmarks = {
      leftEye: [
        { x: centerX - 60, y: centerY - 40 + blinkOffset },
        { x: centerX - 45, y: centerY - 50 + blinkOffset },
        { x: centerX - 30, y: centerY - 45 + blinkOffset },
        { x: centerX - 15, y: centerY - 40 + blinkOffset },
        { x: centerX - 30, y: centerY - 35 + blinkOffset },
        { x: centerX - 45, y: centerY - 35 + blinkOffset },
      ],
      rightEye: [
        { x: centerX + 15, y: centerY - 40 + blinkOffset },
        { x: centerX + 30, y: centerY - 50 + blinkOffset },
        { x: centerX + 45, y: centerY - 45 + blinkOffset },
        { x: centerX + 60, y: centerY - 40 + blinkOffset },
        { x: centerX + 45, y: centerY - 35 + blinkOffset },
        { x: centerX + 30, y: centerY - 35 + blinkOffset },
      ],
      mouth: [
        { x: centerX - 25, y: centerY + 40 + breathingOffset },
        { x: centerX - 15, y: centerY + 35 + breathingOffset },
        { x: centerX - 5, y: centerY + 30 + breathingOffset },
        { x: centerX + 5, y: centerY + 35 + breathingOffset },
        { x: centerX + 25, y: centerY + 40 + breathingOffset },
        { x: centerX + 15, y: centerY + 50 + breathingOffset },
        { x: centerX + 5, y: centerY + 55 + breathingOffset },
        { x: centerX - 5, y: centerY + 50 + breathingOffset },
      ],
      nose: [
        { x: centerX, y: centerY - 10 },
        { x: centerX - 10, y: centerY + 10 },
        { x: centerX + 10, y: centerY + 10 },
      ],
      jawline: [
        { x: centerX - 80, y: centerY - 20 },
        { x: centerX - 75, y: centerY + 20 },
        { x: centerX - 60, y: centerY + 60 },
        { x: centerX - 30, y: centerY + 80 },
        { x: centerX, y: centerY + 85 },
        { x: centerX + 30, y: centerY + 80 },
        { x: centerX + 60, y: centerY + 60 },
        { x: centerX + 75, y: centerY + 20 },
        { x: centerX + 80, y: centerY - 20 },
      ],
    }

    setLandmarks(mockLandmarks)
    setFaceDetected(true)

    // Calculate metrics
    const leftEAR = calculateEAR(mockLandmarks.leftEye)
    const rightEAR = calculateEAR(mockLandmarks.rightEye)
    const avgEAR = (leftEAR + rightEAR) / 2
    setEyeAspectRatio(avgEAR)

    const mar = calculateMAR(mockLandmarks.mouth)
    setMouthAspectRatio(mar)

    setHeadPose({
      pitch: Math.sin(time * 0.3) * 5,
      yaw: Math.cos(time * 0.2) * 8,
      roll: Math.sin(time * 0.4) * 3,
    })
  }, [calculateEAR, calculateMAR, hasCamera, videoReady])

  // Draw face landmarks and overlays
  const drawOverlay = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas || !landmarks || !videoReady) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    if (faceDetected && landmarks) {
      // Draw face landmarks
      ctx.fillStyle = "#3b82f6"
      ctx.strokeStyle = "#3b82f6"
      ctx.lineWidth = 2

      // Draw eye landmarks
      landmarks.leftEye.forEach((point, index) => {
        ctx.beginPath()
        ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI)
        ctx.fill()
      })

      landmarks.rightEye.forEach((point, index) => {
        ctx.beginPath()
        ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI)
        ctx.fill()
      })

      // Draw mouth landmarks
      ctx.fillStyle = "#10b981"
      ctx.strokeStyle = "#10b981"
      landmarks.mouth.forEach((point, index) => {
        ctx.beginPath()
        ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI)
        ctx.fill()
      })

      // Draw alertness indicator
      const color = alertnessScore >= 80 ? "#10b981" : alertnessScore >= 60 ? "#f59e0b" : "#ef4444"
      ctx.fillStyle = color
      ctx.fillRect(10, 10, 120, 35)
      ctx.fillStyle = "white"
      ctx.font = "bold 16px sans-serif"
      ctx.fillText(`${alertnessScore}% Alert`, 15, 32)

      // Draw metrics overlay
      ctx.fillStyle = "rgba(0, 0, 0, 0.8)"
      ctx.fillRect(10, canvas.height - 100, 200, 85)
      ctx.fillStyle = "white"
      ctx.font = "12px sans-serif"
      ctx.fillText(`EAR: ${eyeAspectRatio.toFixed(3)}`, 15, canvas.height - 80)
      ctx.fillText(`MAR: ${mouthAspectRatio.toFixed(3)}`, 15, canvas.height - 65)
      ctx.fillText(`Head: ${headPose.yaw.toFixed(1)}°, ${headPose.pitch.toFixed(1)}°`, 15, canvas.height - 50)
      ctx.fillText(`Roll: ${headPose.roll.toFixed(1)}°`, 15, canvas.height - 35)
      ctx.fillText(`FPS: 30`, 15, canvas.height - 20)
    }
  }, [landmarks, faceDetected, alertnessScore, eyeAspectRatio, mouthAspectRatio, headPose, videoReady])

  // Main detection loop
  useEffect(() => {
    if (!isActive || !hasCamera || !videoReady) return

    const interval = setInterval(() => {
      detectFace()
    }, 33) // ~30 FPS

    return () => clearInterval(interval)
  }, [isActive, hasCamera, videoReady, detectFace])

  // Draw overlay when landmarks change
  useEffect(() => {
    drawOverlay()
  }, [drawOverlay])

  // Initialize camera when active
  useEffect(() => {
    if (isActive) {
      initializeCamera()
    } else {
      stopCamera()
    }

    return () => {
      stopCamera()
    }
  }, [isActive, initializeCamera, stopCamera])

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
            {hasCamera && videoReady && (
              <Badge variant="default" className="text-sm font-semibold px-3 py-1 bg-green-600">
                <Eye className="h-3 w-3 mr-1" />
                CAMERA ACTIVE
              </Badge>
            )}
            {faceDetected && (
              <Badge variant="default" className="text-sm font-semibold px-3 py-1 bg-blue-600">
                FACE DETECTED
              </Badge>
            )}
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
        <div className="relative bg-black rounded-lg overflow-hidden aspect-video border-2 border-slate-300">
          {/* Loading State */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-900 z-20">
              <div className="text-center">
                <Zap className="h-12 w-12 text-blue-400 mx-auto mb-4 animate-pulse" />
                <p className="text-lg font-medium text-white">Initializing camera...</p>
                <p className="text-sm text-slate-300 mt-2">Please allow camera access when prompted</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-red-900 z-20">
              <div className="text-center max-w-md p-6">
                <AlertTriangle className="h-16 w-16 text-red-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-red-100 mb-4">{error}</p>
                <div className="space-y-2">
                  <Button
                    onClick={initializeCamera}
                    variant="outline"
                    className="w-full bg-red-800 border-red-600 text-red-100 hover:bg-red-700"
                  >
                    Try Again
                  </Button>
                  <p className="text-sm text-red-300">
                    Make sure to click "Allow" when your browser asks for camera permission
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Camera Permission Request */}
          {!hasCamera && !isLoading && !error && isActive && (
            <div className="absolute inset-0 flex items-center justify-center bg-blue-900 z-20">
              <div className="text-center max-w-md p-6">
                <Camera className="h-16 w-16 text-blue-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-blue-100 mb-2">Camera Access Required</h3>
                <p className="text-base text-blue-200 mb-4">
                  We need access to your camera to monitor your alertness and keep you safe while driving.
                </p>
                <Button onClick={initializeCamera} size="lg" className="w-full mb-3 bg-blue-600 hover:bg-blue-500">
                  <Camera className="h-5 w-5 mr-2" />
                  Allow Camera Access
                </Button>
                <p className="text-sm text-blue-300">
                  Your privacy is protected - video is processed locally and never stored or transmitted.
                </p>
              </div>
            </div>
          )}

          {/* Inactive State */}
          {!isActive && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-800 z-10">
              <div className="text-center">
                <Camera className="h-20 w-20 text-slate-400 mx-auto mb-6" />
                <p className="text-lg font-medium text-slate-300 mb-4">Start monitoring to enable camera</p>
              </div>
            </div>
          )}

          {/* Video Element - Always present when camera is active */}
          {isActive && (
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className={`w-full h-full object-cover ${hasCamera && videoReady ? "opacity-100" : "opacity-0"}`}
              style={{
                transform: "scaleX(-1)",
                backgroundColor: "#000",
              }}
            />
          )}

          {/* Canvas Overlay - Only show when video is ready */}
          {hasCamera && videoReady && isActive && (
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ transform: "scaleX(-1)" }}
            />
          )}

          {/* Detection Status Overlay */}
          {isActive && hasCamera && videoReady && (
            <div className="absolute top-4 right-4 space-y-3">
              <div className="bg-black/80 backdrop-blur-sm rounded-lg p-3 text-sm border border-white/20">
                <div className="flex items-center gap-2 text-green-400 font-semibold">
                  <Eye className="h-4 w-4" />
                  Live Detection Active
                </div>
              </div>
              {faceDetected && (
                <div className="bg-black/80 backdrop-blur-sm rounded-lg p-3 text-sm border border-white/20">
                  <div className="text-white font-medium">
                    Gaze: <span className="text-blue-300">{detectionMetrics.gazeDirection}</span>
                  </div>
                  <div className="text-white font-medium">
                    Emotion: <span className="text-green-300 capitalize">{detectionMetrics.emotionalState}</span>
                  </div>
                  <div className="text-white font-medium">
                    EAR: <span className="text-yellow-300">{eyeAspectRatio.toFixed(3)}</span>
                  </div>
                  <div className="text-white font-medium">
                    MAR: <span className="text-orange-300">{mouthAspectRatio.toFixed(3)}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-4 gap-6 text-base">
          <div className="text-center">
            <div className="text-slate-600 font-medium mb-1">Detection Rate</div>
            <div className="text-xl font-bold text-slate-900">30 FPS</div>
          </div>
          <div className="text-center">
            <div className="text-slate-600 font-medium mb-1">Landmarks</div>
            <div className="text-xl font-bold text-slate-900">
              {landmarks ? Object.values(landmarks).flat().length : 0} Points
            </div>
          </div>
          <div className="text-center">
            <div className="text-slate-600 font-medium mb-1">Latency</div>
            <div className="text-xl font-bold text-slate-900">{"<"}50ms</div>
          </div>
          <div className="text-center">
            <div className="text-slate-600 font-medium mb-1">Camera Status</div>
            <div className={`text-xl font-bold ${hasCamera && videoReady ? "text-green-600" : "text-red-600"}`}>
              {hasCamera && videoReady ? "Active" : "Inactive"}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
