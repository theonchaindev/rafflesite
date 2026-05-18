export interface Competition {
  id: string;
  title: string;
  slug: string;
  description: string;
  prizeValue: number;
  ticketPrice: number;
  maxTickets: number;
  ticketsSold: number;
  drawDate: string;
  status: "active" | "ended" | "drawn";
  imageUrl: string | null;
  images?: string[];
  maxPerOrder: number;
}

export interface Winner {
  id: string;
  winnerName: string;
  competitionTitle: string;
  prizeValue: number;
  imageUrl: string | null;
  announcedAt: string;
}

const competitions: Competition[] = [
  {
    id: "comp-bmw-m3",
    title: "BMW M3 Competition 2024",
    slug: "bmw-m3-competition-2024",
    description:
      "Win this stunning BMW M3 Competition in Brooklyn Grey. With 510bhp, 0-62 in 3.9 seconds and the most aggressive M-specific design yet, this is the ultimate driving machine. Fully loaded with M Carbon exterior pack, HK sound system, and M Driver's Package. Delivered to your door.",
    prizeValue: 74995,
    ticketPrice: 2.99,
    maxTickets: 5000,
    ticketsSold: 3241,
    drawDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: "active",
    imageUrl:
      "https://images.unsplash.com/photo-1617531653332-bd46c16f4d68?w=800&q=80",
    maxPerOrder: 100,
  },
  {
    id: "comp-rolex",
    title: "Rolex Submariner Date",
    slug: "rolex-submariner-date",
    description:
      "Win the iconic Rolex Submariner Date in Oystersteel and yellow gold with a Black dial and Oyster bracelet. Reference 126613LN. New, unworn, with full box and papers. Collected directly from an authorised Rolex dealer.",
    prizeValue: 14500,
    ticketPrice: 1.99,
    maxTickets: 3000,
    ticketsSold: 1876,
    drawDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    status: "active",
    imageUrl:
      "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=800&q=80",
    maxPerOrder: 50,
  },
  {
    id: "comp-maldives",
    title: "Maldives Luxury Escape for Two",
    slug: "maldives-luxury-escape",
    description:
      "5 nights at an overwater villa in the Maldives for two people. Includes return flights from any UK airport, private speedboat transfer, half board and a couples spa treatment. Hotel value up to £8,500. Valid for 18 months from draw date.",
    prizeValue: 8500,
    ticketPrice: 0.99,
    maxTickets: 2500,
    ticketsSold: 892,
    drawDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
    status: "active",
    imageUrl:
      "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800&q=80",
    maxPerOrder: 50,
  },
  {
    id: "comp-cash-10k",
    title: "£10,000 Cash Prize",
    slug: "10000-cash-prize",
    description:
      "Win £10,000 cash, paid directly into your bank account within 24 hours of the draw. No strings attached — spend it however you want. Whether it's a deposit on a home, a dream holiday, clearing debt, or splashing out on something special.",
    prizeValue: 10000,
    ticketPrice: 1.49,
    maxTickets: 4000,
    ticketsSold: 2104,
    drawDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: "active",
    imageUrl:
      "https://images.unsplash.com/photo-1618044733300-9472054094ee?w=800&q=80",
    maxPerOrder: 100,
  },
  {
    id: "comp-ps5",
    title: "PlayStation 5 Pro Bundle",
    slug: "ps5-pro-bundle",
    description:
      "Win a PlayStation 5 Pro console bundle including 3 top titles, DualSense controller, DualSense charging station, and 12 months of PlayStation Plus Extra. Everything you need to play from day one.",
    prizeValue: 799,
    ticketPrice: 0.49,
    maxTickets: 1000,
    ticketsSold: 643,
    drawDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: "active",
    imageUrl:
      "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800&q=80",
    maxPerOrder: 25,
  },
  {
    id: "comp-macbook",
    title: "MacBook Pro M4 Max",
    slug: "macbook-pro-m4-max",
    description:
      "Win the brand-new MacBook Pro 16-inch with M4 Max chip, 64GB unified memory, and 1TB SSD in Space Black. The most powerful MacBook ever built. Includes AppleCare+ for 3 years. Worth over £4,000.",
    prizeValue: 4099,
    ticketPrice: 1.49,
    maxTickets: 2000,
    ticketsSold: 1102,
    drawDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    status: "active",
    imageUrl:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80",
    maxPerOrder: 50,
  },
];

export const winners: Winner[] = [
  {
    id: "w1",
    winnerName: "Sarah T.",
    competitionTitle: "Range Rover Sport HSE",
    prizeValue: 82000,
    imageUrl:
      "https://images.unsplash.com/photo-1565099824688-e93eb20fe622?w=400&q=80",
    announcedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "w2",
    winnerName: "James M.",
    competitionTitle: "£50,000 Cash Prize",
    prizeValue: 50000,
    imageUrl:
      "https://images.unsplash.com/photo-1618044733300-9472054094ee?w=400&q=80",
    announcedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "w3",
    winnerName: "Emma K.",
    competitionTitle: "Caribbean Cruise for Two",
    prizeValue: 12000,
    imageUrl:
      "https://images.unsplash.com/photo-1548574505-5e239809ee19?w=400&q=80",
    announcedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export function getCompetitions(): Competition[] {
  return competitions.filter((c) => c.status === "active");
}

export function getCompetitionBySlug(slug: string): Competition | null {
  return competitions.find((c) => c.slug === slug && c.status === "active") ?? null;
}

export function getCompetitionById(id: string): Competition | null {
  return competitions.find((c) => c.id === id) ?? null;
}

export function getWinners(): Winner[] {
  return winners;
}
