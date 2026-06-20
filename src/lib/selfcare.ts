import data from "@/data/selfcare.json";
import type { SelfCare } from "./types";

const items = data as SelfCare[];

export const getAllSelfCare = (): SelfCare[] => items;

export const getSelfCareBySlug = (slug: string): SelfCare | undefined =>
  items.find((item) => item.slug === slug);

export const getSelfCareBySymptom = (symptom: string): SelfCare[] =>
  items.filter((item) => item.symptoms.includes(symptom));

export const getSelfCareByPart = (part: string): SelfCare[] =>
  items.filter((item) => item.parts.includes(part));

export const getPopular = (limit = 5): SelfCare[] =>
  [...items]
    .sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0))
    .slice(0, limit);

export const getAllSlugs = (): string[] => items.map((item) => item.slug);
