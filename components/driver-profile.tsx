'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Trophy, TrendingUp, Star, Award, Target, Calendar, Clock, Zap } from 'lucide-react'

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
  const driverStats = {
    totalTrips: 47,
    safeTrips: 42,
    averageScore: 87,
    totalDistance: 2847,
    achievements: [
      { name: 'Safe Driver', icon: '🛡️', description: '30 consecutive safe trips' },
      { name: 'Alert Master', icon: '👁️', description: 'Maintained 90%+ alertness for 100 hours' },
      { name: 'Night Owl', icon: '🌙', description: 'Safe night driving streak' },
      { name: 'Distance Champion', icon: '🏆', description: 'Drove 1000+ miles safely' }
    ],
    weeklyScores: [85, 88, 92, 87, 89, 91, 86],
    personalBests: {
      longestSafeTrip: '8h 45m',
      highestAlertness: '98%',
      bestWeeklyAverage: '94%'
    }
  }

  const getCurrentLevel = () => {
    if (driverStats.averageScore >= 95) return { level: 'Expert', color: 'text-purple-400', next: 100 }
    if (driverStats.averageScore >= 85) return { level: 'Advanced', color: 'text-blue-400', next: 95 }
    if (driverStats.averageScore >= 75) return { level: 'Intermediate', color: 'text-green-400', next: 85 }
    return { level: 'Beginner', color: 'text-yellow-400', next: 75 }
  }

  const level = getCurrentLevel()

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card className="bg-white border-slate-200 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-xl font-bold">
              JD
            </div>
            <div>
              <h2 className="text-xl">John Driver</h2>
              <p className="text-slate-600">Safe Driving Since 2020</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{driverStats.totalTrips}</div>
              <div className="text-sm text-slate-600">Total Trips</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{driverStats.safeTrips}</div>
              <div className="text-sm text-slate-600">Safe Trips</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">{driverStats.averageScore}%</div>
              <div className="text-sm text-slate-600">Avg. Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">{driverStats.totalDistance}</div>
              <div className="text-sm text-slate-600">Miles Driven</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Driver Level & Progress */}
        <Card className="bg-white border-slate-200 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-400" />
              Driver Level
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className={`text-3xl font-bold ${level.color}`}>{level.level}</div>
              <div className="text-sm text-slate-600">Current Level</div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress to next level</span>
                <span>{driverStats.averageScore}% / {level.next}%</span>
              </div>
              <Progress value={(driverStats.averageScore / level.next) * 100} className="h-3" />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="text-center p-3 bg-slate-50 rounded-lg border">
                <Star className="h-6 w-6 text-yellow-400 mx-auto mb-1" />
                <div className="text-sm font-semibold">4.8/5.0</div>
                <div className="text-xs text-slate-600">Safety Rating</div>
              </div>
              <div className="text-center p-3 bg-slate-50 rounded-lg border">
                <Award className="h-6 w-6 text-purple-400 mx-auto mb-1" />
                <div className="text-sm font-semibold">12</div>
                <div className="text-xs text-slate-600">Achievements</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Bests */}
        <Card className="bg-white border-slate-200 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-green-400" />
              Personal Bests
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-400" />
                  <span className="text-sm">Longest Safe Trip</span>
                </div>
                <span className="font-semibold">{driverStats.personalBests.longestSafeTrip}</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-yellow-400" />
                  <span className="text-sm">Highest Alertness</span>
                </div>
                <span className="font-semibold">{driverStats.personalBests.highestAlertness}</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-400" />
                  <span className="text-sm">Best Weekly Avg</span>
                </div>
                <span className="font-semibold">{driverStats.personalBests.bestWeeklyAverage}</span>
              </div>
            </div>

            <Button className="w-full" variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              View Detailed History
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Achievements */}
      <Card className="bg-white border-slate-200 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-purple-400" />
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {driverStats.achievements.map((achievement, index) => (
              <div key={index} className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg border">
                <div className="text-2xl">{achievement.icon}</div>
                <div>
                  <div className="font-semibold">{achievement.name}</div>
                  <div className="text-sm text-slate-600">{achievement.description}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Weekly Performance */}
      <Card className="bg-white border-slate-200 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-400" />
            Weekly Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-7 gap-2">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                <div key={day} className="text-center">
                  <div className="text-xs text-slate-600 mb-2">{day}</div>
                  <div className="h-20 bg-slate-50 rounded flex items-end justify-center p-1 border">
                    <div 
                      className="w-full bg-blue-500 rounded-sm"
                      style={{ height: `${(driverStats.weeklyScores[index] / 100) * 100}%` }}
                    />
                  </div>
                  <div className="text-xs font-semibold mt-1">{driverStats.weeklyScores[index]}%</div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-between items-center pt-4 border-t border-slate-600">
              <div>
                <div className="text-sm text-slate-600">This Week Average</div>
                <div className="text-xl font-bold">
                  {Math.round(driverStats.weeklyScores.reduce((a, b) => a + b, 0) / driverStats.weeklyScores.length)}%
                </div>
              </div>
              <Badge variant="default" className="bg-green-600">
                +3% from last week
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
