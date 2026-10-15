export type Level = 'A1' | 'A2' | 'B1' | 'B2'

export type VocabularyItem = {
  id: string
  spanish: string
  clue: string
  category: string
  level: Level
  illustration: string
  article?: 'el' | 'la' | 'los' | 'las'
  gender?: 'masculino' | 'femenino'
  alternatives?: string[]
  example?: string
  partOfSpeech?: 'sustantivo' | 'verbo'
  sourceUrl?: string
}

type Seed = [string, string, string, Level, string, string?, string?]

const groups: Record<string, Seed[]> = {
  Alimentos: [
    ['pan', 'Alimento horneado hecho con harina y agua.', '🥖', 'A1', 'Como pan en el desayuno.'],
    ['manzana', 'Fruta redonda que puede ser roja, verde o amarilla.', '🍎', 'A1', 'La manzana está dulce.'],
    ['queso', 'Alimento elaborado con leche, de sabor suave o fuerte.', '🧀', 'A1', 'Este queso es manchego.'],
    ['arroz', 'Cereal de granos pequeños muy usado en la cocina.', '🍚', 'A1', 'Preparamos arroz con verduras.'],
    ['huevo', 'Alimento con cáscara que ponen las aves.', '🥚', 'A1', 'Quiero un huevo frito.'],
    ['zanahoria', 'Verdura alargada, naranja y crujiente.', '🥕', 'A1', 'La zanahoria lleva muchas vitaminas.'],
    ['fresa', 'Fruta pequeña, roja y con semillas por fuera.', '🍓', 'A1', 'Las fresas están maduras.'],
    ['pescado', 'Animal acuático preparado como alimento.', '🐟', 'A2', 'Hoy cenamos pescado al horno.'],
    ['desayuno', 'Primera comida del día.', '🥣', 'A1', 'El desayuno está listo.'],
    ['merienda', 'Comida ligera que se toma por la tarde.', '🍪', 'A2', 'Tomamos una merienda a las cinco.'],
  ],
  Animales: [
    ['perro', 'Animal doméstico conocido por su fidelidad.', '🐕', 'A1', 'El perro juega en el parque.'],
    ['gato', 'Felino doméstico que suele maullar.', '🐈', 'A1', 'El gato duerme en el sofá.'],
    ['caballo', 'Animal grande que se puede montar.', '🐎', 'A1', 'El caballo corre por el campo.'],
    ['pájaro', 'Animal con plumas, alas y pico.', '🐦', 'A1', 'Un pájaro canta en la ventana.'],
    ['conejo', 'Animal pequeño de orejas largas.', '🐇', 'A1', 'El conejo come hierba.'],
    ['tortuga', 'Reptil lento protegido por un caparazón.', '🐢', 'A2', 'La tortuga vive muchos años.'],
    ['mariposa', 'Insecto de alas grandes y coloridas.', '🦋', 'A2', 'Una mariposa vuela sobre las flores.'],
    ['abeja', 'Insecto que produce miel.', '🐝', 'A2', 'La abeja visita una flor.'],
    ['oveja', 'Animal de granja cubierto de lana.', '🐑', 'A2', 'La oveja pasta en el prado.'],
    ['ballena', 'Mamífero marino de enorme tamaño.', '🐋', 'A2', 'La ballena sale a respirar.'],
  ],
  Hogar: [
    ['mesa', 'Mueble con una superficie plana y patas.', '🪑', 'A1', 'Los platos están sobre la mesa.'],
    ['silla', 'Asiento individual con respaldo.', '🪑', 'A1', 'Siéntate en esta silla.'],
    ['cama', 'Mueble donde dormimos.', '🛏️', 'A1', 'La cama está junto a la ventana.'],
    ['puerta', 'Elemento que permite entrar y salir de una habitación.', '🚪', 'A1', 'Cierra la puerta, por favor.'],
    ['ventana', 'Abertura con cristal que deja pasar la luz.', '🪟', 'A1', 'Abre la ventana para ventilar.'],
    ['espejo', 'Superficie donde vemos nuestra imagen reflejada.', '🪞', 'A2', 'Hay un espejo en el pasillo.'],
    ['almohada', 'Pieza blanda donde apoyamos la cabeza al dormir.', '🛏️', 'A2', 'Esta almohada es muy cómoda.'],
    ['nevera', 'Electrodoméstico que mantiene fríos los alimentos.', '🧊', 'A2', 'La leche está en la nevera.', 'refrigerador', 'frigorífico'],
    ['escoba', 'Utensilio con fibras para barrer el suelo.', '🧹', 'A2', 'Necesito una escoba para limpiar.'],
    ['enchufe', 'Punto de la pared donde conectamos aparatos eléctricos.', '🔌', 'B1', 'El enchufe está detrás del mueble.'],
  ],
  Familia: [
    ['madre', 'Mujer que tiene uno o más hijos.', '👩', 'A1', 'Mi madre cocina muy bien.'],
    ['padre', 'Hombre que tiene uno o más hijos.', '👨', 'A1', 'Mi padre trabaja en casa.'],
    ['hermana', 'Mujer que comparte uno o ambos progenitores contigo.', '👧', 'A1', 'Mi hermana vive en Sevilla.'],
    ['hermano', 'Hombre que comparte uno o ambos progenitores contigo.', '👦', 'A1', 'Mi hermano es más joven.'],
    ['abuela', 'Madre de tu madre o de tu padre.', '👵', 'A1', 'Mi abuela cuenta historias.'],
    ['abuelo', 'Padre de tu madre o de tu padre.', '👴', 'A1', 'Mi abuelo pasea cada mañana.'],
    ['prima', 'Hija de un tío o una tía.', '👩', 'A2', 'Mi prima estudia medicina.'],
    ['sobrino', 'Hijo de un hermano o una hermana.', '👦', 'A2', 'Mi sobrino tiene seis años.'],
    ['pareja', 'Persona con quien se mantiene una relación afectiva.', '🫶', 'A2', 'Mi pareja y yo viajamos juntos.'],
    ['gemelos', 'Dos hermanos nacidos en el mismo parto.', '👬', 'B1', 'Los gemelos se parecen mucho.'],
  ],
  Transporte: [
    ['coche', 'Vehículo de cuatro ruedas para pocas personas.', '🚗', 'A1', 'Vamos en coche al trabajo.', 'auto', 'automóvil'],
    ['autobús', 'Vehículo grande de transporte público por carretera.', '🚌', 'A1', 'El autobús llega a las ocho.'],
    ['tren', 'Transporte que circula sobre vías.', '🚆', 'A1', 'El tren sale del andén tres.'],
    ['bicicleta', 'Vehículo de dos ruedas movido con pedales.', '🚲', 'A1', 'Voy al mercado en bicicleta.', 'bici'],
    ['avión', 'Medio de transporte que vuela.', '✈️', 'A1', 'El avión aterriza esta tarde.'],
    ['barco', 'Medio de transporte que navega por el agua.', '⛵', 'A1', 'El barco cruza la bahía.'],
    ['metro', 'Tren urbano que suele circular bajo tierra.', '🚇', 'A2', 'Tomamos el metro en el centro.'],
    ['semáforo', 'Señal luminosa que regula el tráfico.', '🚦', 'A2', 'El semáforo está en rojo.'],
    ['andén', 'Zona de una estación donde se espera el tren.', '🚉', 'B1', 'Esperamos en el andén.'],
    ['atasco', 'Acumulación de vehículos que impide avanzar.', '🚙', 'B1', 'Llegué tarde por un atasco.'],
  ],
  Naturaleza: [
    ['árbol', 'Planta alta con tronco y ramas.', '🌳', 'A1', 'El árbol da mucha sombra.'],
    ['flor', 'Parte colorida de muchas plantas.', '🌼', 'A1', 'Esta flor huele muy bien.'],
    ['río', 'Corriente natural de agua que fluye hacia el mar.', '🏞️', 'A1', 'El río atraviesa la ciudad.'],
    ['montaña', 'Gran elevación natural del terreno.', '⛰️', 'A1', 'Subimos a la montaña.'],
    ['playa', 'Zona de arena junto al mar.', '🏖️', 'A1', 'La playa está tranquila.'],
    ['bosque', 'Terreno con muchos árboles.', '🌲', 'A2', 'Caminamos por el bosque.'],
    ['nube', 'Masa de gotas de agua suspendida en el cielo.', '☁️', 'A1', 'Esa nube parece un barco.'],
    ['relámpago', 'Destello de luz producido durante una tormenta.', '⚡', 'B1', 'Un relámpago iluminó el cielo.'],
    ['acantilado', 'Costa rocosa muy alta y casi vertical.', '🌊', 'B2', 'El sendero bordea el acantilado.'],
    ['sequía', 'Periodo largo con muy poca o ninguna lluvia.', '☀️', 'B2', 'La sequía afecta a los cultivos.'],
  ],
  Ropa: [
    ['camisa', 'Prenda con cuello y botones para la parte superior.', '👔', 'A1', 'Llevo una camisa blanca.'],
    ['pantalón', 'Prenda que cubre cada pierna por separado.', '👖', 'A1', 'Este pantalón me queda bien.'],
    ['zapato', 'Calzado que cubre el pie.', '👞', 'A1', 'He perdido un zapato.'],
    ['vestido', 'Prenda de una pieza que cubre el cuerpo y las piernas.', '👗', 'A1', 'Ese vestido es elegante.'],
    ['abrigo', 'Prenda gruesa que protege del frío.', '🧥', 'A1', 'Ponte el abrigo antes de salir.'],
    ['sombrero', 'Prenda que cubre la cabeza y tiene ala.', '👒', 'A2', 'El sombrero protege del sol.'],
    ['bufanda', 'Tira de tela que se lleva alrededor del cuello.', '🧣', 'A2', 'Necesito una bufanda de lana.'],
    ['guantes', 'Prendas que protegen las manos.', '🧤', 'A2', 'Me pongo los guantes.'],
    ['cinturón', 'Tira que se ajusta alrededor de la cintura.', '🥋', 'A2', 'El cinturón es de cuero.'],
    ['pendientes', 'Adornos que se llevan en las orejas.', '💎', 'B1', 'Sus pendientes son de plata.', 'aretes'],
  ],
  Lugares: [
    ['escuela', 'Lugar donde estudian niñas, niños y jóvenes.', '🏫', 'A1', 'La escuela está cerca de casa.'],
    ['hospital', 'Lugar donde atienden a personas enfermas.', '🏥', 'A1', 'El hospital está al final de la calle.'],
    ['mercado', 'Lugar con puestos donde se venden alimentos y otros productos.', '🛍️', 'A1', 'Compro fruta en el mercado.'],
    ['biblioteca', 'Lugar donde se consultan o prestan libros.', '📚', 'A2', 'Estudio en la biblioteca.'],
    ['farmacia', 'Establecimiento donde se venden medicamentos.', '⚕️', 'A1', 'La farmacia abre toda la noche.'],
    ['ayuntamiento', 'Edificio donde trabaja el gobierno municipal.', '🏛️', 'B1', 'La plaza está frente al ayuntamiento.'],
    ['panadería', 'Tienda donde se hace o vende pan.', '🥐', 'A2', 'La panadería huele de maravilla.'],
    ['barrio', 'Parte de una ciudad con identidad propia.', '🏘️', 'A2', 'Mi barrio es muy tranquilo.'],
    ['cruce', 'Lugar donde se encuentran dos o más caminos.', '↔️', 'B1', 'Gira a la derecha en el cruce.'],
    ['afueras', 'Zona exterior o alejada del centro de una población.', '🌆', 'B2', 'Viven en las afueras.'],
  ],
  Trabajo: [
    ['médica', 'Profesional que diagnostica y trata enfermedades.', '🩺', 'A1', 'La médica atiende al paciente.', 'médico'],
    ['profesor', 'Persona que enseña una materia.', '🧑‍🏫', 'A1', 'El profesor explica la lección.', 'profesora'],
    ['cocinera', 'Persona que prepara alimentos como profesión.', '🧑‍🍳', 'A1', 'La cocinera prepara la sopa.', 'cocinero'],
    ['bombero', 'Profesional que apaga incendios y realiza rescates.', '🧑‍🚒', 'A2', 'El bombero subió la escalera.', 'bombera'],
    ['periodista', 'Persona que investiga y comunica noticias.', '📰', 'A2', 'La periodista hace una entrevista.'],
    ['carpintero', 'Persona que fabrica o repara objetos de madera.', '🪚', 'B1', 'El carpintero construye una mesa.', 'carpintera'],
    ['sueldo', 'Dinero que recibe una persona por su trabajo.', '💶', 'B1', 'Cobra el sueldo a final de mes.', 'salario'],
    ['reunión', 'Encuentro de varias personas para tratar un asunto.', '👥', 'A2', 'Tenemos una reunión a las diez.'],
    ['horario', 'Distribución de actividades según las horas.', '🗓️', 'A2', 'Mi horario cambia los viernes.'],
    ['ascenso', 'Paso a un puesto de mayor responsabilidad.', '📈', 'B2', 'Celebró su ascenso con el equipo.'],
  ],
  Objetos: [
    ['llave', 'Objeto pequeño que abre o cierra una cerradura.', '🔑', 'A1', 'No encuentro la llave de casa.'],
    ['reloj', 'Objeto que indica la hora.', '⌚', 'A1', 'Mi reloj se ha parado.'],
    ['paraguas', 'Objeto que protege de la lluvia.', '☂️', 'A1', 'Lleva el paraguas porque llueve.'],
    ['teléfono', 'Aparato para comunicarse a distancia.', '📱', 'A1', 'El teléfono está cargando.', 'móvil'],
    ['mochila', 'Bolsa que se lleva a la espalda.', '🎒', 'A1', 'Los cuadernos están en la mochila.'],
    ['tijeras', 'Herramienta de dos hojas para cortar.', '✂️', 'A2', 'Corta el papel con las tijeras.'],
    ['martillo', 'Herramienta para golpear clavos.', '🔨', 'A2', 'Necesito un martillo.'],
    ['cartera', 'Objeto pequeño para llevar dinero y tarjetas.', '👛', 'A2', 'Guardo el recibo en la cartera.'],
    ['auriculares', 'Dispositivo que se coloca en los oídos para escuchar sonido.', '🎧', 'A2', 'Uso auriculares en el tren.'],
    ['sacacorchos', 'Utensilio que sirve para extraer tapones de botellas.', '🍾', 'B1', '¿Dónde está el sacacorchos?'],
  ],
}

const articles: Record<string, 'el' | 'la' | 'los' | 'las'> = {
  manzana: 'la', zanahoria: 'la', fresa: 'la', merienda: 'la', tortuga: 'la', mariposa: 'la', abeja: 'la', oveja: 'la', ballena: 'la',
  mesa: 'la', silla: 'la', cama: 'la', puerta: 'la', ventana: 'la', almohada: 'la', nevera: 'la', escoba: 'la', madre: 'la', hermana: 'la', abuela: 'la', prima: 'la', pareja: 'la', bicicleta: 'la', montaña: 'la', playa: 'la', nube: 'la', sequía: 'la', camisa: 'la', bufanda: 'la', escuela: 'la', biblioteca: 'la', farmacia: 'la', panadería: 'la', médica: 'la', cocinera: 'la', periodista: 'la', reunión: 'la', llave: 'la', mochila: 'la', cartera: 'la',
  gemelos: 'los', guantes: 'los', pendientes: 'los', auriculares: 'los', tijeras: 'las', afueras: 'las',
}

const baseVocabulary: VocabularyItem[] = Object.entries(groups).flatMap(([category, seeds]) =>
  seeds.map(([spanish, clue, illustration, level, example, ...alternatives], index) => {
    const article = articles[spanish] ?? 'el'
    return {
      id: `${category.toLowerCase()}-${index + 1}`,
      spanish,
      clue,
      category,
      level,
      illustration,
      article,
      gender: article === 'la' || article === 'las' ? 'femenino' : 'masculino',
      alternatives: alternatives.filter((value): value is string => Boolean(value)),
      example,
    }
  }),
)

const allVocabulary: VocabularyItem[] = [...baseVocabulary, ...extraVocabularyPartOne, ...extraVocabularyPartTwo, ...extraVocabularyPartThree, ...verbVocabulary]
export const vocabulary: VocabularyItem[] = allVocabulary.map((item) => ({
  ...item,
  partOfSpeech: item.partOfSpeech ?? 'sustantivo',
  sourceUrl: item.sourceUrl ?? `https://dle.rae.es/${encodeURIComponent(item.spanish)}`,
}))

export const vocabularyCategories = [...new Set(vocabulary.map((item) => item.category))]
import { extraVocabularyPartOne } from './vocabulary-extra'
import { extraVocabularyPartTwo } from './vocabulary-extra-two'
import { extraVocabularyPartThree } from './vocabulary-extra-three'
import { verbVocabulary } from './vocabulary-verbs'

