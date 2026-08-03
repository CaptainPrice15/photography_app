"use client";

import { motion } from "motion/react";
import { Camera, Award, MapPin, Mail } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
            <Camera className="h-16 w-16 text-muted-foreground" />
          </div>
          <h1 className="text-4xl font-bold mb-4">About the Photographer</h1>
          <p className="text-muted-foreground text-lg">
            Capturing the world one frame at a time
          </p>
        </div>

        {/* Bio */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-4">Biography</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              With over a decade of experience in photography, I specialize in landscape,
              portrait, and street photography. My work has been featured in numerous
              exhibitions and publications worldwide.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              My passion lies in capturing the raw beauty of everyday moments and the
              extraordinary details that often go unnoticed. Through my lens, I aim to
              tell stories that resonate with viewers and inspire them to see the world
              from a different perspective.
            </p>
          </CardContent>
        </Card>

        {/* Achievements */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <Award className="h-8 w-8 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Awards</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• International Photography Awards 2024</li>
                <li>• National Geographic Contest Finalist</li>
                <li>• Sony World Photography Awards</li>
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <Camera className="h-8 w-8 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Equipment</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Sony A7R V</li>
                <li>• Canon EOS R5</li>
                <li>• Various professional lenses</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Contact */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-bold mb-4">Get in Touch</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Mail className="h-5 w-5" />
                <span>contact@photoexhibit.com</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <MapPin className="h-5 w-5" />
                <span>Available worldwide for commissions</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
