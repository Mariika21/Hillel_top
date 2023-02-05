from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
import time
import os
def test_Guest_Login():
    absolute_path = os.path.dirname(__file__)
    relative_path = "/"
    full_path = os.path.join(absolute_path, relative_path)
    options = Options()
    options.add_argument("--no-sandbox")
    driver = webdriver.Chrome(service=Service(full_path+'\\drivers\chromedriver.exe'), options=options)
    user = "guest"
    password = "welcome2qauto"
    driver.get("https://"+user+":"+password+"@"+"qauto2.forstudy.space/")
    time.sleep(2)
    goButton = driver.find_element(By.CSS_SELECTOR, "button[class*='gue']")
    goButton.send_keys("Selenium")
    goButton.click()
    driver.close()