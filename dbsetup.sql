CREATE TABLE Issue
(  
    issueID 		INTEGER NOT NULL,
    name 			VARCHAR(100) NOT NULL,
    descr			TEXT NOT NULL,
    numCalls		INTEGER NOT NULL,
    numEmails		INTEGER NOT NULL,
    numAttempts		INTEGER NOT NULL,
    outcome 		VARCHAR(100) NOT NULL,
    PRIMARY KEY(issueID)
); 

CREATE TABLE Action
(  
    actionID		INTEGER NOT NULL,
    issueID 		INTEGER NOT NULL,
    time			TIMESTAMP NOT NULL, 
    loc				VARCHAR(50) NOT NULL,
    numPeople		INTEGER NOT NULL,
    numSuccess 		INTEGER NOT NULL,
    PRIMARY KEY(actionID),
    FOREIGN KEY(issueID) REFERENCES Issue
); 

CREATE TABLE UserIssue
(  
    userID		INTEGER NOT NULL,
    issueID 	INTEGER NOT NULL,
    FOREIGN KEY(userID) REFERENCES Users,
    FOREIGN KEY(issueID) REFERENCES Issue
);

CREATE TABLE Users
(  
    userID		INTEGER NOT NULL,
    name		VARCHAR(50) NOT NULL,
    phone		INTEGER NOT NULL,
    email 		VARCHAR(50) NOT NULL,
    PRIMARY KEY(userID)
); 

INSERT INTO Issue VALUES(1,"Investigation of Trump Team's Ties to Russia", 'On Monday, February 13th, former National Security Adviser Michael Flynn resigned over the revelation that he had misled Vice President Pence and other officials about his past communications with the Russian ambassador to the United States. Senate Republicans and Democrats have demanded a full investigation of the Trump administration\'s ties to Russia.',0,0,0,"Unkown");
INSERT INTO Issue VALUES(2,"Protecting Immigrant Communities",'Since taking office, Trump has signed a series of executive orders aimed at our immigrant community. Last week we witnessed the beginning of the administration’s promise to deport immigrants with ICE raids occurring across the country.', 0,0,0,"Unkown");
INSERT INTO Issue VALUES(3,"Protecting Obamacare",'In mid-January, the Senate moved towards defunding the Affordable Care Act (ACA), also known as Obamacare, approving the first step in a process that can dismantle it with a simple majority vote. About 20 million Americans would lose insurance coverage immediately.', 0,0,0,"Unkown");

#Select name of user given phone number (Check if this is null to verify a user exists)
SELECT name, userID FROM Users WHERE phone = _____;

#Randomly select one of the issues a user cares about
SELECT TOP 1 issueID FROM UserIssue WHERE userID=____ ORDER BY RAND();

#Select stats of the issues a user cares about
SELECT I.numCalls,I.numEmails,I.numAttempts,I.outcome FROM UserIssue U INNER JOIN Issue I ON I.issueID=U.issueID WHERE userID=____;

# Make Issue X an issue that user cares about
INSERT INTO UserIssue VALUES(Y,X);












