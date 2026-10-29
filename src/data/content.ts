export const filters = [
  { key: 'todo', label: 'Todo' },
  { key: 'asientos', label: 'Asientos' },
  { key: 'mesas', label: 'Mesas' },
  { key: 'luz', label: 'Iluminación' },
] as const;

export interface Article {
  id: string;
  title: string;
  meta: string;
  author: string;
  img: string;
  alt: string;
  body: string[];
}

const img = (id: string, w: number) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

export const articles: Record<string, Article> = {
  proporcion: {
    id: 'proporcion', title: 'La belleza de un objeto bien proporcionado.',
    meta: 'Ensayo · 8 min de lectura · Octubre 2026', author: 'Giulia Ferrante',
    img: img('1524758631624-e2822e304c36', 1400), alt: 'Un interior luminoso con una mesa y sillas de madera',
    body: [
      'El primer prototipo de la Arco era dos centímetros más alto en el respaldo. Nadie que se sentó en él supo decir qué fallaba, solo que se levantaban antes de lo que pretendían.',
      'La proporción rara vez se nota cuando es correcta. Funciona como funciona una buena habitación: dejas de pensar en ella. Cuando está mal, el cuerpo lo sabe antes que el ojo.',
      'Ahora construimos cada pieza tres veces a tamaño real antes de dibujarla bien: una en cartón, otra en pino y otra en el material definitivo. La mayoría de los cambios ocurren entre la primera y la segunda.',
      'Lo que buscamos no es elegancia sino comodidad: el punto en que una silla deja de pedir atención y simplemente te deja quedarte.',
    ],
  },
  uniones: {
    id: 'uniones', title: 'Madera, metal y el espacio entre ambos.',
    meta: 'Taller · 5 min de lectura · Septiembre 2026', author: 'Marco Villa',
    img: img('1538688525198-9b88f6f53126', 1200), alt: 'Una silla junto a una ventana en una habitación serena',
    body: [
      'La madera se mueve. Se hincha en agosto y se contrae en enero, y cualquier unión que lo ignore fallará en menos de diez años.',
      'En la Lámpara Lume, el tallo de acero se une a un pie de roble con una holgura de dos milímetros, rellena con un collar de fieltro. Parece un detalle. Es la razón por la que la base nunca se partirá.',
      'Nos gustan las uniones que se ven. Una cuña clavada a través de un asiento, un tornillo a la vista: cuentan cómo se sostiene el objeto y cómo podría desmontarse de nuevo.',
    ],
  },
  quedarse: {
    id: 'quedarse', title: 'Por qué algunos objetos se quedan con nosotros.',
    meta: 'Conversación · 12 min de lectura · Agosto 2026', author: 'Elena Bassi',
    img: img('1519710164239-da123dc03ef4', 1200), alt: 'Un dormitorio con luz suave y texturas naturales',
    body: [
      'Preguntamos a doce personas cuál era el mueble que más tiempo habían tenido y por qué había sobrevivido a todas las mudanzas.',
      'Casi nadie mencionó la belleza primero. Hablaron de un taburete que cabía en cualquier coche, de una mesa lijada dos veces, de una silla que fue de una abuela y todavía no cojea.',
      'Los objetos que se quedan son los que pueden absorber una vida —rayones, marcas, reparaciones— y parecerse más a sí mismos después. Ese es el encargo que nos damos.',
    ],
  },
};
export const articleOrder = ['proporcion', 'uniones', 'quedarse'];

export interface Info { title: string; items: { h: string; t: string }[] }

export const info: Record<string, Info> = {
  entrega: { title: 'Entrega y devoluciones', items: [
    { h: 'Hecho por encargo', t: 'Cada objeto se fabrica después de tu pedido. La mayoría de las piezas salen del taller en cuatro a seis semanas.' },
    { h: 'Entrega con guantes blancos', t: 'Gratis en toda Italia, 90 € al resto de la UE. Dos personas lo suben, lo desembalan y se llevan el embalaje.' },
    { h: 'Treinta días para decidir', t: 'Si un objeto no encaja en tu casa, lo recogemos en treinta días y te devolvemos el precio completo.' },
  ] },
  cuidados: { title: 'Guía de cuidados', items: [
    { h: 'Madera aceitada', t: 'Pasa un paño húmedo. Una vez al año, aplica una capa fina del aceite-cera que incluye cada pieza.' },
    { h: 'Travertino y piedra', t: 'Usa posavasos para el vino y los cítricos. Lava con jabón de pH neutro; nunca con limpiadores a base de vinagre.' },
    { h: 'Bouclé', t: 'Aspira con suavidad y baja potencia. Las fundas se pueden retirar y devolvernos para una limpieza profesional.' },
    { h: 'Reparaciones', t: 'Envíanos una foto. La mayoría de las reparaciones se hacen en el taller de origen, a precio de coste, mientras el objeto exista.' },
  ] },
  muestras: { title: 'Muestras de materiales', items: [
    { h: 'Gratis, hasta cinco', t: 'Pequeñas piezas cortadas de madera, piedra, tela y metal, enviadas en una caja de cartón plegada en tres días hábiles.' },
    { h: 'Verlo no basta', t: 'Sostenlas bajo la luz de la habitación donde vivirá el objeto, a la hora del día en que más lo usarás.' },
    { h: 'Cómo pedirlas', t: 'Escribe al estudio con tu dirección y los acabados que estás considerando.' },
  ] },
  profesionales: { title: 'Para arquitectos y diseñadores', items: [
    { h: 'Precio profesional', t: 'Los estudios registrados reciben un 20 % de descuento sobre el precio de lista y un contacto dedicado en el estudio de Milán.' },
    { h: 'Medidas a medida', t: 'Las mesas y estanterías pueden hacerse a medida. Hay planos y archivos 3D de cada objeto.' },
    { h: 'Préstamo para proyectos', t: 'Las piezas pueden prestarse para sesiones de fotos y presentaciones a clientes dentro de Italia.' },
  ] },
};
