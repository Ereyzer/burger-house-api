import { Controller } from '@nestjs/common';
// import { GoogleMapsService } from './google-maps.service';
// import { ApiOkResponse } from '@nestjs/swagger';

@Controller('google-maps')
export class GoogleMapsController {
  // constructor(private readonly googleMapsService: GoogleMapsService) {}
  // @Get()
  // autocomplete(@Query('query') query: string) {
  //   return this.googleMapsService.autocomplete(query);
  // }
  // @Get('geocoding')
  // geocoding(@Query() query: string) {
  //   // console.log(query);
  //   return this.googleMapsService.geocodeAddress(query);
  // }
  // @ApiOkResponse({
  //   example: { distanceMeters: 2325, duration: '334s' },
  // })
  // @Get('distance')
  // distance(@Query('query') query: string) {
  //   return this.googleMapsService.getDistanceMatrix(query);
  // }
}
