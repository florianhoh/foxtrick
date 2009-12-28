/** * htmsStatistics.js * adds some statistics on matches based on HTMS web site info * @author taised */////////////////////////////////////////////////////////////////////////////////Foxtrick.htmsStatistics = {		MODULE_NAME : "htmsStatistics",	MODULE_CATEGORY : Foxtrick.moduleCategories.MATCHES,	LATEST_CHANGE_CATEGORY : Foxtrick.latestChangeCategories.NEW,	PAGES : new Array('match'), 	DEFAULT_ENABLED : true,	NEW_AFTER_VERSION: "0.4.9.1",	LATEST_CHANGE:"Added custom colors",	LATEST_CHANGE_CATEGORY : Foxtrick.latestChangeCategories.NEW,	OPTION_TEXTS : true,	OPTION_TEXTS_DEFAULT_VALUES : new Array("background-color:rgb(110,110,0);", //Home                                             "background-color:rgb(210,210,210);", //Draw											"background-color:rgb(0,110,110);" // Away											),	OPTIONS : new Array("Home", "Draw", "Away"),	stlTeamA: null,	stlDraw: null,	stlTeamB: null,		init : function() {		Foxtrick.Matches.init();	},	run : function( page, doc ) { 		try {			//Retrieve colour parameters			this.stlTeamA = this.OPTION_TEXTS_DEFAULT_VALUES[0];			if (Foxtrick.isModuleFeatureEnabled( this, "Home")) {				this.stlTeamA = FoxtrickPrefs.getString("module." + this.MODULE_NAME + "." + "Home_text");			}			this.stlDraw = this.OPTION_TEXTS_DEFAULT_VALUES[1];			if (Foxtrick.isModuleFeatureEnabled( this, "Draw")) {				this.stlDraw = FoxtrickPrefs.getString("module." + this.MODULE_NAME + "." + "Draw_text");			}						this.stlTeamB = this.OPTION_TEXTS_DEFAULT_VALUES[2];			if (Foxtrick.isModuleFeatureEnabled( this, "Away")) {				this.stlTeamB = FoxtrickPrefs.getString("module." + this.MODULE_NAME + "." + "Away_text");			}						var isprematch = (doc.getElementById("ctl00_CPMain_pnlPreMatch")!=null);			if (isprematch) return;						var ratingstable = Foxtrick.Matches._getRatingsTable(doc);			if (ratingstable == null) return;			var tacticRow=ratingstable.rows.length-2;			//Foxtrick.LOG('got table '+tacticRow+' : '+ratingstable.rows[tacticRow].innerHTML)			if (Foxtrick.Matches._isWalkOver(ratingstable)) return;			if (!Foxtrick.Matches._isCorrectLanguage(ratingstable)) { // incorrect language							var htmstable = ratingstable.parentNode.insertBefore(doc.createElement('table'),ratingstable.nextSibling);							var row = htmstable.insertRow(0);				var cell = row.insertCell(0);				cell.setAttribute("colspan" , 3);				cell.innerHTML = Foxtrickl10n.getString( "foxtrick.matches.wronglang" );				return;			}			Foxtrick.addJavaScript(doc, "chrome-extension://kfdfmelkohmkpmpgcbbhpbhgjlkhnepg/resources/js/gauge.js");            			var midfieldLevel=new Array(Foxtrick.Matches._getStatFromCell(ratingstable.rows[1].cells[1]), Foxtrick.Matches._getStatFromCell(ratingstable.rows[1].cells[2]));			midfieldLevel[0]=midfieldLevel[0]*4+1;			midfieldLevel[1]=midfieldLevel[1]*4+1;			var rdefence=new Array(Foxtrick.Matches._getStatFromCell(ratingstable.rows[2].cells[1]), Foxtrick.Matches._getStatFromCell(ratingstable.rows[2].cells[2]));			rdefence[0]=rdefence[0]*4+1;			rdefence[1]=rdefence[1]*4+1;			var cdefence=new Array(Foxtrick.Matches._getStatFromCell(ratingstable.rows[3].cells[1]), Foxtrick.Matches._getStatFromCell(ratingstable.rows[3].cells[2]));			cdefence[0]=cdefence[0]*4+1;			cdefence[1]=cdefence[1]*4+1;			var ldefence=new Array(Foxtrick.Matches._getStatFromCell(ratingstable.rows[4].cells[1]), Foxtrick.Matches._getStatFromCell(ratingstable.rows[4].cells[2]));			ldefence[0]=ldefence[0]*4+1;			ldefence[1]=ldefence[1]*4+1;			var rattack=new Array(Foxtrick.Matches._getStatFromCell(ratingstable.rows[5].cells[1]), Foxtrick.Matches._getStatFromCell(ratingstable.rows[5].cells[2]));			rattack[0]=rattack[0]*4+1;			rattack[1]=rattack[1]*4+1;			var cattack=new Array(Foxtrick.Matches._getStatFromCell(ratingstable.rows[6].cells[1]), Foxtrick.Matches._getStatFromCell(ratingstable.rows[6].cells[2]));			cattack[0]=cattack[0]*4+1;			cattack[1]=cattack[1]*4+1;			var lattack=new Array(Foxtrick.Matches._getStatFromCell(ratingstable.rows[7].cells[1]), Foxtrick.Matches._getStatFromCell(ratingstable.rows[7].cells[2]));			lattack[0]=lattack[0]*4+1;			lattack[1]=lattack[1]*4+1;			var tactics;			var tacticsLevel;			// var tacticRow=14;			// if (FoxtrickHelper.findIsYouthMatch(doc.location.href)) {				// tacticRow=10;			// }						tactics=new Array(Foxtrick.Matches._getTacticsFromCell(ratingstable.rows[tacticRow].cells[1]), Foxtrick.Matches._getTacticsFromCell(ratingstable.rows[tacticRow].cells[2]));			tacticsLevel=new Array(Foxtrick.Matches._getTacticsLevelFromCell(ratingstable.rows[tacticRow+1].cells[1]), Foxtrick.Matches._getTacticsLevelFromCell(ratingstable.rows[tacticRow+1].cells[2]));            //Foxtrick.LOG('rows '+ratingstable.rows.length+' Tactics:['+ tactics + '], TacticsLevel:[' +tacticsLevel +']'+ '\n');						//Creating params for link			var lang=FoxtrickPrefs.getString("htLanguage");             //if (!((lang=='it') || (lang=='fr'))) lang='en';			var params='&TAM='+midfieldLevel[0]+'&TBM='+midfieldLevel[1];			params+='&TARD='+rdefence[0]+'&TBRD='+rdefence[1];			params+='&TACD='+cdefence[0]+'&TBCD='+cdefence[1];			params+='&TALD='+ldefence[0]+'&TBLD='+ldefence[1];			params+='&TARA='+rattack[0]+'&TBRA='+rattack[1];			params+='&TACA='+cattack[0]+'&TBCA='+cattack[1];			params+='&TALA='+lattack[0]+'&TBLA='+lattack[1];			if (tactics[0]=='aow') {				params+='&TATAC=AOW&TATACLEV='+tacticsLevel[0];			}			if (tactics[0]=='aim') {				params+='&TATAC=AIM&TATACLEV='+tacticsLevel[0];			}			if (tactics[0]=='pressing') {				params+='&TATAC=PRES&TATACLEV='+tacticsLevel[0];			}			if (tactics[0]=='ca') {				params+='&TATAC=CA&TATACLEV='+tacticsLevel[0];			}			if (tactics[1]=='aow') {				params+='&TBTAC=AOW&TBTACLEV='+tacticsLevel[1];			}			if (tactics[1]=='aim') {				params+='&TBTAC=AIM&TBTACLEV='+tacticsLevel[1];			}			if (tactics[1]=='pressing') {				params+='&TBTAC=PRES&TBTACLEV='+tacticsLevel[1];			}			if (tactics[1]=='ca') {				params+='&TBTAC=CA&TBTACLEV='+tacticsLevel[1];			}			//Foxtrick.LOG(tactics[0]+' - '+tactics[1]);						//Inserting a blank line			var htmstable = ratingstable.parentNode.insertBefore(doc.createElement('table'),ratingstable.nextSibling);						htmstable.id='htmstable';			htmstable.setAttribute('windrawloss',Foxtrickl10n.getString( "foxtrick.htmsStatistics.windrawloss.desc" ));			htmstable.setAttribute('stlTeamA',this.stlTeamA);			htmstable.setAttribute('stlDraw',this.stlDraw);			htmstable.setAttribute('stlTeamB',this.stlTeamB);			var row = htmstable.insertRow(htmstable.rows.length);			var cell = row.insertCell(0);			cell.innerHTML='&nbsp;';						//Inserting header cell			row = htmstable.insertRow(htmstable.rows.length);			cell = row.insertCell(0);			cell.className='ch';			cell.innerHTML = Foxtrickl10n.getString( "foxtrick.htmsStatistics.prediction.desc" );						//Inserting cell with bar			//cell = row.insertCell(1);			//cell.setAttribute("colspan", 3);			//cell.setAttribute('align', 'center');			//version with img -- NOT WORKING			//cell.innerHTML = '<a class="inner" target="_stats" href="http://www.fantamondi.it/HTMS/index.php?page=predictor&lang='+lang+params+'"><img src="chrome-extension://kfdfmelkohmkpmpgcbbhpbhgjlkhnepg/resources/linkicons/htms.png"></a>';			//version with iframe			var barwidth=320;			var framewidth=barwidth+10;			var barheight=50;			var frameheight=barheight+95;									var url= 'http://www.fantamondi.it/HTMS/dorequest.php?action=showpredict&lang='+lang+params+'&width='+barwidth+'&height='+barheight;		if (Foxtrick.BuildFor=='Chrome') {			porthtms.postMessage({reqtype: "get_htms",url:url});					}		else {			var req = new XMLHttpRequest();			req.open('GET', url, false); 			req.send(null);			if (req.status == 200) 				this.show_result( doc, req.responseText ) 			else Foxtrick.dump('no connection\n');					} 				} catch (e) {			Foxtrick.dump('htmsStatistics.js run: '+e+"\n");		}	},	change : function( page, doc ) { 	},		show_result : function( doc, responseText ) { 		try{			var frag = doc.createElement('dummy');			frag.innerHTML = responseText;						var htmstable=doc.getElementById('htmstable');						var  row = htmstable.rows[htmstable.rows.length-1];						//var center = cell.appendChild(doc.createElement('center'));			//center.innerHTML = frag.getElementsByTagName('center')[0].innerHTML;						//var gaugediv = cell.appendChild(doc.createElement('div'));			//gaugediv.setAttribute('id','scorepercent');						//var table = cell.appendChild(doc.createElement('table'));						var pred = frag.getElementsByTagName('strong')[0].innerHTML.split('-');				cell = row.insertCell(1); cell.innerHTML='<b>'+pred[0]+'</b>';			cell = row.insertCell(2); cell.innerHTML='';			cell = row.insertCell(3); cell.innerHTML='<b>'+pred[1]+'</b>';									var homeprec= frag.getElementsByTagName('table')[0].rows[0].cells[2].innerHTML;			var drawprec= frag.getElementsByTagName('table')[0].rows[1].cells[2].innerHTML;			var lossprec= frag.getElementsByTagName('table')[0].rows[2].cells[2].innerHTML;			Foxtrick.dump(homeprec+' '+drawprec+' '+lossprec+'\n');								var size_f=(Foxtrick.isStandardLayout(doc)==true)?2.8:2.2;			var row = htmstable.insertRow(htmstable.rows.length);			cell = row.insertCell(0); cell.appendChild(frag.getElementsByTagName('a')[0]);			cell = row.insertCell(1);			cell.setAttribute("colspan", 3);			cell.setAttribute('align', 'center');			var windiv = cell.appendChild(doc.createElement('div'));						windiv.setAttribute("style","width:"+100*size_f+"px; height:20px; "+ htmstable.getAttribute('stlTeamA') +"  display:inline-block; border:1px solid #000000;");			windiv.innerHTML='';			var drawdiv = windiv.appendChild(doc.createElement('div'));						drawdiv.setAttribute("style","width:"+(parseFloat(lossprec.replace('%',''))+parseFloat(drawprec.replace('%','')))*size_f+"px; height:20px;"+ htmstable.getAttribute('stlDraw') +";display:inline-block; float:right;");			drawdiv.innerHTML='';			var lossdiv = drawdiv.appendChild(doc.createElement('div'));						lossdiv.setAttribute("style","width:"+parseFloat(lossprec.replace('%',''))*size_f+"px; height:20px;"+ htmstable.getAttribute('stlTeamB') +";display:inline-block; float:right;");			lossdiv.innerHTML='';  			var row = htmstable.insertRow(htmstable.rows.length);			cell = row.insertCell(0); cell.innerHTML='<b>'+htmstable.getAttribute('windrawloss')+'</b>';			cell = row.insertCell(1); cell.innerHTML=homeprec;			cell = row.insertCell(2); cell.innerHTML=drawprec;			cell = row.insertCell(3); cell.innerHTML=lossprec;			//table.innerHTML += frag.getElementsByTagName('table')[0].innerHTML;											//Foxtrick.addJavaScriptSnippet(doc,'<!--window.onload = function () {var gaugediv=document.getElementById("scorepercent");gauge.add(gaugediv, {width:320, height:50, values:[89.5,6.5,4], scale: 1,  gradient: true, colors: ["#00FF00", "#FFFF43", "#FF0000"]});}//-->');		}catch(e){console.log('show_htms :'+e);}	},};try {var porthtms = chrome.extension.connect({name: "htms"});porthtms.onMessage.addListener(function(msg) {	if ( msg.set=='htms') { 		Foxtrick.htmsStatistics.show_result( document, msg.responseText );		console.log('got htms ' + msg.set);		}				});} catch(e){}