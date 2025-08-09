"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Activity, Clock, Eye, Coffee, Brain, TrendingUp, TrendingDown, Minus } from "lucide-react"

interface MetricsDashboardProps {
  isActive: boolean
  tripDuration: number
  detectionMetrics: {
    blinkRate: number
    yawnCount: number
    headPoseStability: number
    gazeDirection: string
    emotionalState: string
  }
}

interface HistoricalData {
  timestamp: number
  blinkRate: number
  yawnCount: number
  headPoseStability: number
  alertnessScore: number
}

export function MetricsDashboard({ isActive, tripDuration, detectionMetrics }: MetricsDashboardProps) {
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([])
  const [trends, setTrends] = useState({
    blinkRate: "stable",
    yawnCount: "stable",
    headPoseStability: "stable",
    alertnessScore: "stable",
  })

  // Add data point every 10 seconds when active
  useEffect(() => {
    if (!isActive) return

    const interval = setInterval(() => {
      const newDataPoint: HistoricalData = {
        timestamp: Date.now(),
        blinkRate: detectionMetrics.blinkRate,
        yawnCount: detectionMetrics.yawnCount,
        headPoseStability: detectionMetrics.headPoseStability,
        alertnessScore: Math.max(
          20,
          Math.min(
            100,
            100 -
              detectionMetrics.yawnCount * 5 -
              Math.abs(detectionMetrics.blinkRate - 15) * 2 -
              (100 - detectionMetrics.headPoseStability),
          ),
        ),
      }

      setHistoricalData((prev) => {
        const updated = [...prev, newDataPoint].slice(-20) // Keep last 20 data points

        // Calculate trends
        if (updated.length >= 3) {
          const recent = updated.slice(-3)
          const calculateTrend = (values: number[]) => {
            const avg1 = values[0]
            const avg2 = (values[1] + values[2]) / 2
            const diff = avg2 - avg1
            if (Math.abs(diff) < 2) return "stable"
            return diff > 0 ? "increasing" : "decreasing"
          }

          setTrends({
            blinkRate: calculateTrend(recent.map((d) => d.blinkRate)),
            yawnCount: calculateTrend(recent.map((d) => d.yawnCount)),
            headPoseStability: calculateTrend(recent.map((d) => d.headPoseStability)),
            alertnessScore: calculateTrend(recent.map((d) => d.alertnessScore)),
          })
        }

        return updated
      })
    }, 10000) // Every 10 seconds

    return () => clearInterval(interval)
  }, [isActive, detectionMetrics])

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "increasing":
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case "decreasing":
        return <TrendingDown className="h-4 w-4 text-red-500" />
      default:
        return <Minus className="h-4 w-4 text-slate-500" />
    }
  }

  const getTrendColor = (trend: string, isPositive = true) => {
    if (trend === "stable") return "text-slate-600"
    const isGood = isPositive ? trend === "increasing" : trend === "decreasing"
    return isGood ? "text-green-600" : "text-red-600"
  }

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`
    } else {
      return `${secs}s`
    }
  }

  const getBlinkRateStatus = (rate: number) => {
    if (rate >= 15 && rate <= 20) return { status: "Normal", color: "text-green-600" }
    if (rate < 10) return { status: "Too Low", color: "text-red-600" }
    if (rate > 25) return { status: "Too High", color: "text-orange-600" }
    return { status: "Borderline", color: "text-yellow-600" }
  }

  const getYawnStatus = (count: number) => {
    if (count === 0) return { status: "Excellent", color: "text-green-600" }
    if (count <= 2) return { status: "Normal", color: "text-green-600" }
    if (count <= 4) return { status: "Concerning", color: "text-yellow-600" }
    return { status: "Critical", color: "text-red-600" }
  }

  const getHeadPoseStatus = (stability: number) => {
    if (stability >= 90) return { status: "Excellent", color: "text-green-600" }
    if (stability >= 80) return { status: "Good", color: "text-green-600" }
    if (stability >= 70) return { status: "Fair", color: "text-yellow-600" }
    return { status: "Poor", color: "text-red-600" }
  }

  const blinkStatus = getBlinkRateStatus(detectionMetrics.blinkRate)
  const yawnStatus = getYawnStatus(detectionMetrics.yawnCount)
  const headPoseStatus = getHeadPoseStatus(detectionMetrics.headPoseStability)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Trip Overview */}
      <Card className="bg-white border-slate-200 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-500" />
            Trip Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="text-sm font-medium text-slate-600 mb-1">Duration</div>
            <div className="text-2xl font-bold text-slate-900">{formatDuration(tripDuration)}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-slate-600 mb-1">Status</div>
            <Badge variant={isActive ? "default" : "secondary"} className="text-sm font-medium">
              {isActive ? "Active Monitoring" : "Inactive"}
            </Badge>
          </div>
          <div>
            <div className="text-sm font-medium text-slate-600 mb-1">Data Points</div>
            <div className="text-lg font-bold text-slate-900">{historicalData.length}</div>
          </div>
        </CardContent>
      </Card>

      {/* Blink Rate Analysis */}
      <Card className="bg-white border-slate-200 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Eye className="h-5 w-5 text-blue-500" />
            Blink Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-slate-900">{detectionMetrics.blinkRate}/min</div>
              <div className={`text-sm font-medium ${blinkStatus.color}`}>{blinkStatus.status}</div>
            </div>
            <div className="flex items-center gap-1">
              {getTrendIcon(trends.blinkRate)}
              <span className={`text-sm font-medium ${getTrendColor(trends.blinkRate)}`}>{trends.blinkRate}</span>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm font-medium mb-1">
              <span className="text-slate-600">Normal Range</span>
              <span className="text-slate-900">15-20/min</span>
            </div>
            <Progress value={Math.min(100, (detectionMetrics.blinkRate / 30) * 100)} className="h-2" />
          </div>
          <div className="text-xs text-slate-500 font-medium">Tracks eye closure patterns for fatigue detection</div>
        </CardContent>
      </Card>

      {/* Yawn Detection */}
      <Card className="bg-white border-slate-200 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Coffee className="h-5 w-5 text-orange-500" />
            Yawn Detection
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-slate-900">{detectionMetrics.yawnCount}</div>
              <div className={`text-sm font-medium ${yawnStatus.color}`}>{yawnStatus.status}</div>
            </div>
            <div className="flex items-center gap-1">
              {getTrendIcon(trends.yawnCount)}
              <span className={`text-sm font-medium ${getTrendColor(trends.yawnCount, false)}`}>
                {trends.yawnCount}
              </span>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm font-medium mb-1">
              <span className="text-slate-600">Alert Threshold</span>
              <span className="text-slate-900">3+ yawns</span>
            </div>
            <Progress value={Math.min(100, (detectionMetrics.yawnCount / 5) * 100)} className="h-2" />
          </div>
          <div className="text-xs text-slate-500 font-medium">Monitors mouth opening patterns for drowsiness</div>
        </CardContent>
      </Card>

      {/* Head Pose Stability */}
      <Card className="bg-white border-slate-200 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-500" />
            Head Pose
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-slate-900">{detectionMetrics.headPoseStability}%</div>
              <div className={`text-sm font-medium ${headPoseStatus.color}`}>{headPoseStatus.status}</div>
            </div>
            <div className="flex items-center gap-1">
              {getTrendIcon(trends.headPoseStability)}
              <span className={`text-sm font-medium ${getTrendColor(trends.headPoseStability)}`}>
                {trends.headPoseStability}
              </span>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm font-medium mb-1">
              <span className="text-slate-600">Stability</span>
              <span className="text-slate-900">{detectionMetrics.headPoseStability}%</span>
            </div>
            <Progress value={detectionMetrics.headPoseStability} className="h-2" />
          </div>
          <div className="text-xs text-slate-500 font-medium">Detects head nodding and micro-sleep episodes</div>
        </CardContent>
      </Card>

      {/* Real-time Activity Chart */}
      <Card className="bg-white border-slate-200 shadow-lg md:col-span-2 lg:col-span-4">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Activity className="h-5 w-5 text-green-500" />
            Real-time Activity Monitor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-slate-50 rounded-lg border">
                <div className="text-lg font-bold text-slate-900">Gaze Direction</div>
                <div className="text-base font-medium text-blue-600 capitalize">{detectionMetrics.gazeDirection}</div>
              </div>
              <div className="text-center p-3 bg-slate-50 rounded-lg border">
                <div className="text-lg font-bold text-slate-900">Emotional State</div>
                <div className="text-base font-medium text-green-600 capitalize">{detectionMetrics.emotionalState}</div>
              </div>
              <div className="text-center p-3 bg-slate-50 rounded-lg border">
                <div className="text-lg font-bold text-slate-900">Data Quality</div>
                <div className="text-base font-medium text-purple-600">Excellent</div>
              </div>
              <div className="text-center p-3 bg-slate-50 rounded-lg border">
                <div className="text-lg font-bold text-slate-900">Processing</div>
                <div className="text-base font-medium text-orange-600">Real-time</div>
              </div>
            </div>

            {/* Simple activity visualization */}
            <div className="mt-6">
              <div className="flex justify-between text-sm font-medium text-slate-600 mb-2">
                <span>Activity Timeline (Last 20 data points)</span>
                <span>{historicalData.length}/20 points</span>
              </div>
              <div className="flex gap-1 h-12 items-end">
                {Array.from({ length: 20 }, (_, i) => {
                  const dataPoint = historicalData[i]
                  const height = dataPoint ? (dataPoint.alertnessScore / 100) * 100 : 0
                  const color =
                    height >= 80
                      ? "bg-green-500"
                      : height >= 60
                        ? "bg-yellow-500"
                        : height >= 40
                          ? "bg-orange-500"
                          : "bg-red-500"

                  return (
                    <div
                      key={i}
                      className={`flex-1 ${dataPoint ? color : "bg-slate-200"} rounded-t`}
                      style={{ height: `${height}%` }}
                      title={dataPoint ? `Alertness: ${dataPoint.alertnessScore}%` : "No data"}
                    />
                  )
                })}
              </div>
              <div className="flex justify-between text-xs text-slate-500 font-medium mt-1">
                <span>Oldest</span>
                <span>Latest</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
