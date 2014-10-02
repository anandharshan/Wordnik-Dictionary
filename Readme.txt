Working/SPEC::
===========
1 . Type or paste data that you want in the left pane.
2. double click or drag to select the  word you want to search in the Wordnik dictionary.
3. the Meaning and usage will be populated in the Right side. and a alert will be shown is the work is ot a
4.Depending on personal preference, the user could set the no of Examples and No of Defiinitions.
5. By Default the no of example and no of usage is set to  "3". ie by default 3 examples and 3 meanings will be retrieved.
6. the user can set his own preferences for the number of meaning and usage.
7.If the user is searching for a word that he has searched aleady, it is stored in a local dictionary, which is used to scroll the word meaning into view.which saves the time for making the round trip for retrieving the  result.
8. Works fine all major bowsers. Tested in Chorme, FF, IE 9, Safari.

Code Organization::
==================
1. Object oriented Js Script is used  where ever possible.
2. Javascript is used in the "Strict" mode for efficiency.
3. Configuration Module is written so that , all the configurable properties are in one place and extended easily.
	Configulation module also uses closure , for making configurable values Private.
4.Event Handling Module deals with all the user actions that is taking place in the  application.
	Here Event Bubbling is used so as to increase the  efficiency of code, and also increase the maintainability.
5.The DICTIONARY Module is used to do all the core operation of the Dictionary. Like making the  ajax calls , and getting the respose and creating standard-
	templates. The creation of standard template  helps to change the API for getting the word meaning easily. so that we can replace the WORDNIK API with another one. Single Ton pattern is used in this module.
6.The AJAXCALL Modules deals with making all the ajax request. 
7.Deferred and promise pattern in jquery is used for making the AJAX calls and resolving the  response.
8.the LocalDictionary Module is used to maintain a local dictionary of all the word that is searched. So that the used need not make a expesive ajax call for a 
	word that is searched Already. The word meaning will be scrolled into view.
