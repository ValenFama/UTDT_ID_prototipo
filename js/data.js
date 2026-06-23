const MONTHS = [
  { name:'Ene', count:38, colors:['#2C3E6B','#4A6FA5','#8BA8C8'], mood:'Invierno tranquilo' },
  { name:'Feb', count:22, colors:['#6B3A2C','#A5654A','#C89B8B'], mood:'Momentos íntimos' },
  { name:'Mar', count:51, colors:['#6B5B2C','#A58B4A','#C8B87A'], mood:'Primeras salidas' },
  { name:'Abr', count:44, colors:['#2C5A3A','#4A9060','#8AC8A0'], mood:'Vida nueva' },
  { name:'May', count:67, colors:['#5B2C6B','#8A4AA5','#B88AC8'], mood:'Reuniones y festejos' },
  { name:'Jun', count:29, colors:['#6B4A2C','#A57A4A','#C8B08A'], mood:'Verano temprano' },
  { name:'Jul', count:83, colors:['#2C6B3A','#4AA560','#8AC880'], mood:'Al aire libre' },
  { name:'Ago', count:55, colors:['#2C4A6B','#4A7AA5','#8AB0C8'], mood:'Viajes y aventuras' },
  { name:'Sep', count:41, colors:['#6B3A3A','#A55A5A','#C89090'], mood:'Nostalgia dorada' },
  { name:'Oct', count:36, colors:['#5A4A2C','#8A7A4A','#C8B880'], mood:'Colores de otoño' },
  { name:'Nov', count:28, colors:['#3A3A5A','#5A5A8A','#9090B8'], mood:'Tardecitas quietas' },
  { name:'Dic', count:72, colors:['#2C3A5B','#4A5A8B','#8A9AC0'], mood:'Fin de año en familia' },
];

// ── Mercado ───────────────────────────────────────────────────────────────────
const MARKET_CATEGORIES = [
  { id: 'infancia',      name: 'Infancia',         emoji: '🧸', gradient: ['#FF9A9E','#FECFEF'] },
  { id: 'familia',       name: 'Familia',           emoji: '🏡', gradient: ['#A1C4FD','#C2E9FB'] },
  { id: 'viajes',        name: 'Viajes',            emoji: '✈️', gradient: ['#84FAB0','#8FD3F4'] },
  { id: 'celebraciones', name: 'Celebraciones',     emoji: '🎉', gradient: ['#F6D365','#FDA085'] },
  { id: 'primeras',      name: 'Primeras veces',    emoji: '⭐', gradient: ['#FBC2EB','#A18CD1'] },
  { id: 'naturaleza',    name: 'Naturaleza',        emoji: '🌿', gradient: ['#43E97B','#38F9D7'] },
  { id: 'momentos',      name: 'Momentos únicos',   emoji: '✨', gradient: ['#4FACFE','#00F2FE'] },
  { id: 'emociones',     name: 'Emociones',         emoji: '💙', gradient: ['#667EEA','#764BA2'] },
];

const MARKET_ITEMS = {
  infancia: [
    { id: 'inf1', title: 'Primer día de jardín',     subtitle: 'Recuerdo emocional',   price: '2.99', emoji: '🎒' },
    { id: 'inf2', title: 'La bici sin rueditas',     subtitle: 'Momento de logro',     price: '1.99', emoji: '🚲' },
    { id: 'inf3', title: 'Cumpleaños de 5 años',     subtitle: 'Festejo familiar',     price: '3.49', emoji: '🎂' },
    { id: 'inf4', title: 'Verano en la pileta',      subtitle: 'Recuerdo de verano',   price: '1.49', emoji: '🏊' },
  ],
  familia: [
    { id: 'fam1', title: 'Reunión de fin de año',    subtitle: 'Momento familiar',     price: '4.99', emoji: '🥂' },
    { id: 'fam2', title: 'Domingo en el campo',      subtitle: 'Tarde tranquila',      price: '2.49', emoji: '🌾' },
    { id: 'fam3', title: 'Llegada del primer nieto', subtitle: 'Momento especial',     price: '5.99', emoji: '👶' },
    { id: 'fam4', title: 'El asado del domingo',     subtitle: 'Recuerdo de hogar',    price: '3.99', emoji: '🔥' },
  ],
  viajes: [
    { id: 'via1', title: 'Primera vez en el mar',    subtitle: 'Recuerdo de viaje',    price: '3.49', emoji: '🌊' },
    { id: 'via2', title: 'Ruta por la montaña',      subtitle: 'Aventura familiar',    price: '2.99', emoji: '⛰️' },
    { id: 'via3', title: 'Ciudad de noche',          subtitle: 'Exploración urbana',   price: '1.99', emoji: '🌃' },
    { id: 'via4', title: 'Noche de camping',         subtitle: 'Bajo las estrellas',   price: '4.49', emoji: '⛺' },
  ],
  celebraciones: [
    { id: 'cel1', title: 'Boda en familia',          subtitle: 'Festejo emotivo',      price: '5.49', emoji: '💍' },
    { id: 'cel2', title: 'Graduación universitaria', subtitle: 'Logro personal',       price: '4.99', emoji: '🎓' },
    { id: 'cel3', title: 'Nochebuena juntos',        subtitle: 'Festejo navideño',     price: '3.99', emoji: '🎄' },
    { id: 'cel4', title: 'Quince de hermana',        subtitle: 'Festejo especial',     price: '4.49', emoji: '💃' },
  ],
  primeras: [
    { id: 'pri1', title: 'Primera palabra',          subtitle: 'Hito de vida',         price: '6.99', emoji: '🗣️' },
    { id: 'pri2', title: 'Primer trabajo',           subtitle: 'Logro personal',       price: '3.99', emoji: '💼' },
    { id: 'pri3', title: 'Primera mascota',          subtitle: 'Compañía especial',    price: '2.99', emoji: '🐶' },
    { id: 'pri4', title: 'Primera vez en avión',     subtitle: 'Recuerdo de viaje',    price: '3.49', emoji: '🛫' },
  ],
  naturaleza: [
    { id: 'nat1', title: 'Amanecer en el bosque',   subtitle: 'Paisaje natural',      price: '2.49', emoji: '🌅' },
    { id: 'nat2', title: 'Tormenta eléctrica',       subtitle: 'Fenómeno natural',     price: '1.99', emoji: '⛈️' },
    { id: 'nat3', title: 'Jardín en primavera',      subtitle: 'Momento sereno',       price: '1.49', emoji: '🌸' },
    { id: 'nat4', title: 'Luna llena de invierno',   subtitle: 'Noche especial',       price: '2.99', emoji: '🌕' },
  ],
  momentos: [
    { id: 'mom1', title: 'El último abrazo',         subtitle: 'Momento irrepetible',  price: '9.99', emoji: '🤗' },
    { id: 'mom2', title: 'Un día perfecto',          subtitle: 'Recuerdo dorado',      price: '7.99', emoji: '✨' },
    { id: 'mom3', title: 'Encuentro inesperado',     subtitle: 'Coincidencia mágica',  price: '5.99', emoji: '🌟' },
    { id: 'mom4', title: 'Instante de paz total',    subtitle: 'Momento de calma',     price: '4.99', emoji: '🕊️' },
  ],
  emociones: [
    { id: 'emo1', title: 'Nostalgia de infancia',   subtitle: 'Emoción recordada',    price: '3.99', emoji: '💭' },
    { id: 'emo2', title: 'Alegría pura',             subtitle: 'Emoción positiva',     price: '2.99', emoji: '😄' },
    { id: 'emo3', title: 'Amor de familia',          subtitle: 'Emoción profunda',     price: '4.49', emoji: '❤️' },
    { id: 'emo4', title: 'Orgullo personal',         subtitle: 'Logro emocional',      price: '3.49', emoji: '🏆' },
  ],
};

// Fotos vista Días — solo ggg.png es seleccionable
const PHOTOS = [
  { file: 'img/photo01.jpeg', date: '2 Jun',  selectable: false },
  { file: 'img/photo02.jpeg', date: '4 Jun',  selectable: false },
  { file: 'img/photo03.jpeg', date: '5 Jun',  selectable: false },
  { file: 'img/photo04.jpeg', date: '7 Jun',  selectable: false },
  { file: 'img/photo05.jpeg', date: '8 Jun',  selectable: false },
  { file: 'img/photo06.png',  date: '10 Jun', selectable: false },
  { file: 'img/photo07.png',  date: '11 Jun', selectable: false },
  { file: 'img/photo08.png',  date: '12 Jun', selectable: false },
  { file: 'img/photo09.png',  date: '14 Jun', selectable: false },
  { file: 'img/photo10.png',  date: '15 Jun', selectable: false },
  { file: 'img/photo11.png',  date: '17 Jun', selectable: false },
  { file: 'img/photo12.png',  date: '18 Jun', selectable: false },
  { file: 'img/ggg.png',      date: '22 Jun', selectable: true  },
  { file: 'img/photo13.png',  date: '23 Jun', selectable: false },
  { file: 'img/photo14.png',  date: '24 Jun', selectable: false },
  { file: 'img/photo15.png',  date: '25 Jun', selectable: false },
];
