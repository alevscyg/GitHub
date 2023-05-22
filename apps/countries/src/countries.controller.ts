import { Controller, Get } from '@nestjs/common';
import { CountriesService } from './countries.service';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';

@Controller()
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}
  
  @MessagePattern({ cmd: 'parser-countries'})
  async getCountries(@Ctx() context: RmqContext){
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);

    return this.countriesService.formDatabase()
  }
  
  @MessagePattern({ cmd: 'get-all-countries'})
  async getAllCountries(@Ctx() context: RmqContext){
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);

    return this.countriesService.getAllCountries()
  }

  @MessagePattern({ cmd: 'get-countries-by-movieid' })
  async getUserById(
    @Ctx() context: RmqContext,
    @Payload() movie: { id: number },) {
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);

    return this.countriesService.getCountriesByMovieId(movie.id);
  }

  
  @MessagePattern({ cmd: 'get-movies-by-countries-names' })
  async getMoviesByCountriesNames(
    @Ctx() context: RmqContext,
    @Payload() movie: { ArrCountries: string[] },) {
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);

    return this.countriesService.getMoviesByCountriesNames(movie.ArrCountries);
  }
  @MessagePattern({ cmd: 'get-countriesofmovie-by-movies-id' })
  async getCountriesOfMoviesByMoviesId(
    @Ctx() context: RmqContext,
    @Payload() movie: { moviesid: number[] },) {
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);

    return this.countriesService.getCountriesByMoviesid(movie.moviesid);
  }
  @MessagePattern({ cmd: 'get-movies-by-country-name' })
  async getMoviesByCountryName(
    @Ctx() context: RmqContext,
    @Payload() movie: { country: string },) {
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);

    return this.countriesService.getMoviesByCountryName(movie.country);
  }
}
