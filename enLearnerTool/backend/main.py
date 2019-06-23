#!/usr/bin/env python
#coding:utf8

from app import create_app

__author__ = 'kovar'

app = create_app()

from app.web import word

if __name__ == '__main__':
  app.run(debug=True, host='0.0.0.0', port='8881')
