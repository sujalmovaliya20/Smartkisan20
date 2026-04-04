import React, { useState, useEffect } from 'react';
import {
    CloudSun, CloudRain, Wind, Droplets, Sun, AlertTriangle,
    Snowflake, Cloud, MapPin, Loader2, Sprout, Umbrella,
    Thermometer, Eye
} from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
    BarChart, Bar, Cell
} from 'recharts';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';

const iconMap = {
    Sun, CloudSun, Cloud, CloudRain, Snowflake,
    CloudFog: Cloud, CloudDrizzle: CloudRain, CloudLightning: CloudRain,
};

// Rain probability color
const getRainColor = (pct) => {
    if (pct >= 70) return '#1565C0';
    if (pct >= 40) return '#42A5F5';
    return '#90CAF9';
};

// Farming advisory based on conditions
const getFarmingAdvisory = (weather) => {
    if (!weather) return [];
    const temp = weather.current?.temp || 25;
    const humidity = weather.current?.humidity || 60;
    return [
        {
            icon: '💧', title: 'Irrigation',
            text: humidity > 70 ? 'Skip irrigation today — humidity is high.' : 'Good time to irrigate in the evening.',
            color: humidity > 70 ? 'bg-blue-50 border-blue-200' : 'bg-kissan-sky-pale border-kissan-sky/30',
            textColor: 'text-blue-800',
        },
        {
            icon: '🌾', title: 'Sowing Window',
            text: temp >= 20 && temp <= 30 ? 'Optimal temperature for Rabi sowing. Proceed.' : 'Temperature not ideal. Wait 2-3 days.',
            color: temp >= 20 && temp <= 30 ? 'bg-kissan-green-pale border-kissan-green/20' : 'bg-amber-50 border-amber-200',
            textColor: temp >= 20 && temp <= 30 ? 'text-green-800' : 'text-amber-800',
        },
        {
            icon: '🐛', title: 'Pest Risk',
            text: humidity > 75 ? 'High humidity — check for fungal disease. Spray preventively.' : 'Pest risk is LOW today.',
            color: humidity > 75 ? 'bg-orange-50 border-orange-200' : 'bg-green-50 border-green-200',
            textColor: humidity > 75 ? 'text-orange-800' : 'text-green-800',
        },
    ];
};

const Weather = () => {
    const { t } = useLanguage();
    const { user } = useAuth();
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedDay, setSelectedDay] = useState(null);
    const [locationName, setLocationName] = useState('');

    useEffect(() => {
        const fetchWeather = async () => {
            setLoading(true);
            let location = 'New Delhi';
            if (user) {
                const { data } = await api.getProfile(user.id);
                if (data?.location) location = data.location;
            }
            try {
                const res = await fetch(`/api/weather?location=${encodeURIComponent(location)}`);
                const data = await res.json();
                setWeather(data);
                setLocationName(data.location?.name || location);
                if (data?.daily?.length > 0) setSelectedDay(data.daily[0].day);
            } catch (e) {
                console.error('Weather fetch error:', e);
            }
            setLoading(false);
        };
        fetchWeather();
    }, [user]);

    if (loading) {
        return (
            <div className="page-wrapper">
                <div className="flex flex-col items-center justify-center h-64 gap-4">
                    <Loader2 className="w-10 h-10 animate-spin text-kissan-sky" />
                    <p className="text-gray-400 text-sm">Fetching weather data...</p>
                </div>
            </div>
        );
    }

    if (!weather) {
        return (
            <div className="page-wrapper">
                <div className="text-center py-16">
                    <Cloud className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                    <p className="text-gray-400">Failed to load weather data.</p>
                </div>
            </div>
        );
    }

    const CurrentIcon = iconMap[weather.current?.icon] || Cloud;
    const hourlyData = selectedDay ? (weather.hourly?.[selectedDay] || []) : [];
    const farmingAdvisory = getFarmingAdvisory(weather);

    return (
        <div className="page-wrapper animate-fade-in">
            {/* Header */}
            <div className="mb-5">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">🌤 Weather Forecast</h1>
                <p className="text-gray-500 mt-1 text-sm">Plan your farm activities with 7-day forecast</p>
            </div>

            {/* ── Hero Weather Card ─────────────────────────────────────── */}
            <div className="rounded-3xl overflow-hidden mb-5 relative" id="weather-hero">
                <div
                    className="p-6 sm:p-8"
                    style={{ background: 'linear-gradient(135deg, #0D47A1 0%, #1565C0 40%, #42A5F5 100%)' }}
                >
                    {/* Decorative circles */}
                    <div className="absolute top-0 right-0 w-56 h-56 rounded-full opacity-10"
                         style={{ background: 'radial-gradient(circle, #ffffff, transparent)', transform: 'translate(30%, -30%)' }} />

                    <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-2 mb-4 text-blue-200 text-sm font-medium">
                                <MapPin className="w-4 h-4" />
                                <span>{locationName}</span>
                                {locationName === 'New Delhi' && (
                                    <span className="text-xs bg-white/15 px-2 py-0.5 rounded-full">Default</span>
                                )}
                            </div>

                            <div className="flex items-end gap-4">
                                <div>
                                    <div className="text-7xl font-black text-white leading-none">{weather.current.temp}°</div>
                                    <p className="text-blue-100 text-lg capitalize mt-2">{weather.current.desc}</p>
                                </div>
                                <CurrentIcon className="w-20 h-20 text-yellow-300 drop-shadow-lg mb-2" />
                            </div>
                        </div>

                        {/* Stats pills */}
                        <div className="grid grid-cols-3 md:grid-cols-1 gap-3 md:min-w-[150px]">
                            {[
                                { icon: Wind, label: 'Wind', val: `${weather.current.wind} km/h` },
                                { icon: Droplets, label: 'Humidity', val: `${weather.current.humidity}%` },
                                { icon: CloudRain, label: 'Rain', val: `${weather.current.precip} mm` },
                            ].map(({ icon: Icon, label, val }) => (
                                <div key={label} className="bg-white/15 backdrop-blur-sm rounded-2xl p-3.5 text-center border border-white/20">
                                    <Icon className="w-5 h-5 text-blue-200 mx-auto mb-1.5" />
                                    <p className="text-xs text-blue-100/70">{label}</p>
                                    <p className="font-bold text-white text-sm">{val}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Feels Like / UV / Visibility */}
                    <div className="relative flex gap-4 mt-6 pt-5 border-t border-white/20 overflow-x-auto">
                        {[
                            { label: 'Feels Like', val: `${(weather.current.temp - 2)}°C`, icon: Thermometer },
                            { label: 'UV Index', val: 'Moderate', icon: Sun },
                            { label: 'Visibility', val: '10 km', icon: Eye },
                        ].map(({ label, val, icon: Icon }) => (
                            <div key={label} className="flex items-center gap-2 text-blue-100/80 text-sm flex-shrink-0">
                                <Icon className="w-4 h-4" />
                                <span>{label}: <span className="font-semibold text-white">{val}</span></span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Weather Alert ─────────────────────────────────────────── */}
            <div className="bg-amber-50 border-l-4 border-amber-500 rounded-2xl p-4 mb-5 flex items-start gap-3" id="weather-alert">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                    <p className="font-bold text-amber-800 text-sm">{t('weather_alert')}</p>
                    <p className="text-amber-700 text-sm mt-0.5">{t('weather_alert_description')}</p>
                </div>
            </div>

            {/* ── 7-Day Forecast Strip ──────────────────────────────────── */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-5 mb-5" id="weekly-forecast">
                <h3 className="font-bold text-gray-900 mb-4">7-Day Forecast</h3>
                <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                    {weather.daily?.map((day) => {
                        const DayIcon = iconMap[day.icon] || Cloud;
                        const isSelected = selectedDay === day.day;
                        return (
                            <button
                                key={day.day}
                                id={`forecast-${day.day?.toLowerCase()}`}
                                onClick={() => setSelectedDay(day.day)}
                                className={cn(
                                    'flex flex-col items-center gap-2 p-3.5 rounded-2xl border-2 flex-shrink-0 min-w-[80px] transition-all duration-200 no-tap-highlight',
                                    isSelected
                                        ? 'border-kissan-sky bg-kissan-sky-pale shadow-blue'
                                        : 'border-transparent bg-gray-50 hover:border-gray-200'
                                )}
                                aria-pressed={isSelected}
                                aria-label={`${day.day} forecast`}
                            >
                                <p className={cn('text-xs font-bold', isSelected ? 'text-kissan-sky-dark' : 'text-gray-500')}>{day.day}</p>
                                <DayIcon className={cn('w-7 h-7', isSelected ? 'text-kissan-sky' : 'text-gray-400')} />
                                <p className={cn('font-extrabold text-sm', isSelected ? 'text-gray-900' : 'text-gray-700')}>{day.maxTemp}°</p>
                                <p className="text-xs text-gray-400">{day.minTemp}°</p>
                                <div className={cn(
                                    'flex items-center gap-0.5 text-[10px] font-bold rounded-full px-2 py-0.5',
                                    day.rainChance >= 50 ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'
                                )}>
                                    💧 {day.rainChance}%
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* ── Rainfall Probability Chart ────────────────────────────── */}
            {weather.daily && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-5 mb-5" id="rainfall-chart">
                    <h3 className="font-bold text-gray-900 mb-4">7-Day Rainfall Probability</h3>
                    <div className="h-36">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={weather.daily} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} domain={[0, 100]} tickFormatter={v => `${v}%`} />
                                <Tooltip
                                    formatter={(v) => [`${v}%`, 'Rain Chance']}
                                    contentStyle={{ borderRadius: '12px', border: '1px solid #f0f0f0', fontSize: '12px' }}
                                />
                                <Bar dataKey="rainChance" radius={[6, 6, 0, 0]}>
                                    {weather.daily.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={getRainColor(entry.rainChance)} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

            {/* ── Hourly Temperature Chart ──────────────────────────────── */}
            {hourlyData.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-5 mb-5" id="hourly-chart">
                    <h3 className="font-bold text-gray-900 mb-1">Hourly Temperature — {selectedDay}</h3>
                    <p className="text-xs text-gray-400 mb-4">Tap a day above to see its hourly breakdown</p>
                    <div className="h-44">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={hourlyData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#42A5F5" stopOpacity={0.25} />
                                        <stop offset="95%" stopColor="#42A5F5" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} domain={['dataMin - 2', 'dataMax + 2']} />
                                <Tooltip
                                    formatter={(v) => [`${v}°C`, 'Temp']}
                                    contentStyle={{ borderRadius: '12px', border: '1px solid #f0f0f0', fontSize: '12px' }}
                                />
                                <Area type="monotone" dataKey="temp" stroke="#42A5F5" strokeWidth={2.5} fill="url(#tempGrad)" dot={{ fill: '#42A5F5', r: 3 }} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

            {/* ── Farming Advisory ──────────────────────────────────────── */}
            <div id="farming-advisory">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Sprout className="w-5 h-5 text-kissan-green" /> Farming Advisory
                </h3>
                <div className="space-y-3">
                    {farmingAdvisory.map((adv) => (
                        <div key={adv.title} className={cn('flex items-start gap-4 rounded-2xl border-2 p-4', adv.color)}>
                            <span className="text-2xl flex-shrink-0">{adv.icon}</span>
                            <div>
                                <p className={cn('font-bold text-sm', adv.textColor)}>{adv.title}</p>
                                <p className={cn('text-sm mt-0.5', adv.textColor, 'opacity-80')}>{adv.text}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Weather;
