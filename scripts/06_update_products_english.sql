-- Delete old German/mixed products and replace with comprehensive English product catalog

-- First, clear existing products
DELETE FROM products;

-- Insert comprehensive English products sorted by type
-- AUTOMATION PRODUCTS
INSERT INTO products (name, description, category, product_type, company_name, model, price, sku, stock_quantity, image_url) VALUES
('Siemens S7-1200 PLC', 'Programmable Logic Controller for automation systems', 'Automation', 'Automation', 'Siemens', 'S7-1200', 1899.99, 'AUTO-SIEM-001', 25, '/placeholder.svg?height=300&width=300'),
('Schneider Electric Modular PLC', 'Compact modular programmable controller', 'Automation', 'Automation', 'Schneider Electric', 'M241', 1299.99, 'AUTO-SCHN-001', 18, '/placeholder.svg?height=300&width=300'),
('Allen-Bradley CompactLogix', 'Flexible and scalable industrial automation controller', 'Automation', 'Automation', 'Allen-Bradley', 'L16ER', 999.99, 'AUTO-ABB-001', 22, '/placeholder.svg?height=300&width=300'),
('Beckhoff Embedded PC', 'Industrial PC for modular machine architecture', 'Automation', 'Automation', 'Beckhoff', 'C6030', 2499.99, 'AUTO-BECK-001', 12, '/placeholder.svg?height=300&width=300'),

-- SERVO MOTORS
('Siemens SINAMICS S120 Servo Drive', 'Advanced servo drive for precise motion control', 'Motors', 'Servo Motors', 'Siemens', 'S120', 3499.99, 'SERVO-SIEM-001', 15, '/placeholder.svg?height=300&width=300'),
('Yaskawa Sigma-7 Servo Motor', 'High-performance servo motor for industrial automation', 'Motors', 'Servo Motors', 'Yaskawa', 'SGMAV-13A', 2199.99, 'SERVO-YASK-001', 20, '/placeholder.svg?height=300&width=300'),
('Bosch Rexroth IndraMotion MLC', 'Integrated motion controller with servo performance', 'Motors', 'Servo Motors', 'Bosch Rexroth', 'MLC', 2899.99, 'SERVO-ROTH-001', 14, '/placeholder.svg?height=300&width=300'),
('ABB IRB 6700 Servo Motor', 'Industrial robot servo motor unit', 'Motors', 'Servo Motors', 'ABB', 'IRB-6700', 1799.99, 'SERVO-ABB-001', 11, '/placeholder.svg?height=300&width=300'),

-- SENSORS
('Sick DFS60 Encoder', 'Incremental rotary encoder for position detection', 'Sensors', 'Sensors', 'Sick', 'DFS60-B10E60000', 299.99, 'SENS-SICK-001', 85, '/placeholder.svg?height=300&width=300'),
('Balluff BTL Absolute Encoder', 'Absolute position sensor with analog output', 'Sensors', 'Sensors', 'Balluff', 'BTL5-E10-405-Z033', 399.99, 'SENS-BALL-001', 72, '/placeholder.svg?height=300&width=300'),
('Temposonics Absolute Position Sensor', 'Non-contact linear position transducer', 'Sensors', 'Sensors', 'Temposonics', 'R-Series', 449.99, 'SENS-TEMP-001', 68, '/placeholder.svg?height=300&width=300'),
('IFM Proximity Sensor', 'Inductive proximity switch for metal detection', 'Sensors', 'Sensors', 'ifm electronic', 'IBN254', 149.99, 'SENS-IFM-001', 150, '/placeholder.svg?height=300&width=300'),
('Festo Pressure Sensor', 'Digital pressure transmitter with IO-Link', 'Sensors', 'Sensors', 'Festo', 'SPAW', 349.99, 'SENS-FEST-001', 95, '/placeholder.svg?height=300&width=300'),

-- DRIVE TECHNOLOGY
('Siemens SINAMICS G120 Frequency Converter', 'Variable frequency drive for 3-phase AC motors', 'Drive Technology', 'Drive Technology', 'Siemens', 'G120', 1599.99, 'DRIV-SIEM-001', 28, '/placeholder.svg?height=300&width=300'),
('Bosch Rexroth A4VSO Axial Piston Pump', 'Variable displacement pump for hydraulic systems', 'Drive Technology', 'Drive Technology', 'Bosch Rexroth', 'A4VSO', 2899.99, 'DRIV-ROTH-001', 16, '/placeholder.svg?height=300&width=300'),
('Danfoss VLT Automation Drive', 'Industrial frequency converter for AC motor control', 'Drive Technology', 'Drive Technology', 'Danfoss', 'VLT-Automation', 1299.99, 'DRIV-DANF-001', 21, '/placeholder.svg?height=300&width=300'),
('Leuze Encoder with Drive Interface', 'Encoder system compatible with drive technology', 'Drive Technology', 'Drive Technology', 'Leuze', 'PROFINET', 599.99, 'DRIV-LEUZ-001', 42, '/placeholder.svg?height=300&width=300'),

-- PNEUMATICS
('Festo DGCI Double-Acting Cylinder', 'Compact double-acting pneumatic cylinder', 'Pneumatics', 'Pneumatics', 'Festo', 'DGCI-25-50-PPV', 189.99, 'PNEU-FEST-001', 120, '/placeholder.svg?height=300&width=300'),
('SMC Pneumatic Valve Manifold', 'Compact integrated valve stack for pneumatic control', 'Pneumatics', 'Pneumatics', 'SMC', 'VK3000', 799.99, 'PNEU-SMC-001', 35, '/placeholder.svg?height=300&width=300'),
('Camozzi Pneumatic Solenoid Valve', 'Direct solenoid pneumatic control valve', 'Pneumatics', 'Pneumatics', 'Camozzi', '357-010', 249.99, 'PNEU-CAMO-001', 98, '/placeholder.svg?height=300&width=300'),
('Norgren Pressure Regulator', 'Industrial pneumatic pressure control unit', 'Pneumatics', 'Pneumatics', 'Norgren', 'R16-200-RNAG', 179.99, 'PNEU-NORG-001', 145, '/placeholder.svg?height=300&width=300'),
('Air Filter Cartridge', 'Replacement filter for pneumatic systems', 'Pneumatics', 'Pneumatics', 'Generic', 'AF100', 59.99, 'PNEU-FILT-001', 280, '/placeholder.svg?height=300&width=300'),

-- BALL BEARINGS
('SKF Deep Groove Ball Bearing', 'High-precision deep groove ball bearing 6308', 'Bearings', 'Ball-Bearing', 'SKF', '6308-2Z', 149.99, 'BEAR-SKF-001', 200, '/placeholder.svg?height=300&width=300'),
('FAG/Schaeffler Rolling Bearing', 'Angular contact ball bearing 7006C', 'Bearings', 'Ball-Bearing', 'Schaeffler', '7006C', 199.99, 'BEAR-FAG-001', 165, '/placeholder.svg?height=300&width=300'),
('NSK Deep Groove Bearing', 'Precision bearing 6204-2RS for industrial use', 'Bearings', 'Ball-Bearing', 'NSK', '6204-2RS', 89.99, 'BEAR-NSK-001', 300, '/placeholder.svg?height=300&width=300'),
('INA Four-Point Ball Bearing', 'Slewing ring bearing for heavy-duty applications', 'Bearings', 'Ball-Bearing', 'INA', 'SX011860', 4999.99, 'BEAR-INA-001', 8, '/placeholder.svg?height=300&width=300'),
('Timken Tapered Roller Bearing', 'Precision tapered roller bearing set', 'Bearings', 'Ball-Bearing', 'Timken', '387A/382D', 259.99, 'BEAR-TIME-001', 78, '/placeholder.svg?height=300&width=300'),

-- PUMPS
('Bosch Rexroth Gear Pump', 'External gear pump for fluid power transmission', 'Pumps', 'Pumps', 'Bosch Rexroth', 'BGP-01', 1299.99, 'PUMP-ROTH-001', 22, '/placeholder.svg?height=300&width=300'),
('Eaton Hydraulic Pump', 'Variable displacement pump for industrial hydraulics', 'Pumps', 'Pumps', 'Eaton', 'PVH57', 3199.99, 'PUMP-EATON-001', 14, '/placeholder.svg?height=300&width=300'),
('Parker Hannifin Gear Pump', 'Compact axial piston pump for mobile applications', 'Pumps', 'Pumps', 'Parker Hannifin', 'PGP100', 2499.99, 'PUMP-PARK-001', 18, '/placeholder.svg?height=300&width=300'),
('Linde Hydraulic Pump', 'Industrial hydraulic pump unit', 'Pumps', 'Pumps', 'Linde', 'HMV-01', 1699.99, 'PUMP-LINDE-001', 20, '/placeholder.svg?height=300&width=300'),
('Vickers Gear Pump', 'Precision gear pump for fluid control', 'Pumps', 'Pumps', 'Vickers', 'PVQ10', 899.99, 'PUMP-VICK-001', 45, '/placeholder.svg?height=300&width=300'),

-- VALVES
('Bosch Rexroth Directional Control Valve', '4/3 proportional directional control valve', 'Valves', 'Valves', 'Bosch Rexroth', '4WRPE-W', 1899.99, 'VALV-ROTH-001', 19, '/placeholder.svg?height=300&width=300'),
('Eaton Proportional Directional Valve', 'Electrohydraulic proportional valve', 'Valves', 'Valves', 'Eaton', 'NG10', 2199.99, 'VALV-EATON-001', 16, '/placeholder.svg?height=300&width=300'),
('Parker Pressure Relief Valve', 'Direct-acting pressure control valve', 'Valves', 'Valves', 'Parker Hannifin', 'PRV-10', 549.99, 'VALV-PARK-001', 65, '/placeholder.svg?height=300&width=300'),
('Hydac Pressure Filter with Valve', 'Integrated pressure filter and relief valve', 'Valves', 'Valves', 'Hydac', 'RFBM-HR', 799.99, 'VALV-HYDAC-001', 42, '/placeholder.svg?height=300&width=300'),
('Moog Servo Valve', 'High-performance servo directional control valve', 'Valves', 'Valves', 'Moog Inc', 'D663', 3999.99, 'VALV-MOOG-001', 9, '/placeholder.svg?height=300&width=300');
