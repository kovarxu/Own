#!/usr/bin/env python
#coding:utf8

import re

def is_isbn(q):
  q = q.strip()
  isbn_reg = r'\d{13}$|[\d\-]{10}$'
  if re.match(isbn_reg, q):
    return True
  else:
    return False
