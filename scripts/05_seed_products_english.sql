-- Delete existing products to ensure clean data
DELETE FROM products;

-- Seed comprehensive industrial spare parts products in English
INSERT INTO products (name, description, category, price, sku, stock_quantity, image_url, company_name, model, product_type) VALUES
-- Pumps
('Siemens Hydraulic Pump 100cc', 'High-performance hydraulic pump with 100cc displacement for industrial machinery', 'Pumps', 1499.99, 'SIEMENS-HP-100', 45, '/placeholder.svg?height=300&width=300', 'Siemens', 'HP-100', 'Pump'),
('Bosch Rexroth Gear Pump A4VSO', 'Variable displacement gear pump with load-sensing control', 'Pumps', 2199.99, 'REXROTH-A4VSO', 32, '/placeholder.svg?height=300&width=300', 'Bosch Rexroth', 'A4VSO', 'Pump'),
('Festo Diaphragm Pump DLPB', 'Low-noise diaphragm pump for air and inert gas applications', 'Pumps', 599.99, 'FESTO-DLPB-02', 58, '/placeholder.svg?height=300&width=300', 'Festo', 'DLPB-02', 'Pump'),
('ABB Submersible Pump P100', 'Energy-efficient submersible pump for water applications', 'Pumps', 899.99, 'ABB-P100-15HP', 28, '/placeholder.svg?height=300&width=300', 'ABB', 'P100-15HP', 'Pump'),

-- Motors
('Siemens Servo Motor 1FK7', 'Compact servo motor with integrated encoder, 1.2 kW', 'Servo Motors', 1899.99, 'SIEMENS-1FK7-100', 25, '/placeholder.svg?height=300&width=300', 'Siemens', '1FK7-100', 'Servo Motor'),
('ABB Industrial Electric Motor IE3', '5.5 kW three-phase induction motor, 380V, 50Hz', 'Motors', 749.99, 'ABB-IE3-5.5KW', 40, '/placeholder.svg?height=300&width=300', 'ABB', 'IE3-5.5KW', 'Motor'),
('Schneider Electric Stepper Motor NEMA34', 'Hybrid stepper motor 3.5A 5.6Nm', 'Motors', 349.99, 'SCHNEIDER-SM34-56', 85, '/placeholder.svg?height=300&width=300', 'Schneider Electric', 'SM34-56', 'Stepper Motor'),
('Festo BLDC Motor EMMS-AS', 'Brushless DC motor with integrated electronics', 'Motors', 599.99, 'FESTO-EMMS-AS-55', 45, '/placeholder.svg?height=300&width=300', 'Festo', 'EMMS-AS-55', 'BLDC Motor'),

-- Bearings & Ball Bearings
('SKF Ball Bearing 6205-2Z', 'Deep groove ball bearing with metal shields, 25x52x15mm', 'Ball-Bearing', 24.99, 'SKF-6205-2Z', 500, '/placeholder.svg?height=300&width=300', 'SKF', '6205-2Z', 'Ball Bearing'),
('FAG Cylindrical Roller Bearing NU204', 'Cylindrical roller bearing 20x47x14mm', 'Ball-Bearing', 38.50, 'FAG-NU204', 350, '/placeholder.svg?height=300&width=300', 'FAG', 'NU204', 'Roller Bearing'),
('NSK Angular Contact Bearing 7009C', 'Precision angular contact bearing 45x75x16mm', 'Ball-Bearing', 64.99, 'NSK-7009C', 280, '/placeholder.svg?height=300&width=300', 'NSK', '7009C', 'Angular Contact Bearing'),
('INA Thrust Ball Bearing 51210', 'Single-direction thrust bearing 50x78x22mm', 'Ball-Bearing', 42.99, 'INA-51210', 420, '/placeholder.svg?height=300&width=300', 'INA', '51210', 'Thrust Bearing'),

-- Sensors
('Sick Laser Distance Sensor TiM781M', 'Time-of-flight laser scanner, 270° field of view', 'Sensors', 1299.99, 'SICK-TIM781M', 15, '/placeholder.svg?height=300&width=300', 'Sick', 'TiM781M', 'Laser Sensor'),
('Siemens Pressure Sensor 7MF1565', '0-250 bar pressure transmitter with 4-20mA output', 'Sensors', 349.99, 'SIEMENS-7MF1565', 120, '/placeholder.svg?height=300&width=300', 'Siemens', '7MF1565', 'Pressure Sensor'),
('Balluff Inductive Position Sensor', 'Non-contact position sensor 0-10mm range', 'Sensors', 199.99, 'BALLUFF-BTL5-E100', 95, '/placeholder.svg?height=300&width=300', 'Balluff', 'BTL5-E100', 'Position Sensor'),
('Pepperl+Fuchs Temperature Sensor PT100', 'Platinum temperature sensor -50 to +400°C', 'Sensors', 89.99, 'PEPPERL-PT100-RTD', 240, '/placeholder.svg?height=300&width=300', 'Pepperl+Fuchs', 'PT100-RTD', 'Temperature Sensor'),

-- Automation & Control
('Siemens PLC S7-1200 CPU', 'Programmable Logic Controller 24 digital I/O', 'Automation', 649.99, 'SIEMENS-S7-1200-CPU', 35, '/placeholder.svg?height=300&width=300', 'Siemens', 'S7-1200', 'PLC'),
('Phoenix Contact Industrial Relay PLUGTRAB', '3-phase surge protector for industrial automation', 'Automation', 249.99, 'PHOENIX-PLUGTRAB-OP', 110, '/placeholder.svg?height=300&width=300', 'Phoenix Contact', 'PLUGTRAB-OP', 'Surge Protector'),
('Eaton Programmable Relay EL-Series', '24VDC 16 I/O programmable relay', 'Automation', 199.99, 'EATON-EL2-16P1C', 80, '/placeholder.svg?height=300&width=300', 'Eaton', 'EL2-16P1C', 'Programmable Relay'),

-- Drive Technology
('Siemens SINAMICS G120 Drive', '1.5kW AC drive 200-240V single phase', 'Drive Technology', 899.99, 'SIEMENS-G120-1.5', 28, '/placeholder.svg?height=300&width=300', 'Siemens', 'G120-1.5', 'Drive Inverter'),
('ABB ACS355 Compact Drive', '3kW compact frequency inverter', 'Drive Technology', 599.99, 'ABB-ACS355-03', 45, '/placeholder.svg?height=300&width=300', 'ABB', 'ACS355-03', 'Frequency Converter'),

-- Pneumatics
('Festo DGC Compact Cylinder', 'Double-acting cylinder 25x200mm', 'Pneumatics', 89.99, 'FESTO-DGC-25x200', 280, '/placeholder.svg?height=300&width=300', 'Festo', 'DGC-25x200', 'Pneumatic Cylinder'),
('SMC Solenoid Valve', '5/3 pilot-operated solenoid valve 24VDC', 'Pneumatics', 149.99, 'SMC-SY3140', 190, '/placeholder.svg?height=300&width=300', 'SMC', 'SY3140', 'Solenoid Valve'),
('Norgren Rotary Actuator', 'Spring-return rotary actuator 90°', 'Pneumatics', 199.99, 'NORGREN-RA95', 75, '/placeholder.svg?height=300&width=300', 'Norgren', 'RA95', 'Rotary Actuator'),

-- Valves
('Bosch Rexroth Directional Valve', '4/3 proportional directional control valve', 'Valves', 599.99, 'REXROTH-4WRPE-10-W130', 42, '/placeholder.svg?height=300&width=300', 'Bosch Rexroth', '4WRPE-10-W130', 'Directional Valve'),
('Parker Hydraulic Pressure Relief Valve', 'Direct-acting relief valve 210 bar', 'Valves', 399.99, 'PARKER-RV-210', 65, '/placeholder.svg?height=300&width=300', 'Parker', 'RV-210', 'Relief Valve'),
('Eaton Check Valve CVH', 'Poppet check valve for hydraulic systems', 'Valves', 129.99, 'EATON-CVH-06', 150, '/placeholder.svg?height=300&width=300', 'Eaton', 'CVH-06', 'Check Valve'),

-- Additional parts
('Schaeffler Linear Bearing', 'Recirculating ball bearing unit 20x35mm', 'Automation', 79.99, 'SCHAEFFLER-LFR50', 200, '/placeholder.svg?height=300&width=300', 'Schaeffler', 'LFR50', 'Linear Bearing'),
('Hawe Pilot-Operated Check Valve', 'Pilot ratio 1:4, max pressure 280 bar', 'Valves', 299.99, 'HAWE-SL1-6', 88, '/placeholder.svg?height=300&width=300', 'Hawe', 'SL1-6', 'Pilot Check Valve'),
('Leuze Photoelectric Sensor', 'Background-suppressed sensor 100mm range', 'Sensors', 219.99, 'LEUZE-BCL-M150', 110, '/placeholder.svg?height=300&width=300', 'Leuze', 'BCL-M150', 'Photoelectric Sensor'),
('Turck Inductive Sensor', 'M18 inductive switch connector type', 'Sensors', 89.99, 'TURCK-TBEN-S2-4IOL', 165, '/placeholder.svg?height=300&width=300', 'Turck', 'TBEN-S2-4IOL', 'Inductive Proximity Sensor');
