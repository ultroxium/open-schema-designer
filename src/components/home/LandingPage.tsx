'use client';

import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { useRouter } from 'next/navigation';
import { ArrowRight, Database, Github, Play, Star } from 'lucide-react';
import Image from 'next/image';

export function LandingPage() {
    const router = useRouter();
    const { state, initializeSampleSchemas, loadSchemas } = useApp();

    const handleGetStarted = () => {
        // Load existing schemas first
        loadSchemas();
        
        // Initialize samples only if none exist
        initializeSampleSchemas();
        
        // Navigate to designs page
        router.push('/my-designs');
    };

    return (
        <div className="min-h-screen bg-gray-50 overflow-auto relative">
            {/* Animated Gradient Bubbles Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Top left bubble */}
                <div className="absolute -top-32 -left-32 w-80 h-80 bg-gradient-to-br from-blue-300 via-purple-300 to-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob"></div>
                
                {/* Top right bubble */}
                <div className="absolute -top-32 -right-32 w-80 h-80 bg-gradient-to-bl from-rose-300 via-pink-300 to-orange-400 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob-reverse animation-delay-2000"></div>
                
                {/* Large backdrop bubble behind hero image */}
                <div className="absolute top-72 left-1/2 transform -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-r from-indigo-300 via-blue-200 to-cyan-300 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-float animation-delay-4000"></div>
                
                {/* Small accent bubble */}
                <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-gradient-to-tl from-emerald-300 to-teal-400 rounded-full mix-blend-multiply filter blur-xl opacity-45 animate-blob animation-delay-6000"></div>
            </div>
            
            {/* Floating Top Bar */}
            <div className="fixed max-w-7xl mx-auto top-4 left-0 right-0 z-50">
                <div className="bg-white/90 backdrop-blur-sm rounded-lg border border-gray-200 px-6 py-3 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <h1 className="text-lg font-semibold text-gray-900">Open Schema Designer</h1>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open('https://github.com/ultroxium/open-schema-designer', '_blank')}
                        className="flex items-center space-x-2"
                    >
                        <Star className="h-4 w-4" />
                        <span>Star on GitHub</span>
                    </Button>
                </div>
            </div>

            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Hero Text */}
                <div className="text-center pt-44 pb-12">
                    <h1 className="text-4xl tracking-tight font-bold text-gray-900 sm:text-5xl md:text-6xl">
                        Design Database Schemas Visually
                    </h1>
                    <p className="mt-6 max-w-3xl mx-auto text-lg text-gray-600">
                        Create, visualize, and export database schemas with our powerful browser-based designer.
                        100% client-side processing means your data never leaves your browser.
                    </p>
                    
                    {/* Feature highlights */}
                    <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-2 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span>100% Client-Side</span>
                        </div>
                        <div className="flex items-center space-x-2 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span>No Data Leaks</span>
                        </div>
                        <div className="flex items-center space-x-2 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            <span>Different Export Formats</span>
                        </div>
                        <div className="flex items-center space-x-2 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2">
                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                            <span>No Signup Required</span>
                        </div>
                    </div>
                    <div className="mt-8 flex justify-center space-x-4">
                        <Button
                            size="lg"
                            onClick={handleGetStarted}
                            className="px-8 py-3 text-base font-medium"
                        >
                            Get Started Free
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </div>
                </div>

                {/* Central Large Image */}
                <div className="flex justify-center pb-16">
                    <div className="w-full max-w-7xl border-5 rounded-xl">
                        <div className="bg-white rounded-lg">
                            <div className="aspect-video rounded-lg flex items-center justify-center relative overflow-hidden">
                                <Image
                                    src="/image.png"
                                    alt="Hero"
                                    fill
                                    className="object-contain" // or object-cover if you want cropping
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-16 bg-white/50 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Everything you need to design database schemas
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Professional-grade features with privacy-first design. All processing happens in your browser.
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="text-center p-6 rounded-lg bg-white/80 backdrop-blur-sm border border-gray-200">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <Database className="h-6 w-6 text-blue-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Visual Schema Design</h3>
                            <p className="text-gray-600 text-sm">
                                Drag-and-drop interface with real-time visualization. Create tables, fields, and relationships visually.
                            </p>
                        </div>
                        
                        <div className="text-center p-6 rounded-lg bg-white/80 backdrop-blur-sm border border-gray-200">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <ArrowRight className="h-6 w-6 text-green-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Multi-Database Export</h3>
                            <p className="text-gray-600 text-sm">
                                Export to PostgreSQL, MySQL, Prisma and JSON formats.
                            </p>
                        </div>
                        
                        <div className="text-center p-6 rounded-lg bg-white/80 backdrop-blur-sm border border-gray-200">
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <Star className="h-6 w-6 text-purple-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Privacy First</h3>
                            <p className="text-gray-600 text-sm">
                                100% client-side processing. Your schemas never leave your browser. No servers, no data leaks.
                            </p>
                        </div>
                        
                        <div className="text-center p-6 rounded-lg bg-white/80 backdrop-blur-sm border border-gray-200">
                            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <Play className="h-6 w-6 text-orange-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Instant Start</h3>
                            <p className="text-gray-600 text-sm">
                                No signup required. Start designing immediately with sample schemas or create from scratch.
                            </p>
                        </div>
                        
                        <div className="text-center p-6 rounded-lg bg-white/80 backdrop-blur-sm border border-gray-200">
                            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <Github className="h-6 w-6 text-red-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Open Source</h3>
                            <p className="text-gray-600 text-sm">
                                Fully open source project. Contribute, customize, and extend to fit your needs.
                            </p>
                        </div>
                        
                        <div className="text-center p-6 rounded-lg bg-white/80 backdrop-blur-sm border border-gray-200">
                            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <ArrowRight className="h-6 w-6 text-indigo-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Advanced Features</h3>
                            <p className="text-gray-600 text-sm">
                                Field constraints, relationship management, import/export, and URL-based sharing.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gray-50 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        Ready to design your database schema?
                    </h2>
                    <p className="text-lg text-gray-600 mb-2">
                        Start designing immediately with our privacy-first, browser-based tool.
                    </p>
                    <p className="text-sm text-gray-500 mb-8">
                        ✓ No signup required  ✓ No data collection  ✓ Everything saved in your browser
                    </p>
                    <div className="flex justify-center space-x-4">
                        <Button
                            onClick={handleGetStarted}
                            size="lg"
                            className="px-8 py-3 text-base font-medium"
                        >
                            Start Designing Free
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            className="px-8 py-3 text-base font-medium"
                            onClick={() => window.open('https://github.com/ultroxium/open-schema-designer', '_blank')}
                        >
                            <Github className="mr-2 h-5 w-5" />
                            View on GitHub
                        </Button>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p className="text-gray-500">© 2025 All rights reserved by Ultroxium</p>
                </div>
            </footer>
        </div >
    );
}
