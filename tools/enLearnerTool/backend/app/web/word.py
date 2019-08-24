#!/usr/bin/env python
#coding:utf8

from flask import jsonify, request
from flask_cors import cross_origin
from app.spider.word_search import WordSearch
from app.view_model.word import StdWord
from app.forms.word import WordForm
import json
# 蓝图定义在init文件中，导入蓝图
# http://fanyi.youdao.com/translate?&doctype=json&type=AUTO&i=deed
from . import web

@web.route('/search')
@cross_origin()
def search():
  form = WordForm(request.args)
  std_word = StdWord()

  if form.validate():
    word = form.word.data # 可以取到默认值
    wsearch = WordSearch()

    wsearch.search(word)
    std_word.fill_from(wsearch)

    return json.dumps(std_word, default=lambda o: o.__dict__)
  else:
    # form的errors包含错误的验证信息
    return jsonify(form.errors)
