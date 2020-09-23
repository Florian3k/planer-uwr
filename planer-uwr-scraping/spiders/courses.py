# -*- coding: utf-8 -*-
import os
import json

import scrapy


class CoursesSpider(scrapy.Spider):
    name = 'courses'
    allowed_domains = ['zapisy.ii.uni.wroc.pl']
    start_urls = ['https://zapisy.ii.uni.wroc.pl/courses/']

    custom_settings = {
        'FEED_URI': os.path.join(os.path.dirname(__file__), '..', 'output', 'courses.json')
    }

    def parse_details(self, course, semester):
        def parse(response):
            yield {
                **course,
                'ects': response.css('#table-info > tbody > tr:nth-child(5) > td::text').get().strip(),
                'hours': response.css('#hours span::text').getall(),
                'exam': response.css('#table-info > tbody > tr:nth-child(7) > td::text').get(),
                'semester': semester
            }

        return parse

    def parse_semester(self, semester):
        def parse(response):
            courses_data = json.loads(response.css('#courses-data::text').get())
            for course in courses_data:
                url = course.get('url')
                yield scrapy.Request(url=response.urljoin(url), callback=self.parse_details(course, semester),
                                     dont_filter=True)

        return parse

    def parse(self, response):
        semesters = [{'url': sem.css('::attr(href)').get(), 'name': sem.css('::text').get()} for sem in
                     response.css('#sidebar-inner > div > div > div > a')]
        for sem in semesters:
            yield scrapy.Request(url=response.urljoin(sem['url']), callback=self.parse_semester(sem['name']),
                                 dont_filter=True)
