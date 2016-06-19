var ChartUtil = {

	// maps team keys to team primary colors 
	getTeamColors: function(teamkey){
        switch(teamkey){
            case 'ATL':
                return {primary: "#E13A3E", secondary: "#C4D600"};
            case 'BOS': 
                return {primary: "#008348", secondary: "#FFFFFF"};
            case 'BKN': 
                return {primary: "#061922", secondary: "#FFFFFF"};
            case 'CHA': 
                return {primary: "#1D1160", secondary: "#008CA8"};
            case 'CHI': 
                return {primary: "#CE1141", secondary: "#061922"};
            case 'CLE': 
                return {primary: "#860038", secondary: "#FDBB30"};
            case 'DAL': 
                return {primary: "#007DC5", secondary: "#C4CED3"};
            case 'DEN': 
                return {primary: "#4D90CD", secondary: "#FDB927"};
            case 'DET': 
                return {primary: "#006BB6", secondary: "#ED174C"};
            case 'GSW':
                return {primary: "#FDB927", secondary: "#006BB6"};
            case 'HOU': 
                return {primary: "#CE1141", secondary: "#FFFFFF"};
            case 'IND': 
                return {primary: "#FFC633", secondary: "#00275D"};
            case 'LAC': 
                return {primary: "#ED174C", secondary: "#006BB6"};
            case 'LAL': 
                return {primary: "#552582", secondary: "#FDB927"};
            case 'MEM': 
                return {primary: "#23375B", secondary: "#7399C6"};
            case 'MIA': 
                return {primary: "#98002E", secondary: "#F9A01B"};
            case 'MIL': 
                return {primary: "#00471B", secondary: "#F0EBD2"};
            case 'MIN': 
                return {primary: "#005083", secondary: "#00A94F"};
            case 'NOP': 
                return {primary: "#002B5C", secondary: "#E31837"};
            case 'NYK': 
                return {primary: "#006BB6", secondary: "#F58426"};
            case 'OKC': 
                return {primary: "#007DC3", secondary: "#F05133"};
            case 'ORL': 
                return {primary: "#007DC5", secondary: "#C4CED3"};
            case 'PHI': 
                return {primary: "#ED174C", secondary: "#006BB6"};
            case 'PHX': 
                return {primary: "#E56020", secondary: "#1D1160"};
            case 'POR': 
                return {primary: "#E03A3E", secondary: "#061922"};
            case 'SAC': 
                return {primary: "#724C9F", secondary: "#8E9090"};
            case 'SAS':
                return {primary: "#BAC3C9", secondary: "#061922"};
            case 'TOR':
                return {primary: "#CE1141", secondary: "#061922"};
            case 'UTA':
                return {primary: "#002B5C", secondary: "#F9A01B"};
            case 'WAS':
                return {primary: "#002B5C", secondary: "#E31837"};
            default:
                // console.log("team color code not found for " + teamkey)
                return {primary: "#000000", secondary: "#000000"}
        }
	},

    // maps a stat keyword to a stat
    getStat: function(statkey, playerobj){

        console.log("statkey: " + statkey)
        console.log("playerobj: " + playerobj)


        // STATS:
        switch(statkey){

            case "PPG": 
                return playerobj.stats[26];
            case "3PM":
                return playerobj.stats[10];
            case "BLOCKS":
                return playerobj.stats[22];
            case "REBOUNDS":
                return playerobj.stats[18];
            case "ASSISTS":
                return playerobj.stats[19];
            case "STEALS":
                return playerobj.stats[21];
            default:
                return -99999;
        }

    },


    containsPosition: function(position, selected_position){
        if(position == selected_position){
            return true;
        }
        var firstsubstr = selected_position.substr(0, selected_position.indexOf('/'));
        var secondsubstr = selected_position.substr(selected_position.indexOf('/')+1, selected_position.length);
        if(firstsubstr == position || secondsubstr == position){
            return true;
        }
        return false;
    },

    getTooltipHTML: function(player, fields){
        fields = fields || [];

        var output = "";

        output += "<span>" + "<img class='profile_img' src='../../public/imgs/profilepics/small/" + player['player_id'] + ".png' />" + "</span>";
        output += "<p><span class='header name'>" + player['player_name'] + "</span></p>";
        output += "<p><span class='header top'> position: </span>" + player['position'] + "</p>";
        output += "<p><span class='header top'> min/game: </span>" + player.stats[6].toFixed(1) + "</p>";
        output += "<p><span class='header top'> 3P %: </span>" + player.stats[12].toFixed(3) + "</p>";
        output += "<p><span class='header bottom'> 3P attemps/game: </span>" + player.stats[11].toFixed(1) + "</p>";
        output += "<p><span class='header bottom'> points/game: </span>" + player.stats[26].toFixed(1) + "</p>";
        output += "<p><span class='header bottom'> rebounds/game: </span>" + player.stats[18].toFixed(1) + "</p>";
        output += "<p><span class='header bottom'> blocks/game: </span>" + player.stats[22].toFixed(1) + "</p>";
        output += "<p><span class='header bottom'> steals/game: </span>" + player.stats[21].toFixed(1) + "</p>";
        
        fields.forEach(function(field){
            if(field.name == "Salary"){
                var salaryval = parseFloat(field.value.replace(/\$|,/g, ''));
                output += "<p><span class='header bottom'>" + field.name + ": </span>$" + salaryval.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') + "</p>";
            }            
        }.bind(this));

        return output;
    }


};

export default ChartUtil;
