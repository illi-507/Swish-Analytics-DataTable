
import axios from 'axios';

export async function getAlternates(){
   return axios.get('/Data/alternates.json')
    .then(response => {
      return response.data;
    })
    .catch(error => {
      console.error(error);
    });
  }


export async function getProps(){
    return axios.get('/Data/props.json')
    .then(response => {

      return response.data;
    })
    .catch(error => {
      console.error(error);
    });
}


/**
 *  Convert raw data into aggregated data for further process:
 *    {name: Russel,  
       team name : Lakers
       position: PG,
       market:[
           assists:{ line: null, suspended: null, low: 0, high:0},
           rebounds: { line: null, suspended: null, low: 0, high:0},
           points: { line: null, suspended: null, low: 0, high:0},
           steals: { line: null, suspended: null, low: 0, high:0},
       ]
    }
 *  
 */


  export async function aggregateProps(){
        let propsData = await getProps();

        let result ={};

        for(let value of Object.values(propsData)){
              if(!result[value.playerName]){
                   result[value.playerName] = {
                    name: value.playerName,
                    teamName : value.teamNickname,
                    position:value.position,                  

                   };

                   result[value.playerName]["market"] = {};

                   result[value.playerName]["market"][value.statType] = {
                      line:value.line,
                      marketSuspended: value.marketSuspended,
                      low: -1, 
                      high: -1,
                      lineExist: false,
                      optimalLinesAllUnder40Percent: false,
                      globalSuspended: null
                   }
                   
              }
              else{ 
                result[value.playerName]["market"][value.statType] = {
                    line:value.line,
                      marketSuspended: value.marketSuspended,
                      low:-1, 
                      high: -1,
                      lineExist: false,
                      optimalLinesAllUnder40Percent: false,
                      globalSuspended: null
                 }
              }
        }
        return result;
    }
/**
 * Use aggregated props data to aggregate with alternates data
 * 
 *    {name: Russel,  
       team name : Lakers
       position: PG,
       market:[
           assists:{ line: 9, suspended: 1, low: 8, high:10},
           rebounds: { line: 9, suspended: 1, low: 8, high:10},
           points:{ line: 9, suspended: 1, low: 8, high:10},
           steals: { line: 1, suspended: 1, low: 0.5, high:2},
       ]
    }
 * 
 */
export async function aggregateAlternates(){
   const aggregatePropsData = await aggregateProps();

   let alternatesData = await getAlternates();
    
   for(let entry of alternatesData){
      let playerData = aggregatePropsData[entry.playerName];


      let playerMarketStatType =  playerData["market"][entry.statType];
      playerMarketStatType.lineExist ||= 
      playerMarketStatType.line === entry.line;

      playerMarketStatType.optimalLinesAllUnder40Percent ||=
      (entry.underOdds<=0.4 && entry.overOdds<=0.4 && entry.pushOdds<=0.4);


      playerMarketStatType.globalSuspended = playerMarketStatType.marketSuspended || !playerMarketStatType.lineExist||
                          playerMarketStatType.optimalLinesAllUnder40Percent;    
      
      

       if(playerMarketStatType.high === -1 && playerMarketStatType.low === -1){
        
           playerMarketStatType.high= entry.line;
           playerMarketStatType.low = entry.line;
       }
       else{                   
         if(entry.line > playerMarketStatType.high){
           playerMarketStatType.high = entry.line;
         }
         else if(entry.line < playerMarketStatType.low){
            playerMarketStatType.low = entry.line;
       } 
 
    }     
   }

   return aggregatePropsData;   
}
/**
 * Get the correct formated data for a table:
 *     name , team name, position, statType, marketSuspended, low, high
 *     Davis, LAL,        SF,      points,     0 ,             20    30   
 */
export async function formatTableData(){
    let aggregateData = await aggregateAlternates();
    aggregateData = Object.values(aggregateData);
    let result = [];

    let index = 1;
    for(let entry of aggregateData){
        for(let [key, value] of Object.entries(entry.market)){
            let object = {
                number: index,
                name: entry.name, 
                teamName: entry.teamName,
                position: entry.position,
                statType: key,
                marketSuspended: value.globalSuspended?"Suspended":"Released",
                low: value.low,
                high: value.high     
                }
            result.push(object);
            index++;
        }
    }

    return result;
}
