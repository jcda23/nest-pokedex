import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Model, isValidObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';
import { throwError } from 'rxjs';

@Injectable()
export class PokemonService {


  constructor(
    @InjectModel( Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>
  ){}

  async create(createPokemonDto: CreatePokemonDto) {

    try {
      createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();

      const pokemon = await this.pokemonModel.create({
        ...createPokemonDto
      })
  
      return pokemon ;
      
    } catch (error) {
      this.handleExceptions(error)
    }

  }

  async findAll() {
    return await this.pokemonModel.find().exec()
  }

  async findOne(term: string) {

    // const pokemon = await this.pokemonModel.call(id)
    let pokemon: Pokemon;

    if(!isNaN(+term)){
      pokemon = await this.pokemonModel.findOne({no:term})
    }

    if(!pokemon &&isValidObjectId(term)){
      pokemon = await this.pokemonModel.findById(term)
    }
    
    if(!pokemon) {
      pokemon = await this.pokemonModel.findOne({ name:term.toLowerCase().trim()})
    }
    
    if(!pokemon)
    throw new NotFoundException(`Pokemon "${term}" not found`)
  

    return pokemon
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    try {
      const pokemon = await this.findOne(term)
  
      if(UpdatePokemonDto.name) {
        updatePokemonDto.name = updatePokemonDto.name.toLowerCase().trim()
      }
  
      await pokemon.updateOne(updatePokemonDto)
      
      return { ...pokemon.toJSON(), ...updatePokemonDto}
      
    } catch (error) {
      this.handleExceptions(error)
    }

  }

  async remove(id: string) {

    // const pokemon = await this.findOne(term)
    // await pokemon.deleteOne()
    const {deletedCount} = await this.pokemonModel.deleteOne({_id:id})

    if(deletedCount === 0){
      throw new BadRequestException(`Pokemon with id "${id}" not found`)
    }
    return;
  }

  private handleExceptions(error: any){
    if(error.code === 11000) {
      throw new BadRequestException(`already exists a pokemon in db with ${JSON.stringify(error.keyValue)}`)
    } 

    throw new InternalServerErrorException(`Ivalid action - Check server logs`)
  }
}
