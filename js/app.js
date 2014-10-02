"use strict";
/*
*This is the Configuration Module
*Deals with the NO of example and definition and AppKey needed for requesting Services from the wordnik API
*getter and setter is specified for each parameter.
*/
var Configuration = function () {
	var __exampleLimit__ = 3;
	var __definitionLimit__ = 3;
	var __appKey__ = "a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5";
	return{
		getExampleLimit: function(){
			return __exampleLimit__;
		},
		
		setExampleLimit: function(value){
			__exampleLimit__ = value;
		},
		
		setDefinitionLimit: function(value){
			__definitionLimit__ = value;
		},
		
		getDefinitionLimit: function(){
			return __definitionLimit__;
		},
		
		setAppKey: function(appKeyValue){
			__appKey__ = appKeyValue;
		},
		
		getAppKey: function(){
			return __appKey__;
		}
	};
}();

/*
*This module deals with Eventhandling for  the entire application.
*All the event are handled only in the document level.
*/
var EventHandling = function(){

	//deals with all the click action in the app
	$(document).bind('click',clickEventHandler);
	//deals with the mouse up action for the text editor
	$("#texteditor").bind('mouseup',mouseUpEventHandler);
	//deals wwith all the change event action in the app
	$(document).bind('change',changeEventHandler);

	function clickEventHandler(ev){
		var srcEle = ev.srcElement || ev.target;
		if(srcEle.id === "clear_Results" ){
			DICTIONARY.clearResults();
			dictionary1.clearDictionary();
		}
	}

	function mouseUpEventHandler(ev){
		var srcEle = ev.currentTarget;
		if(srcEle.id === "texteditor" ){
			DICTIONARY.getWordDetails();
		}
	}

	function changeEventHandler(ev){
		var srcEle = ev.srcElement || ev.target;
		if(srcEle.id === "example_Limit" ){
			Configuration.setExampleLimit(srcEle.value);
		}else if(srcEle.id === "definition_Limit" ){
			Configuration.setDefinitionLimit(srcEle.value);
		}
	}
	
}();

/*
*This module deals with retrieving all the meaning and renderring he data in the UI
*All the UI manipulation are dealt with in this module
*/
var DICTIONARY = {
	//For clearing the Rssults.
	clearResults : function(){
		$("#results").empty();
		$("#texteditor").empty();
	},

	//For getting the  word which is selected.Replaces all the spaces.
	getWordDetails : function (){
		var word = "";
		var wordElement = window.getSelection();
		word = wordElement.toString();
		word = word.replace(/ +/g, "");
		word = word.trim();
		if(word.toString() == " " || word.toString() == ""){
			return;
		}else{
			this.sendAndRecieveWordDetails(word);
		}
	},

	/*
	*Does the Ajaax calls and Render the result in the Ui
	*1.checks the local dictionary is the word is already seached and result is available in the UI itself.
	*1.1 if available, will scroll the corresponding result into view.
	*2.Uses Deffered and Promisse patters to do the Ajac calls and once it is resolved, the result appended to UI,
	*and result scrolled into view and adding word to local Dictionary.
	*3.If word is not found in wordnik dictionary, Alert is shown
	*/
	sendAndRecieveWordDetails : function(word){
		if(window.dictionary1.checkDictionaryForWord(word)){
			$("#wordname_"+ word )[0].scrollIntoView();
		}else{
    	$.when(
    		AJAXCALL.getExampleData(word),
   		    AJAXCALL.getDefinitionData(word)
    	).then(function(exampleData, definitionData){
        	if(exampleData && definitionData && exampleData[1] === "success" && definitionData[1] === "success" && 
        		exampleData[0].examples && exampleData[0].examples.length > 0 && definitionData[0].length > 0){
        		var wordObj = DICTIONARY.extractMeaningAndDefinition(exampleData[0].examples,definitionData[0]);
        		var templateHTMLString = DICTIONARY.createTemplates(wordObj);
        		$("#results").append(templateHTMLString);
       		 	$("#wordname_"+ wordObj.word )[0].scrollIntoView();
       		 	window.dictionary1.addWordToDictionary(wordObj.word);
       		 }else{
        		alert("Alas!! The Word you searched for is not available in the Wordnik dictionary.")
        	}
    	});
    	}
	},

	/*
	*Parsing the Data return by Wordnik API into Standard Format
	*INPUT: array of examples object, array of definitions object.
	*OUTPUT: Object in format: {"word":word , "examples":exampleTextArray , "meanings" : definitionTextArray};
	*this is done so that the Word retieved can be stored in local storage for future use. and reuse of API, as it gives stardard otput
	*/
	extractMeaningAndDefinition : function(exampleArray, definitionArray){
		var wordDetailsObject = {};
		var exampleTextArray =[], definitionTextArray = [];
		for (var i=0; i < exampleArray.length; i++ ){
			exampleTextArray.push(exampleArray[i].text);
		}
		for ( i=0; i < definitionArray.length; i++ ){
			definitionTextArray.push(definitionArray[i].text);
		}
		wordDetailsObject = {"word":exampleArray[0].word , "examples":exampleTextArray , "meanings" : definitionTextArray};
		return wordDetailsObject;
	},

	//Creates the template of the word meeaning that is to be appended to the HTML DOM.
	createTemplates : function(wordObj){
	var wordTemplate = 
		"<ul id=\"wordname_"+ wordObj.word +"\" class=\"word-details\">" 
		+ "<li class=\"wordname\">" + wordObj.word + "</li>" 
		+ "<li class=\"meaning\">"
			+ "<p class=\"meaningHeading\">Meaning</p>"
			+ "<ul>";
				for (var i=0; i < wordObj.meanings.length; i++ ){
					wordTemplate += "<li>" + wordObj.meanings[i] + "</li>"
				}
			
			wordTemplate += "</li></ul>"
			+ "<li class=\"usage\">"
				+ "<p class=\"usageHeading\">Usage</p>"
				+ "<ul>";
					for (var i=0; i < wordObj.examples.length; i++ ){
						wordTemplate += "<li>" + wordObj.examples[i] + "</li>"
					}
				wordTemplate += "</ul>"
			+ "</li>"
		+ "</ul>";
		return wordTemplate;
	}
};

//This module deals with creation and firing of AJAX requests.
var AJAXCALL = {
	//for retriving the Word Definition
	getDefinitionData : function  (word){
		var URL = "http://api.wordnik.com/v4/word.json/" +word+"/definitions?limit=" 
		+ Configuration.getDefinitionLimit() + "&includeRelated=true&useCanonical=false&includeTags=false&api_key=" 
		+ Configuration.getAppKey();
		return $.ajax(
		{
			url: URL,
			type: "get",
			cache: true,
		}							
		);
	},
	//for retriving the Word Meaning
	getExampleData : function (word){
		var URL = "http://api.wordnik.com:80/v4/word.json/"+word
		+"/examples?includeDuplicates=false&useCanonical=false&skip=0&limit="
		+ Configuration.getExampleLimit() +"&api_key=" + Configuration.getAppKey();
		return $.ajax(
		{
			url: URL,
			type: "get",
			cache: true,
		}							
		);
	}
}

/*
*This Modules deals with creeating of a local ditionary of word that are already fetched
*/
function LocalDictionary(){
	this.DictionaryObject ={};
};
LocalDictionary.prototype.addWordToDictionary = function (word){
		if(this.checkDictionaryForWord(word) == false){
			this.DictionaryObject[word] = true;
		}
};
LocalDictionary.prototype.checkDictionaryForWord = function(word){
		if(this.DictionaryObject[word]){
			return true;
		}else {
			return false;
		}
};
LocalDictionary.prototype.clearDictionary = function (){
	this.DictionaryObject = {};
};
$( document ).ready( initialize_Dictionary);
function initialize_Dictionary(){
	window.dictionary1= new LocalDictionary();
}

