from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
import time
options = Options()
options.add_argument("--no-sandbox")
driver = webdriver.Chrome(service=Service('/home/dima/Завантаження/Hillel/chromedriver'), options=options)
user = "guest"
password = "welcome2qauto"
driver.get("https://"+user+":"+password+"@"+"qauto2.forstudy.space/")
time.sleep(2)
goButton = driver.find_element(By.XPATH, "//*[contains(text(), 'Guest log in')]")
goButton.click()
goButton = driver.find_element(By.XPATH, "(//a[contains(text(),'Fuel expenses')])[3]")
goButton.click()
