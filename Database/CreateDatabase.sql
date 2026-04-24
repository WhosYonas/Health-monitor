
CREATE TABLE person (
    person_id INT GENERATED ALWAYS AS IDENTITY NOT NULL,
    first_name VARCHAR(500),
    last_name VARCHAR(500),
    phone_number VARCHAR(500),
    personnummer VARCHAR(500),
    role VARCHAR(50)
);

ALTER TABLE person ADD CONSTRAINT PK_person PRIMARY KEY (person_id);


CREATE TABLE account (
    account_id INT GENERATED ALWAYS AS IDENTITY NOT NULL,
    username_id VARCHAR(500),
    password_hashed VARCHAR(500),
    person_id INT
);

ALTER TABLE account ADD CONSTRAINT PK_account PRIMARY KEY (account_id);


CREATE TABLE caregiver (
    caregiver_id INT GENERATED ALWAYS AS IDENTITY NOT NULL,
    person_id INT
);

ALTER TABLE caregiver ADD CONSTRAINT PK_caregiver PRIMARY KEY (caregiver_id);


CREATE TABLE patient (
    patient_id INT GENERATED ALWAYS AS IDENTITY NOT NULL,
    person_id INT NOT NULL
);

ALTER TABLE patient ADD CONSTRAINT PK_patient PRIMARY KEY (patient_id);


CREATE TABLE device (
    device_id INT GENERATED ALWAYS AS IDENTITY NOT NULL,
    patient_id INT
);

ALTER TABLE device ADD CONSTRAINT PK_device PRIMARY KEY (device_id);


CREATE TABLE measurement (
    measurement_id INT GENERATED ALWAYS AS IDENTITY NOT NULL,
    time TIMESTAMP WITH TIME ZONE,
    blood_oxygen DECIMAL(10),
    heart_rate INT,
    temperature DECIMAL(10),
    device_id INT
);

ALTER TABLE measurement ADD CONSTRAINT PK_measurement PRIMARY KEY (measurement_id);


ALTER TABLE account ADD CONSTRAINT FK_account_0 FOREIGN KEY (person_id) REFERENCES person (person_id)
ON DELETE CASCADE;

ALTER TABLE caregiver ADD CONSTRAINT FK_caregiver_0 FOREIGN KEY (person_id) REFERENCES person (person_id)
ON DELETE CASCADE;


ALTER TABLE patient ADD CONSTRAINT FK_patient_0 FOREIGN KEY (person_id) REFERENCES person (person_id)
ON DELETE CASCADE;

ALTER TABLE device ADD CONSTRAINT FK_device_0 FOREIGN KEY (patient_id) REFERENCES patient (patient_id)
ON DELETE CASCADE;

ALTER TABLE measurement ADD CONSTRAINT FK_measurement_0 FOREIGN KEY (device_id) REFERENCES device (device_id)
ON DELETE CASCADE;