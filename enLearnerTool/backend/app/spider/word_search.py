#!/usr/bin/env python
#coding:utf8

# 获取书籍信息
from app.lib.httper import HTTP
# 当前活动app对象
from flask import current_app

# 在python3中类不写也继承自object, python2中有经典类和新式类的概念
class WordSearch:
  # 模型层 MVC M层
  # http://fanyi.youdao.com/translate?&doctype=json&type=AUTO&i=deed
  word_search_base_url = 'http://fanyi.youdao.com/translate?&doctype=json&type=AUTO&i={}'

  # 都是classmethod或者staticmethod，封装做的不好
  # 实例方法不是直接返回某些东西，而是修改实例的状态
  def __init__(self, *args, **kwargs):
    self.src = ''
    self.type = ''
    self.error_code = 0
    self.elapsed_time = 0
    self.src = ''
    self.tgt = ''

  def search(self, src):
    result = HTTP.get(self.word_search_base_url.format(src))
    if result:
      self._fill(src, result)
  
  def _fill(self, src, result):
    self.src = src
    self.type = result['type']
    self.error_code = result['errorCode']
    self.elapsed_time = result['elapsedTime']
    if result['translateResult']:
      self.tgt = result['translateResult'][0][0]['tgt']
