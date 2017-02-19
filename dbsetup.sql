CREATE TABLE Issue
(  
    issueID 		INTEGER NOT NULL,
    name 			VARCHAR(500) NOT NULL,
    contactRep		VARCHAR(20) NOT NULL,
    numCalls		INTEGER NOT NULL,
    numEmails		INTEGER NOT NULL,
    numAttempts		INTEGER NOT NULL,
    outcome 		varchar(100) NOT NULL,
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

CREATE TABLE Users
(  
    userID		INTEGER NOT NULL,
    name		VARCHAR(50) NOT NULL,
    phone		INTEGER NOT NULL,
    email 		VARCHAR(50) NOT NULL,
    PRIMARY KEY(userID)
);  

CREATE TABLE UserIssue
(  
    userID		INTEGER NOT NULL,
    issueID 	INTEGER NOT NULL,
    FOREIGN KEY(userID) REFERENCES Users,
    FOREIGN KEY(issueID) REFERENCES Issue
);


#Select name of user given phone number (Check if this is null to verify a user exists)
SELECT name, userID FROM Users WHERE phone = 1;

#Randomly select one of the issues a user cares about
SELECT TOP 1 issueID FROM UserIssue WHERE userID=_____ ORDER BY RAND();

#Select stats of the issues a user cares about
SELECT I.numCalls,I.numEmails,I.numAttempts,I.outcome FROM UserIssue U INNER JOIN Issue I ON I.issueID=U.issueID WHERE userID=____;

#Select all calls to action a user participated in 







