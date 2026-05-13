import { Button } from "@/components/ui/button";
import { Mail, Linkedin, ArrowLeft, CalendarDays } from "lucide-react";
import { Link } from "react-router-dom";
import portrait from "@/assets/ali-farshad-fard.jpg";
import { useEffect } from "react";

const About = () => {
  useEffect(() => {
    const existing = document.getElementById("fillout-script");
    if (!existing) {
      const script = document.createElement("script");
      script.id = "fillout-script";
      script.src = "https://server.fillout.com/embed/v1/";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-glacier/50 via-background to-background">
      <div className="container max-w-5xl py-12 md:py-20">
        <Link to="/" className="inline-flex items-center text-sm text-ocean hover:underline mb-8">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to GaiaThinker
        </Link>

        <div className="grid md:grid-cols-[440px_1fr] gap-12 items-start">
          <div className="flex flex-col items-center md:items-start">
            <img
              src={portrait}
              alt="Portrait of Ali Farshad Fard"
              className="w-full max-w-md rounded-2xl shadow-soft object-cover"
            />
            <p className="mt-4 text-center md:text-left text-base italic text-muted-foreground">
              "Together we can make something great."
            </p>
          </div>

          <div>
            <h1 className="font-bold text-4xl md:text-5xl text-foreground mb-2" style={{ fontFamily: "Fraunces, serif" }}>
              About Ali Farshad Fard
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mt-6">
              Ali Farshad Fard is the creator of GaiaThinker and GaiaLink — combining
              science, design, and education to inspire climate action through
              interactive learning and creative technology.
            </p>

            <section className="mt-10">
              <h2 className="text-2xl font-bold text-foreground mb-4" style={{ fontFamily: "Fraunces, serif" }}>
                Let's Connect
              </h2>

              <Button
                size="lg"
                data-fillout-id="umzMEFUqxSus"
                data-fillout-embed-type="popup"
                data-fillout-dynamic-resize="true"
                data-fillout-inherit-parameters="true"
                data-fillout-popup-size="medium"
                className="text-white hover:opacity-90 transition"
                style={{
                  background: "linear-gradient(135deg, #8b5cf6 0%, #14b8a6 100%)",
                }}
              >
                <CalendarDays className="mr-2 h-4 w-4" /> Book an Appointment
              </Button>

              <p className="mt-3 text-sm text-muted-foreground max-w-md">
                Schedule a free consultation to explore AI solutions for education and sustainability.
              </p>

              <ul className="mt-6 space-y-3 text-base">
                <li className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-ocean" />
                  <a href="mailto:alireza.farshadfard@gmail.com" className="text-foreground hover:text-ocean transition">
                    alireza.farshadfard@gmail.com
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Linkedin className="h-5 w-5 text-ocean" />
                  <a
                    href="https://www.linkedin.com/in/a-farshadfard/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground hover:text-ocean transition"
                  >
                    linkedin.com/in/a-farshadfard
                  </a>
                </li>
              </ul>
            </section>

            <div className="mt-10">
              <Button size="lg" className="bg-ember text-ember-foreground hover:bg-ember/90" asChild>
                <a href="mailto:alireza.farshadfard@gmail.com">
                  <Mail className="mr-2 h-4 w-4" /> Get in Touch
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default About;
