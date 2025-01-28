const express = require('express');
const axios = require('axios');
const fs = require('fs');
const csvParser = require('csv-parser');

const app = express();
const PORT = 3000;

// Ruta para verificar que el servidor está funcionando
app.get('/', (req, res) => {
  res.send('API de hospedajes activa ALAN SANTAMARIA');
});

// Función para cargar el dataset CSV
const loadDatasetAccomodations = () => {
  return new Promise((resolve, reject) => {
    const accommodations = [];
    fs.createReadStream('./data/rooms_data.csv') // Asegúrate de que el archivo esté en la carpeta 'data'
      .pipe(csvParser())
      .on('data', (row) => accommodations.push(row))
      .on('end', () => resolve(accommodations))
      .on('error', (error) => reject(error));
  });
};

// Función para consultar la API de Reservamos
const fetchCities = async (query) => {
  try {
    const response = await axios.get(`https://search.reservamos.mx/api/v2/places?q=${query}`);
    return response.data.filter((place) => place.result_type === 'city'); // Filtrar solo ciudades
  } catch (error) {
    throw new Error('Error al consultar la API de Reservamos');
  }
};

// Endpoint para buscar ciudades y hospedajes
app.get('/search', async (req, res) => {
    const { query, state, min_price, max_price, rating, amenities } = req.query;
  
    if (!query) {
      return res.status(400).json({ error: 'El parámetro "query" es obligatorio' });
    }
  
    try {
      // Consultar ciudades y cargar el dataset
      const cities = await fetchCities(query);
      const accommodationsDS = await loadDatasetAccomodations();
  
      // Filtrar solo las ciudades con coincidencia exacta (case-insensitive)
      let filteredCities = cities.filter(
        (city) => city.city_name.toLowerCase() === query.toLowerCase()
      );
  
      // Si el parámetro "state" está presente, filtrar por estado
      if (state) {
        filteredCities = filteredCities.filter(
          (city) => city.state.toLowerCase() === state.toLowerCase()
        );
      }
  
      // Validar si no se encontraron ciudades
      if (filteredCities.length === 0) {
        return res.status(404).json({
          message: `No se encontraron resultados para la ciudad "${query}"` + (state ? ` en el estado "${state}"` : ''),
        });
      }
  
      // Cruzar las ciudades filtradas con hospedajes
      const results = filteredCities.map((city) => {
        let cityAccommodations = accommodationsDS.filter(
          (acc) => acc.city.toLowerCase() === city.city_name.toLowerCase()
        );
  
        // Aplicar filtros avanzados
        if (min_price || max_price) {
          cityAccommodations = cityAccommodations.filter((acc) => {
            const price = parseFloat(acc.price_per_night);
            return (
              (!min_price || price >= parseFloat(min_price)) &&
              (!max_price || price <= parseFloat(max_price))
            );
          });
        }
  
        if (rating) {
          cityAccommodations = cityAccommodations.filter(
            (acc) => parseFloat(acc.rating_overall) >= parseFloat(rating)
          );
        }
  
        if (amenities) {
          const requestedAmenities = amenities.split(',').map((a) => a.trim().toLowerCase());
          cityAccommodations = cityAccommodations.filter((acc) => {
            const accAmenities = acc.amenities ? acc.amenities.toLowerCase() : '';
            return requestedAmenities.every((amenity) => accAmenities.includes(amenity));
          });
        }
  
        return {
          city: city.city_name,
          state: city.state,
          country: city.country,
          accommodations: cityAccommodations.map((acc) => ({
            title: acc.title,
            price_per_night: acc.price_per_night,
            amenities: acc.amenities,
            ratings: {
              overall: acc.rating_overall,
              cleanliness: acc.rating_cleanliness,
              accuracy: acc.rating_accuracy,
            },
          })),
        };
      });
  
      // Validar si no hay hospedajes en las ciudades encontradas
      const resultsWithAccommodations = results.filter((r) => r.accommodations.length > 0);
  
      if (resultsWithAccommodations.length === 0) {
        return res.status(404).json({
          message: `No se encontraron hospedajes para la ciudad "${query}"` + (state ? ` en el estado "${state}"` : ''),
        });
      }
  
      res.json(resultsWithAccommodations);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Ocurrió un error al procesar la solicitud' });
    }
  });
  
  

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
