CREATE TABLE person (
 person_id INT GENERATED ALWAYS AS IDENTITY NOT NULL,
 first_name VARCHAR(500),
 last_name VARCHAR(500),
 phone_number VARCHAR(500)
);

ALTER TABLE person ADD CONSTRAINT PK_person PRIMARY KEY (person_id);


CREATE TABLE account (
 account_id INT GENERATED ALWAYS AS IDENTITY NOT NULL,
 personummer VARCHAR(500),
 password_hashed VARCHAR(500),
 person_id INT NOT NULL
);

ALTER TABLE account ADD CONSTRAINT PK_account PRIMARY KEY (account_id);


CREATE TABLE device (
 device_id INT GENERATED ALWAYS AS IDENTITY NOT NULL,
 person_id INT NOT NULL
);

ALTER TABLE device ADD CONSTRAINT PK_Device PRIMARY KEY (device_id);


CREATE TABLE measurement (
 measurement_id INT GENERATED ALWAYS AS IDENTITY NOT NULL,
 time TIMESTAMP WITH TIME ZONE,
 blood_oxygen INT,
 heart_rate INT,
 temperature INT,
 device_id INT NOT NULL
);

ALTER TABLE measurement ADD CONSTRAINT PK_measurement PRIMARY KEY (measurement_id);



ALTER TABLE account ADD CONSTRAINT FK_account_0 FOREIGN KEY (person_id) REFERENCES person (person_id)
ON DELETE CASCADE;

ALTER TABLE Device ADD CONSTRAINT FK_Device_0 FOREIGN KEY (person_id) REFERENCES person (person_id)
ON DELETE CASCADE;

ALTER TABLE measurement ADD CONSTRAINT FK_measurement_0 FOREIGN KEY (device_id) REFERENCES Device (device_id)
ON DELETE CASCADE;

CREATE OR REPLACE FUNCTION delete_person_when_account_deleted()
RETURNS TRIGGER AS $$
BEGIN
    DELETE FROM person
    WHERE person_id = OLD.person_id;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_delete_person_after_account_delete ON account;

CREATE TRIGGER trg_delete_person_after_account_delete
AFTER DELETE ON Account
FOR EACH ROW
EXECUTE FUNCTION delete_person_when_account_deleted();



