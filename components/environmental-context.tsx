"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Cloud, Sun, Moon, MapPin, Settings, Coffee, Navigation } from "lucide-react"

export function EnvironmentalContext() {
  const [weatherCondition, setWeatherCondition] = useState("clear")
  const [timeOfDay, setTimeOfDay] = useState("day")
  const [sensitivity, setSensitivity] = useState([75])
  const [location, setLocation] = useState("Mumbai, Maharashtra")

  const weatherData = {
    clear: { icon: Sun, color: "text-yellow-500", bg: "bg-yellow-50" },
    cloudy: { icon: Cloud, color: "text-gray-500", bg: "bg-gray-50" },
    rainy: { icon: Cloud, color: "text-blue-500", bg: "bg-blue-50" },
    night: { icon: Moon, color: "text-purple-500", bg: "bg-purple-50" },
  }

  const currentWeather = weatherData[weatherCondition as keyof typeof weatherData]
  const WeatherIcon = currentWeather.icon

  return (
    <div className="space-y-6">
      {/* Context Overview */}
      <Card className="bg-white border-slate-200 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold flex items-center gap-3">
            <MapPin className="h-6 w-6 text-blue-500" />
            Environmental Context
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className={`p-4 rounded-lg border ${currentWeather.bg}`}>
              <div className="flex items-center gap-3 mb-2">
                <WeatherIcon className={`h-6 w-6 ${currentWeather.color}`} />
                <span className="text-lg font-semibold text-slate-900">Weather</span>
              </div>
              <div className="text-2xl font-bold text-slate-900 capitalize">{weatherCondition}</div>
              <div className="text-base text-slate-600 font-medium">72°F, Clear skies</div>
            </div>

            <div className="p-4 rounded-lg border bg-slate-50">
              <div className="flex items-center gap-3 mb-2">
                <Sun className="h-6 w-6 text-orange-500" />
                <span className="text-lg font-semibold text-slate-900">Time</span>
              </div>
              <div className="text-2xl font-bold text-slate-900">2:30 PM</div>
              <div className="text-base text-slate-600 font-medium">Daylight driving</div>
            </div>

            <div className="p-4 rounded-lg border bg-green-50">
              <div className="flex items-center gap-3 mb-2">
                <Navigation className="h-6 w-6 text-green-500" />
                <span className="text-lg font-semibold text-slate-900">Location</span>
              </div>
              <div className="text-lg font-bold text-slate-900">{location}</div>
              <div className="text-base text-slate-600 font-medium">City traffic conditions</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Adaptive Settings */}
      <Card className="bg-white border-slate-200 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold flex items-center gap-3">
            <Settings className="h-6 w-6 text-purple-500" />
            Adaptive Detection Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-lg font-semibold text-slate-900">Detection Sensitivity</span>
              <span className="text-xl font-bold text-blue-600">{sensitivity[0]}%</span>
            </div>
            <Slider value={sensitivity} onValueChange={setSensitivity} max={100} step={1} className="w-full" />
            <div className="flex justify-between text-base text-slate-600 font-medium mt-2">
              <span>Relaxed</span>
              <span>Balanced</span>
              <span>Strict</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-slate-900">Weather Adjustments</h3>
              <div className="flex flex-wrap gap-2">
                {Object.keys(weatherData).map((weather) => (
                  <Button
                    key={weather}
                    variant={weatherCondition === weather ? "default" : "outline"}
                    size="sm"
                    onClick={() => setWeatherCondition(weather)}
                    className="text-base font-medium"
                  >
                    {weather.charAt(0).toUpperCase() + weather.slice(1)}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-slate-900">Time Adjustments</h3>
              <div className="flex gap-2">
                <Button
                  variant={timeOfDay === "day" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTimeOfDay("day")}
                  className="text-base font-medium"
                >
                  Day
                </Button>
                <Button
                  variant={timeOfDay === "night" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTimeOfDay("night")}
                  className="text-base font-medium"
                >
                  Night
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Smart Recommendations */}
      <Card className="bg-white border-slate-200 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold flex items-center gap-3">
            <Coffee className="h-6 w-6 text-orange-500" />
            Smart Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="text-lg font-semibold text-blue-900 mb-2">Rest Stop Nearby</h4>
              <p className="text-base text-blue-800 font-medium">Shell Station - 2.3 miles ahead</p>
              <p className="text-sm text-blue-600 mt-1">Coffee, restrooms, parking available</p>
            </div>

            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="text-lg font-semibold text-green-900 mb-2">Break Suggestion</h4>
              <p className="text-base text-green-800 font-medium">Consider a 15-minute break</p>
              <p className="text-sm text-green-600 mt-1">You've been driving for 2.5 hours</p>
            </div>

            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <h4 className="text-lg font-semibold text-yellow-900 mb-2">Weather Alert</h4>
              <p className="text-base text-yellow-800 font-medium">Clear conditions ahead</p>
              <p className="text-sm text-yellow-600 mt-1">Good visibility for next 50 miles</p>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h4 className="text-lg font-semibold text-purple-900 mb-2">Traffic Update</h4>
              <p className="text-base text-purple-800 font-medium">Light traffic conditions</p>
              <p className="text-sm text-purple-600 mt-1">Estimated arrival: 4:15 PM</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Environmental Impact on Detection */}
      <Card className="bg-white border-slate-200 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Detection Algorithm Adjustments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border">
              <span className="text-base font-semibold text-slate-900">Blink Detection Threshold</span>
              <Badge variant="secondary" className="text-sm font-medium">
                Adjusted +15%
              </Badge>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border">
              <span className="text-base font-semibold text-slate-900">Yawn Sensitivity</span>
              <Badge variant="secondary" className="text-sm font-medium">
                Standard
              </Badge>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border">
              <span className="text-base font-semibold text-slate-900">Head Pose Tracking</span>
              <Badge variant="secondary" className="text-sm font-medium">
                Enhanced
              </Badge>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border">
              <span className="text-base font-semibold text-slate-900">Lighting Compensation</span>
              <Badge variant="default" className="text-sm font-medium">
                Active
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
