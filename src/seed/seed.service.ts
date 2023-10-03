import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { PokeResponse } from './interfaces/poke-response.interface';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { AxiosAdapter } from 'src/common/http-adapters/axios.adpater';

@Injectable()
export class SeedService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly http: AxiosAdapter, // Patron adaptador
  ) {}

  async executeSeed() {
    await this.pokemonModel.deleteMany({}); //Bortra la base de datos

    const data = await this.http.get<PokeResponse>(
      'https://pokeapi.co/api/v2/ability/?limit=650',
    );

    const pokemonToInsert: { name: string; no: number }[] = [];

    data.results.forEach(async ({ name, url }) => {
      const segments = url.split('/');
      const no: number = +segments[segments.length - 2];

      await pokemonToInsert.push({ name, no }); // Insertas en un array y luego haces solo una peticion a la base de datos
    });

    await this.pokemonModel.create(pokemonToInsert); // Almacenas en la base de datos con una sola peticion

    return 'Seed executed';
  }
}
