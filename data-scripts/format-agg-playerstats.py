import sys
import json
import csv


# create output json object and initialize fields 
output = {}
season = None;
season_type = None;


# load agg-playerstats JSON file 
with open('../data-local/agg-playerstats/agg-playerstats_2015-16.json') as agg_playerstats_file:
	agg_playerstats = json.load(agg_playerstats_file)

# set season and season_type values
season = agg_playerstats['season']
season_type_field = agg_playerstats['season-type']
if season_type_field == "Regular Season":
	season_type = 'r'
elif season_type_field == "Playoffs":
	season_type = 'p'


# change the dash in the "season-type" key to an underscore
output['season'] = agg_playerstats['season']
output['season_type'] = agg_playerstats['season-type']
output['data'] = []



# load activeplayers JSON file 
with open('../data-local/activeplayers/activeplayers_2015-16.json') as activeplayers_file:
	activeplayers = json.load(activeplayers_file)

# loop through the activeplayers file, take the team info and add team/other info for each player obj
for player in agg_playerstats['data']:
	playerid = player['player_id'];
	new_playerobj = player;

	# find the current player in active player records 
	for playerprofile in activeplayers['resultSets'][0]['rowSet']:
		if playerprofile[0] == playerid:
			# append additional info from activeplayers record to  player obj
			new_playerobj['team'] = playerprofile[10]
			new_playerobj['startYear'] = playerprofile[4]
			new_playerobj['endYear'] = playerprofile[5]
			new_playerobj['hasPlayed'] = playerprofile[12]

	# print(new_playerobj)
	output['data'].append(new_playerobj)



# load nba advanced stats CSV file
advancedstats_file = open('../data-local/nba_2016_advanced.csv')
csv_reader = csv.reader(advancedstats_file)

# loop through the advanced stats CSV file and append advanced stats fields to player obj

count = 0
for player in output['data']:

	# reset position of read position
	advancedstats_file.seek(0)
	
	prev_player = None;
	# find the current player in advanced stats records
	for row in csv_reader:

		if(len(row) > 1):
			as_name = ''.join(row[1].split()).lower()
			output_name = ''.join(str(player['player_name']).split()).lower()

			if(as_name == output_name and prev_player != as_name):

				# print('found a match!' + row[1])
				player['position'] = row[2]
				prev_player = as_name
				count += 1

				player['advancedstats'] = row[7:19] + row[20:24] + row[25:29];




print("COUNT: " + str(count))





# write output to a json file
with open('../data-local/agg-playerstats/formatted-agg-playerstats_' + season_type + season + '.json', 'w') as outfile:
	json.dump(output, outfile)










