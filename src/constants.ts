export const REPORT_CATEGORIES = [
  {
    name: "Bateo",
    prefix: "B",
    reports: [
      "B-1: Perfil de Contacto Elite",
      "B-2: Swing Eficiente vs Producción",
      "B-3: Dominio de Zona",
      "B-4: Producción Real Esperada",
      "B-5: Transferencia del Swing Energética",
      "B-6: Longitud de Swing vs Contacto",
      "B-7: Perfil de Spray y Producción",
      "B-8: Poder Real vs Poder Esperado",
      "B-9: Producción Strike por Zona",
      "B-10: Eficiencia contra Tipos de Pitcheo",
      "B-11: Tendencia Evolutiva del Bateador"
    ]
  },
  {
    name: "Pitcheo",
    prefix: "P",
    reports: [
      "P-1: Elite Stuff",
      "P-2: Movimiento vs Liga",
      "P-3: Arsenal Completo del Pitcher",
      "P-4: Dominio por Zona Pitcher",
      "P-5: ERA vs xERA",
      "P-6: Ángulo de Brazo y Engaño",
      "P-7: Tempo y Ritmo de Juego",
      "P-8: Spin vs Contacto Permitido",
      "P-9: Arsenal vs Producción del Rival"
    ]
  },
  {
    name: "Defensa",
    prefix: "F",
    reports: [
      "F-1: Impacto Defensivo Total",
      "F-2: Outs Above Average",
      "F-3: Lectura y Reacción Outfield",
      "F-4: Probabilidad de Atrapada",
      "F-5: Fuerza de Brazo por Posición",
      "F-6: Impacto del Brazo en Carreras"
    ]
  },
  {
    name: "Catching",
    prefix: "C",
    reports: [
      "C-1: Framing Elite",
      "C-2: Pop Time y Transferencia",
      "C-3: Control del Running Game",
      "C-4: Postura vs Rendimiento",
      "C-5: Bloqueo y Prevención"
    ]
  }
];

export const RANKINGS_CONFIG: Record<string, any[]> = {
  Bateo: [
    { title: "Exit Velocity", endpoint: "/rankings/bat-exit-velocity", unit: "mph", description: "Velocidad media de salida de la bola tras el impacto." },
    { title: "Barrels", endpoint: "/rankings/bat-barrels", unit: "qty", description: "Contactos con combinación óptima de velocidad y ángulo de salida." },
    { title: "Home Runs", endpoint: "/rankings/bat-home-runs", unit: "HR", description: "Líderes en cuadrangulares de la temporada." },
    { title: "Bat Speed", endpoint: "/rankings/bat-bat-speed", unit: "mph", description: "Velocidad promedio del swing del bateador." },
    { title: "Hard Hit %", endpoint: "/rankings/bat-hard-hit", unit: "%", description: "Porcentaje de batazos con velocidad de salida >= 95 mph." },
    { title: "Expected wOBA", endpoint: "/rankings/bat-expected-woba", unit: "xwOBA", description: "Promedio de embasarse ponderado esperado basado en calidad de contacto." }
  ],
  Pitcheo: [
    { title: "xERA", endpoint: "/rankings/pit-xera", unit: "ERA", description: "Efectividad esperada basada en la calidad del contacto permitido." },
    { title: "Fastball Velocity", endpoint: "/rankings/pit-fastball-velocity", unit: "mph", description: "Velocidad promedio de la bola rápida (4-seam/2-seam)." },
    { title: "Pitch Movement", endpoint: "/rankings/pit-pitch-movement", unit: "in", description: "Movimiento horizontal y vertical comparado con el promedio." },
    { title: "Active Spin", endpoint: "/rankings/pit-active-spin", unit: "%", description: "Porcentaje de rotación que contribuye al movimiento del lanzamiento." },
    { title: "Whiff Rate %", endpoint: "/rankings/pit-whiff-rate", unit: "%", description: "Porcentaje de swings fallidos por parte de los bateadores." },
    { title: "Run Value por 100", endpoint: "/rankings/pit-run-value", unit: "RV/100", description: "Valor de carreras salvadas por cada 100 lanzamientos." }
  ],
  Correr: [
    { title: "Sprint Speed", endpoint: "/rankings/run-sprint-speed", unit: "ft/s", description: "Velocidad máxima en pies por segundo durante una carrera." },
    { title: "Baserunning Value", endpoint: "/rankings/run-baserunning-value", unit: "runs", description: "Valor total aportado por el corrido de bases (no robos)." },
    { title: "Basestealing Value", endpoint: "/rankings/run-basestealing-value", unit: "runs", description: "Valor aportado específicamente por el robo de bases." },
    { title: "Extra Bases", endpoint: "/rankings/run-extra-bases", unit: "%", description: "Frecuencia de toma de bases extras en hits de compañeros." },
    { title: "Home to 1B", endpoint: "/rankings/run-home-to-1b", unit: "sec", description: "Tiempo promedio de carrera de home a primera base." },
    { title: "Pitcher Running", endpoint: "/rankings/pit-pitcher-running", unit: "ft/s", description: "Velocidad de pies de los lanzadores como corredores." }
  ],
  Catching: [
    { title: "Framing", endpoint: "/rankings/cat-framing", unit: "runs", description: "Carreras salvadas por convertir bolas en strikes en las esquinas." },
    { title: "Pop Time", endpoint: "/rankings/cat-pop-time", unit: "sec", description: "Tiempo desde el guante hasta la recepción en base para out en robo." },
    { title: "Throwing", endpoint: "/rankings/cat-throwing", unit: "mph", description: "Fuerza y velocidad del brazo en tiros a las bases." },
    { title: "Blocking", endpoint: "/rankings/cat-blocking", unit: "runs", description: "Capacidad para detener lanzamientos que pican en la tierra." },
    { title: "Stealing Runs", endpoint: "/rankings/cat-stealing-runs", unit: "runs", description: "Carreras evitadas mediante la prevención de robos." },
    { title: "Stance Framing", endpoint: "/rankings/cat-stance-framing", unit: "runs", description: "Efectividad del framing según la postura del receptor." }
  ],
  Defensa: [
    { title: "OAA", endpoint: "/rankings/fld-outs-above-average", unit: "outs", description: "Outs realizados por encima del promedio de la liga." },
    { title: "Arm Strength", endpoint: "/rankings/fld-arm-strength", unit: "mph", description: "Velocidad máxima registrada en tiros defensivos." },
    { title: "Fielding Runs", endpoint: "/rankings/fld-fielding-runs", unit: "runs", description: "Carreras totales salvadas por la defensa del jugador." },
    { title: "Catch Probability", endpoint: "/rankings/fld-catch-probability", unit: "%", description: "Frecuencia de capturas en batazos con dificultad específica." },
    { title: "Arm Value", endpoint: "/rankings/fld-arm-value", unit: "runs", description: "Valor de carreras salvadas debido a la potencia y precisión del brazo." },
    { title: "Directional OAA", endpoint: "/rankings/fld-directional-oaa", unit: "outs", description: "OAA desglosado por la dirección del desplazamiento inicial." }
  ]
};

export const GLOSSARY = [
  {
    category: "Bateo (Batting)",
    terms: [
      { term: "Exit Velocity (EV)", name: "Velocidad de Salida", definition: "Qué tan rápido sale disparada la pelota después de que el bateador la golpea. ¡Como un cohete despegando!", scale: "95+ mph se considera un golpe fuerte." },
      { term: "Launch Angle (LA)", name: "Ángulo de Salida", definition: "Qué tan arriba o abajo sale la pelota. Si sale hacia el cielo es un ángulo alto, si va por el suelo es bajo.", scale: "8° a 32° es perfecto para hits lejanos." },
      { term: "Barrels", name: "Macetazos", definition: "Es cuando le pegas a la bola 'perfecto', con mucha fuerza y el ángulo justo para que casi siempre sea un descuadre o un jonrón.", scale: "Combina velocidad y altura ideal." },
      { term: "Hard Hit", name: "Golpe Fuerte", definition: "Cuando el bateador le pega a la bola a más de 95 millas por hora. ¡Es un impacto muy poderoso!", scale: "Indica fuerza constante en el bate." },
      { term: "Launch Angle Sweet-Spot", name: "Punto Dulce de Altura", definition: "Es cuando le pegas a la bola con la altura exacta para que vuele lejos, ni muy alto que sea un out fácil ni muy bajo al suelo.", scale: "Normalmente entre 8 y 32 grados." },
      { term: "Batted Ball Event (BBE)", name: "Evento de Bateo", definition: "Cada vez que un jugador le pega a la pelota y termina en algo: un out, un hit o un error.", scale: "Cuenta todos los contactos en juego." },
      { term: "Expected Batting Average (xBA)", name: "Promedio Esperado", definition: "Es un cálculo que dice qué tan probable es que un batazo sea un hit, mirando qué tan fuerte y hacia dónde le diste.", scale: "Se mide como el promedio normal (.000 a 1.000)." },
      { term: "Expected Weighted On-base Average (xwOBA)", name: "Valor Ofensivo Esperado", definition: "Una forma inteligente de medir qué tan buen bateador eres, mirando la calidad de tus golpes y no solo el resultado.", scale: "Mide el peligro real del bateador." },
      { term: "EV50", name: "Fuerza Real", definition: "El promedio de velocidad de la mitad de tus batazos más fuertes. ¡Muestra tu verdadera potencia!", scale: "Filtra los toques de bola y golpes flojos." },
      { term: "Adjusted EV", name: "Velocidad Ajustada", definition: "Una manera de medir la fuerza promedio pero ignorando los golpes que fueron por puro accidente o muy flojitos.", scale: "Muestra la fuerza normal de tus swings." }
    ]
  },
  {
    category: "Rastreo del Bate (Bat Tracking)",
    terms: [
      { term: "Bat Speed", name: "Velocidad del Bate", definition: "Qué tan rápido mueves el bate para intentar pegarle a la bola. ¡Como un ninja con su espada!", scale: "72 mph es el promedio; 75+ es muy rápido." },
      { term: "Fast Swing Rate", name: "Frecuencia de Swing Rápido", definition: "Qué tan seguido haces un swing que va a más de 75 millas por hora.", scale: "Mide la potencia constante del swing." },
      { term: "Swing Length", name: "Largo del Swing", definition: "Cuánta distancia recorre tu bate desde que empiezas a moverlo hasta que toca la bola. ¡Los mejores swings suelen ser cortos!", scale: "Se mide en pies." },
      { term: "Attack Angle", name: "Ángulo de Ataque", definition: "Si el bate va subiendo, bajando o derechito justo cuando va a chocar con la pelota.", scale: "Afecta si la bola sale hacia arriba o abajo." },
      { term: "Ideal Attack Angle", name: "Ángulo de Ataque Ideal", definition: "Mover el bate en el ángulo perfecto para darle a la bola de la mejor manera posible.", scale: "Ayuda a dar más 'Barrels'." },
      { term: "Attack Direction", name: "Dirección del Ataque", definition: "Hacia dónde apunta tu bate cuando le pegas a la bola: ¿hacia tu lado o hacia el lado contrario?", scale: "Define si eres un bateador de 'pull' o de banda contraria." },
      { term: "Swing Path Tilt", name: "Inclinación del Swing", definition: "Qué tan 'empinado' es el camino de tu bate. Algunos swings son planos y otros más inclinados.", scale: "Relacionado con la forma en que cruzas la zona." },
      { term: "Squared-Up Rate", name: "Contacto Limpio", definition: "Qué tan bien le diste a la bola con el mero centro del bate. ¡Es cuando suena '¡clack!' perfecto!", scale: "Usa la máxima velocidad posible del bate." },
      { term: "Blasts", name: "Explosiones", definition: "Es el mejor tipo de swing: cuando mueves el bate muy rápido Y además le pegas justo en el centro.", scale: "La combinación ganadora: Velocidad + Centro." },
      { term: "Swords", name: "Espadazos", definition: "Cuando el lanzador engaña tanto al bateador que este hace un swing feo y arrepentido. ¡Parece una espada débil!", scale: "Es una victoria total para el pitcher." }
    ]
  },
  {
    category: "Lanzamiento (Pitching)",
    terms: [
      { term: "Pitch Velocity", name: "Velocidad del Lanzamiento", definition: "Qué tan rápido lanza la pelota el pitcher. ¡Hay unos que lanzan flechas a 100 millas!", scale: "Mide la rapidez pura del pitcher." },
      { term: "Pitch Movement", name: "Movimiento de la Pelota", definition: "Cuanto se mueve la bola hacia los lados o hacia abajo mientras vuela. ¡Parece que esquiva el bate!", scale: "Se mide en pulgadas de quiebre." },
      { term: "Active Spin", name: "Rotación Activa", definition: "Qué tanta de la vuelta que da la bola hace que se mueva más. Si gira bien, 'cae' o 'sube' más.", scale: "Entre más alta, más se mueva la bola." },
      { term: "Spin Rate", name: "Rapidez de Giro", definition: "Cuántas vueltas por minuto da la pelota después de que el pitcher la suelta. ¡Gira miles de veces!", scale: "2500+ rpm es un giro muy alto." },
      { term: "Extension", name: "Extensión", definition: "Qué tan cerca del bateador suelta la pelota el pitcher. Entre más cerca, ¡más rápido se siente!", scale: "Un promedio de 6.5 pies es normal." },
      { term: "Expected Earned Run Avg (xERA)", name: "Efectividad Esperada", definition: "Dice cuántas carreras debería permitir un pitcher basándose en qué tan bien le pegan, sin importar la suerte.", scale: "Igual que la ERA normal: menos es mejor." }
    ]
  },
  {
    category: "Defensa (Fielding / Catching)",
    terms: [
      { term: "Pop Time", name: "Tiempo de Reacción", definition: "El tiempo que tarda el catcher desde que atrapa la bola hasta que la lanza a una base. ¡Tiene que ser un rayo!", scale: "Menos de 2.0 segundos es muy bueno." },
      { term: "Arm Strength", name: "Fuerza del Brazo", definition: "Qué tan duro puede lanzar la pelota un jugador. ¡Algunos tienen un cañón de brazo!", scale: "90+ mph es un brazo de élite." },
      { term: "Lead Distance", name: "Distancia de Ventaja", definition: "Qué tan lejos se despega un corredor de la base para intentar robarla. ¡Cuidado con el pitcher!", scale: "Se mide en pies desde la base." },
      { term: "Jump", name: "El Salto", definition: "Qué tan rápido reacciona un jardinero cuando suena el bate y qué tan derechito corre a la bola.", scale: "Los primeros 3 segundos son los que cuentan." },
      { term: "Outs Above Average (OAA)", name: "Outs Sobre el Promedio", definition: "Cuantos outs difíciles logra hacer un jugador que otros fallarían. ¡Es la nota de los cracks!", scale: "0 es promedio; los positivos son mejores." },
      { term: "Fielding Run Value", name: "Valor Defensivo Total", definition: "Una nota final que dice cuántas carreras evitó un jugador gracias a que defiende súper bien.", scale: "Mide el impacto total de tu guante." },
      { term: "Catch Probability", name: "Probabilidad de Atrapada", definition: "Qué tan difícil era atrapar esa pelota. Algunas son fáciles y otras casi imposibles.", scale: "De 0% (imposible) a 100% (fácil)." },
      { term: "Blocks Above Average", name: "Bloqueos Sobre el Promedio", definition: "Qué tan bueno es el catcher evitando que las pelotas reboten y se le escapen lejos.", scale: "Mide la seguridad detrás del plato." }
    ]
  },
  {
    category: "Correr (Running)",
    terms: [
      { term: "Sprint Speed", name: "Velocidad de Carrera", definition: "Qué tan rápido corre un jugador cuando va a su máxima capacidad. ¡Como un corredor de carreras!", scale: "27 ft/s es promedio; 30+ ft/s es increíble." },
      { term: "Bolt", name: "El Rayo", definition: "Cuando un jugador corre súper rápido, a más de 30 pies por segundo. ¡Es pura candela!", scale: "Es el reconocimiento a los más veloces." }
    ]
  }
];
