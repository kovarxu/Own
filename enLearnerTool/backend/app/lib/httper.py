#!/usr/bin/env python
#coding:utf8

# 发送http请求
# urllib自带
# requests包更好用

# from urllib import request
import requests

# 在python3中类不写也继承自object, python2中有经典类和新式类的概念
class HTTP:
  # 此处使用staticmethod, 也可以使用classmethod装饰器, 但是第一个参数为cls
  @staticmethod
  def get(url, return_json=True):
    r = requests.get(url)
    # restful json
    if r.status_code == 200:
      return r.json() if return_json else r.text
    else:
      return {} if return_json else ''

