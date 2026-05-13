import { Button } from "@/components/ui/button";
import { Mail, Linkedin, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import portrait from "@/assets/ali-farshad-fard.jpg";

const About = () => {
  return (
    <main className="min-h-screen bg-gradient-to-br from-glacier/50 via-background to-background">
      <div className="container max-w-5xl py-12 md:py-20">
        <Link to="/" className="inline-flex items-center text-sm text-ocean hover:underline mb-8">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to GaiaThinker
        </Link>

        <div className="grid md:grid-cols-[320px_1fr] gap-10 items-start">
          <div className="flex flex-col items-center md:items-start">
            <img
              src={portrait}
              alt="Portrait of Ali Farshad Fard"
              className="w-full max-w-xs rounded-2xl shadow-soft object-cover"
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
              <ul className="space-y-3 text-base">
                <li className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-ocean" />
                  <a href="mailto:ali.reza.farshad.fard@gaialink.ca" className="text-foreground hover:text-ocean transition">
                    ali.reza.farshad.fard@gaialink.ca
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Linkedin className="h-5 w-5 text-ocean" />
                  <a
                    href="https://www.linkedin.com/in/alifarshadfard"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground hover:text-ocean transition"
                  >
                    linkedin.com/in/alifarshadfard
                  </a>
                </li>
              </ul>
            </section>

            <div className="mt-10">
              <Button size="lg" className="bg-ember text-ember-foreground hover:bg-ember/90" asChild>
                <a href="mailto:ali.reza.farshad.fard@gaialink.ca">
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
