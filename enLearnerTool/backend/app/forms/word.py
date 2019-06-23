#!/usr/bin/env python
#coding:utf8

# 导入wtforms的自动检测功能
from wtforms import Form, StringField
from wtforms.validators import Length, DataRequired

class WordForm(Form):
  # 可传入多个验证条件
  word = StringField(validators=[DataRequired(), Length(min=1, max=30)])
