import os

from scrapy.settings import Settings
from scrapy.crawler import CrawlerProcess

from spiders.courses import CoursesSpider
from spiders.offer import OfferSpider

if __name__ == '__main__':
    basedir = os.path.dirname(__file__)
    if not os.path.exists(os.path.join(basedir, 'output')):
        os.makedirs(os.path.join(basedir, 'output'))

    process = CrawlerProcess(settings=Settings({
        'LOG_LEVEL': 'ERROR',
        'FEED_FORMAT': 'json',
        'COOKIES_ENABLED': False,
        'ROBOTSTXT_OBEY': False,
        'USER_AGENT': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) ' +
                      'Chrome/85.0.4183.102 Safari/537.36'
    }))

    process.crawl(OfferSpider)
    process.crawl(CoursesSpider)

    process.start()
