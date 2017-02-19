# -*- coding: utf-8 -*-

from bs4 import BeautifulSoup

def get_senator_contact_info():
	#INSERT INTO Reps VALUES (“State Name”, “Rep Name”, “Rep Email”, “Rep Phone”);

	with open('docs/senators_cfm.xml', 'r') as senators:
		text = senators.read()

	soup = BeautifulSoup(text, "lxml")

	senator_info = {}

	for member in soup.find_all('member'):
		state = member.find('state').string

		if state not in senator_info:
			senator_info[state] = {}

		first_name = member.find('first_name').string
		last_name = member.find('last_name').string

		full_name = str(first_name) + " " + str(last_name)

		if full_name not in senator_info[state]:
			senator_info[state][full_name] = {}

		email = member.find('email').string
		senator_info[state][full_name]["email"] = str(email)

		phone = member.find('phone').string
		senator_info[state][full_name]["phone"] = str(phone)

	return senator_info

def formatting_query(senate_dict):

	outFile = open("queries.txt", 'w')
	for state in senate_dict:
		for rep in senate_dict[state]:
			query = "INSERT INTO Reps VALUES (" + state + ", " + rep + ", " + senate_dict[state][rep]["email"] + ", " + senate_dict[state][rep]["email"] + ");"
			outFile.write(query + "\n")

if __name__ == "__main__":
    senate_dict = get_senator_contact_info()
    formatting_query(senate_dict)
