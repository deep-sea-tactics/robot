import glob
import time
 
base_dir = '/sys/bus/w1/devices/'
device_folder_tempInside = glob.glob(base_dir + '28-01191ef7fc74')[0]
device_folder_tempOutside = glob.glob(base_dir + '28-01191ef2fadd')[0]
device_file_tempInside = device_folder_tempInside + '/w1_slave'
device_file_tempOutside = device_folder_tempOutside + '/w1_slave'
 
def read_temp_raw_Inside():
    f = open(device_file_tempInside, 'r') 
    lines = f.readlines()
    f.close()
    return lines
 
def read_temp_Inside():
    lines = read_temp_raw_Inside()
    while lines[0].strip()[-3:] != 'YES':
        time.sleep(0.2)
        lines = read_temp_raw_Inside()
    equals_pos = lines[1].find('t=')
    if equals_pos != -1:
        temp_string = lines[1][equals_pos+2:]
        temp_c = float(temp_string) / 1000.0
        temp_f = temp_c * 9.0 / 5.0 + 32.0
        return temp_f
        
def read_temp_raw_Outside():
    f = open(device_file_tempOutside, 'r')
    lines = f.readlines()
    f.close()
    return lines
 
def read_temp_Outside():
    lines = read_temp_raw_Outside()
    while lines[0].strip()[-3:] != 'YES':
        time.sleep(0.2)
        lines = read_temp_raw_Outside()
    equals_pos = lines[1].find('t=')
    if equals_pos != -1:
        temp_string = lines[1][equals_pos+2:]
        temp_c = float(temp_string) / 1000.0
        temp_f = temp_c * 9.0 / 5.0 + 32.0
        return temp_f
'''     
while True:
    #print("Sys", read_temp_Inside(), "Water", read_temp_Outside())
    #first value is the system temperature and the second is the water temperature
    print(read_temp_Inside(), read_temp_Outside())
    time.sleep(1)
'''

        
