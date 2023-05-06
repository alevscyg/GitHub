import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ProductionCompanies } from './production-companies.model';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ProductionCompaniesService {
    constructor(@InjectModel(ProductionCompanies) private productioncompaniesRepository: typeof ProductionCompanies,
    @Inject('FILM_SERVICE') private rabbitFilmsService: ClientProxy){}
  
  
    async getAllFilms() {
      const ob$ = await this.rabbitFilmsService.send({
        cmd: 'get-all-films',
      },
      {});
      const films = await firstValueFrom(ob$).catch((err) => console.error(err));
      return films;
    }

    async getProductionCompaniesByMovieId(idM:number){
      return await this.productioncompaniesRepository.findAll({where:{movieid:idM}})
    }
    
    async formDatabase() {
      let ArrFILms = await this.getAllFilms()
      let filmIdArr = [];
      for(let i = 0; i<ArrFILms.length;i++){
          filmIdArr.push(ArrFILms[i].id);
      }
      let producrPer = await this.productioncompaniesRepository.findAll()
      let ArrProducePer = []
      for(let i = 0; i<producrPer.length;i++){
        ArrProducePer.push(producrPer[i].movieid+' '+producrPer[i].name);
    }
      if(filmIdArr.length!=0){
      const genresREQ =  await fetch(`https://api.kinopoisk.dev/v1/movie?id=${filmIdArr.join('&id=')}&selectFields=id%20productionCompanies\
&limit=1000)`, {
            method: 'GET',
            headers:{
                      'X-API-KEY': 'QTD9VCR-EW8M0Y4-QR6W0Y1-Y8J1BFT',
                      'Content-Type': 'application/json',
                    },
        })
        if(genresREQ.ok){
          let json = await genresREQ.json();
          let arrproductionCompanies = []
          for(let i = 0; i<json.docs.length;i++){
            for(let j = 0 ; j< json.docs[i].productionCompanies.length;j++){
                if((ArrProducePer.includes(json.docs[i].id+' '+json.docs[i].productionCompanies[j].name))===false ){
                  await arrproductionCompanies.push(
                    {
                      movieid: json.docs[i].id,
                      name: json.docs[i].productionCompanies[j].name,
                      url: json.docs[i].productionCompanies[j].url,
                      previewUrl: json.docs[i].productionCompanies[j].previewUrl,
                    }
                    )
                }
            }
          }
          return await this.productioncompaniesRepository.bulkCreate(arrproductionCompanies)
}
}
}
}