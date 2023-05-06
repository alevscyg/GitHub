import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { SpokenLanguage } from './spoken-language.model';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class SpokenLanguagesService {
  constructor(@InjectModel(SpokenLanguage) private spokenlanguageRepository:typeof SpokenLanguage,
  @Inject('FILM_SERVICE') private rabbitFilmsService: ClientProxy){}


  async getAllFilms() {
    const ob$ = await this.rabbitFilmsService.send({
      cmd: 'get-all-films',
    },
    {});
    const films = await firstValueFrom(ob$).catch((err) => console.error(err));
    return films;
  }

  
  async getSpokenLanguagesByMovieId(idU:number){
    return await this.spokenlanguageRepository.findAll({where:{movieid:idU}})
  }


  async formDatabase() {
    let Arrfilms = await this.getAllFilms()
    let filmIdArr = [];
    for(let i = 0; i<Arrfilms.length;i++){
      filmIdArr.push(Arrfilms[i].id);
    }
    let SpokenRep = await this.spokenlanguageRepository.findAll()
    let SpokenArr = []
    for(let i = 0; i<SpokenRep.length;i++){
      SpokenArr.push(SpokenRep[i].movieid+' '+SpokenRep[i].name+' '+SpokenRep[i].nameEn);
    }
    if(filmIdArr.length!=0){
      const genresREQ =  await fetch(`https://api.kinopoisk.dev/v1/movie?id=${filmIdArr.join('&id=')}&selectFields=id%20spokenLanguages&\
&limit=1000)`, {
        method: 'GET',
        headers:{
                  'X-API-KEY': 'QTD9VCR-EW8M0Y4-QR6W0Y1-Y8J1BFT',
                  'Content-Type': 'application/json',
                },
    })
    if(genresREQ.ok){
      let json = await genresREQ.json();
      let arrSpokenLanguage = []
      for(let i = 0;i<json.docs.length;i++){
        for(let j = 0;j<json.docs[i].spokenLanguages.length;j++){
          if((SpokenArr.includes(json.docs[i].id+' '+json.docs[i].spokenLanguages[j].name+' '+json.docs[i].spokenLanguages[j].nameEn))===false){
            await arrSpokenLanguage.push(
              {
                movieid: json.docs[i].id,
                name: json.docs[i].spokenLanguages[j].name,
                nameEn:json.docs[i].spokenLanguages[j].nameEn
              }
              )
          }
        }
      }
      return await this.spokenlanguageRepository.bulkCreate(arrSpokenLanguage)
    }
    else{
      console.log("Ошибка HTTP: " + genresREQ.status);
    }
}
  }
}
