# -*- coding: utf-8 -*-
import os
import json

import scrapy


class OfferSpider(scrapy.Spider):
    name = 'offer'
    allowed_domains = ['zapisy.ii.uni.wroc.pl']
    start_urls = ['https://zapisy.ii.uni.wroc.pl/offer/']

    custom_settings = {
        'FEED_URI': os.path.join(os.path.dirname(__file__), '..', 'output', 'offer.json')
    }

    def parse_details(self, course):
        def parse(response):
            yield {
                **course,
                'ects': response.css('#table-info > tbody > tr:nth-child(7) > td::text').get().strip(),
                'hours': response.css('#hours span::text').getall(),
                'exam': response.css('#table-info > tbody > tr:nth-child(9) > td::text').get()
            }

        return parse

    def parse(self, response):
        courses_data = json.loads(response.css('#courses-data::text').get())
        for course in courses_data:
            url = course.get('url')
            yield scrapy.Request(url=response.urljoin(url), callback=self.parse_details(course), dont_filter=True)
