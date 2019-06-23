#!/usr/bin/env python
#coding:utf8

class StdWord:
  def __init__(self):
    self.src = ''
    self.meaning = ''

  def fill_from(self, data):
    self.src = data.src
    self.meaning = data.tgt