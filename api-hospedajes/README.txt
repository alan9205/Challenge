***NOTAS DE LA APLICACION***

-El núcleo del código se dejó en inglés, ya que por mi metodología de trabajo me resulta mejor en este idioma, 
lo que facilita la identificación y gestión de los valores de manera rápida y efectiva.

-El código incluye comentarios explicativos para cada sección, proporcionando una guía detallada del funcionamiento
 y la lógica detrás de cada acción, lo que facilita la comprensión y el mantenimiento del mismo.

-El archivo .csv que facilita la integración de la información con el endpoint proporcionado se genera localmente 
en una carpeta designada, permitiendo su anexión o incorporación a un conjunto de datos (dataset) más amplio. 
Este dataset contendrá la información necesaria para realizar búsquedas según la ciudad seleccionada, 
habilitando el cruce de hospedajes con la ciudad filtrada.

Una vez obtenido el cruce de datos, se aplican filtros personalizados a través del endpoint desarrollado, los cuales incluyen:

- Filtro por ciudad
- Filtro por ciudad y rango de precios
- Filtro por ciudad y ranking
- Filtro por ciudad y estado
- Filtro por ciudad y amenidades (con capacidad de búsqueda de coincidencias sin requerir una palabra exacta)

-La aplicación está realizada en node js.
-Para poder ejecutar la aplicación por primera vez es requerido los siguientes pasos:
 EN CONSOLA:
    -npm install (posicionándose en la carpeta del proyecto)
    -Asegúrate de que el archivo rooms_data.csv está en la carpeta data. Si no existe crearla con mkdir data y posicionar el archivo en la carpeta.
    -Para ejecutar el proyecto ejecuta:
        -npm start
        -npm run dev

Endpoints de pruebas:
    -http://localhost:3000/search?query=monterrey
    -http://localhost:3000/search?query=acapulco&min_price=200&max_price=750
    -http://localhost:3000/search?query=monterrey&rating=4.9
    -http://localhost:3000/search?query=acapulco&state=guerrero
    -http://localhost:3000/search?query=Monterrey&amenities=lavadora

IA:
-Se empleó Inteligencia Artificial (IA) para optimizar los filtros de búsqueda y proporcionar resultados más rápidos y precisos, 
garantizando una experiencia del cliente eficiente y satisfactoria.

-Además, se empleó IA para desarrollar un algoritmo de lectura eficaz del archivo CSV, que realiza el cruce de datos con las ciudades, 
asegurando una devolución precisa y oportuna de la información.
