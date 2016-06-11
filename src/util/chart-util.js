var ChartUtil = {

	// maps team keys to team primary colors 
	getTeamColors: function(teamkey){
        switch(teamkey){
            case 'ATL':
                return {primary: "#E13A3E", secondary: "#C4D600"};
            case 'BKN': 
                return {primary: "#061922", secondary: "#FFFFFF"};
            case 'BOS': 
                return {primary: "#008348", secondary: "#FFFFFF"};
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
                console.log("team color code not found for " + teamkey)
                return {primary: "#000000", secondary: "#000000"}
        }
	},





};

export default ChartUtil;
