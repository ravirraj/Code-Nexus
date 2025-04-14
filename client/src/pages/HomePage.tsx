import FormComponent from "@/components/forms/FormComponent"
import { Code2, Users, Zap, Share2, Sparkles } from "lucide-react"
// import Footer from "@/components/common/Footer";

function HomePage() {
    return (
        <div className="min-h-screen bg-slate-900">
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.1),transparent_50%)]" />
                </div>
                <div className="container relative mx-auto min-h-screen px-4 py-8 sm:py-16">
                    <div className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center gap-8 md:gap-12 lg:flex-row">
                        {/* Left side - Text content */}
                        <div className="flex-1 text-center lg:text-left">
                            <div className="mb-4 sm:mb-6 inline-flex items-center gap-2 rounded-full bg-indigo-500/10 px-3 py-1 text-xs sm:text-sm text-indigo-400">
                                <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
                                Real-time Collaborative Development
                            </div>
                            <h1 className="mb-4 sm:mb-6 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white">
                                Where Code{" "}
                                <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                                    Converges
                                </span>
                            </h1>
                            <p className="mb-6 sm:mb-8 text-base sm:text-lg text-slate-300">
                                Experience the future of collaborative coding with CodeWithUs.
                                Connect, create, and code together in perfect harmony.
                            </p>
                        </div>

                        {/* Right side - Form */}
                        <div className="flex-1 w-full max-w-md">
                            <FormComponent />
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="container mx-auto px-4 py-8 sm:py-16">
                <div className="mb-8 sm:mb-12 text-center">
                    <h2 className="mb-2 sm:mb-4 text-2xl sm:text-3xl font-bold text-white">
                        Why Choose CodeWithUs?
                    </h2>
                    <p className="text-sm sm:text-base text-slate-400">
                        Your central hub for seamless collaborative development
                    </p>
                </div>
                <div className="grid gap-4 sm:gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                    <FeatureCard
                        icon={<Code2 className="h-6 w-6 sm:h-8 sm:w-8 text-indigo-400" />}
                        title="Real-time Collaboration"
                        description="Code together in real-time with instant updates and synchronization across all users."
                    />
                    <FeatureCard
                        icon={<Users className="h-6 w-6 sm:h-8 sm:w-8 text-indigo-400" />}
                        title="User Presence"
                        description="See who's online and what they're working on with real-time presence indicators."
                    />
                    <FeatureCard
                        icon={<Zap className="h-6 w-6 sm:h-8 sm:w-8 text-indigo-400" />}
                        title="Code Execution"
                        description="Run code directly in the editor with instant feedback and results."
                    />
                    <FeatureCard
                        icon={<Share2 className="h-6 w-6 sm:h-8 sm:w-8 text-indigo-400" />}
                        title="File Sharing"
                        description="Easily share and manage files with your team in real-time."
                    />
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-slate-800/50">
                <div className="container mx-auto px-4 py-8 sm:py-16">
                    <div className="flex flex-col items-center justify-center text-center">
                        <h2 className="mb-2 sm:mb-4 text-2xl sm:text-3xl font-bold text-white">
                            Ready to Join the CodeWithUs?
                        </h2>
                        <p className="mb-6 sm:mb-8 text-base sm:text-lg text-slate-300">
                            Join thousands of developers who are already building the future together.
                        </p>
                        <div className="w-full max-w-md">
                            <FormComponent />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
    return (
        <div className="card group">
            <div className="mb-3 sm:mb-4 inline-block rounded-lg bg-slate-700/50 p-2 sm:p-3 transition-colors group-hover:bg-indigo-500/20">
                {icon}
            </div>
            <h3 className="mb-1 sm:mb-2 text-lg sm:text-xl font-semibold text-white">{title}</h3>
            <p className="text-sm sm:text-base text-slate-400">{description}</p>
        </div>
    )
}

export default HomePage
