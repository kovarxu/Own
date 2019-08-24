#!/usr/bin/env python
#coding:utf8

from flask import Blueprint

# 指定蓝图名称和所在的模块名
web = Blueprint('web', __name__)

# 要导入才会被执行
from app.web import word
