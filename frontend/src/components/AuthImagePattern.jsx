const AuthImagePattern = ({ title, subtitle }) => {
    return (
        <div className="hidden lg:flex items-center justify-center bg-gradient-to-br from-base-200 to-base-300 p-12 relative overflow-hidden">

            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-10 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            <div className="max-w-md text-center relative z-10 glass rounded-3xl p-8 border border-white/20 shadow-xl">
                <div className="grid grid-cols-3 gap-3 mb-8">
                    {[...Array(9)].map((_, i) => (
                        <div
                            key={i}
                            className={`aspect-square rounded-2xl bg-base-100/50 backdrop-blur-sm border border-white/10 shadow-inner ${i % 2 === 0 ? "animate-bounce" : "animate-pulse"
                                }`}
                            style={{ animationDuration: `${i % 2 === 0 ? '3s' : '4s'}`, animationDelay: `${i * 0.2}s` }}
                        />
                    ))}
                </div>
                <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    {title}
                </h2>
                <p className="text-base-content/80 text-lg leading-relaxed">{subtitle}</p>
            </div>
        </div>
    );
};

export default AuthImagePattern;
