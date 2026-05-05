import React, { useState, useEffect, useMemo } from 'react';
import { Search, Users, BarChart3, Layers, RefreshCw, Plus, Check, X, Trash2, Download, Upload, Trophy, AlertCircle, Sparkles, ChevronRight, Home, ArrowLeftRight, Star, Edit3, Save, RotateCcw, FileDown, FileUp, AlertTriangle, TrendingUp, Activity, Target } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell, RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts';
import './utils/storage.js'; // Activa window.storage usando localStorage (PWA local)

// ============================================
// DATOS DEL ÁLBUM PANINI MUNDIAL 2026 - LATAM
// ============================================

const SECCIONES_ESPECIALES = [
  { codigo: '00', nombre: 'Logo Panini', tipo: 'LOGO', seccion: 'INTRO', foil: true },
  { codigo: 'FWC1', nombre: 'Emblema FIFA WC 2026 (1/2)', tipo: 'EMBLEMA', seccion: 'INTRO', foil: true },
  { codigo: 'FWC2', nombre: 'Emblema FIFA WC 2026 (2/2)', tipo: 'EMBLEMA', seccion: 'INTRO', foil: true },
  { codigo: 'FWC3', nombre: 'Mascotas (Maple, Zayu, Clutch)', tipo: 'MASCOTA', seccion: 'INTRO', foil: true },
  { codigo: 'FWC4', nombre: 'Slogan Oficial', tipo: 'SLOGAN', seccion: 'INTRO', foil: true },
  { codigo: 'FWC5', nombre: 'Balón Oficial', tipo: 'BALON', seccion: 'INTRO', foil: true },
  { codigo: 'FWC6', nombre: 'Canadá - Ciudades Anfitrionas', tipo: 'SEDE', seccion: 'INTRO', foil: true },
  { codigo: 'FWC7', nombre: 'México - Ciudades Anfitrionas', tipo: 'SEDE', seccion: 'INTRO', foil: true },
  { codigo: 'FWC8', nombre: 'USA - Ciudades Anfitrionas', tipo: 'SEDE', seccion: 'INTRO', foil: true },
  { codigo: 'FWC9', nombre: 'Italia 1934', tipo: 'CAMPEON_HISTORICO', seccion: 'FIFA_MUSEUM', foil: true },
  { codigo: 'FWC10', nombre: 'Uruguay 1950', tipo: 'CAMPEON_HISTORICO', seccion: 'FIFA_MUSEUM', foil: true },
  { codigo: 'FWC11', nombre: 'Alemania Occidental 1954', tipo: 'CAMPEON_HISTORICO', seccion: 'FIFA_MUSEUM', foil: true },
  { codigo: 'FWC12', nombre: 'Brasil 1962', tipo: 'CAMPEON_HISTORICO', seccion: 'FIFA_MUSEUM', foil: true },
  { codigo: 'FWC13', nombre: 'Alemania Occidental 1974', tipo: 'CAMPEON_HISTORICO', seccion: 'FIFA_MUSEUM', foil: true },
  { codigo: 'FWC14', nombre: 'Argentina 1986', tipo: 'CAMPEON_HISTORICO', seccion: 'FIFA_MUSEUM', foil: true },
  { codigo: 'FWC15', nombre: 'Brasil 1994', tipo: 'CAMPEON_HISTORICO', seccion: 'FIFA_MUSEUM', foil: true },
  { codigo: 'FWC16', nombre: 'Brasil 2002', tipo: 'CAMPEON_HISTORICO', seccion: 'FIFA_MUSEUM', foil: true },
  { codigo: 'FWC17', nombre: 'Italia 2006', tipo: 'CAMPEON_HISTORICO', seccion: 'FIFA_MUSEUM', foil: true },
  { codigo: 'FWC18', nombre: 'Alemania 2014', tipo: 'CAMPEON_HISTORICO', seccion: 'FIFA_MUSEUM', foil: true },
  { codigo: 'FWC19', nombre: 'Argentina 2022', tipo: 'CAMPEON_HISTORICO', seccion: 'FIFA_MUSEUM', foil: true },
];

const SELECCIONES = [
  { cod: 'MEX', nombre: 'México', grupo: 'A', orden: 1, bandera: '🇲🇽' },
  { cod: 'RSA', nombre: 'Sudáfrica', grupo: 'A', orden: 2, bandera: '🇿🇦' },
  { cod: 'KOR', nombre: 'Corea del Sur', grupo: 'A', orden: 3, bandera: '🇰🇷' },
  { cod: 'CZE', nombre: 'Chequia', grupo: 'A', orden: 4, bandera: '🇨🇿' },
  { cod: 'CAN', nombre: 'Canadá', grupo: 'B', orden: 1, bandera: '🇨🇦' },
  { cod: 'BIH', nombre: 'Bosnia y Herzegovina', grupo: 'B', orden: 2, bandera: '🇧🇦' },
  { cod: 'QAT', nombre: 'Catar', grupo: 'B', orden: 3, bandera: '🇶🇦' },
  { cod: 'SUI', nombre: 'Suiza', grupo: 'B', orden: 4, bandera: '🇨🇭' },
  { cod: 'BRA', nombre: 'Brasil', grupo: 'C', orden: 1, bandera: '🇧🇷' },
  { cod: 'MAR', nombre: 'Marruecos', grupo: 'C', orden: 2, bandera: '🇲🇦' },
  { cod: 'HAI', nombre: 'Haití', grupo: 'C', orden: 3, bandera: '🇭🇹' },
  { cod: 'SCO', nombre: 'Escocia', grupo: 'C', orden: 4, bandera: '🏴󠁧󠁢󠁳󠁣󠁴󠁿' },
  { cod: 'USA', nombre: 'Estados Unidos', grupo: 'D', orden: 1, bandera: '🇺🇸' },
  { cod: 'PAR', nombre: 'Paraguay', grupo: 'D', orden: 2, bandera: '🇵🇾' },
  { cod: 'AUS', nombre: 'Australia', grupo: 'D', orden: 3, bandera: '🇦🇺' },
  { cod: 'TUR', nombre: 'Türkiye', grupo: 'D', orden: 4, bandera: '🇹🇷' },
  { cod: 'GER', nombre: 'Alemania', grupo: 'E', orden: 1, bandera: '🇩🇪' },
  { cod: 'CUW', nombre: 'Curaçao', grupo: 'E', orden: 2, bandera: '🇨🇼' },
  { cod: 'CIV', nombre: 'Costa de Marfil', grupo: 'E', orden: 3, bandera: '🇨🇮' },
  { cod: 'ECU', nombre: 'Ecuador', grupo: 'E', orden: 4, bandera: '🇪🇨' },
  { cod: 'NED', nombre: 'Países Bajos', grupo: 'F', orden: 1, bandera: '🇳🇱' },
  { cod: 'JPN', nombre: 'Japón', grupo: 'F', orden: 2, bandera: '🇯🇵' },
  { cod: 'SWE', nombre: 'Suecia', grupo: 'F', orden: 3, bandera: '🇸🇪' },
  { cod: 'TUN', nombre: 'Túnez', grupo: 'F', orden: 4, bandera: '🇹🇳' },
  { cod: 'BEL', nombre: 'Bélgica', grupo: 'G', orden: 1, bandera: '🇧🇪' },
  { cod: 'EGY', nombre: 'Egipto', grupo: 'G', orden: 2, bandera: '🇪🇬' },
  { cod: 'IRN', nombre: 'Irán', grupo: 'G', orden: 3, bandera: '🇮🇷' },
  { cod: 'NZL', nombre: 'Nueva Zelanda', grupo: 'G', orden: 4, bandera: '🇳🇿' },
  { cod: 'ESP', nombre: 'España', grupo: 'H', orden: 1, bandera: '🇪🇸' },
  { cod: 'CPV', nombre: 'Cabo Verde', grupo: 'H', orden: 2, bandera: '🇨🇻' },
  { cod: 'KSA', nombre: 'Arabia Saudí', grupo: 'H', orden: 3, bandera: '🇸🇦' },
  { cod: 'URU', nombre: 'Uruguay', grupo: 'H', orden: 4, bandera: '🇺🇾' },
  { cod: 'FRA', nombre: 'Francia', grupo: 'I', orden: 1, bandera: '🇫🇷' },
  { cod: 'SEN', nombre: 'Senegal', grupo: 'I', orden: 2, bandera: '🇸🇳' },
  { cod: 'IRQ', nombre: 'Iraq', grupo: 'I', orden: 3, bandera: '🇮🇶' },
  { cod: 'NOR', nombre: 'Noruega', grupo: 'I', orden: 4, bandera: '🇳🇴' },
  { cod: 'ARG', nombre: 'Argentina', grupo: 'J', orden: 1, bandera: '🇦🇷' },
  { cod: 'ALG', nombre: 'Argelia', grupo: 'J', orden: 2, bandera: '🇩🇿' },
  { cod: 'AUT', nombre: 'Austria', grupo: 'J', orden: 3, bandera: '🇦🇹' },
  { cod: 'JOR', nombre: 'Jordania', grupo: 'J', orden: 4, bandera: '🇯🇴' },
  { cod: 'POR', nombre: 'Portugal', grupo: 'K', orden: 1, bandera: '🇵🇹' },
  { cod: 'COD', nombre: 'RD del Congo', grupo: 'K', orden: 2, bandera: '🇨🇩' },
  { cod: 'UZB', nombre: 'Uzbekistán', grupo: 'K', orden: 3, bandera: '🇺🇿' },
  { cod: 'COL', nombre: 'Colombia', grupo: 'K', orden: 4, bandera: '🇨🇴' },
  { cod: 'ENG', nombre: 'Inglaterra', grupo: 'L', orden: 1, bandera: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { cod: 'CRO', nombre: 'Croacia', grupo: 'L', orden: 2, bandera: '🇭🇷' },
  { cod: 'GHA', nombre: 'Ghana', grupo: 'L', orden: 3, bandera: '🇬🇭' },
  { cod: 'PAN', nombre: 'Panamá', grupo: 'L', orden: 4, bandera: '🇵🇦' },
];

// Plantillas confirmadas - 48 selecciones del Mundial 2026
// Cada array tiene 19 elementos: posiciones 2-12 (índices 0-10) y posiciones 14-20 (índices 12-18)
// El índice 11 es null porque corresponde a la posición 13 (foto grupal)
// Nombres tal como aparecen impresos en los cromos físicos (algunas erratas tipográficas documentadas)
const PLANTILLAS_CONFIRMADAS = {
  // GRUPO A
  MEX: ['Luis Malagón', 'Johan Vásquez', 'Jorge Sánchez', 'César Montes', 'Jesús Gallardo', 'Israel Reyes', 'Diego Lainez', 'Carlos Rodríguez', 'Edson Álvarez', 'Orbelín Pineda', 'Marcel Ruiz', null, 'Érick Sánchez', 'Hirving Lozano', 'Santiago Giménez', 'Raúl Jiménez', 'Alexis Vega', 'Roberto Alvarado', 'César Huerta'],
  RSA: ['Ronwen Williams', 'Sipho Chaine', 'Aubrey Modiba', 'Samukele Kabini', 'Mbekezeli Mbokazi', 'Khulumani Ndamane', 'Siyabonga Ngezana', 'Khuliso Mudau', 'Nkosinathi Sibisi', 'Teboho Mokoena', 'Thalente Mbatha', null, 'Bathasi Aubaas', 'Yaya Sithole', 'Sipho Mbule', 'Lyle Foster', 'Iqraam Rayners', 'Mohau Nkota', 'Oswin Appollis'],
  KOR: ['Hyeon-woo Jo', 'Seung-Gyu Kim', 'Min-jae Kim', 'Yu-min Cho', 'Young-woo Seol', 'Han-beom Lee', 'Tae-seok Lee', 'Myung-jae Lee', 'Jae-sung Lee', 'In-beom Hwang', 'Kang-in Lee', null, 'Seung-ho Paik', 'Jens Castrop', 'Dongg-yeong Lee', 'Gue-sung Cho', 'Heung-min Son', 'Hee-chan Hwang', 'Hyeon-Gyu Oh'],
  CZE: ['Matej Kovar', 'Jindrich Stanek', 'Ladislav Krejci', 'Vladimir Coufal', 'Jaroslav Zeleny', 'Tomas Holes', 'David Zima', 'Michal Sadilek', 'Lukas Provod', 'Lukas Cerv', 'Tomas Soucek', null, 'Pavel Sulc', 'Matej Vydra', 'Vasil Kusej', 'Tomas Chory', 'Vaclav Cerny', 'Adam Hlozek', 'Patrik Schick'],
  // GRUPO B
  CAN: ['Dayne St.Clair', 'Alphonso Davies', 'Alistair Johnston', 'Samuel Adekugbe', 'Riche Larvea', 'Derek Cornelius', 'Moïse Bombito', 'Kamal Miller', 'Stephen Eustáquio', 'Ismaël Koné', 'Jonathan Osorio', null, 'Jacob Shaffelburg', 'Mathieu Choinière', 'Niko Sigur', 'Tajon Buchanan', 'Liam Millar', 'Cyle Larin', 'Jonathan David'],
  BIH: ['Nikola Vasilj', 'Amer Dedic', 'Sead Kolasinac', 'Tarik Muharemovic', 'Nihad Mujakic', 'Nikola Katic', 'Amir Hadziahmetovic', 'Benjamin Tahirovic', 'Armin Gigovic', 'Ivan Sunjic', 'Ivan Basic', null, 'Dzenis Burnic', 'Esmir Bajraktarevic', 'Amar Memic', 'Ermedin Demirovic', 'Edin Dzeko', 'Samed Bazdar', 'Haris Tabakovic'],
  QAT: ['Meshaal Barsham', 'Sultan Albrake', 'Lucas Mendes', 'Homam Ahmed', 'Boualem Khoukhi', 'Pedro Miguel', 'Tarek Salman', 'Mohamed Al-Mannai', 'Karim Boudiaf', 'Assim Madibo', 'Ahmed Fatehi', null, 'Mohammed Waad', 'Abdulaziz Hatem', 'Hassan Al-Haydos', 'Edmilson Junior', 'Akram Hassan Afif', 'Ahmed Al Ganehi', 'Almoez Ali'],
  SUI: ['Gregor Kobel', 'Yvon Mvogo', 'Manuel Akanji', 'Ricardo Rodriguez', 'Nico Elvedi', 'Aurèle Amenda', 'Silvan Widmer', 'Granit Xhaka', 'Denis Zakaria', 'Remo Freuler', 'Fabian Rieder', null, 'Ardon Jashari', 'Johan Manzambi', 'Michel Aebischer', 'Breel Embolo', 'Ruben Vargas', 'Dan Ndoye', 'Zeki Amdouni'],
  // GRUPO C
  BRA: ['Alisson', 'Bento', 'Marquinhos', 'Éder Militão', 'Gabriel Magalhães', 'Danilo', 'Wesley', 'Lucas Paquetá', 'Casemiro', 'Bruno Guimarães', 'Luiz Henrique', null, 'Vinicius Júnior', 'Rodrygo', 'João Pedro', 'Matheus Cunha', 'Gabriel Martinelli', 'Raphinha', 'Estévão'],
  MAR: ['Yassine Bounou', 'Munir El Kajoui', 'Achraf Hakimi', 'Noussair Mazraoui', 'Nayef Aguerd', 'Roman Saiss', 'Jawad El Yamio', 'Adam Masina', 'Sofyan Amrabat', 'Azzedine Ounahi', 'Eliesse Ben Seghir', null, 'Bilal El Khannouss', 'Ismael Saibari', 'Youssef En-Nesyri', 'Abde Ezzalzouli', 'Soufiane Rahimi', 'Brahim Diaz', 'Ayoub El Kaabi'],
  HAI: ['Johny Placide', 'Carlens Arcus', 'Martin Expérience', 'Jean-Kevin Duverne', 'Ricardo Adé', 'Duke Lacroix', 'Garven Metusala', 'Hannes Delcroix', 'Leverton Pierre', 'Danley Jean Jacques', 'Jean-Ricner Bellegarde', null, 'Christopher Attys', 'Derrick Etienne Jr', 'Josue Casimir', 'Ruben Providence', 'Duckens Nazon', 'Louicius Deedson', 'Frantzdy Pierrot'],
  SCO: ['Angus Gunn', 'Jack Hendry', 'Kieran Tierney', 'Aaron Hickey', 'Andrew Robertson', 'Scott McKenna', 'John Souttar', 'Anthony Ralston', 'Grant Hanley', 'Scott McTominay', 'Billy Gilmour', null, 'Lewis Ferguson', 'Ryan Christie', 'Kenny McLean', 'John McGinn', 'Lyndon Dykes', 'Che Adams', 'Ben Gannon-Doak'],
  // GRUPO D
  USA: ['Math Freese', 'Chris Richards', 'Tim Ream', 'Mark McKenzie', 'Alex Freeman', 'Antonee Robinson', 'Tyler Adams', 'Tanner Tessmann', 'Weston McKenny', 'Christian Roldan', 'Timothy Weah', null, 'Diego Luna', 'Malik Tillman', 'Christian Pulisic', 'Brenden Aaronson', 'Ricardo Pepi', 'Haji Wright', 'Folarin Balogun'],
  PAR: ['Roberto Fernández', 'Orlando Gill', 'Gustavo Gómez', 'Fabián Balbuena', 'Juan José Cáceres', 'Omar Alderete', 'Junior Alonso', 'Mathías Villasanti', 'Diego Gómez', 'Damián Bobadilla', 'Andrés Cubas', null, 'Matías Galarza Fonda', 'Julio Enciso', 'Alejandro Romero Gamarra', 'Miguel Almirón', 'Ramón Sosa', 'Ángel Romero', 'Antonio Sanabria'],
  AUS: ['Mathew Ryan', 'Joe Gauci', 'Harry Souttar', 'Alessandro Circati', 'Jordan Bos', 'Aziz Behich', 'Cameron Burgess', 'Lewis Miller', 'Milos Degenek', 'Jackson Irvine', 'Riley McGree', null, "Aiden O'Neill", 'Connor Metcalfe', 'Patrick Yazbek', 'Craig Goodwin', 'Kusini Vengi', 'Nestory Irankunda', 'Mohamed Touré'],
  TUR: ['Ugurcan Cakir', 'Mert Muldur', 'Zeki Celik', 'Abdulkerim Bardakci', 'Caglar Soyuncu', 'Merih Demiral', 'Ferdi Kadioglu', 'Kaan Ayhan', 'Ismail Yuksek', 'Hakan Calhanoglu', 'Orkun Kokcu', null, 'Arda Guler', 'Irfan Can Kahveci', 'Yunus Akgun', 'Can Uzun', 'Baris Alper Yilmaz', 'Kerem Akturkoglu', 'Kenan Yildiz'],
  // GRUPO E
  GER: ['Marc-André ter Stegen', 'Jonathan Tah', 'David Raum', 'Nico Schlotterbeck', 'Antonio Rüdiger', 'Waldemar Anton', 'Ridle Baku', 'Maximilian Mittelstadt', 'Joshua Kimmich', 'Florian Wirtz', 'Felix Nmecha', null, 'Leon Goretzka', 'Jamal Musiala', 'Serge Gnabry', 'Kai Havertz', 'Leroy Sane', 'Karim Adeyemi', 'Nick Woltemade'],
  CUW: ['Eloy Room', 'Armando Obispo', 'Sherel Floranus', 'Jurien Gaari', 'Joshua Brenet', 'Roshon Van Eijma', 'Shurandy Sambo', 'Livano Comenencia', 'Godfried Roemeratoe', 'Juninho Bacuna', 'Leandro Bacuna', null, 'Tahith Chong', 'Kenji Gorre', 'Jearl Margaritha', 'Jurgen Locadia', 'Jeremy Antonisse', 'Gervane Kastaneer', 'Sontje Hansen'],
  CIV: ['Yahia Fofana', 'Ghislain Konan', 'Wilfried Singo', 'Odilon Kossounou', 'Evan Ndicka', 'Willy Boly', 'Emmanuel Agbadou', 'Ousmane Diomande', 'Franck Kessie', 'Seko Fofana', 'Ibrahim Sangare', null, 'Jean-Philippe Gbamin', 'Amad Diallo', 'Sébastien Haller', 'Simon Adingra', 'Yan Diomande', 'Evann Guessand', 'Oumar Diakite'],
  ECU: ['Hernán Galíndez', 'Gonzalo Valle', 'Piero Hincapié', 'Pervis Estupiñán', 'Willian Pacho', 'Ángelo Preciado', 'Joel Ordóñez', 'Moisés Caicedo', 'Alan Franco', 'Kendry Páez', 'Pedro Vite', null, 'John Yeboah', 'Leonardo Campana', 'Gonzalo Plata', 'Nilson Angulo', 'Alan Minda', 'Kevin Rodríguez', 'Enner Valencia'],
  // GRUPO F
  NED: ['Bart Verbruggen', 'Virgil van Dijk', 'Micky van de Ven', 'Jurrien Timber', 'Denzel Dumfries', 'Nathan Aké', 'Jeremie Frimpong', 'Jan Paul van Hecke', 'Tijjani Reijnders', 'Ryan Gravenberch', 'Teun Koopmeiners', null, 'Frenkie de Jong', 'Xavi Simons', 'Justin Kluivert', 'Memphis Depay', 'Donyell Malen', 'Wout Weghorst', 'Cody Gakpo'],
  JPN: ['Zion Suzuki', 'Henry Heroki Mochizuki', 'Ayumu Seko', 'Junnosuke Suzuki', 'Shogo Taniguchi', 'Tsuyoshi Watanabe', 'Kaishu Sano', 'Yuki Soma', 'Ao Tanaka', 'Daichi Kamada', 'Takefusa Kubo', null, 'Ritsu Doan', 'Keito Nakamura', 'Takumi Minamino', 'Shuto Machino', 'Junya Ito', 'Koki Ogawa', 'Ayase Ueda'],
  SWE: ['Victor Johansson', 'Isak Hien', 'Gabriel Gudmundsson', 'Emil Holm', 'Victor Nilsson Lindelöf', 'Gustaf Lagerbielke', 'Lucas Bergvall', 'Hugo Larsson', 'Jesper Karlström', 'Yasin Ayari', 'Mattias Svanberg', null, 'Daniel Svensson', 'Ken Sema', 'Roony Bardghji', 'Dejan Kulusevski', 'Anthony Elanga', 'Alexander Isak', 'Viktor Gyökeres'],
  TUN: ['Bechir Ben Said', 'Aymen Dahmen', 'Yan Valery', 'Montassar Talbi', 'Yassine Meriah', 'Ali Abdi', 'Dylan Bronn', 'Ellyes Skhiri', 'Aissa Laidouni', 'Ferjani Sassi', 'Mohamed Ali Ben Romdhane', null, 'Hannibal Mejbri', 'Elias Achouri', 'Elias Saad', 'Hazem Mastouri', 'Ismael Gharbi', 'Sayfallah Ltaief', 'Naim Sliti'],
  // GRUPO G
  BEL: ['Thibaut Courtois', 'Arthur Theate', 'Timothy Castagne', 'Zeno Debast', 'Brandon Mechele', 'Maxim De Cuyper', 'Thomas Meunier', 'Youri Tielemans', 'Amadou Onana', 'Nicolas Raskin', 'Alexis Saelemaekers', null, 'Hans Vanaken', 'Kevin De Bruyne', 'Jérémy Doku', 'Charles De Ketelaere', 'Leandro Trossard', 'Loïs Openda', 'Romelu Lukaku'],
  EGY: ['Mohamed El Shenawy', 'Mohamed Hany', 'Mohamed Hamdy', 'Yasser Ibrahim', 'Khaled Sobhi', 'Ramy Rabia', 'Hossam Abdelmaguid', 'Ahmed Fatouh', 'Marwan Attia', 'Zizo', 'Hamdy Fathy', null, 'Mohamed Lasheen', 'Emam Ashour', 'Osama Faisal', 'Mohamed Salah', 'Mostafa Mohamed', 'Trezeguet', 'Omar Marmoush'],
  IRN: ['Alireza Beiranvand', 'Morteza Pouraliganji', 'Ehsan Hajsafi', 'Milad Mohammadi', 'Shojae Khalilzadeh', 'Ramin Rezaeian', 'Hossein Kanaani', 'Sadegh Moharrami', 'Saleh Hardani', 'Saeed Ezatolahi', 'Saman Ghoddos', null, 'Omid Noorafkan', 'Roozbeh Cheshmi', 'Mohammad Mohebi', 'Sardar Azmoun', 'Mehdi Taremi', 'Alireza Jahanbakhsh', 'Ali Gholizadeh'],
  NZL: ['Max Crocombe', 'Alex Paulsen', 'Michael Boxall', 'Liberato Cacace', 'Tim Payne', 'Tyler Bindon', 'Francis de Vries', 'Finn Surman', 'Joe Bell', 'Sarpreet Singh', 'Ryan Thomas', null, 'Matthew Garbett', 'Marko Stamenić', 'Ben Old', 'Chris Wood', 'Elijah Just', 'Callum McCowatt', 'Kosta Barbarouses'],
  // GRUPO H
  ESP: ['Unai Simon', 'Robin Le Normand', 'Aymeric Laporte', 'Dean Huijsen', 'Pedro Porro', 'Dani Carvajal', 'Marc Cucurella', 'Martín Zubimendi', 'Rodri', 'Pedri', 'Fabian Ruiz', null, 'Mikel Merino', 'Lamine Yamal', 'Dani Olmo', 'Nico Williams', 'Ferran Torres', 'Álvaro Morata', 'Mikel Oyarzabal'],
  CPV: ['Vozinha', 'Logan Costa', 'Pico', 'Diney', 'Steven Moreira', 'Wagner Pina', 'Joao Paulo', 'Yannick Semedo', 'Kevin Pina', 'Patrick Andrade', 'Jamiro Monteiro', null, 'Deroy Duarte', 'Garry Rodrigues', 'Jovane Cabral', 'Ryan Mendes', 'Dailon Livramento', 'Willy Semedo', 'Bebe'],
  KSA: ['Nawaf Alaqidi', 'Abdulrahman Al-Sanbi', 'Saud Abdulhamid', 'Nawaf Bouwashl', 'Jihad Thakri', 'Moteb Al-Harbi', 'Hassan Altambakti', 'Musab Aljuwayr', 'Ziyad Aljohani', 'Abdullah Alkhaibari', 'Nasser Aldawsari', null, 'Saleh Abu Alshamat', 'Marwan Alsahafi', 'Salem Aldawsari', 'Abdulrahman Al-Aboud', 'Feras Akbrikan', 'Saleh Alshehri', 'Abdullah Al-Hamdan'],
  URU: ['Sergio Rochet', 'Santiago Mele', 'Ronald Araújo', 'José María Giménez', 'Sebastián Cáceres', 'Mathías Olivera', 'Guillermo Varela', 'Nahitan Nández', 'Federico Valverde', 'Giorgian De Arrascaeta', 'Rodrigo Bentancur', null, 'Manuel Ugarte', 'Nicolás de la Cruz', 'Maxi Araújo', 'Darwin Núñez', 'Federico Viñas', 'Rodrigo Aguirre', 'Facundo Pellistri'],
  // GRUPO I
  FRA: ['Mike Maignan', 'Theo Hernandez', 'William Saliba', 'Jules Kounde', 'Ibrahima Konate', 'Dayot Upamecano', 'Lucas Digne', 'Aurélien Tchouaméni', 'Eduardo Camavinga', 'Manu Kone', 'Adrien Rabiot', null, 'Michael Olise', 'Ousmane Dembele', 'Bradley Barcola', 'Désiré Doué', 'Kingsley Coman', 'Hugo Ekitike', 'Kylian Mbappe'],
  SEN: ['Edouard Mendy', 'Yehvann Diouf', 'Moussa Niakhaté', 'Abdoulaye Seck', 'Ismail Jakobs', 'El Hadji Malick Diouf', 'Kalidou Koulibaly', 'Idrissa Gana Gueye', 'Pape Matar Sarr', 'Pape Gueye', 'Habib Diarra', null, 'Lamine Camara', 'Sadio Mane', 'Ismaïla Sarr', 'Boulaye Dia', 'Iliman Ndiaye', 'Nicolas Jackson', 'Krepin Diatta'],
  IRQ: ['Jalal Hassan', 'Rebin Sulaka', 'Hussein Ali', 'Akam Hashem', 'Merchas Doski', 'Zaid Tahseen', 'Manaf Younis', 'Zidane Iqbal', 'Amir Al-Ammari', 'Ibrahim Bayesh', 'Ali Jasim', null, 'Youssef Amyn', 'Aimar Sher', 'Marko Farji', 'Osama Rashid', 'Ali Al-Hamadi', 'Aymen Hussein', 'Mohanad Ali'],
  NOR: ['Orjan Nyland', 'Julian Ryerson', 'Leo Ostigård', 'Kristoffer Vassbakk Ajer', 'Marcus Holmgren Pedersen', 'David Møller Wolfe', 'Torbjørn Heggem', 'Morten Thorsby', 'Martin Ødegaard', 'Sander Berge', 'Andreas Schjelderup', null, 'Patrick Berg', 'Erling Haaland', 'Alexander Sørloth', 'Aron Dønnum', 'Jorgen Strand Larsen', 'Antonio Nusa', 'Oscar Bobb'],
  // GRUPO J
  ARG: ['Emiliano Martínez', 'Nahuel Molina', 'Cristian Romero', 'Nicolás Otamendi', 'Nicolás Tagliafico', 'Leonardo Balerdi', 'Enzo Fernández', 'Alexis Mac Allister', 'Rodrigo De Paul', 'Exequiel Palacios', 'Leandro Paredes', null, 'Nico Paz', 'Franco Mastantuono', 'Nico González', 'Lionel Messi', 'Lautaro Martínez', 'Julián Álvarez', 'Giuliano Simeone'],
  ALG: ['Alexis Guendouz', 'Ramy Bensebaini', 'Youcef Atal', 'Rayan Aït-Nouri', 'Mohamed Amine Tougai', 'Aïssa Mandi', 'Ismael Bennacer', 'Houssem Aouar', 'Hicham Boudaoui', 'Ramiz Zerrouki', 'Nabil Bentalab', null, 'Farés Chaibi', 'Riyad Mahrez', 'Said Benrahma', 'Anis Hadj Moussa', 'Amine Gouiri', 'Baghdad Bounedjah', 'Mohammed Amoura'],
  AUT: ['Alexander Schlager', 'Patrick Pentz', 'David Alaba', 'Kevin Danso', 'Philipp Lienhart', 'Stefan Posch', 'Phillipp Mwene', 'Alexander Prass', 'Xaver Schlager', 'Marcel Sabitzer', 'Konrad Laimer', null, 'Florian Grillitsch', 'Nicolas Seiwald', 'Romano Schmid', 'Patrick Wimmer', 'Christoph Baumgartner', 'Michael Gregoritsch', 'Marko Arnautović'],
  JOR: ['Yazeed Abulaila', 'Ihsan Haddad', 'Mohammad Abu Hashish', 'Yazan Al-Arab', 'Abdallah Nasib', 'Saleem Obaid', 'Mohammad Abualnadi', 'Ibrahim Saadeh', 'Nizar Al-Rashdan', 'Noor Al-Rawabdeh', 'Mohannad Abu Taha', null, 'Amer Jamous', 'Musa Al-Taamari', 'Yazan Al-Naimat', 'Mahmoud Al-Mardi', 'Ali Olwan', 'Mohammad Abu Zrayq', 'Ibrahim Sabra'],
  // GRUPO K
  POR: ['Diogo Costa', 'Jose Sa', 'Ruben Dias', 'João Cancelo', 'Diogo Dalot', 'Nuno Mendes', 'Gonçalo Inácio', 'Bernardo Silva', 'Bruno Fernandes', 'Ruben Neves', 'Vitinha', null, 'João Neves', 'Cristiano Ronaldo', 'Francisco Trincao', 'João Felix', 'Gonçalo Ramos', 'Pedro Neto', 'Rafael Leão'],
  COD: ['Lionel Mpasi', 'Aaron Wan-Bissaka', 'Axel Tuanzebe', 'Arthur Masuaku', 'Chancel Mbemba', 'Joris Kayembe', 'Charles Pickel', "Ngal'ayel Mukau", 'Edo Kayembe', 'Samuel Moutoussamy', 'Noah Sadiki', null, 'Théo Bongonda', 'Meschak Elia', 'Yoane Wissa', 'Brian Cipenga', 'Fiston Mayele', 'Cédric Bakambu', 'Nathanaël Mbuku'],
  UZB: ['Utkir Yusupov', 'Farrukh Savfiev', 'Sherzod Nasrullaev', 'Umar Eshmurodov', 'Husniddin Aliqulov', 'Rustamjon Ashurmatov', 'Khojiakbar Alijonov', 'Abdukodir Khusanov', 'Odiljon Hamrobekov', 'Otabek Shukurov', 'Jamshid Iskanderov', null, 'Azizbek Turgunboev', 'Khojimat Erkinov', 'Eldor Shomurodov', 'Oston Urunov', 'Jaloliddin Masharipov', 'Igor Sergeev', 'Abbosbek Fayzullaev'],
  COL: ['Camilo Vargas', 'David Ospina', 'Dávinson Sánchez', 'Yerry Mina', 'Daniel Muñoz', 'Johan Mojica', 'Jhon Lucumí', 'Santiago Arias', 'Jefferson Lerma', 'Kevin Castaño', 'Richard Ríos', null, 'James Rodríguez', 'Juan Fernando Quintero', 'Jorge Carrascal', 'Jhon Arias', 'Jhon Córdoba', 'Luis Suárez', 'Luis Díaz'],
  // GRUPO L
  ENG: ['Jordan Pickford', 'John Stones', 'Marc Guéhi', 'Ezri Konsa', 'Trent Alexander-Arnold', 'Reece James', 'Dan Burn', 'Jordan Henderson', 'Declan Rice', 'Jude Bellingham', 'Cole Palmer', null, 'Morgan Rogers', 'Anthony Gordon', 'Phil Foden', 'Bukayo Saka', 'Harry Kane', 'Marcus Rashford', 'Ollie Watkins'],
  CRO: ['Dominik Livaković', 'Duje Caleta-Car', 'Josko Gvardiol', 'Josip Stanišić', 'Luka Vušković', 'Josip Sutalo', 'Kristijan Jakic', 'Luka Modrić', 'Mateo Kovacic', 'Martin Baturina', 'Lovro Majer', null, 'Mario Pasalic', 'Petar Sucic', 'Ivan Perišić', 'Marco Pasalic', 'Ante Budimir', 'Andrej Kramarić', 'Franjo Ivanovic'],
  GHA: ['Lawrence Ati Zigi', 'Tariq Lamptey', 'Mohammed Salisu', 'Alidu Seidu', 'Alexander Djiku', 'Gideon Mensah', 'Caleb Yirenkyi', 'Abdul Issahaku Fatawu', 'Thomas Partey', 'Salis Abdul Samed', 'Kamaldeen Sulemana', null, 'Mohammed Kudus', 'Inaki Williams', 'Jordan Ayew', 'Andre Ayew', 'Joseph Paintsil', 'Osman Bukari', 'Antoine Semenyo'],
  PAN: ['Orlando Mosquera', 'Luis Mejia', 'Fidel Escobar', 'Andres Andrade', 'Michael Amir Murillo', 'Eric Davis', 'Jose Cordoba', 'Cesar Blackman', 'Cristian Martinez', 'Aníbal Godoy', 'Adalberto Carrasquilla', null, 'Édgar Bárcenas', 'Carlos Harvey', 'Ismael Díaz', 'Jose Fajardo', 'Cecilio Waterman', 'Jose Luis Rodriguez', 'Alberto Quintero'],
};

// ============================================
// PANINI EXTRA STICKERS
// 20 jugadores × 4 colores = 80 cromos especiales
// NO van pegados en el álbum, frecuencia ~1 cada 100 sobres
// Datos confirmados oficialmente por Panini Group
// ============================================

const EXTRA_JUGADORES = [
  { codPais: 'ARG', nombre: 'Lionel Messi', seleccion: 'Argentina' },
  { codPais: 'BEL', nombre: 'Jérémy Doku', seleccion: 'Bélgica' },
  { codPais: 'BRA', nombre: 'Vinícius Júnior', seleccion: 'Brasil' },
  { codPais: 'CAN', nombre: 'Alphonso Davies', seleccion: 'Canadá' },
  { codPais: 'COL', nombre: 'Luis Díaz', seleccion: 'Colombia' },
  { codPais: 'CRO', nombre: 'Luka Modrić', seleccion: 'Croacia' },
  { codPais: 'ECU', nombre: 'Moisés Caicedo', seleccion: 'Ecuador' },
  { codPais: 'EGY', nombre: 'Mohamed Salah', seleccion: 'Egipto' },
  { codPais: 'ENG', nombre: 'Jude Bellingham', seleccion: 'Inglaterra' },
  { codPais: 'FRA', nombre: 'Kylian Mbappé', seleccion: 'Francia' },
  { codPais: 'GER', nombre: 'Florian Wirtz', seleccion: 'Alemania' },
  { codPais: 'KOR', nombre: 'Heung-min Son', seleccion: 'Corea del Sur' },
  { codPais: 'MEX', nombre: 'Raúl Jiménez', seleccion: 'México' },
  { codPais: 'MAR', nombre: 'Achraf Hakimi', seleccion: 'Marruecos' },
  { codPais: 'NED', nombre: 'Cody Gakpo', seleccion: 'Países Bajos' },
  { codPais: 'NOR', nombre: 'Erling Haaland', seleccion: 'Noruega' },
  { codPais: 'POR', nombre: 'Cristiano Ronaldo', seleccion: 'Portugal' },
  { codPais: 'ESP', nombre: 'Lamine Yamal', seleccion: 'España' },
  { codPais: 'URU', nombre: 'Federico Valverde', seleccion: 'Uruguay' },
  { codPais: 'USA', nombre: 'Christian Pulisic', seleccion: 'Estados Unidos' },
];

const EXTRA_COLORES = [
  { code: 'REG', nombre: 'Regular', nombreEs: 'Morado', rareza: 1, frecuencia: '~1 : 158 sobres', emoji: '🟣', tailwindBg: 'bg-fuchsia-700', tailwindBorder: 'border-fuchsia-500', tailwindText: 'text-fuchsia-300' },
  { code: 'BRO', nombre: 'Bronze', nombreEs: 'Bronce', rareza: 2, frecuencia: '~1 : 317 sobres', emoji: '🟠', tailwindBg: 'bg-orange-800', tailwindBorder: 'border-orange-600', tailwindText: 'text-orange-300' },
  { code: 'SIL', nombre: 'Silver', nombreEs: 'Plata', rareza: 3, frecuencia: '~1 : 950 sobres', emoji: '⚪', tailwindBg: 'bg-slate-500', tailwindBorder: 'border-slate-400', tailwindText: 'text-slate-200' },
  { code: 'GOL', nombre: 'Gold', nombreEs: 'Oro', rareza: 4, frecuencia: '~1 : 1.900 sobres', emoji: '🟡', tailwindBg: 'bg-amber-600', tailwindBorder: 'border-amber-400', tailwindText: 'text-amber-300' },
];

// Generar los 80 Extra Stickers
function generarExtraStickers() {
  const lista = [];
  EXTRA_JUGADORES.forEach(j => {
    EXTRA_COLORES.forEach(c => {
      lista.push({
        id: `${j.codPais}_${c.code}`,
        codPais: j.codPais,
        jugador: j.nombre,
        seleccion: j.seleccion,
        color: c.code,
        colorNombre: c.nombre,
        colorNombreEs: c.nombreEs,
        rareza: c.rareza,
      });
    });
  });
  return lista;
}

const EXTRA_STICKERS = generarExtraStickers();
const TOTAL_EXTRA = EXTRA_STICKERS.length; // 80

// ============================================
// COCA-COLA STICKERS - EDICIÓN LATAM/COLOMBIA
// 14 cromos exclusivos (CC1-CC14)
// NO se obtienen en sobres regulares - se canjean con etiquetas de botellas Coca-Cola 1.5L
// Se pegan en una doble página dedicada del álbum
// Datos confirmados por Football Cartophilic Info Exchange + prensa colombiana
// ============================================

const COCA_COLA_STICKERS = [
  { id: 'CC1',  numero: 1,  jugador: 'Lamine Yamal',       seleccion: 'España',        codPais: 'ESP' },
  { id: 'CC2',  numero: 2,  jugador: 'Joshua Kimmich',     seleccion: 'Alemania',      codPais: 'GER' },
  { id: 'CC3',  numero: 3,  jugador: 'Harry Kane',         seleccion: 'Inglaterra',    codPais: 'ENG' },
  { id: 'CC4',  numero: 4,  jugador: 'Santiago Giménez',   seleccion: 'México',        codPais: 'MEX' },
  { id: 'CC5',  numero: 5,  jugador: 'Joško Gvardiol',     seleccion: 'Croacia',       codPais: 'CRO' },
  { id: 'CC6',  numero: 6,  jugador: 'Federico Valverde',  seleccion: 'Uruguay',       codPais: 'URU' },
  { id: 'CC7',  numero: 7,  jugador: 'Jefferson Lerma',    seleccion: 'Colombia',      codPais: 'COL' },
  { id: 'CC8',  numero: 8,  jugador: 'Enner Valencia',     seleccion: 'Ecuador',       codPais: 'ECU' },
  { id: 'CC9',  numero: 9,  jugador: 'Gabriel Magalhães',  seleccion: 'Brasil',        codPais: 'BRA' },
  { id: 'CC10', numero: 10, jugador: 'Virgil van Dijk',    seleccion: 'Países Bajos',  codPais: 'NED' },
  { id: 'CC11', numero: 11, jugador: 'Alphonso Davies',    seleccion: 'Canadá',        codPais: 'CAN' },
  { id: 'CC12', numero: 12, jugador: 'Emiliano Martínez',  seleccion: 'Argentina',     codPais: 'ARG' },
  { id: 'CC13', numero: 13, jugador: 'Raúl Jiménez',       seleccion: 'México',        codPais: 'MEX' },
  { id: 'CC14', numero: 14, jugador: 'Lautaro Martínez',   seleccion: 'Argentina',     codPais: 'ARG' },
];

const TOTAL_COCA_COLA = COCA_COLA_STICKERS.length; // 14

// Generar todos los cromos
// overrides es opcional: { codigoCromo: 'Nuevo nombre' } - permite editar nombres sin alterar la constante base
function generarCatalogo(overrides = {}) {
  const cromos = [...SECCIONES_ESPECIALES.map(c => ({ ...c, codPais: null, posicion: null, esJugador: false, esEscudo: false, esFotoGrupal: false }))];
  
  SELECCIONES.forEach(sel => {
    const plantilla = PLANTILLAS_CONFIRMADAS[sel.cod];
    
    // Cromo #1 - Escudo (foil)
    const codEscudo = `${sel.cod}1`;
    cromos.push({
      codigo: codEscudo,
      nombre: overrides[codEscudo] || `Escudo ${sel.nombre}`,
      tipo: 'ESCUDO',
      seccion: 'SELECCION',
      foil: true,
      codPais: sel.cod,
      posicion: 1,
      esJugador: false,
      esEscudo: true,
      esFotoGrupal: false,
    });
    
    // Cromos #2 a #20 - Jugadores (con #13 como foto grupal)
    for (let pos = 2; pos <= 20; pos++) {
      const esFoto = pos === 13;
      const cod = `${sel.cod}${pos}`;
      let nombreJugador;
      
      // Prioridad: override del usuario > plantilla confirmada > placeholder
      if (overrides[cod]) {
        nombreJugador = overrides[cod];
      } else if (esFoto) {
        nombreJugador = `Foto Grupal ${sel.nombre}`;
      } else if (plantilla) {
        const idx = pos - 2;
        nombreJugador = plantilla[idx] || `Jugador #${pos} ${sel.cod}`;
      } else {
        nombreJugador = `Jugador #${pos} ${sel.cod}`;
      }
      
      cromos.push({
        codigo: cod,
        nombre: nombreJugador,
        tipo: esFoto ? 'FOTO_GRUPAL' : 'JUGADOR',
        seccion: 'SELECCION',
        foil: false,
        codPais: sel.cod,
        posicion: pos,
        esJugador: !esFoto,
        esEscudo: false,
        esFotoGrupal: esFoto,
      });
    }
  });
  
  return cromos;
}

// Catálogo base sin overrides - se usa como referencia para "restaurar original"
const CATALOGO_BASE = generarCatalogo();
const TOTAL_CROMOS = CATALOGO_BASE.length;

// ============================================
// HELPERS
// ============================================

function normalizarCodigo(input) {
  // Acepta: "COL1", "col 1", "COL-1", "ARG 5", "00", "FWC3"
  const limpio = input.toString().trim().toUpperCase().replace(/[\s\-_.]/g, '');
  // Validar que existe en el catálogo (los códigos no cambian con overrides)
  if (CATALOGO_BASE.find(c => c.codigo === limpio)) return limpio;
  return null;
}

function parsearEntrada(texto) {
  // Separa por comas, espacios, saltos de línea
  const tokens = texto.split(/[,;\n\r\t]+/).map(t => t.trim()).filter(Boolean);
  const validos = [];
  const invalidos = [];
  
  tokens.forEach(t => {
    // Permitir múltiples por espacios también
    const sub = t.split(/\s+/).filter(Boolean);
    sub.forEach(s => {
      const norm = normalizarCodigo(s);
      if (norm) validos.push(norm);
      else invalidos.push(s);
    });
  });
  
  return { validos, invalidos };
}

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export default function AlbumPanini2026() {
  const [coleccionistas, setColeccionistas] = useState([]);
  const [coleccionistaActivo, setColeccionistaActivo] = useState(null);
  const [colecciones, setColecciones] = useState({}); // {coleccionistaId: {codigo: cantidad}}
  const [plantillaOverrides, setPlantillaOverrides] = useState({}); // {codigoCromo: 'Nombre corregido'} - compartido entre todos los coleccionistas
  const [vista, setVista] = useState('inicio');
  const [equipoActivo, setEquipoActivo] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState(null);

  // Catálogo dinámico que aplica los overrides del usuario
  const CATALOGO = useMemo(() => generarCatalogo(plantillaOverrides), [plantillaOverrides]);

  // Cargar datos al inicio
  useEffect(() => {
    async function cargar() {
      try {
        const dataCol = await window.storage.get('coleccionistas', true);
        const lista = dataCol ? JSON.parse(dataCol.value) : [];
        setColeccionistas(lista);
        
        // Cargar colecciones de cada uno
        const cols = {};
        for (const c of lista) {
          try {
            const d = await window.storage.get(`coleccion:${c.id}`, true);
            cols[c.id] = d ? JSON.parse(d.value) : {};
          } catch {
            cols[c.id] = {};
          }
        }
        setColecciones(cols);
        
        // Cargar overrides de plantillas (compartidos entre todos)
        try {
          const dataOver = await window.storage.get('plantilla_overrides', true);
          if (dataOver) setPlantillaOverrides(JSON.parse(dataOver.value));
        } catch {
          // Sin overrides previos
        }
        
        // Activar el primer coleccionista si existe
        if (lista.length > 0) setColeccionistaActivo(lista[0].id);
      } catch (e) {
        console.log('Sin datos previos, iniciando vacío');
      } finally {
        setCargando(false);
      }
    }
    cargar();
  }, []);

  function mostrarMensaje(texto, tipo = 'info') {
    setMensaje({ texto, tipo });
    setTimeout(() => setMensaje(null), 4000);
  }

  async function guardarColeccionistas(lista) {
    setColeccionistas(lista);
    await window.storage.set('coleccionistas', JSON.stringify(lista), true);
  }

  async function guardarColeccion(coleccionistaId, coleccion) {
    setColecciones(prev => ({ ...prev, [coleccionistaId]: coleccion }));
    await window.storage.set(`coleccion:${coleccionistaId}`, JSON.stringify(coleccion), true);
  }

  async function guardarOverrides(nuevos) {
    setPlantillaOverrides(nuevos);
    await window.storage.set('plantilla_overrides', JSON.stringify(nuevos), true);
  }

  // Importa un backup (puede ser parcial o completo)
  // datos: { coleccionistas?, colecciones?, overrides? }
  // modo: 'merge' = combinar con datos actuales, 'replace' = reemplazar todo
  async function importarBackup(datos, modo) {
    try {
      // 1. Coleccionistas
      let nuevaListaColeccionistas = coleccionistas;
      if (datos.coleccionistas && Array.isArray(datos.coleccionistas)) {
        if (modo === 'replace') {
          nuevaListaColeccionistas = datos.coleccionistas;
        } else {
          // merge: agregar los que no existen, mantener los actuales
          const idsActuales = new Set(coleccionistas.map(c => c.id));
          const nuevos = datos.coleccionistas.filter(c => !idsActuales.has(c.id));
          nuevaListaColeccionistas = [...coleccionistas, ...nuevos];
        }
        setColeccionistas(nuevaListaColeccionistas);
        await window.storage.set('coleccionistas', JSON.stringify(nuevaListaColeccionistas), true);
      }

      // 2. Colecciones
      if (datos.colecciones && typeof datos.colecciones === 'object') {
        const nuevasColecciones = modo === 'replace' ? {} : { ...colecciones };
        for (const [colId, col] of Object.entries(datos.colecciones)) {
          if (modo === 'merge' && nuevasColecciones[colId]) {
            // Combinar: sumar cantidades para claves que coinciden
            const combinada = { ...nuevasColecciones[colId] };
            for (const [k, v] of Object.entries(col)) {
              combinada[k] = (combinada[k] || 0) + v;
            }
            nuevasColecciones[colId] = combinada;
          } else {
            nuevasColecciones[colId] = col;
          }
          await window.storage.set(`coleccion:${colId}`, JSON.stringify(nuevasColecciones[colId]), true);
        }
        setColecciones(nuevasColecciones);
      }

      // 3. Overrides de plantillas
      if (datos.overrides && typeof datos.overrides === 'object') {
        const nuevosOver = modo === 'replace' ? datos.overrides : { ...plantillaOverrides, ...datos.overrides };
        setPlantillaOverrides(nuevosOver);
        await window.storage.set('plantilla_overrides', JSON.stringify(nuevosOver), true);
      }

      // Activar el primer coleccionista si quedó sin activo
      if (!coleccionistaActivo && nuevaListaColeccionistas.length > 0) {
        setColeccionistaActivo(nuevaListaColeccionistas[0].id);
      }

      return { ok: true };
    } catch (e) {
      return { ok: false, error: e.message };
    }
  }

  async function crearColeccionista(nombre) {
    const id = `col_${Date.now()}`;
    const nuevo = { id, nombre, creado: new Date().toISOString() };
    const lista = [...coleccionistas, nuevo];
    await guardarColeccionistas(lista);
    setColeccionistaActivo(id);
    setColecciones(prev => ({ ...prev, [id]: {} }));
    mostrarMensaje(`Coleccionista "${nombre}" creado`, 'exito');
  }

  async function eliminarColeccionista(id) {
    const lista = coleccionistas.filter(c => c.id !== id);
    await guardarColeccionistas(lista);
    await window.storage.delete(`coleccion:${id}`, true);
    const nuevasCols = { ...colecciones };
    delete nuevasCols[id];
    setColecciones(nuevasCols);
    if (coleccionistaActivo === id) {
      setColeccionistaActivo(lista[0]?.id || null);
    }
  }

  const coleccionActual = colecciones[coleccionistaActivo] || {};

  // Estadísticas
  const stats = useMemo(() => {
    // Solo claves del álbum base (no Extra Stickers)
    const codigosTengoAlbum = Object.keys(coleccionActual).filter(k => !k.startsWith('EX_') && coleccionActual[k] > 0);
    const total = TOTAL_CROMOS;
    const tengo = codigosTengoAlbum.length;
    const faltan = total - tengo;
    const totalPegadosAlbum = codigosTengoAlbum.reduce((acc, k) => acc + coleccionActual[k], 0);
    const repetidas = totalPegadosAlbum - tengo;
    const porcentaje = total > 0 ? (tengo / total) * 100 : 0;
    
    // Foils
    const foilsTotal = CATALOGO.filter(c => c.foil).length;
    const foilsTengo = CATALOGO.filter(c => c.foil && coleccionActual[c.codigo] > 0).length;
    
    // Extra Stickers
    const extraTengo = EXTRA_STICKERS.filter(e => (coleccionActual[`EX_${e.id}`] || 0) > 0).length;
    
    // Coca-Cola
    const cocaTengo = COCA_COLA_STICKERS.filter(c => (coleccionActual[`CC_${c.id}`] || 0) > 0).length;
    
    return { total, tengo, faltan, repetidas, porcentaje, foilsTotal, foilsTengo, totalPegados: totalPegadosAlbum, extraTengo, extraTotal: TOTAL_EXTRA, cocaTengo, cocaTotal: TOTAL_COCA_COLA };
  }, [coleccionActual, CATALOGO]);

  // Estado por equipo
  const estadoEquipos = useMemo(() => {
    return SELECCIONES.map(sel => {
      const cromos = CATALOGO.filter(c => c.codPais === sel.cod);
      const tengo = cromos.filter(c => coleccionActual[c.codigo] > 0).length;
      return { ...sel, tengo, total: cromos.length, porcentaje: (tengo / cromos.length) * 100 };
    });
  }, [coleccionActual, CATALOGO]);

  if (cargando) {
    return (
      <div className="min-h-screen bg-stone-950 flex items-center justify-center">
        <div className="text-amber-400 font-mono">Cargando álbum...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=JetBrains+Mono:wght@400;700&family=Inter:wght@400;500;600;700&display=swap');
        .font-display { font-family: 'Bebas Neue', sans-serif; letter-spacing: 0.02em; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        .gradient-pitch { background: linear-gradient(135deg, #0a4d1e 0%, #0f6b2a 50%, #0a4d1e 100%); }
        .gradient-gold { background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%); }
        .gradient-card { background: linear-gradient(180deg, #1c1917 0%, #0c0a09 100%); }
        .border-pitch { border-color: #166534; }
        @keyframes shimmer {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }
        .foil-shine {
          background: linear-gradient(135deg, #fbbf24 0%, #fde68a 25%, #f59e0b 50%, #fde68a 75%, #fbbf24 100%);
          background-size: 200% 200%;
          animation: shimmer 3s infinite;
        }
      `}</style>

      {/* Header */}
      <header className="border-b border-stone-800 bg-stone-950/95 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded gradient-gold flex items-center justify-center">
              <Trophy className="w-5 h-5 text-stone-900" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="font-display text-xl sm:text-2xl tracking-wide">PANINI WC 2026</h1>
              <p className="text-[10px] text-stone-500 font-mono uppercase tracking-widest">Edición Latinoamérica · 980 cromos</p>
            </div>
          </div>
          {coleccionistaActivo && (
            <SelectorColeccionista
              coleccionistas={coleccionistas}
              activo={coleccionistaActivo}
              onCambiar={setColeccionistaActivo}
              onNuevo={crearColeccionista}
              onEliminar={eliminarColeccionista}
            />
          )}
        </div>
      </header>

      {/* Mensaje flotante */}
      {mensaje && (
        <div className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-lg shadow-2xl font-medium text-sm ${
          mensaje.tipo === 'exito' ? 'bg-emerald-600 text-white' :
          mensaje.tipo === 'error' ? 'bg-red-600 text-white' :
          'bg-stone-700 text-stone-100'
        }`}>
          {mensaje.texto}
        </div>
      )}

      {/* Pantalla inicial sin coleccionistas */}
      {coleccionistas.length === 0 ? (
        <PantallaInicial onCrear={crearColeccionista} />
      ) : (
        <>
          {/* Navegación de pestañas */}
          <nav className="border-b border-stone-800 bg-stone-900/50 sticky top-[60px] z-30">
            <div className="max-w-7xl mx-auto px-2 flex overflow-x-auto scrollbar-hide">
              {[
                { id: 'inicio', label: 'Resumen', icon: Home },
                { id: 'pegar', label: 'Pegar Cromos', icon: Plus },
                { id: 'equipos', label: 'Equipos', icon: Users },
                { id: 'faltantes', label: 'Faltantes', icon: AlertCircle },
                { id: 'repetidas', label: 'Repetidas', icon: RefreshCw },
                { id: 'intercambio', label: 'Intercambio', icon: ArrowLeftRight },
                { id: 'especiales', label: 'Especiales', icon: Sparkles },
                { id: 'extra', label: 'Extra Stickers', icon: Star },
                { id: 'cocacola', label: 'Coca-Cola', icon: Layers },
                { id: 'editor', label: 'Editar', icon: Edit3 },
                { id: 'backup', label: 'Backup', icon: Download },
                { id: 'stats', label: 'Estadísticas', icon: BarChart3 },
                { id: 'buscar', label: 'Buscar', icon: Search },
              ].map(t => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.id}
                    onClick={() => { setVista(t.id); setEquipoActivo(null); }}
                    className={`flex items-center gap-2 px-3 py-3 text-xs sm:text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                      vista === t.id 
                        ? 'border-amber-400 text-amber-400' 
                        : 'border-transparent text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {t.label}
                  </button>
                );
              })}
            </div>
          </nav>

          <main className="max-w-7xl mx-auto px-4 py-6 pb-20">
            {vista === 'inicio' && <VistaResumen stats={stats} estadoEquipos={estadoEquipos} onIrEquipo={(cod) => { setEquipoActivo(cod); setVista('equipos'); }} />}
            {vista === 'pegar' && <VistaPegar coleccion={coleccionActual} onGuardar={(c) => guardarColeccion(coleccionistaActivo, c)} mostrarMensaje={mostrarMensaje} />}
            {vista === 'equipos' && (
              equipoActivo 
                ? <VistaDetalleEquipo catalogo={CATALOGO} equipo={SELECCIONES.find(s => s.cod === equipoActivo)} coleccion={coleccionActual} onGuardar={(c) => guardarColeccion(coleccionistaActivo, c)} onVolver={() => setEquipoActivo(null)} />
                : <VistaEquipos estadoEquipos={estadoEquipos} onSeleccionar={setEquipoActivo} />
            )}
            {vista === 'faltantes' && <VistaFaltantes catalogo={CATALOGO} coleccion={coleccionActual} />}
            {vista === 'repetidas' && <VistaRepetidas catalogo={CATALOGO} coleccion={coleccionActual} onGuardar={(c) => guardarColeccion(coleccionistaActivo, c)} />}
            {vista === 'intercambio' && <VistaIntercambio catalogo={CATALOGO} coleccionistas={coleccionistas} colecciones={colecciones} coleccionistaActivo={coleccionistaActivo} />}
            {vista === 'especiales' && <VistaEspeciales catalogo={CATALOGO} coleccion={coleccionActual} onGuardar={(c) => guardarColeccion(coleccionistaActivo, c)} />}
            {vista === 'extra' && <VistaExtra coleccion={coleccionActual} onGuardar={(c) => guardarColeccion(coleccionistaActivo, c)} mostrarMensaje={mostrarMensaje} />}
            {vista === 'cocacola' && <VistaCocaCola coleccion={coleccionActual} onGuardar={(c) => guardarColeccion(coleccionistaActivo, c)} mostrarMensaje={mostrarMensaje} />}
            {vista === 'editor' && <VistaEditor catalogo={CATALOGO} overrides={plantillaOverrides} onGuardarOverrides={guardarOverrides} mostrarMensaje={mostrarMensaje} />}
            {vista === 'backup' && <VistaBackup coleccionistas={coleccionistas} colecciones={colecciones} overrides={plantillaOverrides} coleccionistaActivo={coleccionistaActivo} onImportar={importarBackup} mostrarMensaje={mostrarMensaje} />}
            {vista === 'stats' && <VistaStats catalogo={CATALOGO} coleccion={coleccionActual} estadoEquipos={estadoEquipos} stats={stats} />}
            {vista === 'buscar' && <VistaBuscar catalogo={CATALOGO} coleccion={coleccionActual} onGuardar={(c) => guardarColeccion(coleccionistaActivo, c)} />}
          </main>
        </>
      )}
    </div>
  );
}

// ============================================
// SELECTOR DE COLECCIONISTA
// ============================================

function SelectorColeccionista({ coleccionistas, activo, onCambiar, onNuevo, onEliminar }) {
  const [abierto, setAbierto] = useState(false);
  const [creandoNuevo, setCreandoNuevo] = useState(false);
  const [nombre, setNombre] = useState('');
  const actual = coleccionistas.find(c => c.id === activo);

  return (
    <div className="relative">
      <button
        onClick={() => setAbierto(!abierto)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-stone-800 hover:bg-stone-700 border border-stone-700 text-sm transition-colors"
      >
        <Users className="w-4 h-4 text-amber-400" />
        <span className="max-w-[120px] truncate">{actual?.nombre || 'Seleccionar'}</span>
        <ChevronRight className={`w-4 h-4 transition-transform ${abierto ? 'rotate-90' : ''}`} />
      </button>
      {abierto && (
        <div className="absolute right-0 mt-2 w-64 bg-stone-900 border border-stone-700 rounded-lg shadow-2xl overflow-hidden">
          {coleccionistas.map(c => (
            <div key={c.id} className={`flex items-center justify-between px-3 py-2 hover:bg-stone-800 ${c.id === activo ? 'bg-stone-800' : ''}`}>
              <button
                onClick={() => { onCambiar(c.id); setAbierto(false); }}
                className="flex-1 text-left text-sm"
              >
                {c.nombre}
                {c.id === activo && <Check className="w-4 h-4 inline ml-2 text-amber-400" />}
              </button>
              {coleccionistas.length > 1 && (
                <button
                  onClick={() => { if (confirm(`¿Eliminar a "${c.nombre}"? Se borrará toda su colección.`)) onEliminar(c.id); }}
                  className="p-1 text-stone-500 hover:text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
          {creandoNuevo ? (
            <div className="p-2 border-t border-stone-700">
              <input
                autoFocus
                value={nombre}
                onChange={e => setNombre(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && nombre.trim()) {
                    onNuevo(nombre.trim());
                    setNombre(''); setCreandoNuevo(false); setAbierto(false);
                  }
                  if (e.key === 'Escape') { setCreandoNuevo(false); setNombre(''); }
                }}
                placeholder="Nombre del coleccionista"
                className="w-full px-2 py-1.5 bg-stone-800 border border-stone-600 rounded text-sm"
              />
            </div>
          ) : (
            <button
              onClick={() => setCreandoNuevo(true)}
              className="w-full px-3 py-2 text-left text-sm text-amber-400 hover:bg-stone-800 border-t border-stone-700 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Nuevo coleccionista
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================
// PANTALLA INICIAL (sin coleccionistas)
// ============================================

function PantallaInicial({ onCrear }) {
  const [nombre, setNombre] = useState('');

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <div className="w-20 h-20 mx-auto mb-6 rounded-full gradient-gold flex items-center justify-center">
        <Trophy className="w-10 h-10 text-stone-900" strokeWidth={2} />
      </div>
      <h2 className="font-display text-4xl sm:text-5xl mb-3">BIENVENIDO</h2>
      <p className="text-stone-400 mb-8 max-w-md mx-auto">
        Para empezar, crea tu perfil de coleccionista. Puedes crear varios para tu familia y compartir el progreso.
      </p>
      <div className="max-w-sm mx-auto flex gap-2">
        <input
          value={nombre}
          onChange={e => setNombre(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && nombre.trim() && onCrear(nombre.trim())}
          placeholder="Tu nombre"
          className="flex-1 px-4 py-3 bg-stone-900 border border-stone-700 rounded-lg focus:border-amber-400 focus:outline-none"
        />
        <button
          onClick={() => nombre.trim() && onCrear(nombre.trim())}
          className="px-6 py-3 gradient-gold text-stone-900 font-semibold rounded-lg hover:opacity-90"
        >
          Crear
        </button>
      </div>
    </div>
  );
}

// ============================================
// VISTA: RESUMEN
// ============================================

function VistaResumen({ stats, estadoEquipos, onIrEquipo }) {
  return (
    <div className="space-y-6">
      {/* Hero stat */}
      <div className="gradient-card border border-stone-800 rounded-2xl p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 gradient-pitch opacity-10 blur-3xl rounded-full -mr-32 -mt-32" />
        <div className="relative">
          <p className="text-stone-500 text-xs font-mono uppercase tracking-widest mb-2">Tu álbum</p>
          <div className="flex items-baseline gap-3 mb-4">
            <span className="font-display text-6xl sm:text-7xl text-amber-400">{stats.tengo}</span>
            <span className="font-display text-2xl text-stone-500">/ {stats.total}</span>
            <span className="font-mono text-lg text-emerald-400">{stats.porcentaje.toFixed(1)}%</span>
          </div>
          <div className="w-full h-3 bg-stone-800 rounded-full overflow-hidden">
            <div 
              className="h-full gradient-gold transition-all duration-1000 ease-out"
              style={{ width: `${stats.porcentaje}%` }}
            />
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mt-6">
            <Stat label="Tengo" valor={stats.tengo} color="text-emerald-400" />
            <Stat label="Faltan" valor={stats.faltan} color="text-red-400" />
            <Stat label="Repetidas" valor={stats.repetidas} color="text-amber-400" />
            <Stat label="Foils" valor={`${stats.foilsTengo}/${stats.foilsTotal}`} color="text-purple-400" />
            <Stat label="Extra" valor={`${stats.extraTengo}/${stats.extraTotal}`} color="text-fuchsia-400" />
            <Stat label="Coca-Cola" valor={`${stats.cocaTengo}/${stats.cocaTotal}`} color="text-red-500" />
          </div>
        </div>
      </div>

      {/* Equipos */}
      <div>
        <h3 className="font-display text-2xl mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-amber-400" />
          Selecciones
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {estadoEquipos.map(eq => (
            <button
              key={eq.cod}
              onClick={() => onIrEquipo(eq.cod)}
              className={`text-left p-3 rounded-lg border transition-all hover:scale-[1.02] ${
                eq.porcentaje === 100 
                  ? 'bg-emerald-950/40 border-emerald-700' 
                  : eq.porcentaje > 0 
                    ? 'bg-stone-900 border-stone-700 hover:border-amber-600' 
                    : 'bg-stone-900/50 border-stone-800 hover:border-stone-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-mono text-stone-500">{eq.grupo}{eq.orden}</span>
                {eq.porcentaje === 100 && <Check className="w-4 h-4 text-emerald-400" />}
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{eq.bandera}</span>
                <span className="text-xs font-bold uppercase tracking-wide truncate">{eq.cod}</span>
              </div>
              <div className="text-xs text-stone-400 mb-1.5 truncate">{eq.nombre}</div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-stone-500">{eq.tengo}/{eq.total}</span>
                <span className={`font-mono ${eq.porcentaje === 100 ? 'text-emerald-400' : eq.porcentaje > 50 ? 'text-amber-400' : 'text-stone-500'}`}>
                  {eq.porcentaje.toFixed(0)}%
                </span>
              </div>
              <div className="w-full h-1 bg-stone-800 rounded-full mt-2 overflow-hidden">
                <div 
                  className={`h-full transition-all ${eq.porcentaje === 100 ? 'bg-emerald-500' : 'gradient-gold'}`}
                  style={{ width: `${eq.porcentaje}%` }}
                />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, valor, color }) {
  return (
    <div>
      <div className={`font-display text-2xl ${color}`}>{valor}</div>
      <div className="text-[10px] uppercase tracking-widest text-stone-500 font-mono">{label}</div>
    </div>
  );
}

// ============================================
// VISTA: PEGAR CROMOS
// ============================================

function VistaPegar({ coleccion, onGuardar, mostrarMensaje }) {
  const [texto, setTexto] = useState('');
  const [resultado, setResultado] = useState(null);

  function procesar() {
    const { validos, invalidos } = parsearEntrada(texto);
    if (validos.length === 0) {
      mostrarMensaje('No se reconoció ningún código válido', 'error');
      return;
    }

    const nueva = { ...coleccion };
    let nuevos = 0, repetidos = 0;
    
    validos.forEach(cod => {
      if (!nueva[cod] || nueva[cod] === 0) {
        nueva[cod] = 1;
        nuevos++;
      } else {
        nueva[cod] = nueva[cod] + 1;
        repetidos++;
      }
    });
    
    onGuardar(nueva);
    setResultado({ nuevos, repetidos, invalidos, validos: validos.length });
    setTexto('');
    mostrarMensaje(`✓ ${nuevos} nuevas + ${repetidos} repetidas`, 'exito');
  }

  return (
    <div className="space-y-4 max-w-3xl">
      <div>
        <h2 className="font-display text-3xl mb-2">PEGAR CROMOS</h2>
        <p className="text-stone-400 text-sm">
          Escribe los códigos de tus cromos separados por comas, espacios o saltos de línea. Si pegas el mismo código varias veces, se cuenta como repetida.
        </p>
      </div>

      <div className="bg-stone-900/50 border border-stone-700 rounded-xl p-4">
        <p className="text-xs text-stone-500 mb-2 font-mono uppercase tracking-wider">Ejemplos válidos:</p>
        <div className="flex flex-wrap gap-2">
          {['COL1', 'ARG17', 'MEX1', 'FWC3', '00', 'BRA13'].map(e => (
            <code key={e} className="px-2 py-1 bg-stone-800 rounded text-amber-400 text-xs font-mono">{e}</code>
          ))}
        </div>
      </div>

      <textarea
        value={texto}
        onChange={e => setTexto(e.target.value)}
        placeholder="COL1, COL5, ARG17, MEX1 MEX1 (repetida)&#10;FWC3&#10;BRA1, BRA13, BRA20"
        rows={8}
        className="w-full px-4 py-3 bg-stone-900 border border-stone-700 rounded-lg focus:border-amber-400 focus:outline-none font-mono text-sm"
      />

      <div className="flex gap-2">
        <button
          onClick={procesar}
          disabled={!texto.trim()}
          className="px-6 py-3 gradient-gold text-stone-900 font-semibold rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-90"
        >
          Pegar al álbum
        </button>
        <button
          onClick={() => { setTexto(''); setResultado(null); }}
          className="px-6 py-3 bg-stone-800 hover:bg-stone-700 rounded-lg text-stone-300"
        >
          Limpiar
        </button>
      </div>

      {resultado && (
        <div className="bg-stone-900 border border-stone-700 rounded-xl p-4 space-y-2">
          <h3 className="font-display text-xl">Resultado</h3>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-emerald-950/40 border border-emerald-800 rounded-lg p-3">
              <div className="font-display text-3xl text-emerald-400">{resultado.nuevos}</div>
              <div className="text-xs text-stone-400 mt-1">Nuevas</div>
            </div>
            <div className="bg-amber-950/40 border border-amber-800 rounded-lg p-3">
              <div className="font-display text-3xl text-amber-400">{resultado.repetidos}</div>
              <div className="text-xs text-stone-400 mt-1">Repetidas</div>
            </div>
            <div className="bg-red-950/40 border border-red-800 rounded-lg p-3">
              <div className="font-display text-3xl text-red-400">{resultado.invalidos.length}</div>
              <div className="text-xs text-stone-400 mt-1">No reconocidas</div>
            </div>
          </div>
          {resultado.invalidos.length > 0 && (
            <div className="mt-2 pt-2 border-t border-stone-800">
              <p className="text-xs text-stone-500 mb-1">Códigos no reconocidos:</p>
              <div className="flex flex-wrap gap-1">
                {resultado.invalidos.map((c, i) => (
                  <code key={i} className="px-2 py-0.5 bg-red-950/30 border border-red-900 rounded text-red-400 text-xs">{c}</code>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================
// VISTA: EQUIPOS (GRID)
// ============================================

function VistaEquipos({ estadoEquipos, onSeleccionar }) {
  const [filtroGrupo, setFiltroGrupo] = useState('TODOS');
  const grupos = ['TODOS', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
  const filtrados = filtroGrupo === 'TODOS' ? estadoEquipos : estadoEquipos.filter(e => e.grupo === filtroGrupo);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-display text-3xl mb-2">SELECCIONES</h2>
        <p className="text-stone-400 text-sm">48 equipos · Toca uno para ver el detalle de sus 20 cromos</p>
      </div>
      
      <div className="flex gap-1 overflow-x-auto pb-1">
        {grupos.map(g => (
          <button
            key={g}
            onClick={() => setFiltroGrupo(g)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold whitespace-nowrap transition-colors ${
              filtroGrupo === g 
                ? 'gradient-gold text-stone-900' 
                : 'bg-stone-800 text-stone-400 hover:bg-stone-700'
            }`}
          >
            {g === 'TODOS' ? 'TODOS' : `GRUPO ${g}`}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtrados.map(eq => (
          <button
            key={eq.cod}
            onClick={() => onSeleccionar(eq.cod)}
            className={`text-left p-4 rounded-xl border transition-all hover:border-amber-600 ${
              eq.porcentaje === 100 
                ? 'bg-emerald-950/30 border-emerald-700' 
                : 'bg-stone-900 border-stone-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-stone-500">GRUPO {eq.grupo} · #{eq.orden}</span>
              {eq.porcentaje === 100 && (
                <span className="text-xs bg-emerald-500 text-stone-900 px-2 py-0.5 rounded-full font-bold">COMPLETO</span>
              )}
            </div>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-4xl">{eq.bandera}</span>
              <div>
                <div className="font-display text-xl">{eq.nombre}</div>
                <div className="text-xs font-mono text-stone-500">{eq.cod}1 — {eq.cod}20</div>
              </div>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-mono">{eq.tengo}/{eq.total}</span>
              <span className={`text-sm font-mono ${eq.porcentaje === 100 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {eq.porcentaje.toFixed(0)}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-stone-800 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all ${eq.porcentaje === 100 ? 'bg-emerald-500' : 'gradient-gold'}`}
                style={{ width: `${eq.porcentaje}%` }}
              />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ============================================
// VISTA: DETALLE EQUIPO
// ============================================

function VistaDetalleEquipo({ catalogo, equipo, coleccion, onGuardar, onVolver }) {
  const cromos = catalogo.filter(c => c.codPais === equipo.cod);

  function toggle(cod) {
    const nueva = { ...coleccion };
    if (nueva[cod] > 0) {
      delete nueva[cod];
    } else {
      nueva[cod] = 1;
    }
    onGuardar(nueva);
  }

  function ajustar(cod, delta) {
    const nueva = { ...coleccion };
    const actual = nueva[cod] || 0;
    const nuevo = Math.max(0, actual + delta);
    if (nuevo === 0) delete nueva[cod];
    else nueva[cod] = nuevo;
    onGuardar(nueva);
  }

  const tengo = cromos.filter(c => coleccion[c.codigo] > 0).length;

  return (
    <div className="space-y-4">
      <button onClick={onVolver} className="flex items-center gap-1 text-amber-400 hover:text-amber-300 text-sm font-medium">
        <ChevronRight className="w-4 h-4 rotate-180" /> Volver a equipos
      </button>

      <div className="bg-stone-900 border border-stone-700 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className="text-5xl">{equipo.bandera}</span>
            <div>
              <h2 className="font-display text-3xl">{equipo.nombre}</h2>
              <p className="text-xs text-stone-500 font-mono">GRUPO {equipo.grupo} · POSICIÓN {equipo.orden} · CÓDIGO {equipo.cod}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="font-display text-3xl text-amber-400">{tengo}/20</div>
            <div className="text-xs text-stone-500">{((tengo/20)*100).toFixed(0)}%</div>
          </div>
        </div>
        <div className="w-full h-2 bg-stone-800 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all ${tengo === 20 ? 'bg-emerald-500' : 'gradient-gold'}`}
            style={{ width: `${(tengo/20)*100}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {cromos.map(c => {
          const cantidad = coleccion[c.codigo] || 0;
          const tiene = cantidad > 0;
          return (
            <div
              key={c.codigo}
              className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                tiene 
                  ? c.foil 
                    ? 'bg-amber-950/30 border-amber-700' 
                    : 'bg-emerald-950/20 border-emerald-800' 
                  : 'bg-stone-900 border-stone-800'
              }`}
            >
              <button
                onClick={() => toggle(c.codigo)}
                className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center font-mono text-xs font-bold transition-colors ${
                  tiene 
                    ? c.foil 
                      ? 'foil-shine text-stone-900' 
                      : 'bg-emerald-500 text-stone-900'
                    : 'bg-stone-800 text-stone-500 hover:bg-stone-700'
                }`}
              >
                {c.posicion}
              </button>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <code className="text-xs text-stone-500 font-mono">{c.codigo}</code>
                  {c.foil && <Sparkles className="w-3 h-3 text-amber-400" />}
                  {c.esEscudo && <span className="text-[10px] text-stone-500 font-mono uppercase">escudo</span>}
                  {c.esFotoGrupal && <span className="text-[10px] text-stone-500 font-mono uppercase">foto grupal</span>}
                </div>
                <div className={`text-sm truncate ${tiene ? 'text-stone-100' : 'text-stone-500'}`}>{c.nombre}</div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={() => ajustar(c.codigo, -1)}
                  disabled={cantidad === 0}
                  className="w-7 h-7 rounded bg-stone-800 hover:bg-stone-700 disabled:opacity-30 text-stone-400 text-sm"
                >
                  −
                </button>
                <span className={`w-6 text-center font-mono text-sm font-bold ${tiene ? 'text-amber-400' : 'text-stone-600'}`}>{cantidad}</span>
                <button
                  onClick={() => ajustar(c.codigo, 1)}
                  className="w-7 h-7 rounded bg-stone-800 hover:bg-stone-700 text-stone-400 text-sm"
                >
                  +
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================
// VISTA: FALTANTES
// ============================================

function VistaFaltantes({ catalogo, coleccion }) {
  const [filtro, setFiltro] = useState('TODAS');
  
  const faltantes = useMemo(() => {
    return catalogo.filter(c => !coleccion[c.codigo] || coleccion[c.codigo] === 0);
  }, [coleccion, catalogo]);

  const filtradas = useMemo(() => {
    if (filtro === 'TODAS') return faltantes;
    if (filtro === 'INTRO') return faltantes.filter(c => c.seccion === 'INTRO');
    if (filtro === 'MUSEUM') return faltantes.filter(c => c.seccion === 'FIFA_MUSEUM');
    if (filtro === 'FOILS') return faltantes.filter(c => c.foil);
    return faltantes.filter(c => c.codPais === filtro);
  }, [faltantes, filtro]);

  // Agrupar por equipo si el filtro es de selección o todas
  const agrupadas = useMemo(() => {
    const grupos = {};
    filtradas.forEach(c => {
      const key = c.codPais || c.seccion;
      if (!grupos[key]) grupos[key] = [];
      grupos[key].push(c);
    });
    return grupos;
  }, [filtradas]);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-display text-3xl mb-2">FALTANTES</h2>
        <p className="text-stone-400 text-sm">
          <span className="font-mono text-red-400 font-bold">{faltantes.length}</span> cromos por conseguir
        </p>
      </div>

      <div className="flex gap-1 overflow-x-auto pb-1">
        {[
          { id: 'TODAS', lab: 'TODAS' },
          { id: 'FOILS', lab: 'FOILS' },
          { id: 'INTRO', lab: 'INTRO' },
          { id: 'MUSEUM', lab: 'MUSEUM' },
          ...SELECCIONES.map(s => ({ id: s.cod, lab: `${s.bandera} ${s.cod}` }))
        ].map(f => (
          <button
            key={f.id}
            onClick={() => setFiltro(f.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold whitespace-nowrap transition-colors ${
              filtro === f.id ? 'gradient-gold text-stone-900' : 'bg-stone-800 text-stone-400 hover:bg-stone-700'
            }`}
          >
            {f.lab}
          </button>
        ))}
      </div>

      {filtradas.length === 0 ? (
        <div className="text-center py-12">
          <Trophy className="w-12 h-12 mx-auto mb-3 text-emerald-400" />
          <p className="font-display text-2xl text-emerald-400">¡COMPLETO!</p>
          <p className="text-stone-400 text-sm">No te falta ningún cromo en esta categoría</p>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(agrupadas).map(([grupo, cromos]) => {
            const sel = SELECCIONES.find(s => s.cod === grupo);
            const titulo = sel ? `${sel.bandera} ${sel.nombre}` : grupo;
            return (
              <div key={grupo} className="bg-stone-900 border border-stone-800 rounded-lg overflow-hidden">
                <div className="px-4 py-2 bg-stone-800/50 border-b border-stone-800 flex justify-between">
                  <span className="font-display text-lg">{titulo}</span>
                  <span className="font-mono text-sm text-red-400">{cromos.length} faltan</span>
                </div>
                <div className="p-2 flex flex-wrap gap-1">
                  {cromos.map(c => (
                    <div 
                      key={c.codigo} 
                      title={c.nombre}
                      className={`px-2 py-1 rounded text-xs font-mono ${c.foil ? 'bg-amber-950/30 border border-amber-800 text-amber-400' : 'bg-stone-800 text-stone-400'}`}
                    >
                      {c.codigo}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ============================================
// VISTA: REPETIDAS
// ============================================

function VistaRepetidas({ catalogo, coleccion, onGuardar }) {
  const repetidas = useMemo(() => {
    return catalogo
      .map(c => ({ ...c, cantidad: coleccion[c.codigo] || 0 }))
      .filter(c => c.cantidad > 1)
      .sort((a, b) => b.cantidad - a.cantidad);
  }, [coleccion, catalogo]);

  const totalReps = repetidas.reduce((acc, c) => acc + (c.cantidad - 1), 0);

  function quitar(cod) {
    const nueva = { ...coleccion };
    nueva[cod] = nueva[cod] - 1;
    if (nueva[cod] === 0) delete nueva[cod];
    onGuardar(nueva);
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-display text-3xl mb-2">REPETIDAS</h2>
        <p className="text-stone-400 text-sm">
          <span className="font-mono text-amber-400 font-bold">{totalReps}</span> cromos sobrantes para intercambiar (usa el botón "−" para quitar uno cuando lo regales/cambies)
        </p>
      </div>

      {repetidas.length === 0 ? (
        <div className="text-center py-12 bg-stone-900/50 border border-stone-800 rounded-xl">
          <RefreshCw className="w-12 h-12 mx-auto mb-3 text-stone-600" />
          <p className="text-stone-400">No tienes cromos repetidos todavía</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {repetidas.map(c => {
            const sel = SELECCIONES.find(s => s.cod === c.codPais);
            return (
              <div key={c.codigo} className={`flex items-center gap-3 p-3 rounded-lg border ${c.foil ? 'bg-amber-950/30 border-amber-800' : 'bg-stone-900 border-stone-800'}`}>
                <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center font-mono text-xs font-bold ${c.foil ? 'foil-shine text-stone-900' : 'bg-stone-800 text-amber-400'}`}>
                  ×{c.cantidad - 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <code className="text-sm font-mono font-bold text-amber-400">{c.codigo}</code>
                    {c.foil && <Sparkles className="w-3 h-3 text-amber-400" />}
                  </div>
                  <div className="text-xs text-stone-400 truncate">
                    {sel && `${sel.bandera} `}{c.nombre}
                  </div>
                </div>
                <button
                  onClick={() => quitar(c.codigo)}
                  className="flex-shrink-0 px-3 py-1.5 bg-stone-800 hover:bg-red-900 text-stone-300 rounded text-xs font-medium"
                >
                  − 1
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ============================================
// VISTA: INTERCAMBIO ENTRE COLECCIONISTAS
// ============================================

function VistaIntercambio({ catalogo, coleccionistas, colecciones, coleccionistaActivo }) {
  const miColeccion = colecciones[coleccionistaActivo] || {};
  const otros = coleccionistas.filter(c => c.id !== coleccionistaActivo);
  const [otroActivo, setOtroActivo] = useState(otros[0]?.id || null);

  if (coleccionistas.length < 2) {
    return (
      <div className="text-center py-12 bg-stone-900/50 border border-stone-800 rounded-xl">
        <ArrowLeftRight className="w-12 h-12 mx-auto mb-3 text-stone-600" />
        <p className="font-display text-2xl mb-2">INTERCAMBIOS</p>
        <p className="text-stone-400 text-sm max-w-md mx-auto">
          Crea más coleccionistas (familia, amigos) en el selector de arriba para ver intercambios posibles entre ustedes.
        </p>
      </div>
    );
  }

  const otroColeccion = colecciones[otroActivo] || {};

  // Cromos que YO tengo repetidos y OTRO no tiene
  const yoOfrezco = catalogo.filter(c => 
    (miColeccion[c.codigo] || 0) > 1 && (otroColeccion[c.codigo] || 0) === 0
  );

  // Cromos que OTRO tiene repetidos y YO no tengo
  const yoNecesito = catalogo.filter(c =>
    (otroColeccion[c.codigo] || 0) > 1 && (miColeccion[c.codigo] || 0) === 0
  );

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-display text-3xl mb-2">INTERCAMBIO</h2>
        <p className="text-stone-400 text-sm">
          Cromos que tú tienes de sobra y a otra persona le faltan, y viceversa.
        </p>
      </div>

      <div className="flex gap-1 overflow-x-auto pb-1">
        {otros.map(c => (
          <button
            key={c.id}
            onClick={() => setOtroActivo(c.id)}
            className={`px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
              otroActivo === c.id ? 'gradient-gold text-stone-900' : 'bg-stone-800 text-stone-400 hover:bg-stone-700'
            }`}
          >
            Con {c.nombre}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-emerald-950/20 border border-emerald-800 rounded-xl overflow-hidden">
          <div className="px-4 py-3 bg-emerald-950/40 border-b border-emerald-800 flex justify-between items-center">
            <span className="font-display text-lg text-emerald-400">YO OFREZCO →</span>
            <span className="font-mono text-sm text-emerald-300">{yoOfrezco.length}</span>
          </div>
          <div className="p-3 max-h-96 overflow-y-auto">
            {yoOfrezco.length === 0 ? (
              <p className="text-stone-500 text-sm text-center py-8">No tienes repetidas que le falten</p>
            ) : (
              <div className="flex flex-wrap gap-1">
                {yoOfrezco.map(c => (
                  <div key={c.codigo} title={c.nombre} className={`px-2 py-1 rounded text-xs font-mono ${c.foil ? 'bg-amber-950/40 border border-amber-700 text-amber-300' : 'bg-stone-800 text-emerald-300'}`}>
                    {c.codigo}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-red-950/20 border border-red-800 rounded-xl overflow-hidden">
          <div className="px-4 py-3 bg-red-950/40 border-b border-red-800 flex justify-between items-center">
            <span className="font-display text-lg text-red-400">← YO NECESITO</span>
            <span className="font-mono text-sm text-red-300">{yoNecesito.length}</span>
          </div>
          <div className="p-3 max-h-96 overflow-y-auto">
            {yoNecesito.length === 0 ? (
              <p className="text-stone-500 text-sm text-center py-8">No tiene repetidas que tú necesites</p>
            ) : (
              <div className="flex flex-wrap gap-1">
                {yoNecesito.map(c => (
                  <div key={c.codigo} title={c.nombre} className={`px-2 py-1 rounded text-xs font-mono ${c.foil ? 'bg-amber-950/40 border border-amber-700 text-amber-300' : 'bg-stone-800 text-red-300'}`}>
                    {c.codigo}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// VISTA: ESPECIALES (foils, intro, museum)
// ============================================

function VistaEspeciales({ catalogo, coleccion, onGuardar }) {
  function toggle(cod) {
    const nueva = { ...coleccion };
    if (nueva[cod] > 0) delete nueva[cod];
    else nueva[cod] = 1;
    onGuardar(nueva);
  }

  function ajustar(cod, delta) {
    const nueva = { ...coleccion };
    const actual = nueva[cod] || 0;
    const nuevo = Math.max(0, actual + delta);
    if (nuevo === 0) delete nueva[cod];
    else nueva[cod] = nuevo;
    onGuardar(nueva);
  }

  const intro = catalogo.filter(c => c.seccion === 'INTRO');
  const museum = catalogo.filter(c => c.seccion === 'FIFA_MUSEUM');

  function renderSeccion(titulo, cromos, descripcion) {
    const tengo = cromos.filter(c => coleccion[c.codigo] > 0).length;
    return (
      <div className="bg-stone-900 border border-amber-900/50 rounded-xl overflow-hidden">
        <div className="px-4 py-3 bg-gradient-to-r from-amber-950/40 to-stone-900 border-b border-amber-900/50 flex justify-between items-center">
          <div>
            <div className="font-display text-xl flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" /> {titulo}
            </div>
            <p className="text-xs text-stone-400">{descripcion}</p>
          </div>
          <div className="font-mono text-amber-400 font-bold">{tengo}/{cromos.length}</div>
        </div>
        <div className="p-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
          {cromos.map(c => {
            const cant = coleccion[c.codigo] || 0;
            const tiene = cant > 0;
            return (
              <div key={c.codigo} className={`flex items-center gap-2 p-2 rounded-lg border ${tiene ? 'bg-amber-950/30 border-amber-700' : 'bg-stone-900 border-stone-800'}`}>
                <button
                  onClick={() => toggle(c.codigo)}
                  className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center font-mono text-[10px] font-bold ${tiene ? 'foil-shine text-stone-900' : 'bg-stone-800 text-stone-500'}`}
                >
                  {c.codigo}
                </button>
                <div className="flex-1 min-w-0 text-sm">{c.nombre}</div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => ajustar(c.codigo, -1)} disabled={cant === 0} className="w-6 h-6 rounded bg-stone-800 hover:bg-stone-700 disabled:opacity-30 text-xs">−</button>
                  <span className="w-5 text-center font-mono text-xs">{cant}</span>
                  <button onClick={() => ajustar(c.codigo, 1)} className="w-6 h-6 rounded bg-stone-800 hover:bg-stone-700 text-xs">+</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-display text-3xl mb-2">CROMOS ESPECIALES</h2>
        <p className="text-stone-400 text-sm">Las 20 láminas foil de la sección de portada y FIFA Museum (campeones históricos)</p>
      </div>
      {renderSeccion('INTRO & SÍMBOLOS', intro, '9 cromos foil: logo Panini, emblema, mascotas, balón, sedes')}
      {renderSeccion('FIFA MUSEUM', museum, '11 cromos foil con los campeones históricos del Mundial')}
    </div>
  );
}

// ============================================
// VISTA: BUSCAR
// ============================================

function VistaBuscar({ catalogo, coleccion, onGuardar }) {
  const [query, setQuery] = useState('');
  
  const resultados = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toUpperCase().trim();
    return catalogo.filter(c => 
      c.codigo.includes(q) || 
      c.nombre.toUpperCase().includes(q) ||
      (c.codPais && c.codPais.includes(q))
    ).slice(0, 50);
  }, [query, catalogo]);

  function toggle(cod) {
    const nueva = { ...coleccion };
    if (nueva[cod] > 0) delete nueva[cod];
    else nueva[cod] = 1;
    onGuardar(nueva);
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-display text-3xl mb-2">BUSCAR CROMO</h2>
        <p className="text-stone-400 text-sm">Por código (COL14), por nombre del jugador (Messi), por país (ARG)</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-500" />
        <input
          autoFocus
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Messi, COL14, james, arg..."
          className="w-full pl-10 pr-4 py-3 bg-stone-900 border border-stone-700 rounded-lg focus:border-amber-400 focus:outline-none"
        />
      </div>

      {query && (
        <div className="text-xs text-stone-500 font-mono">
          {resultados.length} resultado{resultados.length !== 1 ? 's' : ''}{resultados.length === 50 && ' (mostrando primeros 50)'}
        </div>
      )}

      <div className="space-y-1">
        {resultados.map(c => {
          const cantidad = coleccion[c.codigo] || 0;
          const tiene = cantidad > 0;
          const sel = SELECCIONES.find(s => s.cod === c.codPais);
          return (
            <button
              key={c.codigo}
              onClick={() => toggle(c.codigo)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-colors ${
                tiene 
                  ? c.foil ? 'bg-amber-950/30 border-amber-700' : 'bg-emerald-950/20 border-emerald-800'
                  : 'bg-stone-900 border-stone-800 hover:border-stone-700'
              }`}
            >
              <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center font-mono text-[10px] font-bold ${
                tiene ? c.foil ? 'foil-shine text-stone-900' : 'bg-emerald-500 text-stone-900' : 'bg-stone-800 text-stone-500'
              }`}>
                {c.codigo}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium">{c.nombre}</span>
                  {c.foil && <Sparkles className="w-3 h-3 text-amber-400" />}
                </div>
                <div className="text-xs text-stone-500 font-mono">
                  {sel ? `${sel.bandera} ${sel.nombre} · GRUPO ${sel.grupo}` : c.seccion}
                  {cantidad > 0 && ` · ×${cantidad}`}
                </div>
              </div>
              {tiene && <Check className="w-5 h-5 text-emerald-400 flex-shrink-0" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ============================================
// VISTA: EXTRA STICKERS
// 20 jugadores × 4 colores = 80 cromos especiales
// ============================================

function VistaExtra({ coleccion, onGuardar, mostrarMensaje }) {
  const [filtroColor, setFiltroColor] = useState('TODOS');
  const [vistaActual, setVistaActual] = useState('grid'); // 'grid' o 'pegar'
  const [textoPegar, setTextoPegar] = useState('');

  // Toggle individual de Extra Sticker
  function toggle(id) {
    const nueva = { ...coleccion };
    const claveExtra = `EX_${id}`;
    if (nueva[claveExtra] > 0) {
      delete nueva[claveExtra];
    } else {
      nueva[claveExtra] = 1;
    }
    onGuardar(nueva);
  }

  function ajustar(id, delta) {
    const nueva = { ...coleccion };
    const claveExtra = `EX_${id}`;
    const actual = nueva[claveExtra] || 0;
    const nuevo = Math.max(0, actual + delta);
    if (nuevo === 0) delete nueva[claveExtra];
    else nueva[claveExtra] = nuevo;
    onGuardar(nueva);
  }

  // Pegado masivo de Extra Stickers
  function procesarPegado() {
    const tokens = textoPegar.split(/[,;\n\r\t]+/).map(t => t.trim()).filter(Boolean);
    const validos = [];
    const invalidos = [];

    tokens.forEach(t => {
      const sub = t.split(/\s+/).filter(Boolean);
      sub.forEach(s => {
        // Acepta formatos: ARG_GOL, ARG-GOL, ARG GOL, MESSI ORO, etc.
        const limpio = s.toUpperCase().replace(/[\s\-_.]/g, '');
        // Buscar por id directo
        const directo = EXTRA_STICKERS.find(e => `${e.codPais}${e.color}` === limpio);
        if (directo) {
          validos.push(directo.id);
          return;
        }
        invalidos.push(s);
      });
    });

    if (validos.length === 0) {
      mostrarMensaje('No se reconoció ningún Extra Sticker. Usa formato: ARG_GOL, COL_BRO, MEX_REG', 'error');
      return;
    }

    const nueva = { ...coleccion };
    let nuevos = 0, repetidos = 0;
    validos.forEach(id => {
      const clave = `EX_${id}`;
      if (!nueva[clave] || nueva[clave] === 0) {
        nueva[clave] = 1;
        nuevos++;
      } else {
        nueva[clave] = nueva[clave] + 1;
        repetidos++;
      }
    });
    onGuardar(nueva);
    setTextoPegar('');
    mostrarMensaje(`✓ ${nuevos} Extra nuevos + ${repetidos} repetidos`, 'exito');
  }

  // Filtrar por color
  const stickers = useMemo(() => {
    if (filtroColor === 'TODOS') return EXTRA_STICKERS;
    return EXTRA_STICKERS.filter(e => e.color === filtroColor);
  }, [filtroColor]);

  // Estadísticas
  const stats = useMemo(() => {
    const tengo = EXTRA_STICKERS.filter(e => (coleccion[`EX_${e.id}`] || 0) > 0).length;
    const totalPegados = EXTRA_STICKERS.reduce((acc, e) => acc + (coleccion[`EX_${e.id}`] || 0), 0);
    const repetidos = totalPegados - tengo;
    
    const porColor = {};
    EXTRA_COLORES.forEach(c => {
      const total = EXTRA_STICKERS.filter(e => e.color === c.code).length;
      const t = EXTRA_STICKERS.filter(e => e.color === c.code && (coleccion[`EX_${e.id}`] || 0) > 0).length;
      porColor[c.code] = { tengo: t, total, porc: (t / total) * 100 };
    });
    
    return { tengo, total: EXTRA_STICKERS.length, repetidos, porColor };
  }, [coleccion]);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-display text-3xl mb-2 flex items-center gap-2">
          <Star className="w-7 h-7 text-amber-400" /> EXTRA STICKERS
        </h2>
        <p className="text-stone-400 text-sm">
          80 cromos especiales (20 jugadores × 4 colores). NO van pegados en el álbum. Frecuencia: ~1 cada 100 sobres.
        </p>
      </div>

      {/* Hero stats */}
      <div className="bg-gradient-to-br from-fuchsia-950/40 via-stone-900 to-amber-950/30 border border-amber-900/40 rounded-2xl p-5">
        <div className="flex items-baseline gap-3 mb-4">
          <span className="font-display text-5xl text-amber-400">{stats.tengo}</span>
          <span className="font-display text-xl text-stone-500">/ {stats.total}</span>
          <span className="font-mono text-base text-emerald-400 ml-auto">{((stats.tengo/stats.total)*100).toFixed(1)}%</span>
        </div>
        <div className="w-full h-2 bg-stone-800 rounded-full overflow-hidden mb-4">
          <div className="h-full gradient-gold transition-all duration-700" style={{ width: `${(stats.tengo/stats.total)*100}%` }} />
        </div>
        <div className="grid grid-cols-4 gap-2 text-center">
          {EXTRA_COLORES.map(c => {
            const s = stats.porColor[c.code];
            return (
              <div key={c.code} className={`rounded-lg p-2 border ${c.tailwindBorder} ${c.tailwindBg}/20`}>
                <div className="text-lg">{c.emoji}</div>
                <div className="font-mono text-sm font-bold">{s.tengo}/{s.total}</div>
                <div className="text-[10px] uppercase tracking-wider text-stone-400">{c.nombreEs}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Toggle vista */}
      <div className="flex gap-1">
        <button
          onClick={() => setVistaActual('grid')}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${vistaActual === 'grid' ? 'gradient-gold text-stone-900' : 'bg-stone-800 text-stone-400'}`}
        >
          Lista
        </button>
        <button
          onClick={() => setVistaActual('pegar')}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${vistaActual === 'pegar' ? 'gradient-gold text-stone-900' : 'bg-stone-800 text-stone-400'}`}
        >
          Pegado masivo
        </button>
      </div>

      {vistaActual === 'pegar' && (
        <div className="space-y-3 bg-stone-900/50 border border-stone-700 rounded-xl p-4">
          <p className="text-sm text-stone-300">
            Escribe los Extra Stickers que tienes. Formato: <code className="px-1.5 py-0.5 bg-stone-800 rounded text-amber-400 text-xs">CÓDIGO_COLOR</code> separados por comas, espacios o saltos de línea.
          </p>
          <div className="flex flex-wrap gap-2">
            <code className="px-2 py-1 bg-stone-800 rounded text-amber-400 text-xs font-mono">ARG_GOL</code>
            <span className="text-xs text-stone-500">= Messi Oro</span>
            <code className="px-2 py-1 bg-stone-800 rounded text-amber-400 text-xs font-mono">COL_BRO</code>
            <span className="text-xs text-stone-500">= Luis Díaz Bronce</span>
            <code className="px-2 py-1 bg-stone-800 rounded text-amber-400 text-xs font-mono">MEX_REG</code>
            <span className="text-xs text-stone-500">= Raúl Jiménez Morado</span>
          </div>
          <textarea
            value={textoPegar}
            onChange={e => setTextoPegar(e.target.value)}
            placeholder="ARG_GOL, COL_BRO, MEX_REG&#10;ESP_SIL"
            rows={5}
            className="w-full px-3 py-2 bg-stone-900 border border-stone-700 rounded-lg focus:border-amber-400 focus:outline-none font-mono text-sm"
          />
          <div className="flex gap-2">
            <button
              onClick={procesarPegado}
              disabled={!textoPegar.trim()}
              className="px-5 py-2 gradient-gold text-stone-900 font-semibold rounded-lg disabled:opacity-30"
            >
              Pegar Extra
            </button>
            <button
              onClick={() => setTextoPegar('')}
              className="px-5 py-2 bg-stone-800 hover:bg-stone-700 rounded-lg text-stone-300"
            >
              Limpiar
            </button>
          </div>
        </div>
      )}

      {vistaActual === 'grid' && (
        <>
          {/* Filtro por color */}
          <div className="flex gap-1 overflow-x-auto pb-1">
            <button
              onClick={() => setFiltroColor('TODOS')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold whitespace-nowrap ${
                filtroColor === 'TODOS' ? 'gradient-gold text-stone-900' : 'bg-stone-800 text-stone-400'
              }`}
            >
              TODOS · 80
            </button>
            {EXTRA_COLORES.map(c => (
              <button
                key={c.code}
                onClick={() => setFiltroColor(c.code)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold whitespace-nowrap flex items-center gap-1 ${
                  filtroColor === c.code ? 'gradient-gold text-stone-900' : 'bg-stone-800 text-stone-400'
                }`}
              >
                <span>{c.emoji}</span> {c.nombreEs.toUpperCase()} · 20
              </button>
            ))}
          </div>

          {/* Grid de stickers agrupados por jugador */}
          <div className="space-y-3">
            {EXTRA_JUGADORES.map(j => {
              const sel = SELECCIONES.find(s => s.cod === j.codPais);
              const versiones = EXTRA_STICKERS.filter(e => e.codPais === j.codPais);
              const versionesFiltradas = filtroColor === 'TODOS' ? versiones : versiones.filter(v => v.color === filtroColor);
              if (versionesFiltradas.length === 0) return null;
              const tieneAlguno = versiones.some(v => (coleccion[`EX_${v.id}`] || 0) > 0);
              
              return (
                <div key={j.codPais} className={`rounded-xl border overflow-hidden ${tieneAlguno ? 'bg-stone-900 border-amber-900/50' : 'bg-stone-900/50 border-stone-800'}`}>
                  <div className="px-4 py-2 bg-stone-800/40 border-b border-stone-800 flex items-center gap-2">
                    <span className="text-2xl">{sel?.bandera}</span>
                    <div className="flex-1">
                      <div className="font-display text-lg">{j.nombre}</div>
                      <div className="text-[10px] text-stone-500 font-mono uppercase tracking-wider">{j.seleccion} · {j.codPais}</div>
                    </div>
                  </div>
                  <div className="p-2 grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {versionesFiltradas.map(v => {
                      const c = EXTRA_COLORES.find(co => co.code === v.color);
                      const cantidad = coleccion[`EX_${v.id}`] || 0;
                      const tiene = cantidad > 0;
                      return (
                        <div
                          key={v.id}
                          className={`rounded-lg border p-2 transition-all ${
                            tiene 
                              ? `${c.tailwindBg}/30 ${c.tailwindBorder}` 
                              : 'bg-stone-900 border-stone-800'
                          }`}
                        >
                          <button
                            onClick={() => toggle(v.id)}
                            className="w-full flex items-center justify-between mb-1"
                          >
                            <span className={`text-xs font-mono font-bold ${tiene ? c.tailwindText : 'text-stone-500'}`}>
                              {c.emoji} {c.nombreEs}
                            </span>
                            {tiene && <Check className="w-4 h-4 text-emerald-400" />}
                          </button>
                          <div className="flex items-center justify-between">
                            <code className="text-[10px] text-stone-500 font-mono">{v.id}</code>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => ajustar(v.id, -1)}
                                disabled={cantidad === 0}
                                className="w-5 h-5 rounded bg-stone-800 hover:bg-stone-700 disabled:opacity-30 text-xs"
                              >−</button>
                              <span className={`w-5 text-center text-xs font-mono font-bold ${tiene ? c.tailwindText : 'text-stone-600'}`}>{cantidad}</span>
                              <button
                                onClick={() => ajustar(v.id, 1)}
                                className="w-5 h-5 rounded bg-stone-800 hover:bg-stone-700 text-xs"
                              >+</button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      <div className="mt-6 text-xs text-stone-500 bg-stone-900/30 border border-stone-800 rounded-lg p-3">
        <p className="font-bold text-stone-400 mb-1">Sobre los Extra Stickers</p>
        <p>Son cromos especiales de inserción aleatoria. NO se pegan en el álbum y no tienen casilla. Vienen en sobres regulares con frecuencia aproximada de 1 cada 100. Frecuencia por color (estimada): Morado 1:158 · Bronce 1:317 · Plata 1:950 · Oro 1:1.900.</p>
      </div>
    </div>
  );
}

// ============================================
// VISTA: COCA-COLA STICKERS
// 14 cromos exclusivos (CC1-CC14) que se canjean con botellas Coca-Cola 1.5L
// ============================================

function VistaCocaCola({ coleccion, onGuardar, mostrarMensaje }) {
  const [textoPegar, setTextoPegar] = useState('');
  const [mostrarPegado, setMostrarPegado] = useState(false);

  function toggle(id) {
    const nueva = { ...coleccion };
    const clave = `CC_${id}`;
    if (nueva[clave] > 0) delete nueva[clave];
    else nueva[clave] = 1;
    onGuardar(nueva);
  }

  function ajustar(id, delta) {
    const nueva = { ...coleccion };
    const clave = `CC_${id}`;
    const actual = nueva[clave] || 0;
    const nuevo = Math.max(0, actual + delta);
    if (nuevo === 0) delete nueva[clave];
    else nueva[clave] = nuevo;
    onGuardar(nueva);
  }

  function procesarPegado() {
    const tokens = textoPegar.split(/[,;\n\r\t]+/).map(t => t.trim()).filter(Boolean);
    const validos = [];
    const invalidos = [];

    tokens.forEach(t => {
      const sub = t.split(/\s+/).filter(Boolean);
      sub.forEach(s => {
        const limpio = s.toUpperCase().replace(/[\s\-_.]/g, '');
        // Acepta CC1, CC01, 1, 01
        let codigo = null;
        const match = limpio.match(/^CC?(\d+)$/);
        if (match) {
          const num = parseInt(match[1], 10);
          if (num >= 1 && num <= 14) codigo = `CC${num}`;
        }
        if (codigo) validos.push(codigo);
        else invalidos.push(s);
      });
    });

    if (validos.length === 0) {
      mostrarMensaje('No se reconoció ningún código Coca-Cola. Usa CC1, CC2... CC14', 'error');
      return;
    }

    const nueva = { ...coleccion };
    let nuevos = 0, repetidos = 0;
    validos.forEach(id => {
      const clave = `CC_${id}`;
      if (!nueva[clave] || nueva[clave] === 0) {
        nueva[clave] = 1;
        nuevos++;
      } else {
        nueva[clave] = nueva[clave] + 1;
        repetidos++;
      }
    });
    onGuardar(nueva);
    setTextoPegar('');
    mostrarMensaje(`✓ ${nuevos} nuevos + ${repetidos} repetidos`, 'exito');
  }

  const tengo = COCA_COLA_STICKERS.filter(c => (coleccion[`CC_${c.id}`] || 0) > 0).length;
  const porcentaje = (tengo / COCA_COLA_STICKERS.length) * 100;
  const repetidos = COCA_COLA_STICKERS.reduce((acc, c) => {
    const cant = coleccion[`CC_${c.id}`] || 0;
    return acc + Math.max(0, cant - 1);
  }, 0);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-display text-3xl mb-2 flex items-center gap-2">
          <Layers className="w-7 h-7 text-red-500" /> COCA-COLA STICKERS
        </h2>
        <p className="text-stone-400 text-sm">
          14 cromos exclusivos. NO vienen en sobres Panini. Se obtienen UNO por cada botella de Coca-Cola Sabor Original o Coca-Cola Zero de 1,5 L (debajo de la etiqueta despegable).
        </p>
      </div>

      {/* Hero stat con estética Coca-Cola */}
      <div className="rounded-2xl p-5 relative overflow-hidden border-2 border-red-700" style={{ background: 'linear-gradient(135deg, #7f1d1d 0%, #450a0a 50%, #1c1917 100%)' }}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-500 opacity-10 blur-3xl rounded-full -mr-32 -mt-32" />
        <div className="relative">
          <div className="flex items-baseline gap-3 mb-3">
            <span className="font-display text-5xl text-white">{tengo}</span>
            <span className="font-display text-xl text-red-300">/ 14</span>
            <span className="font-mono text-base text-red-200 ml-auto">{porcentaje.toFixed(1)}%</span>
          </div>
          <div className="w-full h-2 bg-red-950 rounded-full overflow-hidden mb-3">
            <div className="h-full bg-gradient-to-r from-red-500 to-red-300 transition-all duration-700" style={{ width: `${porcentaje}%` }} />
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <Stat label="Tengo" valor={tengo} color="text-white" />
            <Stat label="Faltan" valor={14 - tengo} color="text-red-300" />
            <Stat label="Repetidos" valor={repetidos} color="text-amber-300" />
          </div>
        </div>
      </div>

      {/* Toggle pegado masivo */}
      <button
        onClick={() => setMostrarPegado(!mostrarPegado)}
        className="text-sm text-amber-400 hover:text-amber-300 flex items-center gap-1"
      >
        <Plus className="w-4 h-4" />
        {mostrarPegado ? 'Ocultar pegado masivo' : 'Pegado masivo de varios códigos'}
      </button>

      {mostrarPegado && (
        <div className="space-y-3 bg-stone-900/50 border border-stone-700 rounded-xl p-4">
          <p className="text-sm text-stone-300">
            Escribe los códigos que tienes (CC1, CC2... CC14) separados por comas o espacios.
          </p>
          <textarea
            value={textoPegar}
            onChange={e => setTextoPegar(e.target.value)}
            placeholder="CC1, CC7, CC12&#10;CC3 CC5"
            rows={3}
            className="w-full px-3 py-2 bg-stone-900 border border-stone-700 rounded-lg focus:border-amber-400 focus:outline-none font-mono text-sm"
          />
          <div className="flex gap-2">
            <button
              onClick={procesarPegado}
              disabled={!textoPegar.trim()}
              className="px-5 py-2 gradient-gold text-stone-900 font-semibold rounded-lg disabled:opacity-30"
            >
              Pegar Coca-Cola
            </button>
            <button
              onClick={() => setTextoPegar('')}
              className="px-5 py-2 bg-stone-800 hover:bg-stone-700 rounded-lg text-stone-300"
            >
              Limpiar
            </button>
          </div>
        </div>
      )}

      {/* Lista de los 14 cromos en formato "doble página" */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {COCA_COLA_STICKERS.map(cc => {
          const cant = coleccion[`CC_${cc.id}`] || 0;
          const tiene = cant > 0;
          const sel = SELECCIONES.find(s => s.cod === cc.codPais);
          return (
            <div
              key={cc.id}
              className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                tiene
                  ? 'bg-red-950/40 border-red-700'
                  : 'bg-stone-900 border-stone-800'
              }`}
            >
              <button
                onClick={() => toggle(cc.id)}
                className={`flex-shrink-0 w-14 h-14 rounded-lg flex flex-col items-center justify-center font-mono text-xs font-bold transition-colors ${
                  tiene
                    ? 'bg-gradient-to-br from-red-500 to-red-700 text-white'
                    : 'bg-stone-800 text-stone-500 hover:bg-stone-700'
                }`}
              >
                <span className="text-[9px] opacity-80">CC</span>
                <span className="text-lg leading-none">{cc.numero}</span>
              </button>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{sel?.bandera}</span>
                  <code className="text-xs text-stone-500 font-mono">{cc.id}</code>
                </div>
                <div className={`text-sm font-medium truncate ${tiene ? 'text-white' : 'text-stone-300'}`}>
                  {cc.jugador}
                </div>
                <div className="text-xs text-stone-500">{cc.seleccion}</div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={() => ajustar(cc.id, -1)}
                  disabled={cant === 0}
                  className="w-7 h-7 rounded bg-stone-800 hover:bg-stone-700 disabled:opacity-30 text-stone-400 text-sm"
                >−</button>
                <span className={`w-6 text-center font-mono text-sm font-bold ${tiene ? 'text-red-300' : 'text-stone-600'}`}>{cant}</span>
                <button
                  onClick={() => ajustar(cc.id, 1)}
                  className="w-7 h-7 rounded bg-stone-800 hover:bg-stone-700 text-stone-400 text-sm"
                >+</button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 text-xs text-stone-500 bg-stone-900/30 border border-stone-800 rounded-lg p-3">
        <p className="font-bold text-stone-400 mb-1">Cómo conseguirlos en Colombia</p>
        <p>Cada botella de Coca-Cola Sabor Original o Coca-Cola Zero de 1,5 L trae UNA lámina pegada bajo la etiqueta despegable. Promoción vigente desde el 15 de abril de 2026 durante toda la temporada del Mundial. NO participan: Coca-Cola Light, latas, vidrio retornable ni presentaciones personales.</p>
      </div>
    </div>
  );
}

// ============================================
// VISTA: EDITOR DE PLANTILLAS
// Permite corregir nombres y reordenar posiciones de cromos por equipo
// Los cambios se guardan como overrides compartidos entre todos los coleccionistas
// ============================================

function VistaEditor({ catalogo, overrides, onGuardarOverrides, mostrarMensaje }) {
  const [equipoActivo, setEquipoActivo] = useState(null);
  const [editando, setEditando] = useState({}); // {codigo: 'nuevo nombre temporal'}

  // Si no hay equipo seleccionado, mostrar grid de selección
  if (!equipoActivo) {
    const totalEditados = Object.keys(overrides).length;
    
    return (
      <div className="space-y-4">
        <div>
          <h2 className="font-display text-3xl mb-2 flex items-center gap-2">
            <Edit3 className="w-7 h-7 text-amber-400" /> EDITOR DE PLANTILLAS
          </h2>
          <p className="text-stone-400 text-sm">
            Corrige los nombres de jugadores y reordena las posiciones según lo que ves en tus cromos físicos. Los cambios se aplican a todos los coleccionistas familiares.
          </p>
        </div>

        {totalEditados > 0 && (
          <div className="bg-amber-950/30 border border-amber-800 rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="font-mono text-sm text-amber-300">
                <span className="font-bold text-2xl">{totalEditados}</span> cromos modificados
              </p>
              <p className="text-xs text-stone-400 mt-1">Los cambios se aplican en toda la app</p>
            </div>
            <button
              onClick={() => {
                if (confirm('¿Restaurar TODOS los nombres a los originales? Esta acción no se puede deshacer.')) {
                  onGuardarOverrides({});
                  mostrarMensaje('Todos los nombres restaurados', 'exito');
                }
              }}
              className="px-3 py-2 bg-red-900/40 hover:bg-red-900/60 border border-red-800 text-red-300 rounded-lg text-xs font-medium flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Restaurar todo
            </button>
          </div>
        )}

        <div className="bg-stone-900/40 border border-stone-800 rounded-lg p-3 text-xs text-stone-400">
          <p className="font-bold text-stone-300 mb-1">Cómo usar el editor</p>
          <ul className="space-y-0.5 list-disc pl-5">
            <li>Toca un equipo para ver los 20 cromos editables</li>
            <li>Toca el lápiz junto al nombre para corregirlo</li>
            <li>Usa las flechas ↑↓ para reordenar jugadores dentro del equipo</li>
            <li>Cualquier cromo modificado se marca con un punto naranja</li>
            <li>Botón "Restaurar" devuelve un cromo o todo el equipo al original</li>
          </ul>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {SELECCIONES.map(sel => {
            const cromosEquipo = catalogo.filter(c => c.codPais === sel.cod);
            const editadosEquipo = cromosEquipo.filter(c => overrides[c.codigo]).length;
            return (
              <button
                key={sel.cod}
                onClick={() => setEquipoActivo(sel.cod)}
                className={`text-left p-3 rounded-lg border transition-all hover:border-amber-600 ${
                  editadosEquipo > 0 ? 'bg-amber-950/20 border-amber-800' : 'bg-stone-900 border-stone-800'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-mono text-stone-500">GRUPO {sel.grupo}</span>
                  {editadosEquipo > 0 && (
                    <span className="text-[10px] bg-amber-500 text-stone-900 px-1.5 py-0.5 rounded font-bold">
                      {editadosEquipo} editados
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-3xl">{sel.bandera}</span>
                  <div>
                    <div className="font-display text-base">{sel.nombre}</div>
                    <div className="text-[10px] font-mono text-stone-500">{sel.cod}1 — {sel.cod}20</div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Vista de detalle de un equipo
  const equipo = SELECCIONES.find(s => s.cod === equipoActivo);
  const cromosEquipo = catalogo.filter(c => c.codPais === equipoActivo).sort((a, b) => a.posicion - b.posicion);

  function getNombreOriginal(cod) {
    return CATALOGO_BASE.find(c => c.codigo === cod)?.nombre || '';
  }

  function guardarNombre(codigo) {
    const nuevoNombre = (editando[codigo] || '').trim();
    const nombreOriginal = getNombreOriginal(codigo);
    const nuevosOverrides = { ...overrides };
    
    if (!nuevoNombre || nuevoNombre === nombreOriginal) {
      // Si está vacío o igual al original, eliminamos el override
      delete nuevosOverrides[codigo];
    } else {
      nuevosOverrides[codigo] = nuevoNombre;
    }
    
    onGuardarOverrides(nuevosOverrides);
    setEditando(prev => {
      const nuevo = { ...prev };
      delete nuevo[codigo];
      return nuevo;
    });
    mostrarMensaje(`✓ ${codigo} actualizado`, 'exito');
  }

  function cancelarEdicion(codigo) {
    setEditando(prev => {
      const nuevo = { ...prev };
      delete nuevo[codigo];
      return nuevo;
    });
  }

  function restaurarCromo(codigo) {
    const nuevosOverrides = { ...overrides };
    delete nuevosOverrides[codigo];
    onGuardarOverrides(nuevosOverrides);
    mostrarMensaje(`✓ ${codigo} restaurado al original`, 'exito');
  }

  function restaurarEquipo() {
    if (!confirm(`¿Restaurar todos los nombres de ${equipo.nombre} a los originales?`)) return;
    const nuevosOverrides = { ...overrides };
    cromosEquipo.forEach(c => {
      delete nuevosOverrides[c.codigo];
    });
    onGuardarOverrides(nuevosOverrides);
    mostrarMensaje(`✓ ${equipo.nombre} restaurado`, 'exito');
  }

  function intercambiarPosiciones(codA, codB) {
    // Para reordenar: intercambiamos los nombres de las dos posiciones
    const nombreA = catalogo.find(c => c.codigo === codA)?.nombre || '';
    const nombreB = catalogo.find(c => c.codigo === codB)?.nombre || '';
    
    const nuevosOverrides = { ...overrides };
    
    // Si el nombre A es igual al original de A, no se ha modificado, pero al moverlo a B sí cambia
    const origA = getNombreOriginal(codA);
    const origB = getNombreOriginal(codB);
    
    if (nombreB === origA) delete nuevosOverrides[codA];
    else nuevosOverrides[codA] = nombreB;
    
    if (nombreA === origB) delete nuevosOverrides[codB];
    else nuevosOverrides[codB] = nombreA;
    
    onGuardarOverrides(nuevosOverrides);
    mostrarMensaje('✓ Posiciones intercambiadas', 'exito');
  }

  const editadosEquipo = cromosEquipo.filter(c => overrides[c.codigo]).length;

  return (
    <div className="space-y-4">
      <button onClick={() => setEquipoActivo(null)} className="flex items-center gap-1 text-amber-400 hover:text-amber-300 text-sm font-medium">
        <ChevronRight className="w-4 h-4 rotate-180" /> Volver a selección de equipos
      </button>

      <div className="bg-stone-900 border border-stone-700 rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{equipo.bandera}</span>
            <div>
              <h2 className="font-display text-2xl">{equipo.nombre}</h2>
              <p className="text-xs text-stone-500 font-mono">GRUPO {equipo.grupo} · {equipo.cod}1 — {equipo.cod}20</p>
            </div>
          </div>
          {editadosEquipo > 0 && (
            <button
              onClick={restaurarEquipo}
              className="px-3 py-1.5 bg-red-900/40 hover:bg-red-900/60 border border-red-800 text-red-300 rounded-lg text-xs font-medium flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Restaurar equipo
            </button>
          )}
        </div>
        {editadosEquipo > 0 && (
          <p className="text-xs text-amber-400">
            {editadosEquipo} cromo{editadosEquipo !== 1 ? 's' : ''} modificado{editadosEquipo !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        {cromosEquipo.map((c, idx) => {
          const estaEditando = editando[c.codigo] !== undefined;
          const estaModificado = !!overrides[c.codigo];
          const noEsEscudoNiFoto = !c.esEscudo && !c.esFotoGrupal;
          const puedeSubir = idx > 1 && noEsEscudoNiFoto && !cromosEquipo[idx-1].esEscudo && !cromosEquipo[idx-1].esFotoGrupal;
          const puedeBajar = idx < cromosEquipo.length - 1 && noEsEscudoNiFoto && !cromosEquipo[idx+1].esFotoGrupal && !cromosEquipo[idx+1].esEscudo;
          
          return (
            <div
              key={c.codigo}
              className={`flex items-center gap-2 p-2.5 rounded-lg border transition-all ${
                estaModificado 
                  ? 'bg-amber-950/30 border-amber-800' 
                  : c.esEscudo || c.esFotoGrupal 
                    ? 'bg-stone-900/50 border-stone-800' 
                    : 'bg-stone-900 border-stone-800'
              }`}
            >
              <div className="flex-shrink-0 w-10 h-10 rounded bg-stone-800 flex items-center justify-center font-mono text-xs font-bold text-stone-400">
                {c.posicion}
              </div>

              <div className="flex-1 min-w-0">
                {estaEditando ? (
                  <div className="flex gap-1">
                    <input
                      autoFocus
                      type="text"
                      value={editando[c.codigo]}
                      onChange={e => setEditando(prev => ({ ...prev, [c.codigo]: e.target.value }))}
                      onKeyDown={e => {
                        if (e.key === 'Enter') guardarNombre(c.codigo);
                        if (e.key === 'Escape') cancelarEdicion(c.codigo);
                      }}
                      className="flex-1 px-2 py-1 bg-stone-800 border border-amber-600 rounded text-sm focus:outline-none focus:border-amber-400"
                    />
                    <button
                      onClick={() => guardarNombre(c.codigo)}
                      className="p-1.5 bg-emerald-700 hover:bg-emerald-600 rounded text-white"
                      title="Guardar"
                    >
                      <Save className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => cancelarEdicion(c.codigo)}
                      className="p-1.5 bg-stone-700 hover:bg-stone-600 rounded text-white"
                      title="Cancelar"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center gap-1.5">
                      <code className="text-[10px] text-stone-500 font-mono">{c.codigo}</code>
                      {estaModificado && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" title="Modificado"></span>}
                      {c.esEscudo && <span className="text-[9px] text-stone-500 uppercase font-mono">escudo</span>}
                      {c.esFotoGrupal && <span className="text-[9px] text-stone-500 uppercase font-mono">foto grupal</span>}
                    </div>
                    <div className={`text-sm truncate ${estaModificado ? 'text-amber-200' : 'text-stone-200'}`}>
                      {c.nombre}
                    </div>
                  </div>
                )}
              </div>

              {!estaEditando && (
                <div className="flex items-center gap-0.5 flex-shrink-0">
                  {/* Reordenar */}
                  {noEsEscudoNiFoto && (
                    <>
                      <button
                        onClick={() => puedeSubir && intercambiarPosiciones(c.codigo, cromosEquipo[idx-1].codigo)}
                        disabled={!puedeSubir}
                        className="p-1.5 bg-stone-800 hover:bg-stone-700 disabled:opacity-30 rounded text-stone-400"
                        title="Mover arriba"
                      >
                        <ChevronRight className="w-3.5 h-3.5 -rotate-90" />
                      </button>
                      <button
                        onClick={() => puedeBajar && intercambiarPosiciones(c.codigo, cromosEquipo[idx+1].codigo)}
                        disabled={!puedeBajar}
                        className="p-1.5 bg-stone-800 hover:bg-stone-700 disabled:opacity-30 rounded text-stone-400"
                        title="Mover abajo"
                      >
                        <ChevronRight className="w-3.5 h-3.5 rotate-90" />
                      </button>
                    </>
                  )}
                  {/* Editar */}
                  {!c.esEscudo && !c.esFotoGrupal && (
                    <button
                      onClick={() => setEditando(prev => ({ ...prev, [c.codigo]: c.nombre }))}
                      className="p-1.5 bg-stone-800 hover:bg-amber-900/40 rounded text-amber-400"
                      title="Editar nombre"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {/* Restaurar */}
                  {estaModificado && (
                    <button
                      onClick={() => restaurarCromo(c.codigo)}
                      className="p-1.5 bg-stone-800 hover:bg-red-900/40 rounded text-red-400"
                      title="Restaurar al original"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="text-xs text-stone-500 bg-stone-900/30 border border-stone-800 rounded-lg p-3">
        <p>El cromo #1 (escudo) y el #13 (foto grupal) no son editables porque son elementos fijos del álbum. Solo puedes editar y reordenar los 18 jugadores.</p>
      </div>
    </div>
  );
}

// ============================================
// VISTA: BACKUP / IMPORTAR / EXPORTAR
// Permite descargar JSON con cromos pegados, repetidas, Extra, Coca-Cola y plantillas editadas
// El usuario elige cada vez qué incluir y de qué coleccionistas
// ============================================

function VistaBackup({ coleccionistas, colecciones, overrides, coleccionistaActivo, onImportar, mostrarMensaje }) {
  const [seccion, setSeccion] = useState('exportar'); // 'exportar' o 'importar'

  // Estado de selección para exportar
  const [colsSeleccionados, setColsSeleccionados] = useState(coleccionistaActivo ? [coleccionistaActivo] : []);
  const [incluirAlbum, setIncluirAlbum] = useState(true);
  const [incluirExtra, setIncluirExtra] = useState(true);
  const [incluirCocaCola, setIncluirCocaCola] = useState(true);
  const [incluirOverrides, setIncluirOverrides] = useState(true);

  // Estado para importar
  const [archivoTexto, setArchivoTexto] = useState('');
  const [datosPreview, setDatosPreview] = useState(null);
  const [errorImport, setErrorImport] = useState(null);
  const [modoImport, setModoImport] = useState('merge'); // merge o replace

  // ===== EXPORTAR =====
  function toggleColeccionista(id) {
    setColsSeleccionados(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  }

  function exportarJSON() {
    if (colsSeleccionados.length === 0 && !incluirOverrides) {
      mostrarMensaje('Selecciona al menos un coleccionista o incluye plantillas editadas', 'error');
      return;
    }

    // Filtrar las colecciones según lo seleccionado
    const colsFiltradas = {};
    const coleccionistasIncluidos = coleccionistas.filter(c => colsSeleccionados.includes(c.id));

    for (const colId of colsSeleccionados) {
      const orig = colecciones[colId] || {};
      const filtrada = {};
      for (const [clave, valor] of Object.entries(orig)) {
        // Filtrar por categoría
        if (clave.startsWith('EX_')) {
          if (incluirExtra) filtrada[clave] = valor;
        } else if (clave.startsWith('CC_')) {
          if (incluirCocaCola) filtrada[clave] = valor;
        } else {
          if (incluirAlbum) filtrada[clave] = valor;
        }
      }
      colsFiltradas[colId] = filtrada;
    }

    const backup = {
      _meta: {
        app: 'AlbumPanini2026',
        version: 1,
        exportado_en: new Date().toISOString(),
        contenido: {
          coleccionistas: coleccionistasIncluidos.length,
          incluye_album: incluirAlbum,
          incluye_extra: incluirExtra,
          incluye_cocacola: incluirCocaCola,
          incluye_plantillas: incluirOverrides,
        },
      },
      coleccionistas: coleccionistasIncluidos,
      colecciones: colsFiltradas,
      overrides: incluirOverrides ? overrides : {},
    };

    const json = JSON.stringify(backup, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // Generar nombre con fecha
    const fecha = new Date().toISOString().slice(0, 10);
    const sufijo = colsSeleccionados.length === coleccionistas.length 
      ? 'todos' 
      : colsSeleccionados.length === 1 
        ? coleccionistas.find(c => c.id === colsSeleccionados[0])?.nombre.toLowerCase().replace(/\s+/g, '_') || 'coleccionista'
        : `${colsSeleccionados.length}-coleccionistas`;
    const nombre = `panini-mundial-2026_${sufijo}_${fecha}.json`;
    
    const a = document.createElement('a');
    a.href = url;
    a.download = nombre;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    mostrarMensaje(`✓ Descargado: ${nombre}`, 'exito');
  }

  // ===== IMPORTAR =====
  function leerArchivo(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const texto = event.target.result;
      setArchivoTexto(texto);
      analizarTexto(texto);
    };
    reader.readAsText(file);
  }

  function analizarTexto(texto) {
    setErrorImport(null);
    setDatosPreview(null);
    if (!texto.trim()) return;
    try {
      const datos = JSON.parse(texto);
      if (!datos || typeof datos !== 'object') {
        setErrorImport('El archivo no contiene datos válidos');
        return;
      }
      // Validar estructura mínima
      const tieneAlgo = datos.coleccionistas || datos.colecciones || datos.overrides;
      if (!tieneAlgo) {
        setErrorImport('No se encontraron datos de Panini en este archivo');
        return;
      }
      // Generar preview
      const numColeccionistas = Array.isArray(datos.coleccionistas) ? datos.coleccionistas.length : 0;
      const cromosTotales = datos.colecciones 
        ? Object.values(datos.colecciones).reduce((acc, col) => acc + Object.keys(col || {}).length, 0)
        : 0;
      const numOverrides = datos.overrides ? Object.keys(datos.overrides).length : 0;
      
      setDatosPreview({
        meta: datos._meta,
        coleccionistas: datos.coleccionistas || [],
        numColeccionistas,
        cromosTotales,
        numOverrides,
        raw: datos,
      });
    } catch (e) {
      setErrorImport('Archivo JSON inválido: ' + e.message);
    }
  }

  async function ejecutarImport() {
    if (!datosPreview) return;
    const confirmacion = modoImport === 'replace'
      ? '¿REEMPLAZAR todos tus datos actuales con los del archivo? Esta acción borra lo que tengas hoy.'
      : '¿Combinar los datos del archivo con los actuales? Las cantidades de cromos repetidos se sumarán.';
    if (!confirm(confirmacion)) return;

    const result = await onImportar(datosPreview.raw, modoImport);
    if (result.ok) {
      mostrarMensaje(`✓ Importación ${modoImport === 'replace' ? 'reemplazó' : 'combinó'} los datos`, 'exito');
      setArchivoTexto('');
      setDatosPreview(null);
    } else {
      mostrarMensaje(`✗ Error al importar: ${result.error}`, 'error');
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-display text-3xl mb-2 flex items-center gap-2">
          <Download className="w-7 h-7 text-amber-400" /> BACKUP
        </h2>
        <p className="text-stone-400 text-sm">
          Exporta tu colección a un archivo JSON que puedes guardar, compartir o reimportar después.
        </p>
      </div>

      {/* Selector de sección */}
      <div className="flex gap-1 bg-stone-900 p-1 rounded-lg border border-stone-800 max-w-md">
        <button
          onClick={() => setSeccion('exportar')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium flex items-center justify-center gap-2 ${
            seccion === 'exportar' ? 'gradient-gold text-stone-900' : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <FileDown className="w-4 h-4" /> Exportar
        </button>
        <button
          onClick={() => setSeccion('importar')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium flex items-center justify-center gap-2 ${
            seccion === 'importar' ? 'gradient-gold text-stone-900' : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <FileUp className="w-4 h-4" /> Importar
        </button>
      </div>

      {seccion === 'exportar' && (
        <div className="space-y-4">
          {/* Coleccionistas a incluir */}
          <div className="bg-stone-900 border border-stone-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display text-lg">Coleccionistas</h3>
              <div className="flex gap-1">
                <button
                  onClick={() => setColsSeleccionados(coleccionistas.map(c => c.id))}
                  className="text-xs text-amber-400 hover:text-amber-300 px-2 py-1"
                >
                  Todos
                </button>
                <button
                  onClick={() => setColsSeleccionados([])}
                  className="text-xs text-stone-400 hover:text-stone-200 px-2 py-1"
                >
                  Ninguno
                </button>
              </div>
            </div>
            <div className="space-y-1.5">
              {coleccionistas.map(c => {
                const seleccionado = colsSeleccionados.includes(c.id);
                const col = colecciones[c.id] || {};
                const numCromos = Object.keys(col).length;
                return (
                  <button
                    key={c.id}
                    onClick={() => toggleColeccionista(c.id)}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-lg border transition-colors ${
                      seleccionado ? 'bg-amber-950/30 border-amber-700' : 'bg-stone-900/50 border-stone-800'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded flex items-center justify-center border-2 flex-shrink-0 ${
                      seleccionado ? 'bg-amber-500 border-amber-500' : 'border-stone-600'
                    }`}>
                      {seleccionado && <Check className="w-3.5 h-3.5 text-stone-900" strokeWidth={3} />}
                    </div>
                    <div className="flex-1 text-left">
                      <div className={`text-sm font-medium ${seleccionado ? 'text-amber-200' : 'text-stone-300'}`}>
                        {c.nombre}
                        {c.id === coleccionistaActivo && <span className="ml-2 text-[10px] text-stone-500 font-mono uppercase">activo</span>}
                      </div>
                      <div className="text-[10px] text-stone-500 font-mono">{numCromos} entradas</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Qué incluir */}
          <div className="bg-stone-900 border border-stone-800 rounded-xl p-4">
            <h3 className="font-display text-lg mb-3">Contenido a incluir</h3>
            <div className="space-y-2">
              <CheckRow checked={incluirAlbum} onToggle={() => setIncluirAlbum(!incluirAlbum)} label="Cromos del álbum (980)" desc="Pegados y repetidas del álbum base" />
              <CheckRow checked={incluirExtra} onToggle={() => setIncluirExtra(!incluirExtra)} label="Extra Stickers (80)" desc="Los 20 jugadores × 4 colores" />
              <CheckRow checked={incluirCocaCola} onToggle={() => setIncluirCocaCola(!incluirCocaCola)} label="Coca-Cola (14)" desc="Cromos exclusivos de la promoción" />
              <CheckRow checked={incluirOverrides} onToggle={() => setIncluirOverrides(!incluirOverrides)} label="Plantillas editadas" desc="Correcciones de nombres que hayas hecho" />
            </div>
          </div>

          {/* Resumen y botón */}
          <div className="bg-stone-900/50 border border-stone-800 rounded-lg p-3 text-xs text-stone-400">
            <p>
              <span className="text-stone-200 font-medium">Resumen:</span> {colsSeleccionados.length} coleccionista{colsSeleccionados.length !== 1 ? 's' : ''}, 
              {' '}{[incluirAlbum && 'álbum', incluirExtra && 'extra', incluirCocaCola && 'coca-cola', incluirOverrides && 'plantillas'].filter(Boolean).join(', ') || 'nada'}.
            </p>
          </div>

          <button
            onClick={exportarJSON}
            disabled={colsSeleccionados.length === 0 && !incluirOverrides}
            className="w-full sm:w-auto px-6 py-3 gradient-gold text-stone-900 font-semibold rounded-lg disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <FileDown className="w-5 h-5" /> Descargar JSON
          </button>
        </div>
      )}

      {seccion === 'importar' && (
        <div className="space-y-4">
          {/* Aviso importante */}
          <div className="bg-amber-950/30 border border-amber-800 rounded-lg p-3 flex gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-stone-300">
              <p className="font-bold text-amber-300 mb-1">Importa con cuidado</p>
              <p>"Combinar" suma los datos del archivo a los actuales. "Reemplazar" borra todo y deja solo lo del archivo. Te recomendamos exportar tu backup actual antes de importar.</p>
            </div>
          </div>

          {/* Subida de archivo */}
          <div className="bg-stone-900 border border-stone-800 rounded-xl p-4">
            <h3 className="font-display text-lg mb-3">Cargar archivo JSON</h3>
            <label className="block w-full">
              <input
                type="file"
                accept=".json,application/json"
                onChange={leerArchivo}
                className="hidden"
              />
              <div className="border-2 border-dashed border-stone-700 hover:border-amber-600 rounded-lg p-6 text-center cursor-pointer transition-colors">
                <Upload className="w-8 h-8 mx-auto mb-2 text-stone-500" />
                <p className="text-sm text-stone-300">Toca para seleccionar archivo</p>
                <p className="text-xs text-stone-500 mt-1">Acepta archivos .json exportados desde esta app</p>
              </div>
            </label>
            
            <details className="mt-3">
              <summary className="text-xs text-stone-500 cursor-pointer hover:text-stone-400">O pegar contenido manualmente</summary>
              <textarea
                value={archivoTexto}
                onChange={e => { setArchivoTexto(e.target.value); analizarTexto(e.target.value); }}
                placeholder='Pega aquí el contenido JSON...'
                rows={4}
                className="mt-2 w-full px-3 py-2 bg-stone-900 border border-stone-700 rounded-lg focus:border-amber-400 focus:outline-none font-mono text-xs"
              />
            </details>
          </div>

          {/* Error */}
          {errorImport && (
            <div className="bg-red-950/40 border border-red-800 rounded-lg p-3 text-sm text-red-300 flex gap-2">
              <X className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div>{errorImport}</div>
            </div>
          )}

          {/* Preview */}
          {datosPreview && (
            <div className="bg-emerald-950/20 border border-emerald-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-emerald-400" />
                <h3 className="font-display text-lg text-emerald-300">Archivo válido</h3>
              </div>
              {datosPreview.meta && (
                <p className="text-xs text-stone-400">
                  Exportado el {new Date(datosPreview.meta.exportado_en).toLocaleString('es-CO')}
                </p>
              )}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-stone-900 rounded-lg p-2">
                  <div className="font-display text-2xl text-emerald-400">{datosPreview.numColeccionistas}</div>
                  <div className="text-[10px] uppercase text-stone-500 font-mono">Coleccionistas</div>
                </div>
                <div className="bg-stone-900 rounded-lg p-2">
                  <div className="font-display text-2xl text-emerald-400">{datosPreview.cromosTotales}</div>
                  <div className="text-[10px] uppercase text-stone-500 font-mono">Cromos</div>
                </div>
                <div className="bg-stone-900 rounded-lg p-2">
                  <div className="font-display text-2xl text-emerald-400">{datosPreview.numOverrides}</div>
                  <div className="text-[10px] uppercase text-stone-500 font-mono">Plantillas</div>
                </div>
              </div>

              {datosPreview.coleccionistas.length > 0 && (
                <div className="text-xs text-stone-400">
                  <span className="text-stone-300 font-medium">Incluidos:</span> {datosPreview.coleccionistas.map(c => c.nombre).join(', ')}
                </div>
              )}

              {/* Modo de importación */}
              <div className="space-y-2 pt-2 border-t border-stone-800">
                <p className="text-xs font-bold text-stone-300">Modo de importación:</p>
                <button
                  onClick={() => setModoImport('merge')}
                  className={`w-full text-left p-2.5 rounded-lg border ${modoImport === 'merge' ? 'bg-emerald-950/40 border-emerald-700' : 'bg-stone-900 border-stone-800'}`}
                >
                  <div className={`text-sm font-medium ${modoImport === 'merge' ? 'text-emerald-300' : 'text-stone-300'}`}>
                    Combinar (recomendado)
                  </div>
                  <div className="text-[10px] text-stone-500 mt-0.5">Suma los cromos del archivo a tu colección actual sin borrar nada</div>
                </button>
                <button
                  onClick={() => setModoImport('replace')}
                  className={`w-full text-left p-2.5 rounded-lg border ${modoImport === 'replace' ? 'bg-red-950/40 border-red-700' : 'bg-stone-900 border-stone-800'}`}
                >
                  <div className={`text-sm font-medium ${modoImport === 'replace' ? 'text-red-300' : 'text-stone-300'}`}>
                    Reemplazar todo
                  </div>
                  <div className="text-[10px] text-stone-500 mt-0.5">Borra tus datos actuales y los reemplaza con los del archivo</div>
                </button>
              </div>

              <button
                onClick={ejecutarImport}
                className={`w-full px-5 py-2.5 font-semibold rounded-lg flex items-center justify-center gap-2 ${
                  modoImport === 'replace' 
                    ? 'bg-red-700 hover:bg-red-600 text-white' 
                    : 'gradient-gold text-stone-900'
                }`}
              >
                <FileUp className="w-4 h-4" />
                {modoImport === 'replace' ? 'Reemplazar mis datos' : 'Combinar con mis datos'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Subcomponente: fila de checkbox para Backup
function CheckRow({ checked, onToggle, label, desc }) {
  return (
    <button
      onClick={onToggle}
      className={`w-full flex items-start gap-3 p-2.5 rounded-lg border text-left transition-colors ${
        checked ? 'bg-amber-950/30 border-amber-700' : 'bg-stone-900/50 border-stone-800'
      }`}
    >
      <div className={`w-5 h-5 rounded flex items-center justify-center border-2 flex-shrink-0 mt-0.5 ${
        checked ? 'bg-amber-500 border-amber-500' : 'border-stone-600'
      }`}>
        {checked && <Check className="w-3.5 h-3.5 text-stone-900" strokeWidth={3} />}
      </div>
      <div className="flex-1">
        <div className={`text-sm font-medium ${checked ? 'text-amber-200' : 'text-stone-300'}`}>{label}</div>
        <div className="text-[10px] text-stone-500 mt-0.5">{desc}</div>
      </div>
    </button>
  );
}

// ============================================
// VISTA: ESTADÍSTICAS AVANZADAS
// Progreso por grupo del Mundial + Predicción matemática de sobres
// ============================================

function VistaStats({ catalogo, coleccion, estadoEquipos, stats }) {
  // ============ PROGRESO POR GRUPO ============
  const progresoPorGrupo = useMemo(() => {
    const grupos = {};
    for (const grupo of ['A','B','C','D','E','F','G','H','I','J','K','L']) {
      grupos[grupo] = { grupo, tengo: 0, total: 0, equipos: [] };
    }
    estadoEquipos.forEach(eq => {
      const g = grupos[eq.grupo];
      if (g) {
        g.tengo += eq.tengo;
        g.total += eq.total;
        g.equipos.push(eq);
      }
    });
    return Object.values(grupos).map(g => ({
      ...g,
      porcentaje: g.total > 0 ? (g.tengo / g.total) * 100 : 0,
      faltan: g.total - g.tengo,
    }));
  }, [estadoEquipos]);

  // Mejor y peor grupo
  const grupoMejor = [...progresoPorGrupo].sort((a, b) => b.porcentaje - a.porcentaje)[0];
  const grupoPeor = [...progresoPorGrupo].sort((a, b) => a.porcentaje - b.porcentaje)[0];

  // ============ PREDICCIÓN DE SOBRES ============
  // Problema del coleccionista (Coupon Collector Problem):
  // Para completar n cromos únicos sacando aleatoriamente, se necesitan en promedio
  // n * (1/n + 1/(n-1) + ... + 1/1) = n * H_n cromos
  //
  // Pero acá ya tengo k cromos únicos, entonces para los (n-k) restantes:
  // E[cromos para completar] = sum(n / i) para i=1 hasta (n-k)
  //
  // Cada sobre tiene 7 cromos. Asumimos cromos aleatorios uniformes (simplificación).
  
  const prediccion = useMemo(() => {
    const SOBRE_TAMAÑO = 7;
    const PRECIO_SOBRE_COP = 5000; // Colombia
    
    // Total cromos del álbum (pegables: 980)
    const N = catalogo.length;
    const k = stats.tengo; // cromos únicos que tengo
    const faltan = N - k;
    
    if (faltan === 0) {
      return { yaCompleto: true };
    }
    
    // Cálculo: E[cromos] = N * (H_N - H_k) donde H_n = 1 + 1/2 + ... + 1/n
    // Equivalente a: sum(N/i) para i = (N-k) decreciendo hasta 1
    // Pero es más eficiente: sum(N/(N-k+j)) para j=0 a (faltan-1)... mejor pensar así:
    // Para sacar el cromo único restante #1 (de los faltan): probabilidad p = faltan/N, así E = N/faltan
    // Para sacar el cromo único restante #2: E = N/(faltan-1)
    // Total: sum desde i=1 hasta faltan de N/i
    let cromosEsperados = 0;
    for (let i = 1; i <= faltan; i++) {
      cromosEsperados += N / i;
    }
    
    const sobresEsperados = Math.ceil(cromosEsperados / SOBRE_TAMAÑO);
    const costoEsperado = sobresEsperados * PRECIO_SOBRE_COP;
    
    // Estimaciones percentiles (aproximación log-normal)
    // Std dev del problema del coleccionista ≈ N * pi/sqrt(6) cuando partimos desde 0
    // Acá lo simplificamos con varianza acumulada:
    let varianza = 0;
    for (let i = 1; i <= faltan; i++) {
      const p = i / N;
      varianza += (1 - p) / (p * p);
    }
    const desv = Math.sqrt(varianza);
    
    // Optimista (-1 desv) y pesimista (+1 desv)
    const cromosOptimista = Math.max(faltan, cromosEsperados - desv);
    const cromosPesimista = cromosEsperados + desv;
    const sobresOptimista = Math.ceil(cromosOptimista / SOBRE_TAMAÑO);
    const sobresPesimista = Math.ceil(cromosPesimista / SOBRE_TAMAÑO);
    
    return {
      yaCompleto: false,
      faltan,
      cromosEsperados: Math.round(cromosEsperados),
      sobresEsperados,
      costoEsperado,
      sobresOptimista,
      sobresPesimista,
      costoOptimista: sobresOptimista * PRECIO_SOBRE_COP,
      costoPesimista: sobresPesimista * PRECIO_SOBRE_COP,
    };
  }, [catalogo, stats.tengo]);

  // Format de moneda
  const formatCOP = (n) => '$' + new Intl.NumberFormat('es-CO').format(Math.round(n));

  // ============ COLORES PARA GRÁFICAS ============
  const getColorBarra = (porc) => {
    if (porc === 100) return '#10b981'; // emerald
    if (porc >= 75) return '#84cc16'; // lime
    if (porc >= 50) return '#fbbf24'; // amber
    if (porc >= 25) return '#fb923c'; // orange
    return '#dc2626'; // red
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-3xl mb-2 flex items-center gap-2">
          <BarChart3 className="w-7 h-7 text-amber-400" /> ESTADÍSTICAS
        </h2>
        <p className="text-stone-400 text-sm">
          Análisis del progreso por grupo del Mundial y predicción matemática de cuántos sobres más necesitas.
        </p>
      </div>

      {/* ============ SECCIÓN 1: PROGRESO POR GRUPO ============ */}
      <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 sm:p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-display text-xl flex items-center gap-2">
              <Activity className="w-5 h-5 text-amber-400" /> Progreso por Grupo
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">12 grupos × 4 selecciones × 20 cromos = 960 cromos</p>
          </div>
        </div>

        {/* Mejor / Peor grupo */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="bg-emerald-950/30 border border-emerald-800 rounded-lg p-2.5">
            <div className="text-[10px] uppercase tracking-wider font-mono text-emerald-400 mb-1">Mejor grupo</div>
            <div className="font-display text-2xl text-emerald-300">{grupoMejor.grupo}</div>
            <div className="text-xs text-stone-400">{grupoMejor.tengo}/{grupoMejor.total} · {grupoMejor.porcentaje.toFixed(0)}%</div>
          </div>
          <div className="bg-red-950/30 border border-red-800 rounded-lg p-2.5">
            <div className="text-[10px] uppercase tracking-wider font-mono text-red-400 mb-1">Peor grupo</div>
            <div className="font-display text-2xl text-red-300">{grupoPeor.grupo}</div>
            <div className="text-xs text-stone-400">{grupoPeor.tengo}/{grupoPeor.total} · {grupoPeor.porcentaje.toFixed(0)}%</div>
          </div>
        </div>

        {/* Gráfica de barras */}
        <div className="w-full" style={{ height: 280 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={progresoPorGrupo} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <XAxis 
                dataKey="grupo" 
                tick={{ fill: '#a8a29e', fontSize: 11, fontFamily: 'monospace' }}
                axisLine={{ stroke: '#44403c' }}
                tickLine={false}
              />
              <YAxis 
                tick={{ fill: '#78716c', fontSize: 10, fontFamily: 'monospace' }}
                axisLine={false}
                tickLine={false}
                domain={[0, 100]}
                ticks={[0, 25, 50, 75, 100]}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1c1917', 
                  border: '1px solid #44403c',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
                labelStyle={{ color: '#fbbf24', fontWeight: 'bold' }}
                formatter={(value, name, props) => [`${value.toFixed(1)}% (${props.payload.tengo}/${props.payload.total})`, 'Progreso']}
                labelFormatter={(label) => `Grupo ${label}`}
              />
              <Bar dataKey="porcentaje" radius={[6, 6, 0, 0]}>
                {progresoPorGrupo.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getColorBarra(entry.porcentaje)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Lista detallada */}
        <details className="mt-3">
          <summary className="text-xs text-amber-400 cursor-pointer hover:text-amber-300 font-medium">Ver detalle por grupo</summary>
          <div className="mt-3 space-y-1.5">
            {progresoPorGrupo.map(g => (
              <div key={g.grupo} className="bg-stone-900/50 border border-stone-800 rounded-lg overflow-hidden">
                <div className="flex items-center justify-between px-3 py-2 bg-stone-800/30">
                  <div className="flex items-center gap-2">
                    <span className="font-display text-lg" style={{ color: getColorBarra(g.porcentaje) }}>{g.grupo}</span>
                    <span className="text-xs font-mono text-stone-400">{g.tengo}/{g.total}</span>
                  </div>
                  <span className="text-xs font-mono font-bold" style={{ color: getColorBarra(g.porcentaje) }}>
                    {g.porcentaje.toFixed(0)}%
                  </span>
                </div>
                <div className="px-3 py-2 grid grid-cols-2 gap-1.5">
                  {g.equipos.map(eq => (
                    <div key={eq.cod} className="flex items-center gap-1.5 text-xs">
                      <span>{eq.bandera}</span>
                      <span className="flex-1 truncate text-stone-300">{eq.nombre}</span>
                      <span className="font-mono text-stone-500">{eq.tengo}/20</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </details>
      </div>

      {/* ============ SECCIÓN 2: PREDICCIÓN DE SOBRES ============ */}
      <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 sm:p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-display text-xl flex items-center gap-2">
              <Target className="w-5 h-5 text-amber-400" /> Predicción de Sobres
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">Cuántos sobres más necesitas para completar el álbum</p>
          </div>
        </div>

        {prediccion.yaCompleto ? (
          <div className="text-center py-8">
            <Trophy className="w-16 h-16 mx-auto mb-3 text-amber-400" />
            <p className="font-display text-3xl text-amber-400">¡COMPLETO!</p>
            <p className="text-sm text-stone-400 mt-2">Ya tienes los 980 cromos del álbum</p>
          </div>
        ) : (
          <>
            {/* Estimación principal */}
            <div className="text-center mb-5">
              <div className="font-display text-6xl text-amber-400 mb-1">{prediccion.sobresEsperados.toLocaleString('es-CO')}</div>
              <div className="text-sm text-stone-400">sobres más en promedio</div>
              <div className="text-xs font-mono text-stone-500 mt-1">
                ≈ {prediccion.cromosEsperados.toLocaleString('es-CO')} cromos · {formatCOP(prediccion.costoEsperado)} COP
              </div>
            </div>

            {/* Rango optimista / pesimista */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="bg-emerald-950/30 border border-emerald-800 rounded-lg p-3">
                <div className="text-[10px] uppercase tracking-wider font-mono text-emerald-400 mb-1">Con suerte</div>
                <div className="font-display text-2xl text-emerald-300">{prediccion.sobresOptimista.toLocaleString('es-CO')}</div>
                <div className="text-[10px] text-stone-500 font-mono">sobres · {formatCOP(prediccion.costoOptimista)}</div>
              </div>
              <div className="bg-red-950/30 border border-red-800 rounded-lg p-3">
                <div className="text-[10px] uppercase tracking-wider font-mono text-red-400 mb-1">Sin suerte</div>
                <div className="font-display text-2xl text-red-300">{prediccion.sobresPesimista.toLocaleString('es-CO')}</div>
                <div className="text-[10px] text-stone-500 font-mono">sobres · {formatCOP(prediccion.costoPesimista)}</div>
              </div>
            </div>

            {/* Visualización: barra del progreso vs estimación */}
            <div className="bg-stone-900/50 border border-stone-800 rounded-lg p-3 mb-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-stone-400">Faltan</span>
                <span className="font-mono text-sm font-bold text-amber-400">{prediccion.faltan} cromos únicos</span>
              </div>
              <div className="relative w-full h-3 bg-stone-800 rounded-full overflow-hidden">
                <div 
                  className="absolute top-0 left-0 h-full gradient-gold rounded-full" 
                  style={{ width: `${(stats.tengo / catalogo.length) * 100}%` }} 
                />
              </div>
              <div className="flex justify-between text-[10px] font-mono text-stone-500 mt-1">
                <span>0</span>
                <span>{stats.tengo} / {catalogo.length}</span>
                <span>{catalogo.length}</span>
              </div>
            </div>

            {/* Explicación matemática */}
            <details>
              <summary className="text-xs text-amber-400 cursor-pointer hover:text-amber-300 font-medium">¿Cómo se calcula?</summary>
              <div className="mt-3 text-xs text-stone-400 space-y-2 bg-stone-900/30 p-3 rounded-lg border border-stone-800">
                <p>
                  Esta predicción usa el <strong className="text-stone-300">"problema del coleccionista"</strong> (Coupon Collector Problem) de la matemática estadística.
                </p>
                <p>
                  Asumiendo que cada cromo aparece con probabilidad uniforme en los sobres, el número esperado de cromos para conseguir los <span className="text-amber-300">{prediccion.faltan}</span> que te faltan es:
                </p>
                <p className="font-mono text-center text-amber-400 py-1">
                  E = N × (1/{prediccion.faltan} + 1/{prediccion.faltan-1} + ... + 1/1)
                </p>
                <p>
                  Donde N = {catalogo.length} (total de cromos del álbum). Cada sobre trae 7 cromos. El precio en Colombia es de $5.000 COP por sobre.
                </p>
                <p className="text-stone-500 italic mt-2">
                  ⚠️ Esta es una aproximación teórica. En la práctica los intercambios reducen muchísimo el costo real, y Panini puede tener distribución no-uniforme.
                </p>
              </div>
            </details>
          </>
        )}
      </div>

      {/* ============ MINI PANEL DE DATOS GLOBALES ============ */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div className="bg-stone-900 border border-stone-800 rounded-lg p-3 text-center">
          <div className="text-[10px] uppercase tracking-wider font-mono text-stone-500 mb-1">Cromos pegados</div>
          <div className="font-display text-2xl text-emerald-400">{stats.tengo}</div>
          <div className="text-[10px] text-stone-500 font-mono">de {catalogo.length}</div>
        </div>
        <div className="bg-stone-900 border border-stone-800 rounded-lg p-3 text-center">
          <div className="text-[10px] uppercase tracking-wider font-mono text-stone-500 mb-1">Repetidas</div>
          <div className="font-display text-2xl text-amber-400">{stats.repetidas}</div>
          <div className="text-[10px] text-stone-500 font-mono">para cambiar</div>
        </div>
        <div className="bg-stone-900 border border-stone-800 rounded-lg p-3 text-center">
          <div className="text-[10px] uppercase tracking-wider font-mono text-stone-500 mb-1">Foils</div>
          <div className="font-display text-2xl text-purple-400">{stats.foilsTengo}</div>
          <div className="text-[10px] text-stone-500 font-mono">de {stats.foilsTotal}</div>
        </div>
        <div className="bg-stone-900 border border-stone-800 rounded-lg p-3 text-center">
          <div className="text-[10px] uppercase tracking-wider font-mono text-stone-500 mb-1">Equipos completos</div>
          <div className="font-display text-2xl text-cyan-400">{estadoEquipos.filter(e => e.porcentaje === 100).length}</div>
          <div className="text-[10px] text-stone-500 font-mono">de 48</div>
        </div>
      </div>
    </div>
  );
}
