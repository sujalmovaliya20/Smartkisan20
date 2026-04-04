import React, { useState } from 'react';
import {
    Upload, Camera, AlertCircle, CheckCircle, Loader2, Leaf,
    ChevronRight, ChevronLeft, MapPin, Sprout, Droplets,
    Bug, FlaskConical, Calendar, Zap, Info
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

// ─── Data ─────────────────────────────────────────────────────────────────
const CROPS = [
    { id: 'wheat', label: 'Wheat', hindi: 'गेहूँ', emoji: '🌾' },
    { id: 'rice', label: 'Rice', hindi: 'चावल', emoji: '🍚' },
    { id: 'cotton', label: 'Cotton', hindi: 'कपास', emoji: '☁️' },
    { id: 'soybean', label: 'Soybean', hindi: 'सोयाबीन', emoji: '🫘' },
    { id: 'maize', label: 'Maize', hindi: 'मक्का', emoji: '🌽' },
    { id: 'onion', label: 'Onion', hindi: 'प्याज', emoji: '🧅' },
    { id: 'tomato', label: 'Tomato', hindi: 'टमाटर', emoji: '🍅' },
    { id: 'potato', label: 'Potato', hindi: 'आलू', emoji: '🥔' },
    { id: 'mustard', label: 'Mustard', hindi: 'सरसों', emoji: '🌼' },
    { id: 'sugarcane', label: 'Sugarcane', hindi: 'गन्ना', emoji: '🎋' },
    { id: 'groundnut', label: 'Groundnut', hindi: 'मूंगफली', emoji: '🥜' },
    { id: 'chana', label: 'Chana', hindi: 'चना', emoji: '🫛' },
];

const STAGES = [
    { id: 'sowing', label: 'Sowing / Nursery', icon: '🌱', desc: 'Seed selection & planting' },
    { id: 'vegetative', label: 'Vegetative Growth', icon: '🌿', desc: 'Tillering / branching' },
    { id: 'flowering', label: 'Flowering', icon: '🌸', desc: 'Pollination stage' },
    { id: 'grain_fill', label: 'Grain Filling', icon: '🌾', desc: 'Fruiting / fattening' },
    { id: 'harvest', label: 'Pre-Harvest', icon: '🏡', desc: 'Maturity & harvesting' },
];

const DISTRICTS = [
    'Ludhiana', 'Karnal', 'Hisar', 'Jaipur', 'Indore', 'Nagpur',
    'Pune', 'Ahmedabad', 'Surat', 'Agra', 'Varanasi', 'Patna',
    'Bhopal', 'Raipur', 'Hyderabad', 'Coimbatore', 'Mysuru'
];

// Advisory data per crop (simplified)
const getAdvisory = (crop, stage, district) => ({
    pest: {
        severity: crop === 'wheat' ? 'high' : 'medium',
        name: crop === 'wheat' ? 'Wheat Aphid (Sitobion avenae)' : 'Stem Borer',
        action: crop === 'wheat'
            ? 'Spray Imidacloprid 17.8% SL @ 125 ml/ha with 250 L water. Repeat in 10 days if infestation persists.'
            : 'Apply Chlorpyrifos 50% EC @ 1.5 L/ha. Focus on stem base at 20-25 DAS.',
    },
    irrigation: {
        next: '2 days',
        schedule: stage === 'vegetative'
            ? 'Irrigate every 10-12 days. Keep 5 cm standing water in paddy fields.'
            : 'Light irrigation every 7-8 days. Avoid waterlogging.',
        note: 'Check soil moisture at 6 inch depth before every irrigation.',
    },
    fertilizer: {
        dose: crop === 'wheat' ? 'N:P:K = 120:60:40 kg/ha' : 'DAP @ 100 kg/ha',
        timing: stage === 'sowing' ? 'Apply full P & K at sowing. Split N in 3 doses.' : 'Top dress Urea @ 30 kg/ha now.',
        method: 'Broadcast and incorporate before irrigation.',
    },
    disease: {
        alert: crop === 'wheat' ? 'Yellow Rust risk: HIGH (humidity >80%)' : 'Leaf blight risk: MEDIUM',
        preventive: 'Spray Tebuconazole 25.9% EC @ 500 ml/ha as preventive measure.',
    }
});

// ─── Severity Badge ────────────────────────────────────────────────────────
const SeverityBadge = ({ level }) => {
    const styles = {
        high: 'bg-red-100 text-red-700 border-red-200',
        medium: 'bg-amber-100 text-amber-700 border-amber-200',
        low: 'bg-green-100 text-green-700 border-green-200',
    };
    const labels = { high: '🔴 High Risk', medium: '🟡 Medium', low: '🟢 Low' };
    return (
        <span className={cn('px-2.5 py-1 rounded-full text-xs font-bold border', styles[level])}>
            {labels[level]}
        </span>
    );
};

// ─── Step Indicator ────────────────────────────────────────────────────────
const StepIndicator = ({ currentStep, steps }) => (
    <div className="flex items-center gap-2 mb-8" role="progressbar" aria-valuenow={currentStep} aria-valuemax={steps.length}>
        {steps.map((step, i) => (
            <React.Fragment key={i}>
                <div className="flex flex-col items-center gap-1.5">
                    <div className={cn(
                        'w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300',
                        i < currentStep
                            ? 'bg-kissan-green border-kissan-green text-white'
                            : i === currentStep
                            ? 'bg-white border-kissan-green text-kissan-green shadow-green'
                            : 'bg-gray-100 border-gray-200 text-gray-400'
                    )}>
                        {i < currentStep ? <CheckCircle className="w-5 h-5" /> : i + 1}
                    </div>
                    <span className={cn('text-[10px] font-semibold hidden sm:block', i === currentStep ? 'text-kissan-green' : 'text-gray-400')}>
                        {step}
                    </span>
                </div>
                {i < steps.length - 1 && (
                    <div className={cn('flex-1 h-0.5 rounded-full transition-all duration-500', i < currentStep ? 'bg-kissan-green' : 'bg-gray-200')} />
                )}
            </React.Fragment>
        ))}
    </div>
);

// ─── Advisory Result Cards ─────────────────────────────────────────────────
const AdvisoryResult = ({ crop, stage, district }) => {
    const advisory = getAdvisory(crop, stage, district);
    return (
        <div className="space-y-4 animate-fade-in">
            {/* Header */}
            <div className="bg-gradient-to-r from-kissan-green to-kissan-green-mid text-white rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">
                        {CROPS.find(c => c.id === crop)?.emoji || '🌱'}
                    </div>
                    <div>
                        <h3 className="text-lg font-bold">{CROPS.find(c => c.id === crop)?.label} Advisory</h3>
                        <p className="text-green-100 text-sm">
                            {STAGES.find(s => s.id === stage)?.label} · {district}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-green-100 text-xs">
                    <Calendar className="w-3 h-3" />
                    Generated for {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
            </div>

            {/* Pest Alert */}
            <div className={cn('rounded-2xl border-2 p-5', advisory.pest.severity === 'high' ? 'border-red-200 bg-red-50' : 'border-amber-200 bg-amber-50')}>
                <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2">
                        <Bug className={cn('w-5 h-5', advisory.pest.severity === 'high' ? 'text-red-600' : 'text-amber-600')} />
                        <h4 className="font-bold text-gray-900">Pest Alert</h4>
                    </div>
                    <SeverityBadge level={advisory.pest.severity} />
                </div>
                <p className="font-semibold text-gray-800 text-sm mb-2">{advisory.pest.name}</p>
                <p className="text-gray-600 text-sm leading-relaxed">{advisory.pest.action}</p>
            </div>

            {/* Irrigation */}
            <div className="rounded-2xl border-2 border-kissan-sky/40 bg-kissan-sky-pale p-5">
                <div className="flex items-center gap-2 mb-3">
                    <Droplets className="w-5 h-5 text-kissan-sky" />
                    <h4 className="font-bold text-gray-900">Irrigation Schedule</h4>
                    <span className="ml-auto text-xs font-bold bg-kissan-sky text-white px-2.5 py-1 rounded-full">
                        Next in {advisory.irrigation.next}
                    </span>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-2">{advisory.irrigation.schedule}</p>
                <div className="flex items-start gap-2 bg-white/70 rounded-xl p-3">
                    <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-gray-500">{advisory.irrigation.note}</p>
                </div>
            </div>

            {/* Fertilizer */}
            <div className="rounded-2xl border-2 border-kissan-green/30 bg-kissan-green-pale p-5">
                <div className="flex items-center gap-2 mb-3">
                    <FlaskConical className="w-5 h-5 text-kissan-green" />
                    <h4 className="font-bold text-gray-900">Fertilizer Dose</h4>
                </div>
                <div className="bg-white rounded-xl p-3 mb-3">
                    <p className="font-bold text-kissan-green text-base">{advisory.fertilizer.dose}</p>
                </div>
                <p className="text-gray-700 text-sm mb-1">{advisory.fertilizer.timing}</p>
                <p className="text-gray-500 text-xs">{advisory.fertilizer.method}</p>
            </div>

            {/* Disease */}
            <div className="rounded-2xl border-2 border-orange-200 bg-orange-50 p-5">
                <div className="flex items-center gap-2 mb-3">
                    <Zap className="w-5 h-5 text-orange-600" />
                    <h4 className="font-bold text-gray-900">Disease Alert</h4>
                </div>
                <p className="font-semibold text-orange-800 text-sm mb-2">{advisory.disease.alert}</p>
                <p className="text-gray-700 text-sm">{advisory.disease.preventive}</p>
            </div>
        </div>
    );
};

// ─── Main Component ────────────────────────────────────────────────────────
const CropHealth = () => {
    const { t } = useLanguage();
    const [step, setStep] = useState(0); // 0=crop, 1=stage+location, 2=result
    const [selectedCrop, setSelectedCrop] = useState(null);
    const [selectedStage, setSelectedStage] = useState(null);
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [activeTab, setActiveTab] = useState('wizard'); // 'wizard' | 'scan'

    // AI Photo scan states
    const [selectedImage, setSelectedImage] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const STEPS = ['Select Crop', 'Crop Details', 'Get Advisory'];

    const analyzeImage = async (file) => {
        setIsAnalyzing(true); setError(null); setResult(null);
        try {
            const res = await fetch('/api/ai/crop-health', {
                method: 'POST',
                headers: { 'Content-Type': file.type },
                body: file,
            });
            const data = await res.json();
            if (!res.ok || !data.success) throw new Error(data.details || data.error || 'Analysis failed');
            setResult(data);
        } catch (e) {
            setError(e.message);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleUpload = (e) => {
        const file = e.target.files?.[0];
        if (file) { setSelectedImage(URL.createObjectURL(file)); analyzeImage(file); }
    };

    const canProceedStep1 = !!selectedCrop;
    const canProceedStep2 = !!selectedStage && !!selectedDistrict;

    return (
        <div className="page-wrapper animate-fade-in">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">🌿 Crop Advisory</h1>
                <p className="text-gray-500 mt-1 text-sm">Get personalised tips for your crop — pest control, irrigation & fertilizer doses</p>
            </div>

            {/* Tab Switcher */}
            <div className="flex bg-gray-100 rounded-2xl p-1 mb-6 max-w-md">
                <button
                    id="tab-wizard"
                    onClick={() => setActiveTab('wizard')}
                    className={cn(
                        'flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 no-tap-highlight',
                        activeTab === 'wizard' ? 'bg-white text-kissan-green shadow-sm' : 'text-gray-500 hover:text-gray-700'
                    )}
                >
                    📋 Advisory Wizard
                </button>
                <button
                    id="tab-scan"
                    onClick={() => setActiveTab('scan')}
                    className={cn(
                        'flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 no-tap-highlight',
                        activeTab === 'scan' ? 'bg-white text-kissan-green shadow-sm' : 'text-gray-500 hover:text-gray-700'
                    )}
                >
                    📷 Quick AI Scan
                </button>
            </div>

            {/* ── WIZARD TAB ───────────────────────────────────────────── */}
            {activeTab === 'wizard' && (
                <div>
                    <StepIndicator currentStep={step} steps={STEPS} />

                    {/* Step 0: Select Crop */}
                    {step === 0 && (
                        <div className="animate-slide-up">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">Which crop are you growing?</h2>
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                                {CROPS.map((crop) => (
                                    <button
                                        key={crop.id}
                                        id={`crop-${crop.id}`}
                                        onClick={() => setSelectedCrop(crop.id)}
                                        className={cn(
                                            'flex flex-col items-center gap-2 p-3 sm:p-4 rounded-2xl border-2 transition-all duration-200 no-tap-highlight',
                                            selectedCrop === crop.id
                                                ? 'border-kissan-green bg-kissan-green-pale shadow-green scale-[1.03]'
                                                : 'border-gray-200 bg-white hover:border-kissan-green/40 hover:bg-kissan-green-pale/30'
                                        )}
                                        aria-pressed={selectedCrop === crop.id}
                                        aria-label={crop.label}
                                    >
                                        <span className="text-2xl sm:text-3xl">{crop.emoji}</span>
                                        <div className="text-center">
                                            <p className="text-xs sm:text-sm font-semibold text-gray-800">{crop.label}</p>
                                            <p className="text-[10px] text-gray-400">{crop.hindi}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>

                            <div className="mt-8 flex justify-end">
                                <button
                                    id="wizard-next-1"
                                    onClick={() => setStep(1)}
                                    disabled={!canProceedStep1}
                                    className={cn(
                                        'btn-primary',
                                        !canProceedStep1 && 'opacity-50 cursor-not-allowed'
                                    )}
                                >
                                    Next: Select Stage <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 1: Stage + Location */}
                    {step === 1 && (
                        <div className="animate-slide-up space-y-6">
                            {/* Growth Stage */}
                            <div>
                                <h2 className="text-lg font-bold text-gray-900 mb-4">What growth stage is your crop in?</h2>
                                <div className="space-y-3">
                                    {STAGES.map((stage) => (
                                        <button
                                            key={stage.id}
                                            id={`stage-${stage.id}`}
                                            onClick={() => setSelectedStage(stage.id)}
                                            className={cn(
                                                'w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all duration-200 no-tap-highlight',
                                                selectedStage === stage.id
                                                    ? 'border-kissan-green bg-kissan-green-pale shadow-green'
                                                    : 'border-gray-200 bg-white hover:border-kissan-green/40'
                                            )}
                                            aria-pressed={selectedStage === stage.id}
                                        >
                                            <span className="text-2xl flex-shrink-0">{stage.icon}</span>
                                            <div className="flex-1">
                                                <p className="font-semibold text-gray-800">{stage.label}</p>
                                                <p className="text-sm text-gray-500">{stage.desc}</p>
                                            </div>
                                            {selectedStage === stage.id && (
                                                <CheckCircle className="w-5 h-5 text-kissan-green flex-shrink-0" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* District */}
                            <div>
                                <label htmlFor="district-select" className="block text-lg font-bold text-gray-900 mb-3">
                                    Your nearest district / city?
                                </label>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <select
                                        id="district-select"
                                        value={selectedDistrict}
                                        onChange={(e) => setSelectedDistrict(e.target.value)}
                                        className="select-kissan pl-11"
                                    >
                                        <option value="">Select district...</option>
                                        {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="flex gap-3 justify-between">
                                <button id="wizard-back-1" onClick={() => setStep(0)}
                                    className="flex items-center gap-2 px-5 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition-colors no-tap-highlight">
                                    <ChevronLeft className="w-4 h-4" /> Back
                                </button>
                                <button
                                    id="wizard-next-2"
                                    onClick={() => setStep(2)}
                                    disabled={!canProceedStep2}
                                    className={cn('btn-primary', !canProceedStep2 && 'opacity-50 cursor-not-allowed')}
                                >
                                    Get Advisory <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Advisory Result */}
                    {step === 2 && (
                        <div className="animate-slide-up">
                            <AdvisoryResult crop={selectedCrop} stage={selectedStage} district={selectedDistrict} />
                            <div className="mt-6 flex gap-3">
                                <button id="wizard-back-2" onClick={() => setStep(1)}
                                    className="flex items-center gap-2 px-5 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition-colors no-tap-highlight">
                                    <ChevronLeft className="w-4 h-4" /> Modify
                                </button>
                                <button id="wizard-restart" onClick={() => { setStep(0); setSelectedCrop(null); setSelectedStage(null); setSelectedDistrict(''); }}
                                    className="flex-1 btn-primary justify-center">
                                    <Sprout className="w-4 h-4" /> New Advisory
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* ── AI SCAN TAB ──────────────────────────────────────────── */}
            {activeTab === 'scan' && (
                <div className="grid md:grid-cols-2 gap-6 animate-fade-in">
                    {/* Upload */}
                    <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-6 relative overflow-hidden">
                        <h3 className="font-bold text-gray-900 mb-1">Upload Plant Photo</h3>
                        <p className="text-sm text-gray-500 mb-5">AI will detect disease & suggest treatment</p>
                        <div className="relative border-2 border-dashed border-gray-200 rounded-2xl min-h-[220px] flex flex-col items-center justify-center bg-gray-50 overflow-hidden cursor-pointer hover:border-kissan-green transition-colors group">
                            {selectedImage
                                ? <img src={selectedImage} alt="Crop" className="absolute inset-0 w-full h-full object-cover rounded-2xl" />
                                : (
                                    <div className="text-center p-4 group-hover:scale-105 transition-transform">
                                        <Camera className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                        <p className="font-semibold text-gray-500">Tap to upload image</p>
                                        <p className="text-xs text-gray-400 mt-1">JPG, PNG up to 10MB</p>
                                    </div>
                                )
                            }
                            <input id="photo-upload" type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleUpload} />
                        </div>
                        {selectedImage && (
                            <button
                                className="mt-4 w-full py-2.5 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors no-tap-highlight"
                                onClick={() => { setSelectedImage(null); setResult(null); setError(null); }}
                            >
                                Upload New Image
                            </button>
                        )}
                    </div>

                    {/* Results */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
                        <h3 className="font-bold text-gray-900 mb-1">AI Diagnosis Report</h3>
                        <p className="text-sm text-gray-500 mb-5">Powered by Smart Kissan AI</p>

                        {!selectedImage && !isAnalyzing && !result && !error && (
                            <div className="flex flex-col items-center justify-center h-48 text-center">
                                <Upload className="w-12 h-12 text-gray-200 mb-3" />
                                <p className="text-gray-400">Upload a plant photo to start analysis</p>
                            </div>
                        )}

                        {isAnalyzing && (
                            <div className="flex flex-col items-center justify-center h-48 gap-4">
                                <Loader2 className="w-10 h-10 text-kissan-green animate-spin" />
                                <p className="text-gray-500">Analyzing with AI...</p>
                                <Progress value={60} className="w-48 h-2" />
                            </div>
                        )}

                        {error && (
                            <div className="rounded-2xl bg-red-50 border border-red-200 p-5 flex gap-3">
                                <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-semibold text-red-700">Analysis Failed</p>
                                    <p className="text-sm text-red-600 mt-1">{error}</p>
                                </div>
                            </div>
                        )}

                        {result && (
                            <div className="space-y-4 animate-fade-in">
                                <div className={cn('rounded-2xl p-4 flex items-start gap-3', {
                                    'bg-green-50 border border-green-200': result.status === 'Healthy',
                                    'bg-red-50 border border-red-200': result.status === 'Diseased',
                                    'bg-amber-50 border border-amber-200': result.status === 'Stressed',
                                })}>
                                    {result.status === 'Healthy'
                                        ? <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                                        : <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                                    }
                                    <div>
                                        <h3 className="font-bold text-lg">{result.status}</h3>
                                        {result.plant && <p className="text-sm text-gray-600">Plant: {result.plant}</p>}
                                        {result.disease && <p className="text-sm text-gray-600">Disease: {result.disease}</p>}
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <div className="flex justify-between text-sm font-semibold">
                                        <span className="text-gray-600">Confidence Score</span>
                                        <span className="text-kissan-green">{result.confidence}%</span>
                                    </div>
                                    <Progress value={result.confidence} className="h-2.5" />
                                </div>

                                {result.treatment && (
                                    <div className="bg-kissan-green-pale border border-kissan-green/20 rounded-2xl p-4">
                                        <h4 className="font-bold text-kissan-green-dark mb-2 flex items-center gap-2">
                                            <Leaf className="w-4 h-4" /> Recommended Treatment
                                        </h4>
                                        <p className="text-sm text-gray-700 whitespace-pre-line">{result.treatment}</p>
                                    </div>
                                )}

                                {result.prevention && (
                                    <div className="bg-kissan-sky-pale border border-kissan-sky/20 rounded-2xl p-4">
                                        <h4 className="font-bold text-kissan-sky-dark mb-2">Prevention Tips</h4>
                                        <p className="text-sm text-gray-700 whitespace-pre-line">{result.prevention}</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CropHealth;
