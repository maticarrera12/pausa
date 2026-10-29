const img = (id: string, w: number) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

export interface Product {
  id: string;
  cat: 'asientos' | 'mesas' | 'luz';
  finishes: string[];
  name: string;
  price: number;
  img: string;
  alt: string;
  material: string;
  dims: string;
  long: string;
}

export const products: Record<string, Product> = {
  arco: {
    id: 'arco', cat: 'asientos', finishes: ['Roble natural', 'Nogal ahumado', 'Fresno negro'], name: 'Silla Arco', price: 640, img: img('1581539250439-c96689b516dd', 1000),
    alt: 'Silla Arco, una silla escultórica con respaldo curvo',
    material: 'Fresno curvado al vapor, asiento de bouclé de lana', dims: 'An. 48 × Prof. 52 × Alt. 78 cm',
    long: 'El respaldo es una única pieza de madera, curvada al vapor sobre una horma durante seis horas y dejada reposar una semana antes de unirla al asiento.',
  },
  tondo: {
    id: 'tondo', cat: 'mesas', finishes: ['Travertino romano', 'Verde Alpi', 'Caliza gris'], name: 'Mesa auxiliar Tondo', price: 420, img: img('1532372320572-cda25653a26d', 1000),
    alt: 'Mesa auxiliar Tondo, una mesa redonda sobre una única base',
    material: 'Tapa de travertino, base de roble torneado', dims: 'Ø 42 × Alt. 50 cm',
    long: 'Pensada para una taza, un libro y unas gafas. La piedra se corta de un solo bloque, así que cada tapa tiene un veteado ligeramente distinto.',
  },
  ceppo: {
    id: 'ceppo', cat: 'asientos', finishes: ['Fresno natural', 'Tinte verde pino', 'Laca mantequilla'], name: 'Taburete Ceppo', price: 290, img: img('1503602642458-232111445657', 1000),
    alt: 'Taburete Ceppo, un taburete de madera de tres patas',
    material: 'Fresno macizo, ensambles con cuña', dims: 'Ø 34 × Alt. 45 cm',
    long: 'Las tres patas atraviesan el asiento, se acuñan y se rebajan a ras. Se sostiene firme en cualquier suelo y sirve también de macetero o mesita de noche.',
  },
  lume: {
    id: 'lume', cat: 'luz', finishes: ['Acero cepillado', 'Latón bruñido'], name: 'Lámpara Lume', price: 260, img: img('1507473885765-e6ed057f782c', 1000),
    alt: 'Lámpara Lume, una pequeña lámpara de mesa con pantalla de vidrio',
    material: 'Vidrio opal, acero cepillado', dims: 'Ø 22 × Alt. 38 cm',
    long: 'Una pantalla de vidrio soplado a boca sobre un esbelto tallo de acero. Da una luz cálida y pareja que se queda baja en la habitación en lugar de llenarla.',
  },
  piano: {
    id: 'piano', cat: 'mesas', finishes: ['Roble al jabón', 'Roble ahumado'], name: 'Mesa de centro Piano', price: 980, img: img('1533090481720-856c6e3c1fdc', 1200),
    alt: 'Mesa de centro Piano, una mesa baja en una sala soleada',
    material: 'Roble macizo, acabado al jabón', dims: 'An. 120 × Prof. 60 × Alt. 32 cm',
    long: 'Un plano largo y bajo de roble sobre cuatro patas empotradas. Es baja a propósito, para no interrumpir nunca la vista a través de la habitación.',
  },
};

export const formatEur = (n: number) =>
  new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);
