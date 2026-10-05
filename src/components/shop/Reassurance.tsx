import { Hand, Package, MapPin, Gift } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const pictos = [
  [Hand, "Cousu et peint à la main à Grémonville, Normandie"],
  [Package, "Expédié sous 48 h, ou sous 8 jours si c'est à votre nom"],
  [MapPin, "Livraison offerte en point relais dès 39 €"],
  [Gift, "Emballage cadeau et petit mot écrit à la main, offerts"],
] as const;

export function Pictos() {
  return (
    <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
      {pictos.map(([I, t]) => (
        <div key={t} className="flex flex-col items-center gap-2 text-center">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-sage-soft text-sage"><I className="h-7 w-7" /></span>
          <p className="text-[0.95rem]">{t}</p>
        </div>
      ))}
    </div>
  );
}

export const faq: [string, string][] = [
  ["Le texte est-il brodé ou imprimé ?", "Ni l'un ni l'autre. Il est peint à la main, au pochoir, à la peinture textile, puis fixé à chaud. C'est ce qui lui donne ce grain, et c'est pour ça qu'il n'y en a pas deux pareils."],
  ["Est-ce que la peinture tient ?", "Oui. Fixée à chaud, elle résiste aux années, aux enfants et aux chiens. Elle n'aime que la machine à laver : un coup d'éponge humide suffit."],
  ["Combien de lettres je peux mettre ?", "Jusqu'à trois lignes de 13 caractères, espaces compris. Le configurateur vous le montre en direct."],
  ["C'est quoi, le feston ?", "Le point cousu à la main qui borde le haut du panier. Vous choisissez sa couleur, comme celle du texte et des motifs de l'anse."],
  ["Je peux choisir la police ?", "Non : une seule police de pochoir, celle de l'atelier. C'est elle qui fait qu'on reconnaît un panier Grenouille Rouge."],
  ["Je peux écrire ce que je veux ?", "Prénoms, surnoms, phrases, blagues, noms de chien : oui. En majuscules, accents compris. On respecte votre orthographe."],
  ["Le panier tient-il debout ?", "Oui, même vide. La toile est doublée et surpiquée : il garde sa forme."],
  ["D'où vient la jute ?", "Du Tissage du Ronchay, à Luneray, le dernier tissage de jute de France, à vingt minutes de l'atelier."],
  ["Et le cuir ?", "Un cuir français au tannage végétal, sans chrome. Il se patine, il vit avec vous."],
  ["Est-ce que je peux venir à l'atelier ?", "Sur rendez-vous, pour retirer une commande. Et deux fois par an, on ouvre grand les portes pour les « trésors de l'atelier » : suivez-nous sur Instagram pour la date."],
  ["Vous faites des commandes pour les entreprises et les boutiques ?", "Oui, en série, à votre nom ou à votre logo. Rendez-vous sur l'Espace pro."],
];

export function Faq() {
  return (
    <Accordion type="single" collapsible className="rounded-2xl border bg-card px-4">
      {faq.map(([q, a]) => (
        <AccordionItem key={q} value={q}>
          <AccordionTrigger className="text-left text-base font-semibold">{q}</AccordionTrigger>
          <AccordionContent className="text-base">{a}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
