#!/usr/bin/env python
#coding:utf8

from flask import Flask
# from app.models.book import db

def create_app():
  app = Flask(__name__)
  app.config.from_object('app.secure')
  app.config.from_object('app.setting')
  reg_bp(app)

  # 数据库初始化和同步
  # db.init_app(app)
  # db.create_all(app=app)
  return app

def reg_bp(app):
  # from app.web.book import web
  # app.register_blueprint(web)
  from app.web import web
  app.register_blueprint(web)
