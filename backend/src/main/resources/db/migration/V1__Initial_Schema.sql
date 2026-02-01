-- Initial Schema Creation for FlixCare Baby Tracking Application

-- Create babies table
CREATE TABLE babies (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    birth_date DATE NOT NULL,
    gender VARCHAR(20),
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create feeding_records table
CREATE TABLE feeding_records (
    id BIGSERIAL PRIMARY KEY,
    baby_id BIGINT NOT NULL,
    feeding_time TIMESTAMP NOT NULL,
    feeding_type VARCHAR(50) NOT NULL CHECK (feeding_type IN ('BREAST_LEFT', 'BREAST_RIGHT', 'BREAST_BOTH', 'FORMULA', 'PUMPED_MILK', 'SOLID_FOOD')),
    amount_ml INTEGER,
    duration_minutes INTEGER,
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_feeding_baby FOREIGN KEY (baby_id) REFERENCES babies(id) ON DELETE CASCADE
);

-- Create temperature_records table
CREATE TABLE temperature_records (
    id BIGSERIAL PRIMARY KEY,
    baby_id BIGINT NOT NULL,
    measurement_time TIMESTAMP NOT NULL,
    temperature_celsius DECIMAL(4,2) NOT NULL,
    measurement_location VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_temperature_baby FOREIGN KEY (baby_id) REFERENCES babies(id) ON DELETE CASCADE
);

-- Create cleaning_records table
CREATE TABLE cleaning_records (
    id BIGSERIAL PRIMARY KEY,
    baby_id BIGINT NOT NULL,
    cleaning_time TIMESTAMP NOT NULL,
    cleaning_type VARCHAR(50) NOT NULL CHECK (cleaning_type IN ('DIAPER_CHANGE', 'BATH', 'SPONGE_BATH')),
    diaper_content VARCHAR(50) CHECK (diaper_content IN ('WET', 'DIRTY', 'BOTH', 'CLEAN')),
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_cleaning_baby FOREIGN KEY (baby_id) REFERENCES babies(id) ON DELETE CASCADE
);

-- Create weight_records table
CREATE TABLE weight_records (
    id BIGSERIAL PRIMARY KEY,
    baby_id BIGINT NOT NULL,
    measurement_time TIMESTAMP NOT NULL,
    weight_grams INTEGER NOT NULL,
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_weight_baby FOREIGN KEY (baby_id) REFERENCES babies(id) ON DELETE CASCADE
);

-- Create medication_records table
CREATE TABLE medication_records (
    id BIGSERIAL PRIMARY KEY,
    baby_id BIGINT NOT NULL,
    medication_time TIMESTAMP NOT NULL,
    medication_type VARCHAR(50) NOT NULL CHECK (medication_type IN ('VITAMIN_D', 'EYE_CLEANING')),
    dosage VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_medication_baby FOREIGN KEY (baby_id) REFERENCES babies(id) ON DELETE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX idx_feeding_records_baby_id ON feeding_records(baby_id);
CREATE INDEX idx_feeding_records_feeding_time ON feeding_records(feeding_time DESC);
CREATE INDEX idx_temperature_records_baby_id ON temperature_records(baby_id);
CREATE INDEX idx_temperature_records_measurement_time ON temperature_records(measurement_time DESC);
CREATE INDEX idx_cleaning_records_baby_id ON cleaning_records(baby_id);
CREATE INDEX idx_cleaning_records_cleaning_time ON cleaning_records(cleaning_time DESC);
CREATE INDEX idx_weight_records_baby_id ON weight_records(baby_id);
CREATE INDEX idx_weight_records_measurement_time ON weight_records(measurement_time DESC);
CREATE INDEX idx_medication_records_baby_id ON medication_records(baby_id);
CREATE INDEX idx_medication_records_medication_time ON medication_records(medication_time DESC);
