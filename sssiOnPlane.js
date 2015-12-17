d=document;
d.coefRange1=100;
d.coefRange2=100;
d.enableHighDistance=false;
d.count=function(someArray)
{
	return someArray.length;
};
d.power=function(what,how)
{
	return Math.pow(what,how);
};
d.round=function(a) 
{
	var helpfulOne=Math.floor(a);
	var difference=a-helpfulOne;
	if((difference-0.5)>0){
		return Math.ceil(a);
	} else {
		return Math.floor(a);
	}
};
d.get35permucombos=function()
{
	var combos=[[2,1,0],[3,1,0],[4,1,0],[3,2,0],[4,2,0],[4,3,0],[3,2,1],[4,2,1],[4,3,1],[4,3,2]];
	var permucombos=[[2,1,0],[2,0,1],[1,2,0],[1,0,2],[0,2,1],[0,1,2],[3,1,0],[3,0,1],[1,3,0],[1,0,3],[0,3,1],[0,1,3],[4,1,0],[4,0,1],[1,4,0],[1,0,4],[0,4,1],[0,1,4],[3,2,0],[3,0,2],[2,3,0],[2,0,3],[0,3,2],[0,2,3],[4,2,0],[4,0,2],[2,4,0],[2,0,4],[0,4,2],[0,2,4],[4,3,0],[4,0,3],[3,4,0],[3,0,4],[0,4,3],[0,3,4],[3,2,1],[3,1,2],[2,3,1],[2,1,3],[1,3,2],[1,2,3],[4,2,1],[4,1,2],[2,4,1],[2,1,4],[1,4,2],[1,2,4],[4,3,1],[4,1,3],[3,4,1],[3,1,4],[1,4,3],[1,3,4],[4,3,2],[4,2,3],[3,4,2],[3,2,4],[2,4,3],[2,3,4]];
	return permucombos;
};
d.splitOnPlane=function(whatToSplit,howManyPieces,threshold)
{
	var result=[];
	var coefs=[0];
	var huu=0;
	for(;huu<howManyPieces;){
		result[huu]=[];
		++huu;
	}
	var haa=0;
	for(;haa<howManyPieces;){
		do{
			result[haa][0]=d.round(d.coefRange1*(Math.random())-d.coefRange1*(Math.random()));
			if(result[haa][0]!==0){
				break;
			}
		}while(1);
		//this makes the splits far enough from x coordinate = 0 (the secret)
		if(d.enableHighDistance){
			if(result[haa][0]>(0-(d.coefRange1/2))&&result[haa][0]<(d.coefRange1/2)){
				continue;
			}
		}
		++haa;
	}
	if(howManyPieces===1){
		result[0][1]=whatToSplit;
	}
	var xy=1;
	for(;xy<threshold+1;){
		do{
			coefs[xy]=d.round(d.coefRange2*(Math.random())-d.coefRange2*(Math.random()));
			if(coefs[xy]!==0){
				break;
			}
		}while(1);
		++xy;
	}
	var pic=0;
	for(;pic<howManyPieces;){
		result[pic][1]=whatToSplit;
		var coe=0;
		for(;coe<threshold;){
			var powo=d.power(result[pic][0],coe);
			result[pic][1]+=coefs[coe]*powo;
			++coe;
		}
		++pic;
	}
	return result;
};
d.reconstructOnPlane=function(whatToReconstruct,threshold)
{
	var lagrangeFreeCoef=[];
	var whatCount=threshold;
	var lagrangeIndex=0;
	for(;lagrangeIndex<whatCount;){
		lagrangeFreeCoef[lagrangeIndex]=1;
		var reconstructedIndex=0;
		for(;reconstructedIndex<whatCount;){
			if(lagrangeIndex!==reconstructedIndex){
				lagrangeFreeCoef[lagrangeIndex]*=whatToReconstruct[reconstructedIndex][0];
			}
			++reconstructedIndex;
		}
		++lagrangeIndex;
	}
	var lagrangeIndex=0;
	for(;lagrangeIndex<whatCount;){
		var divideBy=1;
		var reconstructedIndex=0;
		for(;reconstructedIndex<whatCount;){
			if(lagrangeIndex!==reconstructedIndex){
				divideBy*=(whatToReconstruct[lagrangeIndex][0]-whatToReconstruct[reconstructedIndex][0]);
			}
			++reconstructedIndex;
		}
		lagrangeFreeCoef[lagrangeIndex]/=divideBy;
		++lagrangeIndex;
	}
	var result=0;
	var pieceTimesCoef=0;
	for(;pieceTimesCoef<whatCount;){
		result+=lagrangeFreeCoef[pieceTimesCoef]*whatToReconstruct[pieceTimesCoef][1];
		++pieceTimesCoef;
	}
	result=d.round(result);
	if(threshold%2){
		return result;
	}else{
		return (0-result);
	}
};
d.bfSplits=function(intSecret,splitCount,reconstructCount)
{
	var tried=0;
	var reco=0;
	do{
		++tried;
		var splitParts=d.splitOnPlane(intSecret,splitCount,reconstructCount);
		var theCombos=d.get35permucombos();
		var combinationsCount=d.count(theCombos);
		var testCounter=0;
		var theyAllResultInOriginalSecret=true;
		do{
			var thisComboCount=d.count(theCombos[testCounter]);
			var abc=0;
			var thisTest=[];
			for(;abc<thisComboCount;){
				thisTest[abc]=[];
				thisTest[abc][0]=splitParts[theCombos[testCounter][abc]][0];
				thisTest[abc][1]=splitParts[theCombos[testCounter][abc]][1];
				++abc;
			}
			reco=d.reconstructOnPlane(thisTest,reconstructCount);
			if(reco!==intSecret){
				theyAllResultInOriginalSecret=false;
				break;
			}
			++testCounter;
			if(testCounter===combinationsCount){
				break;
			}
		}while(1);
		if(theyAllResultInOriginalSecret) {
			break;
		}
	}while(1);
	return [splitParts,tried];
};
