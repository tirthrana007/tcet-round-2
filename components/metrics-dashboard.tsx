'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Clock, TrendingUp, Shield, Zap, Eye, Brain, Heart, Activity } from 'lucide-react'

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

export function MetricsDashboard({ isActive, tripDuration, detectionMetrics }: MetricsDashboardProps) {
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getBlinkStatus = () => {
    if (detectionMetrics.blinkRate < 12) return { status: 'Low', color: 'text-red-400' }
    if (detectionMetrics.blinkRate > 25) return { status: 'High', color: 'text-yellow-400' }
    return { status: 'Normal', color: 'text-green-400' }
  }

  const getYawnStatus = () => {
    if (detectionMetrics.yawnCount >= 5) return { status: 'Critical', color: 'text-red-400' }
    if (detectionMetrics.yawnCount >= 3) return { status: 'Warning', color: 'text-yellow-400' }
    return { status: 'Normal', color: 'text-green-400' }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Trip Overview */}
      <Card className="bg-white border-slate-200 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold flex items-center gap-3">
            <Clock className="h-6 w-6 text-blue-500" />
            <span className="text-slate-900">Trip Overview</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="text-3xl font-bold text-slate-900">{formatTime(tripDuration)}</div>
            <div className="text-base font-semibold text-slate-600 mt-1">Duration</div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-base font-semibold">
              <span className="text-slate-700">Break Recommended</span>
              <span className={tripDuration > 7200 ? 'text-red-500 font-bold' : 'text-green-500 font-bold'}>
                {tripDuration > 7200 ? 'Yes' : 'No'}
              </span>
            </div>
            <Progress 
              value={Math.min(100, (tripDuration / 7200) * 100)} 
              className="h-3" 
            />
            <div className="text-sm font-medium text-slate-600">Next break in {Math.max(0, 120 - Math.floor(tripDuration / 60))} min</div>
          </div>
        </CardContent>
      </Card>

      {/* Fatigue Analysis */}
      <Card className="bg-white border-slate-200 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold flex items-center gap-3">
            <Eye className="h-6 w-6 text-purple-500" />
            <span className="text-slate-900">Fatigue Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-base font-semibold text-slate-700">Blink Rate</span>
              <Badge variant="outline" className={`${getBlinkStatus().color} font-semibold text-sm px-3 py-1`}>
                {getBlinkStatus().status}
              </Badge>
            </div>
            <div className="text-3xl font-bold text-slate-900">{detectionMetrics.blinkRate}/min</div>
            <Progress value={(detectionMetrics.blinkRate / 30) * 100} className="h-3" />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-base font-semibold text-slate-700">Yawn Count</span>
              <Badge variant="outline" className={`${getYawnStatus().color} font-semibold text-sm px-3 py-1`}>
                {getYawnStatus().status}
              </Badge>
            </div>
            <div className="text-3xl font-bold text-slate-900">{detectionMetrics.yawnCount}</div>
          </div>
        </CardContent>
      </Card>

      {/* Attention Monitoring */}
      <Card className="bg-white border-slate-200 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold flex items-center gap-3">
            <Brain className="h-6 w-6 text-green-500" />
            <span className="text-slate-900">Attention</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="text-3xl font-bold text-slate-900">{detectionMetrics.headPoseStability}%</div>
            <div className="text-base font-semibold text-slate-600 mt-1">Head Pose Stability</div>
          </div>
          <Progress value={detectionMetrics.headPoseStability} className="h-3" />

          <div className="space-y-2">
            <div className="flex justify-between text-base font-medium">
              <span className="text-slate-700">Gaze Direction</span>
              <span className="capitalize font-semibold text-slate-900">{detectionMetrics.gazeDirection}</span>
            </div>
            <div className="flex justify-between text-base font-medium">
              <span className="text-slate-700">Distraction Events</span>
              <span className="font-semibold text-slate-900">2</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Insights */}
      <Card className="bg-white border-slate-200 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold flex items-center gap-3">
            <Heart className="h-6 w-6 text-red-500" />
            <span className="text-slate-900">AI Insights</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="text-2xl font-bold capitalize text-slate-900">{detectionMetrics.emotionalState}</div>
            <div className="text-base font-semibold text-slate-600 mt-1">Emotional State</div>
          </div>

          <div className="space-y-3">
            <div className="text-base font-bold text-slate-800">Risk Factors</div>
            <div className="space-y-2">
              {detectionMetrics.yawnCount > 2 && (
                <Badge variant="destructive" className="text-sm font-semibold px-3 py-1">Fatigue detected</Badge>
              )}
              {detectionMetrics.blinkRate < 12 && (
                <Badge variant="destructive" className="text-sm font-semibold px-3 py-1">Low blink rate</Badge>
              )}
              {tripDuration > 7200 && (
                <Badge variant="destructive" className="text-sm font-semibold px-3 py-1">Long drive</Badge>
              )}
              {detectionMetrics.yawnCount <= 2 && detectionMetrics.blinkRate >= 12 && tripDuration <= 7200 && (
                <Badge variant="default" className="text-sm font-semibold px-3 py-1">All clear</Badge>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200">
            <div className="text-sm font-bold text-slate-700">
              AI Confidence: 94%
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
