import requests
from os.path import dirname, abspath, join
from bs4 import BeautifulSoup
url_base = "https://commons.wikimedia.org/wiki/File:Chess_"
array = ['k', 'q', 'n', 'b', 'r', 'p']
colors = ['l', 'd'] # white and black pieces
dir = dirname(abspath(__file__))
def get_images(color):
    for i in range(len(array)):
        url = url_base + array[i] + colors[color] + "t45.svg"
        r = requests.get(url).text
        soup = BeautifulSoup(r, 'lxml')
        soup.prettify()
        small_img_url = soup.find('a', {'class' : 'mw-thumbnail-link'}).get('href')
        image_url = small_img_url.replace("45px", "200px")
        r2 = requests.get(image_url)
        num = (i + 1) if (color == 0) else (i + 7)
        open(join(dir, 'Chess_Sprite_'+  str(num) + '.png'), 'wb').write(r2.content)
        
        
get_images(0)
get_images(1)