var express = require('express');
var router = express.Router();

/* GET users listing. */
var monk = require('monk');
var db = monk('localhost:27017/toppr');

router.get('/list', function(req, res, next) {
  	var battles  = db.get('battles');
  	battles.find({},function(err,battles){
  		if(err){
  			console.error('Could not connect to database');
  			return err;
  		}
  		else{
  			return res.send(JSON.stringify(battles,null,10));
  		}
  	});
});

router.get('/count', function(req, res, next) {
	var respone={};
  	var battles  = db.get('battles');
  	battles.find({},function(err,battles){
  		if(err){
  			console.error('Could not connect to database');
  			respone['statusCode'] = 404;
  			respone['respone'] = err;
  		}
  		else{
  			respone['statusCode']=200;
  			respone['response'] = battles.length;
  		}
  		return res.json(respone);
  	});
});

router.get('/stat', function(req, res, next) {
  	var battles  = db.get('battles');
  	var respone  = {};
  	// console.log(req);
  	battles.find({},function(err,battles){
  		if(err){
  			console.error('Could not connect to database');
  			respone['statusCode'] = 404;
  			respone['respone'] = err;
  		}
  		else{
  			var battle,
  			attacker_king={},
  			defender_king={},
  			region={},
  			name={},
  			win=0,
  			loss=0,
  			CONSTANT=Number.MAX_SAFE_INTEGER,
  			attacker_max  = {'count' : -CONSTANT,'name' : ""},
  			defender_max = {'count' : -CONSTANT,'name' : ""},
  			region_max     = {'count' : -CONSTANT,'name' : ""},
  			name_max      = {'count' : -CONSTANT,'name' : ""},
  			unique_battles = [],
  			MinDefenderSize    =  CONSTANT,
  			MaxDefenderSize   =  -1*CONSTANT,
  			SumDefenderSize  =  0,
  			DefenderCnt = 0;

  			for(var i=0; i<battles.length;i++){
  				
  				battle = battles[i];
  				console.log(battle);
  				if(battle['attacker_king']=='')
  					battle['attacker_king']='anonymous';
  				
  				if(attacker_king.hasOwnProperty(battle['attacker_king']))
  					attacker_king[battle['attacker_king']]++;
  				else attacker_king[battle['attacker_king']]=1;

  				if(attacker_king[battle['attacker_king']] > attacker_max['count']  && battle['attacker_king']!="anonymous"){
  					attacker_max['count'] = attacker_king[battle['attacker_king']];
  					attacker_max['name'] = battle['attacker_king'];
  				}

  				if(battle['defender_king']=='')
  					battle['defender_king']='anonymous';
  				if(defender_king.hasOwnProperty(battle['defender_king']))
  					defender_king[battle['defender_king']]++;
  				else defender_king[battle['defender_king']]=1;

  				if(defender_king[battle['defender_king']] > defender_max['count']  && battle['defender_king']!="anonymous"){
  					defender_max['count'] = defender_king[battle['defender_king']];
  					defender_max['name'] = battle['defender_king'];
  				}

  				if(battle['region']=='')
  					battle['region']='anonymous';
  				if(region.hasOwnProperty(battle['region']))
  					region[battle['region']]++;
  				else region[battle['region']]=1;

  				if(region[battle['region']] > region_max['count']  && battle['region']!="anonymous"){
  					region_max['count'] = region[battle['region']];
  					region_max['name'] = battle['region'];
  				}

  				if(battle['name']=='')
  					battle['name']='anonymous';
  				if(name.hasOwnProperty(battle['name']))
  					name[battle['name']]++;
  				else name[battle['name']]=1;

  				if(name[battle['name']] > name_max['count']  && battle['name']!="anonymous"){
  					name_max['count'] = name[battle['name']];
  					name_max['name'] = battle['name'];
  				}

  				if(battle['attacker_outcome']==="win")
  						win++;
  				if(battle['attacker_outcome']==="loss")
  						loss++;

  				if(unique_battles.indexOf(battle['battle_type'])==-1 && battle['battle_type']!='')
  					unique_battles.push(battle['battle_type']);
  				if(battle['defender_size']!=''){
	  				MinDefenderSize = Math.min(MinDefenderSize,battle['defender_size']);
	  				MaxDefenderSize= Math.max(MaxDefenderSize,battle['defender_size']);
	  				SumDefenderSize += battle['defender_size'];
	  				DefenderCnt++;
	  			}
  			}
  			respone['most-active']={};
  			respone['attacker_outcome']={};
  			respone['battle_types'] = unique_battles;
  			respone['defender_size'] = {};
  			respone['most-active']['attacker_king'] = attacker_max['name'];
  			respone['most-active']['defender_king'] = defender_max['name'];
  			respone['most-active']['region'] = region_max['name'];
  			respone['most-active']['name'] = name_max['name'];
  			respone['attacker_outcome']['win'] = win;
  			respone['attacker_outcome']['loss'] = loss;
  			respone['defender_size']['average'] = Math.round(SumDefenderSize/DefenderCnt);
  			respone['defender_size']['min'] = MinDefenderSize;
  			respone['defender_size']['max'] = MaxDefenderSize;
  			
  			res.setHeader('Content-Type', 'application/json');
    			return res.send(JSON.stringify(respone,null,4));
  		}
  	});
});


router.get('/search', function(req, res, next) {
	var query={},respone={},tmp={};
  	var battles  = db.get('battles');
  	// console.log(req.query);

  	battles.find(req.query,function(err,battles){
  		if(err){
  			console.error('Could not connect to database');
  			respone['statusCode'] = 404;
  			respone['respone'] = err;
  		}
  		else{
  			respone['statusCode']=200;
  			respone['respone'] = battles;
  		}
  		return res.json(respone);
  	});
	// return res.json('system testing going on');
});


module.exports = router;
