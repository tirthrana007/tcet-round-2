'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Cloud, Sun, Moon, MapPin, Thermometer, Wind, Eye, Clock, Navigation, AlertTriangle } from 'lucide-react'

export function EnvironmentalContext() {
  const [currentTime] = useState(new Date())
  const [weatherData] = useState({
    condition: 'partly-cloudy',
    temperature: 72,
    humidity: 65,
    windSpeed: 8,
    visibility: 10,
    precipitation: 0
  })
  
  const [locationData] = useState({
    city: 'San Francisco',
    state: 'CA',
    highway: 'I-101 North',
    nextExit: 'Exit 42 - Downtown',
    distanceToExit: 2.3
  })

  const [trafficData] = useState({
    congestionLevel: 'moderate',
    averageSpeed: 45,
    incidents: 1,
    constructionZones: 0
  })

  const isNightTime = currentTime.getHours() < 6 || currentTime.getHours() > 20
  const isDangerousWeather = weatherData.precipitation > 0 || weatherData.visibility < 5
  const isRushHour = (currentTime.getHours() >= 7 && currentTime.getHours() <= 9) || 
                    (currentTime.getHours() >= 17 && currentTime.getHours() <= 19)

  const getSensitivityLevel = () => {
    let level = 'normal'
    if (isNightTime) level = 'high'
    if (isDangerousWeather) level = 'very-high'
    if (isRushHour && isDangerousWeather) level = 'maximum'
    return level
  }

  const getWeatherIcon = () => {
    switch (weatherData.condition) {
      case 'sunny': return <Sun className="h-6 w-6 text-yellow-400" />
      case 'cloudy': return <Cloud className="h-6 w-6 text-gray-400" />
      case 'partly-cloudy': return <Cloud className="h-6 w-6 text-blue-400" />
      case 'rainy': return <Cloud className="h-6 w-6 text-blue-600" />
      default: return <Sun className="h-6 w-6 text-yellow-400" />
    }
  }

  const sensitivityLevel = getSensitivityLevel()
  const sensitivityColors = {
    'normal': 'text-green-400',
    'high': 'text-yellow-400',
    'very-high': 'text-orange-400',
    'maximum': 'text-red-400'
  }

  return (
    <div className="space-y-6">
      {/* Context Overview */}
      <Card className="bg-white border-slate-200 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-blue-400" />
            Environmental Context
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{locationData.city}</div>
              <div className="text-sm text-slate-600">{locationData.state}</div>
              <div className="text-xs text-slate-500 mt-1">{locationData.highway}</div>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-2">{getWeatherIcon()}</div>
              <div className="text-lg font-semibold">{weatherData.temperature}°F</div>
              <div className="text-sm text-slate-600 capitalize">{weatherData.condition.replace('-', ' ')}</div>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-2">
                {isNightTime ? <Moon className="h-6 w-6 text-blue-300" /> : <Sun className="h-6 w-6 text-yellow-400" />}
              </div>
              <div className="text-lg font-semibold">
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
              <div className="text-sm text-slate-600">{isNightTime ? 'Night Driving' : 'Day Driving'}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weather Conditions */}
        <Card className="bg-white border-slate-200 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cloud className="h-5 w-5 text-blue-400" />
              Weather Conditions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Thermometer className="h-4 w-4 text-red-400" />
                  <span className="text-sm">Temperature</span>
                </div>
                <div className="text-xl font-bold">{weatherData.temperature}°F</div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Wind className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">Wind Speed</span>
                </div>
                <div className="text-xl font-bold">{weatherData.windSpeed} mph</div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-blue-400" />
                  <span className="text-sm">Visibility</span>
                </div>
                <div className="text-xl font-bold">{weatherData.visibility} mi</div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Cloud className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">Precipitation</span>
                </div>
                <div className="text-xl font-bold">{weatherData.precipitation}%</div>
              </div>
            </div>

            {isDangerousWeather && (
              <div className="p-3 bg-orange-500/20 border border-orange-500/30 rounded-lg">
                <div className="flex items-center gap-2 text-orange-400">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-sm font-semibold">Weather Alert</span>
                </div>
                <div className="text-sm text-orange-300 mt-1">
                  Reduced visibility conditions detected. System sensitivity increased.
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Traffic & Road Conditions */}
        <Card className="bg-white border-slate-200 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Navigation className="h-5 w-5 text-green-400" />
              Traffic & Road
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Traffic Flow</span>
                <Badge 
                  variant={trafficData.congestionLevel === 'heavy' ? 'destructive' : 
                          trafficData.congestionLevel === 'moderate' ? 'secondary' : 'default'}
                  className="capitalize"
                >
                  {trafficData.congestionLevel}
                </Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Average Speed</span>
                <span className="font-semibold">{trafficData.averageSpeed} mph</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Active Incidents</span>
                <span className="font-semibold">{trafficData.incidents}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Construction Zones</span>
                <span className="font-semibold">{trafficData.constructionZones}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200">
              <div className="text-sm text-slate-600 mb-2">Next Exit</div>
              <div className="text-lg font-semibold">{locationData.nextExit}</div>
              <div className="text-sm text-slate-500">{locationData.distanceToExit} miles ahead</div>
            </div>

            {isRushHour && (
              <div className="p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
                <div className="flex items-center gap-2 text-yellow-400">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm font-semibold">Rush Hour Alert</span>
                </div>
                <div className="text-sm text-yellow-300 mt-1">
                  Heavy traffic conditions. Increased monitoring recommended.
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* AI Sensitivity Adjustment */}
      <Card className="bg-white border-slate-200 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-400" />
            AI Sensitivity Adjustment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-semibold">Current Sensitivity Level</div>
                <div className="text-sm text-slate-600">Based on environmental conditions</div>
              </div>
              <Badge variant="outline" className={`capitalize ${sensitivityColors[sensitivityLevel]}`}>
                {sensitivityLevel.replace('-', ' ')}
              </Badge>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Detection Threshold</span>
                <span>{sensitivityLevel === 'maximum' ? '90%' : 
                       sensitivityLevel === 'very-high' ? '80%' : 
                       sensitivityLevel === 'high' ? '70%' : '60%'}</span>
              </div>
              <Progress 
                value={sensitivityLevel === 'maximum' ? 90 : 
                       sensitivityLevel === 'very-high' ? 80 : 
                       sensitivityLevel === 'high' ? 70 : 60} 
                className="h-2" 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              <div className="text-center p-3 bg-slate-50 rounded-lg border">
                <div className="text-sm text-slate-600">Night Driving</div>
                <div className={`font-semibold ${isNightTime ? 'text-orange-400' : 'text-green-400'}`}>
                  {isNightTime ? 'Active' : 'Inactive'}
                </div>
              </div>
              <div className="text-center p-3 bg-slate-50 rounded-lg border">
                <div className="text-sm text-slate-600">Weather Impact</div>
                <div className={`font-semibold ${isDangerousWeather ? 'text-red-400' : 'text-green-400'}`}>
                  {isDangerousWeather ? 'High' : 'Low'}
                </div>
              </div>
              <div className="text-center p-3 bg-slate-50 rounded-lg border">
                <div className="text-sm text-slate-600">Traffic Density</div>
                <div className={`font-semibold ${isRushHour ? 'text-yellow-400' : 'text-green-400'}`}>
                  {isRushHour ? 'High' : 'Normal'}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200">
              <div className="text-sm text-slate-600 mb-2">Contextual Adjustments</div>
              <div className="space-y-2 text-sm">
                {isNightTime && (
                  <div className="flex items-center gap-2 text-blue-300">
                    <Moon className="h-3 w-3" />
                    <span>Night mode: Increased blink detection sensitivity</span>
                  </div>
                )}
                {isDangerousWeather && (
                  <div className="flex items-center gap-2 text-orange-300">
                    <Cloud className="h-3 w-3" />
                    <span>Weather mode: Enhanced attention monitoring</span>
                  </div>
                )}
                {isRushHour && (
                  <div className="flex items-center gap-2 text-yellow-300">
                    <Clock className="h-3 w-3" />
                    <span>Rush hour: Stress detection enabled</span>
                  </div>
                )}
                {!isNightTime && !isDangerousWeather && !isRushHour && (
                  <div className="flex items-center gap-2 text-green-300">
                    <Sun className="h-3 w-3" />
                    <span>Optimal conditions: Standard monitoring</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

      {/* Break Recommendations */}
      <Card className="bg-white border-slate-200 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-green-400" />
            Smart Break Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-lg border">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4 text-blue-400" />
                  <span className="font-semibold">Shell Station</span>
                </div>
                <div className="text-sm text-slate-600 mb-2">2.3 miles ahead</div>
                <div className="flex gap-2">
                  <Badge variant="outline" className="text-xs">Coffee</Badge>
                  <Badge variant="outline" className="text-xs">Restroom</Badge>
                  <Badge variant="outline" className="text-xs">Food</Badge>
                </div>
              </div>
              
              <div className="p-4 bg-slate-50 rounded-lg border">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4 text-green-400" />
                  <span className="font-semibold">Rest Area</span>
                </div>
                <div className="text-sm text-slate-600 mb-2">5.7 miles ahead</div>
                <div className="flex gap-2">
                  <Badge variant="outline" className="text-xs">Parking</Badge>
                  <Badge variant="outline" className="text-xs">Scenic</Badge>
                  <Badge variant="outline" className="text-xs">Free</Badge>
                </div>
              </div>
            </div>

            <div className="text-sm text-slate-600">
              Recommendations based on current fatigue level, weather conditions, and nearby amenities.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
