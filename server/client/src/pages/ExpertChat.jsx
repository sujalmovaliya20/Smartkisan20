import React, { useState } from 'react';
import {
    Search, Phone, MessageCircle, Video, Star, MapPin, Clock,
    Sprout, Shield, Award, ChevronRight, X, Languages,
    Calendar, CheckCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

// ─── Expert Data ───────────────────────────────────────────────────────────
const EXPERTS = [
    {
        id: 1, name: 'Dr. Suresh Kumar', avatar: 'SK',
        role: 'Senior Agronomist', specialization: 'Crop Disease & Pest Management',
        emoji: '🌾', rating: 4.9, reviews: 847, location: 'Ludhiana, Punjab',
        languages: ['Hindi', 'Punjabi', 'English'],
        crops: ['Wheat', 'Rice', 'Maize'],
        experience: '15 yrs', consultations: '2,400+',
        available: true, nextSlot: 'Available now',
        verified: true, category: 'agronomist',
        bio: 'Expert in Punjab crop systems. ICAR-certified with specialization in integrated pest management and disease forecasting.'
    },
    {
        id: 2, name: 'Dr. Priya Sharma', avatar: 'PS',
        role: 'Soil Scientist', specialization: 'Soil Health & Nutrient Management',
        emoji: '🪱', rating: 4.8, reviews: 562, location: 'Nagpur, Maharashtra',
        languages: ['Hindi', 'Marathi', 'English'],
        crops: ['Cotton', 'Soybean', 'Oranges'],
        experience: '12 yrs', consultations: '1,800+',
        available: true, nextSlot: 'Available in 20 min',
        verified: true, category: 'soil',
        bio: 'Specializes in Vidarbha soil types. Expert in micro-nutrient deficiency diagnosis and organic farming transition.'
    },
    {
        id: 3, name: 'Dr. Ramji Patel', avatar: 'RP',
        role: 'Agricultural Economist', specialization: 'Market Strategy & Crop Planning',
        emoji: '📊', rating: 4.7, reviews: 398, location: 'Ahmedabad, Gujarat',
        languages: ['Gujarati', 'Hindi', 'English'],
        crops: ['Cotton', 'Groundnut', 'Castor'],
        experience: '10 yrs', consultations: '1,200+',
        available: false, nextSlot: 'Available tomorrow 9 AM',
        verified: true, category: 'agronomist',
        bio: 'Helps farmers maximise income through smart crop selection, timing of market sales, and FPO tie-ups.'
    },
    {
        id: 4, name: 'Dr. Kavitha Rao', avatar: 'KR',
        role: 'Horticulture Expert', specialization: 'Vegetable & Fruit Crops',
        emoji: '🍅', rating: 4.6, reviews: 284, location: 'Hyderabad, Telangana',
        languages: ['Telugu', 'Hindi', 'English'],
        crops: ['Tomato', 'Chilli', 'Grapes'],
        experience: '8 yrs', consultations: '900+',
        available: true, nextSlot: 'Available now',
        verified: true, category: 'horticulture',
        bio: 'Expert in protected cultivation, drip fertigation, and export quality vegetable production.'
    },
    {
        id: 5, name: 'Dr. Harpreet Singh', avatar: 'HS',
        role: 'Veterinary Doctor', specialization: 'Livestock & Dairy Health',
        emoji: '🐄', rating: 4.8, reviews: 421, location: 'Karnal, Haryana',
        languages: ['Hindi', 'Punjabi'],
        crops: ['Fodder Crops', 'Dairy Farming'],
        experience: '11 yrs', consultations: '1,600+',
        available: false, nextSlot: 'Available in 2 hrs',
        verified: true, category: 'veterinary',
        bio: 'Covers cattle health, dairy management, fodder crop cultivation, and milk production optimisation.'
    },
    {
        id: 6, name: 'Dr. Anita Bhat', avatar: 'AB',
        role: 'Organic Farming Expert', specialization: 'Natural Pest Control & Certification',
        emoji: '🌿', rating: 4.9, reviews: 176, location: 'Mysuru, Karnataka',
        languages: ['Kannada', 'Hindi', 'English'],
        crops: ['Vegetables', 'Spices', 'Pulses'],
        experience: '9 yrs', consultations: '680+',
        available: true, nextSlot: 'Available now',
        verified: true, category: 'organic',
        bio: 'Guides farmers through organic certification process. Expert in biofertilizers, biopesticides, and composting.'
    },
];

const CATEGORIES = [
    { id: 'all', label: 'All Experts' },
    { id: 'agronomist', label: 'Agronomists' },
    { id: 'soil', label: 'Soil Experts' },
    { id: 'horticulture', label: 'Horticulture' },
    { id: 'veterinary', label: 'Veterinary' },
    { id: 'organic', label: 'Organic Farming' },
];

// ─── Booking Modal ─────────────────────────────────────────────────────────
const BookingModal = ({ expert, mode, onClose }) => {
    const [booked, setBooked] = useState(false);

    const modeConfig = {
        call: { label: 'Voice Call', color: 'bg-green-500', icon: '📞' },
        chat: { label: 'Text Chat', color: 'bg-kissan-sky', icon: '💬' },
        video: { label: 'Video Call', color: 'bg-purple-500', icon: '🎥' },
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 animate-fade-in">
            <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden animate-slide-up shadow-2xl">
                {!booked ? (
                    <>
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-5">
                                <h3 className="font-extrabold text-gray-900 text-lg">Book Consultation</h3>
                                <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 no-tap-highlight">
                                    <X className="w-4 h-4 text-gray-500" />
                                </button>
                            </div>

                            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl mb-5">
                                <div className="w-12 h-12 bg-kissan-green-pale border-2 border-kissan-green/20 rounded-full flex items-center justify-center font-bold text-kissan-green text-base">
                                    {expert.avatar}
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900">{expert.name}</p>
                                    <p className="text-sm text-gray-500">{expert.role}</p>
                                </div>
                            </div>

                            <div className="space-y-3 mb-6">
                                <div className="flex items-center gap-3 p-3.5 bg-gray-50 rounded-xl">
                                    <span className="text-xl">{modeConfig[mode]?.icon}</span>
                                    <div>
                                        <p className="font-semibold text-gray-800 text-sm">{modeConfig[mode]?.label}</p>
                                        <p className="text-xs text-gray-500">{expert.nextSlot}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3.5 bg-green-50 rounded-xl">
                                    <span className="text-xl">✅</span>
                                    <p className="text-sm text-green-700 font-medium">Free consultation for registered farmers</p>
                                </div>
                            </div>
                        </div>
                        <div className="px-6 pb-6 flex gap-3">
                            <button onClick={onClose}
                                className="flex-1 py-3.5 rounded-2xl border-2 border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 no-tap-highlight transition-colors">
                                Cancel
                            </button>
                            <button
                                id="confirm-booking"
                                onClick={() => setBooked(true)}
                                className="flex-1 btn-primary py-3.5 rounded-2xl text-sm justify-center"
                            >
                                Confirm Booking
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="p-8 text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                        <h3 className="text-xl font-extrabold text-gray-900 mb-2">Booking Confirmed!</h3>
                        <p className="text-gray-500 text-sm mb-6">
                            {expert.name} will connect with you via {modeConfig[mode]?.label} · {expert.nextSlot}
                        </p>
                        <button onClick={onClose} className="btn-primary w-full justify-center">
                            Done
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

// ─── Expert Card ───────────────────────────────────────────────────────────
const ExpertCard = ({ expert, onBook }) => (
    <div
        id={`expert-${expert.id}`}
        className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300"
    >
        <div className="p-5">
            {/* Header */}
            <div className="flex items-start gap-4 mb-4">
                <div className="relative flex-shrink-0">
                    <div className="w-14 h-14 bg-gradient-to-br from-kissan-green-pale to-kissan-green/20 border-2 border-kissan-green/20 rounded-2xl flex items-center justify-center font-extrabold text-kissan-green text-lg">
                        {expert.avatar}
                    </div>
                    {expert.available && (
                        <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" title="Online" />
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                        <h3 className="font-extrabold text-gray-900 text-base">{expert.name}</h3>
                        {expert.verified && <Shield className="w-4 h-4 text-kissan-sky flex-shrink-0" title="Verified Expert" />}
                    </div>
                    <p className="text-sm text-kissan-green font-semibold">{expert.role}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{expert.specialization}</p>
                </div>
            </div>

            {/* Bio */}
            <p className="text-xs text-gray-500 leading-relaxed mb-4 line-clamp-2">{expert.bio}</p>

            {/* Stats row */}
            <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-kissan-gold text-kissan-gold" />
                    <span className="text-sm font-bold text-gray-800">{expert.rating}</span>
                    <span className="text-xs text-gray-400">({expert.reviews})</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Award className="w-3.5 h-3.5" />{expert.experience}
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-400">
                    <MessageCircle className="w-3.5 h-3.5" />{expert.consultations}
                </div>
            </div>

            {/* Location + availability */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <MapPin className="w-3 h-3" />{expert.location}
                </div>
                <div className={cn('flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full',
                    expert.available ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                )}>
                    <Clock className="w-3 h-3" />
                    {expert.nextSlot}
                </div>
            </div>

            {/* Languages & Crops */}
            <div className="flex flex-wrap gap-1.5 mb-4">
                {expert.languages.map(l => (
                    <span key={l} className="px-2 py-0.5 bg-kissan-sky-pale text-kissan-sky-dark text-[10px] font-semibold rounded-full border border-kissan-sky/20">
                        {l}
                    </span>
                ))}
                {expert.crops.slice(0, 2).map(c => (
                    <span key={c} className="px-2 py-0.5 bg-kissan-green-pale text-kissan-green text-[10px] font-semibold rounded-full border border-kissan-green/20">
                        {c}
                    </span>
                ))}
            </div>

            {/* CTA Buttons */}
            <div className="grid grid-cols-3 gap-2">
                <button
                    id={`call-${expert.id}`}
                    onClick={() => onBook(expert, 'call')}
                    className="flex flex-col items-center gap-1 py-2.5 rounded-xl bg-green-50 border-2 border-green-200 text-green-700 hover:bg-green-500 hover:text-white hover:border-green-500 transition-all duration-200 no-tap-highlight"
                    aria-label={`Call ${expert.name}`}
                >
                    <Phone className="w-4 h-4" />
                    <span className="text-[10px] font-bold">Call</span>
                </button>
                <button
                    id={`chat-${expert.id}`}
                    onClick={() => onBook(expert, 'chat')}
                    className="flex flex-col items-center gap-1 py-2.5 rounded-xl bg-kissan-sky-pale border-2 border-kissan-sky/30 text-kissan-sky hover:bg-kissan-sky hover:text-white hover:border-kissan-sky transition-all duration-200 no-tap-highlight"
                    aria-label={`Chat with ${expert.name}`}
                >
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-[10px] font-bold">Chat</span>
                </button>
                <button
                    id={`video-${expert.id}`}
                    onClick={() => onBook(expert, 'video')}
                    className="flex flex-col items-center gap-1 py-2.5 rounded-xl bg-purple-50 border-2 border-purple-200 text-purple-600 hover:bg-purple-500 hover:text-white hover:border-purple-500 transition-all duration-200 no-tap-highlight"
                    aria-label={`Video call ${expert.name}`}
                >
                    <Video className="w-4 h-4" />
                    <span className="text-[10px] font-bold">Video</span>
                </button>
            </div>
        </div>
    </div>
);

// ─── Main Component ────────────────────────────────────────────────────────
const ExpertConnect = () => {
    const { t } = useLanguage();
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');
    const [booking, setBooking] = useState(null); // { expert, mode }

    const filteredExperts = EXPERTS.filter((e) => {
        const matchCat = activeCategory === 'all' || e.category === activeCategory;
        const matchSearch = !searchTerm ||
            e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            e.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
            e.crops.some(c => c.toLowerCase().includes(searchTerm.toLowerCase()));
        return matchCat && matchSearch;
    });

    const onlineCount = EXPERTS.filter(e => e.available).length;

    return (
        <div className="page-wrapper animate-fade-in">
            {/* Header */}
            <div className="mb-5">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">👨‍🌾 Expert Connect</h1>
                <p className="text-gray-500 mt-1 text-sm">
                    Talk to certified agronomists, soil scientists & vets
                    <span className="ml-2 inline-flex items-center gap-1 text-green-600 font-semibold">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                        {onlineCount} online now
                    </span>
                </p>
            </div>

            {/* Search */}
            <div className="relative mb-4">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    id="expert-search"
                    type="search"
                    placeholder="Search by crop, specialization or name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input-kissan pl-12"
                    aria-label="Search experts"
                />
            </div>

            {/* Category Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 mb-6 no-scrollbar">
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat.id}
                        id={`expert-cat-${cat.id}`}
                        onClick={() => setActiveCategory(cat.id)}
                        className={cn(
                            'flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all duration-200 no-tap-highlight',
                            activeCategory === cat.id
                                ? 'bg-kissan-green text-white border-kissan-green'
                                : 'bg-white text-gray-600 border-gray-200 hover:border-kissan-green/40 hover:text-kissan-green'
                        )}
                        aria-pressed={activeCategory === cat.id}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>

            {/* Free consultation banner */}
            <div className="bg-gradient-to-r from-kissan-green to-kissan-green-mid text-white rounded-2xl p-4 mb-6 flex items-center gap-3">
                <span className="text-3xl">🎁</span>
                <div>
                    <p className="font-bold">First Consultation is FREE</p>
                    <p className="text-green-100 text-sm">All registered farmers get free first call with any expert</p>
                </div>
            </div>

            {/* Expert Grid */}
            {filteredExperts.length === 0 ? (
                <div className="text-center py-16">
                    <p className="text-gray-400">No experts match your filters</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {filteredExperts.map((expert) => (
                        <ExpertCard
                            key={expert.id}
                            expert={expert}
                            onBook={(e, mode) => setBooking({ expert: e, mode })}
                        />
                    ))}
                </div>
            )}

            {/* Booking Modal */}
            {booking && (
                <BookingModal
                    expert={booking.expert}
                    mode={booking.mode}
                    onClose={() => setBooking(null)}
                />
            )}
        </div>
    );
};

export default ExpertConnect;
