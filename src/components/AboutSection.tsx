import { Paperclip } from "@/components/ui/Paperclip";

export function AboutSection() {
  return (
    <section id="about" className="max-w-6xl mx-auto px-4 py-8">
      <div
        className="group relative notebook-page p-12 text-center shadow-lg"
        style={{
          backgroundImage: `linear-gradient(90deg, transparent 95%, rgba(0,0,0,0.07) 95%),linear-gradient(transparent 95%, rgba(0,0,0,0.07) 95%)`,
          backgroundSize: "20px 20px",
        }}
      >
        <Paperclip />

        <div className="w-28 h-28 rounded-full mx-auto mb-6 flex items-center justify-center text-5xl shadow-xl"
          style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}
        >
          🏔️
        </div>

        <h2 className="font-playfair text-3xl font-bold mb-6">About pahadi तड़का</h2>

        <p className="text-base leading-relaxed max-w-xl mx-auto opacity-85">
          Welcome to my little corner of the internet! I&apos;m a mountain lover, storyteller,
          and someone who believes that the best tales come from the highest peaks.
          This blog is my way of sharing the beauty, culture, and everyday magic
          of life in the pahad. Whether you&apos;re a fellow mountain enthusiast or just
          curious about life up here, I hope you find something that inspires you.
        </p>
      </div>
    </section>
  );
}
