import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('👻 Iniciando seed de Archivo de lo Oculto...');

  // Limpiar base de datos respetando llaves foráneas
  await prisma.testimonio.deleteMany();
  await prisma.leyenda.deleteMany();
  await prisma.user.deleteMany();

  // 1. Usuarios con contraseñas hasheadas
  const adminPasswordHash = await bcrypt.hash('admin123', 10);
  const userPasswordHash = await bcrypt.hash('user123', 10);

  const admin = await prisma.user.create({
    data: {
      nombre: 'Investigador Principal',
      email: 'admin@oculto.com',
      password: adminPasswordHash,
      role: Role.admin,
    },
  });

  const normalUser = await prisma.user.create({
    data: {
      nombre: 'Testigo Nocturno',
      email: 'user@oculto.com',
      password: userPasswordHash,
      role: Role.user,
    },
  });

  console.log('✅ Usuarios creados:');
  console.log('   - Admin: admin@oculto.com / admin123');
  console.log('   - User:  user@oculto.com / user123');

  // 2. Leyendas reales de la Entrega 1
  const leyendasData = [
    {
      nombre: 'El Mohán',
      region: 'Colombia',
      categoria: 'Criatura',
      veracidad: 3,
      descripcion: 'Ser mitad hombre mitad bestia que habita los ríos y seduce a las mujeres.',
      historia:
        'Se dice que el Mohán vive en las profundidades de los ríos colombianos, con el cuerpo cubierto de pelo largo y ojos que brillan en la oscuridad. Le gusta enredar los anzuelos de los pescadores y esconder sus canoas como travesura. También se cuenta que seduce a las mujeres jóvenes que se bañan solas en el río, llevándolas a su cueva bajo el agua. Los campesinos de la región le dejan tabaco y aguardiente en la orilla para tenerlo contento.',
      imagen: '/imagenes/elmohan.jpg',
    },
    {
      nombre: 'El Silbón',
      region: 'Venezuela / Colombia',
      categoria: 'Aparición',
      veracidad: 3,
      descripcion: 'Un alma en pena que silba antes de aparecer, cargando un costal de huesos.',
      historia:
        'Cuenta la leyenda que un joven mató a su propio padre y fue condenado por su abuelo a cargar el costal con los huesos por el resto de la eternidad. Se le reconoce por su silbido particular: si se escucha fuerte y cerca, en realidad está lejos; pero si suena débil y lejano, significa que está a punto de aparecer. Los llaneros dicen que los perros ladran sin parar cuando el Silbón anda cerca, y que solo se libra de él quien logra recordarle a su madre.',
      imagen: '/imagenes/el-silbon.jpg',
    },
    {
      nombre: 'La Casa Embrujada de Amityville',
      region: 'Estados Unidos',
      categoria: 'Lugar maldito',
      veracidad: 2,
      descripcion: 'Una casa donde ocurrieron sucesos paranormales tras un crimen familiar.',
      historia:
        'En 1974, un joven asesinó a toda su familia en esta casa de Long Island mientras dormían. Un año después, una nueva familia se mudó y afirmó haber vivido apenas 28 días de terror: puertas que se abrían solas, voces susurrando desde las paredes, y una presencia que los observaba de noche. El caso se hizo tan famoso que inspiró libros y películas, aunque hasta hoy se debate si los sucesos fueron reales o una estrategia publicitaria bien lograda.',
      imagen: '/imagenes/CasaEmbrujada.jpg',
    },
    {
      nombre: 'El Chupacabras',
      region: 'Puerto Rico / Latinoamérica',
      categoria: 'Criatura',
      veracidad: 2,
      descripcion: 'Criatura que ataca ganado y animales pequeños, dejándolos sin sangre.',
      historia:
        'Los primeros avistamientos se reportaron en Puerto Rico a mediados de los años 90, cuando granjeros encontraban cabras y gallinas muertas con heridas extrañas y completamente desangradas. Se le describe como una criatura reptiloide, con espinas en la espalda y ojos rojos brillantes, capaz de moverse a gran velocidad. El fenómeno se extendió rápidamente por toda Latinoamérica, y aunque muchos casos se explicaron después como ataques de animales salvajes con enfermedades, el mito sigue vivo en el imaginario popular.',
      imagen: '/imagenes/chupacabras.jpg',
    },
    {
      nombre: 'La Patasola',
      region: 'Colombia',
      categoria: 'Criatura',
      veracidad: 3,
      descripcion: 'Mujer con una sola pierna que engaña a los hombres en la selva para devorarlos.',
      historia:
        'Se cuenta que fue una mujer infiel a la que su esposo descubrió y, en un ataque de celos, le cortó una pierna y la abandonó en la selva para que muriera. En lugar de morir, se convirtió en un espíritu vengativo que atrae a los hombres solitarios (especialmente leñadores y cazadores) tomando la forma de la mujer que aman, para luego revelar su verdadera apariencia y devorarlos. Se dice que grita de forma espeluznante antes de atacar, y que salta sobre una sola pierna a gran velocidad.',
      imagen: '/imagenes/patasola.jpg',
    },
    {
      nombre: 'El Triángulo de las Bermudas',
      region: 'Océano Atlántico',
      categoria: 'Lugar maldito',
      veracidad: 2,
      descripcion: 'Zona donde barcos y aviones han desaparecido sin explicación aparente.',
      historia:
        'Esta zona del Atlántico, delimitada por Miami, Puerto Rico y las Bermudas, se hizo famosa por decenas de desapariciones misteriosas de barcos y aviones desde el siglo XIX. El caso más célebre es el del Vuelo 19 de la Marina de EE.UU. en 1945, cinco aviones que desaparecieron sin dejar rastro durante un entrenamiento de rutina. Se han propuesto teorías que van desde campos magnéticos anómalos hasta actividad extraterrestre, aunque estudios científicos sugieren que la cantidad de incidentes no es mayor a la de otras zonas de tráfico marítimo intenso.',
      imagen: '/imagenes/triangulo.jpg',
    },
    {
      nombre: 'La Sayona',
      region: 'Venezuela',
      categoria: 'Aparición',
      veracidad: 3,
      descripcion: 'Espectro de una mujer que castiga a los hombres infieles apareciéndoseles de noche.',
      historia:
        'Cuenta la leyenda que fue una joven que, al descubrir que su esposo la engañaba con su propia madre, enloqueció de dolor y mató a ambos antes de morir maldecida. Desde entonces, se aparece de noche a los hombres infieles con la forma de una mujer hermosa vestida de blanco, para seducirlos y luego revelar su verdadero rostro putrefacto, dejándolos con vida pero marcados por el terror para siempre. Los llaneros venezolanos cuentan que se le reconoce por su llanto desgarrador, similar al de la Llorona, pero mucho más agresiva.',
      imagen: '/imagenes/sayona.jpg',
    },
    {
      nombre: 'La Llorona',
      region: 'México / Latinoamérica',
      categoria: 'Aparición',
      veracidad: 4,
      descripcion: 'Alma en pena de una mujer que vaga llorando por sus hijos perdidos.',
      historia:
        'Cuenta la antigua leyenda que una mujer desolada ahogó a sus hijos en el río tras ser abandonada. Arrepentida de su acto de locura, se quitó la vida y fue condenada a vagar por la eternidad buscando a sus niños con un lamento escalofriante: ¡Ay, mis hijos! Quienes la han escuchado afirman que su lamento congela la sangre de quien lo oye en las noches oscuras cerca a ríos o caminos solitarios.',
      imagen: '/imagenes/lallorona.jpg',
    },
  ];

  const leyendasCreadas = [];
  for (const l of leyendasData) {
    const creada = await prisma.leyenda.create({ data: l });
    leyendasCreadas.push(creada);
  }
  console.log(`✅ ${leyendasCreadas.length} leyendas registradas.`);

  // 3. Testimonios iniciales vinculando User y Leyenda
  const mohan = leyendasCreadas.find((l) => l.nombre === 'El Mohán');
  const silbon = leyendasCreadas.find((l) => l.nombre === 'El Silbón');

  if (mohan && silbon) {
    await prisma.testimonio.create({
      data: {
        userId: normalUser.id,
        leyendaId: mohan.id,
        lugar: 'Río Magdalena, Huila',
        descripcion:
          'Estábamos pescando a eso de las 2 de la madrugada y las canoas empezaron a girar en círculos sin corriente. Vimos salir humo de tabaco entre los juncos y una figura oscura de pelo largo nos miraba fijamente con dos brasas por ojos.',
        fechaAvistamiento: new Date('2024-05-14T02:30:00Z'),
      },
    });

    await prisma.testimonio.create({
      data: {
        userId: normalUser.id,
        leyendaId: silbon.id,
        lugar: 'Llanos Orientales, Arauca',
        descripcion:
          'Escuché un silbido muy bajito al lado de mi ventana mientras llovía. Recordé la advertencia de que si suena lejos está cerca, y mi perro no paraba de aullar desesperado debajo de la cama.',
        fechaAvistamiento: new Date('2024-09-02T23:15:00Z'),
      },
    });
    console.log('✅ 2 testimonios creados con relaciones completas.');
  }

  console.log('🎉 Seed completado exitosamente.');
}

main()
  .catch((e) => {
    console.error('❌ Error en el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
