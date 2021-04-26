CREATE DATABASE devicemanagement;

USE devicemanagement;

CREATE TABLE Devices (	
	ID int NOT NULL AUTO_INCREMENT,
    Label varchar(255) NOT NULL,
	DescriptiveInformation text,
    SerialNumber varchar(255),
    Manufacturer varchar(255),
    Model varchar(255),
    RentStart DATE,
    ExpectedReturn DATE,
    LocationID int,
    PersonID int,
    Created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (ID)
);

CREATE TABLE Locations (
	ID int NOT NULL AUTO_INCREMENT,
	Label varchar(255) NOT NULL,
	DescriptiveInformation text,
    City varchar(255),
    Postalcode varchar(255),
    Street varchar(255),
	Created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (ID)
);

CREATE TABLE Persons (
	ID int NOT NULL AUTO_INCREMENT,
	FirstName varchar(255) NOT NULL,
    LastName varchar(255) NOT NULL,
    Company varchar(255),
	Created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (ID)
);

CREATE TABLE Users (
	ID int NOT NULL AUTO_INCREMENT,
	UserName varchar(255) NOT NULL,
    PassWord_Encrypted varchar(255) NOT NULL,
	Created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (ID)
);

CREATE Table Config (
    ID int NOT NULL AUTO_INCREMENT,
    Config_Key varchar(255) NOT NULL,
    Config_Value varchar(255) NOT NULL,
	Created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (ID)
);