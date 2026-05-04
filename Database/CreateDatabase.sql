CREATE TABLE person (
    person_id        INT GENERATED ALWAYS AS IDENTITY NOT NULL,
    first_name       VARCHAR(100)  NOT NULL,
    last_name        VARCHAR(100)  NOT NULL,
    phone_number     VARCHAR(20),
    personnummer     VARCHAR(12)   NOT NULL,
    CONSTRAINT PK_person            PRIMARY KEY (person_id),
    CONSTRAINT UQ_person_personnummer UNIQUE (personnummer)
);


CREATE TABLE caregiver_account (
    caregiver_id    INT GENERATED ALWAYS AS IDENTITY NOT NULL,
    person_id       INT           NOT NULL,
    username        VARCHAR(100)  NOT NULL,
    password_hash   VARCHAR(255)  NOT NULL,
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT PK_caregiver_account   PRIMARY KEY (caregiver_id),
    CONSTRAINT UQ_caregiver_person    UNIQUE (person_id),
    CONSTRAINT UQ_caregiver_username  UNIQUE (username),
    CONSTRAINT FK_caregiver_person    FOREIGN KEY (person_id)
        REFERENCES person (person_id) ON DELETE CASCADE
);

CREATE TABLE patient_account (
    patient_id      INT GENERATED ALWAYS AS IDENTITY NOT NULL,
    person_id       INT           NOT NULL,
    username        VARCHAR(100)  NOT NULL,
    password_hash   VARCHAR(255)  NOT NULL,
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT PK_patient_account     PRIMARY KEY (patient_id),
    CONSTRAINT UQ_patient_person      UNIQUE (person_id),
    CONSTRAINT UQ_patient_username    UNIQUE (username),
    CONSTRAINT FK_patient_person      FOREIGN KEY (person_id)
        REFERENCES person (person_id) ON DELETE CASCADE
);

CREATE TABLE caregiver_patient (
    caregiver_id    INT NOT NULL,
    patient_id      INT NOT NULL,
    assigned_at     TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT PK_caregiver_patient PRIMARY KEY (caregiver_id, patient_id),
    CONSTRAINT FK_cp_caregiver      FOREIGN KEY (caregiver_id)
        REFERENCES caregiver_account (caregiver_id) ON DELETE CASCADE,
    CONSTRAINT FK_cp_patient        FOREIGN KEY (patient_id)
        REFERENCES patient_account (patient_id) ON DELETE CASCADE
);

CREATE TABLE relative (
    relative_id     INT GENERATED ALWAYS AS IDENTITY NOT NULL,
    patient_id      INT           NOT NULL,
    full_name       VARCHAR(200)  NOT NULL,
    phone_number    VARCHAR(20),
    CONSTRAINT PK_relative      PRIMARY KEY (relative_id),
    CONSTRAINT FK_relative_patient FOREIGN KEY (patient_id)
        REFERENCES patient_account (patient_id) ON DELETE CASCADE
);

CREATE TABLE device (
    device_id       INT GENERATED ALWAYS AS IDENTITY NOT NULL,
    patient_id      INT           NOT NULL,
    device_uid      VARCHAR(100)  NOT NULL,   -- unique hardware/MQTT identifier
    registered_at   TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    is_active       BOOLEAN       NOT NULL DEFAULT TRUE,
    CONSTRAINT PK_device        PRIMARY KEY (device_id),
    CONSTRAINT UQ_device_uid    UNIQUE (device_uid),
    CONSTRAINT FK_device_patient FOREIGN KEY (patient_id)
        REFERENCES patient_account (patient_id) ON DELETE CASCADE
);

CREATE TABLE measurement (
    measurement_id  INT GENERATED ALWAYS AS IDENTITY NOT NULL,
    device_id       INT           NOT NULL,
    recorded_at     TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    blood_oxygen    DECIMAL(5, 2),   
    heart_rate      INT,             
    temperature     DECIMAL(4, 2),   
    CONSTRAINT PK_measurement       PRIMARY KEY (measurement_id),
    CONSTRAINT FK_measurement_device FOREIGN KEY (device_id)
        REFERENCES device (device_id) ON DELETE CASCADE
);

CREATE TABLE alert (
    alert_id        INT GENERATED ALWAYS AS IDENTITY NOT NULL,
    measurement_id  INT           NOT NULL,
    patient_id      INT           NOT NULL,
    alert_type      VARCHAR(50)   NOT NULL,  
    severity        VARCHAR(20)   NOT NULL DEFAULT 'warning', 
    message         TEXT,
    triggered_at    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    acknowledged    BOOLEAN       NOT NULL DEFAULT FALSE,
    acknowledged_by INT,                     
    CONSTRAINT PK_alert             PRIMARY KEY (alert_id),
    CONSTRAINT CHK_alert_type       CHECK (alert_type IN ('heart_rate', 'blood_oxygen', 'temperature')),
    CONSTRAINT CHK_alert_severity   CHECK (severity IN ('warning', 'critical')),
    CONSTRAINT FK_alert_measurement FOREIGN KEY (measurement_id)
        REFERENCES measurement (measurement_id) ON DELETE CASCADE,
    CONSTRAINT FK_alert_patient     FOREIGN KEY (patient_id)
        REFERENCES patient_account (patient_id) ON DELETE CASCADE,
    CONSTRAINT FK_alert_caregiver   FOREIGN KEY (acknowledged_by)
        REFERENCES caregiver_account (caregiver_id) ON DELETE SET NULL
);