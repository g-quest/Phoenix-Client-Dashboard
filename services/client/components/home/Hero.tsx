import Section from '@/components/ui/Section'

export default function Hero() {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Video Background */}
      <video
        src="/videos/hero.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        Your browser does not support the video tag.
      </video>

      {/* Overlay Content */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-4 text-center">
        <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold drop-shadow-lg">
          Big Ideas, Little Minds
        </h1>
        <p className="text-gray-200 text-lg md:text-2xl max-w-3xl pt-4 drop-shadow-md">
          SeedLit transforms timeless lessons into imaginative, age-appropriate
          narratives, sparking curiosity, resilience, and creativity in
          children.
        </p>
      </div>

      {/* Optional Overlay for Text Contrast */}
      <div className="absolute inset-0 bg-black bg-opacity-40 z-5"></div>
    </div>
  )
}
