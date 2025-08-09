"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { User, Trophy, Calendar, Star, TrendingUp, Award, Clock, Eye, Coffee } from "lucide-react"

interface DriverProfileProps {
  alertnessScore: number
  tripDuration: number
  detectionMetrics: {
    blinkRate: number
    yawnCount: number
    headPoseStability: number
    gazeDirection: string
    emotionalState: string
  }
}

export function DriverProfile({ alertnessScore, tripDuration, detectionMetrics }: DriverProfileProps) {
  const [driverLevel, setDriverLevel] = useState(1)
  const [experience, setExperience] = useState(0)
  const [weeklyStats, setWeeklyStats] = useState({
    totalTrips: 12,
    totalDuration: 2340, // minutes
    averageAlertness: 82,
    safetyScore: 94,
  })
  const [achievements, setAchievements] = useState([
    { id: 1, name: "Safe Driver", description: "7 days without alerts", icon: "🛡️", unlocked: true },
    { id: 2, name: "Alert Master", description: "Maintain 90%+ alertness", icon: "👁️", unlocked: false },
    { id: 3, name: "Long Haul", description: "Drive 5+ hours safely", icon: "🚛", unlocked: true },
    { id: 4, name: "Perfect Week", description: "No fatigue alerts for a week", icon: "⭐", unlocked: false },
    { id: 5, name: "Night Owl", description: "Safe night driving streak", icon: "🌙", unlocked: true },
    { id: 6, name: "Focus Champion", description: "Perfect gaze tracking", icon: "🎯", unlocked: false },
  ])

  // Calculate driver level based on experience
  useEffect(() => {
    const newLevel = Math.floor(experience / 1000) + 1
    setDriverLevel(Math.min(newLevel, 10))
  }, [experience])

  // Simulate experience gain
  useEffect(() => {
    if (alertnessScore > 80) {
      setExperience((prev) => prev + 1)
    }
  }, [alertnessScore])

  const getLevelProgress = () => {
    const currentLevelExp = (driverLevel - 1) * 1000
    const nextLevelExp = driverLevel * 1000
    const progress = ((experience - currentLevelExp) / (nextLevelExp - currentLevelExp)) * 100
    return Math.max(0, Math.min(100, progress))
  }

  const getDriverRank = () => {
    if (driverLevel >= 8) return { rank: "Expert", color: "text-purple-600", bg: "bg-purple-50" }
    if (driverLevel >= 6) return { rank: "Advanced", color: "text-blue-600", bg: "bg-blue-50" }
    if (driverLevel >= 4) return { rank: "Intermediate", color: "text-green-600", bg: "bg-green-50" }
    if (driverLevel >= 2) return { rank: "Novice", color: "text-yellow-600", bg: "bg-yellow-50" }
    return { rank: "Beginner", color: "text-slate-600", bg: "bg-slate-50" }
  }

  const driverRank = getDriverRank()

  return (
    <div className="space-y-6">
      {/* Driver Profile Overview */}
      <Card className="bg-white border-slate-200 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold flex items-center gap-3">
            <User className="h-6 w-6 text-blue-500" />
            Driver Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="h-10 w-10 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-slate-900">404NotFound</h3>
              <div className="flex items-center gap-3 mt-2">
                <Badge className={`${driverRank.bg} ${driverRank.color} text-sm font-semibold px-3 py-1`}>
                  Level {driverLevel} - {driverRank.rank}
                </Badge>
                <Badge variant="outline" className="text-sm font-medium">
                  {experience} XP
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-slate-600">Current Session</div>
              <div className="text-2xl font-bold text-slate-900">{alertnessScore}%</div>
              <div className="text-sm font-medium text-slate-600">Alertness</div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-base font-semibold mb-2">
              <span className="text-slate-700">Level Progress</span>
              <span className="text-slate-900">{Math.round(getLevelProgress())}%</span>
            </div>
            <Progress value={getLevelProgress()} className="h-3" />
            <div className="flex justify-between text-sm text-slate-600 font-medium mt-1">
              <span>Level {driverLevel}</span>
              <span>Level {driverLevel + 1}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Performance */}
      <Card className="bg-white border-slate-200 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold flex items-center gap-3">
            <Calendar className="h-6 w-6 text-green-500" />
            Weekly Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-2xl font-bold text-blue-900">{weeklyStats.totalTrips}</div>
              <div className="text-base font-medium text-blue-700">Total Trips</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="text-2xl font-bold text-green-900">{Math.round(weeklyStats.totalDuration / 60)}h</div>
              <div className="text-base font-medium text-green-700">Drive Time</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="text-2xl font-bold text-purple-900">{weeklyStats.averageAlertness}%</div>
              <div className="text-base font-medium text-purple-700">Avg Alertness</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="text-2xl font-bold text-orange-900">{weeklyStats.safetyScore}%</div>
              <div className="text-base font-medium text-orange-700">Safety Score</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card className="bg-white border-slate-200 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold flex items-center gap-3">
            <Trophy className="h-6 w-6 text-yellow-500" />
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`p-4 rounded-lg border ${
                  achievement.unlocked ? "bg-yellow-50 border-yellow-200" : "bg-slate-50 border-slate-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{achievement.icon}</span>
                  <div className="flex-1">
                    <h4 className={`text-lg font-bold ${achievement.unlocked ? "text-yellow-900" : "text-slate-600"}`}>
                      {achievement.name}
                    </h4>
                    <p className={`text-sm font-medium ${achievement.unlocked ? "text-yellow-700" : "text-slate-500"}`}>
                      {achievement.description}
                    </p>
                  </div>
                  {achievement.unlocked && (
                    <Badge className="bg-yellow-600 text-white text-xs font-semibold">Unlocked</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Personal Bests */}
      <Card className="bg-white border-slate-200 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold flex items-center gap-3">
            <Star className="h-6 w-6 text-purple-500" />
            Personal Bests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-3">
                <Award className="h-6 w-6 text-green-600" />
                <div>
                  <div className="text-lg font-bold text-green-900">Longest Safe Drive</div>
                  <div className="text-sm font-medium text-green-700">Without any alerts</div>
                </div>
              </div>
              <div className="text-2xl font-bold text-green-900">8h 45m</div>
            </div>

            <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-3">
                <Eye className="h-6 w-6 text-blue-600" />
                <div>
                  <div className="text-lg font-bold text-blue-900">Best Alertness Score</div>
                  <div className="text-sm font-medium text-blue-700">Peak performance</div>
                </div>
              </div>
              <div className="text-2xl font-bold text-blue-900">98%</div>
            </div>

            <div className="flex justify-between items-center p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-center gap-3">
                <Clock className="h-6 w-6 text-purple-600" />
                <div>
                  <div className="text-lg font-bold text-purple-900">Consecutive Safe Days</div>
                  <div className="text-sm font-medium text-purple-700">Current streak</div>
                </div>
              </div>
              <div className="text-2xl font-bold text-purple-900">12 days</div>
            </div>

            <div className="flex justify-between items-center p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="flex items-center gap-3">
                <Coffee className="h-6 w-6 text-orange-600" />
                <div>
                  <div className="text-lg font-bold text-orange-900">Lowest Fatigue Incidents</div>
                  <div className="text-sm font-medium text-orange-700">Weekly record</div>
                </div>
              </div>
              <div className="text-2xl font-bold text-orange-900">0</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Driving Insights */}
      <Card className="bg-white border-slate-200 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold flex items-center gap-3">
            <TrendingUp className="h-6 w-6 text-indigo-500" />
            Driving Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
              <h4 className="text-lg font-bold text-indigo-900 mb-2">Personalized Recommendations</h4>
              <ul className="space-y-2 text-base font-medium text-indigo-800">
                <li>• Your alertness peaks between 10 AM - 2 PM</li>
                <li>• Consider breaks every 2 hours for optimal performance</li>
                <li>• Night driving shows 15% lower alertness scores</li>
                <li>• Blink rate is most stable during highway driving</li>
              </ul>
            </div>

            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="text-lg font-bold text-green-900 mb-2">Strengths</h4>
              <ul className="space-y-2 text-base font-medium text-green-800">
                <li>• Excellent head pose stability (92% average)</li>
                <li>• Consistent gaze tracking performance</li>
                <li>• Quick response to Level 1 alerts</li>
              </ul>
            </div>

            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <h4 className="text-lg font-bold text-yellow-900 mb-2">Areas for Improvement</h4>
              <ul className="space-y-2 text-base font-medium text-yellow-800">
                <li>• Blink rate varies during long trips</li>
                <li>• Consider more frequent breaks after 3+ hours</li>
                <li>• Monitor caffeine intake timing</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
