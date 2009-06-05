/**
 * linksteam.js
 * Foxtrick add links to team pages
 * @author convinced
 */
////////////////////////////////////////////////////////////////////////////////

var FoxtrickLinksTeam = {
	
    MODULE_NAME : "LinksTeam",
	MODULE_CATEGORY : Foxtrick.moduleCategories.LINKS,
	PAGES : new Array('teamPageGeneral'), 
	DEFAULT_ENABLED : true,
	OPTIONS : {}, 
	
    init : function() {
			Foxtrick.initOptionsLinks(this,"teamlink" );
    },

    run : function( page, doc ) {
		this.AddLinksRight(page,doc);
	},
	
    AddLinksRight : function( page, doc ) {
		try {
			if (!this.isTeamPage(doc)) {return;}
			var alldivs = doc.getElementsByTagName('div');
			var ownBoxBody=null;
			for (var j = 0; j < alldivs.length; j++) {
				if (alldivs[j].className=="main mainRegular") {
					var teaminfo = this.gatherLinks( alldivs[j], doc ); 
		
					var links = Foxtrick.LinkCollection.getLinks("teamlink", teaminfo, doc, this );				
					if (links.length > 0) {
						ownBoxBody = doc.createElement("div");
						var header = Foxtrickl10n.getString("foxtrick.links.boxheader" );
						var ownBoxId = "foxtrick_" + header + "_box";
						var ownBoxBodyId = "foxtrick_" + header + "_content";
						ownBoxBody.setAttribute( "id", ownBoxBodyId );
               		                 
						for (var k = 0; k < links.length; k++) {
							links[k].link.className ="inner";
							ownBoxBody.appendChild(doc.createTextNode(" "));
							ownBoxBody.appendChild(links[k].link);
						}
						Foxtrick.addBoxToSidebar( doc, header, ownBoxBody, ownBoxId, "first", ""); 
	
					}
				}
			}
			FoxtrickLinksCustom.add( page, doc,ownBoxBody,this.MODULE_NAME,teaminfo);	
		}
		catch (e) {dump("teamlinks->add_leftright->"+e);}
	},
	
	change : function( page, doc ) { // dump('change : LinksTeam\n');
		var header = Foxtrickl10n.getString("foxtrick.links.boxheader" );
		var ownBoxId = "foxtrick_" + header + "_content";
		var owncoachlinkId = "foxtrick_content_coach";
		var ownlastmatchlinkId = "foxtrick_content_lastmatch";
		if( !doc.getElementById ( ownBoxId )
		   && this.isTeamPage(doc)) {
		 	dump('run again : LinksTeamRight\n');	
			this.AddLinksRight(page,doc);
		}
	},
	
	isTeamPage : function(doc) {
        var site=doc.location.href; 
        var remain=site.substr(site.search(/Club\//i)+5);  //dump(remain+' '+remain.search(/TeamID=/i)+'\n');
    return (remain=="" || remain.search(/TeamID=/i)==1 || remain.search(/TeamID=/i)==13);
	},
	
	gatherLinks : function( thisdiv, doc ) {
	try{
		var countryid = FoxtrickHelper.findCountryId(thisdiv);
  		var teamid = FoxtrickHelper.findTeamId(thisdiv);
		var teamname = FoxtrickHelper.extractTeamName(thisdiv);
		var leaguename = FoxtrickHelper.extractLeagueName(thisdiv);
		var levelnum = FoxtrickHelper.getLevelNum(leaguename, countryid);
		var leagueid = FoxtrickHelper.findLeagueLeveUnitId(thisdiv);;
		var userid = FoxtrickHelper.findUserId(thisdiv);
				
		if (!leaguename.match(/^[A-Z]+\.\d+/i)) {
			leaguename="I";
		} 
       
		return { "teamid": teamid, "teamname": teamname, "countryid" : countryid, "levelnum" : levelnum ,"leagueid": leagueid,"userid":userid };
	} catch(e){ dump ('LinksTeam->gatherLinks: '+e+'\n');}
	},
};
	