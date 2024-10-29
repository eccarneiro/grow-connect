import express from 'express';
import { getCityCords } from './utils/geoUtils.js';
import { getSheet } from './datasource/sheets.js';
import 'dotenv/config'
import cors from 'cors';

const app = express();
const port = 3000;

app.use(cors());

const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

app.get('/localizacao', async (req, res) => {
  const cidade = req.query.cidade;
  const estado = req.query.estado;

  if (!cidade || !estado) {
    return res.status(400).send("Parâmetros inválidos.");
  }

  try {
    const coordenadas = await getCityCords(cidade, estado);
    if (coordenadas) {
      const latitude = coordenadas.lat;
      const longitude = coordenadas.lon;

      const sheet = await getSheet();
      const filiaisComDistancia = sheet.map(filial => {
        const [lat, lon] = filial.cord.split(', ');
        const distance = haversineDistance(latitude, longitude, lat, lon);
        return { ...filial, distance };
      });

      const filiaisProximas = filiaisComDistancia
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 2);


      const filiaisProximasComTitulo = {};
      filiaisProximas.forEach((filial, index) => {
        filiaisProximasComTitulo[`filiaisProximas${index + 1}`] = filial;
      });

      res.json({
        statusCode: 200,
        data: {
          origemCliente: {
            cidade,
            estado,
            latitude,
            longitude,
            ...filiaisProximasComTitulo,
          }
        }
      });
    } else {
      res.status(400).json({ error: 'Localização não encontrada.' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Erro ao processar a solicitação." });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
