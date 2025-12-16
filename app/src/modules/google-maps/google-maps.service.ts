import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class GoogleMapsService {
  private readonly baseUrl = 'https://maps.googleapis.com/maps/api';
  private readonly apiKey = process.env.GOOGLE_MAPS_KEY;
  private readonly placeLocation = {
    lat: 48.973694,
    lng: 23.967393,
  };

  async autocomplete(input: string, sessionToken: string) {
    const url = `${this.baseUrl}/place/autocomplete/json`;
    const cityLocation = { lat: 48.9734, lng: 24.0094 }; // координати центру м. Долина
    const radius = 5000;
    try {
      const { data } = (await axios.get(url, {
        params: {
          input,
          language: 'uk',
          key: this.apiKey,
          components: 'country:ua',
          location: `${cityLocation.lat},${cityLocation.lng}`,
          radius,
          strictbounds: true,
          types: 'route',
          sessionToken,
        },
      })) as unknown as {
        data: {
          predictions: { structured_formatting: { main_text: string } }[];
        };
      };
      return {
        data: data.predictions.map((p) => ({
          street: p.structured_formatting.main_text,
        })),
        sessionToken,
      };
    } catch {
      throw new BadRequestException('Помилка запиту до Google API');
    }
  }

  async geocodeAddress(address: string, sessionToken: string) {
    const url = 'https://maps.googleapis.com/maps/api/geocode/json';

    try {
      const { data } = (await axios.get(url, {
        params: {
          address: `${address}, Долина, Івано-Франківська область, Україна, 77500`,
          language: 'uk',
          key: this.apiKey,
          sessionToken,
        },
      })) as unknown as {
        data: {
          status: 'OK' | '';
          results: {
            geometry: {
              location: {
                lat: number;
                lng: number;
              };
            };
          }[];
        };
      };

      if (data.status !== 'OK') {
        throw new BadRequestException('Не вдалося знайти координати');
      }

      return data.results[0].geometry;
      //   return data;
    } catch {
      throw new InternalServerErrorException();
    }
  }

  async getDistanceMatrix(
    address: string,
    sessionToken: string,
  ): Promise<{ distanceMeters: number }> {
    const url = 'https://routes.googleapis.com/directions/v2:computeRoutes';
    const origin = {
      location: {
        latLng: {
          latitude: this.placeLocation.lat,
          longitude: this.placeLocation.lng,
        },
      },
    };

    try {
      const { location } = await this.geocodeAddress(address, sessionToken);
      const destination = {
        location: {
          latLng: {
            latitude: location.lat,
            longitude: location.lng,
          },
        },
      };
      const { data } = (await axios.post(
        url,
        {
          origin,
          destination,
          travelMode: 'DRIVE',
          // routingPreference: 'TRAFFIC_AWARE',
          units: 'METRIC',
          languageCode: 'uk',
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': this.apiKey,
            'X-Goog-FieldMask': 'routes.duration,routes.distanceMeters',
          },
        },
      )) as unknown as { data: { routes: { distanceMeters: number }[] } };
      if (!data.routes || data.routes.length === 0) {
        throw new NotFoundException(
          'Маршрут не знайдено. Перевірте координати призначення.',
        );
      }

      return data.routes[0];
    } catch {
      throw new InternalServerErrorException();
    }
  }
}
